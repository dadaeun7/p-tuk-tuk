package com.server.back.infrastructure.security;

import java.util.Map;

import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.OAuth2Error;
import org.springframework.security.oauth2.core.OAuth2ErrorCodes;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import com.server.back.domain.user.entity.TukUsers;
import com.server.back.infrastructure.jpa.user.repository.TukUserRepository;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
public class OAuth2UserService extends DefaultOAuth2UserService {

    private final TukUserRepository tukUserRepository;

    public OAuth2UserService(TukUserRepository tukUserRepository) {
        this.tukUserRepository = tukUserRepository;
    }

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {

        try {
            log.info("📦OAuth2User loadUser 가 실행되었습니다.");
            OAuth2User oAuth2User = super.loadUser(userRequest);

            String vendorId = userRequest.getClientRegistration().getRegistrationId();

            String setId;
            TukUsers.Provider provider;

            Map<String, Object> attributes = oAuth2User.getAttributes();

            if ("naver".equals(vendorId)) {

                Map<String, Object> response = (Map<String, Object>) attributes.get("response");

                provider = TukUsers.Provider.NAVER;
                setId = (String) response.get("id") + "_" + provider;

            } else if ("kakao".equals(vendorId)) {
                provider = TukUsers.Provider.KAKAO;
                setId = String.valueOf(attributes.get("id")) + "_" + provider;
                // google
            } else {
                provider = TukUsers.Provider.GOOGLE;
                setId = (String) attributes.get("sub") + "_" + provider;
            }

            TukUsers user = tukUserRepository.findByMyId(setId).orElseGet(() -> {
                TukUsers newUser = TukUsers.builder()
                        .myId(setId)
                        .provider(provider)
                        .role(TukUsers.Role.USER)
                        .active(true)
                        .build();

                return tukUserRepository.save(newUser);
            });

            return new TukUserDetails(user, oAuth2User.getAttributes());

        } catch (Exception e) {
            log.error("OAuth2 사용자 로딩 중 오류 발생", e);

            OAuth2Error oauth2Error = new OAuth2Error(
                    OAuth2ErrorCodes.SERVER_ERROR, // 표준 오류 코드 (예: 내부 서버 오류)
                    "Failed to load user info from provider. Check provider configuration and user service logic.", // 오류
                                                                                                                    // 설명
                    null // 오류 URI
            );

            // 🚨 2. OAuth2AuthenticationException을 이 표준 객체로 생성 후 던지기
            throw new OAuth2AuthenticationException(oauth2Error, e.getMessage());

        }

    }

}
