package com.example.rentalpartnership.dto.booking;

import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BookingCreateRequest {

    @NotNull(message = "Mobil wajib dipilih")
    private Long carId;

    @NotNull(message = "Tanggal mulai rental wajib diisi")
    @FutureOrPresent(message = "Tanggal mulai tidak boleh di masa lalu")
    private LocalDate startDate;

    @NotNull(message = "Tanggal selesai rental wajib diisi")
    private LocalDate endDate;
}
