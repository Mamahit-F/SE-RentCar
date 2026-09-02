package com.example.rentalpartnership.controller;

import com.example.rentalpartnership.dto.common.ApiResponse;
import com.example.rentalpartnership.entity.TestConnection;
import com.example.rentalpartnership.repository.TestConnectionRepository;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.sql.DataSource;

import java.sql.Connection;
import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/health")
@Tag(
        name = "Health Check",
        description = "Endpoints for verifying system health and database connectivity"
)
public class HealthController {

    private final DataSource dataSource;
    private final TestConnectionRepository testConnectionRepository;

    // ============================================================
    // CONSTRUCTOR
    // ============================================================

    public HealthController(
            DataSource dataSource,
            TestConnectionRepository testConnectionRepository) {

        this.dataSource = dataSource;
        this.testConnectionRepository = testConnectionRepository;
    }

    // ============================================================
    // TEST 5: BASIC HEALTH CHECK
    // GET /api/health
    // ============================================================

    @GetMapping
    @Operation(
            summary = "Health check",
            description = "Checks if the Spring Boot backend is UP"
    )
    public ResponseEntity<ApiResponse<Map<String, Object>>> checkHealth() {

        Map<String, Object> details = new LinkedHashMap<>();

        details.put("status", "UP");
        details.put(
                "service",
                "Sistem Partnership Rental Mobil API"
        );
        details.put("version", "1.0.0");
        details.put(
                "javaVersion",
                System.getProperty("java.version")
        );
        details.put(
                "springBootVersion",
                "3.3.3"
        );
        details.put(
                "serverTime",
                LocalDateTime.now().toString()
        );
        details.put(
                "phase",
                "Phase 2 — Database Foundation"
        );

        return ResponseEntity.ok(
                ApiResponse.ok(
                        "Backend is UP and running",
                        details
                )
        );
    }

    // ============================================================
    // TEST 3 & 4: DATABASE CONNECTIVITY
    // GET /api/health/db
    // GET /api/health/db-check
    // ============================================================

    @GetMapping({"/db", "/db-check"})
    @Operation(
            summary = "Database health check",
            description = "Verifies PostgreSQL connection via JDBC and JPA repository"
    )
    public ResponseEntity<ApiResponse<Map<String, Object>>> checkDatabase() {

        Map<String, Object> dbStatus = new LinkedHashMap<>();

        // --------------------------------------------------------
        // 1. TEST RAW JDBC CONNECTION
        // --------------------------------------------------------

        try (Connection connection = dataSource.getConnection()) {

            boolean isValid = connection.isValid(2);

            dbStatus.put(
                    "jdbcConnected",
                    isValid
            );

            dbStatus.put(
                    "databaseProductName",
                    connection
                            .getMetaData()
                            .getDatabaseProductName()
            );

            dbStatus.put(
                    "databaseProductVersion",
                    connection
                            .getMetaData()
                            .getDatabaseProductVersion()
            );

            dbStatus.put(
                    "databaseUrl",
                    connection
                            .getMetaData()
                            .getURL()
            );

        } catch (Exception ex) {

            dbStatus.put(
                    "jdbcConnected",
                    false
            );

            dbStatus.put(
                    "jdbcError",
                    ex.getMessage()
            );
        }

        // --------------------------------------------------------
        // 2. TEST JPA REPOSITORY
        // --------------------------------------------------------

        try {

            long count = testConnectionRepository.count();

            dbStatus.put(
                    "jpaRepositoryWorking",
                    true
            );

            dbStatus.put(
                    "testTableRowCount",
                    count
            );

        } catch (Exception ex) {

            dbStatus.put(
                    "jpaRepositoryWorking",
                    false
            );

            dbStatus.put(
                    "jpaError",
                    ex.getMessage()
            );
        }

        // --------------------------------------------------------
        // 3. DETERMINE OVERALL DATABASE STATUS
        // --------------------------------------------------------

        boolean allGood =
                Boolean.TRUE.equals(
                        dbStatus.get("jdbcConnected")
                )
                &&
                Boolean.TRUE.equals(
                        dbStatus.get("jpaRepositoryWorking")
                );

        return ResponseEntity.ok(
                ApiResponse.ok(
                        allGood
                                ? "Database connection and JPA are fully operational"
                                : "Database connectivity issue detected",
                        dbStatus
                )
        );
    }

    // ============================================================
    // TEST: DATABASE WRITE
    // POST /api/health/db/test-write
    // ============================================================

    @PostMapping("/db/test-write")
    @Operation(
            summary = "Write test to database",
            description = "Inserts a test record to verify JPA write operations on PostgreSQL"
    )
    public ResponseEntity<ApiResponse<TestConnection>> testDatabaseWrite() {

        TestConnection record =
                TestConnection.builder()
                        .name("Phase 2 Connection Test")
                        .description(
                                "Record ini dibuat secara otomatis untuk memverifikasi JPA write. Aman untuk dihapus."
                        )
                        .build();

        TestConnection saved =
                testConnectionRepository.save(record);

        return ResponseEntity.ok(
                ApiResponse.ok(
                        "Test record berhasil ditulis ke database PostgreSQL",
                        saved
                )
        );
    }

    // ============================================================
    // TEST: READ DATABASE RECORDS
    // GET /api/health/db/test-records
    // ============================================================

    @GetMapping("/db/test-records")
    @Operation(
            summary = "Read test records",
            description = "Reads all test records from the database to verify JPA read operations"
    )
    public ResponseEntity<ApiResponse<List<TestConnection>>> readTestRecords() {

        List<TestConnection> records =
                testConnectionRepository.findAll();

        return ResponseEntity.ok(
                ApiResponse.ok(
                        "Berhasil membaca "
                                + records.size()
                                + " record dari database",
                        records
                )
        );
    }
}
