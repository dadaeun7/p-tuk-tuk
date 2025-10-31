package com.server.back.domain.order.service.transactional;

import lombok.RequiredArgsConstructor;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

import org.springframework.stereotype.Service;

import org.springframework.transaction.annotation.Transactional;

import com.server.back.domain.order.dto.FinalMatchSubmitDto;
import com.server.back.domain.order.dto.MaterialDto;
import com.server.back.domain.order.entity.MatchItemComposition;
import com.server.back.domain.order.entity.Material;
import com.server.back.domain.order.entity.RecycleMatchItem;
import com.server.back.domain.order.entity.RecycleMatchResult;
import com.server.back.domain.order.service.cache.KeywordMaterialCacheComponent;
import com.server.back.infrastructure.jpa.order.repository.MatchItemCompositionRepository;

import jakarta.persistence.EntityNotFoundException;

@Service
@RequiredArgsConstructor
public class MatchCompositionSave {

    private final MatchItemCompositionRepository compositionRepository;
    private final KeywordMaterialCacheComponent keywordMaterialCacheComponent;

    @Transactional
    public void saveMatchItemComposition(RecycleMatchResult result, List<FinalMatchSubmitDto> dtoList) {

        List<RecycleMatchItem> items = result.getRecycleMatchItems();

        int cycle = items.size();

        for (int i = 0; i < cycle; i++) {
            MatchItemComposition mc = MatchItemComposition.create();
            mc.setResultItem(items.get(i));

            List<MaterialDto> materialDtos = dtoList.get(i).itemToKeywordDto().materials();
            Set<Material> materialsSet = new HashSet<>();

            List<Material> cacheMaterials = keywordMaterialCacheComponent.getMaterials();

            for (MaterialDto m : materialDtos) {
                Material searchM = cacheMaterials.stream()
                        .filter(cache -> cache.getName().equalsIgnoreCase(m.name())).findFirst()
                        .orElseThrow(() -> new EntityNotFoundException("Material 매칭에 실패했습니다!"));
                materialsSet.add(searchM);
            }
            mc.setMaterial(materialsSet);

            compositionRepository.save(mc);
        }

    }
}
