package com.procurelens.procurement.service;

import com.procurelens.procurement.model.VendorCoupon;
import com.procurelens.procurement.model.VendorOffer;
import org.springframework.stereotype.Service;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Service
public class DiscountCalculationService {

    public static class DiscountResult {
        public BigDecimal baseAmount;
        public BigDecimal offerPercent;
        public BigDecimal offerAmount;
        public BigDecimal couponAmount;
        public BigDecimal eligibleDiscountAmount;
        public BigDecimal taxableAmount;
        public List<String> validationNotes = new ArrayList<>();
        public boolean couponValid = true;
        public boolean offerValid = true;
        public String couponAnomalyReason;
        public String offerDiscrepancyReason;

        public DiscountResult(BigDecimal baseAmount, BigDecimal offerPercent, BigDecimal offerAmount, BigDecimal couponAmount, BigDecimal eligibleDiscountAmount, BigDecimal taxableAmount) {
            this.baseAmount = baseAmount;
            this.offerPercent = offerPercent;
            this.offerAmount = offerAmount;
            this.couponAmount = couponAmount;
            this.eligibleDiscountAmount = eligibleDiscountAmount;
            this.taxableAmount = taxableAmount;
        }
    }

    public DiscountResult calculateDiscount(
        BigDecimal quantity,
        BigDecimal unitPrice,
        VendorOffer vendorOffer,
        BigDecimal requestedOfferPercent,
        VendorCoupon vendorCoupon,
        String requestedCouponCode,
        BigDecimal requestedCouponAmount,
        String vendorId,
        LocalDate transactionDate
    ) {
        if (quantity == null) quantity = BigDecimal.ONE;
        if (unitPrice == null) unitPrice = BigDecimal.ZERO;
        if (transactionDate == null) transactionDate = LocalDate.now();

        BigDecimal baseAmount = quantity.multiply(unitPrice).setScale(2, RoundingMode.HALF_UP);
        BigDecimal calculatedOfferAmount = BigDecimal.ZERO.setScale(2, RoundingMode.HALF_UP);
        BigDecimal finalOfferPercent = BigDecimal.ZERO;
        
        DiscountResult result = new DiscountResult(baseAmount, BigDecimal.ZERO, BigDecimal.ZERO, BigDecimal.ZERO, BigDecimal.ZERO, baseAmount);

        // 1. Calculate Vendor Offer
        if (vendorOffer != null && Boolean.TRUE.equals(vendorOffer.getIsActive())) {
            if (baseAmount.compareTo(vendorOffer.getMinimumPurchase() != null ? vendorOffer.getMinimumPurchase() : BigDecimal.ZERO) >= 0) {
                if ("PERCENTAGE".equalsIgnoreCase(vendorOffer.getOfferType())) {
                    finalOfferPercent = vendorOffer.getOfferValue();
                    calculatedOfferAmount = baseAmount.multiply(finalOfferPercent)
                        .divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP);
                } else {
                    calculatedOfferAmount = vendorOffer.getOfferValue();
                    if (baseAmount.compareTo(BigDecimal.ZERO) > 0) {
                        finalOfferPercent = calculatedOfferAmount.multiply(BigDecimal.valueOf(100))
                            .divide(baseAmount, 2, RoundingMode.HALF_UP);
                    }
                }

                if (vendorOffer.getMaximumDiscount() != null && calculatedOfferAmount.compareTo(vendorOffer.getMaximumDiscount()) > 0) {
                    calculatedOfferAmount = vendorOffer.getMaximumDiscount();
                }
            } else {
                result.validationNotes.add("Base amount does not meet offer minimum purchase threshold.");
            }
        } else if (requestedOfferPercent != null && requestedOfferPercent.compareTo(BigDecimal.ZERO) > 0) {
            finalOfferPercent = requestedOfferPercent;
            calculatedOfferAmount = baseAmount.multiply(requestedOfferPercent)
                .divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP);
        }

        // 2. Calculate Eligible Coupon
        BigDecimal calculatedCouponAmount = BigDecimal.ZERO.setScale(2, RoundingMode.HALF_UP);
        if (vendorCoupon != null) {
            boolean belongsToVendor = vendorCoupon.getVendorId().equalsIgnoreCase(vendorId);
            boolean isActive = Boolean.TRUE.equals(vendorCoupon.getIsActive());
            boolean dateValid = (vendorCoupon.getValidFrom() == null || !transactionDate.isBefore(vendorCoupon.getValidFrom())) &&
                                (vendorCoupon.getValidTo() == null || !transactionDate.isAfter(vendorCoupon.getValidTo()));
            boolean minOrderMet = baseAmount.compareTo(vendorCoupon.getMinimumOrder() != null ? vendorCoupon.getMinimumOrder() : BigDecimal.ZERO) >= 0;
            boolean limitNotExceeded = vendorCoupon.getUsageLimit() == null || vendorCoupon.getUsedCount() < vendorCoupon.getUsageLimit();

            if (!belongsToVendor) {
                result.couponValid = false;
                result.couponAnomalyReason = "Coupon " + vendorCoupon.getCouponCode() + " does not belong to vendor " + vendorId;
            } else if (!isActive) {
                result.couponValid = false;
                result.couponAnomalyReason = "Coupon " + vendorCoupon.getCouponCode() + " is inactive or revoked.";
            } else if (!dateValid) {
                result.couponValid = false;
                result.couponAnomalyReason = "Coupon " + vendorCoupon.getCouponCode() + " has expired or is not yet valid.";
            } else if (!minOrderMet) {
                result.couponValid = false;
                result.couponAnomalyReason = "Order value ₹" + baseAmount + " is below minimum coupon requirement of ₹" + vendorCoupon.getMinimumOrder();
            } else if (!limitNotExceeded) {
                result.couponValid = false;
                result.couponAnomalyReason = "Coupon usage limit (" + vendorCoupon.getUsageLimit() + ") has been exceeded.";
            } else {
                BigDecimal postOfferAmount = baseAmount.subtract(calculatedOfferAmount).max(BigDecimal.ZERO);
                if ("PERCENTAGE".equalsIgnoreCase(vendorCoupon.getDiscountType())) {
                    calculatedCouponAmount = postOfferAmount.multiply(vendorCoupon.getDiscountValue())
                        .divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP);
                } else {
                    calculatedCouponAmount = vendorCoupon.getDiscountValue();
                }

                if (vendorCoupon.getMaximumDiscount() != null && calculatedCouponAmount.compareTo(vendorCoupon.getMaximumDiscount()) > 0) {
                    calculatedCouponAmount = vendorCoupon.getMaximumDiscount();
                }
            }
        } else if (requestedCouponAmount != null && requestedCouponAmount.compareTo(BigDecimal.ZERO) > 0) {
            calculatedCouponAmount = requestedCouponAmount;
        }

        BigDecimal totalDiscount = calculatedOfferAmount.add(calculatedCouponAmount).min(baseAmount);
        BigDecimal taxableAmount = baseAmount.subtract(totalDiscount).max(BigDecimal.ZERO);

        result.offerPercent = finalOfferPercent;
        result.offerAmount = calculatedOfferAmount;
        result.couponAmount = calculatedCouponAmount;
        result.eligibleDiscountAmount = totalDiscount;
        result.taxableAmount = taxableAmount;

        return result;
    }
}
