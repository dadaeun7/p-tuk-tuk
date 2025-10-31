package com.server.back.domain.order.service.transactional;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.server.back.application.service.NotificationService;
import com.server.back.domain.order.dto.FinalMatchSubmitDto;
import com.server.back.domain.order.entity.RecycleMatchItem;
import com.server.back.domain.order.entity.RecycleMatchResult;
import com.server.back.domain.order.entity.RecycleOrder;
import com.server.back.infrastructure.jpa.order.repository.RecycleMatchResultRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class RecycleMatchResultSave {

    private final RecycleMatchResultRepository recycleMatchResultRepository;
    private final NotificationService notificationService;

    @Transactional
    public RecycleMatchResult saveMatchResultInitial(List<FinalMatchSubmitDto> dtoList,
            RecycleOrder saveOrder) throws Exception {

        if (dtoList.isEmpty()) {
            log.error("dtoList가 empty로 전달되었습니다");
            return null;
        }
        try {
            RecycleMatchResult result = RecycleMatchResult.create();
            result.initialSet(saveOrder);

            for (FinalMatchSubmitDto dto : dtoList) {
                RecycleMatchItem resultItem = RecycleMatchItem.create();
                resultItem.setMatchName(
                        dto.itemToKeywordDto().itemKeyword(),
                        dto.isAI(),
                        dto.status(),
                        dto.itemToKeywordDto().description());

                result.setMatchItem(resultItem);
            }

            RecycleMatchResult saveResult = recycleMatchResultRepository.save(result);
            return saveResult;

        } catch (Exception e) {
            notificationService.sendNotification(saveOrder.getConnectUser().getId(), "bringToMailError",
                    "메일 처리 중 오류가 발생했습니다");
            log.error("Match Result 저장 중 에러가 발생!" + e);
            return null;
        }

    }
}
