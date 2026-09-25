import React, { useState } from 'react';
import { 
  UploadCloud, 
  FileText, 
  Sparkles, 
  ShieldAlert, 
  CheckCircle2, 
  AlertTriangle, 
  TrendingUp, 
  Copy, 
  Split, 
  Building2, 
  DollarSign, 
  FileCheck,
  RefreshCw,
  Cpu
} from 'lucide-react';

export const UploadInvoicePage = ({ onInvoiceUploaded, currentUser }) => {
  const [file, setFile] = useState(null);
  const [formData, setFormData] = useState({
    invoiceNumber: 'INV-2026-9901',
    poNumber: 'PO-2026-8802',
    vendorName: 'Apex Heavy Dynamics Pvt Ltd',
    vendorCategory: 'Mechanical & Heavy Equipment',
    vendorRiskTier: 'CRITICAL',
    vendorIncorporationDays: 45,
    vendorBankRouting: 'HDFC0004921 (Account altered 2 days ago)',
    bankChangedRecently: true,
    itemCode: 'VALVE-TITANIUM-09',
    itemDescription: 'High-Pressure Titanium Control Valve Assembly (3-Inch)',
    quantity: 1,
    unit: 'Unit',
    unitPrice: 195000,
    historicalBaselinePrice: 55000,
    department: 'Refinery Plant Unit 4',
    approverName: 'Sunil Malhotra',
    approverRole: 'Plant Maintenance Lead'
  });

  const [isScanning, setIsScanning] = useState(false);
  const [scanResults, setScanResults] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  const handleFileDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const f = e.dataTransfer.files[0];
      setFile(f);
      // Auto fill sample preview from file name
      setFormData(prev => ({
        ...prev,
        invoiceNumber: `INV-${Math.floor(1000 + Math.random() * 9000)}`
      }));
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : (type === 'number' ? Number(value) : value)
    }));
  };

  const handleRunAiAnalysis = async (e) => {
    e.preventDefault();
    setIsScanning(true);
    setScanResults(null);

    const priceVariancePct = formData.historicalBaselinePrice > 0 
      ? Math.round(((formData.unitPrice - formData.historicalBaselinePrice) / formData.historicalBaselinePrice) * 100)
      : 0;

    const newTxPayload = {
      id: `TXN-${Date.now()}`,
      invoiceNumber: formData.invoiceNumber,
      poNumber: formData.poNumber,
      vendorId: 'VEND-APEX-01',
      vendorName: formData.vendorName,
      vendorCategory: formData.vendorCategory,
      vendorRiskTier: formData.vendorRiskTier,
      vendorIncorporationDays: formData.vendorIncorporationDays,
      vendorGstin: '27AAACA1234F1Z8',
      vendorAddress: 'Plot 42, MIDC Industrial Area, Pune, Maharashtra 411018',
      vendorBankRouting: formData.vendorBankRouting,
      bankChangedRecently: formData.bankChangedRecently,
      itemCode: formData.itemCode,
      itemDescription: formData.itemDescription,
      quantity: formData.quantity,
      unit: formData.unit,
      unitPrice: formData.unitPrice,
      totalAmount: formData.unitPrice * formData.quantity,
      historicalBaselinePrice: formData.historicalBaselinePrice,
      marketIndexPrice: formData.historicalBaselinePrice * 1.05,
      priceVariancePercent: priceVariancePct,
      department: formData.department,
      approverName: formData.approverName,
      approverRole: formData.approverRole,
      submissionDate: new Date().toISOString().split('T')[0],
      paymentDueDate: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
      status: priceVariancePct > 150 ? 'FLAGGED_CRITICAL' : 'UNDER_INVESTIGATION',
      anomalyType: priceVariancePct > 150 ? 'PRICE_SPIKE' : (formData.bankChangedRecently ? 'SHELL_VENDOR_NETWORK' : 'BENIGN_NORMAL'),
      riskScore: Math.min(99, Math.max(15, priceVariancePct > 100 ? 92 : (formData.bankChangedRecently ? 78 : 30))),
      confidenceScore: 96,
      auditFlags: [
        {
          id: `FLAG-${Date.now()}-1`,
          category: 'PRICE',
          severity: priceVariancePct > 150 ? 'CRITICAL' : 'HIGH',
          title: `${(formData.unitPrice / formData.historicalBaselinePrice).toFixed(2)}× Price Surge Detected`,
          description: `Billed price ₹${formData.unitPrice.toLocaleString('en-IN')} vs baseline ₹${formData.historicalBaselinePrice.toLocaleString('en-IN')} (+${priceVariancePct}%)`,
          metric: `Variance +${priceVariancePct}%`,
          statutoryRef: 'GFR Rule 149 Fair Competition'
        }
      ],
      historicalPurchases: [
        { date: '2025-06-10', invoiceNo: 'INV-2025-010', poNo: 'PO-2025-010', unitPrice: formData.historicalBaselinePrice, qty: 1, total: formData.historicalBaselinePrice, vendorName: formData.vendorName, quarter: 'Q2 FY25' }
      ],
      relatedTransactions: []
    };

    try {
      const res = await fetch('/api/v1/fraud-detection/python-analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transactionId: newTxPayload.id, ...newTxPayload })
      });
      const data = await res.json();
      setScanResults(data.pythonForensics || data);

      if (onInvoiceUploaded) {
        onInvoiceUploaded(newTxPayload);
      }
      setToastMessage(`Invoice ${formData.invoiceNumber} scanned and ingested successfully.`);
    } catch (err) {
      console.error(err);
      if (onInvoiceUploaded) {
        onInvoiceUploaded(newTxPayload);
      }
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto py-2">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs rounded-xl flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{toastMessage}</span>
          </div>
          <button onClick={() => setToastMessage(null)} className="hover:text-white">✕</button>
        </div>
      )}

      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-2xl bg-slate-900/80 border border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold font-mono-numbers bg-rose-500/10 text-rose-400 border border-rose-500/30 uppercase">
              AI Document Scanner
            </span>
            <span className="text-xs text-slate-500">Automated Forensic Engine</span>
          </div>
          <h2 className="text-xl font-extrabold text-white mt-1">Upload Invoice & AI Anomaly Detection</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Ingest invoices via PDF/image file upload or manual fields to trigger real-time AI risk analysis and detect unauthorised price spikes.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-slate-950 p-2.5 rounded-xl border border-slate-800 text-xs text-slate-300">
          <Cpu className="w-4 h-4 text-rose-400 shrink-0" />
          <span>Kernel: Empirical Statistical Z-Score</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Upload Form & Drop Zone (7 cols) */}
        <div className="lg:col-span-7 space-y-5">
          
          {/* File Drag & Drop */}
          <div 
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleFileDrop}
            className="p-8 border-2 border-dashed border-slate-800 hover:border-rose-500/50 bg-slate-900/40 hover:bg-slate-900/80 rounded-2xl text-center transition-all cursor-pointer group"
          >
            <input 
              type="file" 
              id="invoice-file" 
              onChange={(e) => e.target.files && setFile(e.target.files[0])}
              className="hidden" 
              accept=".pdf,.png,.jpg,.jpeg,.json"
            />
            <label htmlFor="invoice-file" className="cursor-pointer flex flex-col items-center">
              <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 mb-3 group-hover:scale-110 transition-transform">
                <UploadCloud className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold text-white">
                {file ? file.name : 'Drop Invoice File Here or Click to Browse'}
              </h3>
              <p className="text-xs text-slate-400 mt-1 max-w-sm">
                Supports PDF vouchers, scanned invoice images (PNG/JPG), and JSON payloads up to 10MB.
              </p>
            </label>
          </div>

          {/* Invoice Metadata Fields */}
          <form onSubmit={handleRunAiAnalysis} className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                <FileText className="w-4 h-4 text-rose-400" />
                Invoice & Commercial Line Items
              </h3>
              <span className="text-[10px] text-slate-400 font-mono-numbers">Step 2 of 2</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-medium text-slate-400 mb-1">Invoice Number</label>
                <input 
                  type="text"
                  name="invoiceNumber"
                  value={formData.invoiceNumber}
                  onChange={handleInputChange}
                  required
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-rose-500 font-mono-numbers"
                />
              </div>
              <div>
                <label className="block text-[11px] font-medium text-slate-400 mb-1">Purchase Order (PO Number)</label>
                <input 
                  type="text"
                  name="poNumber"
                  value={formData.poNumber}
                  onChange={handleInputChange}
                  required
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-rose-500 font-mono-numbers"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-400 mb-1">Vendor / Supplier Name</label>
              <input 
                type="text"
                name="vendorName"
                value={formData.vendorName}
                onChange={handleInputChange}
                required
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-rose-500"
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-400 mb-1">Item Description</label>
              <input 
                type="text"
                name="itemDescription"
                value={formData.itemDescription}
                onChange={handleInputChange}
                required
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-rose-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-medium text-slate-400 mb-1">Quantity</label>
                <input 
                  type="number"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleInputChange}
                  min="1"
                  required
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-rose-500 font-mono-numbers"
                />
              </div>
              <div>
                <label className="block text-[11px] font-medium text-slate-400 mb-1">Billed Unit Price (₹)</label>
                <input 
                  type="number"
                  name="unitPrice"
                  value={formData.unitPrice}
                  onChange={handleInputChange}
                  required
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-rose-300 focus:outline-none focus:border-rose-500 font-mono-numbers font-bold"
                />
              </div>
              <div>
                <label className="block text-[11px] font-medium text-slate-400 mb-1">Baseline Price (₹)</label>
                <input 
                  type="number"
                  name="historicalBaselinePrice"
                  value={formData.historicalBaselinePrice}
                  onChange={handleInputChange}
                  required
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-emerald-400 focus:outline-none focus:border-rose-500 font-mono-numbers"
                />
              </div>
            </div>

            <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800 flex items-center justify-between text-xs">
              <span className="text-slate-400">Calculated Billed Price Spike:</span>
              <span className="font-bold text-rose-400 font-mono-numbers">
                +{(formData.historicalBaselinePrice > 0 ? (((formData.unitPrice - formData.historicalBaselinePrice) / formData.historicalBaselinePrice) * 100).toFixed(1) : 0)}%
              </span>
            </div>

            <button
              type="submit"
              disabled={isScanning}
              className="w-full py-3 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-rose-950/60 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isScanning ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Executing Forensic AI Scan...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Run AI Risk Scan & Ingest Invoice</span>
                </>
              )}
            </button>
          </form>

        </div>

        {/* Right Column: AI Risk Detection Results (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-rose-400" />
                AI Risk Detection Output
              </h3>
              <span className="text-[10px] text-emerald-400 font-bold font-mono-numbers">Live Output</span>
            </div>

            {isScanning && (
              <div className="py-12 text-center space-y-3">
                <RefreshCw className="w-8 h-8 text-rose-500 animate-spin mx-auto" />
                <p className="text-xs font-bold text-slate-300">Running Empirical Anomaly Engine...</p>
                <p className="text-[11px] text-slate-500">Checking Benford's Law, Robust Z-score, and Shell Risk Index</p>
              </div>
            )}

            {!isScanning && !scanResults && (
              <div className="py-12 text-center text-slate-500 space-y-2">
                <UploadCloud className="w-8 h-8 mx-auto opacity-40 text-slate-400" />
                <p className="text-xs">Upload an invoice or click "Run AI Risk Scan" to view risk score and anomaly flags.</p>
              </div>
            )}

            {!isScanning && scanResults && (
              <div className="space-y-4 animate-in fade-in duration-300">
                
                {/* Risk Score Header */}
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-mono-numbers font-bold">Computed Fraud Risk</span>
                    <h4 className="text-2xl font-extrabold text-rose-400 font-mono-numbers">
                      {scanResults.computedRiskScore || 94}%
                    </h4>
                  </div>
                  <div className="px-3 py-1.5 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-bold">
                    {scanResults.computedRiskScore >= 75 ? 'CRITICAL RISK' : 'ELEVATED AUDIT'}
                  </div>
                </div>

                {/* Z-Score Statistical Spike */}
                {scanResults.statisticalPriceAnalysis && (
                  <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-1.5">
                    <div className="flex items-center justify-between font-bold">
                      <span className="text-slate-300 flex items-center gap-1.5">
                        <TrendingUp className="w-3.5 h-3.5 text-rose-400" />
                        Statistical Z-Score
                      </span>
                      <span className="text-rose-400 font-mono-numbers">
                        {scanResults.statisticalPriceAnalysis.z_score} σ
                      </span>
                    </div>
                    <div className="flex justify-between text-[11px] text-slate-400">
                      <span>Multiplier: {scanResults.statisticalPriceAnalysis.multiplier}× baseline</span>
                      <span>Variance: +{scanResults.statisticalPriceAnalysis.variance_pct}%</span>
                    </div>
                  </div>
                )}

                {/* Structuring / Anti-Smurfing */}
                {scanResults.structuringAnalysis && (
                  <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-1.5">
                    <div className="flex items-center justify-between font-bold">
                      <span className="text-slate-300 flex items-center gap-1.5">
                        <Split className="w-3.5 h-3.5 text-purple-400" />
                        Split PO Structuring
                      </span>
                      <span className="text-purple-400 font-mono-numbers">
                        {scanResults.structuringAnalysis.threshold_proximity_pct}%
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400">
                      {scanResults.structuringAnalysis.is_tender_evasion_candidate 
                        ? 'Candidate for tender threshold circumvention (SOX 404 / GFR Rule 149)'
                        : 'Compliant with statutory threshold.'}
                    </p>
                  </div>
                )}

                {/* Triggered Flags */}
                <div className="space-y-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono-numbers">
                    Triggered Forensic Heuristics
                  </span>
                  {scanResults.triggeredHeuristicFlags?.map((flag, idx) => (
                    <div key={idx} className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-xs text-rose-200">
                      <div className="font-bold flex items-center justify-between">
                        <span>{flag.rule}</span>
                        <span className="font-mono-numbers font-extrabold">{flag.score}%</span>
                      </div>
                      <p className="text-[11px] text-rose-300/80 mt-1">{flag.evidence}</p>
                    </div>
                  ))}
                </div>

              </div>
            )}

          </div>

        </div>

      </div>

    </div>
  );
};
