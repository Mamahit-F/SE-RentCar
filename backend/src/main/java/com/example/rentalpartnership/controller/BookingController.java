package com.example.rentalpartnership.controller;

import com.example.rentalpartnership.dto.booking.BookingCreateRequest;
import com.example.rentalpartnership.dto.booking.BookingResponse;
import com.example.rentalpartnership.dto.common.ApiResponse;
import com.example.rentalpartnership.service.BookingService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
@Tag(name = "Customer Bookings", description = "Endpoints for creating and tracking car rental bookings")
public class BookingController {

    private final BookingService bookingService;

    @PostMapping
    @Operation(summary = "Create car booking", description = "Books a car with dates conflict checking & server calculated price")
    public ResponseEntity<ApiResponse<BookingResponse>> createBooking(@Valid @RequestBody BookingCreateRequest request) {
        BookingResponse response = bookingService.createBooking(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok("Booking berhasil dibuat. Silakan lakukan pembayaran.", response));
    }

    @GetMapping("/my")
    @Operation(summary = "Get my bookings", description = "Fetches all bookings created by logged in customer")
    public ResponseEntity<ApiResponse<List<BookingResponse>>> getMyBookings() {
        return ResponseEntity.ok(ApiResponse.ok("Daftar booking saya", bookingService.getMyBookings()));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get booking detail", description = "Fetches detail of a single booking")
    public ResponseEntity<ApiResponse<BookingResponse>> getBookingById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok("Detail booking", bookingService.getBookingById(id)));
    }

    @PutMapping("/{id}/cancel")
    @Operation(summary = "Cancel booking", description = "Cancels a pending booking")
    public ResponseEntity<ApiResponse<BookingResponse>> cancelBooking(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok("Pesanan berhasil dibatalkan", bookingService.cancelMyBooking(id)));
    }
}
