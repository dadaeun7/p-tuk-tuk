package com.server.back.infrastructure.jpa.email.repository;

import java.time.ZonedDateTime;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.server.back.domain.email.entity.ProcessedEmail;

@Repository
public interface ProcessedEmailRepository extends JpaRepository<ProcessedEmail, Long> {
    boolean existsByMailId(String mailId);

    Optional<ProcessedEmail> findByMailId(String mailId);

    ProcessedEmail findByOrderDate(ZonedDateTime orderDate);
}
