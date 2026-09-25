import React from 'react';
import { 
  ShieldAlert, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowUpRight, 
  Scale, 
  Search, 
  Filter, 
  Clock, 
  ArrowRight,
  TrendingUp,
  FileCheck2,
  PieChart
} from 'lucide-react';

export const AuditorDashboard = ({ onNavigateTab, onOpenInvestigation, currentUser }) => {
  // Exact numbers from prompt:
  // Flagged Transactions: 86, New Investigations: 24, Under Review: 31, Resolved: 42, Escalated: 13
  // Risk: HIGH RISK 18, MEDIUM RISK 37, LOW RISK 31
  const stats = [
    { label: 'Flagged Transactions', value: '86', sub: 'Total anomaly alerts', icon: ShieldAlert, color: 'text-rose-400', bg: 'bg-rose-500/10 border-rose-500/20' },
    { label: 'New Investigations', value: '24', sub: 'Unassigned queue', icon: AlertTriangle, color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20' },
    { label: 'Under Review', value: '31', sub: 'Active forensic analysis', icon: Clock, color: 'text-purple-400', bg: 'bg-purple-500/10 border-purple-500/20' },
    { label: 'Resolved', value: '42', sub: 'Valid justification verified', icon: CheckCircle2, color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' },
    { label: 'Escalated', value: '13', sub: 'CFO & vigilance referral', icon: ArrowUpRight, color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/20' },
  ];

  const priorityInvestigations = [
    {
      id: 'TX1025',
      vendor: 'ABC Computers',
      po: 'PO1025',
      invoice: 'INV1025',
      amount: '₹8,00,000',
      riskScore: 87,
      riskLevel: 'HIGH',
      issues: 'PO–Invoice mismatch (Billed ₹8,00,000 vs PO ₹6,50,000)',
      status: 'UNDER_REVIEW',
      date: '25-09-2026'
    },
    {
      id: 'TX1020',
      vendor: 'Apex Heavy Dynamics Pvt Ltd',
      po: 'PO1020',
      invoice: 'INV1020',
      amount: '₹1,85,000',
      riskScore: 94,
      riskLevel: 'HIGH',
      issues: 'Price spike (+270% over 6-quarter baseline of ₹50,000)',
      status: 'UNDER_REVIEW',
      date: '20-09-2026'
    },
    {
      id: 'TX1014',
      vendor: 'Kinetic Hardware Hub',
      po: 'PO1014',
      invoice: 'INV1014',
      amount: '₹4,95,000',
      riskScore: 68,
      riskLevel: 'MEDIUM',
      issues: 'Tender limit avoidance structuring (Under ₹5L threshold)',
      status: 'FLAGGED',
      date: '18-09-2026'
    },
    {
      id: 'TX1008',
      vendor: 'Delta Logistics Network',
      po: 'PO1008',
      invoice: 'INV1008',
      amount: '₹3,20,000',
      riskScore: 55,
      riskLevel: 'MEDIUM',
      issues: 'Near-duplicate invoice hash detected with INV-9982',
      status: 'FLAGGED',
      date: '15-09-2026'
    }
  ];

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded text-[10px] font-mono-numbers font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
              AUDITOR DASHBOARD
            </span>
            <span className="text-xs text-slate-400">· Forensic Investigation Command</span>
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">
            AuditLens Forensic Investigation Suite
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Examine AI-detected anomaly signals, execute side-by-side PO vs Invoice difference comparisons, verify vendor transaction baselines, attach investigation notes, and resolve or escalate.
          </p>
        </div>

        <button
          onClick={() => onNavigateTab('FLAGGED_TRANSACTIONS')}
          className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-all flex items-center gap-2 shadow-lg shadow-rose-950/60 cursor-pointer self-start sm:self-auto"
        >
          <ShieldAlert className="w-4 h-4" />
          <span>View All Flagged Queue</span>
        </button>
      </div>

      {/* Row 1: Key Investigation Pipeline Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
        {stats.map((st) => {
          const Icon = st.icon;
          return (
            <div key={st.label} className={`p-4 rounded-xl border ${st.bg}`}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-slate-300">{st.label}</span>
                <Icon className={`w-4 h-4 ${st.color}`} />
              </div>
              <div className="text-2xl font-extrabold text-white font-mono-numbers">
                {st.value}
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5">
                {st.sub}
              </div>
            </div>
          );
        })}
      </div>

      {/* Row 2: Risk Breakdown Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-between">
          <div>
            <div className="text-xs font-bold text-rose-400 uppercase tracking-wider font-mono-numbers">
              HIGH RISK
            </div>
            <div className="text-2xl font-extrabold text-white font-mono-numbers mt-1">18 Cases</div>
            <div className="text-[10px] text-rose-300 mt-0.5">Score 75–100 · Priority Attention</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-rose-500/20 text-rose-300 flex items-center justify-center font-bold font-mono-numbers">
            21%
          </div>
        </div>

        <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between">
          <div>
            <div className="text-xs font-bold text-amber-400 uppercase tracking-wider font-mono-numbers">
              MEDIUM RISK
            </div>
            <div className="text-2xl font-extrabold text-white font-mono-numbers mt-1">37 Cases</div>
            <div className="text-[10px] text-amber-300 mt-0.5">Score 40–74 · Variance Verification</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-300 flex items-center justify-center font-bold font-mono-numbers">
            43%
          </div>
        </div>

        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between">
          <div>
            <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider font-mono-numbers">
              LOW RISK
            </div>
            <div className="text-2xl font-extrabold text-white font-mono-numbers mt-1">31 Cases</div>
            <div className="text-[10px] text-emerald-300 mt-0.5">Score 0–39 · Routine Baseline</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center font-bold font-mono-numbers">
            36%
          </div>
        </div>

      </div>

      {/* Row 3: Priority Investigations Table */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 overflow-hidden shadow-xl">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Scale className="w-4 h-4 text-amber-400" />
              <span>Priority Flagged Investigations</span>
            </h3>
            <p className="text-[11px] text-slate-400 mt-0.5">
              High-confidence signals requiring immediate auditor examination before payment release.
            </p>
          </div>
          <button
            onClick={() => onNavigateTab('FLAGGED_TRANSACTIONS')}
            className="text-xs text-amber-400 hover:text-amber-300 font-semibold"
          >
            View All 86 Alerts →
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400 font-mono-numbers uppercase text-[10px]">
                <th className="py-3 px-4">Transaction ID</th>
                <th className="py-3 px-4">Vendor</th>
                <th className="py-3 px-4">PO / Invoice</th>
                <th className="py-3 px-4">Disbursement Amount</th>
                <th className="py-3 px-4">Risk Score</th>
                <th className="py-3 px-4">Detected Signals</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {priorityInvestigations.map((inv) => (
                <tr key={inv.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-4 font-mono-numbers font-bold text-white">
                    <div className="flex items-center gap-1.5">
                      <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
                      <span>{inv.id}</span>
                      {inv.id === 'TX1025' && (
                        <span className="text-[9px] px-1.5 py-0.2 rounded bg-rose-500/20 text-rose-300 font-normal">
                          Active Target
                        </span>
                      )}
                    </div>
                  </td>

                  <td className="py-3 px-4 font-semibold text-slate-200">
                    {inv.vendor}
                  </td>

                  <td className="py-3 px-4 font-mono-numbers text-[11px]">
                    <span className="text-blue-400 font-bold">#{inv.po}</span>
                    <span className="text-slate-500 mx-1">/</span>
                    <span className="text-amber-400 font-bold">#{inv.invoice}</span>
                  </td>

                  <td className="py-3 px-4 font-mono-numbers font-bold text-white">
                    {inv.amount}
                  </td>

                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded font-mono-numbers font-bold text-[10px] bg-rose-500/20 text-rose-300 border border-rose-500/30">
                      {inv.riskScore}/100 · {inv.riskLevel}
                    </span>
                  </td>

                  <td className="py-3 px-4 text-slate-300 text-[11px]">
                    {inv.issues}
                  </td>

                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold border bg-amber-500/10 text-amber-400 border-amber-500/30 font-mono-numbers">
                      {inv.status}
                    </span>
                  </td>

                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => onOpenInvestigation(inv)}
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
