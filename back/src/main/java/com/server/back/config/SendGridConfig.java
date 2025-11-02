package com.server.back.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.sendgrid.SendGrid;

@Configuration
public class SendGridConfig {

    @Value("${SENDGRID_API_KEY}")
    private String sendGridApiKey;

    @Bean
    public SendGrid sendGrid() {
        if (sendGridApiKey == null || sendGridApiKey.isEmpty()) {
            throw new RuntimeException("sendGridApiKey 환경 변수 에러");
        }
        return new SendGrid(sendGridApiKey);
    }
}
