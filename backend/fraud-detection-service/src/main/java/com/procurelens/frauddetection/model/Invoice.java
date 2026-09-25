package com.procurelens.frauddetection.model;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "invoices")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Invoice {

    @Id
    @Column(length = 50)
    private String id;

    @Column(name = "invoice_number", unique = true, nullable = false, length = 50)
    private String invoiceNumber;

    @Column(name = "po_number", nullable = false, length = 50)
    private String poNumber;

    @Column(name = "vendor_id", nullable = false, length = 50)
    private String vendorId;

    @Column(name = "item_code", nullable = false, length = 50)
    private String itemCode;

    @Column(name = "item_description", nullable = false)
    private String itemDescription;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal quantity;

    @Column(nullable = false, length = 30)
    private String unit;

    @Column(name = "unit_price", nullable = false, precision = 15, scale = 2)
    private BigDecimal unitPrice;

    @Column(name = "total_amount", nullable = false, precision = 15, scale = 2)
    private BigDecimal totalAmount;

    @Column(name = "historical_baseline_price", nullable = false, precision = 15, scale = 2)
    private BigDecimal historicalBaselinePrice;

    @Column(name = "market_index_price", precision = 15, scale = 2)
    private BigDecimal marketIndexPrice;

    @Column(name = "price_variance_percent", precision = 8, scale = 2)
    private BigDecimal priceVariancePercent;

    @Column(nullable = false, length = 150)
    private String department;

    @Column(name = "approver_name", nullable = false, length = 150)
    private String approverName;

    @Column(name = "risk_score")
    private Integer riskScore;

    @Column(name = "risk_verdict", length = 100)
    private String riskVerdict;

    @Column(nullable = false, length = 50)
    private String status;

    @Column(name = "invoice_date", nullable = false)
    private LocalDate invoiceDate;

    @Column(name = "created_at", insertable = false, updatable = false)
    private LocalDateTime createdAt;
}
