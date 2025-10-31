package com.server.back.infrastructure.security;

import java.io.IOException;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Lazy;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtTokenProvider jtp;

    @Lazy
    private final AuthenticationManager authenticationManager;
    private final TukUserDetailService userDetailService;

    @Qualifier("stringRedisTemplate")
    private final StringRedisTemplate redis;

    @Override
    protected void doFilterInternal(@NonNull HttpServletRequest request, @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain)
            throws ServletException, IOException {

        String token = resolveTokenFromCookie(request);

        /** accessToken 만료됨 */
        if (token == null) {

            filterChain.doFilter(request, response);
            return;
        }

        if (token != null && jtp.validateToken(token)) {

            if (!jtp.isTokenBlackListCheck(token)) {

                Authentication auth = jtp.getAuthenticator(token);
                SecurityContextHolder.getContext().setAuthentication(auth);

            } else {
                SecurityContextHolder.clearContext();
                log.error("로그아웃 된 토큰입니다.");
                response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "로그아웃 된 토큰입니다.");
                return;
            }

        }

        filterChain.doFilter(request, response);
    }

    private String resolveTokenFromCookie(HttpServletRequest request) {
        if (request.getCookies() == null)
            return null;
        for (Cookie cookie : request.getCookies()) {
            if ("accessToken".equals(cookie.getName())) {
                return cookie.getValue();
            }
        }

        return null;
    }
}
