package com.procurelens.procurement.dto;

import lombok.*;
import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class QuoteCalculationResponse {
    private String quoteId;
    private String vendorId;
    private String vendorName;
    private String gstin;
    private String vendorState;
    private String buyerState;
    private BigDecimal quantity;
    private BigDecimal unitPrice;
    private BigDecimal baseAmount;
    private BigDecimal offerPercent;
    private BigDecimal offerAmount;
    private String couponCode;
    private BigDecimal couponAmount;
    private BigDecimal eligibleDiscountAmount;
    private BigDecimal taxableAmount;
    private BigDecimal gstRate;
    private String taxType; // INTRA_STATE, INTER_STATE
    private BigDecimal cgstAmount;
    private BigDecimal sgstAmount;
    private BigDecimal igstAmount;
    private BigDecimal totalGstAmount;
    private BigDecimal additionalCharges;
    private BigDecimal finalAmount;

    // Comparison Metrics
    private BigDecimal deviationFromAverage;
    private BigDecimal deviationPercentage;
    private Integer effectiveCostRank;

    // Risk Analysis Metrics
    private Integer riskScore;
    private String riskLevel; // LOW, MEDIUM, HIGH, CRITICAL
    private boolean requiresReview;
    private String suggestedAction;
    private List<String> explainableReasons;
    private Object anomalyDetails;
}
