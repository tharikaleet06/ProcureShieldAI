import React, { useState } from 'react';
import { 
  FileText, 
  PlusCircle, 
  Search, 
  Filter, 
  Eye, 
  Edit3, 
  CheckCircle2, 
  X, 
  Building2, 
  Receipt, 
  Layers, 
  Calendar,
  IndianRupee,
  Trash2,
  AlertCircle
} from 'lucide-react';

const INITIAL_POS = [
  {
    id: 'PO1025',
    vendorId: 'VEND-ABC-01',
    vendorName: 'ABC Computers',
    date: '25-09-2026',
    status: 'APPROVED',
    associatedInvoice: 'INV1025',
    items: [
      { name: 'Desktop Computer', quantity: 10, unitPrice: 50000, total: 500000 },
      { name: 'Monitor', quantity: 10, unitPrice: 15000, total: 150000 }
    ],
    totalAmount: 650000,
    department: 'Corporate IT Infrastructure',
    notes: 'Approved standard desktop & monitor workstation refresh.'
  },
  {
    id: 'PO1024',
    vendorId: 'VEND-ZENITH-02',
    vendorName: 'Zenith Tech Solutions Pvt Ltd',
    date: '24-09-2026',
    status: 'COMPLETED',
    associatedInvoice: 'INV1024',
    items: [
      { name: 'Server Rack Components', quantity: 4, unitPrice: 105000, total: 420000 }
    ],
    totalAmount: 420000,
    department: 'Data Center Operations',
    notes: 'Completed delivery and certified GRN.'
  },
  {
    id: 'PO1023',
    vendorId: 'VEND-OMNI-04',
    vendorName: 'OmniSys Technologies Ltd',
    date: '22-09-2026',
    status: 'PENDING',
    associatedInvoice: null,
    items: [
      { name: 'Office High-Speed Laser Printers', quantity: 5, unitPrice: 45000, total: 225000 }
    ],
    totalAmount: 225000,
    department: 'General Administration',
    notes: 'Awaiting finance officer pre-approval.'
  },
  {
    id: 'PO1022',
    vendorId: 'VEND-APEX-03',
    vendorName: 'Apex Heavy Dynamics Pvt Ltd',
    date: '20-09-2026',
    status: 'APPROVED',
    associatedInvoice: 'INV1020',
    items: [
      { name: 'Industrial Titanium Heat Exchanger', quantity: 1, unitPrice: 50000, total: 50000 }
    ],
    totalAmount: 50000,
    department: 'Chemical Engineering Plant 4',
    notes: 'Standard contract rate.'
  },
  {
    id: 'PO1021',
    vendorId: 'VEND-ABC-01',
    vendorName: 'ABC Computers',
    date: '15-09-2026',
    status: 'DRAFT',
    associatedInvoice: null,
    items: [
      { name: 'Wireless Ergonomic Mice & Keyboards', quantity: 50, unitPrice: 2000, total: 100000 }
    ],
    totalAmount: 100000,
    department: 'Corporate IT Infrastructure',
    notes: 'Draft specification.'
  }
];

export const ProcurementPurchaseOrders = ({ currentUser, onToast, onNavigateTab }) => {
  const [pos, setPos] = useState(INITIAL_POS);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Modals
  const [selectedPO, setSelectedPO] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingPO, setEditingPO] = useState(null);

  // New PO Form State
  const [formData, setFormData] = useState({
    vendorName: 'ABC Computers',
    date: '2026-09-25',
    status: 'APPROVED',
    department: 'Corporate IT Infrastructure',
    items: [
      { name: 'Desktop Computer', quantity: 10, unitPrice: 50000 },
      { name: 'Monitor', quantity: 10, unitPrice: 15000 }
    ]
  });

  const handleAddItem = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { name: '', quantity: 1, unitPrice: 0 }]
    });
  };

  const handleRemoveItem = (index) => {
    const updated = formData.items.filter((_, i) => i !== index);
    setFormData({ ...formData, items: updated });
  };

  const handleItemChange = (index, field, value) => {
    const updated = [...formData.items];
    updated[index][field] = field === 'quantity' || field === 'unitPrice' ? Number(value) : value;
    setFormData({ ...formData, items: updated });
  };

  const calculateFormTotal = () => {
    return formData.items.reduce((sum, it) => sum + (it.quantity * it.unitPrice), 0);
  };

  const handleCreatePO = (e) => {
    e.preventDefault();
    const calculatedItems = formData.items.map(it => ({
      ...it,
      total: it.quantity * it.unitPrice
    }));
    const totalAmount = calculatedItems.reduce((sum, it) => sum + it.total, 0);

    const newPO = {
      id: `PO${1025 + pos.length + 1}`,
      vendorId: formData.vendorName.includes('ABC') ? 'VEND-ABC-01' : 'VEND-GEN-01',
      vendorName: formData.vendorName,
      date: formData.date,
      status: formData.status,
      associatedInvoice: null,
      items: calculatedItems,
      totalAmount,
      department: formData.department,
      notes: 'Created via Procurement Manager Workbench.'
    };

    setPos([newPO, ...pos]);
    setIsCreateModalOpen(false);
    onToast(`Purchase Order ${newPO.id} created for ${newPO.vendorName} (₹${totalAmount.toLocaleString('en-IN')})`);
  };

  const handleStatusChange = (poId, newStatus) => {
    setPos(pos.map(p => {
      if (p.id === poId) {
        onToast(`PO #${poId} status changed to ${newStatus}`);
        return { ...p, status: newStatus };
      }
      return p;
    }));
  };

  const filteredPOs = pos.filter(po => {
    const matchesSearch = po.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          po.vendorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          po.department.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || po.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'APPROVED':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      case 'PENDING':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      case 'COMPLETED':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/30';
      case 'DRAFT':
        return 'bg-slate-800 text-slate-400 border-slate-700';
      case 'CANCELLED':
        return 'bg-rose-500/10 text-rose-400 border-rose-500/30';
      default:
        return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded text-[10px] font-mono-numbers font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">
              PURCHASE ORDERS
            </span>
            <span className="text-xs text-slate-400">· 1,240 Total POs (32 Pending)</span>
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">
            Purchase Order Management
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Create and maintain purchase orders, configure item line pricing, track approval statuses (DRAFT, PENDING, APPROVED, COMPLETED, CANCELLED), and associate with invoices.
          </p>
        </div>

        {currentUser?.role === 'ROLE_PROCUREMENT_MANAGER' && (
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all flex items-center gap-2 shadow-lg shadow-blue-950/50 cursor-pointer self-start sm:self-auto"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Create New PO</span>
          </button>
        )}
      </div>

      {/* Filter and Search */}
      <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search PO #, vendor, department..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 pl-9 font-mono-numbers"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-blue-500 font-mono-numbers"
        >
          <option value="ALL">All PO Statuses</option>
          <option value="DRAFT">DRAFT</option>
          <option value="PENDING">PENDING</option>
          <option value="APPROVED">APPROVED</option>
          <option value="COMPLETED">COMPLETED</option>
          <option value="CANCELLED">CANCELLED</option>
        </select>
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400 font-mono-numbers uppercase text-[10px]">
                <th className="py-3 px-4">PO Number</th>
                <th className="py-3 px-4">Vendor</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Items Summary</th>
                <th className="py-3 px-4">Total Amount</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Associated Invoice</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredPOs.map((po) => (
                <tr key={po.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-4 font-mono-numbers font-bold text-white">
                    <div className="flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5 text-blue-400" />
                      <span>{po.id}</span>
                      {po.id === 'PO1025' && (
                        <span className="text-[9px] px-1.5 py-0.2 rounded bg-rose-500/20 text-rose-300 font-normal">
                          Active Target
                        </span>
                      )}
                    </div>
                  </td>

                  <td className="py-3 px-4 font-semibold text-slate-200">
                    {po.vendorName}
                  </td>

                  <td className="py-3 px-4 font-mono-numbers text-slate-400">
                    {po.date}
                  </td>

                  <td className="py-3 px-4 text-slate-300">
                    <span className="text-[11px]">
                      {po.items.map(i => `${i.name} (${i.quantity})`).join(', ')}
                    </span>
                  </td>

                  <td className="py-3 px-4 font-mono-numbers font-bold text-white">
                    ₹{po.totalAmount.toLocaleString('en-IN')}
                  </td>

                  <td className="py-3 px-4">
                    <select
                      value={po.status}
                      disabled={currentUser?.role !== 'ROLE_PROCUREMENT_MANAGER'}
                      onChange={(e) => handleStatusChange(po.id, e.target.value)}
                      className={`text-[10px] font-mono-numbers font-bold px-2 py-0.5 rounded border ${getStatusBadge(po.status)} bg-slate-950 cursor-pointer focus:outline-none disabled:cursor-not-allowed`}
                    >
                      <option value="DRAFT">DRAFT</option>
                      <option value="PENDING">PENDING</option>
                      <option value="APPROVED">APPROVED</option>
                      <option value="COMPLETED">COMPLETED</option>
                      <option value="CANCELLED">CANCELLED</option>
                    </select>
                  </td>

                  <td className="py-3 px-4 font-mono-numbers">
                    {po.associatedInvoice ? (
                      <span className="text-amber-400 font-bold flex items-center gap-1">
                        <Receipt className="w-3.5 h-3.5" />
                        {po.associatedInvoice}
                      </span>
                    ) : (
                      <span className="text-slate-500 text-[10px]">None linked</span>
                    )}
                  </td>

                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => setSelectedPO(po)}
                      className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5 text-blue-400" />
                      <span>View PO</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* PO View Modal */}
      {selectedPO && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="max-w-xl w-full rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-6 space-y-5 animate-in fade-in zoom-in-95 duration-150">
            
            <div className="flex items-start justify-between pb-4 border-b border-slate-800">
              <div>
                <span className="text-[10px] font-mono-numbers text-blue-400 font-bold uppercase block">
                  PURCHASE ORDER DETAILS
                </span>
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <span>PO #{selectedPO.id}</span>
                  <span className={`text-[10px] font-mono-numbers font-bold px-2 py-0.5 rounded border ${getStatusBadge(selectedPO.status)}`}>
                    {selectedPO.status}
                  </span>
                </h3>
              </div>
              <button onClick={() => setSelectedPO(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-slate-400 block text-[10px]">VENDOR</span>
                <span className="font-bold text-white">{selectedPO.vendorName}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-slate-400 block text-[10px]">DATE</span>
                <span className="font-mono-numbers font-bold text-white">{selectedPO.date}</span>
              </div>
            </div>

            {/* Line Items Table */}
            <div>
              <div className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 font-mono-numbers">
                Line Items Breakdown:
              </div>
              <div className="rounded-xl border border-slate-800 overflow-hidden bg-slate-950">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-800 bg-slate-900 text-slate-400 font-mono-numbers text-[10px]">
                      <th className="py-2 px-3">Item Description</th>
                      <th className="py-2 px-3">Quantity</th>
                      <th className="py-2 px-3">Unit Price</th>
                      <th className="py-2 px-3 text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {selectedPO.items.map((it, idx) => (
                      <tr key={idx}>
                        <td className="py-2 px-3 text-white font-semibold">{it.name}</td>
                        <td className="py-2 px-3 font-mono-numbers text-slate-300">{it.quantity}</td>
                        <td className="py-2 px-3 font-mono-numbers text-slate-300">₹{it.unitPrice.toLocaleString('en-IN')}</td>
                        <td className="py-2 px-3 font-mono-numbers text-white font-bold text-right">₹{it.total.toLocaleString('en-IN')}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="border-t border-slate-800 bg-slate-900/60 font-bold">
                      <td colSpan={3} className="py-2.5 px-3 text-white">Grand Total</td>
                      <td className="py-2.5 px-3 text-right font-mono-numbers text-blue-400 text-sm">
                        ₹{selectedPO.totalAmount.toLocaleString('en-IN')}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            {/* Associated Invoice */}
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
              <span className="text-slate-400">Associated Linked Invoice:</span>
              <span className="font-mono-numbers font-bold text-amber-400">
                {selectedPO.associatedInvoice ? `#${selectedPO.associatedInvoice}` : 'None linked'}
              </span>
            </div>

          </div>
        </div>
      )}

      {/* Create PO Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="max-w-lg w-full rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-6 space-y-4 animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <PlusCircle className="w-4 h-4 text-blue-400" />
                <span>Create Purchase Order</span>
              </h3>
              <button onClick={() => setIsCreateModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreatePO} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Vendor</label>
                <select
                  value={formData.vendorName}
                  onChange={(e) => setFormData({ ...formData, vendorName: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="ABC Computers">ABC Computers (VEND-ABC-01)</option>
                  <option value="Zenith Tech Solutions Pvt Ltd">Zenith Tech Solutions Pvt Ltd</option>
                  <option value="Apex Heavy Dynamics Pvt Ltd">Apex Heavy Dynamics Pvt Ltd</option>
                  <option value="OmniSys Technologies Ltd">OmniSys Technologies Ltd</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">PO Date</label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    required
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500 font-mono-numbers"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Initial Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500 font-mono-numbers"
                  >
                    <option value="APPROVED">APPROVED</option>
                    <option value="PENDING">PENDING</option>
                    <option value="DRAFT">DRAFT</option>
                  </select>
                </div>
              </div>

              {/* Items Section */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-semibold text-slate-300">Purchase Order Line Items</label>
                  <button
                    type="button"
                    onClick={handleAddItem}
                    className="text-[11px] text-blue-400 hover:text-blue-300 font-bold"
                  >
                    + Add Item Line
                  </button>
                </div>

                <div className="space-y-2">
                  {formData.items.map((item, idx) => (
                    <div key={idx} className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center gap-2">
                      <input
                        type="text"
                        placeholder="Item Description"
                        value={item.name}
                        onChange={(e) => handleItemChange(idx, 'name', e.target.value)}
                        required
                        className="flex-1 bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white"
                      />
                      <input
                        type="number"
                        placeholder="Qty"
                        value={item.quantity}
                        onChange={(e) => handleItemChange(idx, 'quantity', e.target.value)}
                        required
                        className="w-16 bg-slate-900 border border-slate-800 rounded-lg px-2 py-1.5 text-xs text-white font-mono-numbers"
                      />
                      <input
                        type="number"
                        placeholder="Unit Price"
                        value={item.unitPrice}
                        onChange={(e) => handleItemChange(idx, 'unitPrice', e.target.value)}
                        required
                        className="w-24 bg-slate-900 border border-slate-800 rounded-lg px-2 py-1.5 text-xs text-white font-mono-numbers"
                      />
                      {formData.items.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveItem(idx)}
                          className="text-slate-500 hover:text-rose-400"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                <div className="mt-2 text-right text-xs text-slate-400 font-mono-numbers">
                  Calculated PO Total: <span className="text-sm font-bold text-blue-400">₹{calculateFormTotal().toLocaleString('en-IN')}</span>
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
                  className="px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 rounded-xl shadow-md cursor-pointer"
                >
                  Issue Purchase Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
