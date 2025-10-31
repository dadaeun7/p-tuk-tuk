package com.server.back.domain.email.entity;

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
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "email-product")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class EmailProduct {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String productName;

    @Column(nullable = false)
    private int quantity;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "processed_email_id", nullable = false)
    private ProcessedEmail processedEmail;

    @Builder
    public EmailProduct(String productName, int quantity, ProcessedEmail processedEmail) {
        this.productName = productName;
        this.quantity = quantity;
        this.processedEmail = processedEmail;
    }

    protected void setProcessedEmail(ProcessedEmail email) {
        this.processedEmail = email;
    }
}
