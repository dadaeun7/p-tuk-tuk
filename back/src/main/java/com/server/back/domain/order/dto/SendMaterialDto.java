package com.server.back.domain.order.dto;

import lombok.Builder;

@Builder
public record SendMaterialDto(
                String key,
                String name) {

}
