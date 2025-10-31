package com.server.back.domain.order.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import com.server.back.domain.order.dto.ItemToKeywordDto;
import com.server.back.domain.order.dto.KeywordSpecificDto;
import com.server.back.domain.order.dto.MaterialDto;
import com.server.back.domain.order.entity.Material;
import com.server.back.domain.order.service.cache.ItemKeywordCacheService;
import com.server.back.domain.order.service.cache.KeywordMaterialCacheComponent;
import com.server.back.util.KeywordSplitUtil;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Component
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class KeynameMatchRecycleService {

    private final ItemKeywordCacheService itemKeywordCacheService;
    private final KeywordMaterialCacheComponent keywordMaterialCacheComponent;

    /**
     * ItemToKeyword
     * DB상 '/' 로 같이 붙어있는 경우가 있어, 복잡성으로 인해 Redis에 직접 저장키로함
     */

    public MaterialDto findMaterial(String name) {

        if (name == null || name.trim().isEmpty()) {
            return null;
        }

        List<Material> materials = keywordMaterialCacheComponent.getMaterials();

        return materials.stream().filter(m -> name.equals(m.getName()))
                .findFirst().map(material -> {
                    log.info("Material 정보 확인 완료 : " + material.getName());
                    return MaterialDto.builder().name(material.getName()).display(material.getDisplay()).build();
                }).orElse(null);

    }

    public Optional<ItemToKeywordDto> findMatch(String itemName) {

        /* [KeywordSpecific] 세부 키워드로 먼저 조회 */
        String modifyName = KeywordSplitUtil.cleanString(itemName);

        for (KeywordSpecificDto specific : keywordMaterialCacheComponent.getAllKeywordSpectifics()) {

            if (modifyName.contains(specific.keyword())) {
                log.info("KeywordSpecific 에서 매칭 되었습니다. 매칭명: " + specific);
                ItemToKeywordDto dto = itemKeywordCacheService.getItemKeywordDto(specific.itemToKewordId());
                log.info("KeywordSpecific 에서 추출한 itemToKeyword " + specific);
                return Optional.of(dto);
            }
        }

        /* [ItemToKeyword] 더 넓은 범위로 조회 */
        Optional<ItemToKeywordDto> getItemToKeywordDto = itemKeywordCacheService.findMatchItemToKeyword(itemName);

        if (getItemToKeywordDto != null) {
            return getItemToKeywordDto;
        }

        return Optional.empty();
    }

}
