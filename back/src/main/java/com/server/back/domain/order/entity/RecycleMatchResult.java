package com.server.back.domain.order.entity;

import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.List;

import org.hibernate.annotations.BatchSize;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Entity
@Table(name = "rec_match_result")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Getter
public class RecycleMatchResult {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "rec_orders_id", referencedColumnName = "id")
    private RecycleOrder recOrder;

    @Column(nullable = true)
    private ZonedDateTime disposal;

    @BatchSize(size = 100)
    @OneToMany(mappedBy = "recMatchResult", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<RecycleMatchItem> recycleMatchItems = new ArrayList<>();

    public static RecycleMatchResult create() {
        return new RecycleMatchResult();
    }

    public void initialSet(RecycleOrder order) {
        this.recOrder = order;
    }

    public void setMatchItem(RecycleMatchItem reci) {
        this.recycleMatchItems.add(reci);

        if (reci.getRecMatchResult() != this) {
            reci.setMatchResult(this);

        }
    }

    public void setDisposal(ZonedDateTime time) {
        this.disposal = time;
    }

}
