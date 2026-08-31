package com.example.rentalpartnership.service;

import com.example.rentalpartnership.dto.car.CarCreateRequest;
import com.example.rentalpartnership.dto.car.CarResponse;
import com.example.rentalpartnership.dto.car.CarUpdateRequest;
import com.example.rentalpartnership.entity.Car;
import com.example.rentalpartnership.entity.CarStatus;
import com.example.rentalpartnership.entity.RentalPlace;
import com.example.rentalpartnership.entity.RentalStatus;
import com.example.rentalpartnership.exception.BadRequestException;
import com.example.rentalpartnership.exception.ResourceNotFoundException;
import com.example.rentalpartnership.repository.CarRepository;
import com.example.rentalpartnership.repository.RentalPlaceRepository;
import com.example.rentalpartnership.security.SecurityUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CarService {

    private final CarRepository carRepository;
    private final RentalPlaceRepository rentalPlaceRepository;
    private final SecurityUtils securityUtils;

    // ==========================================
    // PARTNER METHODS (Rules 4 & 5: Ownership verification)
    // ==========================================
    @Transactional
    public CarResponse createCar(CarCreateRequest request) {
        Long partnerId = securityUtils.getCurrentUserId();
        
        // Find partner's rental place
        RentalPlace rentalPlace = rentalPlaceRepository.findFirstByPartnerId(partnerId)
                .orElseThrow(() -> new BadRequestException("Anda belum memiliki tempat rental. Daftarkan tempat rental terlebih dahulu."));

        // Business Rule: Car cannot be added if rental is not ACTIVE
        if (rentalPlace.getStatus() != RentalStatus.ACTIVE) {
            throw new BadRequestException("Tempat rental Anda belum disetujui (Status: " + rentalPlace.getStatus() + "). Anda hanya dapat menambah armada setelah disetujui oleh Admin.");
        }

        Car car = Car.builder()
                .rentalPlace(rentalPlace)
                .brand(request.getBrand())
                .model(request.getModel())
                .type(request.getType())
                .year(request.getYear())
                .transmission(request.getTransmission())
                .seats(request.getSeats())
                .color(request.getColor())
                .cc(request.getCc())
                .pricePerDay(request.getPricePerDay())
                .imageUrl(request.getImageUrl())
                .description(request.getDescription())
                .isAvailable(true)
                .status(CarStatus.ACTIVE)
                .build();

        return mapToCarResponse(carRepository.save(car));
    }

    public List<CarResponse> getMyCars() {
        Long partnerId = securityUtils.getCurrentUserId();
        RentalPlace rentalPlace = rentalPlaceRepository.findFirstByPartnerId(partnerId)
                .orElseThrow(() -> new BadRequestException("Tempat rental tidak ditemukan untuk partner ini"));

        return carRepository.findByRentalPlaceId(rentalPlace.getId()).stream()
                .map(this::mapToCarResponse)
                .collect(Collectors.toList());
    }

    public CarResponse getMyCarById(Long carId) {
        Long partnerId = securityUtils.getCurrentUserId();
        Car car = carRepository.findById(carId)
                .orElseThrow(() -> new ResourceNotFoundException("Mobil tidak ditemukan"));

        if (!car.getRentalPlace().getPartner().getId().equals(partnerId)) {
            throw new BadRequestException("Anda tidak memiliki akses ke mobil ini");
        }

        return mapToCarResponse(car);
    }

    @Transactional
    public CarResponse updateMyCar(Long carId, CarUpdateRequest request) {
        Long partnerId = securityUtils.getCurrentUserId();
        Car car = carRepository.findById(carId)
                .orElseThrow(() -> new ResourceNotFoundException("Mobil tidak ditemukan"));

        if (!car.getRentalPlace().getPartner().getId().equals(partnerId)) {
            throw new BadRequestException("Anda tidak berhak mengubah mobil ini");
        }

        car.setBrand(request.getBrand());
        car.setModel(request.getModel());
        car.setType(request.getType());
        car.setYear(request.getYear());
        car.setTransmission(request.getTransmission());
        car.setSeats(request.getSeats());
        car.setColor(request.getColor());
        car.setCc(request.getCc());
        car.setPricePerDay(request.getPricePerDay());
        car.setImageUrl(request.getImageUrl());
        car.setDescription(request.getDescription());
        if (request.getIsAvailable() != null) {
            car.setIsAvailable(request.getIsAvailable());
        }
        if (request.getStatus() != null) {
            car.setStatus(request.getStatus());
        }

        return mapToCarResponse(carRepository.save(car));
    }

    @Transactional
    public void deleteMyCar(Long carId) {
        Long partnerId = securityUtils.getCurrentUserId();
        Car car = carRepository.findById(carId)
                .orElseThrow(() -> new ResourceNotFoundException("Mobil tidak ditemukan"));

        if (!car.getRentalPlace().getPartner().getId().equals(partnerId)) {
            throw new BadRequestException("Anda tidak berhak menghapus mobil ini");
        }

        // Soft delete by setting status INACTIVE
        car.setStatus(CarStatus.INACTIVE);
        car.setIsAvailable(false);
        carRepository.save(car);
    }

    // ==========================================
    // PUBLIC / USER DISCOVERY
    // ==========================================
    public List<CarResponse> getAvailableCars(String type, String transmission, BigDecimal maxPrice, String search) {
        return carRepository.searchAvailableCars(type, transmission, maxPrice, search).stream()
                .map(this::mapToCarResponse)
                .collect(Collectors.toList());
    }

    public List<CarResponse> getCarsByRentalPlace(Long rentalPlaceId) {
        RentalPlace rentalPlace = rentalPlaceRepository.findById(rentalPlaceId)
                .orElseThrow(() -> new ResourceNotFoundException("Tempat rental tidak ditemukan"));

        if (rentalPlace.getStatus() != RentalStatus.ACTIVE) {
            throw new ResourceNotFoundException("Tempat rental saat ini tidak aktif");
        }

        return carRepository.findByRentalPlaceIdAndStatus(rentalPlaceId, CarStatus.ACTIVE).stream()
                .map(this::mapToCarResponse)
                .collect(Collectors.toList());
    }

    public CarResponse getCarById(Long id) {
        Car car = carRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Mobil tidak ditemukan"));

        if (car.getStatus() != CarStatus.ACTIVE || car.getRentalPlace().getStatus() != RentalStatus.ACTIVE) {
            throw new ResourceNotFoundException("Mobil saat ini tidak tersedia untuk publik");
        }

        return mapToCarResponse(car);
    }

    public CarResponse mapToCarResponse(Car car) {
        return CarResponse.builder()
                .id(car.getId())
                .rentalPlaceId(car.getRentalPlace().getId())
                .rentalPlaceName(car.getRentalPlace().getName())
                .rentalPlaceCity(car.getRentalPlace().getCity())
                .brand(car.getBrand())
                .model(car.getModel())
                .type(car.getType())
                .year(car.getYear())
                .transmission(car.getTransmission())
                .seats(car.getSeats())
                .color(car.getColor())
                .cc(car.getCc())
                .pricePerDay(car.getPricePerDay())
                .imageUrl(car.getImageUrl())
                .description(car.getDescription())
                .isAvailable(car.getIsAvailable())
                .status(car.getStatus())
                .createdAt(car.getCreatedAt())
                .updatedAt(car.getUpdatedAt())
                .build();
    }
}
