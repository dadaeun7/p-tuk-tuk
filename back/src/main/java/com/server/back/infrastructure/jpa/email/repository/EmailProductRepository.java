package com.server.back.infrastructure.jpa.email.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.server.back.domain.email.entity.EmailProduct;

public interface EmailProductRepository extends JpaRepository<EmailProduct, Long> {

}
