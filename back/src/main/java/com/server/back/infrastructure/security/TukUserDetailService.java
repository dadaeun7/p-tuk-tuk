package com.server.back.infrastructure.security;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.server.back.domain.user.entity.TukUsers;
import com.server.back.infrastructure.jpa.user.repository.TukUserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class TukUserDetailService implements UserDetailsService {

    private final TukUserRepository tukUserRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        TukUsers user = tukUserRepository.findByMyId(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not fonud: " + username));
        return new TukUserDetails(user);
    }

}
