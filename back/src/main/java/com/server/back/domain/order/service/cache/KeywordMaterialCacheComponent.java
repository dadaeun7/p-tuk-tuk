package com.server.back.domain.order.service.cache;

import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Component;

import com.server.back.domain.order.dto.KeywordSpecificDto;
import com.server.back.domain.order.entity.KeywordSpecific;
import com.server.back.domain.order.entity.Material;
import com.server.back.infrastructure.jpa.order.repository.KeywordSpecificRepository;
import com.server.back.infrastructure.jpa.order.repository.MaterialRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Component
@RequiredArgsConstructor
public class KeywordMaterialCacheComponent {

    private final KeywordSpecificRepository keywordSpecificRepository;
    private final MaterialRepository materialRepository;

    @Cacheable(value = "keywordSpecific", key = "'sortedByLength'", sync = true)
    public List<KeywordSpecificDto> getAllKeywordSpectifics() {

        log.info("### 캐시 없음. DB에서 키워드를 직접 조회합니다");

        List<KeywordSpecific> dbKeyword = keywordSpecificRepository.findAllWithItemToKeyword();
        dbKeyword.sort(
                Comparator.comparingInt((KeywordSpecific c) -> c.getSpecificKeyword().trim().length()).reversed());

        return dbKeyword.stream()
                .map(entity -> new KeywordSpecificDto(entity.getSpecificKeyword().trim(),
                        entity.getItemToKeyword().getId()))
                .collect(Collectors.toList());
    }

    @CacheEvict(value = "keywordSpecific", allEntries = true)
    public void deleteKeywordSpecifics() {
        log.info("keywordSpecific 캐시를 모두 지웠습니다!");
    }

    @Cacheable(value = "materials", key = "'all'", sync = true)
    public List<Material> getMaterials() {
        return materialRepository.findAll();
    }

}
