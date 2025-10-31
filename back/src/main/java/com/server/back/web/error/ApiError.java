package com.server.back.web.error;

import java.time.Instant;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import com.server.back.domain.user.exception.AuthFailError;
import com.server.back.domain.user.exception.LoginNotSuccess;
import com.server.back.domain.user.exception.PasswordToJoinError;
import com.server.back.domain.user.exception.RefreshTokenEnd;
import com.server.back.domain.user.exception.UserWithDrawError;
import com.server.back.domain.verification.exception.CodeNotEquals;
import com.server.back.domain.verification.exception.CodeTrialOver;
import com.server.back.domain.verification.exception.EmailIsExistError;
import com.server.back.web.dto.FieldViolation;
import com.server.back.web.dto.GoogleConnectExitError;
import com.server.back.web.dto.RestApiError;

import jakarta.servlet.http.HttpServletRequest;

@RestControllerAdvice
public class ApiError {

  // 이메일 인증 중 이미 있는 이메일인 경우 exception 처리
  @ExceptionHandler(EmailIsExistError.class)
  public ResponseEntity<RestApiError> handleEmailIsExistError(EmailIsExistError e, HttpServletRequest req) {
    RestApiError apiError = RestApiError.of(HttpStatus.CONFLICT,
        e.getMessage(),
        req.getRequestURI(),
        Instant.now(),
        List.of(new FieldViolation("email", e.getMessage())));

    return ResponseEntity.status(HttpStatus.CONFLICT).body(apiError);
  }

  // 인증코드 불일치 exception
  @ExceptionHandler(CodeNotEquals.class)
  public ResponseEntity<RestApiError> codeNotEquals(CodeNotEquals e, HttpServletRequest req) {
    RestApiError apiError = RestApiError.of(HttpStatus.UNPROCESSABLE_ENTITY,
        e.getMessage(),
        req.getRequestURI(),
        Instant.now(),
        List.of(new FieldViolation("code", e.getMessage())));

    return ResponseEntity.status(HttpStatus.UNPROCESSABLE_ENTITY).body(apiError);
  }

  @ExceptionHandler(UserWithDrawError.class)
  public ResponseEntity<RestApiError> isWithDrawUser(UnknownError e, HttpServletRequest req) {
    RestApiError apiError = RestApiError.of(HttpStatus.CONFLICT,
        e.getMessage(),
        req.getRequestURI(),
        Instant.now(),
        List.of(new FieldViolation("password", e.getMessage())));

    return ResponseEntity.status(HttpStatus.CONFLICT).body(apiError);
  }

  // 인증 횟수 초과 exception
  @ExceptionHandler(CodeTrialOver.class)
  public ResponseEntity<RestApiError> codeTrialOver(CodeTrialOver e, HttpServletRequest req) {
    RestApiError apiError = RestApiError.of(HttpStatus.GONE,
        e.getMessage(),
        req.getRequestURI(),
        Instant.now(),
        List.of(new FieldViolation("code", e.getMessage())));

    return ResponseEntity.status(HttpStatus.GONE).body(apiError);
  }

  // 마지막 중 비밀번호 입력 후 회원가입 시 최종 이메일 확인 <동시 가입>
  @ExceptionHandler(PasswordToJoinError.class)
  public ResponseEntity<RestApiError> handlePasswordToJoinError(PasswordToJoinError e, HttpServletRequest req) {
    RestApiError apiError = RestApiError.of(HttpStatus.CONFLICT,
        e.getMessage(),
        req.getRequestURI(),
        Instant.now(),
        List.of(new FieldViolation("password", e.getMessage())));

    return ResponseEntity.status(HttpStatus.CONFLICT).body(apiError);
  }

  // Google 기존 연동여부 확인
  @ExceptionHandler(GoogleConnectExitError.class)
  public ResponseEntity<RestApiError> handleGoogleConnectExit(GoogleConnectExitError e, HttpServletRequest req) {

    RestApiError apiError = RestApiError.of(HttpStatus.CONFLICT,
        e.getMessage(),
        req.getRequestURI(),
        Instant.now(),
        List.of(new FieldViolation("google", e.getMessage())));

    return ResponseEntity.status(HttpStatus.CONFLICT).body(apiError);
  }

  // Email 존재하지 않음 기존 연동여부 확인
  @ExceptionHandler(LoginNotSuccess.class)
  public ResponseEntity<RestApiError> handleEmailNotExist(LoginNotSuccess e, HttpServletRequest req) {
    RestApiError apiError = RestApiError.of(HttpStatus.NOT_FOUND,
        e.getMessage(),
        req.getRequestURI(),
        Instant.now(),
        List.of(new FieldViolation("email", e.getMessage())));

    return ResponseEntity.status(HttpStatus.NOT_FOUND).body(apiError);
  }

  // Refresh Token끝남
  @ExceptionHandler(RefreshTokenEnd.class)
  public ResponseEntity<RestApiError> handleRefreshTokenEnd(RefreshTokenEnd e, HttpServletRequest req) {
    RestApiError apiError = RestApiError.of(HttpStatus.UNAUTHORIZED,
        e.getMessage(),
        req.getRequestURI(),
        Instant.now(),
        List.of(new FieldViolation("refreshToken", e.getMessage()))); // refreshToken 필드에 에러 메시지 추가
    return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(apiError);
  }

  // Auth 만료됨
  @ExceptionHandler(AuthFailError.class)
  public ResponseEntity<RestApiError> handleAuthFailError(AuthFailError e, HttpServletRequest req) {
    RestApiError apiError = RestApiError.of(HttpStatus.UNAUTHORIZED,
        e.getMessage(),
        req.getRequestURI(),
        Instant.now(),
        List.of(new FieldViolation("auth", e.getMessage()))); // auth 필드에 에러 메시지 추가
    return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(apiError);
  }
}
