import React, { useState } from 'react';
import { TrendingUp, AlertCircle, CheckCircle, Info } from 'lucide-react';

export const HistoricalPriceChart = ({
  historicalData,
  currentUnitPrice,
  currentInvoiceNo,
  baselinePrice,
  marketIndexPrice = 52400,
  itemDescription,
  currencySymbol = '₹'
}) => {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  // Combine historical records with the current flagged transaction
  const allPoints = [
    ...historicalData.map(h => ({
      label: h.quarter || h.date.slice(0, 7),
      date: h.date,
      invoiceNo: h.invoiceNo,
      price: h.unitPrice,
      isCurrent: false,
      vendor: h.vendorName
    })),
    {
      label: 'CURRENT INVOICE',
      date: 'Pending Approval',
      invoiceNo: currentInvoiceNo,
      price: currentUnitPrice,
      isCurrent: true,
      vendor: historicalData[0]?.vendorName || 'Same Vendor'
    }
  ];

  const maxPrice = Math.max(...allPoints.map(p => p.price), currentUnitPrice, marketIndexPrice * 1.2) * 1.1;
  const minPrice = 0;
  const chartHeight = 220;

  const multiplier = (currentUnitPrice / (baselinePrice || 1)).toFixed(1);
  const variancePct = baselinePrice > 0 ? Math.round(((currentUnitPrice - baselinePrice) / baselinePrice) * 100) : 0;

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 shadow-sm">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-rose-400" />
            <h3 className="text-sm font-semibold text-white tracking-tight">
              Historical Price Variance & Anomaly Baseline
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Component: <span className="text-slate-200 font-medium">{itemDescription}</span>
          </p>
        </div>

        {/* Highlight Stats */}
        <div className="flex items-center gap-4 text-xs font-mono-numbers">
          <div>
            <span className="text-slate-500 block text-[10px] uppercase tracking-wider">Multi-Quarter Baseline</span>
            <span className="text-slate-200 font-semibold">{currencySymbol}{baselinePrice.toLocaleString('en-IN')}</span>
          </div>
          <div className="h-6 w-px bg-slate-800" />
          <div>
            <span className="text-slate-500 block text-[10px] uppercase tracking-wider">Current Invoiced Rate</span>
            <span className="text-rose-400 font-bold">{currencySymbol}{currentUnitPrice.toLocaleString('en-IN')}</span>
          </div>
          <div className="h-6 w-px bg-slate-800" />
          <div>
            <span className="text-slate-500 block text-[10px] uppercase tracking-wider">Surge Factor</span>
            <span className={`font-bold ${variancePct > 50 ? 'text-rose-400' : 'text-emerald-400'}`}>
              {multiplier}× (+{variancePct}%)
            </span>
          </div>
        </div>
      </div>

      {/* SVG Chart */}
      <div className="relative pt-6 pb-4">
        {/* Market Benchmark Line Legend */}
        <div className="flex items-center justify-between text-[11px] text-slate-400 mb-3 px-1">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-500 inline-block" />
              Historical Cleared POs
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block ring-2 ring-rose-500/30" />
              Current Flagged Invoice ({multiplier}× Spike)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 border-t border-dashed border-cyan-400 inline-block" />
              Fair Market Commodity Index ({currencySymbol}{marketIndexPrice.toLocaleString('en-IN')})
            </span>
          </div>
          <span className="text-slate-500 text-[10px]">6-Quarter Trend Analysis</span>
        </div>

        <div className="h-[220px] w-full flex items-end gap-2 sm:gap-4 relative px-2">
          {/* Baseline horizontal guide line */}
          <div
            className="absolute left-0 right-0 border-b border-dashed border-slate-700 pointer-events-none flex items-center justify-end pr-2"
            style={{
              bottom: `${(baselinePrice / maxPrice) * 100}%`
            }}
          >
            <span className="text-[10px] font-mono-numbers text-slate-400 bg-slate-900/90 px-1 py-0.5 rounded -mb-2.5 border border-slate-800">
              Avg Baseline: {currencySymbol}{baselinePrice.toLocaleString('en-IN')}
            </span>
          </div>

          {/* Market benchmark horizontal guide line */}
          <div
            className="absolute left-0 right-0 border-b border-dashed border-cyan-500/60 pointer-events-none flex items-center justify-start pl-2"
            style={{
              bottom: `${(marketIndexPrice / maxPrice) * 100}%`
            }}
          >
            <span className="text-[10px] font-mono-numbers text-cyan-400 bg-slate-900/90 px-1 py-0.5 rounded -mb-2.5 border border-cyan-900/50">
              Market Index: {currencySymbol}{marketIndexPrice.toLocaleString('en-IN')}
            </span>
          </div>

          {/* Bars */}
          {allPoints.map((point, idx) => {
            const heightPct = Math.max(8, (point.price / maxPrice) * 100);
            const isHovered = hoveredIndex === idx;

            return (
              <div
                key={idx}
                className="flex-1 flex flex-col items-center h-full justify-end group relative cursor-pointer"
                onMouseEnter={() => setHoveredIndex(idx)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                {/* Tooltip on hover */}
                {isHovered && (
                  <div className="absolute -top-16 z-20 bg-slate-950 border border-slate-700 shadow-xl rounded-md px-2.5 py-1.5 text-xs whitespace-nowrap pointer-events-none">
                    <p className="font-semibold text-white">{point.label} · {point.invoiceNo}</p>
                    <p className="font-mono-numbers text-slate-300">
                      Rate: <span className={point.isCurrent ? 'text-rose-400 font-bold' : 'text-slate-100 font-semibold'}>{currencySymbol}{point.price.toLocaleString('en-IN')}</span>
                    </p>
                    <p className="text-[10px] text-slate-400">{point.vendor}</p>
                  </div>
                )}

                {/* Price label on top of bar */}
                <span className={`text-[10px] font-mono-numbers mb-1.5 transition-all ${
                  point.isCurrent 
                    ? 'text-rose-400 font-bold text-xs animate-pulse' 
                    : 'text-slate-400 group-hover:text-slate-200'
                }`}>
                  {currencySymbol}{Math.round(point.price / 1000)}k
                </span>

                {/* Bar element */}
                <div
                  className={`w-full max-w-[48px] rounded-t-md transition-all duration-300 relative ${
                    point.isCurrent
                      ? 'bg-gradient-to-t from-rose-700 to-rose-500 shadow-lg shadow-rose-950/80 border-t-2 border-rose-300'
                      : 'bg-slate-700 hover:bg-slate-600 border-t border-slate-600'
                  }`}
                  style={{ height: `${heightPct}%` }}
                >
                  {point.isCurrent && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-rose-400 ring-4 ring-rose-500/30" />
                  )}
                </div>

                {/* Bottom X-axis label */}
                <div className="mt-2 text-center">
                  <span className={`text-[10px] tracking-tight block ${
                    point.isCurrent 
                      ? 'text-rose-400 font-bold' 
                      : 'text-slate-400 group-hover:text-slate-300'
                  }`}>
                    {point.label}
                  </span>
                  <span className="text-[9px] text-slate-500 block truncate max-w-[60px]">
                    {point.isCurrent ? 'FLAGGED' : point.date}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Forensic Finding Footer */}
      <div className="mt-4 p-3 bg-rose-950/20 border border-rose-900/40 rounded-lg flex items-start gap-2.5 text-xs">
        <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
        <div className="text-slate-300">
          <span className="font-semibold text-rose-300">Auditor Anomaly Confirmation: </span>
          The identical component was procured 6 times over the past 18 months from the same vendor at an average unit price of ₹50,000 ± 2.4%. The sudden markup to ₹1,85,000 represents an uncorroborated +270% price inflation (+₹1,35,000 overcharge per unit) with zero corresponding raw material benchmark spike.
        </div>
      </div>
    </div>
  );
};
