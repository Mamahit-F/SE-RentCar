package com.example.rentalpartnership.repository;

import com.example.rentalpartnership.entity.TestConnection;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * Repository untuk TestConnection entity.
 * Digunakan hanya pada Phase 2 untuk memverifikasi koneksi JPA.
 */
@Repository
public interface TestConnectionRepository extends JpaRepository<TestConnection, Long> {
}
