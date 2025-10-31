package com.server.back.infrastructure.security;

import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.util.Date;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Component
@RequiredArgsConstructor
public class JwtTokenProvider {

  @Value("${jwt.secret}")
  private String secret;

  private final long ACCESS_TOKEN_VALID_TIME = 60 * 60 * 1000L; // 1시간
  private final long REFRESH_TOKEN_VALID_TIME = 7 * 24 * 60 * 60 * 1000L; // 7일

  private Key key;

  @PostConstruct
  public void init() {
    // 어떤 OS에서도 동일하게 하기 위해 UTF-8 사용
    key = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
  }

  private final TukUserDetailService localUserDetailService;
  @Qualifier("stringRedisTemplate")
  private final StringRedisTemplate redis;

  public String createToken(Authentication auth) {
    Date now = new Date();
    Date validity = new Date(now.getTime() + ACCESS_TOKEN_VALID_TIME);

    return Jwts.builder()
        .setSubject(auth.getName())
        .claim("role", auth.getAuthorities().iterator().next().getAuthority())
        .setIssuedAt(new Date())
        .setExpiration(validity)
        .signWith(key, SignatureAlgorithm.HS256)
        .compact();
  }

  public String refreshToken() {
    return Jwts.builder()
        .setExpiration(new Date(System.currentTimeMillis() + REFRESH_TOKEN_VALID_TIME))
        .signWith(key, SignatureAlgorithm.HS256)
        .compact();
  }

  public Claims parseClaims(String token) {
    try {
      return Jwts.parserBuilder()
          .setSigningKey(key)
          .build()
          .parseClaimsJws(token)
          .getBody();
    } catch (ExpiredJwtException e) {
      return e.getClaims();
    }
  }

  public Authentication getAuthenticator(String token) {
    String userMyId = getUserEmail(token);
    UserDetails userDetails = localUserDetailService.loadUserByUsername(userMyId);
    return new UsernamePasswordAuthenticationToken(userDetails, "", userDetails.getAuthorities());
  }

  public boolean validateToken(String token) {

    try {
      Claims claims = parseClaims(token);
      log.info("claims 유효 여부 {}", claims);
      return true;
    } catch (Exception e) {
      log.warn("Token validation failed: {}", e.getMessage());
      return false;
    }
  }

  public Boolean isTokenBlackListCheck(String token) {
    if (redis.opsForValue().get(token) != null) {
      return true;
    }

    return false;
  }

  public String getUserEmail(String token) {
    return parseClaims(token).getSubject();
  }

  public Date getExpiration(String token) {
    return parseClaims(token).getExpiration();
  }

}
