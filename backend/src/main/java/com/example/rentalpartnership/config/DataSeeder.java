package com.example.rentalpartnership.config;

import com.example.rentalpartnership.entity.*;
import com.example.rentalpartnership.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Slf4j
@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final RentalPlaceRepository rentalPlaceRepository;
    private final CarRepository carRepository;
    private final BookingRepository bookingRepository;
    private final PaymentRepository paymentRepository;
    private final ReviewRepository reviewRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        if (userRepository.count() == 0) {
            log.info("🚀 Seeding initial development data for Sistem Partnership Rental Mobil...");

            // 1. Seed Admin
            User admin = User.builder()
                    .name("Administrator Utama")
                    .email("admin@rental.com")
                    .password(passwordEncoder.encode("admin123"))
                    .phone("081299990001")
                    .role(Role.ADMIN)
                    .isActive(true)
                    .build();
            userRepository.save(admin);

            // 2. Seed Partner 1 (Active)
            User partner1 = User.builder()
                    .name("Budi Santoso (Mitra Jaya)")
                    .email("partner@rental.com")
                    .password(passwordEncoder.encode("partner123"))
                    .phone("081299990002")
                    .role(Role.PARTNER)
                    .isActive(true)
                    .build();
            partner1 = userRepository.save(partner1);

            // 3. Seed Partner 2 (Pending Application)
            User partner2 = User.builder()
                    .name("Wayan Suwardi (Dewata Bali)")
                    .email("partner.bali@rental.com")
                    .password(passwordEncoder.encode("partner123"))
                    .phone("081299990003")
                    .role(Role.PARTNER)
                    .isActive(true)
                    .build();
            partner2 = userRepository.save(partner2);

            // 4. Seed Regular User (Customer)
            User user1 = User.builder()
                    .name("Ahmad Rizky (Customer)")
                    .email("user@rental.com")
                    .password(passwordEncoder.encode("user123"))
                    .phone("081299990004")
                    .role(Role.USER)
                    .isActive(true)
                    .build();
            user1 = userRepository.save(user1);

            // 5. Seed Rental Places
            RentalPlace rental1 = RentalPlace.builder()
                    .partner(partner1)
                    .name("Mitra Jaya Rental Mobil")
                    .description("Penyedia sewa mobil terpercaya di Jakarta Selatan dengan armada terlengkap, bersih, dan prima.")
                    .address("Jl. Fatmawati No. 45, Cilandak")
                    .city("Jakarta Selatan")
                    .province("DKI Jakarta")
                    .phone("0217654321")
                    .email("cs@mitrajayarental.com")
                    .latitude(-6.2922)
                    .longitude(106.7979)
                    .businessLicense("NIB-9120038472910")
                    .documentUrl("https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=600&q=80")
                    .status(RentalStatus.ACTIVE)
                    .build();
            rental1 = rentalPlaceRepository.save(rental1);

            RentalPlace rental2 = RentalPlace.builder()
                    .partner(partner2)
                    .name("Dewata Trans Bali")
                    .description("Sewa mobil lepas kunci dan dengan supir untuk liburan di Bali.")
                    .address("Jl. Sunset Road No. 88, Kuta")
                    .city("Denpasar")
                    .province("Bali")
                    .phone("0361987654")
                    .email("dewatatrans@gmail.com")
                    .latitude(-8.7058)
                    .longitude(115.1784)
                    .businessLicense("NIB-8819203948271")
                    .documentUrl("https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=600&q=80")
                    .status(RentalStatus.PENDING)
                    .build();
            rentalPlaceRepository.save(rental2);

            // 6. Seed Cars for Active Rental
            Car car1 = Car.builder()
                    .rentalPlace(rental1)
                    .brand("Toyota")
                    .model("Innova Zenix 2.0 V")
                    .type("MPV")
                    .year(2024)
                    .transmission("Automatic")
                    .seats(7)
                    .color("Platinum White Pearl")
                    .cc(2000)
                    .pricePerDay(new BigDecimal("650000.00"))
                    .imageUrl("https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80")
                    .description("Mobil keluarga premium terbaru sangat nyaman, irit bahan bakar, dan interior lega.")
                    .isAvailable(true)
                    .status(CarStatus.ACTIVE)
                    .build();
            car1 = carRepository.save(car1);

            Car car2 = Car.builder()
                    .rentalPlace(rental1)
                    .brand("Honda")
                    .model("HR-V 1.5 SE")
                    .type("SUV")
                    .year(2023)
                    .transmission("Automatic")
                    .seats(5)
                    .color("Meteoroid Gray Metallic")
                    .cc(1500)
                    .pricePerDay(new BigDecimal("500000.00"))
                    .imageUrl("https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?auto=format&fit=crop&w=800&q=80")
                    .description("SUV compact stylish dengan panoramic sunroof, fitur keselamatan canggih, dan handling lincah.")
                    .isAvailable(true)
                    .status(CarStatus.ACTIVE)
                    .build();
            car2 = carRepository.save(car2);

            Car car3 = Car.builder()
                    .rentalPlace(rental1)
                    .brand("Mitsubishi")
                    .model("Xpander Ultimate")
                    .type("MPV")
                    .year(2023)
                    .transmission("Automatic")
                    .seats(7)
                    .color("Jet Black Mica")
                    .cc(1500)
                    .pricePerDay(new BigDecimal("450000.00"))
                    .imageUrl("https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=800&q=80")
                    .description("MPV tangguh dengan ground clearance tinggi, suspensi empuk, dan kabin senyap.")
                    .isAvailable(true)
                    .status(CarStatus.ACTIVE)
                    .build();
            car3 = carRepository.save(car3);

            // 7. Seed Sample Completed Booking + Payment + Review
            Booking completedBooking = Booking.builder()
                    .user(user1)
                    .car(car1)
                    .rentalPlace(rental1)
                    .startDate(LocalDate.now().minusDays(5))
                    .endDate(LocalDate.now().minusDays(2))
                    .totalPrice(new BigDecimal("1950000.00"))
                    .status(BookingStatus.COMPLETED)
                    .build();
            completedBooking = bookingRepository.save(completedBooking);

            Payment payment = Payment.builder()
                    .booking(completedBooking)
                    .method(PaymentMethod.TRANSFER)
                    .amount(new BigDecimal("1950000.00"))
                    .status(PaymentStatus.SUCCESS)
                    .transactionId("TRX-SEED-1001")
                    .paymentDate(LocalDateTime.now().minusDays(5))
                    .build();
            paymentRepository.save(payment);

            Review review = Review.builder()
                    .user(user1)
                    .rentalPlace(rental1)
                    .booking(completedBooking)
                    .rating(5)
                    .comment("Pelayanan dari Mitra Jaya Rental sangat memuaskan! Mobil Zenix bersih, wangi, dan serah terima tepat waktu.")
                    .build();
            reviewRepository.save(review);

            log.info("✅ Database seeded successfully!");
            log.info("🔐 Demo Credentials:");
            log.info("   - ADMIN  : admin@rental.com / admin123");
            log.info("   - PARTNER: partner@rental.com / partner123");
            log.info("   - USER   : user@rental.com / user123");
        }
    }
}
