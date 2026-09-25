package com.procurelens.procurement.service;

import org.springframework.stereotype.Service;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.Set;

@Service
public class GstCalculationService {

    public static final Set<BigDecimal> STANDARD_GST_RATES = Set.of(
        new BigDecimal("0.00"),
        new BigDecimal("5.00"),
        new BigDecimal("12.00"),
        new BigDecimal("18.00"),
        new BigDecimal("28.00")
    );

    public static class GstResult {
        public String taxType; // INTRA_STATE, INTER_STATE
        public BigDecimal gstRate;
        public BigDecimal cgstAmount;
        public BigDecimal sgstAmount;
        public BigDecimal igstAmount;
        public BigDecimal totalGst;
        public BigDecimal finalAmount;

        public GstResult(String taxType, BigDecimal gstRate, BigDecimal cgstAmount, BigDecimal sgstAmount, BigDecimal igstAmount, BigDecimal totalGst, BigDecimal finalAmount) {
            this.taxType = taxType;
            this.gstRate = gstRate;
            this.cgstAmount = cgstAmount;
            this.sgstAmount = sgstAmount;
            this.igstAmount = igstAmount;
            this.totalGst = totalGst;
            this.finalAmount = finalAmount;
        }
    }

    public GstResult calculateGst(BigDecimal taxableAmount, BigDecimal gstRate, String vendorState, String buyerState, BigDecimal additionalCharges) {
        if (taxableAmount == null) taxableAmount = BigDecimal.ZERO;
        if (gstRate == null) gstRate = new BigDecimal("18.00");
        if (additionalCharges == null) additionalCharges = BigDecimal.ZERO;

        boolean isIntraState = vendorState != null && buyerState != null && 
                               vendorState.trim().equalsIgnoreCase(buyerState.trim());

        BigDecimal cgst = BigDecimal.ZERO.setScale(2, RoundingMode.HALF_UP);
        BigDecimal sgst = BigDecimal.ZERO.setScale(2, RoundingMode.HALF_UP);
        BigDecimal igst = BigDecimal.ZERO.setScale(2, RoundingMode.HALF_UP);
        String taxType;

        if (isIntraState) {
            taxType = "INTRA_STATE";
            BigDecimal halfRate = gstRate.divide(BigDecimal.valueOf(2), 4, RoundingMode.HALF_UP);
            cgst = taxableAmount.multiply(halfRate).divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP);
            sgst = taxableAmount.multiply(halfRate).divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP);
        } else {
            taxType = "INTER_STATE";
            igst = taxableAmount.multiply(gstRate).divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP);
        }

        BigDecimal totalGst = cgst.add(sgst).add(igst);
        BigDecimal finalAmount = taxableAmount.add(totalGst).add(additionalCharges).setScale(2, RoundingMode.HALF_UP);

        return new GstResult(taxType, gstRate, cgst, sgst, igst, totalGst, finalAmount);
    }
}
