// Extended Master Vendors, Offers, Coupons, and Multi-Vendor Procurement Comparison Data
export const SAMPLE_VENDORS = [
  {
    id: 'VEND-ZENITH-01',
    vendorName: 'Zenith Tech Solutions Pvt Ltd',
    category: 'Electronics & Enterprise Computing',
    riskTier: 'VERIFIED',
    incorporationDays: 1420,
    gstin: '27AABCZ9021L1Z5',
    registeredAddress: 'Plot 42, Hinjewadi Phase 1, Pune, Maharashtra 411057',
    state: 'Maharashtra',
    gstStatus: 'ACTIVE',
    bankRouting: 'HDFC0001042',
    bankChangedRecently: false,
    historicalRiskScore: 12,
    isActive: true
  },
  {
    id: 'VEND-APEX-02',
    vendorName: 'Apex Electronics & Heavy Dynamics',
    category: 'Electronics & Hardware Systems',
    riskTier: 'CRITICAL',
    incorporationDays: 28,
    gstin: '29AABCA8812K1Z9',
    registeredAddress: 'Electronic City Phase 2, Bangalore, Karnataka 560100',
    state: 'Karnataka',
    gstStatus: 'ACTIVE',
    bankRouting: 'ICIC0009914',
    bankChangedRecently: true,
    historicalRiskScore: 82,
    isActive: true
  },
  {
    id: 'VEND-OMNI-03',
    vendorName: 'OmniSys Technologies Ltd',
    category: 'Enterprise IT & Office Hardware',
    riskTier: 'LOW',
    incorporationDays: 3200,
    gstin: '27AAABO5541C1ZU',
    registeredAddress: 'MIDC Andheri East, Mumbai, Maharashtra 400093',
    state: 'Maharashtra',
    gstStatus: 'ACTIVE',
    bankRouting: 'SBIN0000300',
    bankChangedRecently: false,
    historicalRiskScore: 15,
    isActive: true
  },
  {
    id: 'VEND-KINETIC-04',
    vendorName: 'Kinetic Hardware Hub',
    category: 'Electrical Components & Peripherals',
    riskTier: 'ELEVATED',
    incorporationDays: 110,
    gstin: '07AAACK1104D1ZK',
    registeredAddress: 'Nehru Place, New Delhi, Delhi 110019',
    state: 'Delhi',
    gstStatus: 'ACTIVE',
    bankRouting: 'UTIB0000412',
    bankChangedRecently: false,
    historicalRiskScore: 48,
    isActive: true
  }
];

export const SAMPLE_VENDOR_OFFERS = [
  {
    id: 'OFF-ZENITH-10',
    vendorId: 'VEND-ZENITH-01',
    offerType: 'PERCENTAGE',
    offerValue: 10,
    minimumPurchase: 500000,
    maximumDiscount: 1500000,
    validFrom: '2026-01-01',
    validTo: '2026-12-31',
    isActive: true
  },
  {
    id: 'OFF-APEX-20',
    vendorId: 'VEND-APEX-02',
    offerType: 'PERCENTAGE',
    offerValue: 20,
    minimumPurchase: 1000000,
    maximumDiscount: 2500000,
    validFrom: '2026-01-01',
    validTo: '2026-12-31',
    isActive: true
  },
  {
    id: 'OFF-OMNI-05',
    vendorId: 'VEND-OMNI-03',
    offerType: 'PERCENTAGE',
    offerValue: 5,
    minimumPurchase: 200000,
    maximumDiscount: 600000,
    validFrom: '2026-01-01',
    validTo: '2026-12-31',
    isActive: true
  }
];

export const SAMPLE_VENDOR_COUPONS = [
  {
    id: 'CPN-ZEN-5K',
    vendorId: 'VEND-ZENITH-01',
    couponCode: 'ZENITH5K',
    discountType: 'FIXED_AMOUNT',
    discountValue: 5000,
    minimumOrder: 100000,
    maximumDiscount: 5000,
    validFrom: '2026-01-01',
    validTo: '2026-12-31',
    usageLimit: 50,
    usedCount: 12,
    isActive: true
  },
  {
    id: 'CPN-APX-10K',
    vendorId: 'VEND-APEX-02',
    couponCode: 'APEXDEAL10K',
    discountType: 'FIXED_AMOUNT',
    discountValue: 10000,
    minimumOrder: 500000,
    maximumDiscount: 10000,
    validFrom: '2026-01-01',
    validTo: '2026-12-31',
    usageLimit: 20,
    usedCount: 4,
    isActive: true
  },
  {
    id: 'CPN-OMN-2K',
    vendorId: 'VEND-OMNI-03',
    couponCode: 'OMNI2K',
    discountType: 'FIXED_AMOUNT',
    discountValue: 2000,
    minimumOrder: 50000,
    maximumDiscount: 2000,
    validFrom: '2026-01-01',
    validTo: '2026-12-31',
    usageLimit: 100,
    usedCount: 18,
    isActive: true
  }
];

/**
 * Pure GST Calculation Function
 */
export function calculateGst(taxableAmount, gstRate = 18, vendorState = 'Maharashtra', buyerState = 'Maharashtra', additionalCharges = 0) {
  const isIntraState = (vendorState || '').trim().toLowerCase() === (buyerState || '').trim().toLowerCase();
  let cgst = 0;
  let sgst = 0;
  let igst = 0;
  let taxType = 'INTRA_STATE';

  const rate = Number(gstRate) || 18;
  const taxable = Number(taxableAmount) || 0;
  const additional = Number(additionalCharges) || 0;

  if (isIntraState) {
    taxType = 'INTRA_STATE';
    cgst = Number(((taxable * (rate / 2)) / 100).toFixed(2));
    sgst = Number(((taxable * (rate / 2)) / 100).toFixed(2));
  } else {
    taxType = 'INTER_STATE';
    igst = Number(((taxable * rate) / 100).toFixed(2));
  }

  const totalGst = Number((cgst + sgst + igst).toFixed(2));
  const finalAmount = Number((taxable + totalGst + additional).toFixed(2));

  return {
    taxType,
    gstRate: rate,
    cgstAmount: cgst,
    sgstAmount: sgst,
    igstAmount: igst,
    totalGst,
    additionalCharges: additional,
    finalAmount
  };
}

/**
 * Pure Discount Calculation Function (Base -> Offer -> Coupon -> Taxable)
 */
export function calculateDiscount(quantity, unitPrice, vendorOffer, requestedOfferPercent, vendorCoupon, requestedCouponCode, requestedCouponAmount, vendorId) {
  const qty = Number(quantity) || 1;
  const price = Number(unitPrice) || 0;
  const baseAmount = Number((qty * price).toFixed(2));

  let offerPercent = 0;
  let offerAmount = 0;

  // 1. Vendor Offer
  if (vendorOffer && vendorOffer.isActive) {
    if (baseAmount >= (vendorOffer.minimumPurchase || 0)) {
      if (vendorOffer.offerType === 'PERCENTAGE') {
        offerPercent = Number(vendorOffer.offerValue);
        offerAmount = Number(((baseAmount * offerPercent) / 100).toFixed(2));
      } else {
        offerAmount = Number(vendorOffer.offerValue);
        offerPercent = baseAmount > 0 ? Number(((offerAmount / baseAmount) * 100).toFixed(2)) : 0;
      }
      if (vendorOffer.maximumDiscount && offerAmount > vendorOffer.maximumDiscount) {
        offerAmount = Number(vendorOffer.maximumDiscount);
      }
    }
  } else if (requestedOfferPercent) {
    offerPercent = Number(requestedOfferPercent);
    offerAmount = Number(((baseAmount * offerPercent) / 100).toFixed(2));
  }

  // 2. Vendor Coupon
  let couponAmount = 0;
  let couponValid = true;
  let couponAnomalyReason = null;

  if (vendorCoupon) {
    const belongsToVendor = (vendorCoupon.vendorId || '').toLowerCase() === (vendorId || '').toLowerCase();
    const isActive = Boolean(vendorCoupon.isActive);
    const minOrderMet = baseAmount >= (vendorCoupon.minimumOrder || 0);

    if (!belongsToVendor) {
      couponValid = false;
      couponAnomalyReason = `Coupon ${vendorCoupon.couponCode} does not belong to vendor ${vendorId}.`;
    } else if (!isActive) {
      couponValid = false;
      couponAnomalyReason = `Coupon ${vendorCoupon.couponCode} is inactive or revoked.`;
    } else if (!minOrderMet) {
      couponValid = false;
      couponAnomalyReason = `Order value ₹${baseAmount.toLocaleString('en-IN')} is below minimum coupon threshold ₹${(vendorCoupon.minimumOrder || 0).toLocaleString('en-IN')}.`;
    } else {
      const postOffer = Math.max(0, baseAmount - offerAmount);
      if (vendorCoupon.discountType === 'PERCENTAGE') {
        couponAmount = Number(((postOffer * vendorCoupon.discountValue) / 100).toFixed(2));
      } else {
        couponAmount = Number(vendorCoupon.discountValue);
      }
      if (vendorCoupon.maximumDiscount && couponAmount > vendorCoupon.maximumDiscount) {
        couponAmount = Number(vendorCoupon.maximumDiscount);
      }
    }
  } else if (requestedCouponAmount) {
    couponAmount = Number(requestedCouponAmount);
  }

  const eligibleDiscountAmount = Number(Math.min(baseAmount, offerAmount + (couponValid ? couponAmount : 0)).toFixed(2));
  const taxableAmount = Number(Math.max(0, baseAmount - eligibleDiscountAmount).toFixed(2));

  return {
    baseAmount,
    offerPercent,
    offerAmount,
    couponAmount: couponValid ? couponAmount : 0,
    eligibleDiscountAmount,
    taxableAmount,
    couponValid,
    couponAnomalyReason
  };
}

/**
 * Pure Procurement Risk Analysis Engine
 */
export function analyzeProcurementQuoteRisk(quote, averageFinalAmount = null) {
  let score = 0;
  const anomalyFlags = [];
  const explainableReasons = [];
  const TOLERANCE = 2.0;

  // 1. Coupon Anomaly Check
  if (quote.couponValid === false && quote.couponAnomalyReason) {
    score += 20;
    anomalyFlags.push({
      category: 'COUPON_ANOMALY',
      severity: 'HIGH',
      title: 'Coupon Anomaly Detected',
      description: quote.couponAnomalyReason
    });
    explainableReasons.push(`⚠ Coupon anomaly: ${quote.couponAnomalyReason}`);
  } else if (quote.declaredCouponAmount && quote.couponAmount && (quote.declaredCouponAmount - quote.couponAmount) > TOLERANCE) {
    const diff = Number((quote.declaredCouponAmount - quote.couponAmount).toFixed(2));
    score += 15;
    anomalyFlags.push({
      category: 'COUPON_ANOMALY',
      severity: 'MEDIUM',
      title: 'Declared Coupon Exceeds Cap',
      description: `Claimed coupon ₹${quote.declaredCouponAmount.toLocaleString('en-IN')} exceeds authorized cap ₹${quote.couponAmount.toLocaleString('en-IN')} (Diff: ₹${diff})`,
      expectedValue: quote.couponAmount,
      declaredValue: quote.declaredCouponAmount,
      difference: diff
    });
    explainableReasons.push(`⚠ Coupon anomaly: Coupon discount ₹${quote.declaredCouponAmount.toLocaleString('en-IN')} exceeds authorized cap ₹${quote.couponAmount.toLocaleString('en-IN')}`);
  }

  // 2. Vendor Offer Discrepancy Check
  if (quote.declaredDiscount !== undefined && quote.declaredDiscount !== null && quote.offerAmount !== undefined) {
    const diff = Math.abs(quote.declaredDiscount - quote.offerAmount);
    if (diff > TOLERANCE) {
      score += 20;
      const diffPct = quote.offerAmount > 0 ? Number(((diff / quote.offerAmount) * 100).toFixed(1)) : 100;
      anomalyFlags.push({
        category: 'OFFER_DISCREPANCY',
        severity: 'HIGH',
        title: 'Vendor Offer Discrepancy',
        description: `Expected trade offer ₹${quote.offerAmount.toLocaleString('en-IN')} vs declared discount ₹${quote.declaredDiscount.toLocaleString('en-IN')} (Diff: ₹${diff.toLocaleString('en-IN')})`,
        expectedValue: quote.offerAmount,
        declaredValue: quote.declaredDiscount,
        difference: diff,
        differencePercentage: diffPct
      });
      explainableReasons.push(`⚠ Offer discrepancy: Expected discount ₹${quote.offerAmount.toLocaleString('en-IN')}, Declared discount: ₹${quote.declaredDiscount.toLocaleString('en-IN')} (Diff: ₹${diff.toLocaleString('en-IN')})`);
    }
  }

  // 3. GST Anomaly Check
  let gstMismatch = false;
  if (quote.declaredCgst !== undefined && quote.declaredCgst !== null && Math.abs(quote.declaredCgst - quote.cgstAmount) > TOLERANCE) {
    gstMismatch = true;
    const diff = Math.abs(quote.declaredCgst - quote.cgstAmount);
    explainableReasons.push(`⚠ GST anomaly: Expected CGST ₹${quote.cgstAmount.toLocaleString('en-IN')}, Declared CGST ₹${quote.declaredCgst.toLocaleString('en-IN')} (Diff: ₹${diff.toLocaleString('en-IN')})`);
  }
  if (quote.declaredSgst !== undefined && quote.declaredSgst !== null && Math.abs(quote.declaredSgst - quote.sgstAmount) > TOLERANCE) {
    gstMismatch = true;
    const diff = Math.abs(quote.declaredSgst - quote.sgstAmount);
    explainableReasons.push(`⚠ GST anomaly: Expected SGST ₹${quote.sgstAmount.toLocaleString('en-IN')}, Declared SGST ₹${quote.declaredSgst.toLocaleString('en-IN')} (Diff: ₹${diff.toLocaleString('en-IN')})`);
  }
  if (quote.declaredIgst !== undefined && quote.declaredIgst !== null && Math.abs(quote.declaredIgst - quote.igstAmount) > TOLERANCE) {
    gstMismatch = true;
    const diff = Math.abs(quote.declaredIgst - quote.igstAmount);
    explainableReasons.push(`⚠ GST anomaly: Expected IGST ₹${quote.igstAmount.toLocaleString('en-IN')}, Declared IGST ₹${quote.declaredIgst.toLocaleString('en-IN')} (Diff: ₹${diff.toLocaleString('en-IN')})`);
  }

  if (gstMismatch) {
    score += 25;
    anomalyFlags.push({
      category: 'GST_ANOMALY',
      severity: 'CRITICAL',
      title: 'GST Tax Calculation Mismatch',
      description: `Discrepancy detected between statutory calculated GST and declared invoice tax schedules.`
    });
  }

  // 4. Price Anomaly (Deviation from Average)
  if (averageFinalAmount && averageFinalAmount > 0 && quote.finalAmount) {
    const dev = quote.finalAmount - averageFinalAmount;
    const devPct = Number(((dev / averageFinalAmount) * 100).toFixed(1));
    if (Math.abs(devPct) >= 20.0) {
      score += 15;
      const dir = devPct > 0 ? 'surge above' : 'undercut below';
      anomalyFlags.push({
        category: 'PRICE_ANOMALY',
        severity: Math.abs(devPct) >= 35 ? 'CRITICAL' : 'MEDIUM',
        title: 'Market Price Deviation Anomaly',
        description: `Effective cost ₹${quote.finalAmount.toLocaleString('en-IN')} deviates ${Math.abs(devPct)}% (${dir}) from market comparison average of ₹${averageFinalAmount.toLocaleString('en-IN')}.`,
        expectedValue: averageFinalAmount,
        declaredValue: quote.finalAmount,
        difference: Math.abs(dev),
        differencePercentage: Math.abs(devPct)
      });
      explainableReasons.push(`⚠ Price anomaly: Effective procurement cost ₹${quote.finalAmount.toLocaleString('en-IN')} deviates ${Math.abs(devPct)}% from market comparison average.`);
    }
  }

  // 5. Invoice Amount Mismatch
  if (quote.declaredInvoiceAmount !== undefined && quote.declaredInvoiceAmount !== null && Math.abs(quote.declaredInvoiceAmount - quote.finalAmount) > TOLERANCE) {
    score += 10;
    const diff = Math.abs(quote.declaredInvoiceAmount - quote.finalAmount);
    anomalyFlags.push({
      category: 'INVOICE_MISMATCH',
      severity: 'HIGH',
      title: 'Invoice Total Mismatch',
      description: `Calculated verified total ₹${quote.finalAmount.toLocaleString('en-IN')} vs declared invoice amount ₹${quote.declaredInvoiceAmount.toLocaleString('en-IN')} (Diff: ₹${diff.toLocaleString('en-IN')})`
    });
    explainableReasons.push(`⚠ Invoice mismatch: Declared total ₹${quote.declaredInvoiceAmount.toLocaleString('en-IN')} differs from verified final amount ₹${quote.finalAmount.toLocaleString('en-IN')}`);
  }

  // 6. Historical Vendor Risk Factor
  if (quote.historicalRiskScore && quote.historicalRiskScore > 40) {
    score += Math.min(10, Math.round(quote.historicalRiskScore / 10));
    explainableReasons.push(`⚠ Historical vendor profile: Elevated past non-compliance score (${quote.historicalRiskScore}%)`);
  }

  const finalScore = Math.min(100, Math.max(0, score));
  let riskLevel = 'LOW';
  let suggestedAction = 'Compliant quotation verified';

  if (finalScore >= 80) {
    riskLevel = 'CRITICAL';
    suggestedAction = 'Hold PO issuance & escalate to Forensic Review';
  } else if (finalScore >= 60) {
    riskLevel = 'HIGH';
    suggestedAction = 'Request commercial price & tax justification';
  } else if (finalScore >= 30) {
    riskLevel = 'MEDIUM';
    suggestedAction = 'Secondary audit review recommended';
  } else {
    riskLevel = 'LOW';
    if (explainableReasons.length === 0) {
      explainableReasons.push('✓ Quotation verified: All statutory GST, trade offers, and commercial pricing are consistent.');
    }
  }

  return {
    riskScore: finalScore,
    riskLevel,
    requiresReview: finalScore >= 30,
    suggestedAction,
    anomalyFlags,
    explainableReasons
  };
}

/**
 * Compare Multiple Vendor Quotations
 */
export function compareVendorQuotations(quoteInputs, procurementInfo = {}) {
  const reqTitle = procurementInfo.requirementTitle || 'Corporate Procurement Requirement';
  const category = procurementInfo.category || 'General Sourcing';
  const quantity = Number(procurementInfo.quantity) || 100;
  const buyerState = procurementInfo.buyerState || 'Maharashtra';
  const gstRate = Number(procurementInfo.gstRate) || 18;

  // 1. Calculate each quote independently
  const calculated = quoteInputs.map(q => {
    const v = SAMPLE_VENDORS.find(vend => vend.id === q.vendorId) || {
      id: q.vendorId || 'VEND-EXT',
      vendorName: q.vendorName || `Vendor ${q.vendorId}`,
      gstin: q.gstin || '27AAACV9021L1Z5',
      state: q.vendorState || 'Maharashtra',
      historicalRiskScore: 15
    };

    const offer = SAMPLE_VENDOR_OFFERS.find(o => o.vendorId === v.id);
    const coupon = SAMPLE_VENDOR_COUPONS.find(c => c.couponCode === q.couponCode);

    const disc = calculateDiscount(
      quantity,
      q.unitPrice,
      offer,
      q.offerPercent,
      coupon,
      q.couponCode,
      q.couponAmount,
      v.id
    );

    const gst = calculateGst(
      disc.taxableAmount,
      gstRate,
      v.state,
      buyerState,
      q.additionalCharges || 0
    );

    const rawQuote = {
      quoteId: q.quoteId || `QTE-${Date.now()}-${v.id}`,
      vendorId: v.id,
      vendorName: v.vendorName,
      gstin: v.gstin,
      vendorState: v.state,
      buyerState,
      quantity,
      unitPrice: Number(q.unitPrice),
      baseAmount: disc.baseAmount,
      offerPercent: disc.offerPercent,
      offerAmount: disc.offerAmount,
      couponCode: q.couponCode,
      couponAmount: disc.couponAmount,
      eligibleDiscountAmount: disc.eligibleDiscountAmount,
      taxableAmount: disc.taxableAmount,
      gstRate,
      taxType: gst.taxType,
      cgstAmount: gst.cgstAmount,
      sgstAmount: gst.sgstAmount,
      igstAmount: gst.igstAmount,
      totalGstAmount: gst.totalGst,
      additionalCharges: gst.additionalCharges,
      finalAmount: gst.finalAmount,
      couponValid: disc.couponValid,
      couponAnomalyReason: disc.couponAnomalyReason,
      historicalRiskScore: v.historicalRiskScore,

      // Declared values for anomaly detection
      declaredInvoiceAmount: q.declaredInvoiceAmount !== undefined ? Number(q.declaredInvoiceAmount) : undefined,
      declaredTaxableAmount: q.declaredTaxableAmount !== undefined ? Number(q.declaredTaxableAmount) : undefined,
      declaredCgst: q.declaredCgst !== undefined ? Number(q.declaredCgst) : undefined,
      declaredSgst: q.declaredSgst !== undefined ? Number(q.declaredSgst) : undefined,
      declaredIgst: q.declaredIgst !== undefined ? Number(q.declaredIgst) : undefined,
      declaredDiscount: q.declaredDiscount !== undefined ? Number(q.declaredDiscount) : undefined
    };

    return rawQuote;
  });

  // 2. Statistical Metrics
  const amounts = calculated.map(c => c.finalAmount);
  const lowestEffectiveCost = Math.min(...amounts);
  const highestEffectiveCost = Math.max(...amounts);
  const sum = amounts.reduce((a, b) => a + b, 0);
  const averageEffectiveCost = Number((sum / (amounts.length || 1)).toFixed(2));

  // 3. Sort by effective cost for ranking
  const sorted = [...calculated].sort((a, b) => a.finalAmount - b.finalAmount);

  // 4. Enrich with price deviations and risk scores
  let flaggedCount = 0;
  const enriched = sorted.map((q, idx) => {
    const dev = Number((q.finalAmount - averageEffectiveCost).toFixed(2));
    const devPct = averageEffectiveCost > 0 ? Number(((dev / averageEffectiveCost) * 100).toFixed(1)) : 0;
    
    const risk = analyzeProcurementQuoteRisk(q, averageEffectiveCost);
    if (risk.riskScore >= 30) flaggedCount++;

    return {
      ...q,
      effectiveCostRank: idx + 1,
      deviationFromAverage: dev,
      deviationPercentage: devPct,
      riskScore: risk.riskScore,
      riskLevel: risk.riskLevel,
      requiresReview: risk.requiresReview,
      suggestedAction: risk.suggestedAction,
      anomalyFlags: risk.anomalyFlags,
      explainableReasons: risk.explainableReasons
    };
  });

  return {
    procurementId: procurementInfo.id || `PROC-${Date.now().toString().slice(-6)}`,
    requirementTitle: reqTitle,
    category,
    quantity,
    unit: procurementInfo.unit || 'Units',
    buyerState,
    gstRate,
    lowestEffectiveCost,
    highestEffectiveCost,
    averageEffectiveCost,
    totalQuotesCount: enriched.length,
    flaggedAnomaliesCount: flaggedCount,
    vendorQuotations: enriched
  };
}

// Canonical Example Seed from Step 2: Laptop Procurement (100 Units)
export const CANONICAL_PROCUREMENT_COMPARISON = compareVendorQuotations(
  [
    {
      vendorId: 'VEND-ZENITH-01',
      vendorName: 'Zenith Tech Solutions Pvt Ltd (Vendor A)',
      unitPrice: 100000,
      offerPercent: 10,
      couponCode: 'ZENITH5K',
      couponAmount: 5000,
      vendorState: 'Maharashtra',
      additionalCharges: 0
    },
    {
      vendorId: 'VEND-APEX-02',
      vendorName: 'Apex Electronics & Heavy Dynamics (Vendor B)',
      unitPrice: 108000,
      offerPercent: 20,
      couponCode: 'APEXDEAL10K',
      couponAmount: 10000,
      vendorState: 'Karnataka',
      additionalCharges: 0,
      // Declared values with discrepancies for Anomaly Testing (GST mismatch & Offer difference)
      declaredDiscount: 1200000, // Expected 21,60,000 -> Diff 9,60,000
      declaredIgst: 1800000,     // Expected 15,53,400 -> Diff 2,46,600
      declaredInvoiceAmount: 11800000
    },
    {
      vendorId: 'VEND-OMNI-03',
      vendorName: 'OmniSys Technologies Ltd (Vendor C)',
      unitPrice: 95000,
      offerPercent: 5,
      couponCode: 'OMNI2K',
      couponAmount: 2000,
      vendorState: 'Maharashtra',
      additionalCharges: 0
    }
  ],
  {
    id: 'PROC-2026-LAPTOP-100',
    requirementTitle: 'Enterprise Workstation Laptop Procurement',
    category: 'Electronics & Enterprise Computing',
    quantity: 100,
    unit: 'Laptops',
    buyerState: 'Maharashtra',
    gstRate: 18
  }
);


export const INITIAL_TRANSACTIONS = [
  {
    id: 'TXN-2026-9021',
    invoiceNumber: 'INV-2026-9021',
    poNumber: 'PO-2026-8841',
    vendorId: 'VEND-APEX-01',
    vendorName: 'Apex Heavy Dynamics Pvt Ltd',
    vendorCategory: 'Industrial Machinery & Precision Tools',
    vendorRiskTier: 'CRITICAL',
    vendorIncorporationDays: 18,
    vendorGstin: '27AABCA9021K1ZM',
    vendorAddress: 'Plot 88, Chakan Industrial Area Phase 2, Pune, Maharashtra 410501',
    vendorBankRouting: 'HDFC0001042',
    bankChangedRecently: true,
    itemCode: 'HEX-TITAN-05',
    itemDescription: 'Industrial Titanium Grade-5 Shell-and-Tube Heat Exchanger Unit',
    quantity: 1,
    unit: 'Unit',
    unitPrice: 185000,
    totalAmount: 185000,
    historicalBaselinePrice: 50000,
    marketIndexPrice: 52000,
    priceVariancePercent: 270.0,
    department: 'Heavy Thermal Engineering Division',
    approverName: 'Prakash Rao',
    approverRole: 'Director of Plant Procurement & Capital Assets',
    submissionDate: '2026-09-24',
    paymentDueDate: '2026-10-01',
    status: 'FLAGGED_CRITICAL',
    anomalyType: 'PRICE_SPIKE',
    riskScore: 94,
    confidenceScore: 98,
    auditFlags: [
      {
        id: 'FLAG-9021-1',
        category: 'PRICE',
        severity: 'CRITICAL',
        title: 'Extreme Price Anomaly: 3.7x Above 6-Quarter Historical Mean',
        description: 'Billed unit price of ?1,85,000 is 270% higher than the 6-quarter verifiable baseline mean of ?50,000.',
        metric: '?1,85,000 vs ?50,000 baseline (+270% variance, Z-Score: 4.82)',
        statutoryRef: 'GFR Rule 149 (Fair Market Valuation) / CVC Vigilance Guidelines Sec 4.2'
      },
      {
        id: 'FLAG-9021-2',
        category: 'VENDOR',
        severity: 'HIGH',
        title: 'High-Risk Shell Entity Pattern with Recent Bank Alteration',
        description: 'Vendor incorporated only 18 days prior to PO award; beneficiary bank account changed 72 hours before invoice submission.',
        metric: 'Incorporation: 18 days ago; Bank Routing change logged 2026-09-21',
        statutoryRef: 'PMLA 2002 Shell Company Red Flag Indicator 7B'
      }
    ],
    historicalPurchases: [
      { date: '2025-01-15', invoiceNo: 'INV-2025-012', poNo: 'PO-2025-104', unitPrice: 49500, qty: 1, total: 49500, vendorName: 'Apex Heavy Dynamics Pvt Ltd', quarter: 'Q4 FY24' },
      { date: '2025-04-20', invoiceNo: 'INV-2025-088', poNo: 'PO-2025-241', unitPrice: 50000, qty: 1, total: 50000, vendorName: 'Apex Heavy Dynamics Pvt Ltd', quarter: 'Q1 FY25' },
      { date: '2025-07-10', invoiceNo: 'INV-2025-192', poNo: 'PO-2025-392', unitPrice: 50500, qty: 2, total: 101000, vendorName: 'Apex Heavy Dynamics Pvt Ltd', quarter: 'Q2 FY25' },
      { date: '2025-10-05', invoiceNo: 'INV-2025-310', poNo: 'PO-2025-581', unitPrice: 50200, qty: 1, total: 50200, vendorName: 'Apex Heavy Dynamics Pvt Ltd', quarter: 'Q3 FY25' },
      { date: '2026-01-18', invoiceNo: 'INV-2026-042', poNo: 'PO-2026-019', unitPrice: 49800, qty: 1, total: 49800, vendorName: 'Apex Heavy Dynamics Pvt Ltd', quarter: 'Q4 FY25' },
      { date: '2026-04-12', invoiceNo: 'INV-2026-118', poNo: 'PO-2026-204', unitPrice: 50100, qty: 1, total: 50100, vendorName: 'Apex Heavy Dynamics Pvt Ltd', quarter: 'Q1 FY26' }
    ],
    relatedTransactions: [
      {
        id: 'TXN-2026-9018',
        type: 'PRIOR_APPROVED',
        referenceNo: 'INV-2026-042',
        date: '2026-01-18',
        amount: 49800,
        vendorName: 'Apex Heavy Dynamics Pvt Ltd',
        similarityNote: 'Identical item specification (HEX-TITAN-05) approved at normal baseline rate.',
        relevanceScore: 0.98
      }
    ]
  },
  {
    id: 'TXN-2026-7731',
    invoiceNumber: 'INV-2026-7731',
    poNumber: 'PO-2026-9931',
    vendorId: 'VEND-VANGUARD-04',
    vendorName: 'Vanguard Systems & Solutions',
    vendorCategory: 'IT Infrastructure & Enterprise Hardware',
    vendorRiskTier: 'HIGH',
    vendorIncorporationDays: 410,
    vendorGstin: '27AABCV7731J1ZQ',
    vendorAddress: 'Tower B, Cyber City, Magarpatta, Pune 411028',
    vendorBankRouting: 'UTIB0000214',
    bankChangedRecently: false,
    itemCode: 'IT-SRV-BLADE',
    itemDescription: 'Enterprise Dual-Socket High Performance Compute Blade Modules',
    quantity: 1,
    unit: 'Lot',
    unitPrice: 195000,
    totalAmount: 195000,
    historicalBaselinePrice: 195000,
    priceVariancePercent: 0,
    department: 'Information Technology Directorate',
    approverName: 'Vikram Mehta',
    approverRole: 'Chief Information Officer',
    submissionDate: '2026-09-23',
    paymentDueDate: '2026-10-05',
    status: 'FLAGGED_CRITICAL',
    anomalyType: 'SPLIT_PO_STRUCTURING',
    riskScore: 91,
    confidenceScore: 94,
    auditFlags: [
      {
        id: 'FLAG-7731-1',
        category: 'STRUCTURING',
        severity: 'CRITICAL',
        title: 'Tender Threshold Smurfing: PO Split Just Below ?2,00,000',
        description: 'Purchase Order ?1,95,000 created 38 minutes prior to complementary PO-2026-9932 (?1,98,500) to evade the mandatory ?2,00,000 public tender committee ceiling.',
        metric: 'PO ?1,95,000 (97.5% of ?2,00,000 threshold); paired with PO ?1,98,500 within 1 hour',
        statutoryRef: 'SOX Section 404 / Delegation of Financial Powers Rule 12.3'
      }
    ],
    historicalPurchases: [
      { date: '2025-06-12', invoiceNo: 'INV-2025-201', poNo: 'PO-2025-341', unitPrice: 192000, qty: 2, total: 384000, vendorName: 'Vanguard Systems & Solutions', quarter: 'Q2 FY25' }
    ],
    relatedTransactions: [
      {
        id: 'TXN-2026-7732',
        type: 'SPLIT_PO',
        referenceNo: 'INV-2026-7732 / PO-2026-9932',
        date: '2026-09-23',
        amount: 198500,
        vendorName: 'Vanguard Systems & Solutions',
        similarityNote: 'Twin purchase order created at 14:42 IST vs 14:04 IST for second half of server hardware.',
        relevanceScore: 0.99
      }
    ]
  },
  {
    id: 'TXN-2026-6190',
    invoiceNumber: 'INV-2026-6190',
    poNumber: 'PO-2026-3829',
    vendorId: 'VEND-MAT-88',
    vendorName: 'Matrix Logistics LLP',
    vendorCategory: 'Freight & Supply Chain Operations',
    vendorRiskTier: 'CRITICAL',
    vendorIncorporationDays: 19,
    vendorGstin: '27AABCM6190P1ZX',
    vendorAddress: 'Flat 402, Royal Palms Enclave, Aundh, Pune 411007',
    vendorBankRouting: 'KKBK0001822',
    bankChangedRecently: false,
    itemCode: 'LOG-EXP-BULK',
    itemDescription: 'Express Multi-Modal Bulk Freight Handling & Warehousing Services',
    quantity: 1,
    unit: 'Contract Retainer',
    unitPrice: 1250000,
    totalAmount: 1250000,
    historicalBaselinePrice: 0,
    priceVariancePercent: 0,
    department: 'Supply Chain & Logistics Directorate',
    approverName: 'Rajesh Verma',
    approverRole: 'VP of Procurement & Global Supply Chain',
    submissionDate: '2026-09-21',
    paymentDueDate: '2026-09-28',
    status: 'FLAGGED_CRITICAL',
    anomalyType: 'SHELL_VENDOR_NETWORK',
    riskScore: 98,
    confidenceScore: 99,
    auditFlags: [
      {
        id: 'FLAG-6190-1',
        category: 'VENDOR',
        severity: 'CRITICAL',
        title: 'Conflict of Interest: Address Matches Approver Residence',
        description: 'Vendor registered entity address matches the declared residential HR record of VP Rajesh Verma (Approver).',
        metric: '100% address string & pin-code identity match',
        statutoryRef: 'Prevention of Corruption Act Sec 13(1)(d) / Conflict of Interest Code'
      }
    ],
    historicalPurchases: [],
    relatedTransactions: []
  },
  {
    id: 'TXN-2026-5510',
    invoiceNumber: 'INV-2026-5510',
    poNumber: 'PO-2026-2184',
    vendorId: 'VEND-IND-22',
    vendorName: 'Indo-German Precision Fasteners Ltd',
    vendorCategory: 'Industrial Hardware & Valves',
    vendorRiskTier: 'HIGH',
    vendorIncorporationDays: 2400,
    vendorGstin: '27AABCI5510M1Z2',
    vendorAddress: 'Survey 112, Chakan MIDC Phase 2, Pune 410501',
    vendorBankRouting: 'HDFC0000088',
    bankChangedRecently: false,
    itemCode: 'VAL-BRASS-50',
    itemDescription: 'High Precision High-Pressure Brass Control Valves (50mm)',
    quantity: 5000,
    unit: 'Pieces',
    unitPrice: 150,
    totalAmount: 750000,
    historicalBaselinePrice: 150,
    marketIndexPrice: 152,
    priceVariancePercent: 0,
    department: 'Hydraulics Fabrication Unit',
    approverName: 'Kavita Sundaram',
    approverRole: 'Quality & Inventory Gatekeeper',
    submissionDate: '2026-09-19',
    paymentDueDate: '2026-09-30',
    status: 'FLAGGED_CRITICAL',
    anomalyType: 'QUANTITY_GHOSTING',
    riskScore: 95,
    confidenceScore: 96,
    grnStatus: {
      dockReceiptNo: 'GRN-2026-5510',
      dockReceivedQty: 500,
      billedQty: 5000,
      discrepancyUnit: 4500,
      inspectorName: 'Manoj Salve (Dock Inbound Bay 4)'
    },
    auditFlags: [
      {
        id: 'FLAG-5510-1',
        category: 'DELIVERY',
        severity: 'CRITICAL',
        title: 'Severe Goods Receipt Mismatch (10x Quantity Overbilled)',
        description: 'Invoice demands payment for 5,000 units (?7,50,000), but Dock Inbound GRN logged physical acceptance of only 500 units (?75,000).',
        metric: 'Shortfall: 4,500 units unreceived (?6,75,000 phantom billing)',
        statutoryRef: 'Three-Way Matching Standard (PO + GRN + Invoice)'
      }
    ],
    historicalPurchases: [
      { date: '2025-04-10', invoiceNo: 'INV-2025-102', poNo: 'PO-2025-881', unitPrice: 148, qty: 1000, total: 148000, vendorName: 'Indo-German Precision Fasteners Ltd', quarter: 'Q1 FY25' }
    ],
    relatedTransactions: []
  },
  {
    id: 'TXN-2026-1049',
    invoiceNumber: 'INV-2026-1049',
    poNumber: 'PO-2026-7290',
    vendorId: 'VEND-STEEL-03',
    vendorName: 'Tata Steel Industrial Solutions',
    vendorCategory: 'Raw Metallurgy & Structural Alloys',
    vendorRiskTier: 'VERIFIED',
    vendorIncorporationDays: 9100,
    vendorGstin: '20AAACT0012F1ZM',
    vendorAddress: 'Jamshedpur Works, Bistupur, Jharkhand 831001',
    vendorBankRouting: 'SBIN0000001',
    bankChangedRecently: false,
    itemCode: 'STL-PLT-SS316',
    itemDescription: 'Stainless Steel Heavy Alloy Plates SS316L (12mm x 2500mm)',
    quantity: 10,
    unit: 'Metric Tons',
    unitPrice: 220000,
    totalAmount: 2200000,
    historicalBaselinePrice: 221500,
    marketIndexPrice: 220500,
    priceVariancePercent: -0.68,
    department: 'Fabrication & Pressure Vessels',
    approverName: 'Sunil Malhotra',
    approverRole: 'Plant Maintenance Supervisor',
    submissionDate: '2026-09-24',
    paymentDueDate: '2026-10-15',
    status: 'APPROVED',
    anomalyType: 'BENIGN_NORMAL',
    riskScore: 6,
    confidenceScore: 99,
    auditFlags: [],
    historicalPurchases: [
      { date: '2025-02-11', invoiceNo: 'INV-2025-091', poNo: 'PO-2025-330', unitPrice: 225000, qty: 8, total: 1800000, vendorName: 'Tata Steel Industrial Solutions', quarter: 'Q4 FY24' }
    ],
    relatedTransactions: []
  }
];

export function calculateStats(txs) {
  const totalUnderReview = txs.length;
  const flaggedCritical = txs.filter(t => t.riskScore >= 75).length;
  const paymentsFrozen = txs.filter(t => t.status === 'PAYMENT_FROZEN').length;
  
  const financialExposureINR = txs.reduce((acc, t) => {
    if (t.riskScore < 50) return acc;
    if (t.anomalyType === 'PRICE_SPIKE') {
      return acc + (t.unitPrice - t.historicalBaselinePrice) * t.quantity;
    }
    if (t.anomalyType === 'DUPLICATE_INVOICE' || t.anomalyType === 'SHELL_VENDOR_NETWORK') {
      return acc + t.totalAmount;
    }
    if (t.anomalyType === 'QUANTITY_GHOSTING' && t.grnStatus) {
      return acc + (t.grnStatus.discrepancyUnit * t.unitPrice);
    }
    if (t.anomalyType === 'SPLIT_PO_STRUCTURING') {
      return acc + (t.totalAmount);
    }
    return acc + (t.totalAmount * 0.5);
  }, 0);

  const averageAuditRisk = Math.round(
    txs.reduce((acc, t) => acc + t.riskScore, 0) / (txs.length || 1)
  );

  const anomalyDistribution = {
    PRICE_SPIKE: 0,
    SPLIT_PO_STRUCTURING: 0,
    DUPLICATE_INVOICE: 0,
    SHELL_VENDOR_NETWORK: 0,
    QUANTITY_GHOSTING: 0,
    BENIGN_NORMAL: 0
  };

  txs.forEach(t => {
    if (anomalyDistribution[t.anomalyType] !== undefined) {
      anomalyDistribution[t.anomalyType]++;
    }
  });

  return {
    totalUnderReview,
    flaggedCritical,
    paymentsFrozen,
    financialExposureINR,
    averageAuditRisk,
    anomalyDistribution
  };
}
