package com.example.rentalpartnership.controller;

import com.example.rentalpartnership.dto.car.CarResponse;
import com.example.rentalpartnership.dto.common.ApiResponse;
import com.example.rentalpartnership.service.CarService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/cars")
@RequiredArgsConstructor
@Tag(name = "Public Cars Discovery", description = "Public endpoints for exploring cars fleet")
public class PublicCarController {

    private final CarService carService;

    @GetMapping
    @Operation(summary = "Search available cars", description = "Search available active cars across all active partners")
    public ResponseEntity<ApiResponse<List<CarResponse>>> searchCars(
            @RequestParam(required = false) String type,
            @RequestParam(required = false) String transmission,
            @RequestParam(required = false) BigDecimal maxPrice,
            @RequestParam(required = false) String search
    ) {
        List<CarResponse> cars = carService.getAvailableCars(type, transmission, maxPrice, search);
        return ResponseEntity.ok(ApiResponse.ok("Daftar mobil tersedia", cars));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get car detail", description = "Returns detail of a specific active car")
    public ResponseEntity<ApiResponse<CarResponse>> getCarDetail(@PathVariable Long id) {
        CarResponse car = carService.getCarById(id);
        return ResponseEntity.ok(ApiResponse.ok("Detail mobil", car));
    }
}
