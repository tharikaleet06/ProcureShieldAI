import React, { useState } from 'react';
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
  PieChart,
  BrainCircuit,
  Layers,
  Sparkles,
  FileText,
  Activity,
  History,
  ShieldCheck,
  Building2,
  ExternalLink
} from 'lucide-react';

export const AuditorDashboard = ({ onNavigateTab, onOpenInvestigation, currentUser }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [riskFilter, setRiskFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');

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
    },
    {
      id: 'TX0994',
      vendor: 'Zenith Tech Solutions Pvt Ltd',
      po: 'PO0994',
      invoice: 'INV0994',
      amount: '₹6,75,000',
      riskScore: 78,
      riskLevel: 'HIGH',
      issues: 'Historical price outlier (+45% above category index)',
      status: 'UNDER_REVIEW',
      date: '12-09-2026'
    }
  ];

  const recentAuditorActions = [
    { id: 'ACT-501', time: '10:45 AM', auditor: 'Vikramaditya Sen', action: 'Attached vendor confirmation notes to Case #TX1025', status: 'NOTE_ADDED', type: 'note' },
    { id: 'ACT-500', time: '09:30 AM', auditor: 'Ananya Deshmukh', action: 'Resolved Case #TX1019: Verified authorized discount schedule', status: 'RESOLVED', type: 'resolve' },
    { id: 'ACT-499', time: 'Yesterday', auditor: 'Vikramaditya Sen', action: 'Escalated Case #TX1002 to CFO: Potential duplicate invoice match', status: 'ESCALATED', type: 'escalate' },
    { id: 'ACT-498', time: 'Yesterday', auditor: 'Rohan Kulkarni', action: 'Generated quarterly statutory procurement compliance report', status: 'REPORT_GENERATED', type: 'report' }
  ];

  const filteredInvestigations = priorityInvestigations.filter(item => {
    const matchesSearch = item.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.vendor.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.po.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.invoice.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.issues.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRisk = riskFilter === 'ALL' || item.riskLevel === riskFilter;
    const matchesStatus = statusFilter === 'ALL' || item.status === statusFilter;
    return matchesSearch && matchesRisk && matchesStatus;
  });

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
            Investigate AI-flagged transactions, review risk scores &amp; statistical anomalies, compare PO vs invoice differences, examine RAG explanations, and resolve or escalate cases.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigateTab('REPORTS')}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <FileCheck2 className="w-4 h-4 text-purple-400" />
            <span>Audit Reports</span>
          </button>

          <button
            onClick={() => onNavigateTab('FLAGGED_TRANSACTIONS')}
            className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-all flex items-center gap-2 shadow-lg shadow-rose-950/60 cursor-pointer self-start sm:self-auto"
          >
            <ShieldAlert className="w-4 h-4" />
            <span>Flagged Queue (86)</span>
          </button>
        </div>
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

      {/* Row 2: Risk Breakdown & Investigation Workflow Progress */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        
        {/* Risk Distribution Cards */}
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-3.5">
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
              <div className="text-[10px] text-amber-300 mt-0.5">Score 40–74 · Price Discrepancies</div>
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

        {/* Case Clearance Velocity Widget */}
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              <span>Case Resolution Rate</span>
            </span>
            <span className="text-xs font-bold font-mono-numbers text-emerald-400">76.3%</span>
          </div>

          <div className="my-2">
            <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden flex">
              <div className="bg-emerald-500 h-2" style={{ width: '49%' }} title="Resolved (42)" />
              <div className="bg-rose-500 h-2" style={{ width: '15%' }} title="Escalated (13)" />
              <div className="bg-amber-500 h-2" style={{ width: '36%' }} title="Active Review (31)" />
            </div>
            <div className="flex items-center justify-between text-[10px] text-slate-400 mt-1 font-mono-numbers">
              <span className="text-emerald-400">● 42 Resolved</span>
              <span className="text-amber-400">● 31 In Review</span>
              <span className="text-rose-400">● 13 Escalated</span>
            </div>
          </div>

          <div className="text-[10px] text-slate-500 font-mono-numbers">
            Avg Turnaround: 4.2 hrs per high-risk case
          </div>
        </div>

      </div>

      {/* Row 3: Priority Investigations Table with Filter Controls */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 overflow-hidden shadow-xl">
        <div className="p-4 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Scale className="w-4 h-4 text-amber-400" />
              <span>Priority Flagged Investigations</span>
            </h3>
            <p className="text-[11px] text-slate-400 mt-0.5">
              High-confidence signals requiring immediate forensic auditor examination before payment disbursement.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search vendor, case, PO..."
                className="bg-slate-950 border border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 font-mono-numbers"
              />
            </div>

            <select
              value={riskFilter}
              onChange={(e) => setRiskFilter(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-amber-500"
            >
              <option value="ALL">All Risk Levels</option>
              <option value="HIGH">High Risk</option>
              <option value="MEDIUM">Medium Risk</option>
              <option value="LOW">Low Risk</option>
            </select>

            <button
              onClick={() => onNavigateTab('FLAGGED_TRANSACTIONS')}
              className="text-xs text-amber-400 hover:text-amber-300 font-semibold px-2 py-1"
            >
              View All 86 Alerts →
            </button>
          </div>
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
              {filteredInvestigations.map((inv) => (
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
                    <span className={`px-2 py-0.5 rounded font-mono-numbers font-bold text-[10px] border ${
                      inv.riskLevel === 'HIGH' ? 'bg-rose-500/20 text-rose-300 border-rose-500/30' : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                    }`}>
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
                      className="px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-bold transition-all shadow-md flex items-center gap-1.5 ml-auto cursor-pointer"
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

      {/* Row 4: Recent Forensic Actions & Audit Trail stream */}
      <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Activity className="w-4 h-4 text-cyan-400" />
            <span>Recent Auditor Findings &amp; Decision Stream</span>
          </h3>
          <button
            onClick={() => onNavigateTab('ACTIVITY_LOGS')}
            className="text-xs text-slate-400 hover:text-white"
          >
            View Full Log →
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {recentAuditorActions.map((act) => (
            <div key={act.id} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-start justify-between gap-3 text-xs">
              <div className="flex items-start gap-2.5">
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                  act.type === 'resolve' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                  act.type === 'escalate' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' :
                  'bg-purple-500/10 text-purple-400 border border-purple-500/20'
                }`}>
                  {act.type === 'resolve' ? <CheckCircle2 className="w-3.5 h-3.5" /> :
                   act.type === 'escalate' ? <ArrowUpRight className="w-3.5 h-3.5" /> :
                   <FileText className="w-3.5 h-3.5" />}
                </div>
                <div>
                  <div className="text-slate-200 font-medium">{act.action}</div>
                  <div className="text-[10px] text-slate-500 font-mono-numbers mt-0.5">
                    By <span className="text-slate-400 font-semibold">{act.auditor}</span> · {act.time}
                  </div>
                </div>
              </div>

              <span className="text-[9px] font-mono-numbers px-1.5 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-800 shrink-0">
                {act.status}
              </span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
