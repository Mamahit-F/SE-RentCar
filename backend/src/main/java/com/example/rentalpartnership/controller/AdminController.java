package com.example.rentalpartnership.controller;

import com.example.rentalpartnership.dto.booking.BookingResponse;
import com.example.rentalpartnership.dto.common.ApiResponse;
import com.example.rentalpartnership.dto.dashboard.AdminDashboardStatsResponse;
import com.example.rentalpartnership.dto.rental.RentalAdminReviewRequest;
import com.example.rentalpartnership.dto.rental.RentalResponse;
import com.example.rentalpartnership.dto.user.UserResponse;
import com.example.rentalpartnership.entity.RentalStatus;
import com.example.rentalpartnership.entity.Role;
import com.example.rentalpartnership.service.BookingService;
import com.example.rentalpartnership.service.DashboardService;
import com.example.rentalpartnership.service.RentalPlaceService;
import com.example.rentalpartnership.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@Tag(name = "Admin Management", description = "Endpoints for platform administration, partner verification, and analytics")
public class AdminController {

    private final RentalPlaceService rentalPlaceService;
    private final UserService userService;
    private final BookingService bookingService;
    private final DashboardService dashboardService;

    // ==========================================
    // PARTNER APPLICATIONS (Rule 2: Verification)
    // ==========================================
    @GetMapping("/applications")
    @Operation(summary = "Get partner applications", description = "Fetches rental applications by status (default PENDING)")
    public ResponseEntity<ApiResponse<List<RentalResponse>>> getApplications(
            @RequestParam(required = false, defaultValue = "PENDING") RentalStatus status
    ) {
        return ResponseEntity.ok(ApiResponse.ok("Daftar pengajuan tempat rental", rentalPlaceService.getRentalsByStatus(status)));
    }

    @PutMapping("/applications/{id}/approve")
    @Operation(summary = "Approve partner rental", description = "Sets status to ACTIVE so rental and cars become discoverable")
    public ResponseEntity<ApiResponse<RentalResponse>> approveRental(@PathVariable Long id) {
        RentalResponse response = rentalPlaceService.approveRental(id);
        return ResponseEntity.ok(ApiResponse.ok("Pengajuan tempat rental berhasil disetujui", response));
    }

    @PutMapping("/applications/{id}/reject")
    @Operation(summary = "Reject partner rental", description = "Sets status to REJECTED with rejection reason")
    public ResponseEntity<ApiResponse<RentalResponse>> rejectRental(
            @PathVariable Long id,
            @RequestBody(required = false) RentalAdminReviewRequest request
    ) {
        RentalResponse response = rentalPlaceService.rejectRental(id, request);
        return ResponseEntity.ok(ApiResponse.ok("Pengajuan tempat rental berhasil ditolak", response));
    }

    // ==========================================
    // RENTAL MANAGEMENT
    // ==========================================
    @GetMapping("/rentals")
    @Operation(summary = "Get all rentals", description = "Returns all rental places across all statuses")
    public ResponseEntity<ApiResponse<List<RentalResponse>>> getAllRentals() {
        return ResponseEntity.ok(ApiResponse.ok("Semua data tempat rental", rentalPlaceService.getAllRentals()));
    }

    @PutMapping("/rentals/{id}/toggle-status")
    @Operation(summary = "Toggle rental active/inactive status", description = "Deactivates or reactivates an approved rental place")
    public ResponseEntity<ApiResponse<RentalResponse>> toggleRentalStatus(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok("Status rental berhasil diubah", rentalPlaceService.toggleRentalStatus(id)));
    }

    // ==========================================
    // USER & PARTNER MANAGEMENT
    // ==========================================
    @GetMapping("/users")
    @Operation(summary = "Get all users", description = "Fetches all registered accounts")
    public ResponseEntity<ApiResponse<List<UserResponse>>> getAllUsers() {
        return ResponseEntity.ok(ApiResponse.ok("Semua data pengguna", userService.getAllUsers()));
    }

    @GetMapping("/users/role/{role}")
    @Operation(summary = "Get users by role", description = "Fetches accounts by role (USER, PARTNER, ADMIN)")
    public ResponseEntity<ApiResponse<List<UserResponse>>> getUsersByRole(@PathVariable Role role) {
        return ResponseEntity.ok(ApiResponse.ok("Data pengguna dengan role " + role, userService.getUsersByRole(role)));
    }

    @PutMapping("/users/{id}/toggle-status")
    @Operation(summary = "Toggle user active status", description = "Deactivates or reactivates an account")
    public ResponseEntity<ApiResponse<UserResponse>> toggleUserStatus(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok("Status akun berhasil diubah", userService.toggleUserStatus(id)));
    }

    // ==========================================
    // GLOBAL BOOKINGS MONITORING
    // ==========================================
    @GetMapping("/bookings")
    @Operation(summary = "Get all bookings", description = "Global monitoring of all customer bookings")
    public ResponseEntity<ApiResponse<List<BookingResponse>>> getAllBookings() {
        return ResponseEntity.ok(ApiResponse.ok("Semua pesanan sewa", bookingService.getAllBookings()));
    }

    // ==========================================
    // DASHBOARD METRICS
    // ==========================================
    @GetMapping("/dashboard/stats")
    @Operation(summary = "Admin dashboard stats", description = "Platform-wide summary metrics")
    public ResponseEntity<ApiResponse<AdminDashboardStatsResponse>> getDashboardStats() {
        return ResponseEntity.ok(ApiResponse.ok("Statistik platform admin", dashboardService.getAdminStats()));
    }
}
