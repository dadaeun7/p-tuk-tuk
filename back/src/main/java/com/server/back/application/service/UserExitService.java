package com.server.back.application.service;

import java.time.LocalDateTime;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.server.back.domain.user.entity.TukUsers;
import com.server.back.infrastructure.jpa.user.repository.TukUserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserExitService {

    private final TukUserRepository tukUserRepository;

    @Qualifier("stringRedisTemplate")
    private final StringRedisTemplate redis;

    @Transactional
    public void localExit(String userMyId) {

        Optional<TukUsers> user = tukUserRepository.findByMyId(userMyId);
        user.get().setClientExitTime(LocalDateTime.now());
    }
}
