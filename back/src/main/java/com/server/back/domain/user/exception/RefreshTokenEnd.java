package com.server.back.domain.user.exception;

public class RefreshTokenEnd extends RuntimeException {
  public RefreshTokenEnd(String message) {
    super(message);
  }
}
