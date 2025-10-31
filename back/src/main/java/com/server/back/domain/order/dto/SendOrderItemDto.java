package com.server.back.domain.order.dto;

import java.util.List;

import lombok.Builder;

@Builder
public record SendOrderItemDto(
                String product,
                int quantity,
                String description,
                List<SendMaterialDto> materials) {
}