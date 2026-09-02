package com.example.rentalpartnership.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
public class CorsConfig {

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {

        CorsConfiguration configuration = new CorsConfiguration();

        // ============================================================
        // ALLOWED ORIGINS
        // ============================================================
        configuration.setAllowedOriginPatterns(List.of(
                "https://se-rentcar.vercel.app",
                "http://localhost:*"
        ));

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
        configuration.setAllowedHeaders(List.of(
                "*"
        ));

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
        // CACHE PREFLIGHT
        // ============================================================
        configuration.setMaxAge(3600L);

        // ============================================================
        // REGISTER CORS CONFIGURATION
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
