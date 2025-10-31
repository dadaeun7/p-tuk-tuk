package com.server.back.domain.user.exception;

public class LoginNotSuccess extends RuntimeException {
  public LoginNotSuccess(String message) {
    super(message);
  }

}
