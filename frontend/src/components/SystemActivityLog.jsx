import React, { useState } from 'react';
import { 
  Activity, 
  Search, 
  Filter, 
  Building2, 
  FileText, 
  Receipt, 
  ArrowLeftRight, 
  ShieldAlert, 
  Users, 
  ArrowUpRight, 
  CheckCircle2,
  Clock
} from 'lucide-react';

const INITIAL_ACTIVITY_LOGS = [
  { id: 'ACT-001', time: '10:32 AM', date: '25-09-2026', actor: 'Procurement Manager', role: 'ROLE_PROCUREMENT_MANAGER', action: 'added Vendor ABC Computers', module: 'Vendors', icon: Building2 },
  { id: 'ACT-002', time: '10:41 AM', date: '25-09-2026', actor: 'Procurement Manager', role: 'ROLE_PROCUREMENT_MANAGER', action: 'created PO #1025 for ABC Computers (₹6,50,000)', module: 'Purchase Orders', icon: FileText },
  { id: 'ACT-003', time: '11:05 AM', date: '25-09-2026', actor: 'Auditor', role: 'ROLE_AUDITOR', action: 'opened Investigation #501 on Transaction #TX1025', module: 'Investigation', icon: ShieldAlert },
  { id: 'ACT-004', time: '11:20 AM', date: '25-09-2026', actor: 'Auditor', role: 'ROLE_AUDITOR', action: 'escalated Transaction #TX102 (PO-Invoice Mismatch)', module: 'Investigation', icon: ArrowUpRight },
  { id: 'ACT-005', time: '11:45 AM', date: '25-09-2026', actor: 'System Administrator', role: 'ROLE_ADMIN', action: 'updated role permissions for Rahul (Procurement Manager)', module: 'Users', icon: Users },
  { id: 'ACT-006', time: '12:10 PM', date: '25-09-2026', actor: 'Procurement Manager', role: 'ROLE_PROCUREMENT_MANAGER', action: 'uploaded Invoice #INV1025 linked to PO #PO1025', module: 'Invoices', icon: Receipt },
  { id: 'ACT-007', time: '12:15 PM', date: '25-09-2026', actor: 'Procurement Manager', role: 'ROLE_PROCUREMENT_MANAGER', action: 'submitted Transaction #TX1025 for AI analysis', module: 'Transactions', icon: ArrowLeftRight },
  { id: 'ACT-008', time: '12:30 PM', date: '25-09-2026', actor: 'AI Forensic Engine', role: 'ROLE_ADMIN', action: 'flagged Transaction #TX1025 (Risk Score 87/100, PO-Invoice mismatch)', module: 'AI Analysis', icon: ShieldAlert },
  { id: 'ACT-009', time: '01:15 PM', date: '25-09-2026', actor: 'Auditor', role: 'ROLE_AUDITOR', action: 'added investigation notes for #TX1025: "Vendor confirmed revised pricing"', module: 'Investigation', icon: ShieldAlert },
  { id: 'ACT-010', time: '02:00 PM', date: '25-09-2026', actor: 'Auditor', role: 'ROLE_AUDITOR', action: 'resolved Transaction #TX1019 with verified pricing justification', module: 'Investigation', icon: CheckCircle2 }
];

export const SystemActivityLog = ({ currentUser }) => {
  const [logs] = useState(INITIAL_ACTIVITY_LOGS);
  const [searchQuery, setSearchQuery] = useState('');
  const [moduleFilter, setModuleFilter] = useState('ALL');

  // Filter based on user role permissions:
  // Admin sees all
  // Procurement Manager sees own procurement activity
  // Auditor sees own investigation activity
  const roleLogs = logs.filter(l => {
    if (currentUser?.role === 'ROLE_ADMIN') return true;
    if (currentUser?.role === 'ROLE_PROCUREMENT_MANAGER') {
      return l.role === 'ROLE_PROCUREMENT_MANAGER' || l.module === 'Vendors' || l.module === 'Purchase Orders' || l.module === 'Invoices' || l.module === 'Transactions';
    }
    if (currentUser?.role === 'ROLE_AUDITOR') {
      return l.role === 'ROLE_AUDITOR' || l.module === 'Investigation' || l.module === 'AI Analysis';
    }
    return true;
  });

  const filteredLogs = roleLogs.filter(l => {
    const matchesSearch = l.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          l.actor.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          l.module.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesModule = moduleFilter === 'ALL' || l.module === moduleFilter;
    return matchesSearch && matchesModule;
  });

  const getActorBadge = (role) => {
    switch (role) {
      case 'ROLE_ADMIN':
        return 'bg-rose-500/10 text-rose-300 border-rose-500/30';
      case 'ROLE_PROCUREMENT_MANAGER':
        return 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30';
      case 'ROLE_AUDITOR':
        return 'bg-amber-500/10 text-amber-300 border-amber-500/30';
      default:
        return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Banner */}
      <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded text-[10px] font-mono-numbers font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
              ACTIVITY LOGS
            </span>
            <span className="text-xs text-slate-400">· Chronological Audit Trail</span>
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">
            System Activity &amp; Audit Logs
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Immutable tracking of organizational actions: vendor additions, purchase orders, invoice linking, AI flag generation, and auditor decisions.
          </p>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search action, user, module..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 pl-9 font-mono-numbers"
          />
        </div>

        <select
          value={moduleFilter}
          onChange={(e) => setModuleFilter(e.target.value)}
          className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-cyan-500"
        >
          <option value="ALL">All Modules</option>
          <option value="Vendors">Vendors</option>
          <option value="Purchase Orders">Purchase Orders</option>
          <option value="Invoices">Invoices</option>
          <option value="Transactions">Transactions</option>
          <option value="Investigation">Investigation</option>
          <option value="Users">Users</option>
        </select>
      </div>

      {/* Activity Timeline List */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 space-y-3">
        {filteredLogs.map((log) => {
          const Icon = log.icon;
          return (
            <div key={log.id} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80 flex items-start justify-between gap-4 hover:border-slate-700 transition-colors">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-300 shrink-0 mt-0.5">
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white text-xs">{log.actor}</span>
                    <span className={`text-[9px] font-mono-numbers font-bold px-1.5 py-0.2 rounded border ${getActorBadge(log.role)}`}>
                      {log.role ? log.role.replace('ROLE_', '') : 'SYSTEM'}
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono-numbers">
                      in {log.module}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 mt-1">
                    {log.action}
                  </p>
                </div>
              </div>

              <div className="text-right shrink-0">
                <span className="text-xs font-mono-numbers font-bold text-slate-300 block">
                  {log.time}
                </span>
                <span className="text-[10px] text-slate-500 font-mono-numbers">
                  {log.date}
                </span>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
