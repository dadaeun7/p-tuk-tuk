package com.server.back.domain.order.service.ocr;

import java.util.ArrayList;
import java.util.List;

import org.springframework.context.ApplicationEventPublisher;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.server.back.application.service.NotificationService;
import com.server.back.domain.ocr.entity.OcrProduct;
import com.server.back.domain.ocr.entity.ProcessedOcr;
import com.server.back.domain.order.dto.DbSaveSuccedDto;
import com.server.back.domain.order.dto.FinalMatchSubmitDto;
import com.server.back.domain.order.entity.RecycleMatchResult;
import com.server.back.domain.order.entity.RecycleOrder;
import com.server.back.domain.order.service.RecycleMatchingService;
import com.server.back.domain.order.service.transactional.MatchCompositionSave;
import com.server.back.domain.order.service.transactional.RecycleMatchResultSave;
import com.server.back.domain.order.service.transactional.RecycleOrderSave;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
@RequiredArgsConstructor
public class ProcessedOcrToOrderSave {

    private final RecycleOrderSave recycleOrderSave;
    private final RecycleMatchingService recycleMatchingService;
    private final NotificationService notificationService;
    private final MatchCompositionSave matchCompositionSave;
    private final RecycleMatchResultSave recycleMatchResultSave;
    private final ApplicationEventPublisher eventPublisher;

    @Transactional
    @EventListener
    public void handleProcessedOcrToOrder(ProcessedOcr saveOcr) {

        if (saveOcr == null) {
            log.error("처리할 OCR항목이 없습니다");
            return;
        }

        try {

            List<OcrProduct> ocrProducts = saveOcr.getOcrProductList();
            RecycleOrder saveOrder = recycleOrderSave.saveRecycleOrderOcr(saveOcr, ocrProducts);

            List<FinalMatchSubmitDto> dtoList = new ArrayList<>();

            for (OcrProduct ocrProduct : ocrProducts) {

                FinalMatchSubmitDto convertMatchItem = recycleMatchingService
                        .findNextSaveRecycleInfo(ocrProduct.getProductName());

                if (convertMatchItem == null) {
                    log.error("OCR에서 convertMatchItem null 발생");
                    notificationService.sendNotification(saveOcr.getByUser().getId(), "bringToMailError",
                            "OCR 처리 중 오류가 발생했습니다");

                    throw new Exception("OCR 매칭 서비스 통해 DTO 저장 중 에러 발생");
                }

                log.info("convertMatchItem 확인하기" + convertMatchItem);
                dtoList.add(convertMatchItem);
                log.info("dtoList 확인하기" + dtoList);
            }

            RecycleMatchResult saveResult = recycleMatchResultSave.saveMatchResultInitial(dtoList, saveOrder);
            matchCompositionSave.saveMatchItemComposition(saveResult, dtoList);

            DbSaveSuccedDto succedNotificationDto = DbSaveSuccedDto.builder()
                    .userId(saveOcr.getByUser().getId()).event("bringToMailSuceess").meesage("OCR 내용이 모두 처리되었습니다!")
                    .build();
            eventPublisher.publishEvent(succedNotificationDto);

        } catch (Exception e) {
            log.error("handleProcessedOcrToOrder 처리 중 오류가 발생했습니다." + e.getMessage());
        }

    }
}
