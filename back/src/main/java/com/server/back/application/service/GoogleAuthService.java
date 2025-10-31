package com.server.back.application.service;

import java.io.IOException;
import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.google.api.services.oauth2.Oauth2;
import com.google.api.services.oauth2.model.Userinfo;
import com.google.api.client.auth.oauth2.Credential;
import com.google.api.client.googleapis.auth.oauth2.GoogleAuthorizationCodeFlow;
import com.google.api.client.googleapis.auth.oauth2.GoogleTokenResponse;
import com.google.api.client.http.ByteArrayContent;
import com.google.api.client.http.GenericUrl;
import com.google.api.client.http.HttpRequestFactory;
import com.google.api.client.http.HttpResponse;
import com.server.back.domain.user.entity.GmailConnect;
import com.server.back.domain.user.entity.TukUsers;
import com.server.back.domain.user.exception.NotExitUserError;
import com.server.back.infrastructure.jpa.user.repository.GmailConnectRepository;
import com.server.back.infrastructure.jpa.user.repository.TukUserRepository;
import com.server.back.web.dto.GoogleConnectExitError;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class GoogleAuthService {

        private final TukUserRepository userRepository;
        private final GmailConnectRepository gmailConnectRepository;
        private final GoogleAuthorizationCodeFlow googleAuthorizationCodeFlow;

        @Transactional
        public String connectGoogleAcount(Long userId, String code) throws IOException {

                try {
                        GoogleTokenResponse tokenResponse = googleAuthorizationCodeFlow
                                        .newTokenRequest(code)
                                        .setRedirectUri("http://localhost:5173/my-page/google/auth/callback")
                                        .execute();

                        String refreshToken = tokenResponse.getRefreshToken();
                        String userIdentifier = String.valueOf(userId);
                        Credential credential = googleAuthorizationCodeFlow.loadCredential(userIdentifier);

                        if (credential == null) {
                                log.info("googleAuthorizationCodeFlow.loadCredential(userId) 는 null 입니다. createAndStoreCredential 를 통해 직접 생성합니다.");
                                credential = googleAuthorizationCodeFlow.createAndStoreCredential(tokenResponse,
                                                userIdentifier);
                        }

                        Oauth2 oauth2 = new Oauth2.Builder(
                                        googleAuthorizationCodeFlow.getTransport(),
                                        googleAuthorizationCodeFlow.getJsonFactory(),
                                        credential)
                                        .setApplicationName("tuktuk")
                                        .build();

                        Userinfo userInfo = oauth2.userinfo().v2().me().get().execute();
                        String googleId = userInfo.getId();
                        String googleEmail = userInfo.getEmail();

                        Optional<GmailConnect> check = gmailConnectRepository.findByUserId(googleId);

                        TukUsers user = userRepository.findById(userId)
                                        .orElseThrow(() -> new NotExitUserError("사용자를 찾을 수 없습니다"));

                        if (check.isPresent()) {
                                GmailConnect link = check.get();

                                if (!(link.getUser().getId().equals(user.getId()))) {
                                        throw new GoogleConnectExitError(
                                                        "이 계정은 이미 다른 계정에 연동되어 있습니다. 연동 된 다른 계정: " + user.getMyId());
                                }
                        }

                        GmailConnect gmailObj = GmailConnect.builder()
                                        .userId(googleId)
                                        .showId(googleEmail)
                                        .refreshToken(refreshToken)
                                        .build();

                        user.updateGmail(gmailObj);

                        gmailConnectRepository.save(gmailObj);
                        userRepository.save(user);

                        return googleEmail;

                } catch (IOException e) {
                        log.error("오류가 발생했습니다. {}", e.getMessage());
                        throw new RuntimeException(e);
                }

        }

        @Transactional
        public void unconnectGoogle(String myId) {

                TukUsers user = userRepository.findByMyId(myId)
                                .orElseThrow(() -> new NotExitUserError("사용자를 찾을 수 없습니다"));

                GmailConnect gmailObj = user.getGMail();

                if (gmailObj == null) {
                        log.info("연동이 해제 된 상태입니다.");
                        return;
                }

                String refreshToken = gmailObj.getRefreshToken();

                if (refreshToken != null && !refreshToken.isEmpty()) {
                        try {
                                HttpRequestFactory requestFactory = googleAuthorizationCodeFlow.getTransport()
                                                .createRequestFactory();
                                GenericUrl url = new GenericUrl("https://oauth2.googleapis.com/revoke");
                                String content = "token=" + refreshToken;

                                HttpResponse response = requestFactory.buildPostRequest(url, new ByteArrayContent(
                                                "application/x-www-form-urlencoded", content.getBytes())).execute();

                                if (response.isSuccessStatusCode()) {
                                        log.info("구글 연동 해제가 성공적으로 되었습니다");
                                } else {
                                        log.warn("이미 철회된 토큰이 다시 요청 되었습니다. user: {} | status code: {} | content : {}",
                                                        myId, response.getStatusMessage(), response.getContent());
                                }

                        } catch (Exception e) {
                                log.error("구글 연동 해제 중 실패했습니다. {}", e);
                        }

                        user.deleteGmail(gmailObj);
                        userRepository.save(user);
                        gmailConnectRepository.delete(gmailObj);

                }

        }
}
