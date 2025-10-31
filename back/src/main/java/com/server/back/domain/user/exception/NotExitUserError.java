package com.server.back.domain.user.exception;

public class NotExitUserError extends RuntimeException {
    public NotExitUserError(String message) {
        super(message);
    }
}
