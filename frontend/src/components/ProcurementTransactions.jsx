import React, { useState } from 'react';
import { 
  ArrowLeftRight, 
  PlusCircle, 
  Search, 
  Filter, 
  Eye, 
  CheckCircle2, 
  X, 
  Building2, 
  FileText, 
  Receipt, 
  Cpu, 
  ShieldAlert, 
  ArrowRight, 
  Sparkles, 
  CreditCard, 
  Scale,
  Download,
  Printer,
  FileSpreadsheet,
  Paperclip,
  UploadCloud,
  FileCheck
} from 'lucide-react';
import { exportToCSV, downloadReportDossier, printFormattedDossier, downloadTransactionDocument, downloadAttachedFile } from '../utils/exportUtils';

const INITIAL_TRANSACTIONS = [
  {
    id: 'TX1025',
    vendorId: 'VEND-ABC-01',
    vendorName: 'ABC Computers',
    poNumber: 'PO1025',
    invoiceNumber: 'INV1025',
    amount: 800000,
    date: '25-09-2026',
    paymentMethod: 'Corporate Wire (RTGS)',
    bankRouting: 'HDFC0001042',
    documentName: 'RTGS_Advice_TX1025_BankProof.pdf',
    documentSize: '1.4 MB',
    analysisStatus: 'FLAGGED',
    riskScore: 87,
    riskLevel: 'HIGH',
    detectedIssues: 'PO-Invoice amount mismatch (+₹1,50,000 variance)',
    investigationStatus: 'UNDER_REVIEW'
  },
  {
    id: 'TX1024',
    vendorId: 'VEND-ZENITH-02',
    vendorName: 'Zenith Tech Solutions Pvt Ltd',
    poNumber: 'PO1024',
    invoiceNumber: 'INV1024',
    amount: 420000,
    date: '24-09-2026',
    paymentMethod: 'NEFT Automated Clearing',
    bankRouting: 'SBIN0000300',
    documentName: 'NEFT_Payment_Advice_TX1024.pdf',
    documentSize: '890 KB',
    analysisStatus: 'CLEARED',
    riskScore: 12,
    riskLevel: 'LOW',
    detectedIssues: 'None (Exact 3-Way Match)',
    investigationStatus: 'RESOLVED'
  },
  {
    id: 'TX1020',
    vendorId: 'VEND-APEX-03',
    vendorName: 'Apex Heavy Dynamics Pvt Ltd',
    poNumber: 'PO1020',
    invoiceNumber: 'INV1020',
    amount: 185000,
    date: '20-09-2026',
    paymentMethod: 'Corporate Wire (RTGS)',
    bankRouting: 'ICIC0009914',
    documentName: 'Bank_Transfer_Slip_TX1020.pdf',
    documentSize: '1.1 MB',
    analysisStatus: 'FLAGGED',
    riskScore: 94,
    riskLevel: 'HIGH',
    detectedIssues: 'Extreme Price Spike (+270% over baseline)',
    investigationStatus: 'UNDER_REVIEW'
  },
  {
    id: 'TX1019',
    vendorId: 'VEND-ABC-01',
    vendorName: 'ABC Computers',
    poNumber: 'PO1019',
    invoiceNumber: 'INV1019',
    amount: 540000,
    date: '20-08-2026',
    paymentMethod: 'Corporate Wire (RTGS)',
    bankRouting: 'HDFC0001042',
    documentName: 'Corporate_Disbursal_Advice_TX1019.pdf',
    documentSize: '1.2 MB',
    analysisStatus: 'CLEARED',
    riskScore: 14,
    riskLevel: 'LOW',
    detectedIssues: 'None (Matches Contract)',
    investigationStatus: 'RESOLVED'
  },
  {
    id: 'TX1012',
    vendorId: 'VEND-ABC-01',
    vendorName: 'ABC Computers',
    poNumber: 'PO1012',
    invoiceNumber: 'INV1012',
    amount: 510000,
    date: '05-08-2026',
    paymentMethod: 'Corporate Wire (RTGS)',
    bankRouting: 'HDFC0001042',
    documentName: 'Disbursement_Receipt_TX1012.pdf',
    documentSize: '950 KB',
    analysisStatus: 'CLEARED',
    riskScore: 15,
    riskLevel: 'LOW',
    detectedIssues: 'None',
    investigationStatus: 'RESOLVED'
  }
];

export const ProcurementTransactions = ({ currentUser, onToast, onOpenInvestigation }) => {
  const [transactions, setTransactions] = useState(INITIAL_TRANSACTIONS);
  const [searchQuery, setSearchQuery] = useState('');
  const [analysisFilter, setAnalysisFilter] = useState('ALL');

  // Fetch live transaction records over network
  React.useEffect(() => {
    fetch('/api/transactions', { headers: { 'x-user-role': currentUser?.role || 'ROLE_PROCUREMENT_MANAGER' } })
      .then(res => res.json())
      .catch(e => console.debug('Transactions network fetch:', e));
  }, [currentUser]);

  // Modals
  const [selectedTx, setSelectedTx] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    vendorName: 'ABC Computers',
    poNumber: 'PO1025',
    invoiceNumber: 'INV1025',
    amount: 800000,
    date: '2026-09-25',
    paymentMethod: 'Corporate Wire (RTGS)',
    bankRouting: 'HDFC0001042',
    documentFileName: '',
    documentFileSize: ''
  });

  const handleCreateTransaction = (e) => {
    e.preventDefault();

    if (!formData.documentFileName) {
      onToast('⚠️ Mandatory bank disbursal advice / transaction document upload is required.');
      return;
    }

    const newTx = {
      id: `TX${1025 + transactions.length + 1}`,
      vendorId: formData.vendorName.includes('ABC') ? 'VEND-ABC-01' : 'VEND-GEN-01',
      vendorName: formData.vendorName,
      poNumber: formData.poNumber,
      invoiceNumber: formData.invoiceNumber,
      amount: Number(formData.amount),
      date: formData.date,
      paymentMethod: formData.paymentMethod,
      bankRouting: formData.bankRouting,
      documentName: formData.documentFileName,
      documentSize: formData.documentFileSize || '1.5 MB',
      analysisStatus: 'PENDING',
      riskScore: 0,
      riskLevel: 'PENDING',
      detectedIssues: 'Awaiting AI Analysis Submission',
      investigationStatus: 'DRAFT'
    };

    setTransactions([newTx, ...transactions]);
    setIsCreateModalOpen(false);
    setFormData({
      vendorName: 'ABC Computers',
      poNumber: 'PO1025',
      invoiceNumber: 'INV1025',
      amount: 800000,
      date: '2026-09-25',
      paymentMethod: 'Corporate Wire (RTGS)',
      bankRouting: 'HDFC0001042',
      documentFileName: '',
      documentFileSize: ''
    });
    onToast(`Transaction ${newTx.id} created with verified document attached. Ready for AI analysis.`);
  };

  const handleRunAiAnalysis = (txId) => {
    onToast(`Running multi-model AI Analysis on Transaction #${txId}...`);
    setTimeout(() => {
      setTransactions(prev => prev.map(t => {
        if (t.id === txId) {
          const isHigh = t.amount >= 650000;
          const updated = {
            ...t,
            analysisStatus: isHigh ? 'FLAGGED' : 'CLEARED',
            riskScore: isHigh ? 87 : 15,
            riskLevel: isHigh ? 'HIGH' : 'LOW',
            detectedIssues: isHigh ? 'PO–Invoice amount mismatch & price variance' : 'Clean match against baseline',
            investigationStatus: isHigh ? 'UNDER_REVIEW' : 'RESOLVED'
          };
          onToast(isHigh 
            ? `⚠️ Transaction #${txId} FLAGGED by AI (Score ${updated.riskScore}/100) — Routed to Auditor Queue.` 
            : `✓ Transaction #${txId} Cleared by AI.`);
          return updated;
        }
        return t;
      }));
    }, 600);
  };

  const filteredTxns = transactions.filter(t => {
    const matchesSearch = t.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          t.vendorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          t.poNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          t.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesAnalysis = analysisFilter === 'ALL' || t.analysisStatus === analysisFilter;
    return matchesSearch && matchesAnalysis;
  });

  const handleExportTxCSV = () => {
    const headers = [
      { key: 'id', label: 'Transaction ID' },
      { key: 'vendorName', label: 'Vendor Name' },
      { key: 'poNumber', label: 'PO Number' },
      { key: 'invoiceNumber', label: 'Invoice Number' },
      { key: 'amount', label: 'Disbursement Amount (INR)' },
      { key: 'date', label: 'Transaction Date' },
      { key: 'paymentMethod', label: 'Payment Method' },
      { key: 'bankRouting', label: 'Bank / Routing Reference' },
      { key: 'documentName', label: 'Supporting Document File' },
      { key: 'analysisStatus', label: 'AI Status' },
      { key: 'riskScore', label: 'Risk Score' },
      { key: 'riskLevel', label: 'Risk Level' },
      { key: 'detectedIssues', label: 'Detected Issues' },
      { key: 'investigationStatus', label: 'Investigation Status' }
    ];
    exportToCSV('ProcureLens_Transactions_Ledger', headers, filteredTxns);
    onToast('Transactions ledger exported to CSV.');
  };

  const handleDownloadTxReceipt = (tx) => {
    downloadTransactionDocument(tx, currentUser);
    onToast(`Downloading official Disbursement Voucher for #${tx.id}...`);
  };

  const handleDownloadAttachedFile = (fileName, txId) => {
    downloadAttachedFile(fileName, txId, 'Bank Payment Voucher & Wire Advice');
    onToast(`Downloading attached payment advice: ${fileName}...`);
  };

  const handlePrintTxReceipt = (tx) => {
    printFormattedDossier({
      id: tx.id,
      title: `Transaction Voucher: ${tx.id}`,
      target: `${tx.vendorName} (PO #${tx.poNumber} / INV #${tx.invoiceNumber})`,
      summary: `Financial disbursement totaling ₹${tx.amount.toLocaleString('en-IN')} via ${tx.paymentMethod}. Supporting File: ${tx.documentName || 'DisbursalAdvice.pdf'}. AI Risk Score: ${tx.riskScore}/100. Signals: ${tx.detectedIssues}.`,
      score: `STATUS: ${tx.analysisStatus}`,
      author: currentUser?.name || 'Finance Lead'
    }, currentUser);
  };

  return (
    <div className="space-y-6">
      
      {/* Banner */}
      <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded text-[10px] font-mono-numbers font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              TRANSACTION PIPELINE
            </span>
            <span className="text-xs text-slate-400">· 1,150 Total Transactions (45 Awaiting Analysis)</span>
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">
            Transactions &amp; AI Analysis Queue
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Record disbursement transactions linked to Vendors, POs, and Invoices. Upload mandatory bank disbursal documentation and submit transactions for empirical AI analysis.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handleExportTxCSV}
            className="px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition-all flex items-center gap-2 cursor-pointer shadow-sm"
            title="Download transaction ledger as CSV"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
            <span>Export Ledger (CSV)</span>
          </button>

          {currentUser?.role === 'ROLE_PROCUREMENT_MANAGER' && (
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all flex items-center gap-2 shadow-lg shadow-emerald-950/50 cursor-pointer self-start sm:self-auto"
            >
              <PlusCircle className="w-4 h-4" />
              <span>New Transaction</span>
            </button>
          )}
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
            placeholder="Search TX ID, vendor, PO, invoice..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 pl-9 font-mono-numbers"
          />
        </div>

        <select
          value={analysisFilter}
          onChange={(e) => setAnalysisFilter(e.target.value)}
          className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-emerald-500 font-mono-numbers"
        >
          <option value="ALL">All Analysis Statuses</option>
          <option value="FLAGGED">FLAGGED (Auditor Queue)</option>
          <option value="CLEARED">CLEARED</option>
          <option value="PENDING">PENDING ANALYSIS</option>
        </select>
      </div>

      {/* Transactions Table */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400 font-mono-numbers uppercase text-[10px]">
                <th className="py-3 px-4">Transaction ID</th>
                <th className="py-3 px-4">Vendor</th>
                <th className="py-3 px-4">PO &amp; Invoice Link</th>
                <th className="py-3 px-4">Disbursement Amount</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Analysis Status</th>
                <th className="py-3 px-4">Detected Signals</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredTxns.map((tx) => (
                <tr key={tx.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-4 font-mono-numbers font-bold text-white">
                    <div className="flex items-center gap-1.5">
                      <ArrowLeftRight className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{tx.id}</span>
                      {tx.id === 'TX1025' && (
                        <span className="text-[9px] px-1.5 py-0.2 rounded bg-rose-500/20 text-rose-300 font-normal">
                          Target Case
                        </span>
                      )}
                    </div>
                  </td>

                  <td className="py-3 px-4 font-semibold text-slate-200">
                    <div>{tx.vendorName}</div>
                    {tx.documentName && (
                      <div className="flex items-center gap-1 text-[10px] text-slate-400 font-normal mt-0.5">
                        <Paperclip className="w-2.5 h-2.5 text-emerald-400" />
                        <span className="truncate max-w-[140px]">{tx.documentName}</span>
                      </div>
                    )}
                  </td>

                  <td className="py-3 px-4 font-mono-numbers text-[11px]">
                    <span className="text-blue-400 font-bold">#{tx.poNumber}</span>
                    <span className="text-slate-500 mx-1">/</span>
                    <span className="text-amber-400 font-bold">#{tx.invoiceNumber}</span>
                  </td>

                  <td className="py-3 px-4 font-mono-numbers font-bold text-white">
                    <div>₹{tx.amount.toLocaleString('en-IN')}</div>
                    <div className="text-[10px] text-slate-400 font-normal">{tx.paymentMethod}</div>
                  </td>

                  <td className="py-3 px-4 font-mono-numbers text-slate-400">
                    {tx.date}
                  </td>

                  <td className="py-3 px-4">
                    {tx.analysisStatus === 'FLAGGED' ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded border bg-rose-500/10 text-rose-400 border-rose-500/30">
                        <ShieldAlert className="w-3 h-3" />
                        <span>FLAGGED ({tx.riskScore}/100)</span>
                      </span>
                    ) : tx.analysisStatus === 'CLEARED' ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded border bg-emerald-500/10 text-emerald-400 border-emerald-500/30">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>CLEARED</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded border bg-purple-500/10 text-purple-400 border-purple-500/30">
                        <Cpu className="w-3 h-3" />
                        <span>AWAITING AI</span>
                      </span>
                    )}
                  </td>

                  <td className="py-3 px-4 text-slate-300 text-[11px]">
                    {tx.detectedIssues}
                  </td>

                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => setSelectedTx(tx)}
                        className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1 cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5 text-emerald-400" />
                        <span>View</span>
                      </button>

                      {tx.analysisStatus === 'PENDING' && currentUser?.role === 'ROLE_PROCUREMENT_MANAGER' && (
                        <button
                          onClick={() => handleRunAiAnalysis(tx.id)}
                          className="px-2.5 py-1 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-xs font-bold transition-all shadow-sm flex items-center gap-1 cursor-pointer"
                        >
                          <Cpu className="w-3.5 h-3.5" />
                          <span>Analyze</span>
                        </button>
                      )}

                      {tx.analysisStatus === 'FLAGGED' && (
                        <button
                          onClick={() => {
                            if (onOpenInvestigation) onOpenInvestigation(tx);
                          }}
                          className="px-2.5 py-1 bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-500/30 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1 cursor-pointer"
                          title="View Auditor Investigation"
                        >
                          <Scale className="w-3.5 h-3.5" />
                          <span>Auditor Review</span>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Transaction Details Modal */}
      {selectedTx && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="max-w-xl w-full rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-6 space-y-5 animate-in fade-in zoom-in-95 duration-150">
            
            <div className="flex items-start justify-between pb-4 border-b border-slate-800">
              <div>
                <span className="text-[10px] font-mono-numbers text-emerald-400 font-bold uppercase block">
                  TRANSACTION SPECIFICATION
                </span>
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <span>Transaction #{selectedTx.id}</span>
                  <span className={`text-[10px] font-mono-numbers font-bold px-2 py-0.5 rounded border ${
                    selectedTx.analysisStatus === 'FLAGGED' ? 'bg-rose-500/10 text-rose-400 border-rose-500/30' : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                  }`}>
                    {selectedTx.analysisStatus}
                  </span>
                </h3>
              </div>
              <button onClick={() => setSelectedTx(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Relational Mapping */}
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="text-[10px] text-slate-400 uppercase font-mono-numbers font-bold">
                Relational Mapping:
              </div>
              <div className="grid grid-cols-3 gap-2 text-xs font-mono-numbers text-center">
                <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                  <span className="text-[9px] text-slate-500 block">VENDOR</span>
                  <span className="font-bold text-cyan-300">{selectedTx.vendorName}</span>
                </div>
                <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                  <span className="text-[9px] text-slate-500 block">PURCHASE ORDER</span>
                  <span className="font-bold text-blue-300">#{selectedTx.poNumber}</span>
                </div>
                <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                  <span className="text-[9px] text-slate-500 block">INVOICE</span>
                  <span className="font-bold text-amber-300">#{selectedTx.invoiceNumber}</span>
                </div>
              </div>
            </div>

            {/* Attached Disbursal Document Proof */}
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 flex-shrink-0">
                  <Paperclip className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white flex items-center gap-1.5">
                    <span>{selectedTx.documentName || 'Bank_Disbursement_Advice.pdf'}</span>
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono-numbers">
                      VERIFIED ATTACHMENT
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Mandatory Disbursal Proof · {selectedTx.documentSize || '1.4 MB'} · Digital Audit Vault
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleDownloadAttachedFile(selectedTx.documentName || `TX_${selectedTx.id}_BankProof.pdf`, selectedTx.id)}
                className="px-2.5 py-1.5 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
                title="Download attached payment advice file"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download</span>
              </button>
            </div>

            {/* Payment & Banking */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-slate-400 block text-[10px]">PAYMENT AMOUNT</span>
                <span className="text-xl font-bold text-white font-mono-numbers">
                  ₹{selectedTx.amount.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-slate-400 block text-[10px]">METHOD &amp; ROUTING</span>
                <span className="font-bold text-slate-200 block">{selectedTx.paymentMethod}</span>
                <span className="text-[10px] text-slate-400 font-mono-numbers">{selectedTx.bankRouting}</span>
              </div>
            </div>

            {/* Analysis Note */}
            <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-300 space-y-1">
              <div className="font-bold text-slate-200">AI Analysis Signals:</div>
              <div>{selectedTx.detectedIssues}</div>
              {selectedTx.analysisStatus === 'FLAGGED' && (
                <div className="text-[11px] text-rose-400 pt-1 font-semibold">
                  ⚠️ Note: Procurement Manager cannot make the final audit decision. This transaction has been routed to the Auditor for investigation.
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800 flex-wrap">
              <button
                type="button"
                onClick={() => handlePrintTxReceipt(selectedTx)}
                className="px-3.5 py-2 text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 rounded-xl flex items-center gap-1.5 cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5 text-blue-400" />
                <span>Print Voucher</span>
              </button>
              <button
                type="button"
                onClick={() => handleDownloadTxReceipt(selectedTx)}
                className="px-3.5 py-2 text-xs font-bold text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl flex items-center gap-1.5 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-emerald-400" />
                <span>Download Document</span>
              </button>
              <button
                type="button"
                onClick={() => setSelectedTx(null)}
                className="px-3.5 py-2 text-xs font-semibold text-slate-400 hover:text-white rounded-xl"
              >
                Close
              </button>
              {selectedTx.analysisStatus === 'PENDING' ? (
                <button
                  type="button"
                  onClick={() => {
                    handleRunAiAnalysis(selectedTx.id);
                    setSelectedTx(null);
                  }}
                  className="px-4 py-2 text-xs font-bold text-white bg-purple-600 hover:bg-purple-500 rounded-xl shadow-md flex items-center gap-1.5 cursor-pointer"
                >
                  <Cpu className="w-3.5 h-3.5" />
                  <span>Submit for Analysis</span>
                </button>
              ) : selectedTx.analysisStatus === 'FLAGGED' ? (
                <button
                  type="button"
                  onClick={() => {
                    setSelectedTx(null);
                    if (onOpenInvestigation) onOpenInvestigation(selectedTx);
                  }}
                  className="px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-500 rounded-xl shadow-md flex items-center gap-1.5 cursor-pointer"
                >
                  <Scale className="w-3.5 h-3.5" />
                  <span>Open in AuditLens</span>
                </button>
              ) : null}
            </div>

          </div>
        </div>
      )}

      {/* New Transaction Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="max-w-md w-full rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-6 space-y-4 animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <PlusCircle className="w-4 h-4 text-emerald-400" />
                <span>Create New Transaction</span>
              </h3>
              <button onClick={() => setIsCreateModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateTransaction} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Vendor</label>
                <select
                  value={formData.vendorName}
                  onChange={(e) => setFormData({ ...formData, vendorName: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="ABC Computers">ABC Computers (VEND-ABC-01)</option>
                  <option value="Zenith Tech Solutions Pvt Ltd">Zenith Tech Solutions Pvt Ltd</option>
                  <option value="Apex Heavy Dynamics Pvt Ltd">Apex Heavy Dynamics Pvt Ltd</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">PO Link</label>
                  <select
                    value={formData.poNumber}
                    onChange={(e) => setFormData({ ...formData, poNumber: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono-numbers"
                  >
                    <option value="PO1025">PO1025</option>
                    <option value="PO1024">PO1024</option>
                    <option value="PO1020">PO1020</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Invoice Link</label>
                  <select
                    value={formData.invoiceNumber}
                    onChange={(e) => setFormData({ ...formData, invoiceNumber: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono-numbers"
                  >
                    <option value="INV1025">INV1025</option>
                    <option value="INV1024">INV1024</option>
                    <option value="INV1020">INV1020</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Disbursement Amount (₹)</label>
                  <input
                    type="number"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    required
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono-numbers"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Transaction Date</label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    required
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono-numbers"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Payment Method</label>
                <select
                  value={formData.paymentMethod}
                  onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="Corporate Wire (RTGS)">Corporate Wire (RTGS)</option>
                  <option value="NEFT Automated Clearing">NEFT Automated Clearing</option>
                  <option value="Direct ACH Disbursement">Direct ACH Disbursement</option>
                </select>
              </div>

              {/* Mandatory Document Upload */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-semibold text-slate-300">
                    Supporting Payment Document / Bank Advice
                  </label>
                  <span className="text-[10px] text-amber-400 font-bold bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20">
                    * Mandatory
                  </span>
                </div>
                <div className="relative border-2 border-dashed border-slate-700 hover:border-emerald-500 rounded-xl p-3.5 bg-slate-950/60 text-center transition-all group">
                  <input
                    type="file"
                    required
                    accept=".pdf,.doc,.docx,.png,.jpg,.jpeg,.xml,.csv"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setFormData({
                          ...formData,
                          documentFileName: file.name,
                          documentFileSize: `${(file.size / 1024).toFixed(1)} KB`
                        });
                      }
                    }}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  />
                  {formData.documentFileName ? (
                    <div className="flex items-center justify-center gap-2 text-emerald-400">
                      <FileCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                      <div className="text-left">
                        <p className="text-xs font-bold text-white truncate max-w-[240px]">
                          {formData.documentFileName}
                        </p>
                        <p className="text-[10px] text-emerald-400 font-mono-numbers">
                          {formData.documentFileSize} · Attached for Audit Trail
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center gap-1 text-slate-400 group-hover:text-slate-200">
                      <UploadCloud className="w-5 h-5 text-slate-400 group-hover:text-emerald-400 transition-colors" />
                      <p className="text-xs font-medium text-slate-300">
                        <span className="text-emerald-400 font-bold underline">Click to upload</span> or drag payment voucher
                      </p>
                      <p className="text-[10px] text-slate-500">
                        PDF, DOCX, RTGS Receipt, Scanned Bank Slip (Max 25MB)
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl shadow-md cursor-pointer flex items-center gap-1.5"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>Create Transaction &amp; Stage</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
