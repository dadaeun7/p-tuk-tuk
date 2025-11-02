package com.server.back.domain.order.entity;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import com.server.back.domain.order.dto.ItemToKeywordDto;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Entity
@ToString
@Getter
@Table(name = "item_keyword")
@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "id")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class ItemToKeyword {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String itemKeyword;

    @Column(length = 500)
    private String description;

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(name = "keyword_material_relation", joinColumns = @JoinColumn(name = "keyword_material_id"), inverseJoinColumns = @JoinColumn(name = "material_id"))
    private List<Material> materials;

    public static ItemToKeyword create() {
        return new ItemToKeyword();
    }

    public void setMaterials(List<Material> materials) {
        this.materials = materials;
    }

    public void converToEntity(ItemToKeywordDto dto) {
        this.id = dto.id();
        this.itemKeyword = dto.itemKeyword();
        this.description = dto.description();
    }

}
