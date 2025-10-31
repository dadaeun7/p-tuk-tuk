package com.server.back.domain.order.entity;

import jakarta.persistence.CascadeType;
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
@Getter
@Table(name = "rec-order-item")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class RecycleOrderItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // 원본 상품명
    @Column(nullable = false)
    private String proudct;

    @Column(nullable = false)
    private int quantity;

    @ManyToOne(fetch = FetchType.LAZY, cascade = CascadeType.PERSIST)
    @JoinColumn(name = "rec_orders_id", nullable = false, referencedColumnName = "id")
    private RecycleOrder recOrder;

    public static RecycleOrderItem create() {
        return new RecycleOrderItem();
    }

    public void setProductAndQunatity(String proudct,
            int quantity) {
        this.proudct = proudct;
        this.quantity = quantity;
    }

    public void setOrder(RecycleOrder recOrder) {
        this.recOrder = recOrder;
    }
}
