package com.server.back.domain.order.service.ocr;

import java.util.List;

import org.springframework.stereotype.Service;

import com.server.back.domain.ocr.entity.OcrProduct;
import com.server.back.domain.ocr.entity.ProcessedOcr;
import com.server.back.domain.ocr.entity.ProcessedOcr.CheckStatus;
import com.server.back.domain.user.entity.TukUsers;
import com.server.back.infrastructure.jpa.ocr.repository.ProcessedOcrRepository;
import com.server.back.infrastructure.jpa.user.repository.TukUserRepository;

import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
@RequiredArgsConstructor
public class OcrToEntityService {

    private final TukUserRepository tukUserRepository;
    private final ProcessedOcrRepository processedOcrRepository;

    @Transactional
    public ProcessedOcr saveOcrToEntity(List<String> ocrList, Long userId, String imgUrl) {

        TukUsers user = tukUserRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("매칭 되는 유저가 없습니다."));

        ProcessedOcr processedOcr = ProcessedOcr.create();
        processedOcr.setProcessedOcr(user, imgUrl, CheckStatus.BEFORE);

        log.info("ocrList가 있는지 (크기)" + ocrList.size());
        log.info("ocrList가 있는지 (정보)" + ocrList);

        for (String string : ocrList) {
            OcrProduct product = OcrProduct.create();
            product.setOcrProductName(string);
            processedOcr.setProductOcr(product);
        }

        processedOcrRepository.save(processedOcr);

        return processedOcr;
    }
}
