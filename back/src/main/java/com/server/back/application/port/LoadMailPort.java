package com.server.back.application.port;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import com.server.back.domain.email.entity.ProcessedEmail;

public interface LoadMailPort {

    List<ProcessedEmail> loadMails(String myId, LocalDate start, LocalDate end);

    Optional<ProcessedEmail> findEmailById(String messageId);
}
