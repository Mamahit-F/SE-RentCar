package com.example.rentalpartnership.dto.rental;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RentalAdminReviewRequest {
    private String rejectionReason;
}
