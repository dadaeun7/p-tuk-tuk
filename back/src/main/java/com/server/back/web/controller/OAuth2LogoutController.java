package com.server.back.web.controller;

import java.util.Date;
import java.util.Map;
import java.util.concurrent.TimeUnit;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.client.OAuth2AuthorizedClientService;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

import com.server.back.infrastructure.security.JwtTokenProvider;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequiredArgsConstructor
public class OAuth2LogoutController {

    private final OAuth2AuthorizedClientService authorizedClientService;
    @Qualifier("stringRedisTemplate")
    private final StringRedisTemplate redis;
    private final JwtTokenProvider jwtTokenProvider;

    @Value("${spring.security.oauth2.client.registration.kakao.client-id}")
    private String kakaoClientId;

    @Value("${spring.security.oauth2.client.registration.naver.client-id}")
    private String naverClientId;

    @Value("${spring.security.oauth2.client.registration.naver.client-secret}")
    private String naverClientSecret;

    @Value("$app.oauth.logout-redirect-uri")
    private String logoutRedirectUri;

    @PostMapping("/local/oauth2/logout")
    public ResponseEntity<Map<String, String>> getLogoutUrl(Authentication authentication,
            @CookieValue(name = "accessToken", required = false) String accessToken,
            HttpServletRequest request,
            HttpServletResponse response) {

        if (accessToken != null) {
            jwtAccessTokenLogout(accessToken);
        }

        log.info("### Authentication object: {}", authentication);

        // ===================== [ 브라우저 Cookie 초기화 ] =====================
        ResponseCookie cookie = ResponseCookie.from("accessToken", "")
                .path("/")
                .maxAge(0)
                .httpOnly(true)
                .secure(true)
                .sameSite("None")
                .domain("beneficial-love-production.up.railway.app")
                .build();

        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());

        return ResponseEntity.ok(Map.of("message", "로그아웃 완료"));

    }

    private void jwtAccessTokenLogout(String accessToken) {

        if (accessToken == null || !jwtTokenProvider.validateToken(accessToken)) {
            log.warn("유효하지 않거나 없는 토큰으로 로그아웃 시도됨.");
            return;
        }

        // ======================= [디버깅 로그 추가] =======================
        try {
            Date expiration = jwtTokenProvider.parseClaims(accessToken).getExpiration(); // 👈 토큰 만료 시간을 Date 객체로 가져오는
                                                                                         // 메소드
            long now = new Date().getTime();
            long remainingTimeMillis = expiration.getTime() - now;

            log.info("============== [로그아웃 토큰 디버깅] ==============");
            log.info("Access Token: {}", accessToken);
            log.info("토큰 만료 시간 (exp): {}", expiration);
            log.info("현재 시간 (now): {}", new Date(now));
            log.info("계산된 남은 시간 (ms): {}", remainingTimeMillis);
            log.info("===================================================");

            if (remainingTimeMillis > 0) {
                // Redis에 블랙리스트로 등록 (남은 시간만큼 TTL 설정)
                redis.opsForValue().set(accessToken, "logout", remainingTimeMillis, TimeUnit.MILLISECONDS);
                log.info("Redis에 토큰을 블랙리스트로 등록했습니다. (TTL: {} ms)", remainingTimeMillis);
            } else {
                log.warn("토큰의 남은 유효시간이 0보다 작아 Redis에 등록하지 않습니다.");
            }
        } catch (Exception e) {
            log.error("로그아웃 처리 중 예외 발생", e);
        }

    }
}
