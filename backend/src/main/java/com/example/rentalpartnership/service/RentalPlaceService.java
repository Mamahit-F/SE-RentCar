package com.example.rentalpartnership.service;

import com.example.rentalpartnership.dto.rental.RentalAdminReviewRequest;
import com.example.rentalpartnership.dto.rental.RentalCreateRequest;
import com.example.rentalpartnership.dto.rental.RentalResponse;
import com.example.rentalpartnership.dto.rental.RentalUpdateRequest;
import com.example.rentalpartnership.entity.RentalPlace;
import com.example.rentalpartnership.entity.RentalStatus;
import com.example.rentalpartnership.entity.User;
import com.example.rentalpartnership.exception.BadRequestException;
import com.example.rentalpartnership.exception.ResourceNotFoundException;
import com.example.rentalpartnership.repository.CarRepository;
import com.example.rentalpartnership.repository.RentalPlaceRepository;
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
public class RentalPlaceService {

    private final RentalPlaceRepository rentalPlaceRepository;
    private final UserRepository userRepository;
    private final CarRepository carRepository;
    private final ReviewRepository reviewRepository;
    private final SecurityUtils securityUtils;
    private final AuthService authService;

    // ==========================================
    // PARTNER METHODS
    // ==========================================
    @Transactional
    public RentalResponse submitRentalApplication(RentalCreateRequest request) {
        Long partnerId = securityUtils.getCurrentUserId();
        User partner = userRepository.findById(partnerId)
                .orElseThrow(() -> new ResourceNotFoundException("Partner tidak ditemukan"));

        // Partner creates RentalPlace with default status PENDING
        RentalPlace rentalPlace = RentalPlace.builder()
                .partner(partner)
                .name(request.getName())
                .description(request.getDescription())
                .address(request.getAddress())
                .city(request.getCity())
                .province(request.getProvince())
                .phone(request.getPhone())
                .email(request.getEmail())
                .latitude(request.getLatitude())
                .longitude(request.getLongitude())
                .businessLicense(request.getBusinessLicense())
                .documentUrl(request.getDocumentUrl())
                .status(RentalStatus.PENDING)
                .build();

        return mapToRentalResponse(rentalPlaceRepository.save(rentalPlace));
    }

    public List<RentalResponse> getMyRentalPlaces() {
        Long partnerId = securityUtils.getCurrentUserId();
        return rentalPlaceRepository.findByPartnerId(partnerId).stream()
                .map(this::mapToRentalResponse)
                .collect(Collectors.toList());
    }

    public RentalResponse getMyRentalPlaceById(Long id) {
        Long partnerId = securityUtils.getCurrentUserId();
        RentalPlace rentalPlace = rentalPlaceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Tempat rental tidak ditemukan"));

        if (!rentalPlace.getPartner().getId().equals(partnerId)) {
            throw new BadRequestException("Anda tidak memiliki akses ke tempat rental ini");
        }

        return mapToRentalResponse(rentalPlace);
    }

    @Transactional
    public RentalResponse updateMyRentalPlace(Long id, RentalUpdateRequest request) {
        Long partnerId = securityUtils.getCurrentUserId();
        RentalPlace rentalPlace = rentalPlaceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Tempat rental tidak ditemukan"));

        if (!rentalPlace.getPartner().getId().equals(partnerId)) {
            throw new BadRequestException("Anda tidak berhak mengedit tempat rental ini");
        }

        rentalPlace.setName(request.getName());
        rentalPlace.setDescription(request.getDescription());
        rentalPlace.setAddress(request.getAddress());
        rentalPlace.setCity(request.getCity());
        rentalPlace.setProvince(request.getProvince());
        rentalPlace.setPhone(request.getPhone());
        rentalPlace.setEmail(request.getEmail());
        rentalPlace.setLatitude(request.getLatitude());
        rentalPlace.setLongitude(request.getLongitude());
        rentalPlace.setBusinessLicense(request.getBusinessLicense());
        rentalPlace.setDocumentUrl(request.getDocumentUrl());

        // If previously REJECTED, update resets to PENDING for admin review
        if (rentalPlace.getStatus() == RentalStatus.REJECTED) {
            rentalPlace.setStatus(RentalStatus.PENDING);
            rentalPlace.setRejectionReason(null);
        }

        return mapToRentalResponse(rentalPlaceRepository.save(rentalPlace));
    }

    // ==========================================
    // PUBLIC / USER METHODS (Rule 1: Active only)
    // ==========================================
    public List<RentalResponse> getActiveRentals(String city, String query) {
        return rentalPlaceRepository.searchActiveRentals(RentalStatus.ACTIVE, city, query).stream()
                .map(this::mapToRentalResponse)
                .collect(Collectors.toList());
    }

    public RentalResponse getActiveRentalById(Long id) {
        RentalPlace rentalPlace = rentalPlaceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Tempat rental tidak ditemukan"));

        if (rentalPlace.getStatus() != RentalStatus.ACTIVE) {
            throw new ResourceNotFoundException("Tempat rental saat ini tidak aktif");
        }

        return mapToRentalResponse(rentalPlace);
    }

    // ==========================================
    // ADMIN METHODS (Rule 2: Only Admin can approve/reject)
    // ==========================================
    public List<RentalResponse> getAllRentals() {
        return rentalPlaceRepository.findAll().stream()
                .map(this::mapToRentalResponse)
                .collect(Collectors.toList());
    }

    public List<RentalResponse> getRentalsByStatus(RentalStatus status) {
        return rentalPlaceRepository.findByStatus(status).stream()
                .map(this::mapToRentalResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public RentalResponse approveRental(Long id) {
        RentalPlace rentalPlace = rentalPlaceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Tempat rental tidak ditemukan"));

        rentalPlace.setStatus(RentalStatus.ACTIVE);
        rentalPlace.setRejectionReason(null);

        return mapToRentalResponse(rentalPlaceRepository.save(rentalPlace));
    }

    @Transactional
    public RentalResponse rejectRental(Long id, RentalAdminReviewRequest request) {
        RentalPlace rentalPlace = rentalPlaceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Tempat rental tidak ditemukan"));

        rentalPlace.setStatus(RentalStatus.REJECTED);
        rentalPlace.setRejectionReason(request != null ? request.getRejectionReason() : "Dokumen tidak memenuhi persyaratan");

        return mapToRentalResponse(rentalPlaceRepository.save(rentalPlace));
    }

    @Transactional
    public RentalResponse toggleRentalStatus(Long id) {
        RentalPlace rentalPlace = rentalPlaceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Tempat rental tidak ditemukan"));

        if (rentalPlace.getStatus() == RentalStatus.ACTIVE) {
            rentalPlace.setStatus(RentalStatus.INACTIVE);
        } else if (rentalPlace.getStatus() == RentalStatus.INACTIVE) {
            rentalPlace.setStatus(RentalStatus.ACTIVE);
        } else {
            throw new BadRequestException("Hanya rental yang disetujui yang dapat diaktifkan/nonaktifkan.");
        }

        return mapToRentalResponse(rentalPlaceRepository.save(rentalPlace));
    }

    public RentalResponse mapToRentalResponse(RentalPlace rental) {
        long totalCars = carRepository.countByRentalPlaceId(rental.getId());
        Double avgRating = reviewRepository.getAverageRatingByRentalPlaceId(rental.getId());
        long totalReviews = reviewRepository.countByRentalPlaceId(rental.getId());

        return RentalResponse.builder()
                .id(rental.getId())
                .partner(authService.mapToUserResponse(rental.getPartner()))
                .name(rental.getName())
                .description(rental.getDescription())
                .address(rental.getAddress())
                .city(rental.getCity())
                .province(rental.getProvince())
                .phone(rental.getPhone())
                .email(rental.getEmail())
                .latitude(rental.getLatitude())
                .longitude(rental.getLongitude())
                .businessLicense(rental.getBusinessLicense())
                .documentUrl(rental.getDocumentUrl())
                .status(rental.getStatus())
                .rejectionReason(rental.getRejectionReason())
                .totalCars(totalCars)
                .averageRating(avgRating != null ? Math.round(avgRating * 10.0) / 10.0 : 0.0)
                .totalReviews(totalReviews)
                .createdAt(rental.getCreatedAt())
                .updatedAt(rental.getUpdatedAt())
                .build();
    }
}
