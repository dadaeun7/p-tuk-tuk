package com.server.back.domain.order.service.mail;

import java.util.ArrayList;
import java.util.List;

import org.springframework.context.ApplicationEventPublisher;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import com.server.back.application.service.NotificationService;
import com.server.back.domain.email.entity.EmailProduct;
import com.server.back.domain.email.entity.ProcessedEmail;
import com.server.back.domain.order.dto.DbSaveSuccedDto;
import com.server.back.domain.order.dto.FinalMatchSubmitDto;
import com.server.back.domain.order.entity.RecycleMatchResult;
import com.server.back.domain.order.entity.RecycleOrder;
import com.server.back.domain.order.service.RecycleMatchingService;
import com.server.back.domain.order.service.transactional.MatchCompositionSave;
import com.server.back.domain.order.service.transactional.RecycleMatchResultSave;
import com.server.back.domain.order.service.transactional.RecycleOrderSave;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Component
@RequiredArgsConstructor
public class ProcessedMailEventListner {

    private final NotificationService notificationService;
    private final ApplicationEventPublisher eventPublisher;
    private final RecycleOrderSave recycleOrderSave;
    private final MatchCompositionSave matchCompositionSave;
    private final RecycleMatchResultSave recycleMatchResultSave;
    private final RecycleMatchingService recycleMatchingService;

    // TODO: for bulk update
    @PersistenceContext
    private EntityManager entityManager;

    @Transactional
    @EventListener
    public void handleProcessedMailEventCompleted(List<ProcessedEmail> allEmailList) {

        if (allEmailList == null || allEmailList.isEmpty()) {
            log.error("처리할 메일이 없습니다");
            return;
        }

        Long user = allEmailList.get(0).getRecipientUser().getId();

        try {
            for (ProcessedEmail email : allEmailList) {
                /* order 1 : 1 result 초기 세팅 */
                RecycleOrder saveOrder = recycleOrderSave.saveRecycleOrder(email, email.getProductList());
                /** item 순회 */

                List<FinalMatchSubmitDto> dtoList = new ArrayList<>();

                for (EmailProduct product : email.getProductList()) {

                    FinalMatchSubmitDto convertMatchItem = recycleMatchingService
                            .findNextSaveRecycleInfo(product.getProductName().replaceAll(" ", "").trim());

                    if (convertMatchItem == null) {

                        log.error("convertMatchItem null");
                        notificationService.sendNotification(saveOrder.getConnectUser().getId(), "bringToMailError",
                                "메일 처리 중 오류가 발생했습니다");

                        throw new Exception("Mail 매칭 서비스 통해 DTO 저장 중 에러 발생");
                    }

                    dtoList.add(convertMatchItem);
                }

                RecycleMatchResult saveResult = recycleMatchResultSave.saveMatchResultInitial(dtoList, saveOrder);
                matchCompositionSave.saveMatchItemComposition(saveResult, dtoList);

            }

            /**
             * 모든 메일 처리 완료
             */
            DbSaveSuccedDto succedNotificationDto = DbSaveSuccedDto.builder()
                    .userId(user).event("bringToMailSuceess").meesage("메일 내용이 모두 처리되었습니다!").build();
            eventPublisher.publishEvent(succedNotificationDto);

        } catch (Exception e) {
            notificationService.sendNotification(user, "bringToMailError", "메일 처리 중 오류가 발생했습니다");
            log.error("[ProcessedMailEventListner] 에러 : " + e);
        }

    }
}
