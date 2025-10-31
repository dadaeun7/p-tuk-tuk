package com.server.back.infrastructure.jpa.order.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.server.back.domain.order.entity.ItemToKeyword;

@Repository
public interface ItemToKeywordRepository extends JpaRepository<ItemToKeyword, Long> {
    List<ItemToKeyword> findAll();

    Optional<ItemToKeyword> findByItemKeyword(String ItemKeyword);
}
