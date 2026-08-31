package com.example.rentalpartnership.service;

import com.example.rentalpartnership.dto.dashboard.AdminDashboardStatsResponse;
import com.example.rentalpartnership.dto.dashboard.PartnerDashboardStatsResponse;
import com.example.rentalpartnership.entity.BookingStatus;
import com.example.rentalpartnership.entity.CarStatus;
import com.example.rentalpartnership.entity.RentalPlace;
import com.example.rentalpartnership.entity.RentalStatus;
import com.example.rentalpartnership.entity.Role;
import com.example.rentalpartnership.repository.*;
import com.example.rentalpartnership.security.SecurityUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class DashboardService {

    private final UserRepository userRepository;
    private final RentalPlaceRepository rentalPlaceRepository;
    private final CarRepository carRepository;
    private final BookingRepository bookingRepository;
    private final ReviewRepository reviewRepository;
    private final SecurityUtils securityUtils;

    public AdminDashboardStatsResponse getAdminStats() {
        return AdminDashboardStatsResponse.builder()
                .totalUsers(userRepository.countByRole(Role.USER))
                .totalPartners(userRepository.countByRole(Role.PARTNER))
                .totalRentals(rentalPlaceRepository.count())
                .pendingApplications(rentalPlaceRepository.countByStatus(RentalStatus.PENDING))
                .activeRentals(rentalPlaceRepository.countByStatus(RentalStatus.ACTIVE))
                .rejectedRentals(rentalPlaceRepository.countByStatus(RentalStatus.REJECTED))
                .totalCars(carRepository.count())
                .totalBookings(bookingRepository.count())
                .build();
    }

    public PartnerDashboardStatsResponse getPartnerStats() {
        Long partnerId = securityUtils.getCurrentUserId();
        Optional<RentalPlace> rentalOpt = rentalPlaceRepository.findFirstByPartnerId(partnerId);

        if (rentalOpt.isEmpty()) {
            return PartnerDashboardStatsResponse.builder()
                    .totalCars(0)
                    .availableCars(0)
                    .pendingBookings(0)
                    .confirmedBookings(0)
                    .completedBookings(0)
                    .totalBookings(0)
                    .averageRating(0.0)
                    .totalReviews(0)
                    .build();
        }

        Long rentalId = rentalOpt.get().getId();
        Double avgRating = reviewRepository.getAverageRatingByRentalPlaceId(rentalId);

        return PartnerDashboardStatsResponse.builder()
                .totalCars(carRepository.countByRentalPlaceId(rentalId))
                .availableCars(carRepository.countByRentalPlaceIdAndStatus(rentalId, CarStatus.ACTIVE))
                .pendingBookings(bookingRepository.countByRentalPlaceIdAndStatus(rentalId, BookingStatus.PENDING))
                .confirmedBookings(bookingRepository.countByRentalPlaceIdAndStatus(rentalId, BookingStatus.CONFIRMED))
                .completedBookings(bookingRepository.countByRentalPlaceIdAndStatus(rentalId, BookingStatus.COMPLETED))
                .totalBookings(bookingRepository.findByRentalPlaceIdOrderByCreatedAtDesc(rentalId).size())
                .averageRating(avgRating != null ? Math.round(avgRating * 10.0) / 10.0 : 0.0)
                .totalReviews(reviewRepository.countByRentalPlaceId(rentalId))
                .build();
    }
}
