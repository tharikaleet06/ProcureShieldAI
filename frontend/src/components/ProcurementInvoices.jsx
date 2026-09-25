import React, { useState } from 'react';
import { 
  Receipt, 
  PlusCircle, 
  Search, 
  Filter, 
  Eye, 
  Edit3, 
  CheckCircle2, 
  X, 
  Building2, 
  FileText, 
  UploadCloud, 
  ArrowRight,
  Cpu,
  ShieldAlert,
  ArrowUpRight,
  Download,
  Printer,
  FileSpreadsheet,
  Paperclip,
  FileCheck
} from 'lucide-react';
import { exportToCSV, downloadReportDossier, printFormattedDossier, downloadInvoiceDocument, downloadAttachedFile } from '../utils/exportUtils';

const INITIAL_INVOICES = [
  {
    id: 'INV1025',
    invoiceNumber: 'INV1025',
    vendorId: 'VEND-ABC-01',
    vendorName: 'ABC Computers',
    poNumber: 'PO1025',
    amount: 800000,
    invoiceDate: '25-09-2026',
    status: 'SUBMITTED',
    analysisStatus: 'FLAGGED',
    documentName: 'INV1025_ABC_Invoice_Scanned.pdf',
    documentSize: '2.1 MB',
    itemDescription: 'Desktop Computers & High Performance Workstations (10 units @ ₹80,000)',
    notes: 'Submitted for corporate disbursement. PO amount is ₹6,50,000.'
  },
  {
    id: 'INV1024',
    invoiceNumber: 'INV1024',
    vendorId: 'VEND-ZENITH-02',
    vendorName: 'Zenith Tech Solutions Pvt Ltd',
    poNumber: 'PO1024',
    amount: 420000,
    invoiceDate: '24-09-2026',
    status: 'APPROVED',
    analysisStatus: 'CLEARED',
    documentName: 'INV1024_Zenith_Rack_Invoice.pdf',
    documentSize: '1.4 MB',
    itemDescription: 'Server Rack Components & Rails',
    notes: '3-way match verified against GRN-2026-991.'
  },
  {
    id: 'INV1020',
    invoiceNumber: 'INV1020',
    vendorId: 'VEND-APEX-03',
    vendorName: 'Apex Heavy Dynamics Pvt Ltd',
    poNumber: 'PO1020',
    amount: 185000,
    invoiceDate: '20-09-2026',
    status: 'FLAGGED',
    analysisStatus: 'FLAGGED',
    documentName: 'INV1020_Apex_HeatExchanger.pdf',
    documentSize: '3.8 MB',
    itemDescription: 'Industrial Titanium Heat Exchanger (1 unit @ ₹1,85,000)',
    notes: 'Price spike detected (+270% over baseline).'
  },
  {
    id: 'INV1019',
    invoiceNumber: 'INV1019',
    vendorId: 'VEND-ABC-01',
    vendorName: 'ABC Computers',
    poNumber: 'PO1019',
    amount: 540000,
    invoiceDate: '19-08-2026',
    status: 'PAID',
    analysisStatus: 'CLEARED',
    documentName: 'INV1019_ABC_Desktops_TaxInv.pdf',
    documentSize: '1.1 MB',
    itemDescription: '10 Standard Desktops',
    notes: 'Settled on 20-08-2026.'
  }
];

export const ProcurementInvoices = ({ currentUser, onToast, onNavigateTab }) => {
  const [invoices, setInvoices] = useState(INITIAL_INVOICES);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Fetch live invoices & transaction data over network
  React.useEffect(() => {
    fetch('/api/transactions', { headers: { 'x-user-role': currentUser?.role || 'ROLE_PROCUREMENT_MANAGER' } })
      .then(res => res.json())
      .catch(e => console.debug('Invoices transactions network fetch:', e));

    fetch('/api/v1/vendors')
      .then(res => res.json())
      .catch(e => console.debug('Invoices vendors fetch:', e));
  }, [currentUser]);

  // Modals
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    invoiceNumber: 'INV1026',
    vendorName: 'ABC Computers',
    poNumber: 'PO1025',
    amount: 800000,
    invoiceDate: '2026-09-25',
    itemDescription: 'Enterprise Desktop Workstations (10 units)',
    status: 'SUBMITTED',
    documentFile: null,
    documentFileName: ''
  });

  const handleAddInvoice = (e) => {
    e.preventDefault();
    if (!formData.documentFileName && !formData.documentFile) {
      onToast('⚠️ Document upload is mandatory. Please attach the supplier invoice scan.');
      return;
    }

    const newInv = {
      id: formData.invoiceNumber,
      invoiceNumber: formData.invoiceNumber,
      vendorId: formData.vendorName.includes('ABC') ? 'VEND-ABC-01' : 'VEND-GEN-01',
      vendorName: formData.vendorName,
      poNumber: formData.poNumber,
      amount: Number(formData.amount),
      invoiceDate: formData.invoiceDate,
      status: formData.status,
      analysisStatus: Number(formData.amount) > 650000 ? 'FLAGGED' : 'CLEARED',
      itemDescription: formData.itemDescription,
      documentName: formData.documentFileName || 'Invoice_Document_Scanned.pdf',
      documentSize: formData.documentFile ? `${(formData.documentFile.size / 1024).toFixed(1)} KB` : '1.9 MB',
      notes: 'Manually ingested and linked with mandatory invoice document.'
    };

    setInvoices([newInv, ...invoices]);
    setIsAddModalOpen(false);
    setFormData({
      invoiceNumber: `INV${1026 + invoices.length + 1}`,
      vendorName: 'ABC Computers',
      poNumber: 'PO1025',
      amount: 800000,
      invoiceDate: '2026-09-25',
      itemDescription: 'Enterprise Desktop Workstations (10 units)',
      status: 'SUBMITTED',
      documentFile: null,
      documentFileName: ''
    });
    onToast(`Invoice #${newInv.invoiceNumber} uploaded with document ${newInv.documentName}.`);
  };

  const handleSubmitForAnalysis = (invId) => {
    onToast(`Invoice #${invId} submitted for AI Statistical & Anomaly Analysis.`);
    setInvoices(invoices.map(inv => {
      if (inv.id === invId) {
        return { ...inv, analysisStatus: inv.amount > 600000 ? 'FLAGGED' : 'CLEARED' };
      }
      return inv;
    }));
  };

  const filteredInvoices = invoices.filter(inv => {
    const matchesSearch = inv.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          inv.vendorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          inv.poNumber.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || inv.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'APPROVED':
      case 'PAID':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      case 'SUBMITTED':
      case 'PENDING':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      case 'FLAGGED':
        return 'bg-rose-500/10 text-rose-400 border-rose-500/30';
      default:
        return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  const handleExportInvoicesCSV = () => {
    const headers = [
      { key: 'invoiceNumber', label: 'Invoice Number' },
      { key: 'vendorName', label: 'Vendor Name' },
      { key: 'poNumber', label: 'Linked PO Number' },
      { key: 'amount', label: 'Billed Amount (INR)' },
      { key: 'invoiceDate', label: 'Invoice Date' },
      { key: 'status', label: 'Disbursement Status' },
      { key: 'analysisStatus', label: 'AI Anomaly Status' },
      { key: 'itemDescription', label: 'Line Description' },
      { key: 'notes', label: 'Audit Notes' }
    ];
    exportToCSV('ProcureLens_Invoices_Registry', headers, filteredInvoices);
    onToast('Invoices registry exported to CSV.');
  };

  const handleDownloadInvoice = (inv) => {
    downloadInvoiceDocument(inv, currentUser);
    onToast(`Downloading official Tax Invoice document for #${inv.invoiceNumber}...`);
  };

  const handleDownloadAttachedFile = (fileName, invId) => {
    downloadAttachedFile(fileName, invId, 'Vendor Tax Invoice Scanned Copy');
    onToast(`Downloading attached invoice file: ${fileName}...`);
  };

  const handlePrintInvoice = (inv) => {
    printFormattedDossier({
      id: inv.invoiceNumber,
      title: `Invoice Voucher: ${inv.invoiceNumber}`,
      target: `${inv.vendorName} (PO #${inv.poNumber})`,
      summary: `Vendor Invoice billed amount ₹${inv.amount.toLocaleString('en-IN')} for ${inv.itemDescription}. Status: ${inv.status} · AI Status: ${inv.analysisStatus}.`,
      score: `STATUS: ${inv.status}`,
      author: currentUser?.name || 'Accounts Payable'
    }, currentUser);
  };

  return (
    <div className="space-y-6">
      
      {/* Banner */}
      <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded text-[10px] font-mono-numbers font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
              INVOICE MANAGEMENT
            </span>
            <span className="text-xs text-slate-400">· 1,185 Invoices (18 Pending Verification)</span>
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">
            Invoices &amp; PO Linking
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Upload supplier invoices, automatically preserve the relational chain (Vendor → PO → Invoice), check billed pricing, and submit for automated AI analysis.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handleExportInvoicesCSV}
            className="px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition-all flex items-center gap-2 cursor-pointer shadow-sm"
            title="Download invoice list as CSV"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
            <span>Export Invoices (CSV)</span>
          </button>

          {currentUser?.role === 'ROLE_PROCUREMENT_MANAGER' && (
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-all flex items-center gap-2 shadow-sm hover:shadow cursor-pointer self-start sm:self-auto"
            >
              <UploadCloud className="w-4 h-4" />
              <span>Upload Invoice Data</span>
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
            placeholder="Search Invoice #, PO #, vendor..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-rose-500 pl-9 font-mono-numbers"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-rose-500 font-mono-numbers"
        >
          <option value="ALL">All Invoice Statuses</option>
          <option value="SUBMITTED">SUBMITTED</option>
          <option value="APPROVED">APPROVED</option>
          <option value="FLAGGED">FLAGGED</option>
          <option value="PAID">PAID</option>
        </select>
      </div>

      {/* Invoices Table */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400 uppercase text-[10px]">
                <th className="py-3 px-4">Invoice #</th>
                <th className="py-3 px-4">Vendor</th>
                <th className="py-3 px-4">Linked PO</th>
                <th className="py-3 px-4">Billed Amount</th>
                <th className="py-3 px-4">Invoice Date</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">AI Analysis</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredInvoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-4 font-mono-numbers font-bold text-white">
                    <div className="flex items-center gap-1.5">
                      <Receipt className="w-3.5 h-3.5 text-slate-400" />
                      <span>{inv.invoiceNumber}</span>
                      {inv.invoiceNumber === 'INV1025' && (
                        <span className="text-[9px] px-1.5 py-0.2 rounded bg-rose-500/20 text-rose-300 font-normal">
                          Active Target
                        </span>
                      )}
                    </div>
                  </td>

                  <td className="py-3 px-4 font-semibold text-slate-200">
                    {inv.vendorName}
                  </td>

                  <td className="py-3 px-4 font-bold text-blue-500">
                    #{inv.poNumber}
                  </td>

                  <td className="py-3 px-4 font-mono-numbers font-bold text-white">
                    <div>₹{inv.amount.toLocaleString('en-IN')}</div>
                    {inv.documentName && (
                      <div className="text-[10px] text-amber-400 font-normal flex items-center gap-1 mt-0.5">
                        <Paperclip className="w-2.5 h-2.5 shrink-0" />
                        <span className="truncate max-w-[120px]">{inv.documentName}</span>
                      </div>
                    )}
                  </td>

                  <td className="py-3 px-4 text-slate-400">
                    {inv.invoiceDate}
                  </td>

                  <td className="py-3 px-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${getStatusBadge(inv.status)}`}>
                      {inv.status}
                    </span>
                  </td>

                  <td className="py-3 px-4">
                    {inv.analysisStatus === 'FLAGGED' ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded border bg-rose-500/10 text-rose-400 border-rose-500/30">
                        <ShieldAlert className="w-3 h-3" />
                        <span>FLAGGED</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded border bg-emerald-500/10 text-emerald-400 border-emerald-500/30">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>CLEARED</span>
                      </span>
                    )}
                  </td>

                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => setSelectedInvoice(inv)}
                        className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1 cursor-pointer border border-transparent"
                      >
                        <Eye className="w-3.5 h-3.5 text-slate-400" />
                        <span>Details</span>
                      </button>

                      {currentUser?.role === 'ROLE_PROCUREMENT_MANAGER' && (
                        <button
                          onClick={() => handleSubmitForAnalysis(inv.id)}
                          className="px-2.5 py-1 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-xs font-semibold transition-colors flex items-center gap-1 cursor-pointer shadow-sm"
                          title="Submit to AI Forensic Pipeline"
                        >
                          <Cpu className="w-3.5 h-3.5" />
                          <span>Analyze</span>
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

      {/* Invoice Details Modal */}
      {selectedInvoice && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="max-w-xl w-full rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-6 space-y-5 animate-in fade-in zoom-in-95 duration-150">
            
            <div className="flex items-start justify-between pb-4 border-b border-slate-800">
              <div>
                <span className="text-[10px] font-mono-numbers text-amber-400 font-bold uppercase block">
                  INVOICE DETAILS &amp; RELATIONSHIP
                </span>
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <span>Invoice #{selectedInvoice.invoiceNumber}</span>
                  <span className={`text-[10px] font-mono-numbers font-bold px-2 py-0.5 rounded border ${getStatusBadge(selectedInvoice.status)}`}>
                    {selectedInvoice.status}
                  </span>
                </h3>
              </div>
              <button onClick={() => setSelectedInvoice(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Relational Chain Visualizer */}
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
              <div className="text-[10px] text-slate-400 uppercase font-mono-numbers font-bold mb-2">
                Automatic Relational Relationship
              </div>
              <div className="flex items-center gap-2 text-xs font-mono-numbers">
                <span className="px-2 py-1 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 font-bold">
                  {selectedInvoice.vendorName}
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-600" />
                <span className="px-2 py-1 rounded bg-blue-500/10 text-blue-300 border border-blue-500/20 font-bold">
                  PO #{selectedInvoice.poNumber}
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-600" />
                <span className="px-2 py-1 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20 font-bold">
                  Invoice #{selectedInvoice.invoiceNumber}
                </span>
              </div>
            </div>

            {/* Amounts */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-slate-400 block text-[10px]">BILLED INVOICE AMOUNT</span>
                <span className="text-xl font-bold text-white font-mono-numbers">
                  ₹{selectedInvoice.amount.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-slate-400 block text-[10px]">INVOICE DATE</span>
                <span className="text-base font-bold text-slate-200 font-mono-numbers">
                  {selectedInvoice.invoiceDate}
                </span>
              </div>
            </div>

            {/* Attached Invoice Document */}
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs gap-3">
              <div className="flex items-center gap-2.5 overflow-hidden">
                <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
                  <Paperclip className="w-4 h-4" />
                </div>
                <div className="overflow-hidden">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">ATTACHED INVOICE SCANNED DOCUMENT</span>
                  <span className="text-white font-bold font-mono-numbers truncate block">{selectedInvoice.documentName || 'Invoice_Document_Scanned.pdf'}</span>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-[10px] text-slate-400 font-mono-numbers bg-slate-900 px-2 py-1 rounded border border-slate-800">
                  {selectedInvoice.documentSize || '2.1 MB'}
                </span>
                <button
                  type="button"
                  onClick={() => handleDownloadAttachedFile(selectedInvoice.documentName || `INV_${selectedInvoice.invoiceNumber}_Scanned.pdf`, selectedInvoice.invoiceNumber)}
                  className="px-2.5 py-1 bg-amber-600/20 hover:bg-amber-600/30 text-amber-300 border border-amber-500/30 rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
                  title="Download attached scanned invoice file"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download</span>
                </button>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 text-xs text-slate-300 space-y-1">
              <div className="font-bold text-slate-200">Item Specification:</div>
              <div>{selectedInvoice.itemDescription}</div>
              <div className="text-[11px] text-slate-400 pt-1 font-mono-numbers">{selectedInvoice.notes}</div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800 flex-wrap">
              <button
                type="button"
                onClick={() => handlePrintInvoice(selectedInvoice)}
                className="px-3.5 py-2 text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 rounded-xl flex items-center gap-1.5 cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5 text-blue-400" />
                <span>Print Invoice</span>
              </button>
              <button
                type="button"
                onClick={() => handleDownloadInvoice(selectedInvoice)}
                className="px-3.5 py-2 text-xs font-bold text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl flex items-center gap-1.5 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-amber-400" />
                <span>Download Document</span>
              </button>
              <button
                type="button"
                onClick={() => setSelectedInvoice(null)}
                className="px-3.5 py-2 text-xs font-semibold text-slate-400 hover:text-white rounded-xl"
              >
                Close
              </button>
              {currentUser?.role === 'ROLE_PROCUREMENT_MANAGER' && (
                <button
                  type="button"
                  onClick={() => {
                    handleSubmitForAnalysis(selectedInvoice.id);
                    setSelectedInvoice(null);
                  }}
                  className="px-4 py-2 text-xs font-bold text-white bg-purple-600 hover:bg-purple-500 rounded-xl shadow-md flex items-center gap-1.5 cursor-pointer"
                >
                  <Cpu className="w-3.5 h-3.5" />
                  <span>Run AI Analysis</span>
                </button>
              )}
            </div>

          </div>
        </div>
      )}

      {/* Add / Upload Invoice Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="max-w-md w-full rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-6 space-y-4 animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <UploadCloud className="w-4 h-4 text-amber-400" />
                <span>Upload Invoice Data</span>
              </h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddInvoice} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Invoice Number</label>
                <input
                  type="text"
                  value={formData.invoiceNumber}
                  onChange={(e) => setFormData({ ...formData, invoiceNumber: e.target.value })}
                  placeholder="INV1026"
                  required
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500 font-mono-numbers"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Select Associated Vendor</label>
                <select
                  value={formData.vendorName}
                  onChange={(e) => setFormData({ ...formData, vendorName: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                >
                  <option value="ABC Computers">ABC Computers (VEND-ABC-01)</option>
                  <option value="Zenith Tech Solutions Pvt Ltd">Zenith Tech Solutions Pvt Ltd</option>
                  <option value="Apex Heavy Dynamics Pvt Ltd">Apex Heavy Dynamics Pvt Ltd</option>
                  <option value="OmniSys Technologies Ltd">OmniSys Technologies Ltd</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Link to PO Number</label>
                  <select
                    value={formData.poNumber}
                    onChange={(e) => setFormData({ ...formData, poNumber: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500 font-mono-numbers"
                  >
                    <option value="PO1025">PO1025 (₹6,50,000)</option>
                    <option value="PO1024">PO1024 (₹4,20,000)</option>
                    <option value="PO1020">PO1020 (₹50,000)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Billed Amount (₹)</label>
                  <input
                    type="number"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    required
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500 font-mono-numbers"
                  />
                </div>
              </div>

              {/* Mandatory Invoice Document Upload */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center justify-between">
                  <span>Official Scanned Invoice Document <span className="text-rose-400 font-bold">* (Mandatory)</span></span>
                  <span className="text-[10px] text-slate-400 font-mono-numbers">PDF, PNG, JPG</span>
                </label>
                <div className="relative border-2 border-dashed border-slate-700 hover:border-amber-500 rounded-xl p-3 bg-slate-950/60 text-center transition-colors">
                  <input
                    type="file"
                    required
                    accept=".pdf,.png,.jpg,.jpeg,.xml"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setFormData({
                          ...formData,
                          documentFile: file,
                          documentFileName: file.name
                        });
                      }
                    }}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <div className="flex flex-col items-center justify-center gap-1 pointer-events-none">
                    <UploadCloud className="w-5 h-5 text-amber-400" />
                    {formData.documentFileName ? (
                      <div className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5 font-mono-numbers">
                        <FileCheck className="w-4 h-4" />
                        <span>{formData.documentFileName}</span>
                      </div>
                    ) : (
                      <>
                        <span className="text-xs text-slate-300 font-medium">Click to upload or drag &amp; drop invoice</span>
                        <span className="text-[10px] text-slate-500">Official vendor bill/tax invoice copy required</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Invoice Date</label>
                <input
                  type="date"
                  value={formData.invoiceDate}
                  onChange={(e) => setFormData({ ...formData, invoiceDate: e.target.value })}
                  required
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500 font-mono-numbers"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Item Description</label>
                <input
                  type="text"
                  value={formData.itemDescription}
                  onChange={(e) => setFormData({ ...formData, itemDescription: e.target.value })}
                  placeholder="Enterprise Workstations (10 units)"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-amber-600 hover:bg-amber-500 rounded-xl shadow-md cursor-pointer"
                >
                  Upload &amp; Link
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
