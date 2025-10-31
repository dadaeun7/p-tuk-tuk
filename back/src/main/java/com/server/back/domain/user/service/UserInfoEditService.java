package com.server.back.domain.user.service;

import org.springframework.stereotype.Service;

import com.server.back.domain.user.entity.TukUsers;
import com.server.back.infrastructure.jpa.user.repository.TukUserRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class UserInfoEditService {
    private final TukUserRepository userRepository;

    public void userAddressEdit(String address, String myId) {
        TukUsers user = userRepository.findByMyId(myId)
                .orElseThrow(() -> new IllegalArgumentException("해당 사용자는 없습니다. id =" + myId));

        user.updateAddress(address);
    }
}
