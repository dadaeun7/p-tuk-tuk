package com.server.back.web.controller;

import java.io.IOException;
import java.util.Map;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.google.api.client.googleapis.auth.oauth2.GoogleAuthorizationCodeFlow;
import com.server.back.application.service.GoogleAuthService;
import com.server.back.infrastructure.security.TukUserDetails;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequiredArgsConstructor
public class GoogleAuthController {

    private final GoogleAuthorizationCodeFlow googleAuthorizationCodeFlow;
    private final GoogleAuthService googleAuthService;

    @GetMapping("/google/connect/auth")
    public ResponseEntity<Map<String, String>> getAuthorizationUrl(
            @AuthenticationPrincipal TukUserDetails userDetails) {

        if (userDetails == null) {
            throw new IllegalStateException("로그인이 필요합니다.");
        }

        String state = UUID.randomUUID().toString();

        String url = googleAuthorizationCodeFlow.newAuthorizationUrl()
                .setRedirectUri("https://beneficial-love-production.up.railway.app/my-page/google/auth/callback")
                .setState(state)
                .setAccessType("offline")
                .setApprovalPrompt("force")
                .build();

        log.info(url);

        return ResponseEntity.ok(Map.of("url", url));
    }

    @GetMapping("/login/oauth2/code/google")
    public ResponseEntity<?> processCallback(@RequestParam("code") String code,
            @AuthenticationPrincipal TukUserDetails userDetails)
            throws IOException {

        if (userDetails == null) {
            throw new IllegalArgumentException("유효하지 않은 접근입니다");
        }

        String modifyGmail = googleAuthService.connectGoogleAcount(userDetails.getId(), code);

        return ResponseEntity.ok(Map.of("gmail", modifyGmail));
    }

    @DeleteMapping("/google/unconnect/auth")
    public ResponseEntity<?> googleUnConnect(@AuthenticationPrincipal TukUserDetails userDetails) {

        if (userDetails == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not authenticated");
        }

        googleAuthService.unconnectGoogle(userDetails.getUsername());
        return ResponseEntity.ok(Map.of("message", "구글 연동 해제 완료"));

    }
}
