package com.server.back.web.controller;

import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.server.back.domain.order.service.mail.ProcessingMailService;
import com.server.back.infrastructure.security.TukUserDetails;
import com.server.back.web.dto.GetBringMailReq;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequiredArgsConstructor
public class GmailToOrderController {

    private final ProcessingMailService processingMailService;

    @PostMapping("/bring/gmail")
    public ResponseEntity<?> getBringMail(
            @AuthenticationPrincipal TukUserDetails userDetails,
            @RequestBody GetBringMailReq req) {

        processingMailService.processMailToSave(userDetails.getId(), userDetails.getName(), req.start(), req.end());
        return ResponseEntity.accepted().body(Map.of("message", "메일 가져오기를 시작했습니다"));
    }
}
