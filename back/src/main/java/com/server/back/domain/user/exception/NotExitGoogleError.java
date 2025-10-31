package com.server.back.domain.user.exception;

public class NotExitGoogleError extends RuntimeException {
    public NotExitGoogleError(String message) {
        super(message);
    }
}
