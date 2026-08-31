package com.example.rentalpartnership.service;

import com.example.rentalpartnership.dto.booking.BookingCreateRequest;
import com.example.rentalpartnership.dto.booking.BookingResponse;
import com.example.rentalpartnership.dto.payment.PaymentResponse;
import com.example.rentalpartnership.dto.review.ReviewResponse;
import com.example.rentalpartnership.entity.*;
import com.example.rentalpartnership.exception.BadRequestException;
import com.example.rentalpartnership.exception.BookingConflictException;
import com.example.rentalpartnership.exception.ResourceNotFoundException;
import com.example.rentalpartnership.repository.BookingRepository;
import com.example.rentalpartnership.repository.CarRepository;
import com.example.rentalpartnership.repository.RentalPlaceRepository;
import com.example.rentalpartnership.repository.UserRepository;
import com.example.rentalpartnership.security.SecurityUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class BookingService {

    private final BookingRepository bookingRepository;
    private final CarRepository carRepository;
    private final UserRepository userRepository;
    private final RentalPlaceRepository rentalPlaceRepository;
    private final SecurityUtils securityUtils;
    private final AuthService authService;
    private final RentalPlaceService rentalPlaceService;
    private final CarService carService;

    // ==========================================
    // USER METHODS
    // ==========================================
    @Transactional
    public BookingResponse createBooking(BookingCreateRequest request) {
        Long userId = securityUtils.getCurrentUserId();
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User tidak ditemukan"));

        // Validation: Date logic (Start Date must be before End Date)
        if (!request.getStartDate().isBefore(request.getEndDate())) {
            throw new BadRequestException("Tanggal selesai rental harus setelah tanggal mulai rental");
        }

        if (request.getStartDate().isBefore(LocalDate.now())) {
            throw new BadRequestException("Tanggal mulai rental tidak boleh di masa lalu");
        }

        Car car = carRepository.findById(request.getCarId())
                .orElseThrow(() -> new ResourceNotFoundException("Mobil tidak ditemukan"));

        if (car.getStatus() != CarStatus.ACTIVE || !Boolean.TRUE.equals(car.getIsAvailable())) {
            throw new BadRequestException("Mobil sedang tidak tersedia untuk disewa");
        }

        if (car.getRentalPlace().getStatus() != RentalStatus.ACTIVE) {
            throw new BadRequestException("Tempat rental mobil ini sedang tidak aktif");
        }

        // Business Rule 7: Prevent Overlapping Bookings
        List<Booking> conflicts = bookingRepository.findConflictingBookings(
                car.getId(),
                request.getStartDate(),
                request.getEndDate(),
                null
        );

        if (!conflicts.isEmpty()) {
            throw new BookingConflictException("Mobil sudah dibooking oleh pelanggan lain pada rentang tanggal tersebut. Silakan pilih tanggal atau mobil lain.");
        }

        // Business Rule 8: Backend calculates duration and total price
        long days = ChronoUnit.DAYS.between(request.getStartDate(), request.getEndDate());
        if (days <= 0) {
            days = 1;
        }

        BigDecimal totalPrice = car.getPricePerDay().multiply(BigDecimal.valueOf(days));

        Booking booking = Booking.builder()
                .user(user)
                .car(car)
                .rentalPlace(car.getRentalPlace())
                .startDate(request.getStartDate())
                .endDate(request.getEndDate())
                .totalPrice(totalPrice)
                .status(BookingStatus.PENDING)
                .build();

        return mapToBookingResponse(bookingRepository.save(booking));
    }

    public List<BookingResponse> getMyBookings() {
        Long userId = securityUtils.getCurrentUserId();
        return bookingRepository.findByUserIdOrderByCreatedAtDesc(userId).stream()
                .map(this::mapToBookingResponse)
                .collect(Collectors.toList());
    }

    public BookingResponse getBookingById(Long id) {
        Long userId = securityUtils.getCurrentUserId();
        Role userRole = securityUtils.getCurrentUserRole();

        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking tidak ditemukan"));

        // Security check: User can only see own booking, Partner can see bookings for its rental, Admin can see all
        if (userRole == Role.USER && !booking.getUser().getId().equals(userId)) {
            throw new BadRequestException("Anda tidak memiliki akses ke pesanan booking ini");
        } else if (userRole == Role.PARTNER && !booking.getRentalPlace().getPartner().getId().equals(userId)) {
            throw new BadRequestException("Anda tidak memiliki akses ke pesanan rental orang lain");
        }

        return mapToBookingResponse(booking);
    }

    @Transactional
    public BookingResponse cancelMyBooking(Long id) {
        Long userId = securityUtils.getCurrentUserId();
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking tidak ditemukan"));

        if (!booking.getUser().getId().equals(userId)) {
            throw new BadRequestException("Anda hanya dapat membatalkan pesanan milik Anda sendiri");
        }

        if (booking.getStatus() != BookingStatus.PENDING) {
            throw new BadRequestException("Hanya pesanan berstatus PENDING yang dapat dibatalkan");
        }

        booking.setStatus(BookingStatus.CANCELLED);
        return mapToBookingResponse(bookingRepository.save(booking));
    }

    // ==========================================
    // PARTNER METHODS
    // ==========================================
    public List<BookingResponse> getPartnerBookings() {
        Long partnerId = securityUtils.getCurrentUserId();
        RentalPlace rentalPlace = rentalPlaceRepository.findFirstByPartnerId(partnerId)
                .orElseThrow(() -> new BadRequestException("Tempat rental belum terdaftar untuk partner ini"));

        return bookingRepository.findByRentalPlaceIdOrderByCreatedAtDesc(rentalPlace.getId()).stream()
                .map(this::mapToBookingResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public BookingResponse updateBookingStatusByPartner(Long bookingId, BookingStatus newStatus) {
        Long partnerId = securityUtils.getCurrentUserId();
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking tidak ditemukan"));

        if (!booking.getRentalPlace().getPartner().getId().equals(partnerId)) {
            throw new BadRequestException("Anda tidak memiliki akses untuk mengubah status pesanan ini");
        }

        booking.setStatus(newStatus);
        return mapToBookingResponse(bookingRepository.save(booking));
    }

    // ==========================================
    // ADMIN METHODS
    // ==========================================
    public List<BookingResponse> getAllBookings() {
        return bookingRepository.findAll().stream()
                .map(this::mapToBookingResponse)
                .collect(Collectors.toList());
    }

    public BookingResponse mapToBookingResponse(Booking booking) {
        long days = ChronoUnit.DAYS.between(booking.getStartDate(), booking.getEndDate());

        PaymentResponse paymentResponse = null;
        if (booking.getPayment() != null) {
            Payment p = booking.getPayment();
            paymentResponse = PaymentResponse.builder()
                    .id(p.getId())
                    .bookingId(booking.getId())
                    .method(p.getMethod())
                    .amount(p.getAmount())
                    .status(p.getStatus())
                    .transactionId(p.getTransactionId())
                    .paymentDate(p.getPaymentDate())
                    .createdAt(p.getCreatedAt())
                    .build();
        }

        ReviewResponse reviewResponse = null;
        if (booking.getReview() != null) {
            Review r = booking.getReview();
            reviewResponse = ReviewResponse.builder()
                    .id(r.getId())
                    .user(authService.mapToUserResponse(r.getUser()))
                    .rentalPlaceId(r.getRentalPlace().getId())
                    .rentalPlaceName(r.getRentalPlace().getName())
                    .bookingId(booking.getId())
                    .rating(r.getRating())
                    .comment(r.getComment())
                    .createdAt(r.getCreatedAt())
                    .build();
        }

        return BookingResponse.builder()
                .id(booking.getId())
                .user(authService.mapToUserResponse(booking.getUser()))
                .car(carService.mapToCarResponse(booking.getCar()))
                .rentalPlace(rentalPlaceService.mapToRentalResponse(booking.getRentalPlace()))
                .startDate(booking.getStartDate())
                .endDate(booking.getEndDate())
                .durationDays(days > 0 ? days : 1)
                .totalPrice(booking.getTotalPrice())
                .status(booking.getStatus())
                .payment(paymentResponse)
                .review(reviewResponse)
                .createdAt(booking.getCreatedAt())
                .updatedAt(booking.getUpdatedAt())
                .build();
    }
}
