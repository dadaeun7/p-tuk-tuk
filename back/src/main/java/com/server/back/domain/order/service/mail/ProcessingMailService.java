package com.server.back.domain.order.service.mail;

import java.time.LocalDate;

import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import com.server.back.application.port.LoadMailPort;
import com.server.back.application.service.NotificationService;
import com.server.back.domain.email.entity.ProcessedEmail;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class ProcessingMailService {

    private final LoadMailPort loadMailPort;
    private final ProcessedMailEventListner processedMailEventListner;
    private final NotificationService notificationService;

    @Async
    public void processMailToSave(Long pkId, String myId, LocalDate start, LocalDate end) {

        notificationService.sendNotification(pkId, "startBringMail", "메일 연동 및 처리중에 있습니다");

        List<ProcessedEmail> allEmailList = loadMailPort.loadMails(myId, start, end);

        if (allEmailList.isEmpty() || allEmailList == null) {
            String message = allEmailList.isEmpty() ? "해당 기간에 조회되는 메일이 없습니다" : "Gmail 결과값이 없습니다. 관리자에게 문의하세요";
            notificationService.sendNotification(pkId, "bringToMailError", message);
        }

        processedMailEventListner.handleProcessedMailEventCompleted(allEmailList);

    }
}