package com.example.rentalpartnership.dto.rental;

import com.example.rentalpartnership.dto.user.UserResponse;
import com.example.rentalpartnership.entity.RentalStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RentalResponse {
    private Long id;
    private UserResponse partner;
    private String name;
    private String description;
    private String address;
    private String city;
    private String province;
    private String phone;
    private String email;
    private Double latitude;
    private Double longitude;
    private String businessLicense;
    private String documentUrl;
    private RentalStatus status;
    private String rejectionReason;
    private Long totalCars;
    private Double averageRating;
    private Long totalReviews;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
