package com.example.rentalpartnership.service;

import com.example.rentalpartnership.dto.auth.AuthResponse;
import com.example.rentalpartnership.dto.auth.LoginRequest;
import com.example.rentalpartnership.dto.auth.RegisterRequest;
import com.example.rentalpartnership.dto.user.UserResponse;
import com.example.rentalpartnership.entity.Role;
import com.example.rentalpartnership.entity.User;
import com.example.rentalpartnership.exception.BadRequestException;
import com.example.rentalpartnership.repository.UserRepository;
import com.example.rentalpartnership.security.CustomUserDetails;
import com.example.rentalpartnership.security.JwtService;
import com.example.rentalpartnership.security.SecurityUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final SecurityUtils securityUtils;

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        // Business Rule 19: Public registration cannot create ADMIN accounts
        if (request.getRole() == Role.ADMIN) {
            throw new BadRequestException("Pendaftaran role ADMIN tidak diizinkan melalui registrasi publik.");
        }

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email sudah terdaftar. Gunakan email lain.");
        }

        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail().toLowerCase().trim())
                .password(passwordEncoder.encode(request.getPassword()))
                .phone(request.getPhone())
                .role(request.getRole())
                .isActive(true)
                .build();

        User savedUser = userRepository.save(user);
        String token = jwtService.generateToken(savedUser);

        return AuthResponse.builder()
                .token(token)
                .type("Bearer")
                .user(mapToUserResponse(savedUser))
                .build();
    }

    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail().toLowerCase().trim(),
                        request.getPassword()
                )
        );

        User user = userRepository.findByEmail(request.getEmail().toLowerCase().trim())
                .orElseThrow(() -> new BadRequestException("Email atau password salah"));

        if (!Boolean.TRUE.equals(user.getIsActive())) {
            throw new BadRequestException("Akun Anda telah dinonaktifkan. Silakan hubungi admin.");
        }

        String token = jwtService.generateToken(user);

        return AuthResponse.builder()
                .token(token)
                .type("Bearer")
                .user(mapToUserResponse(user))
                .build();
    }

    public UserResponse getCurrentUser() {
        CustomUserDetails userDetails = securityUtils.getCurrentUserDetails();
        return mapToUserResponse(userDetails.getUser());
    }

    public UserResponse mapToUserResponse(User user) {
        return UserResponse.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .phone(user.getPhone())
                .role(user.getRole())
                .isActive(user.getIsActive())
                .createdAt(user.getCreatedAt())
                .build();
    }
}
