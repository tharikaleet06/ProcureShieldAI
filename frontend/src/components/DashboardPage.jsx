import React from 'react';
import { StatsOverview } from './StatsOverview';
import { HistoricalPriceChart } from './HistoricalPriceChart';
import { 
  ShieldAlert, 
  IndianRupee, 
  TrendingUp, 
  Split, 
  Copy, 
  Building2, 
  PlusCircle, 
  ArrowRight,
  FileCheck2,
  AlertTriangle,
  Lock,
  UploadCloud
} from 'lucide-react';

export const DashboardPage = ({ 
  stats, 
  transactions, 
  onNavigateTab, 
  onSelectTransaction,
  currentUser 
}) => {
  const criticalTxs = transactions.filter(t => t.riskScore >= 75);
  const topCanonical = transactions.find(t => t.id === 'TXN-2026-9021') || transactions[0];

  return (
    <div className="space-y-6 max-w-7xl mx-auto py-2">
      
      {/* Top Banner Greeting */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-2xl bg-slate-900/80 border border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold font-mono-numbers bg-rose-500/10 text-rose-400 border border-rose-500/30 uppercase">
              {currentUser?.roleTitle || 'Executive Portal'}
            </span>
            <span className="text-xs text-slate-500">{currentUser?.department || 'SIU'}</span>
          </div>
          <h2 className="text-xl font-extrabold text-white mt-1">
            Welcome back, {currentUser?.name || 'Investigator'}
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            ProcureLens continuously monitors all purchase vouchers against 6-quarter baselines &amp; statutory rules.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigateTab('UPLOAD')}
            className="px-4 py-2.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-rose-950/60 flex items-center gap-2"
          >
            <UploadCloud className="w-4 h-4" />
            <span>Upload New Invoice</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Overview Cards */}
      <StatsOverview stats={stats} />

      {/* 2-Column Dashboard Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Top Risk Alerts & Anomaly Distribution (7 cols) */}
        <div className="lg:col-span-7 space-y-5">
          
          {/* Critical Risk Invoices List */}
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-rose-400" />
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                  Critical Anomaly Alerts ({criticalTxs.length})
                </h3>
              </div>
              <button
                onClick={() => onNavigateTab('INVOICES')}
                className="text-xs font-semibold text-rose-400 hover:text-rose-300 flex items-center gap-1"
              >
                <span>View All Invoices</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-2.5">
              {criticalTxs.slice(0, 4).map((tx) => (
                <div
                  key={tx.id}
                  onClick={() => {
                    onSelectTransaction(tx);
                    onNavigateTab('INVOICES');
                  }}
                  className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/90 hover:border-rose-500/50 cursor-pointer transition-all flex items-center justify-between group"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-extrabold text-white font-mono-numbers">
                        {tx.invoiceNumber}
                      </span>
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/30">
                        {tx.anomalyType.replace('_', ' ')}
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 font-medium">{tx.itemDescription}</p>
                    <p className="text-[11px] text-slate-500">{tx.vendorName} · {tx.department}</p>
                  </div>

                  <div className="text-right">
                    <span className="text-xs font-bold text-rose-400 block font-mono-numbers">
                      ₹{tx.totalAmount.toLocaleString('en-IN')}
                    </span>
                    <span className="text-[11px] font-bold text-rose-500 font-mono-numbers">
                      Risk {tx.riskScore}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Anomaly Distribution Grid */}
          {stats && stats.anomalyDistribution && (
            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
              <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Audited Anomaly Distribution Breakdown
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {Object.entries(stats.anomalyDistribution).map(([key, count]) => (
                  <div key={key} className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="text-[10px] text-slate-400 block font-mono-numbers font-bold">
                      {key.replace('_', ' ')}
                    </span>
                    <span className="text-lg font-extrabold text-white font-mono-numbers mt-0.5 block">
                      {count}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Right Column: Historical Baseline Visualizer (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          {topCanonical && (
            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-rose-400" />
                  Baseline Price Variance Chart
                </h3>
                <span className="text-[10px] text-rose-400 font-bold font-mono-numbers">+270% Spike</span>
              </div>
              
              <HistoricalPriceChart 
                historicalData={topCanonical.historicalPurchases || []}
                currentUnitPrice={topCanonical.unitPrice}
                currentInvoiceNo={topCanonical.invoiceNumber}
                baselinePrice={topCanonical.historicalBaselinePrice}
                itemDescription={topCanonical.itemDescription}
              />
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
