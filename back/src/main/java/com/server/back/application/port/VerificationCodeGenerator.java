package com.server.back.application.port;

import java.time.Duration;

public interface VerificationCodeGenerator {
    String generate();

    Duration ttl();
}
