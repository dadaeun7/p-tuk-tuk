package com.server.back.config;

import java.io.IOException;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.google.api.gax.core.FixedCredentialsProvider;
import com.google.auth.oauth2.GoogleCredentials;
import com.google.cloud.storage.Storage;
import com.google.cloud.storage.StorageOptions;
import com.google.cloud.vision.v1.ImageAnnotatorClient;
import com.google.cloud.vision.v1.ImageAnnotatorSettings;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Configuration
public class OcrConfig {

    @Bean(destroyMethod = "close")
    public ImageAnnotatorClient visionClient(GoogleCredentials googleCredentials) throws IOException {

        log.info("ImageAnnotatorClient 생성 ##########");

        ImageAnnotatorSettings settings = ImageAnnotatorSettings.newBuilder()
                .setCredentialsProvider(FixedCredentialsProvider.create(googleCredentials))
                .build();

        return ImageAnnotatorClient.create(settings);

    }

    @Bean
    public Storage storage(GoogleCredentials googleCredentials) {
        return StorageOptions.newBuilder()
                .setCredentials(googleCredentials)
                .build()
                .getService();

    }

}
