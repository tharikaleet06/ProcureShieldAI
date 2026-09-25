import React, { useEffect } from 'react';
import { 
  X, 
  ShieldAlert, 
  Printer, 
  Download, 
  CheckCircle2, 
  AlertTriangle, 
  Lock, 
  Scale, 
  Clock, 
  Building2, 
  IndianRupee,
  FileCheck2,
  ExternalLink,
  Copy
} from 'lucide-react';

export const EvidenceReportModal = ({
  isOpen = true,
  report,
  transaction,
  isLoading,
  onClose,
  onApplyFreeze
}) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose?.();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || (!report && !isLoading)) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleCopySummary = () => {
    if (report) {
      navigator.clipboard.writeText(
        `[PROCURELENS FORENSIC DOSSIER]\nCase: ${report.caseId}\nVerdict: ${report.riskVerdict} (${report.overallRiskScore}%)\nExposure: ₹${report.financialExposure.potentialLossLeakage.toLocaleString('en-IN')}\n\nSummary:\n${report.executiveSummary}`
      );
      alert('Case dossier summary copied to clipboard for audit file.');
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md overflow-y-auto"
      onClick={onClose}
    >
      <div 
        className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 bg-slate-900/90 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm sm:text-base font-bold text-white tracking-tight">
                  Evidence-Based Forensic Investigation Report
                </h3>
                <span className="text-[10px] font-mono-numbers px-2 py-0.5 rounded bg-rose-950/80 text-rose-400 border border-rose-900">
                  {report?.caseId || 'GENERATING CASE DOSSIER...'}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Autonomous Anomaly Decomposition & Explainable Risk Assessment
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {report && (
              <>
                <button
                  onClick={handleCopySummary}
                  className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-md transition-colors"
                  title="Copy Executive Summary"
                >
                  <Copy className="w-4 h-4" />
                </button>
                <button
                  onClick={handlePrint}
                  className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-md transition-colors"
                  title="Print / Save PDF"
                >
                  <Printer className="w-4 h-4" />
                </button>
              </>
            )}
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-md transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Body Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-slate-200">
          {isLoading ? (
            <div className="py-20 flex flex-col items-center justify-center text-center">
              <div className="w-12 h-12 border-3 border-rose-500/20 border-t-rose-500 rounded-full animate-spin mb-4" />
              <h4 className="text-sm font-semibold text-white">Synthesizing Forensic Audit Evidence...</h4>
              <p className="text-xs text-slate-400 max-w-sm mt-1">
                Decomposing multi-quarter baseline pricing, testing duplicate invoice fingerprints, and evaluating GFR / SOX statutory compliance.
              </p>
            </div>
          ) : report ? (
            <>
              {/* Verdict Banner */}
              <div className="p-4 rounded-xl bg-gradient-to-r from-rose-950/40 to-slate-900 border border-rose-900/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-rose-400 uppercase tracking-wider">
                      Forensic Audit Verdict
                    </span>
                    <span className="text-slate-500">·</span>
                    <span className="text-xs font-mono-numbers text-slate-400">
                      Evaluated: {new Date(report.generatedAt).toLocaleString()}
                    </span>
                  </div>
                  <h2 className="text-xl font-extrabold text-white tracking-tight mt-0.5">
                    {report.riskVerdict}
                  </h2>
                  <p className="text-xs text-slate-300 mt-1">
                    Direct Financial Exposure at Risk: <span className="font-bold text-rose-300 font-mono-numbers">₹{report.financialExposure.potentialLossLeakage.toLocaleString('en-IN')}</span> (Claimed ₹{report.financialExposure.claimedInvoiceAmount.toLocaleString('en-IN')} vs Justified ₹{report.financialExposure.justifiedBaselineAmount.toLocaleString('en-IN')})
                  </p>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <div className="text-right">
                    <span className="text-[10px] uppercase tracking-wider text-slate-400 block">AI Risk Index</span>
                    <span className="text-2xl font-bold font-mono-numbers text-rose-400">
                      {report.overallRiskScore}%
                    </span>
                  </div>
                  <div className="w-14 h-14 rounded-xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center font-bold text-lg font-mono-numbers text-rose-300">
                    {report.overallRiskScore}
                  </div>
                </div>
              </div>

              {/* Killer Feature Answer: "Why is this transaction suspicious?" */}
              <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-5">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                  <h4 className="text-xs font-bold uppercase tracking-wider text-rose-300">
                    Why is this transaction suspicious? (Forensic Assessment)
                  </h4>
                </div>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
                  {report.executiveSummary}
                </p>

                {/* Primary Violation Points */}
                {report.primaryViolations && report.primaryViolations.length > 0 && (
                  <div className="mt-4 pt-3 border-t border-slate-800/80">
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-2">
                      Primary Statutory & Control Infringements:
                    </span>
                    <ul className="space-y-1.5 text-xs text-rose-200/90 font-medium">
                      {report.primaryViolations.map((v, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-rose-400 font-bold shrink-0">✕</span>
                          <span>{v}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Evidence Sections */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Itemized Evidence & Empirical Discrepancy Breakdown
                </h4>

                {report.evidenceSections.map((sec, idx) => (
                  <div key={idx} className="bg-slate-950/60 border border-slate-800 rounded-xl p-4">
                    <div className="mb-3">
                      <h5 className="text-xs font-bold text-white tracking-tight">{sec.title}</h5>
                      <p className="text-[11px] text-slate-400">{sec.subtitle}</p>
                    </div>

                    {/* Metrics Grid */}
                    {sec.evidenceMetrics && sec.evidenceMetrics.length > 0 && (
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-3 p-3 rounded-lg bg-slate-900 border border-slate-800/80">
                        {sec.evidenceMetrics.map((m, mi) => (
                          <div key={mi} className="text-xs font-mono-numbers">
                            <span className="text-slate-500 block text-[10px] uppercase truncate">{m.label}</span>
                            <span className={`font-bold block ${
                              m.impact === 'BAD' ? 'text-rose-400' : m.impact === 'GOOD' ? 'text-emerald-400' : 'text-slate-200'
                            }`}>
                              {m.value}
                            </span>
                            {m.variance && (
                              <span className="text-[10px] text-slate-400 block mt-0.5">{m.variance}</span>
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Findings Bullet Points */}
                    <ul className="space-y-1 text-xs text-slate-300">
                      {sec.findings.map((f, fi) => (
                        <li key={fi} className="flex items-start gap-2">
                          <span className="text-slate-500 font-bold shrink-0 mt-0.5">·</span>
                          <span className="leading-relaxed">{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              {/* Statutory Citations */}
              {report.statutoryCitations && report.statutoryCitations.length > 0 && (
                <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Scale className="w-4 h-4 text-cyan-400" />
                    <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                      Statutory Citations & Legal Standard Violations
                    </h4>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {report.statutoryCitations.map((cite, i) => (
                      <div key={i} className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-xs">
                        <span className="font-mono-numbers font-bold text-cyan-400 block">
                          {cite.code}
                        </span>
                        <span className="font-semibold text-slate-200 block mt-0.5">
                          {cite.title}
                        </span>
                        <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                          {cite.relevance}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Recommended Action Plan */}
              <div className="bg-rose-950/20 border border-rose-900/40 rounded-xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <FileCheck2 className="w-4 h-4 text-rose-400" />
                    <h4 className="text-xs font-bold text-rose-300 uppercase tracking-wider">
                      Mandated Forensic Action Plan Before Payment Release
                    </h4>
                  </div>
                  <span className="text-[10px] text-rose-400 font-mono-numbers uppercase">
                    Zero Leakage Enforcement
                  </span>
                </div>

                <div className="space-y-2">
                  {report.recommendedActions.map((act, i) => (
                    <div
                      key={i}
                      className="p-2.5 rounded-lg bg-slate-900/90 border border-slate-800 flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-3">
                        <span className={`text-[10px] font-bold font-mono-numbers px-2 py-0.5 rounded border ${
                          act.priority === 'IMMEDIATE'
                            ? 'bg-rose-950 text-rose-400 border-rose-900'
                            : 'bg-amber-950 text-amber-400 border-amber-900'
                        }`}>
                          {act.priority}
                        </span>
                        <div>
                          <span className="text-slate-100 font-medium block">{act.action}</span>
                          <span className="text-[10px] text-slate-500">
                            Assignee: {act.assignee} · System: {act.targetSystem}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Digital Chain of Custody */}
              <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono-numbers pt-2 border-t border-slate-800">
                <span>Auditor Agent: {report.analyst}</span>
                <span>Evidence Hash: {report.chainOfCustodyHash}</span>
              </div>
            </>
          ) : null}
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-900 flex items-center justify-between gap-3">
          <div className="text-xs text-slate-400 hidden sm:block">
            Status: <span className="text-slate-200 font-medium">{transaction?.status}</span>
          </div>

          <div className="flex items-center gap-2 ml-auto">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
            >
              Close Dossier
            </button>

            <button
              onClick={() => {
                onApplyFreeze();
                onClose();
              }}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-500 rounded-lg shadow-md shadow-rose-950/60 transition-colors"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Enforce Immediate Payment Freeze</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
