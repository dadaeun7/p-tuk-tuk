package com.server.back.domain.order.dto;

import lombok.Builder;

@Builder
public record MaterialDto(
                String name,
                String display) {
}