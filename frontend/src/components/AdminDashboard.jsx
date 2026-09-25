import React from 'react';
import { 
  Users, 
  Building2, 
  FileText, 
  Receipt, 
  ArrowLeftRight, 
  ShieldAlert, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowUpRight, 
  Activity,
  PieChart,
  TrendingUp,
  ShieldCheck,
  Clock,
  Layers,
  Search
} from 'lucide-react';

export const AdminDashboard = ({ onNavigateTab, currentUser }) => {
  // Exact numbers specified in user prompt:
  // Users: 25, Vendors: 148, Purchase Orders: 1,240, Invoices: 1,185, Transactions: 1,150
  // Flagged: 86, Under Investigation: 31, Resolved: 42, Escalated: 13
  const coreStats = [
    { label: 'Total Users', value: '25', icon: Users, tab: 'USERS', color: 'text-purple-400', bg: 'bg-purple-500/10 border-purple-500/20' },
    { label: 'Total Vendors', value: '148', icon: Building2, tab: 'VENDORS', color: 'text-cyan-400', bg: 'bg-cyan-500/10 border-cyan-500/20' },
    { label: 'Purchase Orders', value: '1,240', icon: FileText, tab: 'PURCHASE_ORDERS', color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20' },
    { label: 'Total Invoices', value: '1,185', icon: Receipt, tab: 'INVOICES', color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20' },
    { label: 'Transactions', value: '1,150', icon: ArrowLeftRight, tab: 'TRANSACTIONS', color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' },
  ];

  const auditStats = [
    { label: 'Flagged Transactions', value: '86', icon: ShieldAlert, color: 'text-rose-400', bg: 'bg-rose-500/10 border-rose-500/20' },
    { label: 'Under Investigation', value: '31', icon: AlertTriangle, color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20' },
    { label: 'Resolved', value: '42', icon: CheckCircle2, color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' },
    { label: 'Escalated', value: '13', icon: ArrowUpRight, color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/20' },
  ];

  const recentActivity = [
    { time: '10:32 AM', actor: 'Procurement Manager', role: 'PROCUREMENT_MANAGER', action: 'added Vendor ABC Computers', icon: Building2 },
    { time: '10:41 AM', actor: 'Procurement Manager', role: 'PROCUREMENT_MANAGER', action: 'created PO #1025 for ABC Computers (₹6,50,000)', icon: FileText },
    { time: '11:05 AM', actor: 'Auditor', role: 'AUDITOR', action: 'opened Investigation #501 on Transaction #TX1025', icon: ShieldAlert },
    { time: '11:20 AM', actor: 'Auditor', role: 'AUDITOR', action: 'escalated Transaction #TX102 (PO-Invoice Mismatch)', icon: ArrowUpRight },
    { time: '11:45 AM', actor: 'System Administrator', role: 'ADMIN', action: 'updated role permissions for Rahul (Procurement Manager)', icon: Users },
  ];

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded text-[10px] font-mono-numbers font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
              ADMIN DASHBOARD
            </span>
            <span className="text-xs text-slate-400">· System-Level Governance &amp; Oversight</span>
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">
            System Administration &amp; Operations Command
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Centralized monitoring of users, roles, organizational vendors, procurement workflow pipeline, and audit investigation status.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigateTab('USERS')}
            className="px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-md"
          >
            <Users className="w-4 h-4" />
            <span>Manage Users</span>
          </button>
          <button
            onClick={() => onNavigateTab('INVESTIGATIONS')}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition-all flex items-center gap-1.5"
          >
            <ShieldAlert className="w-4 h-4 text-rose-400" />
            <span>Investigations</span>
          </button>
        </div>
      </div>

      {/* Row 1: System Master Volume Metrics */}
      <div>
        <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2 font-mono-numbers">
          <Layers className="w-4 h-4 text-slate-500" />
          <span>Organization Master Ledger Volumes</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
          {coreStats.map((st) => {
            const Icon = st.icon;
            return (
              <button
                key={st.label}
                onClick={() => onNavigateTab(st.tab)}
                className={`p-4 rounded-xl border text-left transition-all hover:scale-[1.02] cursor-pointer ${st.bg}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-slate-400">{st.label}</span>
                  <Icon className={`w-4 h-4 ${st.color}`} />
                </div>
                <div className="text-2xl font-extrabold text-white font-mono-numbers">
                  {st.value}
                </div>
                <div className="text-[10px] text-slate-400 font-mono-numbers mt-1 flex items-center gap-1">
                  <span>View module</span>
                  <ArrowUpRight className="w-3 h-3" />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Row 2: Audit & Investigation Metrics */}
      <div>
        <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2 font-mono-numbers">
          <ShieldAlert className="w-4 h-4 text-rose-500" />
          <span>Audit &amp; Forensic Investigation Pipeline</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
          {auditStats.map((st) => {
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
                <div className="text-[10px] text-slate-400 mt-1">
                  Active in AuditLens
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Row 3: Risk Distribution & System Activity Log */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Overall Risk Distribution Card */}
        <div className="lg:col-span-5 p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <PieChart className="w-4 h-4 text-rose-400" />
              <span>Overall Risk Distribution</span>
            </h3>
            <span className="text-[10px] text-slate-500 font-mono-numbers">86 FLAGGED</span>
          </div>

          <div className="space-y-3">
            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-semibold text-rose-400 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                  HIGH RISK (Score 75–100)
                </span>
                <span className="font-mono-numbers font-bold text-white">18 Cases (21%)</span>
              </div>
              <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-rose-500 rounded-full" style={{ width: '21%' }} />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-semibold text-amber-400 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                  MEDIUM RISK (Score 40–74)
                </span>
                <span className="font-mono-numbers font-bold text-white">37 Cases (43%)</span>
              </div>
              <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-amber-500 rounded-full" style={{ width: '43%' }} />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-semibold text-emerald-400 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  LOW RISK (Score 0–39)
                </span>
                <span className="font-mono-numbers font-bold text-white">31 Cases (36%)</span>
              </div>
              <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full" style={{ width: '36%' }} />
              </div>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-[11px] text-slate-400 space-y-1">
            <div className="font-bold text-slate-200">Continuous Integrity Note:</div>
            <div>
              High risk items automatically trigger Auditor review and ERP payment freeze recommendations before invoice settlement.
            </div>
          </div>
        </div>

        {/* System Activity Log Card */}
        <div className="lg:col-span-7 p-5 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Activity className="w-4 h-4 text-cyan-400" />
                <span>System Activity &amp; Audit Log</span>
              </h3>
              <button
                onClick={() => onNavigateTab('ACTIVITY_LOGS')}
                className="text-[11px] text-cyan-400 hover:text-cyan-300 font-semibold"
              >
                View Full Log →
              </button>
            </div>

            <div className="space-y-2.5">
              {recentActivity.map((act, idx) => {
                const Icon = act.icon;
                return (
                  <div key={idx} className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800/80 flex items-start gap-3 text-xs">
                    <span className="text-[11px] font-mono-numbers text-slate-400 font-bold bg-slate-900 px-2 py-0.5 rounded border border-slate-800 shrink-0">
                      {act.time}
                    </span>
                    <div className="flex-1 min-w-0">
                      <span className="font-bold text-slate-200">{act.actor}</span>
                      <span className="text-slate-400 ml-1.5">{act.action}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-500 font-mono-numbers">
            <span>Tracking immutable system audit events</span>
            <span className="text-emerald-400 font-semibold">● Live Logging Active</span>
          </div>
        </div>

      </div>

    </div>
  );
};
