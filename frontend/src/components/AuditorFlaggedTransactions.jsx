import React, { useState } from 'react';
import { 
  ShieldAlert, 
  Search, 
  Filter, 
  Scale, 
  Eye, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowRight,
  Clock,
  ArrowUpRight
} from 'lucide-react';

const INITIAL_FLAGGED_TRANSACTIONS = [
  {
    id: 'TX1025',
    vendor: 'ABC Computers',
    vendorId: 'VEND-ABC-01',
    po: 'PO1025',
    invoice: 'INV1025',
    amount: '₹8,00,000',
    numericAmount: 800000,
    riskScore: 87,
    riskLevel: 'HIGH',
    detectedIssues: 'PO–Invoice amount mismatch (+₹1,50,000 variance)',
    investigationStatus: 'FLAGGED',
    date: '25-09-2026'
  },
  {
    id: 'TX1020',
    vendor: 'Apex Heavy Dynamics Pvt Ltd',
    vendorId: 'VEND-APEX-03',
    po: 'PO1020',
    invoice: 'INV1020',
    amount: '₹1,85,000',
    numericAmount: 185000,
    riskScore: 94,
    riskLevel: 'HIGH',
    detectedIssues: 'Extreme Price Spike (+270% over 6-quarter baseline)',
    investigationStatus: 'UNDER_REVIEW',
    date: '20-09-2026'
  },
  {
    id: 'TX1014',
    vendor: 'Kinetic Hardware Hub',
    vendorId: 'VEND-KINETIC-04',
    po: 'PO1014',
    invoice: 'INV1014',
    amount: '₹4,95,000',
    numericAmount: 495000,
    riskScore: 68,
    riskLevel: 'MEDIUM',
    detectedIssues: 'Tender limit threshold structuring (₹4.95L vs ₹5L threshold)',
    investigationStatus: 'FLAGGED',
    date: '18-09-2026'
  },
  {
    id: 'TX1008',
    vendor: 'Delta Logistics Network',
    vendorId: 'VEND-DELTA-05',
    po: 'PO1008',
    invoice: 'INV1008',
    amount: '₹3,20,000',
    numericAmount: 320000,
    riskScore: 55,
    riskLevel: 'MEDIUM',
    detectedIssues: 'Near-duplicate invoice hash detected with past billing',
    investigationStatus: 'UNDER_REVIEW',
    date: '15-09-2026'
  },
  {
    id: 'TX1002',
    vendor: 'Global Peripherals Corp',
    vendorId: 'VEND-GLOB-06',
    po: 'PO1002',
    invoice: 'INV1002',
    amount: '₹1,50,000',
    numericAmount: 150000,
    riskScore: 35,
    riskLevel: 'LOW',
    detectedIssues: 'Minor quantity variance in GRN inspection report',
    investigationStatus: 'INVESTIGATED',
    date: '10-09-2026'
  }
];

export const AuditorFlaggedTransactions = ({ onOpenInvestigation }) => {
  const [transactions, setTransactions] = useState(INITIAL_FLAGGED_TRANSACTIONS);
  const [searchQuery, setSearchQuery] = useState('');
  const [riskFilter, setRiskFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const filteredTxns = transactions.filter(tx => {
    const matchesSearch = tx.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          tx.vendor.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          tx.po.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          tx.invoice.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          tx.detectedIssues.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRisk = riskFilter === 'ALL' || tx.riskLevel === riskFilter;
    const matchesStatus = statusFilter === 'ALL' || tx.investigationStatus === statusFilter;
    return matchesSearch && matchesRisk && matchesStatus;
  });

  return (
    <div className="space-y-6">
      
      {/* Banner */}
      <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded text-[10px] font-mono-numbers font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
              AUDITLENS WORKBENCH
            </span>
            <span className="text-xs text-slate-400">· 86 Anomaly Flagged Transactions</span>
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">
            Flagged Transactions Investigation Queue
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Select any flagged transaction to launch the deep forensic inspection suite, view PO vs Invoice discrepancies, examine vendor baselines, and submit final auditor resolutions.
          </p>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search TX ID, vendor, PO, invoice, detected anomaly..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-rose-500 pl-9 font-mono-numbers"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={riskFilter}
            onChange={(e) => setRiskFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-rose-500 font-mono-numbers"
          >
            <option value="ALL">All Risk Levels</option>
            <option value="HIGH">HIGH RISK</option>
            <option value="MEDIUM">MEDIUM RISK</option>
            <option value="LOW">LOW RISK</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-rose-500 font-mono-numbers"
          >
            <option value="ALL">All Statuses</option>
            <option value="FLAGGED">FLAGGED</option>
            <option value="UNDER_REVIEW">UNDER_REVIEW</option>
            <option value="INVESTIGATED">INVESTIGATED</option>
            <option value="RESOLVED">RESOLVED</option>
            <option value="ESCALATED">ESCALATED</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400 font-mono-numbers uppercase text-[10px]">
                <th className="py-3 px-4">Transaction ID</th>
                <th className="py-3 px-4">Vendor</th>
                <th className="py-3 px-4">PO Link</th>
                <th className="py-3 px-4">Invoice Link</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Risk Score</th>
                <th className="py-3 px-4">Detected Issues</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredTxns.map((tx) => (
                <tr 
                  key={tx.id} 
                  onClick={() => onOpenInvestigation(tx)}
                  className="hover:bg-slate-800/60 transition-colors cursor-pointer group"
                >
                  <td className="py-3.5 px-4 font-mono-numbers font-bold text-white">
                    <div className="flex items-center gap-1.5">
                      <ShieldAlert className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                      <span className="group-hover:text-rose-300 transition-colors">{tx.id}</span>
                      {tx.id === 'TX1025' && (
                        <span className="text-[9px] px-1.5 py-0.2 rounded bg-rose-500/20 text-rose-300 font-normal">
                          Target
                        </span>
                      )}
                    </div>
                  </td>

                  <td className="py-3.5 px-4 font-semibold text-slate-200">
                    {tx.vendor}
                  </td>

                  <td className="py-3.5 px-4 font-mono-numbers font-bold text-blue-400">
                    #{tx.po}
                  </td>

                  <td className="py-3.5 px-4 font-mono-numbers font-bold text-amber-400">
                    #{tx.invoice}
                  </td>

                  <td className="py-3.5 px-4 font-mono-numbers font-bold text-white">
                    {tx.amount}
                  </td>

                  <td className="py-3.5 px-4">
                    <span className={`px-2 py-0.5 rounded font-mono-numbers font-bold text-[10px] border ${
                      tx.riskLevel === 'HIGH' ? 'bg-rose-500/20 text-rose-300 border-rose-500/30' :
                      tx.riskLevel === 'MEDIUM' ? 'bg-amber-500/20 text-amber-300 border-amber-500/30' :
                      'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                    }`}>
                      {tx.riskScore}/100 · {tx.riskLevel}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-slate-300 text-[11px] max-w-xs">
                    {tx.detectedIssues}
                  </td>

                  <td className="py-3.5 px-4 font-mono-numbers">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                      tx.investigationStatus === 'FLAGGED' ? 'bg-rose-500/10 text-rose-400 border-rose-500/30' :
                      tx.investigationStatus === 'UNDER_REVIEW' ? 'bg-amber-500/10 text-amber-400 border-amber-500/30' :
                      'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                    }`}>
                      {tx.investigationStatus}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 font-mono-numbers text-slate-400">
                    {tx.date}
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenInvestigation(tx);
                      }}
                      className="px-3 py-1 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-bold transition-all shadow-md flex items-center gap-1 ml-auto cursor-pointer"
                    >
                      <Scale className="w-3.5 h-3.5" />
                      <span>Investigate</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
