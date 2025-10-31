package com.server.back.infrastructure.jpa.ocr.repository;

import java.time.ZonedDateTime;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.server.back.domain.ocr.entity.ProcessedOcr;

@Repository
public interface ProcessedOcrRepository extends JpaRepository<ProcessedOcr, Long> {

    ProcessedOcr findByCreateDate(ZonedDateTime createDate);
}
