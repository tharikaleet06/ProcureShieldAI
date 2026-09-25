package com.procurelens.procurement.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "vendors")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Vendor {

    @Id
    @Column(length = 50)
    private String id;

    @Column(name = "vendor_name", nullable = false)
    private String vendorName;

    @Column(nullable = false, length = 150)
    private String category;

    @Column(name = "risk_tier", nullable = false, length = 30)
    private String riskTier;

    @Column(name = "incorporation_days", nullable = false)
    private Integer incorporationDays;

    @Column(unique = true, nullable = false, length = 20)
    private String gstin;

    @Column(name = "registered_address", nullable = false)
    private String registeredAddress;

    @Column(nullable = false, length = 50)
    private String state;

    @Column(name = "gst_status", nullable = false, length = 30)
    private String gstStatus;

    @Column(name = "bank_routing", nullable = false, length = 100)
    private String bankRouting;

    @Column(name = "bank_changed_recently")
    @Builder.Default
    private Boolean bankChangedRecently = false;

    @Column(name = "historical_risk_score", nullable = false)
    @Builder.Default
    private Integer historicalRiskScore = 15;

    @Column(name = "is_active")
    @Builder.Default
    private Boolean isActive = true;

    @Column(name = "created_at", insertable = false, updatable = false)
    private LocalDateTime createdAt;
}
