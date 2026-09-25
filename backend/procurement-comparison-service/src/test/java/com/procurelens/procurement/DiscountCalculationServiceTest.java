package com.procurelens.procurement;

import com.procurelens.procurement.model.VendorCoupon;
import com.procurelens.procurement.model.VendorOffer;
import com.procurelens.procurement.service.DiscountCalculationService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import java.math.BigDecimal;
import java.time.LocalDate;

import static org.junit.jupiter.api.Assertions.*;

public class DiscountCalculationServiceTest {

    private DiscountCalculationService discountCalculationService;

    @BeforeEach
    public void setUp() {
        discountCalculationService = new DiscountCalculationService();
    }

    @Test
    public void testPercentageOfferAndFixedCoupon() {
        VendorOffer offer = VendorOffer.builder()
            .id("OFF-1")
            .vendorId("VEND-A")
            .offerType("PERCENTAGE")
            .offerValue(new BigDecimal("10.00"))
            .minimumPurchase(BigDecimal.ZERO)
            .isActive(true)
            .build();

        VendorCoupon coupon = VendorCoupon.builder()
            .id("CPN-1")
            .vendorId("VEND-A")
            .couponCode("SAVE5K")
            .discountType("FIXED_AMOUNT")
            .discountValue(new BigDecimal("5000.00"))
            .minimumOrder(new BigDecimal("10000.00"))
            .usageLimit(10)
            .usedCount(0)
            .isActive(true)
            .build();

        DiscountCalculationService.DiscountResult result = discountCalculationService.calculateDiscount(
            new BigDecimal("100"),
            new BigDecimal("1000.00"),
            offer,
            null,
            coupon,
            "SAVE5K",
            null,
            "VEND-A",
            LocalDate.now()
        );

        assertEquals(new BigDecimal("100000.00"), result.baseAmount);
        assertEquals(new BigDecimal("10000.00"), result.offerAmount);
        assertEquals(new BigDecimal("5000.00"), result.couponAmount);
        assertEquals(new BigDecimal("15000.00"), result.eligibleDiscountAmount);
        assertEquals(new BigDecimal("85000.00"), result.taxableAmount);
        assertTrue(result.couponValid);
    }
}
