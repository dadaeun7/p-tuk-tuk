package com.server.back.domain.order.service.ocr;

import java.util.List;

import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.server.back.application.service.NotificationService;
import com.server.back.domain.ocr.entity.ProcessedOcr;
import com.server.back.infrastructure.ocr.service.OcrService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class ProcessingOcrService {

    private final OcrService ocrService;
    private final OcrToProductService ocrToProductService;
    private final GcsService gcsService;
    private final OcrToEntityService ocrToEntityService;
    private final ProcessedOcrToOrderSave processedOcrToOrderSave;
    private final NotificationService notificationService;

    @Async
    public void processingHandleOcr(MultipartFile file, Long userId) {

        notificationService.sendNotification(userId, "startBringMail", "OCR 연동 및 처리중에 있습니다");

        try {
            List<String> extractLines = ocrService.detecTextFromJpg(file.getBytes());

            log.info("extractLines 추출: " + extractLines);

            List<String> productList = ocrToProductService.extractProductName(extractLines);

            log.info("productList 추출: " + productList);

            String imgUrl = gcsService.uploadImage(file);

            ProcessedOcr saveOcr = ocrToEntityService.saveOcrToEntity(productList, userId, imgUrl);

            processedOcrToOrderSave.handleProcessedOcrToOrder(saveOcr);

        } catch (Exception e) {
            log.error("실제 OCR 처리 중 발생한 예외 (내부 로깅): ", e);
            log.error("processingHandleOcr 중 에러가 발생했습니다." + e.getMessage());
            notificationService.sendNotification(userId, "bringToMailError", "처리 중 에러가 발생했습니다.");
        }

    }
}
