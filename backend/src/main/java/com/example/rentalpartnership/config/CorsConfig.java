package com.example.rentalpartnership.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.List;

@Configuration
public class CorsConfig {

    @Value("${cors.allowed-origins}")
    private String allowedOrigins;

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {

        CorsConfiguration configuration = new CorsConfiguration();

        // ============================================================
        // ALLOWED ORIGINS
        // ============================================================

        List<String> origins = Arrays.stream(allowedOrigins.split(","))
                .map(String::trim)
                .filter(origin -> !origin.isEmpty())
                .toList();

        configuration.setAllowedOrigins(origins);

        // ============================================================
        // ALLOWED METHODS
        // ============================================================

        configuration.setAllowedMethods(List.of(
                "GET",
                "POST",
                "PUT",
                "PATCH",
                "DELETE",
                "OPTIONS"
        ));

        // ============================================================
        // ALLOWED HEADERS
        // ============================================================

        configuration.setAllowedHeaders(List.of("*"));

        // ============================================================
        // EXPOSED HEADERS
        // ============================================================

        configuration.setExposedHeaders(List.of(
                "Authorization"
        ));

        // ============================================================
        // CREDENTIALS
        // ============================================================

        configuration.setAllowCredentials(true);

        // ============================================================
        // PREFLIGHT CACHE
        // ============================================================

        configuration.setMaxAge(3600L);

        // ============================================================
        // APPLY TO ALL ENDPOINTS
        // ============================================================

        UrlBasedCorsConfigurationSource source =
                new UrlBasedCorsConfigurationSource();

        source.registerCorsConfiguration(
                "/**",
                configuration
        );

        return source;
    }
}
