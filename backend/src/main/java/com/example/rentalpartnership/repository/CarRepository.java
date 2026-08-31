package com.example.rentalpartnership.repository;

import com.example.rentalpartnership.entity.Car;
import com.example.rentalpartnership.entity.CarStatus;
import com.example.rentalpartnership.entity.RentalStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Repository
public interface CarRepository extends JpaRepository<Car, Long> {

    List<Car> findByRentalPlaceId(Long rentalPlaceId);

    List<Car> findByRentalPlaceIdAndStatus(Long rentalPlaceId, CarStatus status);

    Optional<Car> findByIdAndStatus(Long id, CarStatus status);

    long countByRentalPlaceId(Long rentalPlaceId);

    long countByRentalPlaceIdAndStatus(Long rentalPlaceId, CarStatus status);

    @Query("SELECT c FROM Car c WHERE c.status = com.example.rentalpartnership.entity.CarStatus.ACTIVE AND c.isAvailable = true AND c.rentalPlace.status = com.example.rentalpartnership.entity.RentalStatus.ACTIVE AND " +
           "(CAST(:type AS string) IS NULL OR LOWER(c.type) = LOWER(CAST(:type AS string))) AND " +
           "(CAST(:transmission AS string) IS NULL OR LOWER(c.transmission) = LOWER(CAST(:transmission AS string))) AND " +
           "(:maxPrice IS NULL OR c.pricePerDay <= :maxPrice) AND " +
           "(CAST(:search AS string) IS NULL OR LOWER(c.brand) LIKE LOWER(CONCAT('%', CAST(:search AS string), '%')) OR LOWER(c.model) LIKE LOWER(CONCAT('%', CAST(:search AS string), '%')))")
    List<Car> searchAvailableCars(@Param("type") String type,
                                 @Param("transmission") String transmission,
                                 @Param("maxPrice") BigDecimal maxPrice,
                                 @Param("search") String search);
}
