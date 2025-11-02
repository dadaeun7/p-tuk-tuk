package com.server.back.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;

import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.access.AccessDeniedHandler;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.authentication.session.NullAuthenticatedSessionStrategy;
import org.springframework.security.web.context.NullSecurityContextRepository;
import org.springframework.web.cors.CorsConfigurationSource;

import com.server.back.infrastructure.security.CstAuthenticationEntryPoint;
import com.server.back.infrastructure.security.JwtAuthenticationFilter;
import com.server.back.infrastructure.security.JwtTokenProvider;
import com.server.back.infrastructure.security.OAuth2UserService;
import com.server.back.infrastructure.security.OAuth2UserSuccessHandler;

import jakarta.servlet.http.HttpServletResponse;

import static org.springframework.security.config.Customizer.withDefaults;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

        private final OAuth2UserService oauth2UserService;
        private final OAuth2UserSuccessHandler oAuth2UserSuccessHandler;
        private final JwtAuthenticationFilter jwtAuthenticationFilter;
        private final CstAuthenticationEntryPoint cstAuthenticationEntryPoint;

        @Bean
        SecurityFilterChain securityFilterChain(HttpSecurity http, CorsConfigurationSource cors, JwtTokenProvider jwtp)
                        throws Exception {
                http
                                .cors(withDefaults())
                                // CSRF, Form Login, Http Basic 인증 비활성화
                                .csrf(csrf -> csrf.disable())
                                .formLogin(form -> form.disable())
                                .httpBasic(httpBasic -> httpBasic.disable())
                                .logout(logout -> logout.disable())
                                .sessionManagement(session -> session
                                                .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                                                .sessionAuthenticationStrategy(new NullAuthenticatedSessionStrategy()))
                                .exceptionHandling(e -> e.authenticationEntryPoint(cstAuthenticationEntryPoint))
                                .securityContext(context -> context
                                                .securityContextRepository(new NullSecurityContextRepository()))
                                .authorizeHttpRequests(auth -> auth
                                                .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                                                .requestMatchers("/join/**", "/api/email/**",
                                                                "/api/oauth2/**",
                                                                "/oauth2/**",
                                                                "/google/connect/auth",
                                                                "/login/oauth2/code/**",
                                                                "/login/**",
                                                                "/google/unconnect/auth")
                                                .permitAll()
                                                .requestMatchers("/error").permitAll()
                                                .anyRequest().authenticated())
                                .addFilterBefore(jwtAuthenticationFilter,
                                                UsernamePasswordAuthenticationFilter.class)
                                .oauth2Login(oauth2 -> oauth2
                                                .redirectionEndpoint(
                                                                endpoint -> endpoint.baseUri("/oauth2/callback/**"))
                                                .userInfoEndpoint(userInfo -> userInfo.userService(oauth2UserService))
                                                .successHandler(oAuth2UserSuccessHandler));

                return http.build();
        }

        @Bean
        public AuthenticationEntryPoint jwtAuthenticationEntryPoint() {
                return (request, response, authException) -> {
                        log.error("Authentication Exception Occurred: URI={}, Message={}", request.getRequestURI(),
                                        authException.getMessage());
                        response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Unauthorized");
                };
        }

        @Bean
        public AccessDeniedHandler jwtAccessDeniedHandler() {
                return (request, response, accessDeniedException) -> {
                        log.error("Access Denied Exception Occurred: URI={}, Message={}", request.getRequestURI(),
                                        accessDeniedException.getMessage());
                        response.sendError(HttpServletResponse.SC_FORBIDDEN, "Forbidden");
                };
        }

}
