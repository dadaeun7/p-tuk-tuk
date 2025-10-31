package com.server.back.infrastructure.jpa.order.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.server.back.domain.order.entity.MatchItemComposition;

@Repository
public interface MatchItemCompositionRepository extends JpaRepository<MatchItemComposition, Long> {

    @Query("SELECT mic FROM MatchItemComposition mic " +
            "LEFT JOIN FETCH mic.materials m " + // 연결되지 않은 Composition 포함 (LEFT JOIN)
            "WHERE mic.recycleMatchItem.id IN :rmiIds") // List<Long>으로 조회
    List<MatchItemComposition> findWithMaterialsByRecycleMatchItemIds(@Param("rmiIds") List<Long> rmiIds);

}
