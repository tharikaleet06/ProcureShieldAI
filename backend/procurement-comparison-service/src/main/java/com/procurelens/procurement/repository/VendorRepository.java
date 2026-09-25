package com.procurelens.procurement.repository;

import com.procurelens.procurement.model.Vendor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface VendorRepository extends JpaRepository<Vendor, String> {
    Optional<Vendor> findByGstin(String gstin);
}
