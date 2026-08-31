package com.example.rentalpartnership.service;

import com.example.rentalpartnership.dto.payment.PaymentResponse;
import com.example.rentalpartnership.dto.payment.PaymentSimulateRequest;
import com.example.rentalpartnership.entity.Booking;
import com.example.rentalpartnership.entity.BookingStatus;
import com.example.rentalpartnership.entity.Payment;
import com.example.rentalpartnership.entity.PaymentStatus;
import com.example.rentalpartnership.exception.BadRequestException;
import com.example.rentalpartnership.exception.ResourceNotFoundException;
import com.example.rentalpartnership.repository.BookingRepository;
import com.example.rentalpartnership.repository.PaymentRepository;
import com.example.rentalpartnership.security.SecurityUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final BookingRepository bookingRepository;
    private final SecurityUtils securityUtils;

    @Transactional
    public PaymentResponse simulatePayment(PaymentSimulateRequest request) {
        Long userId = securityUtils.getCurrentUserId();
        Booking booking = bookingRepository.findById(request.getBookingId())
                .orElseThrow(() -> new ResourceNotFoundException("Booking tidak ditemukan"));

        // Security check: Only booking owner can pay
        if (!booking.getUser().getId().equals(userId)) {
            throw new BadRequestException("Anda hanya dapat melakukan pembayaran untuk pesanan milik Anda sendiri");
        }

        // Business Rule 11: One booking can have maximum one payment
        if (booking.getPayment() != null && booking.getPayment().getStatus() == PaymentStatus.SUCCESS) {
            throw new BadRequestException("Pesanan ini sudah dibayar lunas");
        }

        if (booking.getStatus() == BookingStatus.CANCELLED || booking.getStatus() == BookingStatus.REJECTED) {
            throw new BadRequestException("Pesanan yang telah dibatalkan/ditolak tidak dapat dibayar");
        }

        // Business Rule 9: Amount is strictly derived from booking totalPrice
        Payment payment = booking.getPayment();
        if (payment == null) {
            payment = Payment.builder()
                    .booking(booking)
                    .method(request.getMethod())
                    .amount(booking.getTotalPrice())
                    .status(PaymentStatus.SUCCESS)
                    .transactionId("TRX-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase())
                    .paymentDate(LocalDateTime.now())
                    .build();
        } else {
            payment.setMethod(request.getMethod());
            payment.setStatus(PaymentStatus.SUCCESS);
            payment.setPaymentDate(LocalDateTime.now());
            if (payment.getTransactionId() == null) {
                payment.setTransactionId("TRX-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
            }
        }

        Payment savedPayment = paymentRepository.save(payment);

        // Auto confirm booking on successful payment
        if (booking.getStatus() == BookingStatus.PENDING) {
            booking.setStatus(BookingStatus.CONFIRMED);
            bookingRepository.save(booking);
        }

        return mapToPaymentResponse(savedPayment);
    }

    public PaymentResponse getPaymentByBookingId(Long bookingId) {
        Payment payment = paymentRepository.findByBookingId(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Data pembayaran tidak ditemukan untuk booking ini"));

        Long currentUserId = securityUtils.getCurrentUserId();
        if (!payment.getBooking().getUser().getId().equals(currentUserId) &&
            !payment.getBooking().getRentalPlace().getPartner().getId().equals(currentUserId)) {
            throw new BadRequestException("Anda tidak memiliki akses ke data pembayaran ini");
        }

        return mapToPaymentResponse(payment);
    }

    public PaymentResponse mapToPaymentResponse(Payment payment) {
        return PaymentResponse.builder()
                .id(payment.getId())
                .bookingId(payment.getBooking().getId())
                .method(payment.getMethod())
                .amount(payment.getAmount())
                .status(payment.getStatus())
                .transactionId(payment.getTransactionId())
                .paymentDate(payment.getPaymentDate())
                .createdAt(payment.getCreatedAt())
                .build();
    }
}
