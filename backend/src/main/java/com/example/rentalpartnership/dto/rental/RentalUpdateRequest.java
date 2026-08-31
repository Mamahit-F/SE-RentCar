package com.example.rentalpartnership.dto.rental;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RentalUpdateRequest {

    @NotBlank(message = "Nama rental wajib diisi")
    private String name;

    private String description;

    @NotBlank(message = "Alamat rental wajib diisi")
    private String address;

    @NotBlank(message = "Kota wajib diisi")
    private String city;

    @NotBlank(message = "Provinsi wajib diisi")
    private String province;

    private String phone;

    private String email;

    private Double latitude;

    private Double longitude;

    private String businessLicense;

    private String documentUrl;
}
