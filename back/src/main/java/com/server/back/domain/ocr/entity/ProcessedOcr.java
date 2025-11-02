package com.server.back.domain.ocr.entity;

import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.List;

import org.springframework.data.annotation.CreatedDate;
import com.server.back.domain.user.entity.TukUsers;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "processed_ocr")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class ProcessedOcr {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "by_user_id", nullable = false)
    private TukUsers byUser;

    @OneToMany(mappedBy = "processedOcr", cascade = CascadeType.ALL, orphanRemoval = true)
    List<OcrProduct> ocrProductList = new ArrayList<OcrProduct>();

    @Column(nullable = false, length = 512)
    private String imgUrl;

    @Enumerated(EnumType.STRING)
    private CheckStatus status;

    @CreatedDate
    @Column
    private ZonedDateTime createDate;

    public enum CheckStatus {
        BEFORE, SUCCESS
    }

    public static ProcessedOcr create() {
        return new ProcessedOcr();
    }

    public void setProcessedOcr(TukUsers user, String imgUrl, CheckStatus status) {
        this.byUser = user;
        this.imgUrl = imgUrl;
        this.status = status;
        this.createDate = ZonedDateTime.now(ZoneId.of("Asia/Seoul"));
    }

    public void setProductOcr(OcrProduct ocrProduct) {
        this.ocrProductList.add(ocrProduct);
        ocrProduct.setProcessedOcr(this);
    }

}
