package com.server.back.web.controller;

import org.springframework.http.MediaType;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import com.server.back.application.service.NotificationService;
import com.server.back.infrastructure.security.TukUserDetails;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;

    @GetMapping(value = "/notification/subcribe", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public SseEmitter subcribe(@AuthenticationPrincipal TukUserDetails userDetails) {
        if (userDetails == null) {
            log.info("인증되지 않은 사용자는 처리할 수 없습니다");
            return null;
        }
        return notificationService.subcribe(userDetails.getId());
    }
}
