package com.server.back.domain.order.entity;

import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.List;

import org.hibernate.annotations.BatchSize;
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
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "rec_orders")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class RecycleOrder {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 32)
    private String orderNumber;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private Vendor vendor;

    @Column(nullable = false)
    private ZonedDateTime orderDate;

    @CreatedDate
    @Column(nullable = false)
    private ZonedDateTime createAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "connect_user_id", nullable = false)
    private TukUsers connectUser;

    @BatchSize(size = 100)
    @OneToMany(mappedBy = "recOrder", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<RecycleOrderItem> orderItems = new ArrayList<>();

    @OneToOne(mappedBy = "recOrder", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private RecycleMatchResult recycleResult;

    private String status;

    public enum Vendor {
        COUPANG, BAEMIN, KERLY, OCR
    }

    public static RecycleOrder create() {
        return new RecycleOrder();
    }

    public void initSet(TukUsers users, String orderNumber, String vendor, ZonedDateTime orderDate) {
        this.connectUser = users;
        this.orderNumber = orderNumber;
        this.vendor = Enum.valueOf(Vendor.class, vendor);
        this.orderDate = orderDate;
        this.createAt = ZonedDateTime.now(ZoneId.of("Asia/Seoul"));
    }

    public void setOrderItems(RecycleOrderItem orderItems) {
        this.orderItems.add(orderItems);
        orderItems.setOrder(this);
    }

    public void setStatus(String newStatus) {
        if (newStatus == null || newStatus.trim().isEmpty()) {
            throw new IllegalArgumentException("Recycle Order에 상태값은 비어있을 수 없습니다");
        }

        this.status = newStatus;
    }

    public void setRecycleResultToNull() {
        this.recycleResult = null;
    }

}
