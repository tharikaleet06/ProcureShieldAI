package com.procurelens.procurement.model;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "procurement_quotes")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProcurementQuote {

    @Id
    @Column(length = 50)
    private String id;

    @Column(name = "procurement_id", nullable = false, length = 50)
    private String procurementId;

    @Column(name = "vendor_id", nullable = false, length = 50)
    private String vendorId;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal quantity;

    @Column(name = "unit_price", nullable = false, precision = 15, scale = 2)
    private BigDecimal unitPrice;

    @Column(name = "base_amount", nullable = false, precision = 15, scale = 2)
    private BigDecimal baseAmount;

    @Column(name = "offer_percent", precision = 5, scale = 2)
    @Builder.Default
    private BigDecimal offerPercent = BigDecimal.ZERO;

    @Column(name = "offer_amount", precision = 15, scale = 2)
    @Builder.Default
    private BigDecimal offerAmount = BigDecimal.ZERO;

    @Column(name = "coupon_code", length = 50)
    private String couponCode;

    @Column(name = "coupon_amount", precision = 15, scale = 2)
    @Builder.Default
    private BigDecimal couponAmount = BigDecimal.ZERO;

    @Column(name = "eligible_discount_amount", nullable = false, precision = 15, scale = 2)
    @Builder.Default
    private BigDecimal eligibleDiscountAmount = BigDecimal.ZERO;

    @Column(name = "taxable_amount", nullable = false, precision = 15, scale = 2)
    private BigDecimal taxableAmount;

    @Column(name = "gst_rate", nullable = false, precision = 5, scale = 2)
    private BigDecimal gstRate;

    @Column(name = "tax_type", nullable = false, length = 30)
    private String taxType; // INTRA_STATE, INTER_STATE

    @Column(name = "cgst_amount", nullable = false, precision = 15, scale = 2)
    @Builder.Default
    private BigDecimal cgstAmount = BigDecimal.ZERO;

    @Column(name = "sgst_amount", nullable = false, precision = 15, scale = 2)
    @Builder.Default
    private BigDecimal sgstAmount = BigDecimal.ZERO;

    @Column(name = "igst_amount", nullable = false, precision = 15, scale = 2)
    @Builder.Default
    private BigDecimal igstAmount = BigDecimal.ZERO;

    @Column(name = "additional_charges", nullable = false, precision = 15, scale = 2)
    @Builder.Default
    private BigDecimal additionalCharges = BigDecimal.ZERO;

    @Column(name = "final_amount", nullable = false, precision = 15, scale = 2)
    private BigDecimal finalAmount;

    @Column(name = "declared_invoice_amount", precision = 15, scale = 2)
    private BigDecimal declaredInvoiceAmount;

    @Column(name = "declared_discount", precision = 15, scale = 2)
    private BigDecimal declaredDiscount;

    @Column(name = "declared_cgst", precision = 15, scale = 2)
    private BigDecimal declaredCgst;

    @Column(name = "declared_sgst", precision = 15, scale = 2)
    private BigDecimal declaredSgst;

    @Column(name = "declared_igst", precision = 15, scale = 2)
    private BigDecimal declaredIgst;

    @Column(name = "is_selected")
    @Builder.Default
    private Boolean isSelected = false;

    @Column(name = "anomaly_flags", length = 500)
    private String anomalyFlags;

    @Column(name = "created_at", insertable = false, updatable = false)
    private LocalDateTime createdAt;
}
