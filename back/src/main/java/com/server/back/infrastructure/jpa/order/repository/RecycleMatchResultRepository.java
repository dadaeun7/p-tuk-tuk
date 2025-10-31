package com.server.back.infrastructure.jpa.order.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.server.back.domain.order.entity.RecycleMatchResult;

@Repository
public interface RecycleMatchResultRepository extends JpaRepository<RecycleMatchResult, Long> {
    List<RecycleMatchResult> findAll();
}
