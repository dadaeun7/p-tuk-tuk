package com.server.back.domain.order.entity;

import java.util.HashSet;
import java.util.Set;

import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Entity
@Getter
@Table(name = "match-item-composition")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class MatchItemComposition {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "recycle_match_item_id", referencedColumnName = "id")
    private RecycleMatchItem recycleMatchItem;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(name = "match_item_material", joinColumns = @JoinColumn(name = "match_item_composition_id"), inverseJoinColumns = @JoinColumn(name = "material_id"))
    private Set<Material> materials = new HashSet<>();

    public static MatchItemComposition create() {
        return new MatchItemComposition();
    }

    public void setResultItem(RecycleMatchItem recycleMatchItem) {
        this.recycleMatchItem = recycleMatchItem;
    }

    public void setMaterial(Set<Material> materials) {
        this.materials = materials;
    }

}
