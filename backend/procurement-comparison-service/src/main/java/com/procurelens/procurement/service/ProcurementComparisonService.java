package com.procurelens.procurement.service;

import com.procurelens.procurement.dto.QuoteCalculationRequest;
import com.procurelens.procurement.dto.QuoteCalculationResponse;
import com.procurelens.procurement.dto.ProcurementComparisonResponse;
import com.procurelens.procurement.model.ProcurementQuote;
import com.procurelens.procurement.model.Vendor;
import com.procurelens.procurement.model.VendorCoupon;
import com.procurelens.procurement.model.VendorOffer;
import com.procurelens.procurement.repository.ProcurementQuoteRepository;
import com.procurelens.procurement.repository.VendorCouponRepository;
import com.procurelens.procurement.repository.VendorOfferRepository;
import com.procurelens.procurement.repository.VendorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class ProcurementComparisonService {

    @Autowired
    private GstCalculationService gstCalculationService;

    @Autowired
    private DiscountCalculationService discountCalculationService;

    @Autowired(required = false)
    private VendorRepository vendorRepository;

    @Autowired(required = false)
    private VendorOfferRepository vendorOfferRepository;

    @Autowired(required = false)
    private VendorCouponRepository vendorCouponRepository;

    @Autowired(required = false)
    private ProcurementQuoteRepository procurementQuoteRepository;

    public QuoteCalculationResponse calculateSingleQuote(QuoteCalculationRequest req) {
        String vendorId = req.getVendorId() != null ? req.getVendorId() : "VEND-001";
        String vendorState = req.getVendorState() != null ? req.getVendorState() : "Maharashtra";
        String buyerState = req.getBuyerState() != null ? req.getBuyerState() : "Maharashtra";
        BigDecimal gstRate = req.getGstRate() != null ? req.getGstRate() : new BigDecimal("18.00");
        BigDecimal additionalCharges = req.getAdditionalCharges() != null ? req.getAdditionalCharges() : BigDecimal.ZERO;
        String vendorName = "Vendor " + vendorId;
        String gstin = "27AAACV9021L1Z5";

        if (vendorRepository != null) {
            Optional<Vendor> vOpt = vendorRepository.findById(vendorId);
            if (vOpt.isPresent()) {
                Vendor v = vOpt.get();
                vendorName = v.getVendorName();
                gstin = v.getGstin();
                if (v.getState() != null) vendorState = v.getState();
            }
        }

        VendorOffer offer = null;
        if (vendorOfferRepository != null) {
            List<VendorOffer> offers = vendorOfferRepository.findByVendorIdAndIsActiveTrue(vendorId);
            if (!offers.isEmpty()) offer = offers.get(0);
        }

        VendorCoupon coupon = null;
        if (vendorCouponRepository != null && req.getCouponCode() != null && !req.getCouponCode().trim().isEmpty()) {
            Optional<VendorCoupon> cOpt = vendorCouponRepository.findByCouponCodeAndIsActiveTrue(req.getCouponCode().trim());
            if (cOpt.isPresent()) coupon = cOpt.get();
        }

        DiscountCalculationService.DiscountResult discountResult = discountCalculationService.calculateDiscount(
            req.getQuantity(),
            req.getUnitPrice(),
            offer,
            req.getOfferPercent(),
            coupon,
            req.getCouponCode(),
            req.getCouponAmount(),
            vendorId,
            LocalDate.now()
        );

        GstCalculationService.GstResult gstResult = gstCalculationService.calculateGst(
            discountResult.taxableAmount,
            gstRate,
            vendorState,
            buyerState,
            additionalCharges
        );

        List<String> explainableReasons = new ArrayList<>();
        int riskScore = 10;
        String riskLevel = "LOW";
        boolean requiresReview = false;

        if (!discountResult.couponValid && discountResult.couponAnomalyReason != null) {
            riskScore += 30;
            explainableReasons.add(discountResult.couponAnomalyReason);
            requiresReview = true;
        }

        if (req.getDeclaredInvoiceAmount() != null && gstResult.finalAmount != null) {
            BigDecimal diff = req.getDeclaredInvoiceAmount().subtract(gstResult.finalAmount).abs();
            if (diff.compareTo(new BigDecimal("50.00")) > 0) {
                riskScore += 40;
                explainableReasons.add("Total Amount Mismatch: Declared ₹" + req.getDeclaredInvoiceAmount() + " vs Verified ₹" + gstResult.finalAmount);
                requiresReview = true;
            }
        }

        if (riskScore >= 70) riskLevel = "CRITICAL";
        else if (riskScore >= 40) riskLevel = "HIGH";
        else if (riskScore >= 25) riskLevel = "MEDIUM";

        return QuoteCalculationResponse.builder()
            .quoteId("QTE-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase())
            .vendorId(vendorId)
            .vendorName(vendorName)
            .gstin(gstin)
            .vendorState(vendorState)
            .buyerState(buyerState)
            .quantity(req.getQuantity() != null ? req.getQuantity() : BigDecimal.ONE)
            .unitPrice(req.getUnitPrice() != null ? req.getUnitPrice() : BigDecimal.ZERO)
            .baseAmount(discountResult.baseAmount)
            .offerPercent(discountResult.offerPercent)
            .offerAmount(discountResult.offerAmount)
            .couponCode(req.getCouponCode())
            .couponAmount(discountResult.couponAmount)
            .eligibleDiscountAmount(discountResult.eligibleDiscountAmount)
            .taxableAmount(discountResult.taxableAmount)
            .gstRate(gstRate)
            .taxType(gstResult.taxType)
            .cgstAmount(gstResult.cgstAmount)
            .sgstAmount(gstResult.sgstAmount)
            .igstAmount(gstResult.igstAmount)
            .totalGstAmount(gstResult.totalGst)
            .additionalCharges(additionalCharges)
            .finalAmount(gstResult.finalAmount)
            .riskScore(riskScore)
            .riskLevel(riskLevel)
            .requiresReview(requiresReview)
            .suggestedAction(requiresReview ? "REVIEW_DISCREPANCY" : "ACCEPT_QUOTE")
            .explainableReasons(explainableReasons)
            .build();
    }

    public ProcurementComparisonResponse compareQuotations(List<QuoteCalculationRequest> quoteRequests, String requirementTitle, String category, String buyerState, BigDecimal gstRate) {
        if (quoteRequests == null || quoteRequests.isEmpty()) {
            return ProcurementComparisonResponse.builder()
                .requirementTitle(requirementTitle)
                .category(category)
                .buyerState(buyerState)
                .gstRate(gstRate)
                .totalQuotesCount(0)
                .vendorQuotations(List.of())
                .build();
        }

        List<QuoteCalculationResponse> evaluatedQuotes = quoteRequests.stream()
            .map(this::calculateSingleQuote)
            .sorted(Comparator.comparing(QuoteCalculationResponse::getFinalAmount))
            .collect(Collectors.toList());

        BigDecimal sum = BigDecimal.ZERO;
        BigDecimal lowest = evaluatedQuotes.get(0).getFinalAmount();
        BigDecimal highest = evaluatedQuotes.get(evaluatedQuotes.size() - 1).getFinalAmount();
        int anomaliesCount = 0;

        for (int i = 0; i < evaluatedQuotes.size(); i++) {
            QuoteCalculationResponse q = evaluatedQuotes.get(i);
            q.setEffectiveCostRank(i + 1);
            sum = sum.add(q.getFinalAmount());
            if (q.isRequiresReview() || q.getRiskScore() >= 50) {
                anomaliesCount++;
            }
        }

        BigDecimal average = sum.divide(BigDecimal.valueOf(evaluatedQuotes.size()), 2, RoundingMode.HALF_UP);

        for (QuoteCalculationResponse q : evaluatedQuotes) {
            BigDecimal dev = q.getFinalAmount().subtract(average);
            q.setDeviationFromAverage(dev);
            if (average.compareTo(BigDecimal.ZERO) > 0) {
                BigDecimal devPct = dev.multiply(BigDecimal.valueOf(100)).divide(average, 2, RoundingMode.HALF_UP);
                q.setDeviationPercentage(devPct);
            }
        }

        return ProcurementComparisonResponse.builder()
            .procurementId("PROC-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase())
            .requirementTitle(requirementTitle != null ? requirementTitle : "Multi-Vendor Quotation Analysis")
            .category(category != null ? category : "Capital Equipment")
            .buyerState(buyerState != null ? buyerState : "Maharashtra")
            .gstRate(gstRate != null ? gstRate : new BigDecimal("18.00"))
            .lowestEffectiveCost(lowest)
            .highestEffectiveCost(highest)
            .averageEffectiveCost(average)
            .totalQuotesCount(evaluatedQuotes.size())
            .flaggedAnomaliesCount(anomaliesCount)
            .vendorQuotations(evaluatedQuotes)
            .build();
    }
}
