package com.server.back.infrastructure.jpa.order.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import com.server.back.domain.order.entity.KeywordSpecific;

@Repository
public interface KeywordSpecificRepository extends JpaRepository<KeywordSpecific, Long> {

    @Query(value = "SELECT ks FROM KeywordSpecific ks LEFT JOIN FETCH ks.itemToKeyword ik")
    List<KeywordSpecific> findAllWithItemToKeyword();

    List<KeywordSpecific> findAll();

}
