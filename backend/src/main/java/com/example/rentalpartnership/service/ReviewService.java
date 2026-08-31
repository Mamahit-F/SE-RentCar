package com.example.rentalpartnership.service;

import com.example.rentalpartnership.dto.review.ReviewCreateRequest;
import com.example.rentalpartnership.dto.review.ReviewResponse;
import com.example.rentalpartnership.entity.Booking;
import com.example.rentalpartnership.entity.BookingStatus;
import com.example.rentalpartnership.entity.Review;
import com.example.rentalpartnership.entity.User;
import com.example.rentalpartnership.exception.BadRequestException;
import com.example.rentalpartnership.exception.ResourceNotFoundException;
import com.example.rentalpartnership.repository.BookingRepository;
import com.example.rentalpartnership.repository.ReviewRepository;
import com.example.rentalpartnership.repository.UserRepository;
import com.example.rentalpartnership.security.SecurityUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final BookingRepository bookingRepository;
    private final UserRepository userRepository;
    private final SecurityUtils securityUtils;
    private final AuthService authService;

    @Transactional
    public ReviewResponse createReview(ReviewCreateRequest request) {
        Long userId = securityUtils.getCurrentUserId();
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User tidak ditemukan"));

        Booking booking = bookingRepository.findById(request.getBookingId())
                .orElseThrow(() -> new ResourceNotFoundException("Booking tidak ditemukan"));

        // Security check: User must own the booking
        if (!booking.getUser().getId().equals(userId)) {
            throw new BadRequestException("Anda hanya dapat memberikan ulasan untuk pesanan Anda sendiri");
        }

        // Business Rule 10: Only COMPLETED bookings can be reviewed
        if (booking.getStatus() != BookingStatus.COMPLETED) {
            throw new BadRequestException("Ulasan hanya dapat diberikan setelah sewa rental selesai (status COMPLETED)");
        }

        // Business Rule 12: Maximum one review per booking
        if (reviewRepository.existsByBookingId(booking.getId())) {
            throw new BadRequestException("Pesanan ini sudah pernah Anda beri ulasan sebelumnya");
        }

        Review review = Review.builder()
                .user(user)
                .rentalPlace(booking.getRentalPlace())
                .booking(booking)
                .rating(request.getRating())
                .comment(request.getComment())
                .build();

        return mapToReviewResponse(reviewRepository.save(review));
    }

    public List<ReviewResponse> getReviewsByRentalPlace(Long rentalPlaceId) {
        return reviewRepository.findByRentalPlaceIdOrderByCreatedAtDesc(rentalPlaceId).stream()
                .map(this::mapToReviewResponse)
                .collect(Collectors.toList());
    }

    public ReviewResponse mapToReviewResponse(Review review) {
        return ReviewResponse.builder()
                .id(review.getId())
                .user(authService.mapToUserResponse(review.getUser()))
                .rentalPlaceId(review.getRentalPlace().getId())
                .rentalPlaceName(review.getRentalPlace().getName())
                .bookingId(review.getBooking().getId())
                .rating(review.getRating())
                .comment(review.getComment())
                .createdAt(review.getCreatedAt())
                .build();
    }
}
