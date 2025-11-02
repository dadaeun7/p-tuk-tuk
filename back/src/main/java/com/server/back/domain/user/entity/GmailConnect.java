package com.server.back.domain.user.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "gmail_connect")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Getter
public class GmailConnect {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String userId;

    @Column(nullable = false)
    private String showId;

    @Column(nullable = false)
    private String refreshToken;

    @OneToOne(mappedBy = "gMail")
    private TukUsers user;

    @Builder
    public GmailConnect(String userId, String refreshToken, String showId) {
        this.userId = userId;
        this.refreshToken = refreshToken;
        this.showId = showId;
    }

}
