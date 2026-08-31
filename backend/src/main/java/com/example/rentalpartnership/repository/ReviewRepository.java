package com.example.rentalpartnership.repository;

import com.example.rentalpartnership.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {
    
    List<Review> findByRentalPlaceIdOrderByCreatedAtDesc(Long rentalPlaceId);
    
    Optional<Review> findByBookingId(Long bookingId);
    
    boolean existsByBookingId(Long bookingId);

    @Query("SELECT AVG(r.rating) FROM Review r WHERE r.rentalPlace.id = :rentalPlaceId")
    Double getAverageRatingByRentalPlaceId(@Param("rentalPlaceId") Long rentalPlaceId);

    long countByRentalPlaceId(Long rentalPlaceId);
}
