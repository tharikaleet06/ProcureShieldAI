package com.procurelens.procurement;

import com.procurelens.procurement.service.GstCalculationService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import java.math.BigDecimal;

import static org.junit.jupiter.api.Assertions.*;

public class GstCalculationServiceTest {

    private GstCalculationService gstCalculationService;

    @BeforeEach
    public void setUp() {
        gstCalculationService = new GstCalculationService();
    }

    @Test
    public void testIntraStateGst18Percent() {
        BigDecimal taxable = new BigDecimal("85000.00");
        BigDecimal gstRate = new BigDecimal("18.00");
        
        GstCalculationService.GstResult result = gstCalculationService.calculateGst(
            taxable, gstRate, "Maharashtra", "Maharashtra", BigDecimal.ZERO
        );

        assertEquals("INTRA_STATE", result.taxType);
        assertEquals(new BigDecimal("7650.00"), result.cgstAmount);
        assertEquals(new BigDecimal("7650.00"), result.sgstAmount);
        assertEquals(new BigDecimal("0.00"), result.igstAmount);
        assertEquals(new BigDecimal("15300.00"), result.totalGst);
        assertEquals(new BigDecimal("100300.00"), result.finalAmount);
    }
}
