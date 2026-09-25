package com.procurelens.procurement.dto;

import lombok.*;
import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProcurementComparisonResponse {
    private String procurementId;
    private String requirementTitle;
    private String category;
    private BigDecimal quantity;
    private String unit;
    private String buyerState;
    private BigDecimal gstRate;
    private BigDecimal lowestEffectiveCost;
    private BigDecimal highestEffectiveCost;
    private BigDecimal averageEffectiveCost;
    private Integer totalQuotesCount;
    private Integer flaggedAnomaliesCount;
    private List<QuoteCalculationResponse> vendorQuotations;
}
