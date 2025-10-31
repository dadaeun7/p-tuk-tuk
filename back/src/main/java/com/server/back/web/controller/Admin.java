package com.server.back.web.controller;

import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import com.server.back.domain.order.service.cache.KeywordMaterialCacheComponent;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
public class Admin {

    private final KeywordMaterialCacheComponent keywordMaterialCacheComponent;

    @GetMapping("/cache/keywordSpecific")
    public ResponseEntity<?> keywordSpecificCacheDelete() {

        keywordMaterialCacheComponent.deleteKeywordSpecifics();
        return ResponseEntity.ok(Map.of("message", "keyword-specific 캐시가 모두 삭제 되었습니다"));
    }
}
