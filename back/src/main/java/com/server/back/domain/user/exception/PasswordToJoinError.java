package com.server.back.domain.user.exception;

public class PasswordToJoinError extends RuntimeException {

  public PasswordToJoinError(String message) {
    super(message);
  }
}
