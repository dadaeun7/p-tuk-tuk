package com.server.back.domain.order.service.cache;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.data.redis.core.Cursor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.ScanOptions;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.server.back.domain.order.dto.ItemToKeywordDto;
import com.server.back.domain.order.dto.MaterialDto;
import com.server.back.domain.order.entity.ItemToKeyword;
import com.server.back.domain.order.entity.Material;
import com.server.back.util.KeywordSplitUtil;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class ItemKeywordCacheService {

    @Qualifier("keyworCacheTemplate")
    private final RedisTemplate<String, ItemToKeywordDto> keyworCacheTemplate;

    @Qualifier("keywordSplitCacheTemplate")
    private final RedisTemplate<String, Long> keywordSplitCacheTemplate;

    @Qualifier("stringRedisTemplate")
    private final StringRedisTemplate stringRedisTemplate;

    private Set<String> allSplitKeywords = new HashSet<>();

    public static final String ITEM_KEYWORD_CACHE = "ITEM_KEYWORD_CACHE::";
    // public static final String KEYWORD_SPLIT_INDEX = "KEYWORD_SPLIT_INDEX::";

    @Transactional
    public void updateAndAddKeyword(ItemToKeyword itemKeyword) {

        /*
         * 강제 초기화 : LAZY 로딩 유발
         * EAGER 세팅 했으나, 프록시 잔존 여부 제거
         */
        itemKeyword.getMaterials().size();
        ItemToKeywordDto ItemToKeywordDto = convertToItemToKeywordDto(itemKeyword);
        keyworCacheTemplate.opsForValue().set(ITEM_KEYWORD_CACHE + itemKeyword.getId(), ItemToKeywordDto);

        List<String> keywordIndexs = KeywordSplitUtil.splitKeywords(itemKeyword.getItemKeyword());

        for (String keyword : keywordIndexs) {
            keywordSplitCacheTemplate.opsForValue().set(keyword, itemKeyword.getId());
            allSplitKeywords.add(keyword);
        }

    }

    public List<String> getItemKeywords() {
        return allSplitKeywords.stream().collect(Collectors.toList());
    }

    public ItemToKeywordDto getItemKeywordDto(Long itemId) {
        return keyworCacheTemplate.opsForValue().get(ITEM_KEYWORD_CACHE + itemId);
    }

    public void initJvmItemKeywordCache() {

        String pattern = "*";

        this.allSplitKeywords.clear();

        ScanOptions option = ScanOptions.scanOptions().match(pattern).count(1000).build();

        try (Cursor<String> curosr = stringRedisTemplate.scan(option)) {

            while (curosr.hasNext()) {
                String key = curosr.next();
                this.allSplitKeywords.add(key);
            }

        } catch (Exception e) {
            log.error("####### [ItemKeywordCacheService] 에서 세부 아이템 key들을 JVM에 저장하는 중 오류가 발생했습니다 : " + e.getMessage());
        }

        log.info("####### [ItemKeywordCacheService] 에서 세부 아이템 key들을 JVM에 저장이 완료 되었습니다. 완료 수 : "
                + allSplitKeywords.size());
    }

    public Optional<ItemToKeywordDto> findMatchItemToKeyword(String productName) {

        String modifyName = KeywordSplitUtil.cleanString(productName);

        List<String> sortedKeywords = new ArrayList<>(this.allSplitKeywords);
        sortedKeywords.sort(Comparator.comparingInt(String::length).reversed());

        for (String key : sortedKeywords) {

            if (modifyName.contains(key)) {

                Long itemId = keywordSplitCacheTemplate.opsForValue().get(key);
                String findKey = ITEM_KEYWORD_CACHE + itemId;
                ItemToKeywordDto subItemToKeyword = keyworCacheTemplate.opsForValue().get(findKey);
                log.info("[REDIS CACHE]  ItemKeywordCache 키워드의 반환되는 값은?" + subItemToKeyword);
                return Optional.ofNullable(subItemToKeyword);
            }
        }

        log.info("[REDIS CACHE]  ItemKeywordCache 매칭 실패 NULL 로 반환 ... ");
        return null;
    }

    private ItemToKeywordDto convertToItemToKeywordDto(ItemToKeyword itemToKeyword) {

        if (itemToKeyword == null) {
            log.info("Cache 저장 중 itemToKeyword 을 DTO 변환 중 오류가 발생했습니다");
            return null;

        }

        List<MaterialDto> materialsDto = new ArrayList<>();

        if (itemToKeyword.getMaterials() != null) {
            materialsDto = itemToKeyword.getMaterials().stream().map(this::convertToMaterialDto)
                    .collect(Collectors.toList());
        }

        ItemToKeywordDto dto = ItemToKeywordDto.builder()
                .id(itemToKeyword.getId())
                .itemKeyword(itemToKeyword.getItemKeyword())
                .description(itemToKeyword.getDescription())
                .check(true)
                .materials(materialsDto)
                .build();

        return dto;

    }

    public MaterialDto convertToMaterialDto(Material material) {

        if (material == null) {
            log.info("Cache 저장 중 itemToKeyword 의 material DTO 변환 중 오류가 발생했습니다");
            return null;
        }

        MaterialDto dto = MaterialDto.builder()
                .name(material.getName())
                .display(material.getDisplay())
                .build();

        return dto;
    }
}
