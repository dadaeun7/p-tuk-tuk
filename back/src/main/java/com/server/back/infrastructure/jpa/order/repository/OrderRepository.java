package com.server.back.infrastructure.jpa.order.repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.server.back.domain.order.entity.RecycleOrder;

@Repository
public interface OrderRepository extends JpaRepository<RecycleOrder, Long> {
    Boolean existsByOrderDate(LocalDateTime orderDate);

    @Query("SELECT o FROM RecycleOrder o " +
            "JOIN o.recycleResult rmr " + // Order -> MatchResult (1:1)
            "WHERE o.connectUser.id = :userId")
    List<RecycleOrder> findFullDetailByUserId(@Param("userId") Long userId);

    List<RecycleOrder> findByOrderNumberIn(List<String> orderNumber);

    Optional<RecycleOrder> findByOrderNumber(String orderNumber);
}
