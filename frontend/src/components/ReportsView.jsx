import React, { useState } from 'react';
import { 
  FileText, 
  Download, 
  Printer, 
  Search, 
  ShieldCheck, 
  Building2, 
  Receipt, 
  Scale, 
  CheckCircle2,
  Calendar,
  Sparkles,
  Eye,
  FileSpreadsheet,
  X
} from 'lucide-react';
import { exportToCSV, downloadReportDossier, printFormattedDossier } from '../utils/exportUtils';

const INITIAL_REPORTS = [
  {
    id: 'REP-INV-1025',
    title: 'Forensic Investigation Dossier: TX1025',
    category: 'INVESTIGATION',
    target: 'ABC Computers (PO #PO1025 / INV #INV1025)',
    date: '25-09-2026',
    author: 'Vikramaditya Sen (Lead Auditor)',
    summary: 'PO-Invoice unit price mismatch (+60% variance) & historical baseline deviation.',
    status: 'COMPLETED',
    score: '87/100 HIGH RISK'
  },
  {
    id: 'REP-PROC-Q3',
    title: 'Q3 Comprehensive Procurement & Vendor Spend Summary',
    category: 'PROCUREMENT',
    target: '148 Registered Vendors (1,240 POs)',
    date: '25-09-2026',
    author: 'Rahul (Procurement Manager)',
    summary: 'Quarterly breakdown of PO disbursements, pending clearances, and category volume.',
    status: 'PUBLISHED',
    score: 'Total Spend: ₹12.4 Cr'
  },
  {
    id: 'REP-AUDIT-SYS',
    title: 'Executive System Governance & Statutory Compliance Report',
    category: 'ADMIN',
    target: 'Enterprise System Audit & User Permissions Matrix',
    date: '25-09-2026',
    author: 'System Administrator',
    summary: 'GFR Rule 149 & SOX 404 statutory compliance audit across all 1,150 transactions.',
    status: 'VERIFIED',
    score: '100% Audit Coverage'
  },
  {
    id: 'REP-INV-1020',
    title: 'Price Gouging Investigation Dossier: TX1020',
    category: 'INVESTIGATION',
    target: 'Apex Heavy Dynamics (Titanium Heat Exchanger)',
    date: '20-09-2026',
    author: 'Vikramaditya Sen (Lead Auditor)',
    summary: '3.7x price spike over 6-quarter empirical baseline (₹1,85,000 vs ₹50,000).',
    status: 'COMPLETED',
    score: '94/100 CRITICAL'
  }
];

export const ReportsView = ({ currentUser, onToast }) => {
  const [reports] = useState(INITIAL_REPORTS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedReport, setSelectedReport] = useState(null);

  // Fetch report data & transactions over live network
  React.useEffect(() => {
    fetch('/api/transactions', { headers: { 'x-user-role': currentUser?.role || 'ROLE_ADMIN' } })
      .then(res => res.json())
      .catch(e => console.debug('Reports transactions fetch:', e));

    fetch('/api/v1/database/tables')
      .then(res => res.json())
      .catch(e => console.debug('Reports database tables fetch:', e));
  }, [currentUser]);

  // Role permissions filter:
  const permittedReports = reports.filter(r => {
    if (currentUser?.role === 'ROLE_ADMIN') return true;
    if (currentUser?.role === 'ROLE_PROCUREMENT_MANAGER') return r.category === 'PROCUREMENT' || r.category === 'INVESTIGATION';
    if (currentUser?.role === 'ROLE_AUDITOR') return r.category === 'INVESTIGATION' || r.category === 'PROCUREMENT';
    return true;
  });

  const filteredReports = permittedReports.filter(r => {
    const matchesSearch = r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          r.target.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          r.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const handleExportCSV = () => {
    const headers = [
      { key: 'id', label: 'Report ID' },
      { key: 'title', label: 'Report Title' },
      { key: 'category', label: 'Category' },
      { key: 'target', label: 'Target Entity' },
      { key: 'date', label: 'Date' },
      { key: 'author', label: 'Author' },
      { key: 'summary', label: 'Summary Findings' },
      { key: 'status', label: 'Status' },
      { key: 'score', label: 'Score / Metric' }
    ];
    exportToCSV('ProcureLens_Reports_Catalogue', headers, filteredReports);
    onToast('Reports catalogue exported to CSV successfully.');
  };

  const handleDownloadDossier = (rep) => {
    downloadReportDossier(rep, currentUser);
    onToast(`Downloaded official audit dossier for ${rep.id}.`);
  };

  const handlePrintDossier = (rep) => {
    printFormattedDossier(rep, currentUser);
  };

  return (
    <div className="space-y-6">
      
      {/* Banner */}
      <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded text-[10px] font-mono-numbers font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
              REPORTS &amp; COMPLIANCE
            </span>
            <span className="text-xs text-slate-400">· Official Audit Dossiers</span>
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">
            Generated Reports &amp; Dossiers
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Access formal investigation reports, procurement spend summaries, and system compliance audits with full chain of custody verification.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleExportCSV}
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 cursor-pointer shadow-sm"
            title="Download full catalogue as CSV"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
            <span>Export Catalogue (CSV)</span>
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search report title, ID, vendor..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 pl-9 font-mono-numbers"
          />
        </div>
      </div>

      {/* Reports Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredReports.map((rep) => (
          <div key={rep.id} className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between hover:border-slate-700 transition-colors">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-mono-numbers text-slate-400 font-bold bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                  {rep.id}
                </span>
                <span className="text-[10px] font-mono-numbers font-bold text-purple-300 px-2 py-0.5 rounded bg-purple-500/10 border border-purple-500/20">
                  {rep.score}
                </span>
              </div>

              <h3 className="text-sm font-bold text-white leading-snug">{rep.title}</h3>
              <p className="text-xs text-slate-400 mt-1 font-mono-numbers">{rep.target}</p>
              <p className="text-xs text-slate-300 mt-2 leading-relaxed">{rep.summary}</p>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-400">
              <span className="text-[11px] font-mono-numbers">{rep.date} · {rep.author}</span>
              <div className="flex items-center gap-1.5 self-end sm:self-auto">
                <button
                  onClick={() => handlePrintDossier(rep)}
                  className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1 cursor-pointer"
                  title="Print or Save as PDF"
                >
                  <Printer className="w-3.5 h-3.5 text-blue-400" />
                  <span>Print</span>
                </button>
                <button
                  onClick={() => handleDownloadDossier(rep)}
                  className="px-3 py-1.5 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer shadow-md"
                  title="Download full official dossier document"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Dossier</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
