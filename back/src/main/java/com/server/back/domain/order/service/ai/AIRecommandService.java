package com.server.back.domain.order.service.ai;

import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Value;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.cloud.vertexai.VertexAI;
import com.google.cloud.vertexai.api.GenerateContentResponse;
import com.google.cloud.vertexai.api.GenerationConfig;
import com.google.cloud.vertexai.generativeai.GenerativeModel;
import com.google.cloud.vertexai.generativeai.ResponseHandler;
import com.server.back.domain.order.dto.AIRecommandDto;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class AIRecommandService {

    private final ObjectMapper objectMapper = new ObjectMapper();

    private static final String PROMPT_TEMPLATE = """
            당신은 한국의 분리배출 규정에 매우 익숙한 상품 카테고리 분류 전문가입니다. 주어진 '상품명'을 분석하여, 제시된 '카테고리 목록'과 비교하고 다음 규칙에 따라 답변해야 합니다.

            **규칙:**
            1.  답변은 반드시 JSON 형식이어야 합니다.
            2.  '카테고리 목록'에 적합한 것이 없다면, 반드시 주어진 상품명 일부가 포함 된 카테고리를 뽑고, 해당 카테고리의 **예상되는 분리배출 정보**를 함께 추천해야 합니다.
                -   이때 JSON 형식은 `{"categoryKeyword": "주어진 상품명 일부가 포함 된 카테고리", "materials": ["예상 재질1", "예상 재질2"], "description": "예상되는 분리배출 방법"}` 이어야 합니다.
                -   `materials` 필드는 아래 **'사용 가능한 재질 목록'에 있는 값만**을 사용해야 합니다.
                -   `description` 필드는 한국의 일반적인 분리배출 방법에 대한 간결한 설명이어야 합니다.
            3.  새로운 카테고리명은 간결한 명사 형태여야 합니다.

            **사용 가능한 재질 목록:**
            `PET`, `CAN`, `GLASS`, `PAPER`, `PAPER_PACK`, `VINYL`, `PLASTIC`, `STYROFOAM`, `GENERAL`, `SPECIAL_DISPOSAL`

            ---
            **상품명:** "%s"
            ---

            **JSON 답변:**
            """;

    @Value("${gcp.credentials.json}")
    private String gcpServiceAcoountKey;

    @Value("${google.gemini.model-name}")
    private String aiModel;

    @Value("${google.cloud.project.id}")
    private String projectId;

    @Value("${google.cloud.location}")
    private String location;

    private VertexAI vertexAI;
    private GenerativeModel model;
    private volatile boolean initialized = false;

    private synchronized void ensureInitialized() {

        if (initialized) {
            return;
        }
        log.info("===== PostConstruct 진입 =====");

        try {
            log.info("환경 변수 확인 projectId: {}, location: {}, model: {}",
                    projectId, location, aiModel);

            this.vertexAI = new VertexAI(projectId, location);
            log.info("VertexAI 생성 성공");

            GenerationConfig config = GenerationConfig.newBuilder()
                    .setTemperature(0.2f)
                    .setTopP(0.9f)
                    .setTopK(10)
                    .build();

            this.model = new GenerativeModel.Builder()
                    .setModelName(aiModel)
                    .setVertexAi(vertexAI)
                    .setGenerationConfig(config)
                    .build();

            initialized = true;
            log.info("===== Vertext AI 초기화 완료 =====");

        } catch (Exception e) {
            log.error("===== Vertex AI 초기화 실패 =====", e);
            log.error("상세 에러: {}", e.getMessage());
            e.printStackTrace();
        }
    }

    public Optional<AIRecommandDto> getRecommand(String itemName) {

        ensureInitialized();

        try {
            /**
             * Item Keyword (Redis Cache)
             * Keyword Specific (Spring cache)
             * 
             * 리스트 Setting
             */

            String prompt = String.format(PROMPT_TEMPLATE, itemName);
            GenerateContentResponse response = model.generateContent(prompt);

            String responseText = getResponseJson(ResponseHandler.getText(response).trim());

            log.info("Gemini response: AIRecommandService에서 해당 상품명에 대한 추천 내용입니다. [{}],{}", itemName, responseText);

            AIRecommandDto geminiResponse = objectMapper.readValue(responseText, AIRecommandDto.class);
            return Optional.of(geminiResponse);

        } catch (Exception e) {
            log.error("Error : AIRecommandService 에서 해당 상품명에 대한 에러입니다.[{}]: {} ", itemName, e.getMessage());
        }
        return Optional.empty();
    }

    private String getResponseJson(String responseText) {
        if (responseText == null) {
            return "{}";
        }

        int startIndex = responseText.indexOf("{");
        int endIndex = responseText.indexOf("}");

        if (startIndex == -1 || endIndex == -1 || endIndex < startIndex) {
            return "{}";
        }

        String getJson = responseText.substring(startIndex, endIndex + 1);
        return getJson;
    }
}
