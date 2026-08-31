package com.example.rentalpartnership.dto.car;

import com.example.rentalpartnership.entity.CarStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CarResponse {
    private Long id;
    private Long rentalPlaceId;
    private String rentalPlaceName;
    private String rentalPlaceCity;
    private String brand;
    private String model;
    private String type;
    private Integer year;
    private String transmission;
    private Integer seats;
    private String color;
    private Integer cc;
    private BigDecimal pricePerDay;
    private String imageUrl;
    private String description;
    private Boolean isAvailable;
    private CarStatus status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
