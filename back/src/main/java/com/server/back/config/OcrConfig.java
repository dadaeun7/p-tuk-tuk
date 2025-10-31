package com.server.back.config;

import java.io.IOException;
import java.io.InputStream;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.Resource;

import com.google.api.gax.core.FixedCredentialsProvider;
import com.google.auth.oauth2.GoogleCredentials;
import com.google.cloud.vision.v1.ImageAnnotatorClient;
import com.google.cloud.vision.v1.ImageAnnotatorSettings;

@Configuration
public class OcrConfig {

    @Value("${gcp.vision.key-file-path}")
    private Resource credentialResource;

    @Bean
    public ImageAnnotatorClient visionClient() throws IOException {

        InputStream credentialStream = credentialResource.getInputStream();
        GoogleCredentials credentials = GoogleCredentials.fromStream(credentialStream);

        ImageAnnotatorSettings settings = ImageAnnotatorSettings.newBuilder()
                .setCredentialsProvider(FixedCredentialsProvider.create(credentials))
                .build();

        return ImageAnnotatorClient.create(settings);
    }
}
