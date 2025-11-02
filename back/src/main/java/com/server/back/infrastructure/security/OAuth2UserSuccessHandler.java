package com.server.back.infrastructure.security;

import java.io.IOException;

import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Component
public class OAuth2UserSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    private final JwtTokenProvider jwtTokenProvider;

    public OAuth2UserSuccessHandler(JwtTokenProvider jwtTokenProvider) {
        this.jwtTokenProvider = jwtTokenProvider;
    }

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
            Authentication authentication) throws IOException, ServletException {

        String accessToken = jwtTokenProvider.createToken(authentication);

        log.info("📦onAuthenticationSuccess가 실행되었습니다.");
        ResponseCookie cookie = ResponseCookie.from("accessToken", accessToken)
                .path("/")
                .httpOnly(true)
                .secure(true)
                .sameSite("None")
                .maxAge(60 * 60)
                .build();

        String targetUrl = "https://beneficial-love-production.up.railway.app";

        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());

        /** 바로 session 무효화 */
        if (request.getSession(false) != null) {
            request.getSession().invalidate();
            ;
        }

        getRedirectStrategy().sendRedirect(request, response, targetUrl);
    }

}
