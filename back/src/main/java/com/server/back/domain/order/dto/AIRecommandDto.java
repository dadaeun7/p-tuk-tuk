package com.server.back.domain.order.dto;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public record AIRecommandDto(String categoryKeyword, List<String> materials, String description) {

}
