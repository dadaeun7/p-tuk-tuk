package com.server.back.domain.order.dto;

import com.server.back.domain.order.entity.RecycleMatchItem.ResultState;

import lombok.Builder;

@Builder
public record FinalMatchSubmitDto(
                ItemToKeywordDto itemToKeywordDto,
                Boolean isAI,
                ResultState status) {
}
