package com.procurelens.procurement.repository;

import com.procurelens.procurement.model.VendorCoupon;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;
import java.util.List;

@Repository
public interface VendorCouponRepository extends JpaRepository<VendorCoupon, String> {
    Optional<VendorCoupon> findByCouponCodeAndIsActiveTrue(String couponCode);
    List<VendorCoupon> findByVendorIdAndIsActiveTrue(String vendorId);
}
