package com.example.rentalpartnership.dto.dashboard;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AdminDashboardStatsResponse {
    private long totalUsers;
    private long totalPartners;
    private long totalRentals;
    private long pendingApplications;
    private long activeRentals;
    private long rejectedRentals;
    private long totalCars;
    private long totalBookings;
}
