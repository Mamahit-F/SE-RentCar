package com.example.rentalpartnership.controller;

import com.example.rentalpartnership.dto.common.ApiResponse;
import com.example.rentalpartnership.dto.payment.PaymentResponse;
import com.example.rentalpartnership.dto.payment.PaymentSimulateRequest;
import com.example.rentalpartnership.service.PaymentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
@Tag(name = "Payments Simulation", description = "Endpoints for simulating customer payment transactions")
public class PaymentController {

    private final PaymentService paymentService;

    @PostMapping("/simulate")
    @Operation(summary = "Simulate payment", description = "Simulates successful transaction and auto-confirms booking")
    public ResponseEntity<ApiResponse<PaymentResponse>> simulatePayment(@Valid @RequestBody PaymentSimulateRequest request) {
        PaymentResponse response = paymentService.simulatePayment(request);
        return ResponseEntity.ok(ApiResponse.ok("Pembayaran berhasil diverifikasi. Pesanan kini terkonfirmasi!", response));
    }

    @GetMapping("/booking/{bookingId}")
    @Operation(summary = "Get payment by booking ID", description = "Fetches payment receipt for a specific booking")
    public ResponseEntity<ApiResponse<PaymentResponse>> getPaymentByBooking(@PathVariable Long bookingId) {
        PaymentResponse response = paymentService.getPaymentByBookingId(bookingId);
        return ResponseEntity.ok(ApiResponse.ok("Detail pembayaran", response));
    }
}
