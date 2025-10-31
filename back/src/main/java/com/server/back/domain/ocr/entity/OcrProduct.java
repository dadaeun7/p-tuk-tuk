package com.server.back.domain.ocr.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "ocr-product")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class OcrProduct {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column
    private String productName;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "processed_ocr_id", nullable = false)
    private ProcessedOcr processedOcr;

    public static OcrProduct create() {
        return new OcrProduct();
    };

    public void setOcrProductName(String productName) {
        this.productName = productName;
    }

    public void setProcessedOcr(ProcessedOcr processedOcr) {
        this.processedOcr = processedOcr;
    }

}
