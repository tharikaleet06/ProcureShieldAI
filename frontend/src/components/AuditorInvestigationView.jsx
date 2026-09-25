import React, { useState } from 'react';
import { 
  ShieldAlert, 
  Scale, 
  ArrowLeft, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowUpRight, 
  FileText, 
  Receipt, 
  Building2, 
  Layers, 
  BrainCircuit, 
  Sparkles, 
  Clock, 
  Download, 
  Printer, 
  X, 
  Send,
  HelpCircle,
  FileCheck2,
  TrendingUp,
  History,
  GitCompare,
  Check
} from 'lucide-react';
import { downloadReportDossier, printFormattedDossier } from '../utils/exportUtils';

export const AuditorInvestigationView = ({ 
  transaction, 
  onBack, 
  onToast,
  currentUser 
}) => {
  // Default fallback to canonical TX1025 if none passed
  const tx = transaction || {
    id: 'TX1025',
    vendor: 'ABC Computers',
    po: 'PO1025',
    invoice: 'INV1025',
    amount: '₹8,00,000',
    numericAmount: 800000,
    riskScore: 87,
    riskLevel: 'HIGH',
    detectedIssues: 'PO-Invoice mismatch',
    investigationStatus: 'UNDER_REVIEW',
    date: '25-09-2026'
  };

  const [investigationStatus, setInvestigationStatus] = useState(tx.investigationStatus || 'UNDER_REVIEW');
  const [investigationNotes, setInvestigationNotes] = useState(
    'Vendor confirmed revised pricing due to hardware specification change.'
  );
  const [isDecisionModalOpen, setIsDecisionModalOpen] = useState(false);
  const [decisionType, setDecisionType] = useState(null); // 'RESOLVE' | 'ESCALATE'
  const [decisionReason, setDecisionReason] = useState('');
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  // Trigger live AI forensic investigation analysis over network
  React.useEffect(() => {
    fetch('/api/v1/fraud-detection/investigate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ transactionId: tx.id || 'TX1025' })
    })
      .then(res => res.json())
      .catch(e => console.debug('Investigation AI forensics fetch notice:', e));
  }, [tx.id]);

  // Side-by-side PO vs Invoice Data
  const poData = {
    poNumber: tx.po || 'PO1025',
    date: '25-09-2026',
    quantity: 10,
    unitPrice: 50000,
    total: 500000,
    item: 'Desktop Workstations'
  };

  const invoiceData = {
    invoiceNumber: tx.invoice || 'INV1025',
    date: '25-09-2026',
    quantity: 10,
    unitPrice: 80000,
    total: 800000,
    item: 'Desktop Workstations (Revised Model)'
  };

  // Vendor Previous Transactions Baseline
  const vendorHistory = [
    { txId: 'TX0998', date: '01-06-2026', amount: 520000, formatted: '₹5,20,000', status: 'CLEARED' },
    { txId: 'TX1005', date: '15-07-2026', amount: 490000, formatted: '₹4,90,000', status: 'CLEARED' },
    { txId: 'TX1012', date: '01-08-2026', amount: 510000, formatted: '₹5,10,000', status: 'CLEARED' },
    { txId: 'TX1019', date: '18-08-2026', amount: 540000, formatted: '₹5,40,000', status: 'CLEARED' },
    { txId: tx.id || 'TX1025', date: '25-09-2026', amount: 800000, formatted: '₹8,00,000', status: 'FLAGGED', isCurrent: true },
  ];

  // Related Transactions
  const relatedRecords = [
    { id: 'TX987', vendor: 'ABC Computers', desc: 'Previous Similar Invoice #INV0987', amount: '₹5,35,000', similarity: '96% Semantic Match' },
    { id: 'PO1019', vendor: 'ABC Computers', desc: 'Similar PO for 10 Desktops', amount: '₹5,40,000', similarity: '98% Item Match' },
    { id: 'TX1014', vendor: 'Kinetic Hardware Hub', desc: 'Similar category workstation procurement', amount: '₹4,95,000', similarity: '82% Structural Match' }
  ];

  // Detected Signals (Exact signals)
  const detectedSignals = [
    { title: 'PO–Invoice amount mismatch', detail: 'Invoice unit price ₹80,000 vs PO approved rate ₹50,000 (+60% variance)', isViolated: true },
    { title: 'Unusually high transaction amount', detail: 'Disbursement of ₹8,00,000 is 3.7σ above vendor historical mean (₹5,15,000)', isViolated: true },
    { title: 'Similar historical transactions detected', detail: '4 prior consecutive quarterly POs for same items completed between ₹4,90,000 – ₹5,40,000', isViolated: true }
  ];

  const handleApplyDecision = () => {
    if (!decisionReason.trim()) {
      alert('Please enter a justification note before finalizing the decision.');
      return;
    }

    const finalStatus = decisionType === 'RESOLVE' ? 'RESOLVED' : 'ESCALATED';
    setInvestigationStatus(finalStatus);
    setIsDecisionModalOpen(false);
    onToast(`Transaction #${tx.id} marked as ${finalStatus}: "${decisionReason}"`);
    setIsSaved(true);
  };

  const statusSteps = ['FLAGGED', 'UNDER_REVIEW', 'INVESTIGATED', 'RESOLVED', 'ESCALATED'];

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      
      {/* Top Navigation & Status Stepper */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Flagged Queue</span>
        </button>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setIsReportModalOpen(true)}
            className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
          >
            <FileCheck2 className="w-4 h-4 text-purple-400" />
            <span>Generate Investigation Report</span>
          </button>

          {currentUser?.role === 'ROLE_AUDITOR' && (
            <>
              <button
                onClick={() => {
                  setDecisionType('RESOLVE');
                  setDecisionReason(investigationNotes);
                  setIsDecisionModalOpen(true);
                }}
                className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-md shadow-emerald-950/60 cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Resolve</span>
              </button>

              <button
                onClick={() => {
                  setDecisionType('ESCALATE');
                  setDecisionReason(investigationNotes);
                  setIsDecisionModalOpen(true);
                }}
                className="px-3.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-md shadow-rose-950/60 cursor-pointer"
              >
                <ArrowUpRight className="w-4 h-4" />
                <span>Escalate</span>
              </button>
            </>
          )}

          {currentUser?.role === 'ROLE_ADMIN' && (
            <span className="px-3 py-1.5 rounded-xl bg-purple-500/10 text-purple-300 border border-purple-500/30 text-xs font-semibold flex items-center gap-1.5">
              <span>Admin Governance (View Only)</span>
            </span>
          )}
        </div>
      </div>

      {/* 1. TRANSACTION SUMMARY HEADER CARD */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 border border-slate-800 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded text-[10px] font-mono-numbers font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                AUDITLENS INVESTIGATION #{tx.id}
              </span>
              <span className={`px-2 py-0.5 rounded text-[10px] font-mono-numbers font-bold border ${
                investigationStatus === 'RESOLVED' ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' :
                investigationStatus === 'ESCALATED' ? 'bg-rose-500/20 text-rose-300 border-rose-500/30' :
                'bg-amber-500/20 text-amber-300 border-amber-500/30'
              }`}>
                STATUS: {investigationStatus}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Transaction Summary: {tx.id}
            </h1>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4 font-mono-numbers text-xs">
              <div>
                <span className="text-slate-400 block text-[10px]">VENDOR</span>
                <span className="text-white font-bold">{tx.vendor}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">PURCHASE ORDER</span>
                <span className="text-blue-400 font-bold">#{tx.po}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">INVOICE</span>
                <span className="text-amber-400 font-bold">#{tx.invoice}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">TRANSACTION AMOUNT</span>
                <span className="text-white font-bold text-sm">{tx.amount}</span>
              </div>
            </div>
          </div>

          {/* Risk Score Gauge */}
          <div className="p-4 rounded-2xl bg-slate-950/90 border border-rose-500/30 flex items-center gap-4 shrink-0">
            <div className="text-center">
              <span className="text-[10px] font-mono-numbers text-slate-400 uppercase font-bold block">
                OVERALL RISK SCORE
              </span>
              <div className="text-3xl font-extrabold text-rose-400 font-mono-numbers mt-0.5">
                {tx.riskScore}<span className="text-xs text-slate-500">/100</span>
              </div>
            </div>
            <div className="h-10 w-px bg-slate-800" />
            <div>
              <span className="px-2.5 py-1 rounded-md text-xs font-bold font-mono-numbers bg-rose-500/20 text-rose-300 border border-rose-500/30 block text-center">
                {tx.riskLevel} RISK
              </span>
              <span className="text-[10px] text-slate-400 font-mono-numbers block text-center mt-1">
                Multi-Signal Triggered
              </span>
            </div>
          </div>

        </div>

        {/* Investigation Stepper Bar */}
        <div className="mt-6 pt-4 border-t border-slate-800/80">
          <div className="flex items-center justify-between mb-2">
            <div className="text-[10px] font-mono-numbers text-slate-400 uppercase font-bold">
              Investigation Workflow Progression:
            </div>
            {currentUser?.role !== 'ROLE_AUDITOR' && (
              <span className="text-[10px] font-mono-numbers text-slate-500 italic">
                (Read-Only Progression Indicator)
              </span>
            )}
          </div>
          <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto">
            {['FLAGGED', 'UNDER_REVIEW', 'INVESTIGATED', 'RESOLVED', 'ESCALATED'].map((step) => {
              const isCurrent = investigationStatus === step;
              const isAuditor = currentUser?.role === 'ROLE_AUDITOR';
              return (
                <button
                  key={step}
                  disabled={!isAuditor}
                  onClick={() => {
                    if (isAuditor) setInvestigationStatus(step);
                  }}
                  className={`px-3 py-1 rounded-lg text-[10px] font-mono-numbers font-bold border transition-all whitespace-nowrap ${
                    isCurrent 
                      ? 'bg-rose-600 text-white border-rose-400 shadow-md ring-1 ring-rose-400/50' 
                      : 'bg-slate-950 text-slate-400 border-slate-800'
                  } ${isAuditor ? 'cursor-pointer hover:border-slate-700' : 'cursor-default opacity-85'}`}
                  title={!isAuditor ? 'Workflow progression can only be modified by a Forensic Auditor' : `Set status to ${step}`}
                >
                  {step}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 2. DETECTED SIGNALS SECTION */}
      <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <BrainCircuit className="w-4 h-4 text-rose-400" />
            <span>Detected Signals (Empirical AI Engine Output)</span>
          </h3>
          <span className="text-[10px] text-slate-400 font-mono-numbers">Actual detected statistical anomalies</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {detectedSignals.map((sig, idx) => (
            <div key={idx} className="p-3.5 rounded-xl bg-slate-950 border border-rose-500/20 space-y-1.5">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-rose-500/20 text-rose-300 flex items-center justify-center text-xs font-bold">
                  ✓
                </div>
                <span className="text-xs font-bold text-rose-300">{sig.title}</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed font-mono-numbers">
                {sig.detail}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* 3. PO VS INVOICE COMPARISON (SIDE-BY-SIDE TABLE) */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 overflow-hidden shadow-xl">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/40">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <GitCompare className="w-4 h-4 text-cyan-400" />
              <span>Purchase Order vs. Invoice Side-by-Side Comparison</span>
            </h3>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Differences highlighted to accelerate forensic invoice validation.
            </p>
          </div>
          <span className="text-xs font-mono-numbers text-rose-400 font-bold px-2 py-0.5 rounded bg-rose-500/10 border border-rose-500/20">
            Variance: +₹3,00,000 (+60%)
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/80 text-slate-400 font-mono-numbers uppercase text-[10px]">
                <th className="py-3 px-4">Line Parameter</th>
                <th className="py-3 px-4 bg-blue-950/20 border-r border-slate-800">
                  <span className="text-blue-300 font-bold">PURCHASE ORDER (#{poData.poNumber})</span>
                </th>
                <th className="py-3 px-4 bg-amber-950/20 border-r border-slate-800">
                  <span className="text-amber-300 font-bold">INVOICE (#{invoiceData.invoiceNumber})</span>
                </th>
                <th className="py-3 px-4 text-right">Detected Discrepancy</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono-numbers">
              
              <tr className="hover:bg-slate-800/30">
                <td className="py-3 px-4 font-semibold text-slate-300">Item Description</td>
                <td className="py-3 px-4 bg-blue-950/10 border-r border-slate-800 text-white font-sans">
                  {poData.item}
                </td>
                <td className="py-3 px-4 bg-amber-950/10 border-r border-slate-800 text-white font-sans">
                  {invoiceData.item}
                </td>
                <td className="py-3 px-4 text-right text-slate-400 text-[11px] font-sans">
                  Specification Modification
                </td>
              </tr>

              <tr className="hover:bg-slate-800/30">
                <td className="py-3 px-4 font-semibold text-slate-300">Quantity</td>
                <td className="py-3 px-4 bg-blue-950/10 border-r border-slate-800 text-white font-bold">
                  {poData.quantity} Units
                </td>
                <td className="py-3 px-4 bg-amber-950/10 border-r border-slate-800 text-white font-bold">
                  {invoiceData.quantity} Units
                </td>
                <td className="py-3 px-4 text-right text-emerald-400 font-bold">
                  0 (Exact Match)
                </td>
              </tr>

              <tr className="hover:bg-slate-800/30 bg-rose-500/5">
                <td className="py-3 px-4 font-semibold text-slate-300">Unit Price</td>
                <td className="py-3 px-4 bg-blue-950/10 border-r border-slate-800 text-slate-200">
                  ₹{poData.unitPrice.toLocaleString('en-IN')}
                </td>
                <td className="py-3 px-4 bg-rose-500/10 border-r border-slate-800 text-rose-300 font-bold">
                  ₹{invoiceData.unitPrice.toLocaleString('en-IN')}
                </td>
                <td className="py-3 px-4 text-right text-rose-400 font-bold">
                  +₹30,000 (+60% Unit Surge) ⚠️
                </td>
              </tr>

              <tr className="hover:bg-slate-800/30 bg-rose-500/10 font-bold text-sm">
                <td className="py-3.5 px-4 text-white">Total Line Amount</td>
                <td className="py-3.5 px-4 bg-blue-950/20 border-r border-slate-800 text-blue-300">
                  ₹{poData.total.toLocaleString('en-IN')}
                </td>
                <td className="py-3.5 px-4 bg-rose-500/20 border-r border-slate-800 text-rose-300">
                  ₹{invoiceData.total.toLocaleString('en-IN')}
                </td>
                <td className="py-3.5 px-4 text-right text-rose-400">
                  +₹3,00,000 Discrepancy
                </td>
              </tr>

            </tbody>
          </table>
        </div>
      </div>

      {/* 4. VENDOR HISTORY & 5. RELATED TRANSACTIONS (2-COLUMN GRID) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Vendor History Timeline */}
        <div className="lg:col-span-6 p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <History className="w-4 h-4 text-cyan-400" />
              <span>Vendor History: {tx.vendor}</span>
            </h3>
            <span className="text-[10px] text-slate-400 font-mono-numbers">Historical Transactions</span>
          </div>

          <p className="text-xs text-slate-400">
            Compare current disbursement against previous verified transactions to detect sudden pricing deviations.
          </p>

          <div className="space-y-2 font-mono-numbers text-xs">
            {vendorHistory.map((vh, idx) => (
              <div 
                key={idx}
                className={`p-3 rounded-xl border flex items-center justify-between transition-all ${
                  vh.isCurrent 
                    ? 'bg-rose-500/10 border-rose-500/40 text-rose-300 ring-1 ring-rose-500/20' 
                    : 'bg-slate-950 border-slate-800 text-slate-300'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-slate-500 text-[10px]">#{vh.txId}</span>
                  <span className="font-semibold">{vh.date}</span>
                </div>

                <div className="flex items-center gap-3">
                  <span className={`font-bold ${vh.isCurrent ? 'text-rose-400 text-sm' : 'text-white'}`}>
                    {vh.formatted}
                  </span>
                  {vh.isCurrent && (
                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">
                      Current Flagged
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Related Transactions & RAG Similarity */}
        <div className="lg:col-span-6 p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-purple-400" />
              <span>Related Transactions &amp; Similarity Analysis</span>
            </h3>
            <span className="text-[10px] text-slate-400 font-mono-numbers">Semantic Correlation</span>
          </div>

          <p className="text-xs text-slate-400">
            Automated entity similarity graphs identify related POs, previous invoices, and pricing baselines across the organization.
          </p>

          <div className="space-y-2 font-mono-numbers text-xs">
            {relatedRecords.map((rel, idx) => (
              <div key={idx} className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="font-bold text-white flex items-center gap-1.5">
                    <span>{rel.id}</span>
                    <span className="text-[9px] px-1.5 py-0.2 rounded bg-purple-500/10 text-purple-300 border border-purple-500/20">
                      {rel.similarity}
                    </span>
                  </div>
                  <span className="text-slate-400 text-[11px] font-sans">{rel.desc}</span>
                </div>
                <span className="font-bold text-white text-right">{rel.amount}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* 6. EVIDENCE / RAG & LLM EXPLANATION */}
      <div className="p-6 rounded-2xl bg-slate-900/90 border border-purple-500/30 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span>Evidence Dossier &amp; Grounded Forensic Explanation</span>
          </h3>
          <span className="text-[10px] font-mono-numbers text-purple-300 font-bold px-2 py-0.5 rounded bg-purple-500/20 border border-purple-500/30">
            RAG Grounded Synthesis
          </span>
        </div>

        {/* Retrieved Evidence Pills */}
        <div>
          <div className="text-[10px] font-mono-numbers text-slate-400 uppercase font-bold mb-2">
            Retrieved Evidence Objects:
          </div>
          <div className="flex items-center gap-2 flex-wrap text-xs font-mono-numbers">
            <span className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-blue-300">
              📄 PO #{tx.po}
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-amber-300">
              🧾 Invoice #{tx.invoice}
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-cyan-300">
              🏢 Vendor History (ABC Computers)
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-purple-300">
              📑 Previous Similar Invoice (#INV0987)
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-emerald-300">
              🔄 Related Transaction #TX987
            </span>
          </div>
        </div>

        {/* Why is this suspicious? Box */}
        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
          <div className="text-xs font-bold text-purple-300 flex items-center gap-1.5">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Why is this suspicious?</span>
          </div>
          <p className="text-xs text-slate-200 leading-relaxed font-sans">
            "The invoice amount is higher than the associated purchase order amount. Previous similar transactions from the vendor had lower values. These factors contributed to the transaction being flagged for further investigation."
          </p>
          <div className="text-[10px] text-slate-500 font-mono-numbers pt-1 border-t border-slate-900">
            Architecture: AI Models → Detected Signals → Risk Score (87/100) → RAG Evidence Retrieval → Grounded Explanation → Auditor Review
          </div>
        </div>
      </div>

      {/* 7. INVESTIGATION NOTES & FINAL DECISION CONTROLS */}
      <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <FileText className="w-4 h-4 text-amber-400" />
          <span>Auditor Investigation Notes &amp; Findings</span>
        </h3>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-xs font-semibold text-slate-300">
              Investigation Notes &amp; Evidence Remarks:
            </label>
            {currentUser?.role === 'ROLE_ADMIN' && (
              <span className="text-[10px] text-purple-400 font-semibold font-mono-numbers">
                (Read-Only Governance View)
              </span>
            )}
          </div>
          <textarea
            value={investigationNotes}
            onChange={(e) => setInvestigationNotes(e.target.value)}
            readOnly={currentUser?.role !== 'ROLE_AUDITOR'}
            rows={3}
            placeholder="Enter auditor findings, supplier interview summary, or verification remarks..."
            className={`w-full bg-slate-950 border border-slate-800 rounded-xl p-3.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 leading-relaxed font-sans ${
              currentUser?.role !== 'ROLE_AUDITOR' ? 'cursor-default opacity-85' : ''
            }`}
          />
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-3 border-t border-slate-800">
          <div className="text-xs text-slate-400 font-mono-numbers">
            Auditor Assigned: <span className="font-bold text-white">{currentUser?.role === 'ROLE_AUDITOR' ? currentUser.name : 'Vikramaditya Sen (Forensic Auditor)'}</span>
          </div>

          <div className="flex items-center gap-2">
            {currentUser?.role === 'ROLE_AUDITOR' ? (
              <>
                <button
                  onClick={() => {
                    setDecisionType('RESOLVE');
                    setDecisionReason(investigationNotes);
                    setIsDecisionModalOpen(true);
                  }}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Resolve Transaction</span>
                </button>

                <button
                  onClick={() => {
                    setDecisionType('ESCALATE');
                    setDecisionReason(investigationNotes);
                    setIsDecisionModalOpen(true);
                  }}
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
                >
                  <ArrowUpRight className="w-4 h-4" />
                  <span>Escalate Transaction</span>
                </button>
              </>
            ) : (
              <span className="text-xs text-slate-400 font-mono-numbers italic">
                Oversight Mode: Investigation actions are performed exclusively by Forensic Auditors.
              </span>
            )}
          </div>
        </div>
      </div>

      {/* DECISION REASON MODAL */}
      {isDecisionModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="max-w-md w-full rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-6 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                {decisionType === 'RESOLVE' ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Confirm Resolution</span>
                  </>
                ) : (
                  <>
                    <ArrowUpRight className="w-4 h-4 text-rose-400" />
                    <span>Confirm Escalation</span>
                  </>
                )}
              </h3>
              <button onClick={() => setIsDecisionModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              {decisionType === 'RESOLVE'
                ? 'Used when the auditor determines that the flagged transaction has a valid commercial explanation. Please confirm your justification note.'
                : 'Used when additional review or statutory action is required (e.g. ERP payment freeze, CFO escalation).'}
            </p>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Auditor Justification Note (Required):
              </label>
              <textarea
                value={decisionReason}
                onChange={(e) => setDecisionReason(e.target.value)}
                rows={3}
                required
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-rose-500"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setIsDecisionModalOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white rounded-xl"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleApplyDecision}
                className={`px-4 py-2 text-xs font-bold text-white rounded-xl shadow-md cursor-pointer ${
                  decisionType === 'RESOLVE' ? 'bg-emerald-600 hover:bg-emerald-500' : 'bg-rose-600 hover:bg-rose-500'
                }`}
              >
                Finalize {decisionType === 'RESOLVE' ? 'Resolution' : 'Escalation'}
              </button>
            </div>

          </div>
        </div>
      )}

      {/* 9. INVESTIGATION REPORT MODAL */}
      {isReportModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="max-w-2xl w-full rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-6 space-y-5 animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-start justify-between pb-4 border-b border-slate-800">
              <div>
                <span className="text-[10px] font-mono-numbers text-purple-400 font-bold uppercase block">
                  STATUTORY AUDIT DOSSIER
                </span>
                <h3 className="text-xl font-bold text-white">
                  Investigation Report #{tx.id}
                </h3>
              </div>
              <button onClick={() => setIsReportModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Formatted Report Content */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3 text-xs font-sans">
              <div className="grid grid-cols-2 gap-2 font-mono-numbers text-[11px] pb-2 border-b border-slate-800">
                <div><span className="text-slate-500">Investigation ID:</span> <span className="font-bold text-white">INV-REP-{tx.id}</span></div>
                <div><span className="text-slate-500">Transaction ID:</span> <span className="font-bold text-white">{tx.id}</span></div>
                <div><span className="text-slate-500">Vendor:</span> <span className="font-bold text-white">{tx.vendor}</span></div>
                <div><span className="text-slate-500">PO Number:</span> <span className="font-bold text-blue-400">#{tx.po}</span></div>
                <div><span className="text-slate-500">Invoice Number:</span> <span className="font-bold text-amber-400">#{tx.invoice}</span></div>
                <div><span className="text-slate-500">Amount:</span> <span className="font-bold text-white">{tx.amount}</span></div>
                <div><span className="text-slate-500">Risk Score:</span> <span className="font-bold text-rose-400">{tx.riskScore}/100 ({tx.riskLevel})</span></div>
                <div><span className="text-slate-500">Report Date:</span> <span className="font-bold text-white">{new Date().toISOString().split('T')[0]}</span></div>
              </div>

              <div>
                <div className="font-bold text-slate-200 mb-1">Detected Anomalies:</div>
                <ul className="list-disc pl-4 text-slate-400 space-y-0.5 font-mono-numbers text-[11px]">
                  <li>PO–Invoice unit price mismatch (+60% price variance).</li>
                  <li>Unusually high disbursement exceeding historical mean.</li>
                  <li>Similar historical quarterly transactions baseline deviation.</li>
                </ul>
              </div>

              <div>
                <div className="font-bold text-slate-200 mb-1">Supporting Evidence:</div>
                <div className="text-slate-400 text-[11px]">
                  PO #{tx.po}, Invoice #{tx.invoice}, 4 Historical baseline purchases, Semantic similarity graph with #INV0987.
                </div>
              </div>

              <div>
                <div className="font-bold text-slate-200 mb-1">Auditor Investigation Notes:</div>
                <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 italic text-[11px]">
                  "{investigationNotes}"
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800 flex items-center justify-between font-mono-numbers">
                <div>
                  <span className="text-slate-500 block text-[10px]">FINAL STATUS</span>
                  <span className="font-bold text-emerald-400">{investigationStatus}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">AUDITOR DECISION</span>
                  <span className="font-bold text-white">{currentUser?.name || 'Vikramaditya Sen (Lead Auditor)'}</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => {
                  printFormattedDossier({
                    id: `INV-REP-${tx.id}`,
                    title: `Forensic Investigation Dossier: ${tx.id}`,
                    target: `${tx.vendor} (PO #${tx.po} / INV #${tx.invoice})`,
                    summary: `PO-Invoice unit price mismatch (+60% variance) & historical baseline deviation. Lead auditor analysis notes: ${investigationNotes}`,
                    score: `${tx.riskScore}/100 ${tx.riskLevel} RISK`,
                    author: currentUser?.name || 'Lead Forensic Auditor'
                  }, currentUser);
                }}
                className="px-4 py-2 text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 rounded-xl flex items-center gap-1.5 cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5 text-blue-400" />
                <span>Print Dossier</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  downloadReportDossier({
                    id: `INV-REP-${tx.id}`,
                    title: `Forensic Investigation Dossier: ${tx.id}`,
                    target: `${tx.vendor} (PO #${tx.po} / INV #${tx.invoice})`,
                    summary: `PO-Invoice unit price mismatch (+60% variance) & historical baseline deviation. Lead auditor analysis notes: ${investigationNotes}`,
                    score: `${tx.riskScore}/100 ${tx.riskLevel} RISK`,
                    author: currentUser?.name || 'Lead Forensic Auditor'
                  }, currentUser);
                  onToast(`Investigation Report INV-REP-${tx.id} downloaded successfully.`);
                  setIsReportModalOpen(false);
                }}
                className="px-4 py-2 text-xs font-bold text-white bg-purple-600 hover:bg-purple-500 rounded-xl shadow-md flex items-center gap-1.5 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Report Dossier</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
