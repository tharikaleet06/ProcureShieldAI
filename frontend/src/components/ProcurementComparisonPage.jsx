import React, { useState, useEffect } from 'react';
import {
  Scale,
  PlusCircle,
  AlertTriangle,
  CheckCircle2,
  ShieldAlert,
  ShieldCheck,
  TrendingUp,
  Percent,
  Tag,
  FileSpreadsheet,
  Building2,
  HelpCircle,
  RefreshCw,
  Sparkles,
  ArrowRight,
  Calculator,
  ChevronDown,
  Info,
  Layers,
  FileCheck,
  Zap,
  Sliders,
  X
} from 'lucide-react';
import {
  SAMPLE_VENDORS,
  SAMPLE_VENDOR_OFFERS,
  SAMPLE_VENDOR_COUPONS,
  CANONICAL_PROCUREMENT_COMPARISON,
  compareVendorQuotations,
  calculateGst,
  calculateDiscount,
  analyzeProcurementQuoteRisk
} from '../data/procurementDataset.js';

export const ProcurementComparisonPage = ({ currentUser, onToast }) => {
  // Master Procurement Request State
  const [procurementInfo, setProcurementInfo] = useState({
    id: 'PROC-2026-LAPTOP-100',
    requirementTitle: 'Enterprise Laptop Procurement (Developer Workstations)',
    category: 'Electronics & Enterprise Computing',
    quantity: 100,
    unit: 'Laptops',
    buyerState: 'Maharashtra',
    gstRate: 18
  });

  // Quotations List State
  const [quotations, setQuotations] = useState([
    {
      quoteId: 'QTE-001',
      vendorId: 'VEND-ZENITH-01',
      vendorName: 'Zenith Tech Solutions Pvt Ltd (Vendor A)',
      vendorState: 'Maharashtra',
      gstin: '27AABCZ9021L1Z5',
      unitPrice: 100000,
      offerPercent: 10,
      couponCode: 'ZENITH5K',
      couponAmount: 5000,
      additionalCharges: 0,
      declaredDiscount: 1000000,
      declaredCgst: 805500,
      declaredSgst: 805500,
      declaredIgst: 0,
      declaredInvoiceAmount: 10561000
    },
    {
      quoteId: 'QTE-002',
      vendorId: 'VEND-APEX-02',
      vendorName: 'Apex Electronics & Heavy Dynamics (Vendor B)',
      vendorState: 'Karnataka',
      gstin: '29AABCA8812K1Z9',
      unitPrice: 108000,
      offerPercent: 20,
      couponCode: 'APEXDEAL10K',
      couponAmount: 10000,
      additionalCharges: 0,
      // Declared discrepancies for anomaly detection demonstration
      declaredDiscount: 1200000, // Expected ₹21,60,000 (Difference of ₹9,60,000)
      declaredIgst: 1800000,     // Expected ₹15,53,400 (Difference of ₹2,46,600)
      declaredInvoiceAmount: 11800000 // Expected ₹1,01,83,400
    },
    {
      quoteId: 'QTE-003',
      vendorId: 'VEND-OMNI-03',
      vendorName: 'OmniSys Technologies Ltd (Vendor C)',
      vendorState: 'Maharashtra',
      gstin: '27AAABO5541C1ZU',
      unitPrice: 95000,
      offerPercent: 5,
      couponCode: 'OMNI2K',
      couponAmount: 2000,
      additionalCharges: 0,
      declaredDiscount: 475000,
      declaredCgst: 812070,
      declaredSgst: 812070,
      declaredIgst: 0,
      declaredInvoiceAmount: 10647140
    }
  ]);

  // Comparison Results State
  const [comparisonResult, setComparisonResult] = useState(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [selectedVendorDetail, setSelectedVendorDetail] = useState(null);
  const [isAddQuoteModalOpen, setIsAddQuoteModalOpen] = useState(false);

  // New Quote Modal Form State
  const [newQuoteForm, setNewQuoteForm] = useState({
    vendorId: 'VEND-ZENITH-01',
    unitPrice: 100000,
    offerPercent: 10,
    couponCode: '',
    couponAmount: 0,
    additionalCharges: 0,
    simulateGstAnomaly: false,
    simulateOfferAnomaly: false,
    simulateCouponAnomaly: false
  });

  // Calculate & Compare on mount or when quotations change
  useEffect(() => {
    runComparison();
  }, [quotations, procurementInfo]);

  const runComparison = async () => {
    setIsCalculating(true);
    try {
      // Call backend API if running in live mode, or fallback to pure calculation
      const payload = {
        requirementTitle: procurementInfo.requirementTitle,
        category: procurementInfo.category,
        quantity: procurementInfo.quantity,
        unit: procurementInfo.unit,
        buyerState: procurementInfo.buyerState,
        gstRate: procurementInfo.gstRate,
        quotes: quotations
      };

      try {
        const res = await fetch('/api/v1/procurements/compare', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        if (res.ok) {
          const data = await res.json();
          if (data.comparison) {
            setComparisonResult(data.comparison);
            setIsCalculating(false);
            return;
          }
        }
      } catch (err) {
        // Fallback to local pure computation
      }

      const localResult = compareVendorQuotations(quotations, procurementInfo);
      setComparisonResult(localResult);
    } catch (e) {
      console.error('Comparison error:', e);
    } finally {
      setIsCalculating(false);
    }
  };

  const handleLoadCanonicalCase = () => {
    setProcurementInfo({
      id: 'PROC-2026-LAPTOP-100',
      requirementTitle: 'Enterprise Laptop Procurement (Developer Workstations)',
      category: 'Electronics & Enterprise Computing',
      quantity: 100,
      unit: 'Laptops',
      buyerState: 'Maharashtra',
      gstRate: 18
    });

    setQuotations([
      {
        quoteId: 'QTE-001',
        vendorId: 'VEND-ZENITH-01',
        vendorName: 'Zenith Tech Solutions Pvt Ltd (Vendor A)',
        vendorState: 'Maharashtra',
        gstin: '27AABCZ9021L1Z5',
        unitPrice: 100000,
        offerPercent: 10,
        couponCode: 'ZENITH5K',
        couponAmount: 5000,
        additionalCharges: 0
      },
      {
        quoteId: 'QTE-002',
        vendorId: 'VEND-APEX-02',
        vendorName: 'Apex Electronics & Heavy Dynamics (Vendor B)',
        vendorState: 'Karnataka',
        gstin: '29AABCA8812K1Z9',
        unitPrice: 108000,
        offerPercent: 20,
        couponCode: 'APEXDEAL10K',
        couponAmount: 10000,
        additionalCharges: 0,
        declaredDiscount: 1200000, // Discrepancy
        declaredIgst: 1800000,     // Discrepancy
        declaredInvoiceAmount: 11800000
      },
      {
        quoteId: 'QTE-003',
        vendorId: 'VEND-OMNI-03',
        vendorName: 'OmniSys Technologies Ltd (Vendor C)',
        vendorState: 'Maharashtra',
        gstin: '27AAABO5541C1ZU',
        unitPrice: 95000,
        offerPercent: 5,
        couponCode: 'OMNI2K',
        couponAmount: 2000,
        additionalCharges: 0
      }
    ]);

    if (onToast) onToast('Loaded Canonical Benchmark: Laptop Procurement (100 Units)');
  };

  const handleAddQuotationSubmit = (e) => {
    e.preventDefault();
    const vendor = SAMPLE_VENDORS.find(v => v.id === newQuoteForm.vendorId) || SAMPLE_VENDORS[0];
    
    // Anomaly simulation overrides
    let declaredDiscount = undefined;
    let declaredCgst = undefined;
    let declaredSgst = undefined;
    let declaredIgst = undefined;
    let declaredInvoiceAmount = undefined;

    const base = (Number(newQuoteForm.unitPrice) || 0) * (Number(procurementInfo.quantity) || 1);
    const expectedOfferAmt = (base * (Number(newQuoteForm.offerPercent) || 0)) / 100;

    if (newQuoteForm.simulateOfferAnomaly) {
      declaredDiscount = Math.round(expectedOfferAmt * 0.5); // 50% discount claimed
    }

    if (newQuoteForm.simulateGstAnomaly) {
      const isIntra = vendor.state.toLowerCase() === procurementInfo.buyerState.toLowerCase();
      if (isIntra) {
        declaredCgst = 999999;
        declaredSgst = 999999;
      } else {
        declaredIgst = 1999999;
      }
      declaredInvoiceAmount = base + 2000000;
    }

    const newQuote = {
      quoteId: `QTE-${Date.now().toString().slice(-4)}`,
      vendorId: vendor.id,
      vendorName: vendor.vendorName,
      vendorState: vendor.state,
      gstin: vendor.gstin,
      unitPrice: Number(newQuoteForm.unitPrice),
      offerPercent: Number(newQuoteForm.offerPercent),
      couponCode: newQuoteForm.simulateCouponAnomaly ? 'INVALID_OVERLIMIT_50K' : newQuoteForm.couponCode,
      couponAmount: newQuoteForm.simulateCouponAnomaly ? 50000 : Number(newQuoteForm.couponAmount),
      additionalCharges: Number(newQuoteForm.additionalCharges) || 0,
      declaredDiscount,
      declaredCgst,
      declaredSgst,
      declaredIgst,
      declaredInvoiceAmount
    };

    setQuotations(prev => [...prev, newQuote]);
    setIsAddQuoteModalOpen(false);
    if (onToast) onToast(`Added quotation from ${vendor.vendorName}`);
  };

  const handleRemoveQuote = (quoteId) => {
    if (quotations.length <= 1) {
      if (onToast) onToast('At least one quotation must remain for analysis.');
      return;
    }
    setQuotations(prev => prev.filter(q => q.quoteId !== quoteId));
    if (onToast) onToast('Quotation removed.');
  };

  const getRiskBadge = (level) => {
    switch (level) {
      case 'CRITICAL':
        return 'bg-rose-500/20 text-rose-300 border-rose-500/40';
      case 'HIGH':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
      case 'MEDIUM':
        return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/40';
      case 'LOW':
      default:
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300 max-w-7xl mx-auto">
      
      {/* 1. Header & Procurement Metadata Banner */}
      <div className="p-6 bg-slate-900/90 border border-slate-800 rounded-2xl shadow-xl backdrop-blur-sm space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 uppercase tracking-wider font-mono-numbers">
                Multi-Vendor Comparison & Risk Engine
              </span>
              <span className="text-xs text-slate-500 font-mono-numbers">{procurementInfo.id}</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
              <Scale className="w-6 h-6 text-rose-500" />
              AI-Powered Procurement Quotation & GST Analyzer
            </h1>
            <p className="text-xs text-slate-400">
              Evaluates effective procurement cost across all vendor bids, calculates statutory GST schedules, and detects anomalies in trade discounts, coupons, and tax declarations.
            </p>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              onClick={handleLoadCanonicalCase}
              className="px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all flex items-center gap-1.5 shadow-sm"
            >
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              Load Benchmark (Laptop 100 Units)
            </button>

            <button
              onClick={() => setIsAddQuoteModalOpen(true)}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-500 text-white transition-all flex items-center gap-1.5 shadow-lg shadow-rose-950/60"
            >
              <PlusCircle className="w-4 h-4" />
              Add Vendor Quotation
            </button>
          </div>
        </div>

        {/* Configurable Procurement Parameters Form */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 pt-4 border-t border-slate-800/80 text-xs">
          <div>
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Requirement Title
            </label>
            <input
              type="text"
              value={procurementInfo.requirementTitle}
              onChange={(e) => setProcurementInfo({ ...procurementInfo, requirementTitle: e.target.value })}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 font-medium focus:outline-none focus:border-rose-500"
            />
          </div>

          <div>
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Quantity & Units
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                min="1"
                value={procurementInfo.quantity}
                onChange={(e) => setProcurementInfo({ ...procurementInfo, quantity: Math.max(1, Number(e.target.value)) })}
                className="w-24 px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 font-mono-numbers focus:outline-none focus:border-rose-500"
              />
              <input
                type="text"
                value={procurementInfo.unit}
                onChange={(e) => setProcurementInfo({ ...procurementInfo, unit: e.target.value })}
                className="flex-1 px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-rose-500"
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Category
            </label>
            <input
              type="text"
              value={procurementInfo.category}
              onChange={(e) => setProcurementInfo({ ...procurementInfo, category: e.target.value })}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-rose-500"
            />
          </div>

          <div>
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Buyer State (Tax Nexus)
            </label>
            <select
              value={procurementInfo.buyerState}
              onChange={(e) => setProcurementInfo({ ...procurementInfo, buyerState: e.target.value })}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-rose-500"
            >
              <option value="Maharashtra">Maharashtra (Intra-state CGST+SGST)</option>
              <option value="Karnataka">Karnataka (Inter-state IGST)</option>
              <option value="Delhi">Delhi</option>
              <option value="Tamil Nadu">Tamil Nadu</option>
              <option value="Gujarat">Gujarat</option>
            </select>
          </div>

          <div>
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Configurable GST Rate
            </label>
            <select
              value={procurementInfo.gstRate}
              onChange={(e) => setProcurementInfo({ ...procurementInfo, gstRate: Number(e.target.value) })}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 font-mono-numbers focus:outline-none focus:border-rose-500"
            >
              <option value="0">0% (Nil Rated Goods)</option>
              <option value="5">5% (Essential Commodities)</option>
              <option value="12">12% (Standard Category 1)</option>
              <option value="18">18% (Standard / Electronics)</option>
              <option value="28">28% (Luxury & High Tech)</option>
            </select>
          </div>
        </div>
      </div>

      {/* 2. Key Procurement Metrics KPI Row */}
      {comparisonResult && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-xl space-y-1">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block font-mono-numbers">
              Lowest Effective Cost
            </span>
            <div className="text-xl font-black text-emerald-400 font-mono-numbers">
              ₹{(comparisonResult.lowestEffectiveCost || 0).toLocaleString('en-IN', { maximumFractionDigits: 2 })}
            </div>
            <span className="text-[11px] text-slate-400 block">
              Rank #1 by Net Procurement Outlay
            </span>
          </div>

          <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-xl space-y-1">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block font-mono-numbers">
              Market Average Cost
            </span>
            <div className="text-xl font-black text-cyan-400 font-mono-numbers">
              ₹{(comparisonResult.averageEffectiveCost || 0).toLocaleString('en-IN', { maximumFractionDigits: 2 })}
            </div>
            <span className="text-[11px] text-slate-400 block">
              Benchmark across {comparisonResult.totalQuotesCount} vendor bids
            </span>
          </div>

          <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-xl space-y-1">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block font-mono-numbers">
              Highest Effective Cost
            </span>
            <div className="text-xl font-black text-amber-400 font-mono-numbers">
              ₹{(comparisonResult.highestEffectiveCost || 0).toLocaleString('en-IN', { maximumFractionDigits: 2 })}
            </div>
            <span className="text-[11px] text-slate-400 block">
              Maximum commercial quote received
            </span>
          </div>

          <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-xl space-y-1">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block font-mono-numbers">
              Anomalies Flagged
            </span>
            <div className="text-xl font-black text-rose-400 font-mono-numbers flex items-center gap-2">
              {comparisonResult.flaggedAnomaliesCount} Quotes
              {comparisonResult.flaggedAnomaliesCount > 0 && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 font-bold border border-rose-500/40">
                  Review Required
                </span>
              )}
            </div>
            <span className="text-[11px] text-slate-400 block">
              Tax, coupon or offer inconsistencies
            </span>
          </div>
        </div>
      )}

      {/* 3. Master Vendor Comparison Matrix Table (Step 15 Requirement) */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-950/40">
          <div>
            <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <FileSpreadsheet className="w-4 h-4 text-cyan-400" />
              Statutory Vendor Quotation & Tax Matrix Table
            </h2>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Programmatic financial calculation order: Base Amount → Vendor Trade Offer → Eligible Coupon → Taxable Amount → GST → Additional Charges → Effective Cost
            </p>
          </div>
          <span className="text-xs text-slate-500 font-mono-numbers">
            {comparisonResult?.vendorQuotations?.length || 0} Vendors Analyzed
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-950/80 border-b border-slate-800 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                <th className="py-3.5 px-4 sticky left-0 bg-slate-950 z-10 border-r border-slate-800/80">
                  Financial Metric / Rule
                </th>
                {comparisonResult?.vendorQuotations?.map((vq, idx) => (
                  <th key={vq.quoteId || idx} className="py-3.5 px-4 min-w-[200px] border-r border-slate-800/50">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-white font-bold truncate">{vq.vendorName}</span>
                      <span className={`text-[10px] px-2 py-0.5 rounded border font-mono-numbers ${getRiskBadge(vq.riskLevel)}`}>
                        {vq.riskLevel} ({vq.riskScore}%)
                      </span>
                    </div>
                    <div className="text-[10px] text-slate-500 font-normal font-mono-numbers">
                      {vq.gstin} · {vq.vendorState}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono-numbers">
              
              {/* Row 1: Base Unit Price */}
              <tr className="hover:bg-slate-800/30 transition-colors">
                <td className="py-2.5 px-4 font-sans font-bold text-slate-300 sticky left-0 bg-slate-900 z-10 border-r border-slate-800/80">
                  Base Unit Price
                </td>
                {comparisonResult?.vendorQuotations?.map((vq, idx) => (
                  <td key={idx} className="py-2.5 px-4 text-slate-300 border-r border-slate-800/50">
                    ₹{(vq.unitPrice || 0).toLocaleString('en-IN')}
                  </td>
                ))}
              </tr>

              {/* Row 2: Base Total Amount */}
              <tr className="hover:bg-slate-800/30 transition-colors bg-slate-950/20">
                <td className="py-2.5 px-4 font-sans font-bold text-slate-300 sticky left-0 bg-slate-900 z-10 border-r border-slate-800/80">
                  Base Amount ({procurementInfo.quantity} {procurementInfo.unit})
                </td>
                {comparisonResult?.vendorQuotations?.map((vq, idx) => (
                  <td key={idx} className="py-2.5 px-4 font-bold text-white border-r border-slate-800/50">
                    ₹{(vq.baseAmount || 0).toLocaleString('en-IN')}
                  </td>
                ))}
              </tr>

              {/* Row 3: Vendor Trade Offer */}
              <tr className="hover:bg-slate-800/30 transition-colors">
                <td className="py-2.5 px-4 font-sans font-bold text-slate-300 sticky left-0 bg-slate-900 z-10 border-r border-slate-800/80">
                  Vendor Offer Discount
                </td>
                {comparisonResult?.vendorQuotations?.map((vq, idx) => (
                  <td key={idx} className="py-2.5 px-4 text-emerald-400 border-r border-slate-800/50">
                    -₹{(vq.offerAmount || 0).toLocaleString('en-IN')} ({vq.offerPercent}%)
                    {vq.declaredDiscount && vq.declaredDiscount !== vq.offerAmount && (
                      <span className="block text-[10px] text-amber-400 font-sans">
                        ⚠ Declared: ₹{vq.declaredDiscount.toLocaleString('en-IN')}
                      </span>
                    )}
                  </td>
                ))}
              </tr>

              {/* Row 4: Coupon Discount */}
              <tr className="hover:bg-slate-800/30 transition-colors">
                <td className="py-2.5 px-4 font-sans font-bold text-slate-300 sticky left-0 bg-slate-900 z-10 border-r border-slate-800/80">
                  Vendor Coupon Code
                </td>
                {comparisonResult?.vendorQuotations?.map((vq, idx) => (
                  <td key={idx} className="py-2.5 px-4 text-cyan-400 border-r border-slate-800/50">
                    {vq.couponCode ? (
                      <div>
                        <span>-₹{(vq.couponAmount || 0).toLocaleString('en-IN')}</span>
                        <span className="text-[10px] text-slate-400 block">Code: {vq.couponCode}</span>
                      </div>
                    ) : (
                      <span className="text-slate-500 font-sans">None</span>
                    )}
                  </td>
                ))}
              </tr>

              {/* Row 5: Taxable Amount */}
              <tr className="hover:bg-slate-800/30 transition-colors bg-slate-950/20">
                <td className="py-2.5 px-4 font-sans font-bold text-slate-300 sticky left-0 bg-slate-900 z-10 border-r border-slate-800/80">
                  Taxable Amount (Assessable Value)
                </td>
                {comparisonResult?.vendorQuotations?.map((vq, idx) => (
                  <td key={idx} className="py-2.5 px-4 font-bold text-white border-r border-slate-800/50">
                    ₹{(vq.taxableAmount || 0).toLocaleString('en-IN')}
                  </td>
                ))}
              </tr>

              {/* Row 6: GST Rate & Nexus Type */}
              <tr className="hover:bg-slate-800/30 transition-colors">
                <td className="py-2.5 px-4 font-sans font-bold text-slate-300 sticky left-0 bg-slate-900 z-10 border-r border-slate-800/80">
                  GST Rate & Statutory Nexus
                </td>
                {comparisonResult?.vendorQuotations?.map((vq, idx) => (
                  <td key={idx} className="py-2.5 px-4 text-slate-300 border-r border-slate-800/50 font-sans">
                    {vq.gstRate}% · {vq.taxType === 'INTRA_STATE' ? 'Intra-State (CGST + SGST)' : 'Inter-State (IGST)'}
                  </td>
                ))}
              </tr>

              {/* Row 7: CGST */}
              <tr className="hover:bg-slate-800/30 transition-colors">
                <td className="py-2.5 px-4 font-sans font-bold text-slate-300 sticky left-0 bg-slate-900 z-10 border-r border-slate-800/80">
                  CGST ({vq => vq.gstRate / 2}%)
                </td>
                {comparisonResult?.vendorQuotations?.map((vq, idx) => (
                  <td key={idx} className="py-2.5 px-4 text-slate-300 border-r border-slate-800/50">
                    {vq.cgstAmount > 0 ? `₹${vq.cgstAmount.toLocaleString('en-IN')}` : '₹0.00'}
                  </td>
                ))}
              </tr>

              {/* Row 8: SGST */}
              <tr className="hover:bg-slate-800/30 transition-colors">
                <td className="py-2.5 px-4 font-sans font-bold text-slate-300 sticky left-0 bg-slate-900 z-10 border-r border-slate-800/80">
                  SGST ({vq => vq.gstRate / 2}%)
                </td>
                {comparisonResult?.vendorQuotations?.map((vq, idx) => (
                  <td key={idx} className="py-2.5 px-4 text-slate-300 border-r border-slate-800/50">
                    {vq.sgstAmount > 0 ? `₹${vq.sgstAmount.toLocaleString('en-IN')}` : '₹0.00'}
                  </td>
                ))}
              </tr>

              {/* Row 9: IGST */}
              <tr className="hover:bg-slate-800/30 transition-colors">
                <td className="py-2.5 px-4 font-sans font-bold text-slate-300 sticky left-0 bg-slate-900 z-10 border-r border-slate-800/80">
                  IGST ({vq => vq.gstRate}%)
                </td>
                {comparisonResult?.vendorQuotations?.map((vq, idx) => (
                  <td key={idx} className="py-2.5 px-4 text-slate-300 border-r border-slate-800/50">
                    {vq.igstAmount > 0 ? (
                      <div>
                        <span>₹{vq.igstAmount.toLocaleString('en-IN')}</span>
                        {vq.declaredIgst && vq.declaredIgst !== vq.igstAmount && (
                          <span className="block text-[10px] text-rose-400 font-sans font-bold">
                            ⚠ Invoice: ₹{vq.declaredIgst.toLocaleString('en-IN')}
                          </span>
                        )}
                      </div>
                    ) : '₹0.00'}
                  </td>
                ))}
              </tr>

              {/* Row 10: Additional Charges */}
              <tr className="hover:bg-slate-800/30 transition-colors">
                <td className="py-2.5 px-4 font-sans font-bold text-slate-300 sticky left-0 bg-slate-900 z-10 border-r border-slate-800/80">
                  Additional Freight / Charges
                </td>
                {comparisonResult?.vendorQuotations?.map((vq, idx) => (
                  <td key={idx} className="py-2.5 px-4 text-slate-300 border-r border-slate-800/50">
                    ₹{(vq.additionalCharges || 0).toLocaleString('en-IN')}
                  </td>
                ))}
              </tr>

              {/* Row 11: Final Effective Procurement Cost */}
              <tr className="hover:bg-slate-800/40 transition-colors bg-slate-950/60 font-bold text-sm">
                <td className="py-3 px-4 font-sans text-rose-300 sticky left-0 bg-slate-950 z-10 border-r border-slate-800">
                  Effective Procurement Cost
                </td>
                {comparisonResult?.vendorQuotations?.map((vq, idx) => (
                  <td key={idx} className="py-3 px-4 border-r border-slate-800 text-white">
                    <span className="text-base text-rose-400 font-black block">
                      ₹{(vq.finalAmount || 0).toLocaleString('en-IN')}
                    </span>
                    <span className="text-[10px] text-slate-400 font-sans font-normal">
                      Rank #{vq.effectiveCostRank} of {comparisonResult.totalQuotesCount}
                    </span>
                  </td>
                ))}
              </tr>

              {/* Row 12: Deviation from Market Average */}
              <tr className="hover:bg-slate-800/30 transition-colors">
                <td className="py-2.5 px-4 font-sans font-bold text-slate-300 sticky left-0 bg-slate-900 z-10 border-r border-slate-800/80">
                  Price Deviation vs Average
                </td>
                {comparisonResult?.vendorQuotations?.map((vq, idx) => (
                  <td key={idx} className="py-2.5 px-4 border-r border-slate-800/50 font-sans">
                    <span className={`font-bold font-mono-numbers ${vq.deviationPercentage > 0 ? 'text-amber-400' : 'text-emerald-400'}`}>
                      {vq.deviationPercentage > 0 ? `+${vq.deviationPercentage}%` : `${vq.deviationPercentage}%`}
                    </span>
                    <span className="text-[10px] text-slate-500 block font-mono-numbers">
                      {vq.deviationFromAverage >= 0 ? `+₹${vq.deviationFromAverage.toLocaleString('en-IN')}` : `-₹${Math.abs(vq.deviationFromAverage).toLocaleString('en-IN')}`}
                    </span>
                  </td>
                ))}
              </tr>

              {/* Row 13: Fraud / Risk Score */}
              <tr className="hover:bg-slate-800/30 transition-colors bg-slate-950/30">
                <td className="py-3 px-4 font-sans font-bold text-slate-300 sticky left-0 bg-slate-900 z-10 border-r border-slate-800/80">
                  Procurement Risk Assessment
                </td>
                {comparisonResult?.vendorQuotations?.map((vq, idx) => (
                  <td key={idx} className="py-3 px-4 border-r border-slate-800/50">
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded text-[11px] font-bold font-mono-numbers border ${getRiskBadge(vq.riskLevel)}`}>
                          {vq.riskLevel} ({vq.riskScore}%)
                        </span>
                      </div>
                      <button
                        onClick={() => setSelectedVendorDetail(vq)}
                        className="text-[11px] font-bold text-rose-400 hover:text-rose-300 flex items-center gap-1 transition-colors"
                      >
                        Why was this flagged? <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </td>
                ))}
              </tr>

            </tbody>
          </table>
        </div>
      </div>

      {/* 4. Interactive Quotations Card Grid & Management */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-rose-500" />
              Vendor Quotation Profiles & Anomaly Status
            </h3>
            <p className="text-xs text-slate-400">
              Detailed breakdown of vendor financial submissions and explainable AI risk indicators.
            </p>
          </div>
          <button
            onClick={() => setIsAddQuoteModalOpen(true)}
            className="px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center gap-1.5"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            Add Another Bid
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {comparisonResult?.vendorQuotations?.map((vq, idx) => (
            <div
              key={vq.quoteId || idx}
              className={`p-5 rounded-2xl border transition-all flex flex-col justify-between ${
                vq.riskScore >= 60
                  ? 'bg-rose-950/20 border-rose-500/40 shadow-lg shadow-rose-950/20'
                  : vq.riskScore >= 30
                  ? 'bg-amber-950/20 border-amber-500/30'
                  : 'bg-slate-900/90 border-slate-800'
              }`}
            >
              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white block">{vq.vendorName}</span>
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono-numbers block">{vq.gstin} · {vq.vendorState}</span>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold border font-mono-numbers ${getRiskBadge(vq.riskLevel)}`}>
                    {vq.riskLevel}
                  </span>
                </div>

                {/* Pricing Summary */}
                <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/80 space-y-2 text-xs">
                  <div className="flex justify-between items-center text-slate-400">
                    <span>Unit Price:</span>
                    <span className="text-white font-mono-numbers">₹{vq.unitPrice.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between items-center text-slate-400">
                    <span>Offer Discount:</span>
                    <span className="text-emerald-400 font-mono-numbers">{vq.offerPercent}% (-₹{vq.offerAmount.toLocaleString('en-IN')})</span>
                  </div>
                  {vq.couponCode && (
                    <div className="flex justify-between items-center text-slate-400">
                      <span>Coupon Applied:</span>
                      <span className="text-cyan-400 font-mono-numbers">-₹{vq.couponAmount.toLocaleString('en-IN')} ({vq.couponCode})</span>
                    </div>
                  )}
                  <div className="flex justify-between items-center text-slate-400">
                    <span>GST ({vq.gstRate}% {vq.taxType === 'INTRA_STATE' ? 'CGST+SGST' : 'IGST'}):</span>
                    <span className="text-slate-300 font-mono-numbers">₹{vq.totalGstAmount.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="pt-2 border-t border-slate-800 flex justify-between items-center font-bold">
                    <span className="text-slate-200">Effective Cost:</span>
                    <span className="text-rose-400 text-sm font-mono-numbers">₹{vq.finalAmount.toLocaleString('en-IN')}</span>
                  </div>
                </div>

                {/* Detected Anomalies / Compliance Messages */}
                <div className="space-y-1.5 text-xs">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block font-mono-numbers">
                    Forensic Anomaly Checklist:
                  </span>
                  {vq.explainableReasons && vq.explainableReasons.length > 0 ? (
                    <div className="space-y-1">
                      {vq.explainableReasons.map((reason, rIdx) => (
                        <div
                          key={rIdx}
                          className={`p-2 rounded-lg text-[11px] leading-relaxed flex items-start gap-1.5 ${
                            reason.startsWith('⚠')
                              ? 'bg-rose-500/10 border border-rose-500/20 text-rose-300'
                              : 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-300'
                          }`}
                        >
                          <span className="shrink-0">{reason.startsWith('⚠') ? '⚠' : '✓'}</span>
                          <span>{reason.replace(/^[⚠✓]\s*/, '')}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-[11px] flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                      <span>Quotation compliant with all statutory pricing & tax rules.</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Actions Footer */}
              <div className="pt-4 mt-4 border-t border-slate-800/80 flex items-center justify-between gap-2">
                <button
                  onClick={() => setSelectedVendorDetail(vq)}
                  className="px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors flex items-center gap-1.5"
                >
                  <Info className="w-3.5 h-3.5 text-rose-400" />
                  Inspect Analysis
                </button>

                <button
                  onClick={() => handleRemoveQuote(vq.quoteId)}
                  className="p-1.5 text-slate-500 hover:text-rose-400 transition-colors"
                  title="Remove quotation"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

            </div>
          ))}
        </div>
      </div>

      {/* 5. "Why Was This Vendor Flagged?" Forensic Detail Modal (Step 12 & Step 15) */}
      {selectedVendorDetail && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl p-6 space-y-6">
            
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-slate-800 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded text-xs font-bold font-mono-numbers border ${getRiskBadge(selectedVendorDetail.riskLevel)}`}>
                    {selectedVendorDetail.riskLevel} RISK ({selectedVendorDetail.riskScore}/100)
                  </span>
                  <span className="text-xs text-slate-400 font-mono-numbers">
                    {selectedVendorDetail.quoteId}
                  </span>
                </div>
                <h3 className="text-lg font-black text-white mt-1">
                  Why was {selectedVendorDetail.vendorName} flagged?
                </h3>
                <p className="text-xs text-slate-400">
                  Explainable forensic discrepancy analysis & statutory GST reconciliation.
                </p>
              </div>
              <button
                onClick={() => setSelectedVendorDetail(null)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Vendor Profile & Nexus */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs">
              <div>
                <span className="text-[10px] text-slate-500 uppercase font-mono-numbers block">GSTIN:</span>
                <span className="font-bold text-slate-200 font-mono-numbers">{selectedVendorDetail.gstin}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 uppercase font-mono-numbers block">Vendor State:</span>
                <span className="font-bold text-slate-200">{selectedVendorDetail.vendorState}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 uppercase font-mono-numbers block">Statutory Nexus:</span>
                <span className="font-bold text-slate-200">{selectedVendorDetail.taxType}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 uppercase font-mono-numbers block">Historical Risk:</span>
                <span className="font-bold text-slate-200 font-mono-numbers">{selectedVendorDetail.historicalRiskScore || 15}%</span>
              </div>
            </div>

            {/* Expected vs Declared Financial Breakdown */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Calculator className="w-3.5 h-3.5 text-rose-400" />
                Statutory Expected vs Declared Invoice Values
              </h4>

              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-950 border-b border-slate-800 text-[11px] text-slate-400 uppercase font-bold">
                      <th className="py-2.5 px-3">Item / Tax Component</th>
                      <th className="py-2.5 px-3">Statutory Expected (₹)</th>
                      <th className="py-2.5 px-3">Declared in Submission (₹)</th>
                      <th className="py-2.5 px-3">Variance / Discrepancy</th>
                      <th className="py-2.5 px-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 font-mono-numbers">
                    
                    {/* Base & Trade Discount */}
                    <tr>
                      <td className="py-2.5 px-3 font-sans font-medium text-slate-300">Trade Offer Discount</td>
                      <td className="py-2.5 px-3 text-slate-200">₹{selectedVendorDetail.offerAmount.toLocaleString('en-IN')}</td>
                      <td className="py-2.5 px-3 text-slate-200">
                        ₹{(selectedVendorDetail.declaredDiscount ?? selectedVendorDetail.offerAmount).toLocaleString('en-IN')}
                      </td>
                      <td className="py-2.5 px-3">
                        {selectedVendorDetail.declaredDiscount && selectedVendorDetail.declaredDiscount !== selectedVendorDetail.offerAmount ? (
                          <span className="text-amber-400 font-bold">
                            ₹{Math.abs(selectedVendorDetail.declaredDiscount - selectedVendorDetail.offerAmount).toLocaleString('en-IN')}
                          </span>
                        ) : (
                          <span className="text-slate-500">₹0.00</span>
                        )}
                      </td>
                      <td className="py-2.5 px-3 font-sans">
                        {selectedVendorDetail.declaredDiscount && selectedVendorDetail.declaredDiscount !== selectedVendorDetail.offerAmount ? (
                          <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30">
                            OFFER_DISCREPANCY
                          </span>
                        ) : (
                          <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold">
                            MATCH
                          </span>
                        )}
                      </td>
                    </tr>

                    {/* Taxable Amount */}
                    <tr>
                      <td className="py-2.5 px-3 font-sans font-medium text-slate-300">Taxable Value</td>
                      <td className="py-2.5 px-3 text-slate-200">₹{selectedVendorDetail.taxableAmount.toLocaleString('en-IN')}</td>
                      <td className="py-2.5 px-3 text-slate-200">
                        ₹{(selectedVendorDetail.declaredTaxableAmount ?? selectedVendorDetail.taxableAmount).toLocaleString('en-IN')}
                      </td>
                      <td className="py-2.5 px-3 text-slate-500">₹0.00</td>
                      <td className="py-2.5 px-3 font-sans">
                        <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold">
                          MATCH
                        </span>
                      </td>
                    </tr>

                    {/* CGST / SGST / IGST */}
                    {selectedVendorDetail.taxType === 'INTRA_STATE' ? (
                      <>
                        <tr>
                          <td className="py-2.5 px-3 font-sans font-medium text-slate-300">Statutory CGST ({selectedVendorDetail.gstRate / 2}%)</td>
                          <td className="py-2.5 px-3 text-slate-200">₹{selectedVendorDetail.cgstAmount.toLocaleString('en-IN')}</td>
                          <td className="py-2.5 px-3 text-slate-200">
                            ₹{(selectedVendorDetail.declaredCgst ?? selectedVendorDetail.cgstAmount).toLocaleString('en-IN')}
                          </td>
                          <td className="py-2.5 px-3">
                            {selectedVendorDetail.declaredCgst && Math.abs(selectedVendorDetail.declaredCgst - selectedVendorDetail.cgstAmount) > 2 ? (
                              <span className="text-rose-400 font-bold">
                                ₹{Math.abs(selectedVendorDetail.declaredCgst - selectedVendorDetail.cgstAmount).toLocaleString('en-IN')}
                              </span>
                            ) : (
                              <span className="text-slate-500">₹0.00</span>
                            )}
                          </td>
                          <td className="py-2.5 px-3 font-sans">
                            {selectedVendorDetail.declaredCgst && Math.abs(selectedVendorDetail.declaredCgst - selectedVendorDetail.cgstAmount) > 2 ? (
                              <span className="text-[10px] px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 font-bold border border-rose-500/30">
                                GST_ANOMALY
                              </span>
                            ) : (
                              <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold">
                                MATCH
                              </span>
                            )}
                          </td>
                        </tr>

                        <tr>
                          <td className="py-2.5 px-3 font-sans font-medium text-slate-300">Statutory SGST ({selectedVendorDetail.gstRate / 2}%)</td>
                          <td className="py-2.5 px-3 text-slate-200">₹{selectedVendorDetail.sgstAmount.toLocaleString('en-IN')}</td>
                          <td className="py-2.5 px-3 text-slate-200">
                            ₹{(selectedVendorDetail.declaredSgst ?? selectedVendorDetail.sgstAmount).toLocaleString('en-IN')}
                          </td>
                          <td className="py-2.5 px-3">
                            {selectedVendorDetail.declaredSgst && Math.abs(selectedVendorDetail.declaredSgst - selectedVendorDetail.sgstAmount) > 2 ? (
                              <span className="text-rose-400 font-bold">
                                ₹{Math.abs(selectedVendorDetail.declaredSgst - selectedVendorDetail.sgstAmount).toLocaleString('en-IN')}
                              </span>
                            ) : (
                              <span className="text-slate-500">₹0.00</span>
                            )}
                          </td>
                          <td className="py-2.5 px-3 font-sans">
                            {selectedVendorDetail.declaredSgst && Math.abs(selectedVendorDetail.declaredSgst - selectedVendorDetail.sgstAmount) > 2 ? (
                              <span className="text-[10px] px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 font-bold border border-rose-500/30">
                                GST_ANOMALY
                              </span>
                            ) : (
                              <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold">
                                MATCH
                              </span>
                            )}
                          </td>
                        </tr>
                      </>
                    ) : (
                      <tr>
                        <td className="py-2.5 px-3 font-sans font-medium text-slate-300">Statutory IGST ({selectedVendorDetail.gstRate}%)</td>
                        <td className="py-2.5 px-3 text-slate-200">₹{selectedVendorDetail.igstAmount.toLocaleString('en-IN')}</td>
                        <td className="py-2.5 px-3 text-slate-200">
                          ₹{(selectedVendorDetail.declaredIgst ?? selectedVendorDetail.igstAmount).toLocaleString('en-IN')}
                        </td>
                        <td className="py-2.5 px-3">
                          {selectedVendorDetail.declaredIgst && Math.abs(selectedVendorDetail.declaredIgst - selectedVendorDetail.igstAmount) > 2 ? (
                            <span className="text-rose-400 font-bold">
                              ₹{Math.abs(selectedVendorDetail.declaredIgst - selectedVendorDetail.igstAmount).toLocaleString('en-IN')}
                            </span>
                          ) : (
                            <span className="text-slate-500">₹0.00</span>
                          )}
                        </td>
                        <td className="py-2.5 px-3 font-sans">
                          {selectedVendorDetail.declaredIgst && Math.abs(selectedVendorDetail.declaredIgst - selectedVendorDetail.igstAmount) > 2 ? (
                            <span className="text-[10px] px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 font-bold border border-rose-500/30">
                              GST_ANOMALY
                            </span>
                          ) : (
                            <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold">
                              MATCH
                            </span>
                          )}
                        </td>
                      </tr>
                    )}

                    {/* Final Net Amount */}
                    <tr className="bg-slate-950/80 font-bold">
                      <td className="py-2.5 px-3 font-sans text-rose-300">Final Procurement Total</td>
                      <td className="py-2.5 px-3 text-rose-400">₹{selectedVendorDetail.finalAmount.toLocaleString('en-IN')}</td>
                      <td className="py-2.5 px-3 text-white">
                        ₹{(selectedVendorDetail.declaredInvoiceAmount ?? selectedVendorDetail.finalAmount).toLocaleString('en-IN')}
                      </td>
                      <td className="py-2.5 px-3">
                        {selectedVendorDetail.declaredInvoiceAmount && Math.abs(selectedVendorDetail.declaredInvoiceAmount - selectedVendorDetail.finalAmount) > 2 ? (
                          <span className="text-rose-400 font-bold">
                            ₹{Math.abs(selectedVendorDetail.declaredInvoiceAmount - selectedVendorDetail.finalAmount).toLocaleString('en-IN')}
                          </span>
                        ) : (
                          <span className="text-slate-500">₹0.00</span>
                        )}
                      </td>
                      <td className="py-2.5 px-3 font-sans">
                        {selectedVendorDetail.declaredInvoiceAmount && Math.abs(selectedVendorDetail.declaredInvoiceAmount - selectedVendorDetail.finalAmount) > 2 ? (
                          <span className="text-[10px] px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 font-bold border border-rose-500/30">
                            INVOICE_MISMATCH
                          </span>
                        ) : (
                          <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold">
                            MATCH
                          </span>
                        )}
                      </td>
                    </tr>

                  </tbody>
                </table>
              </div>
            </div>

            {/* Explainable Reasons Summary */}
            <div className="space-y-2 p-4 bg-slate-950 rounded-xl border border-slate-800">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block font-mono-numbers">
                Root-Cause Explanation & Risk Weighting:
              </span>
              <div className="space-y-1.5 text-xs">
                {selectedVendorDetail.explainableReasons?.map((r, i) => (
                  <div key={i} className="flex items-start gap-2 text-slate-300">
                    <span className="text-amber-400 shrink-0 font-bold">•</span>
                    <span>{r}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Auditor Guidance & Remediation */}
            <div className="p-4 bg-rose-950/20 border border-rose-500/30 rounded-xl flex items-start gap-3">
              <ShieldAlert className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
              <div className="space-y-1 text-xs">
                <span className="font-bold text-rose-300 block">Recommended Auditor Action:</span>
                <p className="text-slate-300">
                  {selectedVendorDetail.suggestedAction || 'Hold purchase order issuance until supplier furnishes an amended quotation reflecting verified GST schedules and approved trade discount amounts.'}
                </p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                onClick={() => setSelectedVendorDetail(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-200"
              >
                Close Explanation
              </button>
            </div>

          </div>
        </div>
      )}

      {/* 6. Add Custom Vendor Quotation Modal */}
      {isAddQuoteModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg shadow-2xl p-6 space-y-5">
            
            <div className="flex items-start justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <PlusCircle className="w-5 h-5 text-rose-500" />
                  Submit Vendor Quotation for Evaluation
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Input commercial bid details. The engine will calculate statutory GST, validate coupons, and detect pricing anomalies.
                </p>
              </div>
              <button
                onClick={() => setIsAddQuoteModalOpen(false)}
                className="p-1 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddQuotationSubmit} className="space-y-4 text-xs">
              <div>
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Select Registered Vendor
                </label>
                <select
                  value={newQuoteForm.vendorId}
                  onChange={(e) => {
                    const v = SAMPLE_VENDORS.find(item => item.id === e.target.value);
                    const defaultOffer = SAMPLE_VENDOR_OFFERS.find(o => o.vendorId === e.target.value);
                    const defaultCoupon = SAMPLE_VENDOR_COUPONS.find(c => c.vendorId === e.target.value);
                    setNewQuoteForm({
                      ...newQuoteForm,
                      vendorId: e.target.value,
                      offerPercent: defaultOffer ? defaultOffer.offerValue : 0,
                      couponCode: defaultCoupon ? defaultCoupon.couponCode : '',
                      couponAmount: defaultCoupon ? defaultCoupon.discountValue : 0
                    });
                  }}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-rose-500"
                >
                  {SAMPLE_VENDORS.map(v => (
                    <option key={v.id} value={v.id}>
                      {v.vendorName} ({v.state} · GSTIN: {v.gstin})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    Base Unit Price (₹)
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={newQuoteForm.unitPrice}
                    onChange={(e) => setNewQuoteForm({ ...newQuoteForm, unitPrice: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 font-mono-numbers focus:outline-none focus:border-rose-500"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    Vendor Trade Offer (%)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={newQuoteForm.offerPercent}
                    onChange={(e) => setNewQuoteForm({ ...newQuoteForm, offerPercent: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 font-mono-numbers focus:outline-none focus:border-rose-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    Vendor Coupon Code
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. ZENITH5K"
                    value={newQuoteForm.couponCode}
                    onChange={(e) => setNewQuoteForm({ ...newQuoteForm, couponCode: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 uppercase focus:outline-none focus:border-rose-500"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    Coupon Discount (₹)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={newQuoteForm.couponAmount}
                    onChange={(e) => setNewQuoteForm({ ...newQuoteForm, couponAmount: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 font-mono-numbers focus:outline-none focus:border-rose-500"
                  />
                </div>
              </div>

              {/* Anomaly Testing Switches */}
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block font-mono-numbers">
                  Simulate Fraud Anomaly Triggers (Testing & Demo):
                </span>
                
                <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                  <input
                    type="checkbox"
                    checked={newQuoteForm.simulateGstAnomaly}
                    onChange={(e) => setNewQuoteForm({ ...newQuoteForm, simulateGstAnomaly: e.target.checked })}
                    className="rounded bg-slate-900 border-slate-700 text-rose-600 focus:ring-0"
                  />
                  <span>Simulate GST Anomaly (Claim Inflated Tax Refund)</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                  <input
                    type="checkbox"
                    checked={newQuoteForm.simulateOfferAnomaly}
                    onChange={(e) => setNewQuoteForm({ ...newQuoteForm, simulateOfferAnomaly: e.target.checked })}
                    className="rounded bg-slate-900 border-slate-700 text-rose-600 focus:ring-0"
                  />
                  <span>Simulate Trade Offer Discrepancy (Undisclosed Cut)</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                  <input
                    type="checkbox"
                    checked={newQuoteForm.simulateCouponAnomaly}
                    onChange={(e) => setNewQuoteForm({ ...newQuoteForm, simulateCouponAnomaly: e.target.checked })}
                    className="rounded bg-slate-900 border-slate-700 text-rose-600 focus:ring-0"
                  />
                  <span>Simulate Coupon Limit Violation (₹50,000 Over-cap)</span>
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddQuoteModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-950/60"
                >
                  Add Quotation
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
};
