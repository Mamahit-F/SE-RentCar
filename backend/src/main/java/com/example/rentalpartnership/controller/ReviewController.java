package com.example.rentalpartnership.controller;

import com.example.rentalpartnership.dto.common.ApiResponse;
import com.example.rentalpartnership.dto.review.ReviewCreateRequest;
import com.example.rentalpartnership.dto.review.ReviewResponse;
import com.example.rentalpartnership.service.ReviewService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
@Tag(name = "Customer Reviews", description = "Endpoints for submitting and viewing rental reviews")
public class ReviewController {

    private final ReviewService reviewService;

    @PostMapping
    @Operation(summary = "Submit review", description = "Allows customer to review a completed rental booking")
    public ResponseEntity<ApiResponse<ReviewResponse>> createReview(@Valid @RequestBody ReviewCreateRequest request) {
        ReviewResponse response = reviewService.createReview(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok("Ulasan berhasil dikirim. Terima kasih atas masukan Anda!", response));
    }

    @GetMapping("/rental/{rentalId}")
    @Operation(summary = "Get reviews for rental place", description = "Publicly lists all reviews and ratings for a rental place")
    public ResponseEntity<ApiResponse<List<ReviewResponse>>> getRentalReviews(@PathVariable Long rentalId) {
        List<ReviewResponse> reviews = reviewService.getReviewsByRentalPlace(rentalId);
        return ResponseEntity.ok(ApiResponse.ok("Daftar ulasan rental", reviews));
    }
}
