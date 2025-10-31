package com.server.back.infrastructure.jpa.order.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.server.back.domain.order.entity.RecycleMatchItem;

@Repository
public interface RecycleMatchItemRepository extends JpaRepository<RecycleMatchItem, Long> {
    Optional<RecycleMatchItem> findByMatchName(String matchName);
}
