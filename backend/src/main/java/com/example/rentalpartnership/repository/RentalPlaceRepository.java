package com.example.rentalpartnership.repository;

import com.example.rentalpartnership.entity.RentalPlace;
import com.example.rentalpartnership.entity.RentalStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RentalPlaceRepository extends JpaRepository<RentalPlace, Long> {
    
    List<RentalPlace> findByPartnerId(Long partnerId);
    
    Optional<RentalPlace> findFirstByPartnerId(Long partnerId);
    
    List<RentalPlace> findByStatus(RentalStatus status);
    
    long countByStatus(RentalStatus status);

    @Query("SELECT r FROM RentalPlace r WHERE r.status = :status AND " +
           "(CAST(:city AS string) IS NULL OR LOWER(r.city) LIKE LOWER(CONCAT('%', CAST(:city AS string), '%'))) AND " +
           "(CAST(:query AS string) IS NULL OR LOWER(r.name) LIKE LOWER(CONCAT('%', CAST(:query AS string), '%')) OR LOWER(r.description) LIKE LOWER(CONCAT('%', CAST(:query AS string), '%')))")
    List<RentalPlace> searchActiveRentals(@Param("status") RentalStatus status, 
                                         @Param("city") String city, 
                                         @Param("query") String query);
}
