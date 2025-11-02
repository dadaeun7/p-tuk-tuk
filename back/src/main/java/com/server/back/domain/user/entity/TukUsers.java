package com.server.back.domain.user.entity;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import com.server.back.domain.email.entity.ProcessedEmail;
import com.server.back.domain.ocr.entity.ProcessedOcr;
import com.server.back.domain.order.entity.RecycleOrder;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Entity
@Table(name = "tuk_users")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
@EntityListeners(AuditingEntityListener.class)
public class TukUsers {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String password;

    @Column(nullable = false, unique = true)
    private String myId;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private Provider provider;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private Role role;

    @CreatedDate
    @Column(updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime lastModifyAt;

    // 회원 탈퇴 여부
    @Column(nullable = true)
    private boolean active;

    // 사용자가 회원 탈퇴 처리한 시간
    @Column(nullable = true)
    private LocalDateTime exitAt;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "gmail_connect_id", referencedColumnName = "id")
    private GmailConnect gMail;

    @Builder.Default
    @Column(nullable = false)
    private String myLocation = "";

    @OneToMany(mappedBy = "byUser", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ProcessedOcr> processedOcr;

    @OneToMany(mappedBy = "recipientUser", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ProcessedEmail> processedEmail;

    @OneToMany(mappedBy = "connectUser", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<RecycleOrder> recycleOrders;

    public void setClientExitTime(LocalDateTime exitAt) {
        this.exitAt = exitAt;
    }

    public void updateAddress(String address) {
        this.myLocation = address;
    }

    public void updateGmail(GmailConnect gmailObj) {
        this.gMail = gmailObj;
    }

    public void deleteGmail(GmailConnect gmailObj) {
        if (this.gMail.getId() == gmailObj.getId()) {
            this.gMail = null;
        } else {
            log.error("요청 된 연동 아이디와 연결된 아이디가 일치하지 않습니다. 현재 연동 pk : {}, 요청 된 pk : {} ", this.gMail.getId(),
                    gmailObj.getId());
        }

    }

    public enum Role {
        USER, ADMIN
    }

    public enum Provider {
        LOCAL, KAKAO, NAVER, GOOGLE
    }

}
