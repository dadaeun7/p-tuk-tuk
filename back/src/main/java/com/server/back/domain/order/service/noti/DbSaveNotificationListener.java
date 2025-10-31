package com.server.back.domain.order.service.noti;

import org.springframework.stereotype.Component;
import org.springframework.transaction.event.TransactionPhase;
import org.springframework.transaction.event.TransactionalEventListener;

import com.server.back.application.service.NotificationService;
import com.server.back.domain.order.dto.DbSaveSuccedDto;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class DbSaveNotificationListener {

    private final NotificationService notificationService;

    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    public void dbSaveSuccedNotification(DbSaveSuccedDto dto) {
        notificationService.sendNotification(dto.userId(), dto.event(), dto.meesage());
    }
}
