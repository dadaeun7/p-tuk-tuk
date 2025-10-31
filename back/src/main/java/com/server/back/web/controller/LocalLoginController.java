package com.server.back.web.controller;

import java.util.Map;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.server.back.application.service.LocalLoginService;
import com.server.back.infrastructure.security.JwtTokenProvider;
import com.server.back.infrastructure.security.TukUserDetails;
import com.server.back.web.dto.BringRefreshTokenReq;
import com.server.back.web.dto.LocalLoginReq;
import com.server.back.web.dto.TokenResponse;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequestMapping("/login")
@RequiredArgsConstructor
public class LocalLoginController {

  private final LocalLoginService lls;
  private final JwtTokenProvider jtp;

  @PostMapping("/local")
  public ResponseEntity<?> localLogin(@Valid @RequestBody LocalLoginReq req) {
    TokenResponse trp = lls.LocalLogin(req.email(), req.password(), req.autoCheck());

    ResponseCookie cookie = ResponseCookie.from("accessToken", trp.accessToken())
        .httpOnly(true)
        .secure(true)
        .path("/")
        .maxAge(60 * 60) // 1시간
        .sameSite("None")
        .build();

    return ResponseEntity.ok()
        .header(HttpHeaders.SET_COOKIE, cookie.toString()).body("Login Success");
  }

  @PostMapping("/auth")
  public ResponseEntity<?> checkMe(@AuthenticationPrincipal TukUserDetails user) {

    if (user == null) {
      return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Not Auth User");
    }

    return ResponseEntity.ok(Map.of(
        "myId", user.getUsername(), "email", user.getEmail() != null ? user.getEmail().getShowId() : "", "location",
        user.getLocation(), "type", user.getVendor()));
  }

  @PostMapping("/auto")
  public ResponseEntity<?> autoLogin(@RequestBody BringRefreshTokenReq req, HttpServletResponse response) {

    TokenResponse tokens = lls.reissue(req.userMyId());

    if (tokens.accessToken() != null) {
      ResponseCookie cookie = ResponseCookie.from("accessToken", tokens.accessToken())
          .httpOnly(true)
          .secure(true)
          .path("/")
          .maxAge(60 * 60) // 1시간
          .sameSite("None")
          .build();

      response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());
    } else {
      return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("refresh token을 통한 자동 로그인이 실패");
    }

    return ResponseEntity.ok().build();

  }

  @PostMapping("/logout")
  public ResponseEntity<?> logout(@CookieValue(name = "accessToken", required = false) String accessToken,
      HttpServletResponse response) {

    String userId = jtp.getUserEmail(accessToken);
    lls.logout(accessToken, userId);

    // ===================== [ 브라우저 Cookie 초기화 ] =====================
    Cookie cookie = new Cookie("accessToken", null);
    cookie.setMaxAge(0);
    cookie.setHttpOnly(true);
    cookie.setPath("/");

    response.addCookie(cookie);

    log.info("브라우저 쿠키 초기화 완료 {}", cookie);
    return ResponseEntity.ok(Map.of("logout", "success"));
  }

}
