package com.server.back.web.controller;

import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.server.back.application.service.EmailConfirm;
import com.server.back.application.service.EmailVerificationService;
import com.server.back.web.dto.LocalJoinEmailCodeVerifyReq;
import com.server.back.web.dto.LocalJoinEmailSendCodeReq;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/join")
@RequiredArgsConstructor
public class EmailVerficationController {

    private final EmailVerificationService evs;
    private final EmailConfirm ec;

    @ExceptionHandler(IllegalStateException.class)
    public ResponseEntity<String> handleIllegalState(IllegalStateException e) {
        return ResponseEntity.badRequest().body(e.getMessage());
    }

    @PostMapping("/email-send")
    public Map<String, Object> sendToEmailCode(@Valid @RequestBody LocalJoinEmailSendCodeReq req) {
        ec.confirmEmail(req.email());
        return Map.of("ok", true);
    }

    @PostMapping("/code-send")
    public Map<String, Object> sendCodeVerfiy(@Valid @RequestBody LocalJoinEmailCodeVerifyReq req) {
        evs.verifyCode(req.email(), req.code());
        return Map.of("success", true);

    }
}
