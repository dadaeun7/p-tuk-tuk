package com.server.back.infrastructure.jpa.order.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.server.back.domain.order.entity.RecycleOrderItem;

@Repository
public interface OrderItemRepository extends JpaRepository<RecycleOrderItem, Long> {
}
