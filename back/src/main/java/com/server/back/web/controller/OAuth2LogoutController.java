package com.server.back.web.controller;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.TimeUnit;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.client.OAuth2AuthorizedClient;
import org.springframework.security.oauth2.client.OAuth2AuthorizedClientService;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.reactive.function.client.WebClient;

import com.server.back.infrastructure.security.JwtTokenProvider;

import jakarta.servlet.http.Cookie;
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

        jwtAccessTokenLogout(accessToken);

        Map<String, String> responseBody = new HashMap<>();

        log.info("### Authentication object: {}", authentication);

        if (authentication instanceof OAuth2AuthenticationToken) {
            OAuth2AuthenticationToken oauth2Token = (OAuth2AuthenticationToken) authentication;
            String registrationId = oauth2Token.getAuthorizedClientRegistrationId();

            String logoutUrl;
            switch (registrationId.toLowerCase()) {
                case "kakao":

                    logoutUrl = "https://kauth.kakao.com/oauth/logout?client_id=" + kakaoClientId
                            + "&logout_redirect_uri="
                            + logoutRedirectUri;

                    responseBody.put("socialLogoutUrl", logoutUrl);
                    break;

                case "naver":
                    String naverAccessToken = inValiededNaverToken(oauth2Token);
                    String url = "https://nid.naver.com/oauth2.0/token?grant_type=delete&client_id=" +
                            naverClientId + "&client_secret=" + naverClientSecret + "&access_token=" +
                            naverAccessToken;

                    WebClient webClient = WebClient.create();

                    try {
                        String naverSend = webClient.get().uri(url).retrieve().bodyToMono(String.class).block();
                        log.info("네이버 토큰 무효화 응답 " + naverSend);

                    } catch (Exception e) {
                        log.error("네이버 토큰 무효화 실패" + e.getMessage());
                    }

                    break;

                default:
                    return ResponseEntity.badRequest().build();

            }
        }
        // ===================== [ 브라우저 Cookie 초기화 ] =====================
        Cookie cookie = new Cookie("accessToken", null);
        cookie.setMaxAge(0);
        cookie.setHttpOnly(true);
        cookie.setPath("/");

        response.addCookie(cookie);

        return ResponseEntity.ok(responseBody);

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

    private String inValiededNaverToken(OAuth2AuthenticationToken oauth2Token) {
        String registrationId = oauth2Token.getAuthorizedClientRegistrationId();
        String principalName = oauth2Token.getName();

        OAuth2AuthorizedClient authorizedClient = authorizedClientService.loadAuthorizedClient(registrationId,
                principalName);

        if (authorizedClient == null || authorizedClient.getAccessToken() == null) {
            throw new IllegalStateException("Access token 이 없습니다.");
        }

        return authorizedClient.getAccessToken().getTokenValue();
    }
}
