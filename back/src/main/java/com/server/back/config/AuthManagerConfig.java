package com.server.back.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.ProviderManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.server.back.infrastructure.security.CstRefreshTokenAuthenticationProvider;
import com.server.back.infrastructure.security.TukUserDetailService;

import lombok.RequiredArgsConstructor;

@Configuration
@RequiredArgsConstructor
public class AuthManagerConfig {

    private final TukUserDetailService tukUserDetailService;
    private final CstRefreshTokenAuthenticationProvider cstRefreshTokenAuthenticationProvider;
    private final PasswordEncoder passwordEncoder;

    @Bean
    public AuthenticationManager authenticationManager(
            AuthenticationConfiguration authenticationConfiguration) throws Exception {

        ProviderManager manager = (ProviderManager) authenticationConfiguration.getAuthenticationManager();

        DaoAuthenticationProvider daoAuthenticationProvider = new DaoAuthenticationProvider();
        daoAuthenticationProvider.setUserDetailsService(tukUserDetailService);
        daoAuthenticationProvider.setPasswordEncoder(passwordEncoder);

        manager.getProviders().add(daoAuthenticationProvider);
        manager.getProviders().add(cstRefreshTokenAuthenticationProvider);

        return manager;
    }
}
