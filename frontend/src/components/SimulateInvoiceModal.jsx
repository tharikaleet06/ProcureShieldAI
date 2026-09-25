import React, { useState } from 'react';
import { X, Sparkles, PlusCircle, AlertTriangle, ShieldCheck } from 'lucide-react';

export const SimulateInvoiceModal = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  if (!isOpen) return null;

  const [formData, setFormData] = useState({
    vendorName: 'Apex Heavy Dynamics Pvt Ltd',
    vendorCategory: 'Mechanical & Heavy Equipment',
    vendorIncorporationDays: 1420,
    vendorBankRouting: 'UTIB0009912 (Changed 3d ago)',
    bankChangedRecently: true,
    itemCode: 'CMP-TX-902',
    itemDescription: 'Industrial Grade Titanium Heat Exchanger Core (TX-902)',
    quantity: 1,
    unit: 'Unit',
    unitPrice: 185000,
    historicalBaselinePrice: 50000,
    department: 'Plant Operations & Refinery Unit 3',
    approverName: 'Sunil Malhotra',
    approverRole: 'Plant Maintenance Supervisor'
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Preset scenarios
  const applyPreset = (preset) => {
    switch (preset) {
      case '3X_PRICE_SPIKE':
        setFormData({
          vendorName: 'Apex Heavy Dynamics Pvt Ltd',
          vendorCategory: 'Mechanical & Heavy Equipment',
          vendorIncorporationDays: 1420,
          vendorBankRouting: 'UTIB0009912 (Changed 3d ago)',
          bankChangedRecently: true,
          itemCode: 'CMP-TX-902',
          itemDescription: 'Industrial Grade Titanium Heat Exchanger Core (TX-902)',
          quantity: 1,
          unit: 'Unit',
          unitPrice: 185000,
          historicalBaselinePrice: 50000,
          department: 'Plant Operations & Refinery Unit 3',
          approverName: 'Sunil Malhotra',
          approverRole: 'Plant Maintenance Supervisor'
        });
        break;
      case 'SHELL_COMPANY':
        setFormData({
          vendorName: 'Starlight Global Advisory LLP',
          vendorCategory: 'Consulting & Strategic Advisory',
          vendorIncorporationDays: 14,
          vendorBankRouting: 'YESB0000412',
          bankChangedRecently: false,
          itemCode: 'SRV-CONS-DIG',
          itemDescription: 'Turnaround Digital Transformation Advisory Retainer',
          quantity: 1,
          unit: 'Retainer Fee',
          unitPrice: 950000,
          historicalBaselinePrice: 0,
          department: 'Executive Strategy Office',
          approverName: 'Vikas Singhal',
          approverRole: 'Managing Director'
        });
        break;
      case 'CLEAN_BASELINE':
        setFormData({
          vendorName: 'Siemens Industrial Drives Ltd',
          vendorCategory: 'Motors & Power Electronics',
          vendorIncorporationDays: 4500,
          vendorBankRouting: 'DEUT0002144',
          bankChangedRecently: false,
          itemCode: 'VFD-DRV-150KW',
          itemDescription: 'Variable Frequency Inverter Drive 150kW IP54',
          quantity: 2,
          unit: 'Units',
          unitPrice: 145000,
          historicalBaselinePrice: 145000,
          department: 'Electrical Engineering Hub',
          approverName: 'Anil Deshmukh',
          approverRole: 'Chief Electrical Engineer'
        });
        break;
      default:
        break;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/transactions/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (data.success && data.transaction) {
        onSuccess(data.transaction);
        onClose();
      }
    } catch (err) {
      console.error(err);
      alert('Failed to simulate invoice. Check server logs.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const variance = formData.historicalBaselinePrice > 0
    ? Math.round(((formData.unitPrice - formData.historicalBaselinePrice) / formData.historicalBaselinePrice) * 100)
    : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400">
              <PlusCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">
                Simulate & Ingest Test Invoice
              </h3>
              <p className="text-xs text-slate-400">
                Test how the AI anomaly detection engine scores price spikes and shell behavior
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-md transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Presets */}
        <div className="px-6 py-3 bg-slate-950/60 border-b border-slate-800 flex items-center gap-2 overflow-x-auto text-xs">
          <span className="text-slate-500 font-medium shrink-0">Quick Scenarios:</span>
          <button
            type="button"
            onClick={() => applyPreset('3X_PRICE_SPIKE')}
            className="px-2.5 py-1 bg-rose-950/70 hover:bg-rose-900 text-rose-300 border border-rose-800/80 rounded transition-colors shrink-0"
          >
            3.7× Price Spike (Canonical Case)
          </button>
          <button
            type="button"
            onClick={() => applyPreset('SHELL_COMPANY')}
            className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 rounded transition-colors shrink-0"
          >
            14-Day Shell Vendor (₹9.5L)
          </button>
          <button
            type="button"
            onClick={() => applyPreset('CLEAN_BASELINE')}
            className="px-2.5 py-1 bg-emerald-950/60 hover:bg-emerald-900 text-emerald-300 border border-emerald-800/60 rounded transition-colors shrink-0"
          >
            Legitimate Baseline (0% Spike)
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Vendor Name
              </label>
              <input
                type="text"
                value={formData.vendorName}
                onChange={(e) => setFormData({ ...formData, vendorName: e.target.value })}
                required
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-rose-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Vendor Category
              </label>
              <input
                type="text"
                value={formData.vendorCategory}
                onChange={(e) => setFormData({ ...formData, vendorCategory: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-rose-500"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Item / Component Description
              </label>
              <input
                type="text"
                value={formData.itemDescription}
                onChange={(e) => setFormData({ ...formData, itemDescription: e.target.value })}
                required
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-rose-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Historical Baseline Unit Price (₹)
              </label>
              <input
                type="number"
                value={formData.historicalBaselinePrice}
                onChange={(e) => setFormData({ ...formData, historicalBaselinePrice: Number(e.target.value) })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white font-mono-numbers focus:outline-none focus:border-rose-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center justify-between">
                <span>Current Invoiced Unit Price (₹)</span>
                {variance !== 0 && (
                  <span className={`text-[10px] font-mono-numbers ${variance > 50 ? 'text-rose-400 font-bold' : 'text-emerald-400'}`}>
                    {variance > 0 ? `+${variance}%` : `${variance}%`}
                  </span>
                )}
              </label>
              <input
                type="number"
                value={formData.unitPrice}
                onChange={(e) => setFormData({ ...formData, unitPrice: Number(e.target.value) })}
                required
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white font-mono-numbers focus:outline-none focus:border-rose-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Quantity
              </label>
              <input
                type="number"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: Number(e.target.value) })}
                min="1"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white font-mono-numbers focus:outline-none focus:border-rose-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Vendor Incorporation Age (Days)
              </label>
              <input
                type="number"
                value={formData.vendorIncorporationDays}
                onChange={(e) => setFormData({ ...formData, vendorIncorporationDays: Number(e.target.value) })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white font-mono-numbers focus:outline-none focus:border-rose-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Department
              </label>
              <input
                type="text"
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-rose-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Approver Name
              </label>
              <input
                type="text"
                value={formData.approverName}
                onChange={(e) => setFormData({ ...formData, approverName: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-rose-500"
              />
            </div>
          </div>

          {/* Checkboxes */}
          <div className="pt-2 border-t border-slate-800">
            <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300">
              <input
                type="checkbox"
                checked={formData.bankChangedRecently}
                onChange={(e) => setFormData({ ...formData, bankChangedRecently: e.target.checked })}
                className="rounded border-slate-700 bg-slate-950 text-rose-600 focus:ring-rose-500"
              />
              <span>Beneficiary Bank settlement account was modified within the last 7 days</span>
            </label>
          </div>

          {/* Action buttons */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-500 rounded-lg shadow-md transition-colors disabled:opacity-50"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isSubmitting ? 'Ingesting & Analyzing...' : 'Run Real-Time Anomaly Audit'}</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
