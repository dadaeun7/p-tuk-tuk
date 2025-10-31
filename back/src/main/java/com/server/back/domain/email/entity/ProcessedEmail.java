package com.server.back.domain.email.entity;

import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.List;

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
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "processed-email")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class ProcessedEmail {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // mail 의 고유 ID를 등록하여 ,차후 중복 메일 방지
    @Column(unique = true, nullable = false)
    private String mailId;

    @Enumerated(EnumType.STRING)
    private ProcessingStatus status;

    @Column(nullable = false)
    private String sendor;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "recipient_user_id", nullable = false)
    private TukUsers recipientUser;

    @OneToMany(mappedBy = "processedEmail", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<EmailProduct> productList = new ArrayList<EmailProduct>();

    @Column(nullable = false)
    private ZonedDateTime orderDate;

    public enum ProcessingStatus {
        PROCESSED, SKIPPED, FAILED
    }

    @Builder
    public ProcessedEmail(
            String mailId,
            String sendor,
            TukUsers recipient,
            ProcessingStatus status,
            ZonedDateTime orderDate) {
        this.mailId = mailId;
        this.sendor = sendor;
        this.recipientUser = recipient;
        this.orderDate = orderDate;
        this.status = status;
    }

    public void addEmailProduct(EmailProduct product) {
        this.productList.add(product);
        product.setProcessedEmail(this);
    }

    public void modifyStatus(ProcessingStatus status) {
        this.status = status;
    }

}
