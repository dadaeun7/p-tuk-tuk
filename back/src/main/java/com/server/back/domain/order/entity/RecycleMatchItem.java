package com.server.back.domain.order.entity;

import java.util.ArrayList;
import java.util.List;

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
@Getter
@Table(name = "rec_match_item")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class RecycleMatchItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String matchName;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "rec_match_result_id", referencedColumnName = "id")
    private RecycleMatchResult recMatchResult;

    @OneToMany(mappedBy = "recycleMatchItem", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<MatchItemComposition> compositions = new ArrayList<>();

    @Column(length = 500, nullable = true)
    private String matchDescription;

    @Column
    private boolean isAiRecommand; // AI 의해 추천된 결과인가?

    @Enumerated(EnumType.STRING)
    private ResultState status; // ai가 true 일 때, 선 저장 된 주문건에 대한 수정

    public enum ResultState {
        CONFIRMED,
        NEED_REVIEW
    }

    public static RecycleMatchItem create() {
        return new RecycleMatchItem();
    }

    public void setMatchName(String matchName, boolean isAiRecommand, ResultState status, String matchDescription) {
        this.matchName = matchName;
        this.isAiRecommand = isAiRecommand;
        this.status = status;
        this.matchDescription = matchDescription;
    }

    public void setMatchResult(RecycleMatchResult result) {
        this.recMatchResult = result;
    }
}
