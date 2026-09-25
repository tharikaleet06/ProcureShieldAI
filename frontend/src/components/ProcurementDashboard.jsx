import React from 'react';
import { 
  Building2, 
  FileText, 
  Receipt, 
  ArrowLeftRight, 
  Clock, 
  AlertCircle, 
  PlusCircle, 
  ArrowRight, 
  CheckCircle2, 
  Sparkles,
  ShoppingBag,
  Cpu,
  Layers
} from 'lucide-react';

export const ProcurementDashboard = ({ onNavigateTab, currentUser }) => {
  // Exact numbers from user prompt:
  // Active Vendors: 148, Purchase Orders: 1,240, Pending POs: 32
  // Invoices: 1,185, Pending Invoices: 18, Transactions: 1,150, Awaiting Analysis: 45
  const stats = [
    { label: 'Active Vendors', value: '148', sub: 'Registered suppliers', icon: Building2, tab: 'VENDORS', color: 'text-cyan-400', bg: 'bg-cyan-500/10 border-cyan-500/20' },
    { label: 'Purchase Orders', value: '1,240', sub: '32 Pending Approval', icon: FileText, tab: 'PURCHASE_ORDERS', color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20' },
    { label: 'Invoices', value: '1,185', sub: '18 Pending Verification', icon: Receipt, tab: 'INVOICES', color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20' },
    { label: 'Transactions', value: '1,150', sub: '45 Awaiting Analysis', icon: ArrowLeftRight, tab: 'TRANSACTIONS', color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' },
  ];

  const recentRecords = [
    { type: 'PO', id: 'PO1025', vendor: 'ABC Computers', date: '25-09-2026', amount: '₹6,50,000', status: 'APPROVED', desc: '10 Desktops & 10 Monitors' },
    { type: 'INVOICE', id: 'INV1025', vendor: 'ABC Computers', date: '25-09-2026', amount: '₹8,00,000', status: 'SUBMITTED', desc: 'Billed against PO #PO1025' },
    { type: 'TXN', id: 'TX1025', vendor: 'ABC Computers', date: '25-09-2026', amount: '₹8,00,000', status: 'FLAGGED', desc: 'AI Analysis: PO-Invoice Mismatch' },
    { type: 'PO', id: 'PO1024', vendor: 'Zenith Tech Solutions', date: '24-09-2026', amount: '₹4,20,000', status: 'COMPLETED', desc: 'Server Rack Components' },
    { type: 'INVOICE', id: 'INV1024', vendor: 'Zenith Tech Solutions', date: '24-09-2026', amount: '₹4,20,000', status: 'APPROVED', desc: '3-Way Match Verified' }
  ];

  return (
    <div className="space-y-6">
      
      {/* Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded text-[10px] font-mono-numbers font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
              PROCUREMENT DASHBOARD
            </span>
            <span className="text-xs text-slate-400">· Workflow Management</span>
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">
            Procurement Operations Hub
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Manage the complete procurement lifecycle: maintain vendors, issue purchase orders, link invoices, track transactions, and submit for automated AI analysis.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => onNavigateTab('PURCHASE_ORDERS')}
            className="px-3.5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-md cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Create PO</span>
          </button>
          <button
            onClick={() => onNavigateTab('INVOICES')}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Receipt className="w-4 h-4 text-amber-400" />
            <span>Add Invoice</span>
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((st) => {
          const Icon = st.icon;
          return (
            <button
              key={st.label}
              onClick={() => onNavigateTab(st.tab)}
              className={`p-5 rounded-2xl border text-left transition-all hover:scale-[1.02] cursor-pointer ${st.bg}`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-slate-300">{st.label}</span>
                <Icon className={`w-5 h-5 ${st.color}`} />
              </div>
              <div className="text-3xl font-extrabold text-white font-mono-numbers">
                {st.value}
              </div>
              <div className="text-[11px] text-slate-400 mt-1 font-mono-numbers">
                {st.sub}
              </div>
            </button>
          );
        })}
      </div>

      {/* Workflow Pipeline Diagram */}
      <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Layers className="w-4 h-4 text-cyan-400" />
            <span>Standard Procurement Pipeline</span>
          </h3>
          <span className="text-[10px] text-slate-400 font-mono-numbers">Relational Integrity Maintained</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 items-center">
          
          <button
            onClick={() => onNavigateTab('VENDORS')}
            className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-cyan-500/40 text-left transition-colors cursor-pointer group"
          >
            <div className="text-[10px] font-mono-numbers text-cyan-400 font-bold mb-1">STEP 1</div>
            <div className="text-xs font-bold text-white group-hover:text-cyan-300">1. Vendor</div>
            <div className="text-[10px] text-slate-400 mt-0.5">Register &amp; maintain KYC</div>
          </button>

          <div className="hidden md:flex justify-center text-slate-600">
            <ArrowRight className="w-4 h-4" />
          </div>

          <button
            onClick={() => onNavigateTab('PURCHASE_ORDERS')}
            className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-blue-500/40 text-left transition-colors cursor-pointer group"
          >
            <div className="text-[10px] font-mono-numbers text-blue-400 font-bold mb-1">STEP 2</div>
            <div className="text-xs font-bold text-white group-hover:text-blue-300">2. Purchase Order</div>
            <div className="text-[10px] text-slate-400 mt-0.5">Create PO with item prices</div>
          </button>

          <div className="hidden md:flex justify-center text-slate-600">
            <ArrowRight className="w-4 h-4" />
          </div>

          <button
            onClick={() => onNavigateTab('INVOICES')}
            className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-amber-500/40 text-left transition-colors cursor-pointer group"
          >
            <div className="text-[10px] font-mono-numbers text-amber-400 font-bold mb-1">STEP 3</div>
            <div className="text-xs font-bold text-white group-hover:text-amber-300">3. Invoice</div>
            <div className="text-[10px] text-slate-400 mt-0.5">Link billing data to PO</div>
          </button>

        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2 border-t border-slate-800/80">
          <button
            onClick={() => onNavigateTab('TRANSACTIONS')}
            className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-emerald-500/40 text-left transition-colors cursor-pointer group"
          >
            <div className="text-[10px] font-mono-numbers text-emerald-400 font-bold mb-1">STEP 4</div>
            <div className="text-xs font-bold text-white group-hover:text-emerald-300">4. Transaction</div>
            <div className="text-[10px] text-slate-400 mt-0.5">Record payment amount</div>
          </button>

          <div className="p-3.5 rounded-xl bg-slate-950 border border-purple-500/30 text-left">
            <div className="text-[10px] font-mono-numbers text-purple-400 font-bold mb-1">STEP 5</div>
            <div className="text-xs font-bold text-white flex items-center gap-1.5">
              <span>5. Submit for Analysis</span>
              <Cpu className="w-3.5 h-3.5 text-purple-400" />
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">AI checks signals &amp; flags to Auditor</div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/60 text-left">
            <div className="text-[10px] font-mono-numbers text-slate-500 font-bold mb-1">AUDIT STAGE</div>
            <div className="text-xs font-bold text-slate-300">Auditor Investigation</div>
            <div className="text-[10px] text-slate-400 mt-0.5">Auditor investigates flagged cases</div>
          </div>
        </div>
      </div>

      {/* Recently Added Procurement Records */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 overflow-hidden shadow-xl">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <FileText className="w-4 h-4 text-cyan-400" />
            <span>Recently Added Procurement Records</span>
          </h3>
          <span className="text-xs text-slate-400 font-mono-numbers">Live Updates</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400 font-mono-numbers uppercase text-[10px]">
                <th className="py-3 px-4">Record Type</th>
                <th className="py-3 px-4">Identifier</th>
                <th className="py-3 px-4">Vendor</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {recentRecords.map((rec, idx) => (
                <tr key={idx} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-4 font-mono-numbers">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                      rec.type === 'PO' ? 'bg-blue-500/10 text-blue-300 border-blue-500/30' :
                      rec.type === 'INVOICE' ? 'bg-amber-500/10 text-amber-300 border-amber-500/30' :
                      'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                    }`}>
                      {rec.type}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-mono-numbers font-bold text-white">
                    {rec.id}
                  </td>
                  <td className="py-3 px-4 font-semibold text-slate-200">
                    {rec.vendor}
                  </td>
                  <td className="py-3 px-4 font-mono-numbers font-bold text-white">
                    {rec.amount}
                  </td>
                  <td className="py-3 px-4 font-mono-numbers text-slate-400">
                    {rec.date}
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                      rec.status === 'APPROVED' || rec.status === 'COMPLETED' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' :
                      rec.status === 'FLAGGED' ? 'bg-rose-500/10 text-rose-400 border-rose-500/30' :
                      'bg-amber-500/10 text-amber-400 border-amber-500/30'
                    }`}>
                      {rec.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-400 text-[11px]">
                    {rec.desc}
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
