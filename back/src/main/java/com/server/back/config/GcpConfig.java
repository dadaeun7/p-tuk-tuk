package com.server.back.config;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;

import org.apache.commons.text.StringEscapeUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.google.auth.oauth2.GoogleCredentials;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Configuration
public class GcpConfig {

    @Value("${gcp.credentials.json}")
    private String gcpCredentials;

    @Bean
    public GoogleCredentials googleCredentials() throws IOException {

        log.info("gcpCredentials: " + gcpCredentials);

        if (gcpCredentials == null || gcpCredentials.isEmpty()) {
            return GoogleCredentials.getApplicationDefault();
        }

        String rawJson;

        try {
            rawJson = StringEscapeUtils.unescapeJson(gcpCredentials);
        } catch (Exception e) {
            rawJson = gcpCredentials;
        }

        log.info("gcpCredentials to rawJson after: " + rawJson);
        try (InputStream stream = new ByteArrayInputStream(rawJson.getBytes(StandardCharsets.UTF_8))) {
            return GoogleCredentials.fromStream(stream);
        }
    }

}
