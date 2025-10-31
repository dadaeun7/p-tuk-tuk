package com.server.back.infrastructure.mail.gmail;

import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.Instant;
import org.springframework.stereotype.Service;

import com.google.api.services.gmail.model.Message;
import com.google.api.services.gmail.model.MessagePartHeader;
import com.server.back.domain.email.entity.ProcessedEmail.ProcessingStatus;
import com.server.back.domain.order.dto.ParserToOrderDto;
import com.server.back.domain.order.entity.RecycleOrder.Vendor;
import com.server.back.infrastructure.parser.HtmlToParserOrderItem;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class GmailToParserToOrderDto {

    private final HtmlToParserOrderItem htmlToParserOrderItem;

    private String getHeader(Message message, String reqName) {

        return message.getPayload().getHeaders().stream()
                .filter(h -> h.getName().equalsIgnoreCase(reqName))
                .map(MessagePartHeader::getValue)
                .findFirst()
                .orElse("");
    }

    private ZonedDateTime parsOrderTime(Message message) {

        Long messageInternalDateTime = message.getInternalDate();

        Instant instant = Instant.ofEpochMilli(messageInternalDateTime);
        ZoneId seoulZone = ZoneId.of("Asia/Seoul");

        ZonedDateTime orderTime = instant.atZone(seoulZone);

        return orderTime;
    }

    public void parseOrderItems(Message message, ParserToOrderDto.ParserToOrderDtoBuilder dtoBuilder) {

        String from = getHeader(message, "From");
        String subject = getHeader(message, "Subject");
        ZonedDateTime orderTime = parsOrderTime(message);

        String html = GmailHtmlExtractor.extracHtml(message);

        // ------ [ dtoBuilder @ Param 현재 상태] ---------
        // @ Vendor vendor ==null
        // @ LocalDateTime orderDate == null
        // @ TukUsers user != null # 채워진 상태
        // @ List<ParserToOrderItemDto> itemList == null
        // ------------------------------------------------

        if (from.contains("coupang.com") || subject.contains("쿠팡")) {
            dtoBuilder
                    .emailId(message.getId())
                    .vendor(Vendor.COUPANG)
                    .status(ProcessingStatus.PROCESSED)
                    .orderDate(orderTime)
                    .itemList(htmlToParserOrderItem.parserCoupang(html));

        } else if (from.contains("woowahan.com") || subject.contains("배민 장보기")) {
            dtoBuilder
                    .emailId(message.getId())
                    .vendor(Vendor.BAEMIN)
                    .status(ProcessingStatus.PROCESSED)
                    .orderDate(orderTime)
                    .itemList(htmlToParserOrderItem.parserBaemin(html));

        } else if (from.contains("kurly.com") || subject.contains("컬리")) {
            dtoBuilder
                    .emailId(message.getId())
                    .vendor(Vendor.KERLY)
                    .status(ProcessingStatus.PROCESSED)
                    .orderDate(orderTime)
                    .itemList(htmlToParserOrderItem.parserKerly(html));

        } else {
            dtoBuilder.status(ProcessingStatus.FAILED).build();
            log.error(" GmailHtmlToOrderMap 의 parseOrderItems 에서 배민 | 쿠팡 | 컬리에 해당되는 메일이 아닙니다. Meesage : {}", message);
        }
    }

}
