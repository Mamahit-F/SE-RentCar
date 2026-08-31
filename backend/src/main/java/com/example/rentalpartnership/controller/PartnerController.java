package com.example.rentalpartnership.controller;

import com.example.rentalpartnership.dto.booking.BookingResponse;
import com.example.rentalpartnership.dto.booking.BookingStatusUpdateRequest;
import com.example.rentalpartnership.dto.car.CarCreateRequest;
import com.example.rentalpartnership.dto.car.CarResponse;
import com.example.rentalpartnership.dto.car.CarUpdateRequest;
import com.example.rentalpartnership.dto.common.ApiResponse;
import com.example.rentalpartnership.dto.dashboard.PartnerDashboardStatsResponse;
import com.example.rentalpartnership.dto.rental.RentalCreateRequest;
import com.example.rentalpartnership.dto.rental.RentalResponse;
import com.example.rentalpartnership.dto.rental.RentalUpdateRequest;
import com.example.rentalpartnership.service.BookingService;
import com.example.rentalpartnership.service.CarService;
import com.example.rentalpartnership.service.DashboardService;
import com.example.rentalpartnership.service.RentalPlaceService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/partner")
@RequiredArgsConstructor
@Tag(name = "Partner Management", description = "Endpoints for rental place partners (Fleet, Bookings, Applications)")
public class PartnerController {

    private final RentalPlaceService rentalPlaceService;
    private final CarService carService;
    private final BookingService bookingService;
    private final DashboardService dashboardService;

    // ==========================================
    // RENTAL PLACE APPLICATION & PROFILE
    // ==========================================
    @PostMapping("/rentals")
    @Operation(summary = "Submit rental place application", description = "Creates a new rental place application (Status PENDING)")
    public ResponseEntity<ApiResponse<RentalResponse>> submitRental(@Valid @RequestBody RentalCreateRequest request) {
        RentalResponse response = rentalPlaceService.submitRentalApplication(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok("Pengajuan tempat rental berhasil dikirim dan menunggu verifikasi Admin", response));
    }

    @GetMapping("/rentals")
    @Operation(summary = "Get own rental places", description = "List all rental places owned by logged in partner")
    public ResponseEntity<ApiResponse<List<RentalResponse>>> getMyRentals() {
        return ResponseEntity.ok(ApiResponse.ok("Daftar tempat rental saya", rentalPlaceService.getMyRentalPlaces()));
    }

    @GetMapping("/rentals/{id}")
    @Operation(summary = "Get own rental place detail", description = "Fetch own rental place detail")
    public ResponseEntity<ApiResponse<RentalResponse>> getMyRentalById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok("Detail tempat rental", rentalPlaceService.getMyRentalPlaceById(id)));
    }

    @PutMapping("/rentals/{id}")
    @Operation(summary = "Update own rental place", description = "Updates rental place details (resets to PENDING if rejected)")
    public ResponseEntity<ApiResponse<RentalResponse>> updateMyRental(@PathVariable Long id, @Valid @RequestBody RentalUpdateRequest request) {
        return ResponseEntity.ok(ApiResponse.ok("Data tempat rental berhasil diperbarui", rentalPlaceService.updateMyRentalPlace(id, request)));
    }

    // ==========================================
    // CAR / FLEET MANAGEMENT
    // ==========================================
    @PostMapping("/cars")
    @Operation(summary = "Add car to fleet", description = "Adds a new car to the partner's active rental place")
    public ResponseEntity<ApiResponse<CarResponse>> createCar(@Valid @RequestBody CarCreateRequest request) {
        CarResponse response = carService.createCar(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok("Mobil berhasil ditambahkan ke armada rental", response));
    }

    @GetMapping("/cars")
    @Operation(summary = "List own cars", description = "Fetches all fleet cars belonging to partner")
    public ResponseEntity<ApiResponse<List<CarResponse>>> getMyCars() {
        return ResponseEntity.ok(ApiResponse.ok("Daftar armada mobil", carService.getMyCars()));
    }

    @GetMapping("/cars/{id}")
    @Operation(summary = "Get own car detail", description = "Fetches detail of a partner's car")
    public ResponseEntity<ApiResponse<CarResponse>> getMyCarById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok("Detail mobil", carService.getMyCarById(id)));
    }

    @PutMapping("/cars/{id}")
    @Operation(summary = "Update own car", description = "Updates specifications and status of a partner's car")
    public ResponseEntity<ApiResponse<CarResponse>> updateMyCar(@PathVariable Long id, @Valid @RequestBody CarUpdateRequest request) {
        return ResponseEntity.ok(ApiResponse.ok("Mobil berhasil diperbarui", carService.updateMyCar(id, request)));
    }

    @DeleteMapping("/cars/{id}")
    @Operation(summary = "Deactivate own car", description = "Deactivates a car from active fleet")
    public ResponseEntity<ApiResponse<Void>> deleteMyCar(@PathVariable Long id) {
        carService.deleteMyCar(id);
        return ResponseEntity.ok(ApiResponse.ok("Mobil berhasil dinonaktifkan", null));
    }

    // ==========================================
    // BOOKING MANAGEMENT
    // ==========================================
    @GetMapping("/bookings")
    @Operation(summary = "Get incoming bookings", description = "Fetches all customer bookings made on partner's fleet")
    public ResponseEntity<ApiResponse<List<BookingResponse>>> getPartnerBookings() {
        return ResponseEntity.ok(ApiResponse.ok("Daftar pesanan masuk", bookingService.getPartnerBookings()));
    }

    @PutMapping("/bookings/{id}/status")
    @Operation(summary = "Update booking status", description = "Allows partner to CONFIRM, REJECT, or COMPLETE booking")
    public ResponseEntity<ApiResponse<BookingResponse>> updateBookingStatus(
            @PathVariable Long id,
            @Valid @RequestBody BookingStatusUpdateRequest request
    ) {
        BookingResponse response = bookingService.updateBookingStatusByPartner(id, request.getStatus());
        return ResponseEntity.ok(ApiResponse.ok("Status booking berhasil diperbarui", response));
    }

    // ==========================================
    // DASHBOARD METRICS
    // ==========================================
    @GetMapping("/dashboard/stats")
    @Operation(summary = "Partner dashboard stats", description = "Counters for cars, orders, and ratings")
    public ResponseEntity<ApiResponse<PartnerDashboardStatsResponse>> getDashboardStats() {
        return ResponseEntity.ok(ApiResponse.ok("Statistik dashboard partner", dashboardService.getPartnerStats()));
    }
}
