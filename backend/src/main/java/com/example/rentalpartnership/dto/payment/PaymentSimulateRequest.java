package com.example.rentalpartnership.dto.payment;

import com.example.rentalpartnership.entity.PaymentMethod;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PaymentSimulateRequest {

    @NotNull(message = "ID Booking wajib diisi")
    private Long bookingId;

    @NotNull(message = "Metode pembayaran wajib dipilih")
    private PaymentMethod method;
}
