package com.server.back.domain.verification.exception;

public class EmailIsExistError extends RuntimeException {

  public EmailIsExistError(String message) {
    super(message);
  }
}