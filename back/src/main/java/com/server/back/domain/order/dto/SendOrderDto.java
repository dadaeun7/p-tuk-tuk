package com.server.back.domain.order.dto;

import java.time.ZonedDateTime;
import java.util.List;

import lombok.Builder;

@Builder
public record SendOrderDto(
        String orderNumber,
        String vendor,
        ZonedDateTime orderDate,
        List<SendOrderItemDto> orderitems,
        ZonedDateTime disposalDate) {
}
