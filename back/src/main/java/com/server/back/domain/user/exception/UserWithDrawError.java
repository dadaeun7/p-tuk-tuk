package com.server.back.domain.user.exception;

public class UserWithDrawError extends RuntimeException {
    public UserWithDrawError(String message) {
        super(message);
    }
}
