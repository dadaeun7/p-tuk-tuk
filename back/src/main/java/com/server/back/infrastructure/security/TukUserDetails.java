package com.server.back.infrastructure.security;

import java.util.Collection;
import java.util.List;
import java.util.Map;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.oauth2.core.user.OAuth2User;

import com.server.back.domain.user.entity.GmailConnect;
import com.server.back.domain.user.entity.TukUsers;

public class TukUserDetails implements UserDetails, OAuth2User {

    private final TukUsers user;
    private Map<String, Object> attributes;

    public TukUserDetails(TukUsers user) {
        this.user = user;
    }

    public TukUserDetails(TukUsers user, Map<String, Object> attributes) {
        this.user = user;
        this.attributes = attributes;
    }

    public String getVendor() {
        return user.getProvider().toString();
    }

    public Long getId() {
        return user.getId();
    }

    public GmailConnect getEmail() {
        return user.getGMail();
    }

    public String getLocation() {
        return user.getMyLocation();
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority("ROLE_" + user.getRole().toString()));
    }

    @Override
    public String getPassword() {
        return user.getPassword();
    }

    @Override
    public String getUsername() {
        return user.getMyId();
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return user.isActive();
    }

    @Override
    public Map<String, Object> getAttributes() {
        return attributes;
    }

    @Override
    public String getName() {
        return user.getMyId();
    }

}
