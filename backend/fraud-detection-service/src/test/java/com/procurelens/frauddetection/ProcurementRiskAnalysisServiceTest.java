package com.procurelens.frauddetection;

import com.procurelens.frauddetection.model.Invoice;
import com.procurelens.frauddetection.model.ProcurementQuote;
import com.procurelens.frauddetection.service.ProcurementRiskAnalysisService;
import com.procurelens.frauddetection.service.ProcurementRiskAnalysisService.RiskAnalysisResult;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import java.math.BigDecimal;

import static org.junit.jupiter.api.Assertions.*;

public class ProcurementRiskAnalysisServiceTest {

    private ProcurementRiskAnalysisService riskAnalysisService;

    @BeforeEach
    public void setUp() {
        riskAnalysisService = new ProcurementRiskAnalysisService();
    }

    @Test
    public void testPriceSpikeAnomalyDetection() {
        Invoice invoice = Invoice.builder()
            .id("TXN-2026-9021")
            .invoiceNumber("INV-2026-9021")
            .unitPrice(new BigDecimal("185000.00"))
            .historicalBaselinePrice(new BigDecimal("50000.00"))
            .totalAmount(new BigDecimal("185000.00"))
            .status("FLAGGED_CRITICAL")
            .build();

        RiskAnalysisResult result = riskAnalysisService.analyzeInvoiceRisk(invoice);

        assertNotNull(result);
        assertTrue(result.riskScore >= 60);
        assertEquals("CRITICAL", result.riskLevel);
        assertEquals(new BigDecimal("3.70"), result.priceMultiplier);
        assertTrue(result.anomalyFlags.stream().anyMatch(f -> f.contains("CRITICAL_PRICE_SPIKE")));
    }

    @Test
    public void testCompliantQuoteLowRisk() {
        ProcurementQuote quote = ProcurementQuote.builder()
            .id("QTE-001")
            .vendorId("VEND-A")
            .taxableAmount(new BigDecimal("85000.00"))
            .cgstAmount(new BigDecimal("7650.00"))
            .sgstAmount(new BigDecimal("7650.00"))
            .finalAmount(new BigDecimal("100300.00"))
            .offerAmount(new BigDecimal("10000.00"))
            .couponAmount(new BigDecimal("5000.00"))
            .declaredInvoiceAmount(new BigDecimal("100300.00"))
            .declaredCgst(new BigDecimal("7650.00"))
            .declaredSgst(new BigDecimal("7650.00"))
            .build();

        RiskAnalysisResult result = riskAnalysisService.analyzeQuoteRisk(
            quote, new BigDecimal("100000.00")
        );

        assertEquals("LOW", result.riskLevel);
        assertTrue(result.riskScore < 30);
    }
}
