import React, { useState } from 'react';
import { 
  Building2, 
  PlusCircle, 
  Search, 
  Filter, 
  Eye, 
  Edit3, 
  CheckCircle2, 
  X, 
  Phone, 
  Mail, 
  MapPin, 
  FileText, 
  Receipt, 
  ArrowLeftRight,
  ShieldCheck,
  TrendingUp,
  Tag,
  Download,
  Printer,
  FileSpreadsheet
} from 'lucide-react';
import { exportToCSV, downloadReportDossier, printFormattedDossier } from '../utils/exportUtils';

const INITIAL_VENDORS = [
  {
    id: 'VEND-ABC-01',
    vendorName: 'ABC Computers',
    contactPerson: 'Rajesh Sharma',
    email: 'contact@abccomputers.in',
    phone: '+91 98201 54321',
    address: 'Plot 12, Nehru Place Commercial Complex, New Delhi 110019',
    category: 'IT Hardware & Enterprise Workstations',
    registrationDetails: 'GSTIN: 07AABCA1234F1Z8 | PAN: AABCA1234F | Reg: MSME-DL-01-0042',
    status: 'Active',
    totalPOs: 18,
    totalInvoices: 16,
    totalTransactions: 15,
    totalProcurementValue: '₹1,24,50,000',
    recentPOs: [
      { id: 'PO1025', date: '25-09-2026', amount: '₹6,50,000', status: 'APPROVED', items: '10 Desktops @ ₹50,000, 10 Monitors @ ₹15,000' },
      { id: 'PO1019', date: '18-08-2026', amount: '₹5,40,000', status: 'COMPLETED', items: '10 Desktops @ ₹54,000' },
      { id: 'PO1012', date: '01-08-2026', amount: '₹5,10,000', status: 'COMPLETED', items: '10 Desktops @ ₹51,000' }
    ],
    recentInvoices: [
      { id: 'INV1025', po: 'PO1025', date: '25-09-2026', amount: '₹8,00,000', status: 'SUBMITTED' },
      { id: 'INV1019', po: 'PO1019', date: '19-08-2026', amount: '₹5,40,000', status: 'PAID' },
      { id: 'INV1012', po: 'PO1012', date: '03-08-2026', amount: '₹5,10,000', status: 'PAID' }
    ],
    transactionHistory: [
      { id: 'TX1025', date: '25-09-2026', amount: '₹8,00,000', status: 'FLAGGED' },
      { id: 'TX1019', date: '20-08-2026', amount: '₹5,40,000', status: 'CLEARED' },
      { id: 'TX1012', date: '05-08-2026', amount: '₹5,10,000', status: 'CLEARED' },
      { id: 'TX1005', date: '15-07-2026', amount: '₹4,90,000', status: 'CLEARED' },
      { id: 'TX0998', date: '01-06-2026', amount: '₹5,20,000', status: 'CLEARED' }
    ]
  },
  {
    id: 'VEND-ZENITH-02',
    vendorName: 'Zenith Tech Solutions Pvt Ltd',
    contactPerson: 'Aditi Deshmukh',
    email: 'info@zenithtech.com',
    phone: '+91 99880 11223',
    address: 'Plot 42, Hinjewadi Phase 1, Pune, Maharashtra 411057',
    category: 'Electronics & Enterprise Computing',
    registrationDetails: 'GSTIN: 27AABCZ9021L1Z5 | PAN: AABCZ9021L | Reg: ISO-9001:2015',
    status: 'Active',
    totalPOs: 42,
    totalInvoices: 40,
    totalTransactions: 39,
    totalProcurementValue: '₹3,85,00,000',
    recentPOs: [
      { id: 'PO1024', date: '24-09-2026', amount: '₹4,20,000', status: 'COMPLETED', items: 'Server Rack Components' }
    ],
    recentInvoices: [
      { id: 'INV1024', po: 'PO1024', date: '24-09-2026', amount: '₹4,20,000', status: 'APPROVED' }
    ],
    transactionHistory: [
      { id: 'TX1024', date: '24-09-2026', amount: '₹4,20,000', status: 'CLEARED' }
    ]
  },
  {
    id: 'VEND-APEX-03',
    vendorName: 'Apex Heavy Dynamics Pvt Ltd',
    contactPerson: 'Rajeev Mehta',
    email: 'vendor@apexheavy.com',
    phone: '+91 91234 56789',
    address: 'Electronic City Phase 2, Bangalore, Karnataka 560100',
    category: 'Heavy Industrial Machinery & Heat Exchangers',
    registrationDetails: 'GSTIN: 29AABCA8812K1Z9 | PAN: AABCA8812K | Reg: RoC-BLR-2025',
    status: 'Active',
    totalPOs: 12,
    totalInvoices: 10,
    totalTransactions: 9,
    totalProcurementValue: '₹95,00,000',
    recentPOs: [
      { id: 'PO1020', date: '20-09-2026', amount: '₹1,85,000', status: 'PENDING', items: 'Titanium Heat Exchanger' }
    ],
    recentInvoices: [
      { id: 'INV1020', po: 'PO1020', date: '20-09-2026', amount: '₹1,85,000', status: 'FLAGGED' }
    ],
    transactionHistory: [
      { id: 'TX1020', date: '20-09-2026', amount: '₹1,85,000', status: 'FLAGGED' }
    ]
  },
  {
    id: 'VEND-OMNI-04',
    vendorName: 'OmniSys Technologies Ltd',
    contactPerson: 'Sunil Gavaskar',
    email: 'support@omnisys.in',
    phone: '+91 98450 99887',
    address: 'MIDC Andheri East, Mumbai, Maharashtra 400093',
    category: 'Enterprise IT & Office Hardware',
    registrationDetails: 'GSTIN: 27AAABO5541C1ZU | PAN: AAABO5541C | Reg: NSE/BSE Listed',
    status: 'Active',
    totalPOs: 65,
    totalInvoices: 63,
    totalTransactions: 60,
    totalProcurementValue: '₹5,10,00,000',
    recentPOs: [
      { id: 'PO1015', date: '15-09-2026', amount: '₹8,50,000', status: 'COMPLETED', items: 'Networking Switches' }
    ],
    recentInvoices: [
      { id: 'INV1015', po: 'PO1015', date: '16-09-2026', amount: '₹8,50,000', status: 'PAID' }
    ],
    transactionHistory: [
      { id: 'TX1015', date: '18-09-2026', amount: '₹8,50,000', status: 'CLEARED' }
    ]
  }
];

export const ProcurementVendors = ({ currentUser, onToast }) => {
  const [vendors, setVendors] = useState(INITIAL_VENDORS);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  
  // Fetch vendors from backend API on mount
  React.useEffect(() => {
    fetch('/api/v1/vendors')
      .then(res => res.json())
      .then(data => {
        if (data && data.success && Array.isArray(data.vendors) && data.vendors.length > 0) {
          // Connected to backend
        }
      })
      .catch(e => console.debug('Vendors network fetch notice:', e));
  }, []);

  // Modals
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingVendor, setEditingVendor] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    vendorName: '',
    contactPerson: '',
    email: '',
    phone: '',
    address: '',
    category: 'IT Hardware & Enterprise Workstations',
    registrationDetails: '',
    status: 'Active'
  });

  const handleAddVendor = (e) => {
    e.preventDefault();
    if (!formData.vendorName.trim() || !formData.email.trim()) {
      alert('Please fill in mandatory fields');
      return;
    }

    const newVendor = {
      id: `VEND-${Date.now().toString().slice(-4)}`,
      ...formData,
      totalPOs: 0,
      totalInvoices: 0,
      totalTransactions: 0,
      totalProcurementValue: '₹0',
      recentPOs: [],
      recentInvoices: [],
      transactionHistory: []
    };

    setVendors([newVendor, ...vendors]);
    setIsAddModalOpen(false);
    setFormData({
      vendorName: '',
      contactPerson: '',
      email: '',
      phone: '',
      address: '',
      category: 'IT Hardware & Enterprise Workstations',
      registrationDetails: '',
      status: 'Active'
    });
    onToast(`Vendor ${newVendor.vendorName} onboarded successfully!`);
  };

  const handleUpdateVendor = (e) => {
    e.preventDefault();
    if (!editingVendor) return;
    setVendors(vendors.map(v => v.id === editingVendor.id ? { ...editingVendor } : v));
    onToast(`Updated details for vendor ${editingVendor.vendorName}`);
    setEditingVendor(null);
  };

  const filteredVendors = vendors.filter(v => {
    const matchesSearch = v.vendorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          v.contactPerson.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          v.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          v.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = categoryFilter === 'ALL' || v.category.includes(categoryFilter);
    return matchesSearch && matchesCat;
  });

  const handleExportVendorsCSV = () => {
    const headers = [
      { key: 'id', label: 'Vendor ID' },
      { key: 'vendorName', label: 'Vendor Name' },
      { key: 'contactPerson', label: 'Contact Person' },
      { key: 'email', label: 'Email' },
      { key: 'phone', label: 'Phone' },
      { key: 'category', label: 'Category' },
      { key: 'registrationDetails', label: 'KYC & Statutory Reg' },
      { key: 'status', label: 'Status' },
      { key: 'totalPOs', label: 'Total POs' },
      { key: 'totalInvoices', label: 'Total Invoices' },
      { key: 'totalTransactions', label: 'Total Transactions' },
      { key: 'totalProcurementValue', label: 'Total Cumulative Spend' }
    ];
    exportToCSV('ProcureLens_Vendor_Master_Directory', headers, filteredVendors);
    onToast('Vendor master directory exported to CSV.');
  };

  const handleDownloadVendorProfile = (v) => {
    downloadReportDossier({
      id: v.id,
      title: `Vendor Master Profile Dossier: ${v.vendorName}`,
      target: `${v.vendorName} (${v.category})`,
      summary: `Registered vendor with ${v.totalPOs} POs, ${v.totalInvoices} Invoices, and ${v.totalTransactions} Transactions. Cumulative Spend: ${v.totalProcurementValue}. Statutory: ${v.registrationDetails}. Contact: ${v.contactPerson} (${v.phone}, ${v.email}).`,
      score: v.totalProcurementValue,
      author: currentUser?.name || 'Vendor Relations Officer'
    }, currentUser);
    onToast(`Downloaded vendor dossier for ${v.vendorName}.`);
  };

  const handlePrintVendorProfile = (v) => {
    printFormattedDossier({
      id: v.id,
      title: `Vendor Master Record: ${v.vendorName}`,
      target: `${v.vendorName} (${v.category})`,
      summary: `Official Vendor KYC & Statutory Profile. Cumulative procurement spend: ${v.totalProcurementValue}. Active POs: ${v.totalPOs}. Status: ${v.status}.`,
      score: `STATUS: ${v.status}`,
      author: currentUser?.name || 'Procurement Governance'
    }, currentUser);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded text-[10px] font-mono-numbers font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
              VENDOR DIRECTORY
            </span>
            <span className="text-xs text-slate-400">· 148 Active Registered Vendors</span>
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">
            Vendor Master Management
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Register new suppliers, view KYC &amp; statutory registrations, track procurement volume, and inspect historical transaction baselines.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handleExportVendorsCSV}
            className="px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition-all flex items-center gap-2 cursor-pointer shadow-sm"
            title="Download full vendor master directory as CSV"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
            <span>Export Directory (CSV)</span>
          </button>

          {currentUser?.role === 'ROLE_PROCUREMENT_MANAGER' && (
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold transition-all flex items-center gap-2 shadow-lg shadow-cyan-950/50 cursor-pointer self-start sm:self-auto"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Add New Vendor</span>
            </button>
          )}
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search vendor name, ID, contact, email..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 pl-9 font-mono-numbers"
          />
        </div>

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-cyan-500"
        >
          <option value="ALL">All Categories</option>
          <option value="Hardware">IT Hardware</option>
          <option value="Electronics">Electronics</option>
          <option value="Industrial">Heavy Industrial</option>
        </select>
      </div>

      {/* Vendors Table */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400 font-mono-numbers uppercase text-[10px]">
                <th className="py-3 px-4">Vendor ID / Name</th>
                <th className="py-3 px-4">Contact Person</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Total Volume</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredVendors.map((vendor) => (
                <tr key={vendor.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-bold text-xs shrink-0">
                        <Building2 className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-bold text-white flex items-center gap-1.5">
                          <span>{vendor.vendorName}</span>
                          {vendor.vendorName.includes('ABC Computers') && (
                            <span className="text-[9px] px-1.5 py-0.2 rounded bg-rose-500/20 text-rose-300 font-normal">
                              Active Case
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-slate-400 font-mono-numbers">{vendor.id}</span>
                      </div>
                    </div>
                  </td>

                  <td className="py-3 px-4">
                    <div className="font-semibold text-slate-200">{vendor.contactPerson}</div>
                    <div className="text-[10px] text-slate-400 font-mono-numbers">{vendor.email}</div>
                  </td>

                  <td className="py-3 px-4 text-slate-300">
                    <span className="px-2 py-0.5 rounded text-[10px] bg-slate-950 border border-slate-800 text-slate-300">
                      {vendor.category}
                    </span>
                  </td>

                  <td className="py-3 px-4 font-mono-numbers font-bold text-emerald-400">
                    {vendor.totalProcurementValue}
                  </td>

                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold border bg-emerald-500/10 text-emerald-400 border-emerald-500/30">
                      {vendor.status}
                    </span>
                  </td>

                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => setSelectedVendor(vendor)}
                        className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1 cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Details</span>
                      </button>

                      {currentUser?.role === 'ROLE_PROCUREMENT_MANAGER' && (
                        <button
                          onClick={() => setEditingVendor({ ...vendor })}
                          className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                          title="Edit Vendor"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
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

      {/* Vendor Details Modal */}
      {selectedVendor && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="max-w-2xl w-full rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-6 space-y-5 animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
            
            {/* Header */}
            <div className="flex items-start justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-bold">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">{selectedVendor.vendorName}</h3>
                  <p className="text-xs text-slate-400 font-mono-numbers">{selectedVendor.id} · {selectedVendor.category}</p>
                </div>
              </div>
              <button onClick={() => setSelectedVendor(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Vendor Master KPI Summary */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-center">
                <span className="text-[10px] text-slate-400 block font-mono-numbers">TOTAL POS</span>
                <span className="text-xl font-bold text-blue-400 font-mono-numbers">{selectedVendor.totalPOs}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-center">
                <span className="text-[10px] text-slate-400 block font-mono-numbers">TOTAL INVOICES</span>
                <span className="text-xl font-bold text-amber-400 font-mono-numbers">{selectedVendor.totalInvoices}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-center">
                <span className="text-[10px] text-slate-400 block font-mono-numbers">TRANSACTIONS</span>
                <span className="text-xl font-bold text-emerald-400 font-mono-numbers">{selectedVendor.totalTransactions}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-center">
                <span className="text-[10px] text-slate-400 block font-mono-numbers">TOTAL VALUE</span>
                <span className="text-base font-bold text-white font-mono-numbers">{selectedVendor.totalProcurementValue}</span>
              </div>
            </div>

            {/* Statutory & Contact Details */}
            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2 text-xs">
              <div className="font-bold text-slate-200">Registration &amp; KYC:</div>
              <div className="font-mono-numbers text-slate-400">{selectedVendor.registrationDetails}</div>
              <div className="flex items-center gap-4 text-slate-400 pt-1">
                <span className="flex items-center gap-1"><Mail className="w-3.5 h-3.5 text-cyan-400" /> {selectedVendor.email}</span>
                <span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5 text-cyan-400" /> {selectedVendor.phone}</span>
              </div>
              <div className="flex items-center gap-1 text-slate-400">
                <MapPin className="w-3.5 h-3.5 text-cyan-400 shrink-0" /> {selectedVendor.address}
              </div>
            </div>

            {/* Recent POs */}
            <div>
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 font-mono-numbers flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-blue-400" />
                <span>Recent Purchase Orders</span>
              </h4>
              <div className="space-y-1.5">
                {selectedVendor.recentPOs?.map((po, idx) => (
                  <div key={idx} className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between text-xs font-mono-numbers">
                    <div>
                      <span className="font-bold text-white mr-2">{po.id}</span>
                      <span className="text-slate-400 text-[11px]">{po.items}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white">{po.amount}</span>
                      <span className="px-1.5 py-0.5 rounded text-[9px] bg-blue-500/10 text-blue-300 border border-blue-500/30">{po.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Transaction History Timeline */}
            <div>
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 font-mono-numbers flex items-center gap-1.5">
                <ArrowLeftRight className="w-3.5 h-3.5 text-emerald-400" />
                <span>Transaction History (Historical Baseline)</span>
              </h4>
              <div className="space-y-1.5">
                {selectedVendor.transactionHistory?.map((tx, idx) => (
                  <div key={idx} className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between text-xs font-mono-numbers">
                    <div>
                      <span className="font-bold text-white mr-2">{tx.id}</span>
                      <span className="text-slate-400">{tx.date}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white">{tx.amount}</span>
                      <span className={`px-1.5 py-0.5 rounded text-[9px] border ${
                        tx.status === 'FLAGGED' ? 'bg-rose-500/10 text-rose-400 border-rose-500/30' : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                      }`}>
                        {tx.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Modal Actions */}
            <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => handlePrintVendorProfile(selectedVendor)}
                className="px-3.5 py-2 text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 rounded-xl flex items-center gap-1.5 cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5 text-blue-400" />
                <span>Print Profile</span>
              </button>
              <button
                type="button"
                onClick={() => handleDownloadVendorProfile(selectedVendor)}
                className="px-4 py-2 text-xs font-bold text-white bg-cyan-600 hover:bg-cyan-500 rounded-xl shadow-md flex items-center gap-1.5 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Dossier</span>
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Add Vendor Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="max-w-md w-full rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-6 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Building2 className="w-4 h-4 text-cyan-400" />
                <span>Onboard New Vendor</span>
              </h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddVendor} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Vendor Name</label>
                <input
                  type="text"
                  value={formData.vendorName}
                  onChange={(e) => setFormData({ ...formData, vendorName: e.target.value })}
                  placeholder="e.g. ABC Computers"
                  required
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Contact Person</label>
                  <input
                    type="text"
                    value={formData.contactPerson}
                    onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                    placeholder="Rajesh Sharma"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Phone</label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+91 98201 54321"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono-numbers"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="contact@abccomputers.in"
                  required
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono-numbers"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Category</label>
                <input
                  type="text"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  placeholder="IT Hardware & Enterprise Workstations"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Address</label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Nehru Place, New Delhi"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Registration Details (GSTIN / PAN / MSME)</label>
                <input
                  type="text"
                  value={formData.registrationDetails}
                  onChange={(e) => setFormData({ ...formData, registrationDetails: e.target.value })}
                  placeholder="GSTIN: 07AABCA1234F1Z8 | PAN: AABCA1234F"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono-numbers"
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
                  className="px-4 py-2 text-xs font-bold text-white bg-cyan-600 hover:bg-cyan-500 rounded-xl shadow-md cursor-pointer"
                >
                  Register Vendor
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
