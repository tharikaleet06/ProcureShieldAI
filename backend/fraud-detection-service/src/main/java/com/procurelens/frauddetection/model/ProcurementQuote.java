package com.procurelens.frauddetection.model;

import lombok.*;
import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProcurementQuote {
    private String id;
    private String vendorId;
    private String vendorName;
    private BigDecimal baseUnitPrice;
    private BigDecimal finalAmount;
    private BigDecimal taxableAmount;
    private BigDecimal cgstAmount;
    private BigDecimal sgstAmount;
    private BigDecimal igstAmount;
    private BigDecimal offerAmount;
    private BigDecimal couponAmount;

    private BigDecimal declaredInvoiceAmount;
    private BigDecimal declaredCgst;
    private BigDecimal declaredSgst;
    private BigDecimal declaredIgst;
    private BigDecimal declaredDiscount;
}
