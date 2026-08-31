package com.example.rentalpartnership.controller;

import com.example.rentalpartnership.dto.common.ApiResponse;
import com.example.rentalpartnership.dto.user.UserResponse;
import com.example.rentalpartnership.dto.user.UserUpdateRequest;
import com.example.rentalpartnership.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@Tag(name = "User Profile", description = "Endpoints for viewing and updating personal profile")
public class UserController {

    private final UserService userService;

    @GetMapping("/profile")
    @Operation(summary = "Get user profile", description = "Returns profile of authenticated user")
    public ResponseEntity<ApiResponse<UserResponse>> getProfile() {
        return ResponseEntity.ok(ApiResponse.ok("Profile pengguna", userService.getProfile()));
    }

    @PutMapping("/profile")
    @Operation(summary = "Update user profile", description = "Updates profile data (name, phone) of authenticated user")
    public ResponseEntity<ApiResponse<UserResponse>> updateProfile(@Valid @RequestBody UserUpdateRequest request) {
        return ResponseEntity.ok(ApiResponse.ok("Profile berhasil diperbarui", userService.updateProfile(request)));
    }
}
