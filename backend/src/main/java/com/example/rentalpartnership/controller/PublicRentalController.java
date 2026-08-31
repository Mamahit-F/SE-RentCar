package com.example.rentalpartnership.controller;

import com.example.rentalpartnership.dto.car.CarResponse;
import com.example.rentalpartnership.dto.common.ApiResponse;
import com.example.rentalpartnership.dto.rental.RentalResponse;
import com.example.rentalpartnership.service.CarService;
import com.example.rentalpartnership.service.RentalPlaceService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/rentals")
@RequiredArgsConstructor
@Tag(name = "Public Rentals Discovery", description = "Public endpoints for exploring active rental places")
public class PublicRentalController {

    private final RentalPlaceService rentalPlaceService;
    private final CarService carService;

    @GetMapping
    @Operation(summary = "Search active rentals", description = "Returns active rental places with optional city and query filters")
    public ResponseEntity<ApiResponse<List<RentalResponse>>> getActiveRentals(
            @RequestParam(required = false) String city,
            @RequestParam(required = false) String query
    ) {
        List<RentalResponse> rentals = rentalPlaceService.getActiveRentals(city, query);
        return ResponseEntity.ok(ApiResponse.ok("Daftar tempat rental aktif", rentals));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get active rental detail", description = "Returns details of an active rental place")
    public ResponseEntity<ApiResponse<RentalResponse>> getRentalDetail(@PathVariable Long id) {
        RentalResponse rental = rentalPlaceService.getActiveRentalById(id);
        return ResponseEntity.ok(ApiResponse.ok("Detail tempat rental", rental));
    }

    @GetMapping("/{id}/cars")
    @Operation(summary = "Get active cars in rental place", description = "Returns available fleet belonging to an active rental place")
    public ResponseEntity<ApiResponse<List<CarResponse>>> getRentalCars(@PathVariable Long id) {
        List<CarResponse> cars = carService.getCarsByRentalPlace(id);
        return ResponseEntity.ok(ApiResponse.ok("Daftar mobil rental", cars));
    }
}
