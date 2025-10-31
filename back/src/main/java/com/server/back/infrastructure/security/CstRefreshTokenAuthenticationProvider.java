package com.server.back.infrastructure.security;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.security.authentication.AuthenticationCredentialsNotFoundException;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class CstRefreshTokenAuthenticationProvider implements AuthenticationProvider {

    @Qualifier("stringRedisTemplate")
    private final StringRedisTemplate redis;

    private final JwtTokenProvider jwtTokenProvider;
    private final TukUserDetailService localUserDetailService;

    @Override
    public Authentication authenticate(Authentication authentication) throws AuthenticationException {
        String userMyId = (String) authentication.getPrincipal();

        String refreshToken = redis.opsForValue().get("refresh:" + userMyId);

        if (refreshToken == null || !jwtTokenProvider.validateToken(refreshToken)) {
            throw new AuthenticationCredentialsNotFoundException("유효기간이 만료된 refreshToken입니다. " + refreshToken);
        }

        UserDetails userDetails = localUserDetailService.loadUserByUsername(userMyId);
        return new RefreshTokenAuthentication(userDetails, userDetails.getAuthorities());

    }

    @Override
    public boolean supports(Class<?> authentication) {
        return CstRefreshTokenAuthenticationProvider.class.isAssignableFrom(authentication);
    }

}
