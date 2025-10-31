package com.server.back.web.dto;

import java.time.Instant;
import java.util.List;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.http.HttpStatus;

@ConfigurationProperties(prefix = "app")
public record RestApiError(int status, String message, String path, Instant timestamp, List<FieldViolation> error) {

  public static RestApiError of(HttpStatus s, String message, String path, Instant timestamp,
      List<FieldViolation> error) {
    return new RestApiError(s.value(), message, path, timestamp, error);
  }
}
