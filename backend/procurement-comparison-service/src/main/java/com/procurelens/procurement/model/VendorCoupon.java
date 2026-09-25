package com.procurelens.procurement.model;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "vendor_coupons")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class VendorCoupon {

    @Id
    @Column(length = 50)
    private String id;

    @Column(name = "vendor_id", nullable = false, length = 50)
    private String vendorId;

    @Column(name = "coupon_code", unique = true, nullable = false, length = 50)
    private String couponCode;

    @Column(name = "discount_type", nullable = false, length = 30)
    private String discountType; // PERCENTAGE, FIXED_AMOUNT

    @Column(name = "discount_value", nullable = false, precision = 15, scale = 2)
    private BigDecimal discountValue;

    @Column(name = "minimum_order", precision = 15, scale = 2)
    @Builder.Default
    private BigDecimal minimumOrder = BigDecimal.ZERO;

    @Column(name = "maximum_discount", precision = 15, scale = 2)
    private BigDecimal maximumDiscount;

    @Column(name = "valid_from", nullable = false)
    private LocalDate validFrom;

    @Column(name = "valid_to", nullable = false)
    private LocalDate validTo;

    @Column(name = "usage_limit")
    @Builder.Default
    private Integer usageLimit = 100;

    @Column(name = "used_count")
    @Builder.Default
    private Integer usedCount = 0;

    @Column(name = "is_active")
    @Builder.Default
    private Boolean isActive = true;

    @Column(name = "created_at", insertable = false, updatable = false)
    private LocalDateTime createdAt;
}
