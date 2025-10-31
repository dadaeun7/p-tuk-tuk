package com.server.back.web.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.server.back.domain.ocr.entity.ProcessedOcr;
import com.server.back.domain.order.service.ocr.ProcessingOcrService;
import com.server.back.infrastructure.jpa.ocr.repository.ProcessedOcrRepository;
import com.server.back.infrastructure.security.TukUserDetails;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
public class OcrToOrderController {

    private final ProcessedOcrRepository processedOcrRepository;
    private final ProcessingOcrService processingOcrService;

    @PostMapping("/bring/ocr")
    public ResponseEntity<?> saveOcrToOrder(@RequestParam("file") MultipartFile file,
            @AuthenticationPrincipal TukUserDetails user) {
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body("파일이 없으므로 업로드 할 수 없습니다");
        }

        processingOcrService.processingHandleOcr(file, user.getId());
        return ResponseEntity.ok().body("정상적으로 OCR 요청이 들어갔습니다!");
    }

    @GetMapping("/admin/receipts/{receiptId}")
    public ResponseEntity<ProcessedOcr> getOcrDetails(@PathVariable Long ocrId) {

        ProcessedOcr pOcr = processedOcrRepository.findById(ocrId)
                .orElseThrow(() -> new EntityNotFoundException("관련 OCR 이 없습니다"));

        return ResponseEntity.ok(pOcr);
    }

}
