package com.example.rentalpartnership.controller;

import com.example.rentalpartnership.dto.auth.AuthResponse;
import com.example.rentalpartnership.dto.auth.LoginRequest;
import com.example.rentalpartnership.dto.auth.RegisterRequest;
import com.example.rentalpartnership.dto.common.ApiResponse;
import com.example.rentalpartnership.dto.user.UserResponse;
import com.example.rentalpartnership.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Tag(name = "Authentication", description = "Endpoints for user & partner registration, login, and token validation")
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    @Operation(summary = "Register user / partner", description = "Public registration for USER or PARTNER roles")
    public ResponseEntity<ApiResponse<AuthResponse>> register(@Valid @RequestBody RegisterRequest request) {
        AuthResponse response = authService.register(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok("Registrasi berhasil", response));
    }

    @PostMapping("/login")
    @Operation(summary = "Login account", description = "Authenticates credentials and returns JWT Bearer token")
    public ResponseEntity<ApiResponse<AuthResponse>> login(@Valid @RequestBody LoginRequest request) {
        AuthResponse response = authService.login(request);
        return ResponseEntity.ok(ApiResponse.ok("Login berhasil", response));
    }

    @GetMapping("/me")
    @Operation(summary = "Current user profile", description = "Fetches currently logged in user info from JWT")
    public ResponseEntity<ApiResponse<UserResponse>> getCurrentUser() {
        UserResponse response = authService.getCurrentUser();
        return ResponseEntity.ok(ApiResponse.ok("Data pengguna saat ini", response));
    }
}
