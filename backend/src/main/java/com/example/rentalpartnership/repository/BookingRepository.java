package com.example.rentalpartnership.repository;

import com.example.rentalpartnership.entity.Booking;
import com.example.rentalpartnership.entity.BookingStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {

    List<Booking> findByUserIdOrderByCreatedAtDesc(Long userId);

    List<Booking> findByRentalPlaceIdOrderByCreatedAtDesc(Long rentalPlaceId);

    List<Booking> findByRentalPlaceIdAndStatus(Long rentalPlaceId, BookingStatus status);

    long countByRentalPlaceIdAndStatus(Long rentalPlaceId, BookingStatus status);

    long countByStatus(BookingStatus status);

    /**
     * Business Rule 11 & 12: Check booking date collision/overlap for the same car.
     * Overlap occurs when: existing.startDate < requestedEndDate AND existing.endDate > requestedStartDate
     * for active booking statuses (PENDING, CONFIRMED).
     */
    @Query("SELECT b FROM Booking b WHERE b.car.id = :carId " +
           "AND b.status IN (com.example.rentalpartnership.entity.BookingStatus.PENDING, com.example.rentalpartnership.entity.BookingStatus.CONFIRMED) " +
           "AND b.startDate < :endDate AND b.endDate > :startDate " +
           "AND (:excludeBookingId IS NULL OR b.id != :excludeBookingId)")
    List<Booking> findConflictingBookings(@Param("carId") Long carId,
                                         @Param("startDate") LocalDate startDate,
                                         @Param("endDate") LocalDate endDate,
                                         @Param("excludeBookingId") Long excludeBookingId);
}
