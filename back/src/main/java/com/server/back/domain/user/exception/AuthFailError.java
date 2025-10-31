package com.server.back.domain.user.exception;

public class AuthFailError extends RuntimeException {
  public AuthFailError(String message) {
    super(message);
  }
}
