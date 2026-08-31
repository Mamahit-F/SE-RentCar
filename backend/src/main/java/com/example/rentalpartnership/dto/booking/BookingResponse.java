package com.example.rentalpartnership.dto.booking;

import com.example.rentalpartnership.dto.car.CarResponse;
import com.example.rentalpartnership.dto.payment.PaymentResponse;
import com.example.rentalpartnership.dto.rental.RentalResponse;
import com.example.rentalpartnership.dto.review.ReviewResponse;
import com.example.rentalpartnership.dto.user.UserResponse;
import com.example.rentalpartnership.entity.BookingStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BookingResponse {
    private Long id;
    private UserResponse user;
    private CarResponse car;
    private RentalResponse rentalPlace;
    private LocalDate startDate;
    private LocalDate endDate;
    private Long durationDays;
    private BigDecimal totalPrice;
    private BookingStatus status;
    private PaymentResponse payment;
    private ReviewResponse review;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
