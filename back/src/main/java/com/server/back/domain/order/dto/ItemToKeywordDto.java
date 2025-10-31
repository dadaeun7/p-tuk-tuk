package com.server.back.domain.order.dto;

import java.util.List;

import lombok.Builder;

@Builder
public record ItemToKeywordDto(
                Long id,
                String itemKeyword,
                String description,
                Boolean check,
                List<MaterialDto> materials) {

}
