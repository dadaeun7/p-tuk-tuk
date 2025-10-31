package com.server.back.infrastructure.jpa.user.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.server.back.domain.user.entity.TukUsers;

@Repository
public interface TukUserRepository extends JpaRepository<TukUsers, Long> {
    Optional<TukUsers> findByMyId(String myId);

    Boolean existsByMyId(String myId);
}
