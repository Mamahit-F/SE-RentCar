package com.example.rentalpartnership.dto.dashboard;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PartnerDashboardStatsResponse {
    private long totalCars;
    private long availableCars;
    private long pendingBookings;
    private long confirmedBookings;
    private long completedBookings;
    private long totalBookings;
    private Double averageRating;
    private long totalReviews;
}
