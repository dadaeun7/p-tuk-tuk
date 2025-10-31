package com.server.back.infrastructure.jpa.user.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.server.back.domain.user.entity.GmailConnect;

@Repository
public interface GmailConnectRepository extends JpaRepository<GmailConnect, Long> {
    Optional<GmailConnect> findById(Long id);

    Optional<GmailConnect> findByUserId(String userId);
}
