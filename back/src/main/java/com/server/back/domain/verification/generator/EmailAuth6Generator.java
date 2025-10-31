package com.server.back.domain.verification.generator;

import java.security.SecureRandom;
import java.time.Duration;

import org.springframework.stereotype.Component;

import com.server.back.application.port.VerificationCodeGenerator;

@Component
public class EmailAuth6Generator implements VerificationCodeGenerator {

    private final SecureRandom random = new SecureRandom();

    @Override
    public String generate() {
        return String.format("%06d", random.nextInt(1_000_000));
    }

    @Override
    public Duration ttl() {
        return Duration.ofMinutes(5);
    }
}
