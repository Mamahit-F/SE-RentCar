package com.example.rentalpartnership.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

/**
 * Entity sederhana untuk memverifikasi koneksi JPA ke PostgreSQL.
 * Entity ini hanya digunakan sebagai sanity check pada Phase 2.
 * Akan dihapus / digantikan oleh entity final pada Phase 3.
 *
 * Table: test_connections
 */
@Entity
@Table(name = "test_connections")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TestConnection {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "name", nullable = false, length = 255)
    private String name;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
}
