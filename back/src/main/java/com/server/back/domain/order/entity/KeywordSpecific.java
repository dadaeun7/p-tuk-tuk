package com.server.back.domain.order.entity;

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
import lombok.ToString;

@Entity
@ToString
@Getter
@Table(name = "keyword_specific")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class KeywordSpecific {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String specificKeyword;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "item_to_keyword_id", nullable = false, referencedColumnName = "id")
    private ItemToKeyword itemToKeyword;
}
