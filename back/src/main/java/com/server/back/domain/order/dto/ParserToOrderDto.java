package com.server.back.domain.order.dto;

import java.time.ZonedDateTime;
import java.util.List;

import com.server.back.domain.email.entity.ProcessedEmail.ProcessingStatus;
import com.server.back.domain.order.entity.RecycleOrder.Vendor;
import com.server.back.domain.user.entity.TukUsers;

import lombok.Builder;

@Builder
public record ParserToOrderDto(
                String emailId,
                Vendor vendor,
                TukUsers user,
                ProcessingStatus status,
                ZonedDateTime orderDate,
                List<ParserToOrderItemDto> itemList) {
}
