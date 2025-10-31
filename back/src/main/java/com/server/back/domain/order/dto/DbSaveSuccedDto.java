package com.server.back.domain.order.dto;

import lombok.Builder;

@Builder
public record DbSaveSuccedDto(
        Long userId,
        String event,
        String meesage) {
}
