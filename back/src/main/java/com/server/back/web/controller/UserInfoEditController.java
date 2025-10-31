package com.server.back.web.controller;

import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.server.back.domain.user.service.UserInfoEditService;
import com.server.back.web.dto.AddressEditReq;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
public class UserInfoEditController {

    private final UserInfoEditService uies;

    @PutMapping("/users/{myId}/address")
    public ResponseEntity<?> addressUpdate(@PathVariable String myId, @RequestBody AddressEditReq req) {

        uies.userAddressEdit(req.address(), myId);
        return ResponseEntity.ok(Map.of("address", req.address(), "message", "주소등록이 완료되었습니다."));
    }
}
