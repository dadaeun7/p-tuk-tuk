package com.server.back.domain.order.service;

import java.util.Objects;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.server.back.domain.order.dto.AIRecommandDto;
import com.server.back.domain.order.dto.FinalMatchSubmitDto;
import com.server.back.domain.order.dto.ItemToKeywordDto;
import com.server.back.domain.order.entity.RecycleMatchItem.ResultState;
import com.server.back.domain.order.service.ai.AIRecommandService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class RecycleMatchingService {

        /* 1차 ) 키워드, 세부 키워드, 재질 서비스 조회 서비스 */
        private final KeynameMatchRecycleService keynameMatchRecycleService;
        /* 2차 AI 추천 서비스 */
        private final AIRecommandService aiRecommandService;

        public FinalMatchSubmitDto findNextSaveRecycleInfo(String orderItemProduct)
                        throws Exception {

                Optional<ItemToKeywordDto> matchItemToKeyword = keynameMatchRecycleService.findMatch(orderItemProduct);

                log.info("itemKeyword 및 keywordSpecific 결과인 [matchItemToKeyword] 의 값은?: " + matchItemToKeyword);

                if (matchItemToKeyword.isPresent()) {
                        ItemToKeywordDto itemToKeyword = matchItemToKeyword.get();

                        log.info("keynameMatchRecycleService.findMatch 통해 매칭 되었습니다!");
                        return FinalMatchSubmitDto.builder()
                                        .itemToKeywordDto(itemToKeyword)
                                        .isAI(false)
                                        .status(ResultState.CONFIRMED)
                                        .build();
                }

                Optional<AIRecommandDto> aiRecommandResult = aiRecommandService.getRecommand(orderItemProduct);

                if (aiRecommandResult.isPresent()) {

                        AIRecommandDto result = aiRecommandResult.get();

                        log.info("변환 된 AIRecommandDto : " + result);

                        ItemToKeywordDto trueAI = ItemToKeywordDto.builder()
                                        .id(null)
                                        .itemKeyword(result.categoryKeyword())
                                        .description(result.description())
                                        .check(false)
                                        .materials(result.materials().stream()
                                                        .filter(name -> name != null && !name.trim().isEmpty())
                                                        .map(keynameMatchRecycleService::findMaterial)
                                                        .filter(Objects::nonNull)
                                                        .collect(Collectors.toList()))
                                        .build();

                        log.info("SUGGESTED에 의한 AIRecommandDto 의 키워드명 여부 확인 : " + trueAI.itemKeyword());
                        log.info("SUGGESTED에 의한 AIRecommandDto 의 설명 여부 확인 : " + trueAI.description());
                        log.info("SUGGESTED에 의한 AIRecommandDto 의 materials 여부 확인 : " + trueAI.materials());

                        return FinalMatchSubmitDto.builder()
                                        .itemToKeywordDto(trueAI)
                                        .isAI(true)
                                        .status(ResultState.NEED_REVIEW)
                                        .build();

                }

                return null;
        }

}
