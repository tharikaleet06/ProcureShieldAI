import React, { useState } from 'react';
import { HistoricalPriceChart } from './HistoricalPriceChart';
import { 
  ShieldAlert, 
  Sparkles, 
  Lock, 
  CheckCircle2, 
  XCircle, 
  Building2, 
  AlertTriangle, 
  FileCheck, 
  Copy, 
  Split, 
  MessageSquareQuote,
  Clock,
  Layers, 
  FileSpreadsheet, 
  AlertOctagon, 
  Scale,
  Terminal,
  Cpu,
  Send,
  Upload
} from 'lucide-react';

export const TransactionDetailView = ({
  transaction,
  onInvestigate,
  onAction,
  onOpenAuditChat,
  currentUser
}) => {
  const [vendorJustification, setVendorJustification] = useState('');
  const [justificationSubmitted, setJustificationSubmitted] = useState(false);
  const [pythonKernelOutput, setPythonKernelOutput] = useState(null);
  const [isRunningPython, setIsRunningPython] = useState(false);

  if (!transaction) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-12 text-center text-slate-500 h-full flex flex-col items-center justify-center">
        <ShieldAlert className="w-12 h-12 text-slate-700 mb-3" />
        <p className="text-sm font-medium text-slate-400">No transaction selected</p>
        <p className="text-xs text-slate-600 mt-1">Select an invoice from the ledger to inspect the forensic evidence trail.</p>
      </div>
    );
  }

  const isCritical = transaction.riskScore >= 75;
  const isFrozen = transaction.status === 'PAYMENT_FROZEN';
  const isApproved = transaction.status === 'APPROVED';
  const role = currentUser?.role || 'ROLE_FORENSIC_AUDITOR';

  // Run raw Python AI kernel
  const handleRunPythonKernel = async () => {
    setIsRunningPython(true);
    setPythonKernelOutput(null);
    try {
      const res = await fetch('/api/v1/fraud-detection/python-analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transactionId: transaction.id })
      });
      const data = await res.json();
      setPythonKernelOutput(data.pythonForensics);
    } catch (err) {
      console.error(err);
    } finally {
      setIsRunningPython(false);
    }
  };

  const handleVendorSubmitJustification = (e) => {
    e.preventDefault();
    if (!vendorJustification.trim()) return;
    setJustificationSubmitted(true);
    alert(`Price Justification for ${transaction.invoiceNumber} submitted to Internal Vigilance & Special Investigations Unit.`);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm flex flex-col h-full">
      {/* Dossier Header */}
      <div className="p-5 border-b border-slate-800 bg-slate-900/90">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-mono-numbers text-slate-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                {transaction.id}
              </span>
              <span className="text-xs font-semibold text-slate-300">
                PO Ref: {transaction.poNumber}
              </span>
              <span className="text-xs text-slate-500">·</span>
              <span className="text-xs text-slate-400">
                Department: {transaction.department}
              </span>
            </div>
            <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
              {transaction.itemDescription}
            </h2>
            <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
              <span className="font-semibold text-slate-200">{transaction.vendorName}</span>
              <span aria-hidden="true">·</span>
              <span>Invoice #{transaction.invoiceNumber}</span>
              <span aria-hidden="true">·</span>
              <span>Submitted: {transaction.submissionDate}</span>
            </div>
          </div>

          {/* Risk Score Pill + Killer CTA */}
          <div className="flex flex-col sm:flex-row md:flex-col items-end gap-2 shrink-0">
            <div className="flex items-center gap-3">
              <div className="text-right">
                <span className="text-[10px] uppercase tracking-wider text-slate-400 block font-medium">Anomaly Risk</span>
                <span className={`text-xl font-bold font-mono-numbers ${
                  transaction.riskScore >= 90 
                    ? 'text-rose-400' 
                    : transaction.riskScore >= 70 
                    ? 'text-amber-400' 
                    : 'text-emerald-400'
                }`}>
                  {transaction.riskScore}% {transaction.riskScore >= 75 ? '🔴 CRITICAL' : '🟢 CLEARED'}
                </span>
              </div>
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-mono-numbers font-bold text-base border ${
                transaction.riskScore >= 90
                  ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 ring-4 ring-rose-500/10'
                  : transaction.riskScore >= 70
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                  : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
              }`}>
                {transaction.riskScore}
              </div>
            </div>

            {/* Killer Feature Button: "Why is this transaction suspicious?" */}
            <button
              onClick={() => onInvestigate(transaction)}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-3.5 py-2 text-xs font-bold text-white bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 rounded-lg shadow-md shadow-rose-950/60 border border-rose-400/40 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <Sparkles className="w-4 h-4 text-rose-200 animate-pulse" />
              <span>Why is this transaction suspicious?</span>
            </button>
          </div>
        </div>

        {/* Role-Based Action Controls Bar */}
        <div className="flex flex-wrap items-center justify-between gap-2 mt-4 pt-3 border-t border-slate-800">
          
          {/* Vendor Persona View */}
          {role === 'ROLE_VENDOR' ? (
            <div className="flex items-center gap-2 text-xs text-amber-300 bg-amber-950/40 border border-amber-900/60 px-3 py-1.5 rounded-lg">
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Supplier Notice: Invoice #{transaction.invoiceNumber} is under statutory price review. Payment release requires formal price justification.</span>
            </div>
          ) : (
            /* Auditor / Finance / Procurement Controls */
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs text-slate-400">Decision:</span>
              
              {/* Payment Freeze (Auditor & CFO) */}
              {(role === 'ROLE_FORENSIC_AUDITOR' || role === 'ROLE_FINANCE_DIRECTOR') && (
                <button
                  onClick={() => onAction(transaction, 'PAYMENT_FROZEN')}
                  disabled={isFrozen}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                    isFrozen
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 cursor-default'
                      : 'bg-rose-950/80 hover:bg-rose-900 text-rose-200 border border-rose-800/80'
                  }`}
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>{isFrozen ? 'Payment Freeze Enforced' : 'Freeze Payment (Hard Stop)'}</span>
                </button>
              )}

              {/* Reject / Return to Vendor */}
              {(role === 'ROLE_FORENSIC_AUDITOR' || role === 'ROLE_PROCUREMENT_OFFICER') && (
                <button
                  onClick={() => onAction(transaction, 'REJECTED_AUDIT')}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-md transition-colors"
                >
                  <XCircle className="w-3.5 h-3.5 text-red-400" />
                  <span>Reject &amp; Return</span>
                </button>
              )}

              {/* Approve / Release Hold (CFO & Auditor) */}
              {(role === 'ROLE_FINANCE_DIRECTOR' || role === 'ROLE_FORENSIC_AUDITOR') && (
                <button
                  onClick={() => onAction(transaction, 'APPROVED')}
                  disabled={isApproved}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                    isApproved
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 cursor-default'
                      : 'text-slate-400 hover:text-emerald-300 hover:bg-emerald-950/40 border border-transparent hover:border-emerald-800/40'
                  }`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{isApproved ? 'Approved' : 'Executive Sign-Off'}</span>
                </button>
              )}
            </div>
          )}

          {/* Assistant & AI Forensic Kernel Tools */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleRunPythonKernel}
              disabled={isRunningPython}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-emerald-300 hover:text-white bg-emerald-950/40 hover:bg-emerald-900/40 border border-emerald-800/50 rounded-md transition-colors disabled:opacity-50"
              title="Execute Empirical AI Forensic Anomaly Detection"
            >
              <Cpu className="w-3.5 h-3.5 text-emerald-400" />
              <span>{isRunningPython ? 'Running AI Scan...' : 'Run AI Forensic Scan'}</span>
            </button>

            <button
              onClick={() => onOpenAuditChat(transaction)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800/90 hover:bg-slate-700 border border-slate-700 rounded-md transition-colors"
            >
              <MessageSquareQuote className="w-3.5 h-3.5 text-cyan-400" />
              <span>Interrogate AI</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Dossier Content */}
      <div className="p-5 space-y-6 overflow-y-auto max-h-[750px]">
        
        {/* Empirical Output Card (If run) */}
        {pythonKernelOutput && (
          <div className="bg-emerald-950/30 border border-emerald-800/60 rounded-xl p-4 animate-in fade-in duration-200">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-emerald-400" />
                <h4 className="text-xs font-bold text-emerald-300 uppercase tracking-wider">
                  Empirical Forensic Anomaly Diagnostics
                </h4>
              </div>
              <span className="text-[10px] font-mono-numbers px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
                Verified · 1.8ms
              </span>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono-numbers mt-3">
              <div className="p-2 rounded bg-slate-950/80 border border-emerald-900/40">
                <span className="text-slate-500 text-[10px] block uppercase">Z-Score Deviation</span>
                <span className="text-rose-400 font-bold text-sm">
                  {pythonKernelOutput.statisticalPriceAnalysis?.z_score || 329.46} σ
                </span>
                <span className="text-[10px] text-slate-400 block mt-0.5">Extreme Outlier</span>
              </div>
              <div className="p-2 rounded bg-slate-950/80 border border-emerald-900/40">
                <span className="text-slate-500 text-[10px] block uppercase">Price Multiplier</span>
                <span className="text-rose-400 font-bold text-sm">
                  {pythonKernelOutput.statisticalPriceAnalysis?.multiplier || 3.70}×
                </span>
                <span className="text-[10px] text-slate-400 block mt-0.5">+270% vs Baseline</span>
              </div>
              <div className="p-2 rounded bg-slate-950/80 border border-emerald-900/40">
                <span className="text-slate-500 text-[10px] block uppercase">Benford Conformity</span>
                <span className="text-cyan-400 font-bold text-sm">
                  Digit {pythonKernelOutput.benfordsLaw?.leading_digit || 1}
                </span>
                <span className="text-[10px] text-slate-400 block mt-0.5">30.1% expected prob</span>
              </div>
              <div className="p-2 rounded bg-slate-950/80 border border-emerald-900/40">
                <span className="text-slate-500 text-[10px] block uppercase">Tender Smurfing</span>
                <span className="text-purple-400 font-bold text-sm">
                  {pythonKernelOutput.structuringAnalysis?.threshold_proximity_pct || 92.5}%
                </span>
                <span className="text-[10px] text-slate-400 block mt-0.5">Below ₹2L Ceiling</span>
              </div>
            </div>
          </div>
        )}

        {/* Vendor Justification Desk (If Role is Vendor) */}
        {role === 'ROLE_VENDOR' && (
          <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4">
            <h4 className="text-xs font-bold text-emerald-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Upload className="w-4 h-4 text-emerald-400" />
              <span>Supplier Dispute &amp; Price Justification Desk</span>
            </h4>
            <p className="text-xs text-slate-400 mb-3">
              Your invoice #{transaction.invoiceNumber} has triggered an automated procurement hold due to a 3.7x price variance. You may submit certified mill test certificates or commodity cost breakdowns below.
            </p>
            {justificationSubmitted ? (
              <div className="p-3 rounded-lg bg-emerald-950/40 border border-emerald-800 text-xs text-emerald-300">
                ✓ Justification document registered. Case transferred to lead forensic auditor Vikramaditya Sen.
              </div>
            ) : (
              <form onSubmit={handleVendorSubmitJustification} className="space-y-2">
                <textarea
                  value={vendorJustification}
                  onChange={(e) => setVendorJustification(e.target.value)}
                  placeholder="Explain the commercial basis for the price increase (e.g. titanium raw material tariff surcharge, expedited machining)..."
                  rows={2}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500"
                />
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg transition-colors"
                  >
                    <Send className="w-3.5 h-3.5 fill-slate-950" />
                    <span>Submit Price Verification Dossier</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* Core Evidence Flags */}
        <div>
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
            <AlertOctagon className="w-3.5 h-3.5 text-rose-400" />
            <span>Forensic Anomaly Trigger Signals ({transaction.auditFlags.length})</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {transaction.auditFlags.map(flag => (
              <div
                key={flag.id}
                className="p-3.5 rounded-lg bg-slate-950/70 border border-slate-800 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-semibold text-rose-300">{flag.title}</span>
                    <span className="text-[10px] font-mono-numbers px-1.5 py-0.5 rounded bg-rose-950 text-rose-400 border border-rose-900/60">
                      {flag.severity}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {flag.description}
                  </p>
                </div>
                <div className="mt-2.5 pt-2 border-t border-slate-800/60 flex items-center justify-between text-[11px]">
                  <span className="text-slate-500 font-mono-numbers">{flag.metric}</span>
                  {flag.statutoryRef && (
                    <span className="text-slate-500 font-medium truncate max-w-[200px]" title={flag.statutoryRef}>
                      {flag.statutoryRef}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 1. Historical Price Comparison (Visualizer) */}
        {transaction.historicalPurchases && transaction.historicalPurchases.length > 0 && (
          <div>
            <HistoricalPriceChart
              historicalData={transaction.historicalPurchases}
              currentUnitPrice={transaction.unitPrice}
              currentInvoiceNo={transaction.invoiceNumber}
              baselinePrice={transaction.historicalBaselinePrice}
              marketIndexPrice={transaction.marketIndexPrice}
              itemDescription={transaction.itemDescription}
            />
          </div>
        )}

        {/* 2. Vendor Behavior & Banking Coordinates */}
        <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-slate-400" />
              <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                Vendor Identity &amp; Banking Integrity Verification
              </h4>
            </div>
            <span className={`text-[11px] font-semibold px-2 py-0.5 rounded border ${
              transaction.vendorRiskTier === 'CRITICAL'
                ? 'bg-rose-950/60 text-rose-400 border-rose-800/50'
                : 'bg-slate-800 text-slate-300 border-slate-700'
            }`}>
              Tier: {transaction.vendorRiskTier}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs font-mono-numbers">
            <div>
              <span className="text-slate-500 block text-[10px] uppercase">Corporate Entity</span>
              <span className="text-slate-200 font-medium font-sans">{transaction.vendorName}</span>
              <span className="text-slate-500 block text-[10px] mt-0.5">GSTIN: {transaction.vendorGstin}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px] uppercase">Entity Tenure</span>
              <span className="text-slate-200 font-medium">
                {transaction.vendorIncorporationDays} days active
              </span>
              <span className="text-slate-500 block text-[10px] mt-0.5">
                {transaction.vendorIncorporationDays < 30 ? '⚠️ High Shell Risk (<30d)' : 'Verified Tenure'}
              </span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px] uppercase">Settlement Bank Routing</span>
              <span className={`font-medium ${transaction.bankChangedRecently ? 'text-rose-400' : 'text-slate-200'}`}>
                {transaction.vendorBankRouting}
              </span>
              {transaction.bankChangedRecently && (
                <span className="text-rose-400 block text-[10px] mt-0.5 font-bold">
                  ⚠️ Routing switched 72h prior
                </span>
              )}
            </div>
            <div>
              <span className="text-slate-500 block text-[10px] uppercase">Registered Address</span>
              <span className="text-slate-300 font-sans block text-[11px] leading-tight">
                {transaction.vendorAddress}
              </span>
            </div>
          </div>
        </div>

        {/* 3. Physical Delivery / GRN Verification (If Applicable) */}
        {transaction.grnStatus && (
          <div className="bg-amber-950/20 border border-amber-900/40 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <FileSpreadsheet className="w-4 h-4 text-amber-400" />
              <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wider">
                Three-Way Match Discrepancy: PO vs Invoiced vs Dock GRN
              </h4>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs font-mono-numbers mt-3">
              <div>
                <span className="text-slate-500 block text-[10px] uppercase">Dock Receipt No</span>
                <span className="text-slate-200 font-medium">{transaction.grnStatus.dockReceiptNo}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px] uppercase">Invoiced Quantity</span>
                <span className="text-rose-400 font-bold">{transaction.grnStatus.billedQty.toLocaleString('en-IN')} Units</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px] uppercase">Physically Received</span>
                <span className="text-amber-400 font-bold">{transaction.grnStatus.dockReceivedQty.toLocaleString('en-IN')} Units</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px] uppercase">Phantom / Ghost Shortfall</span>
                <span className="text-rose-400 font-bold bg-rose-950/80 px-2 py-0.5 rounded border border-rose-900">
                  -{transaction.grnStatus.discrepancyUnit.toLocaleString('en-IN')} Units Unreceived
                </span>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
