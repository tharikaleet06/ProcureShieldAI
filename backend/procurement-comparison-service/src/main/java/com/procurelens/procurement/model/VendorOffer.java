package com.procurelens.procurement.model;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "vendor_offers")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class VendorOffer {

    @Id
    @Column(length = 50)
    private String id;

    @Column(name = "vendor_id", nullable = false, length = 50)
    private String vendorId;

    @Column(name = "offer_type", nullable = false, length = 30)
    private String offerType; // PERCENTAGE, FIXED_AMOUNT

    @Column(name = "offer_value", nullable = false, precision = 15, scale = 2)
    private BigDecimal offerValue;

    @Column(name = "minimum_purchase", precision = 15, scale = 2)
    @Builder.Default
    private BigDecimal minimumPurchase = BigDecimal.ZERO;

    @Column(name = "maximum_discount", precision = 15, scale = 2)
    private BigDecimal maximumDiscount;

    @Column(name = "valid_from", nullable = false)
    private LocalDate validFrom;

    @Column(name = "valid_to", nullable = false)
    private LocalDate validTo;

    @Column(name = "is_active")
    @Builder.Default
    private Boolean isActive = true;

    @Column(name = "created_at", insertable = false, updatable = false)
    private LocalDateTime createdAt;
}
