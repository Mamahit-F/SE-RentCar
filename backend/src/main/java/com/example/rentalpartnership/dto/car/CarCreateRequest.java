package com.example.rentalpartnership.dto.car;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CarCreateRequest {

    @NotBlank(message = "Brand/Merk mobil wajib diisi")
    private String brand;

    @NotBlank(message = "Model mobil wajib diisi")
    private String model;

    private String type; // SUV, Sedan, MPV, Hatchback, dll

    private Integer year;

    private String transmission; // Manual, Automatic

    @Min(value = 1, message = "Jumlah kursi minimal 1")
    private Integer seats;

    private String color;

    private Integer cc;

    @NotNull(message = "Harga sewa per hari wajib diisi")
    @DecimalMin(value = "0.01", message = "Harga sewa per hari harus lebih dari 0")
    private BigDecimal pricePerDay;

    private String imageUrl;

    private String description;
}
