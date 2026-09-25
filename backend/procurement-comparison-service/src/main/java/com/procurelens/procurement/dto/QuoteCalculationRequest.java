package com.procurelens.procurement.dto;

import lombok.*;
import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class QuoteCalculationRequest {
    private String procurementId;
    private String vendorId;
    private BigDecimal quantity;
    private BigDecimal unitPrice;
    private BigDecimal offerPercent;
    private BigDecimal offerAmount;
    private String couponCode;
    private BigDecimal couponAmount;
    private String vendorState;
    private String buyerState;
    private BigDecimal gstRate;
    private BigDecimal additionalCharges;

    // Declared fields for anomaly testing
    private BigDecimal declaredInvoiceAmount;
    private BigDecimal declaredTaxableAmount;
    private BigDecimal declaredCgst;
    private BigDecimal declaredSgst;
    private BigDecimal declaredIgst;
    private BigDecimal declaredDiscount;
}
