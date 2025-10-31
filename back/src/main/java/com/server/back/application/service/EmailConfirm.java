package com.server.back.application.service;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import com.server.back.domain.user.event.EmailConfirmEvent;
import com.server.back.domain.verification.exception.CodeTrialOver;
import com.server.back.domain.verification.exception.EmailIsExistError;
import com.server.back.infrastructure.jpa.user.repository.TukUserRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class EmailConfirm {
  private final TukUserRepository tur;
  private final ApplicationEventPublisher aep;

  @Qualifier("stringRedisTemplate")
  private final StringRedisTemplate redis;

  private String checkTriesKey(String em) {
    return "email:tries:" + em;
  }

  @Transactional
  public void confirmEmail(String email) {

    if (tur.existsByMyId(email)) {
      throw new EmailIsExistError("이미 사용중인 이메일 입니다.");
    }

    if (redis.opsForValue().get(checkTriesKey(email)) != null) {
      // 이미 횟수 초과한 이력이 있으면 시간 보류
      int ttl = redis.getExpire(checkTriesKey(email)).intValue();
      throw new CodeTrialOver(String.format("인증 초과 : 남은 시간 %d분 %d초", ttl / 60, ttl % 60));
    }

    aep.publishEvent(new EmailConfirmEvent(email));
  }
}
