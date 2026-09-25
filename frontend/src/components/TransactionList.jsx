import React, { useState } from 'react';
import { 
  AlertTriangle, 
  ShieldCheck, 
  Lock, 
  Search, 
  ArrowUpRight, 
  Building2, 
  FileText, 
  Sparkles,
  ChevronRight,
  TrendingUp,
  Copy,
  Split,
  Box
} from 'lucide-react';

export const TransactionList = ({
  transactions,
  selectedTransactionId,
  onSelectTransaction,
  onInvestigate,
  filter
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  // Filter list
  const filtered = transactions.filter(tx => {
    // Anomaly type filter
    if (filter !== 'ALL' && tx.anomalyType !== filter) {
      return false;
    }
    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        tx.invoiceNumber.toLowerCase().includes(q) ||
        tx.vendorName.toLowerCase().includes(q) ||
        tx.itemDescription.toLowerCase().includes(q) ||
        tx.poNumber.toLowerCase().includes(q) ||
        tx.approverName.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const getAnomalyIcon = (type) => {
    switch (type) {
      case 'PRICE_SPIKE':
        return <TrendingUp className="w-3.5 h-3.5 text-rose-400" />;
      case 'DUPLICATE_INVOICE':
        return <Copy className="w-3.5 h-3.5 text-amber-400" />;
      case 'SPLIT_PO_STRUCTURING':
        return <Split className="w-3.5 h-3.5 text-purple-400" />;
      case 'SHELL_VENDOR_NETWORK':
        return <Building2 className="w-3.5 h-3.5 text-red-400" />;
      case 'QUANTITY_GHOSTING':
        return <Box className="w-3.5 h-3.5 text-orange-400" />;
      default:
        return <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />;
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'FLAGGED_CRITICAL':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-400 bg-rose-950/60 border border-rose-800/40 px-2 py-0.5 rounded">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
            Flagged Critical
          </span>
        );
      case 'PAYMENT_FROZEN':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-300 bg-amber-950/60 border border-amber-800/40 px-2 py-0.5 rounded">
            <Lock className="w-3 h-3 text-amber-400" />
            Payment Frozen
          </span>
        );
      case 'UNDER_INVESTIGATION':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-cyan-300 bg-cyan-950/60 border border-cyan-800/40 px-2 py-0.5 rounded">
            Auditor In Review
          </span>
        );
      case 'APPROVED':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-300 bg-emerald-950/60 border border-emerald-800/40 px-2 py-0.5 rounded">
            Cleared & Approved
          </span>
        );
      default:
        return (
          <span className="text-[11px] text-slate-400">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm flex flex-col h-full">
      {/* Top Search bar */}
      <div className="p-3.5 border-b border-slate-800 flex items-center justify-between gap-3 bg-slate-900/60">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search invoice #, vendor, component, or approver..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-slate-950/70 border border-slate-800 rounded-md text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-rose-500/60 transition-colors"
          />
        </div>
        <div className="text-xs text-slate-400 font-mono-numbers shrink-0">
          Showing <span className="text-white font-semibold">{filtered.length}</span> of {transactions.length}
        </div>
      </div>

      {/* List items */}
      <div className="divide-y divide-slate-800/80 overflow-y-auto max-h-[640px]">
        {filtered.length === 0 ? (
          <div className="p-8 text-center text-slate-500 text-xs">
            No procurement transactions match the selected filter or search term.
          </div>
        ) : (
          filtered.map(tx => {
            const isSelected = tx.id === selectedTransactionId;
            const isCritical = tx.riskScore >= 75;

            return (
              <div
                key={tx.id}
                onClick={() => onSelectTransaction(tx)}
                className={`p-4 cursor-pointer transition-colors relative flex flex-col gap-2.5 ${
                  isSelected
                    ? 'bg-slate-800/90 border-l-4 border-l-rose-500'
                    : 'hover:bg-slate-800/40 border-l-4 border-l-transparent'
                }`}
              >
                {/* Line 1: Invoice & PO + Status */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold font-mono-numbers text-white">
                      {tx.invoiceNumber}
                    </span>
                    <span className="text-[11px] text-slate-500 font-mono-numbers">
                      {tx.poNumber}
                    </span>
                    <span className="text-[11px] text-slate-400 flex items-center gap-1">
                      {getAnomalyIcon(tx.anomalyType)}
                      <span className="capitalize">{tx.anomalyType.replace(/_/g, ' ').toLowerCase()}</span>
                    </span>
                  </div>
                  <div>
                    {getStatusBadge(tx.status)}
                  </div>
                </div>

                {/* Line 2: Item Description */}
                <div>
                  <h4 className="text-xs font-semibold text-slate-200 line-clamp-1">
                    {tx.itemDescription}
                  </h4>
                  <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                    <span>{tx.vendorName}</span>
                    <span aria-hidden="true">·</span>
                    <span className="font-mono-numbers">₹{tx.totalAmount.toLocaleString('en-IN')}</span>
                    {tx.priceVariancePercent !== 0 && (
                      <>
                        <span aria-hidden="true">·</span>
                        <span className={`font-mono-numbers font-medium ${tx.priceVariancePercent > 50 ? 'text-rose-400' : 'text-emerald-400'}`}>
                          {tx.priceVariancePercent > 0 ? `+${tx.priceVariancePercent}%` : `${tx.priceVariancePercent}%`} vs baseline
                        </span>
                      </>
                    )}
                  </div>
                </div>

                {/* Line 3: Risk Score & Action */}
                <div className="flex items-center justify-between pt-1 border-t border-slate-800/40">
                  <div className="flex items-center gap-2">
                    <div className={`px-2 py-0.5 rounded text-xs font-bold font-mono-numbers flex items-center gap-1 ${
                      tx.riskScore >= 90
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                        : tx.riskScore >= 70
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${
                        tx.riskScore >= 75 ? 'bg-rose-500' : 'bg-emerald-500'
                      }`} />
                      Risk: {tx.riskScore}%
                    </div>

                    <span className="text-[11px] text-slate-500 hidden sm:inline">
                      Approver: {tx.approverName}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onInvestigate(tx);
                      }}
                      className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold text-rose-300 bg-rose-950/60 hover:bg-rose-900/60 border border-rose-800/50 rounded transition-colors"
                      title="Generate AI evidence-based investigation report"
                    >
                      <Sparkles className="w-3 h-3 text-rose-400" />
                      <span>Investigate Anomaly</span>
                    </button>
                    <ChevronRight className="w-4 h-4 text-slate-500" />
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
