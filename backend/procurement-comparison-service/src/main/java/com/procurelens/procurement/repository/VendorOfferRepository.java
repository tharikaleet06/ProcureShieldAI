package com.procurelens.procurement.repository;

import com.procurelens.procurement.model.VendorOffer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface VendorOfferRepository extends JpaRepository<VendorOffer, String> {
    List<VendorOffer> findByVendorIdAndIsActiveTrue(String vendorId);
}
