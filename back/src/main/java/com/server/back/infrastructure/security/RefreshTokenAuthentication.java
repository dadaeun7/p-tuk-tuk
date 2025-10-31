package com.server.back.infrastructure.security;

import java.util.Collection;

import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;

public class RefreshTokenAuthentication extends AbstractAuthenticationToken {

    private final Object principal;

    public RefreshTokenAuthentication(Object principal) {
        super(null);
        this.principal = principal;
        setAuthenticated(false);
    }

    public RefreshTokenAuthentication(Object principal, Collection<? extends GrantedAuthority> authorities) {
        super(authorities);
        this.principal = principal;
        super.setAuthenticated(true);
    }

    @Override
    public Object getCredentials() {
        return null;
    }

    @Override
    public Object getPrincipal() {
        return this.principal;
    }

}
