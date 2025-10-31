package com.server.back.domain.verification.exception;

public class CodeTrialOver extends RuntimeException {

  public CodeTrialOver(String message) {
    super(message);
  }
}
