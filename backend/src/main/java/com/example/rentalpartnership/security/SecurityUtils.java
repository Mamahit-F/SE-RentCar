package com.example.rentalpartnership.security;

import com.example.rentalpartnership.entity.Role;
import com.example.rentalpartnership.exception.BadRequestException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

@Component
public class SecurityUtils {

    public Long getCurrentUserId() {
        CustomUserDetails userDetails = getCurrentUserDetails();
        return userDetails.getId();
    }

    public String getCurrentUserEmail() {
        CustomUserDetails userDetails = getCurrentUserDetails();
        return userDetails.getUsername();
    }

    public Role getCurrentUserRole() {
        CustomUserDetails userDetails = getCurrentUserDetails();
        return userDetails.getUser().getRole();
    }

    public CustomUserDetails getCurrentUserDetails() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated() || !(authentication.getPrincipal() instanceof CustomUserDetails)) {
            throw new BadRequestException("User tidak terautentikasi atau sesi telah berakhir");
        }
        return (CustomUserDetails) authentication.getPrincipal();
    }
}
