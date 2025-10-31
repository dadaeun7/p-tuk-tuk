package com.server.back.application.service;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.server.back.domain.user.entity.TukUsers;
import com.server.back.domain.user.exception.PasswordToJoinError;
import com.server.back.domain.user.exception.UserWithDrawError;
import com.server.back.infrastructure.jpa.user.repository.TukUserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PasswordToJoinSuc {

  private final PasswordEncoder passwordEncoder;
  private final TukUserRepository tukUserRepository;

  public void joinPassword(String email, String password) {
    String pwdEncoded = passwordEncoder.encode(password);

    tukUserRepository.findByMyId(email)
        .ifPresent(exitUser -> {
          if (exitUser.getExitAt() != null) {
            throw new UserWithDrawError("탈퇴 된 사용자입니다. 가입 제한이 됩니다");
          } else {
            throw new PasswordToJoinError("이미 가입 된 사용자입니다");
          }
        });

    TukUsers newUser = TukUsers.builder()
        .myId(email)
        .password(pwdEncoded)
        .provider(TukUsers.Provider.LOCAL)
        .role(TukUsers.Role.USER)
        .active(true)
        .build();

    tukUserRepository.save(newUser);

  }
}
