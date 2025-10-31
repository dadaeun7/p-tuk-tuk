package com.server.back.domain.order.dto;

import lombok.Builder;

@Builder
public record ParserToOrderItemDto(
                String itemName,
                int quantity) {
}
