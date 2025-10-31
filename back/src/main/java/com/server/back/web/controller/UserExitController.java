package com.server.back.web.controller;

import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

import com.server.back.application.service.GoogleAuthService;
import com.server.back.application.service.LocalLoginService;
import com.server.back.application.service.UserExitService;
import com.server.back.infrastructure.security.JwtTokenProvider;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequiredArgsConstructor
public class UserExitController {

    private final JwtTokenProvider jwtTokenProvider;
    private final GoogleAuthService googleAuthService;
    private final UserExitService userExitService;
    private final LocalLoginService localLoginService;

    @PostMapping("/exit")
    public ResponseEntity<?> localExitSubmit(@CookieValue(name = "accessToken", required = false) String accessToken,
            HttpServletResponse response) {

        String userMyId = jwtTokenProvider.getUserEmail(accessToken);

        googleAuthService.unconnectGoogle(userMyId);
        localLoginService.logout(accessToken, userMyId);
        userExitService.localExit(userMyId);

        Cookie cookie = new Cookie(accessToken, null);
        cookie.setMaxAge(0);
        cookie.setHttpOnly(true);
        cookie.setPath("/");

        response.addCookie(cookie);
        return ResponseEntity.ok(Map.of("message", "정상적으로 탈퇴 되었습니다."));
    }
}
