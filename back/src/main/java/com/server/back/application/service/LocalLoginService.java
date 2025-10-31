package com.server.back.application.service;

import java.util.Date;
import java.util.concurrent.TimeUnit;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.stereotype.Service;

import com.server.back.domain.user.exception.AuthFailError;
import com.server.back.infrastructure.jpa.user.repository.TukUserRepository;
import com.server.back.infrastructure.security.JwtTokenProvider;
import com.server.back.infrastructure.security.RefreshTokenAuthentication;
import com.server.back.web.dto.TokenResponse;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class LocalLoginService {

  private final TukUserRepository tukUserRepository;
  private final AuthenticationManager authenticationManager;
  private final JwtTokenProvider jwtTokenProvider;

  @Qualifier("stringRedisTemplate")
  private final StringRedisTemplate redis;

  public TokenResponse LocalLogin(String email, String password, boolean autoCheck) {

    tukUserRepository.findByMyId(email).ifPresent(
        userPresent -> {
          if (userPresent.getExitAt() != null) {
            throw new AuthFailError("탈퇴 된 회원입니다.");
          }
        });

    // 로그인 성공
    try {
      Authentication auth = authenticationManager.authenticate(
          new UsernamePasswordAuthenticationToken(email, password));

      // token 생성
      String accessToken = jwtTokenProvider.createToken(auth);
      String refreshToken = null;

      /** 자동로그인 설정 */
      if (autoCheck) {

        refreshToken = jwtTokenProvider.refreshToken();
        // redis 에 refresh token 14일 사용 저장
        redis.opsForValue().set("refresh:" + email, refreshToken, 14,
            TimeUnit.DAYS);

        /** 자동로그인 해제 */
      } else {

        String checkRefresh = redis.opsForValue().get("refresh:" + email);

        /** 자동 로그인 해제했으나, refreshToken 이 있을 때 */
        if (checkRefresh != null) {
          redis.delete("refresh:" + email);
        }

      }

      // ---------- [ 로그인 후 생성 된 토큰 확인하기 ] ---------
      log.info("로그인 후 발급 된 accessToken {}", accessToken);
      log.info("로그인 후 발급 된 refreshToken {}", refreshToken);

      return new TokenResponse(accessToken, refreshToken);

      // 예외 처리
    } catch (BadCredentialsException e) {
      throw new AuthFailError("이메일 또는 비밀번호가 일치하지 않습니다.");
    } catch (AuthenticationException e) {
      throw new AuthFailError("로그인에 실패하였습니다." + e.getMessage());
    }
  }

  public TokenResponse reissue(String userMyId) {

    log.info("리프레시 토큰으로 액세스 토큰 재발급 시도 LocalLoginService 계층 시도, userMyId: {}", userMyId);

    String refreshToken = redis.opsForValue().get("refresh:" + userMyId);

    if (refreshToken != null) {
      Authentication reAuth = authenticationManager.authenticate(
          new RefreshTokenAuthentication(userMyId));

      String accessToken = jwtTokenProvider.createToken(reAuth);

      log.info("리프레시 토큰으로 액세스 토큰 재발급 시도 LocalLoginService 계층 시도, accessToken: " + accessToken);
      log.info("리프레시 토큰으로 액세스 토큰 재발급 시도 LocalLoginService 계층 시도, refreshToken: " + refreshToken);

      return new TokenResponse(accessToken, null);
    }

    return new TokenResponse(null, null);
  }

  public void logout(String accessToken, String userId) {
    // refresh token 삭제
    String refreshToken = "refresh:" + userId;
    redis.delete(refreshToken);

    if (accessToken == null || !jwtTokenProvider.validateToken(accessToken)) {
      log.warn("유효하지 않거나 없는 토큰으로 로그아웃 시도됨.");
      return;
    }

    // ======================= [디버깅 로그 추가] =======================
    try {
      Date expiration = jwtTokenProvider.parseClaims(accessToken).getExpiration();
      long now = new Date().getTime();
      long remainingTimeMillis = expiration.getTime() - now;

      // log.info("============== [로그아웃 토큰 디버깅] ==============");
      // log.info("Access Token: {}", accessToken);
      // log.info("토큰 만료 시간 (exp): {}", expiration);
      // log.info("현재 시간 (now): {}", new Date(now));
      // log.info("계산된 남은 시간 (ms): {}", remainingTimeMillis);
      // log.info("===================================================");

      if (remainingTimeMillis > 0) {
        // Redis에 블랙리스트로 등록 (남은 시간만큼 TTL 설정)
        redis.opsForValue().set(accessToken, "logout", remainingTimeMillis, TimeUnit.MILLISECONDS);
        log.info("Redis에 토큰을 블랙리스트로 등록했습니다. (TTL: {} ms)", remainingTimeMillis);
      } else {
        log.warn("토큰의 남은 유효시간이 0보다 작아 Redis에 등록하지 않습니다.");
      }
    } catch (Exception e) {
      log.error("로그아웃 처리 중 예외 발생", e);
    }

  }

}
