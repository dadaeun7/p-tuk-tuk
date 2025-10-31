package com.server.back.infrastructure.mail.gmail;

import java.io.IOException;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Component;

import com.google.api.client.auth.oauth2.Credential;
import com.google.api.client.googleapis.auth.oauth2.GoogleAuthorizationCodeFlow;
import com.google.api.client.googleapis.auth.oauth2.GoogleTokenResponse;
import com.google.api.client.http.HttpTransport;
import com.google.api.client.json.JsonFactory;
import com.google.api.services.gmail.Gmail;
import com.google.api.services.gmail.model.ListMessagesResponse;
import com.google.api.services.gmail.model.Message;
import com.server.back.application.port.LoadMailPort;
import com.server.back.domain.email.entity.ProcessedEmail;
import com.server.back.domain.email.entity.ProcessedEmail.ProcessingStatus;
import com.server.back.domain.email.entity.EmailProduct;
import com.server.back.domain.order.dto.ParserToOrderDto;
import com.server.back.domain.order.dto.ParserToOrderItemDto;
import com.server.back.domain.user.entity.TukUsers;
import com.server.back.domain.user.exception.NotExitUserError;
import com.server.back.infrastructure.jpa.email.repository.ProcessedEmailRepository;
import com.server.back.infrastructure.jpa.user.repository.TukUserRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Component
@RequiredArgsConstructor
public class GmailLoadAdapter implements LoadMailPort {

    private final TukUserRepository userRepository;
    private final GoogleAuthorizationCodeFlow flow;
    private final HttpTransport httpTransport;
    private final JsonFactory jsonFactory;
    private final GmailToParserToOrderDto gmailHtmlToOrderMap;
    private final ProcessedEmailRepository emailRepository;

    @Override
    public Optional<ProcessedEmail> findEmailById(String messageId) {
        return emailRepository.findByMailId(messageId);
    }

    @Override
    public List<ProcessedEmail> loadMails(String myId, LocalDate start, LocalDate end) {

        List<ProcessedEmail> emailList = new ArrayList<ProcessedEmail>();

        try {
            List<ParserToOrderDto> dto = getGmailClientUser(myId, start, end);

            for (ParserToOrderDto parserToOrderDto : dto) {

                if (!emailRepository.existsByMailId(parserToOrderDto.emailId())) {
                    ProcessedEmail lists = messageToEmail(parserToOrderDto);
                    emailList.add(lists);
                }

            }

        } catch (Exception e) {
            log.info("메일 로드 중 에러가 났습니다. {}", e.getMessage());
        }

        return emailList;
    }

    // clientUser 불러오기 -> getPurchaseEmailsToOrderDto 로 넘기기
    private List<ParserToOrderDto> getGmailClientUser(String myId, LocalDate start, LocalDate end)
            throws IOException {

        TukUsers user = userRepository.findByMyId(myId).orElseThrow(() -> new NotExitUserError("사용자를 찾을 수 없습니다"));

        ParserToOrderDto.ParserToOrderDtoBuilder orderDtoBuilder = ParserToOrderDto.builder().user(user);

        Long userId = user.getId();
        String gRefreshToken = user.getGMail().getRefreshToken();

        if (gRefreshToken == null) {
            throw new IllegalStateException("google 계정과 연동되지 않았습니다");
        }

        Credential credentials = flow.createAndStoreCredential(
                new GoogleTokenResponse().setRefreshToken(gRefreshToken),
                userId.toString());

        Gmail gmail = new Gmail.Builder(httpTransport, jsonFactory, credentials)
                .setApplicationName("tuktuk")
                .build();

        return getPurchaseEmailsToOrderDto(gmail, orderDtoBuilder, start, end);

    }

    // 이전에 clientUser 가 먼저 실행
    private List<ParserToOrderDto> getPurchaseEmailsToOrderDto(Gmail client,
            ParserToOrderDto.ParserToOrderDtoBuilder orderDtoBuilder,
            LocalDate start,
            LocalDate end)
            throws IOException {

        List<ParserToOrderDto> dtoList = new ArrayList<ParserToOrderDto>();

        String queryForSetQ = String.format(
                "in:anywhere {from:@noreply@e.coupang.com from:@noreply@woowahan.com from:@help@kurly.com} subject:(주문) after:%s before:%s",
                start, end);

        ListMessagesResponse response = client.users()
                .messages()
                .list("me")
                .setQ(queryForSetQ)
                .execute();

        if (response == null) {
            log.error("[GmailLoadAdapter] getPurchaseEmailsToOrderDto 메서드 : gmail의 쿼리를 통해 받은 response가 null 입니다.");
            return null;
        }

        List<Message> messages = response.getMessages();

        if (messages == null || messages.isEmpty()) {

            log.error("[GmailLoadAdapter] getPurchaseEmailsToOrderDto 메서드 : 쿼리를 통해 받은 message 가 없습니다, 검색 결과를 확인하세요. : "
                    + queryForSetQ);
            return dtoList;
        }

        for (Message msg : messages) {

            Message fullMessage = client.users().messages().get("me", msg.getId()).execute();
            gmailHtmlToOrderMap.parseOrderItems(fullMessage, orderDtoBuilder);

            ParserToOrderDto check = orderDtoBuilder.build();

            if (!check.status().equals(ProcessingStatus.FAILED)) {
                dtoList.add(orderDtoBuilder.build());
            }
        }

        return dtoList;

    }

    private ProcessedEmail messageToEmail(ParserToOrderDto dto) {

        List<ParserToOrderItemDto> list = dto.itemList();
        List<EmailProduct> proudcts = new ArrayList<>();

        ProcessedEmail newEmail = ProcessedEmail.builder()
                .mailId(dto.emailId())
                .sendor(dto.vendor().toString())
                .recipient(dto.user())
                .status(dto.status())
                .orderDate(dto.orderDate())
                .build();

        for (ParserToOrderItemDto parserToOrderItemDto : list) {

            EmailProduct insert = EmailProduct.builder()
                    .productName(parserToOrderItemDto.itemName())
                    .quantity(parserToOrderItemDto.quantity())
                    .processedEmail(newEmail).build();

            proudcts.add(insert);
            newEmail.addEmailProduct(insert);
        }

        ProcessedEmail savedProcessedEmail = emailRepository.save(newEmail);

        return savedProcessedEmail;

    }

}
