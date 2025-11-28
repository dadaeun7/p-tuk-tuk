package com.server.back.config;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.security.authentication.AuthenticationManager;

import com.server.back.infrastructure.security.JwtAuthenticationFilter;
import com.server.back.infrastructure.security.JwtTokenProvider;
import com.server.back.infrastructure.security.TukUserDetailService;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Lazy;

@Configuration
public class ContentCachingConfig {

    @Bean
    public JwtAuthenticationFilter jwtAuthenticationFilter(JwtTokenProvider jtp,
            @Lazy AuthenticationManager authenticationManager,
            TukUserDetailService userDetailService,
            @Qualifier("stringRedisTemplate") StringRedisTemplate redis) {
        return new JwtAuthenticationFilter(jtp, authenticationManager,
                userDetailService, redis);
    }

    // @Bean
    // public FilterRegistrationBean<JwtAuthenticationFilter> jwtFilterRegistration(
    // JwtAuthenticationFilter jwtAuthenticationFilter) {
    // FilterRegistrationBean<JwtAuthenticationFilter> registration = new
    // FilterRegistrationBean<>();
    // registration.setFilter(jwtAuthenticationFilter);
    // registration.addUrlPatterns("/local/auth", "/local/auto");
    // return registration;

    // }
}
