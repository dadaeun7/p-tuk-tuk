package com.server.back.web.controller;

import java.util.Map;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.server.back.application.service.PasswordToJoinSuc;
import com.server.back.web.dto.LocalJoinPasswordReq;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/join")
@RequiredArgsConstructor
public class LocalJoinSuccessController {

  private final PasswordToJoinSuc pjs;

  @PostMapping("/password")
  public Map<String, Object> joinPassword(@Valid @RequestBody LocalJoinPasswordReq req) {
    pjs.joinPassword(req.email(), req.password());
    return Map.of("complete", true);
  }

}
