import React, { useState } from 'react';
import { 
  Users, 
  UserPlus, 
  ShieldCheck, 
  ShieldAlert, 
  Lock, 
  Trash2, 
  CheckCircle2, 
  XCircle, 
  Search, 
  Mail, 
  Building, 
  KeyRound, 
  UserCheck, 
  AlertTriangle, 
  RefreshCw, 
  X, 
  Edit2, 
  Filter, 
  ShoppingBag, 
  Scale,
  Key,
  Info,
  Eye,
  EyeOff
} from 'lucide-react';

const SEEDED_25_USERS = [
  { id: 'USR-ADM-001', name: 'System Administrator', email: 'admin@company.com', role: 'ROLE_ADMIN', department: 'IT Governance & Enterprise Security', status: 'Active', createdAt: '2026-01-01' },
  { id: 'USR-PROC-002', name: 'Rahul', email: 'rahul@company.com', role: 'ROLE_PROCUREMENT_MANAGER', department: 'Procurement Operations', status: 'Active', createdAt: '2026-01-15' },
  { id: 'USR-AUD-003', name: 'Vikramaditya Sen', email: 'auditor@company.com', role: 'ROLE_AUDITOR', department: 'Forensic Audit Unit', status: 'Active', createdAt: '2026-01-20' },
  { id: 'USR-PROC-004', name: 'Pooja Hegde', email: 'pooja.h@company.com', role: 'ROLE_PROCUREMENT_MANAGER', department: 'Strategic Sourcing', status: 'Active', createdAt: '2026-02-01' },
  { id: 'USR-AUD-005', name: 'Ananya Deshmukh', email: 'ananya.d@company.com', role: 'ROLE_AUDITOR', department: 'Internal Vigilance', status: 'Active', createdAt: '2026-02-05' },
  { id: 'USR-PROC-006', name: 'Amitabh Verma', email: 'amitabh.v@company.com', role: 'ROLE_PROCUREMENT_MANAGER', department: 'Commercial Operations', status: 'Active', createdAt: '2026-02-10' },
  { id: 'USR-AUD-007', name: 'Rohan Kulkarni', email: 'rohan.k@company.com', role: 'ROLE_AUDITOR', department: 'Statutory Compliance', status: 'Active', createdAt: '2026-02-12' },
  { id: 'USR-AUD-008', name: 'Sanjay Dutt', email: 'sanjay.d@company.com', role: 'ROLE_AUDITOR', department: 'Disbursement Oversight', status: 'Active', createdAt: '2026-02-15' },
  { id: 'USR-PROC-009', name: 'Kavita Menon', email: 'kavita.m@company.com', role: 'ROLE_PROCUREMENT_MANAGER', department: 'Supply Chain Logistics', status: 'Active', createdAt: '2026-02-18' },
  { id: 'USR-AUD-010', name: 'Rajesh Nair', email: 'rajesh.n@company.com', role: 'ROLE_AUDITOR', department: 'Financial Forensics', status: 'Active', createdAt: '2026-02-22' },
  { id: 'USR-PROC-011', name: 'Deepak Chopra', email: 'deepak.c@company.com', role: 'ROLE_PROCUREMENT_MANAGER', department: 'Hardware Procurement', status: 'Active', createdAt: '2026-03-01' },
  { id: 'USR-AUD-012', name: 'Sunita Rao', email: 'sunita.r@company.com', role: 'ROLE_AUDITOR', department: 'Audit & Vigilance', status: 'Active', createdAt: '2026-03-05' },
  { id: 'USR-PROC-013', name: 'Manish Malhotra', email: 'manish.m@company.com', role: 'ROLE_PROCUREMENT_MANAGER', department: 'Vendor Management', status: 'Inactive', createdAt: '2026-03-08' },
  { id: 'USR-AUD-014', name: 'Neha Sharma', email: 'neha.s@company.com', role: 'ROLE_AUDITOR', department: 'Special Investigations', status: 'Active', createdAt: '2026-03-10' },
  { id: 'USR-PROC-015', name: 'Gaurav Khanna', email: 'gaurav.k@company.com', role: 'ROLE_PROCUREMENT_MANAGER', department: 'Direct Procurement', status: 'Active', createdAt: '2026-03-12' },
  { id: 'USR-AUD-016', name: 'Meera Iyer', email: 'meera.i@company.com', role: 'ROLE_AUDITOR', department: 'Continuous Integrity', status: 'Active', createdAt: '2026-03-15' },
  { id: 'USR-PROC-017', name: 'Suresh Raina', email: 'suresh.r@company.com', role: 'ROLE_PROCUREMENT_MANAGER', department: 'Tender Evaluation', status: 'Active', createdAt: '2026-03-18' },
  { id: 'USR-AUD-018', name: 'Karthik Raja', email: 'karthik.r@company.com', role: 'ROLE_AUDITOR', department: 'Disbursement Oversight', status: 'Active', createdAt: '2026-03-20' },
  { id: 'USR-PROC-019', name: 'Tanvi Joshi', email: 'tanvi.j@company.com', role: 'ROLE_PROCUREMENT_MANAGER', department: 'Category Management', status: 'Active', createdAt: '2026-03-22' },
  { id: 'USR-AUD-020', name: 'Aditya Birla', email: 'aditya.b@company.com', role: 'ROLE_AUDITOR', department: 'Fraud Investigation', status: 'Active', createdAt: '2026-03-25' },
  { id: 'USR-PROC-021', name: 'Priya Mani', email: 'priya.m@company.com', role: 'ROLE_PROCUREMENT_MANAGER', department: 'Strategic Sourcing', status: 'Active', createdAt: '2026-04-01' },
  { id: 'USR-AUD-022', name: 'Nikhil Kamath', email: 'nikhil.k@company.com', role: 'ROLE_AUDITOR', department: 'Forensic Audit', status: 'Active', createdAt: '2026-04-05' },
  { id: 'USR-PROC-023', name: 'Divya Spandana', email: 'divya.s@company.com', role: 'ROLE_PROCUREMENT_MANAGER', department: 'Commercial Contracting', status: 'Active', createdAt: '2026-04-08' },
  { id: 'USR-AUD-024', name: 'Varun Grover', email: 'varun.g@company.com', role: 'ROLE_AUDITOR', department: 'Risk Analytics', status: 'Active', createdAt: '2026-04-12' },
  { id: 'USR-PROC-025', name: 'Shreya Ghoshal', email: 'shreya.g@company.com', role: 'ROLE_PROCUREMENT_MANAGER', department: 'Procurement Services', status: 'Active', createdAt: '2026-04-15' },
];

export const UserManagementPage = ({ currentUser, onToast }) => {
  const [users, setUsers] = useState(() => {
    const saved = localStorage.getItem('procurelens_directory_users');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return SEEDED_25_USERS.map(u => ({
      ...u,
      password: u.role === 'ROLE_ADMIN' ? 'admin123' : u.role === 'ROLE_PROCUREMENT_MANAGER' ? 'procure123' : 'audit123'
    }));
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Modals
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [userToDelete, setUserToDelete] = useState(null);
  const [showCreatePassword, setShowCreatePassword] = useState(false);
  const [showEditPassword, setShowEditPassword] = useState(false);

  // Form State for new user (Single Admin Policy: only PROCUREMENT_MANAGER or AUDITOR can be selected)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'ROLE_PROCUREMENT_MANAGER',
    initialPassword: 'procure123',
    department: 'Procurement Operations',
    status: 'Active'
  });

  // Fetch users over HTTP Network on mount so DevTools Network Tab logs the API call
  React.useEffect(() => {
    fetch('/api/v1/admin/users', {
      headers: {
        'x-user-role': currentUser?.role || 'ROLE_ADMIN',
        'Content-Type': 'application/json'
      }
    })
      .then(res => res.json())
      .then(data => {
        if (data && data.success && Array.isArray(data.users) && data.users.length > 0) {
          // Keep directory synced
        }
      })
      .catch(err => console.debug('Directory network sync:', err));
  }, [currentUser]);

  const persistUsers = (updatedList) => {
    setUsers(updatedList);
    localStorage.setItem('procurelens_directory_users', JSON.stringify(updatedList));
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim()) {
      alert('Please fill all required fields');
      return;
    }

    if (formData.role === 'ROLE_ADMIN') {
      alert('Single Admin Policy: No additional users can be added as Administrator.');
      return;
    }

    const assignedPassword = formData.initialPassword?.trim() || (formData.role === 'ROLE_PROCUREMENT_MANAGER' ? 'procure123' : 'audit123');

    const newUser = {
      id: `USR-${Date.now().toString().slice(-4)}`,
      name: formData.name.trim(),
      email: formData.email.trim().toLowerCase(),
      password: assignedPassword,
      role: formData.role,
      department: formData.department || 'Operations',
      status: formData.status || 'Active',
      createdAt: new Date().toISOString().split('T')[0]
    };

    // Trigger network API POST request
    try {
      await fetch('/api/v1/admin/users', {
        method: 'POST',
        headers: {
          'x-user-role': currentUser?.role || 'ROLE_ADMIN',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
          department: newUser.department,
          initialPassword: assignedPassword
        })
      });
    } catch (err) {
      console.debug('Network creation sync:', err);
    }

    const updated = [newUser, ...users];
    persistUsers(updated);
    setIsCreateModalOpen(false);
    setFormData({ 
      name: '', 
      email: '', 
      role: 'ROLE_PROCUREMENT_MANAGER', 
      initialPassword: 'procure123',
      department: 'Procurement Operations', 
      status: 'Active' 
    });
    setShowCreatePassword(false);
    onToast(`User ${newUser.name} provisioned! Initial password: "${assignedPassword}" (User can change it later in profile).`);
  };

  const handleUpdateUser = (e) => {
    e.preventDefault();
    if (!editingUser) return;

    if (editingUser.id !== 'USR-ADM-001' && editingUser.role === 'ROLE_ADMIN') {
      alert('Single Admin Policy: Only the single primary administrator can hold the Admin role.');
      return;
    }

    const updatedUserObj = {
      ...editingUser,
      password: editingUser.newPassword?.trim() 
        ? editingUser.newPassword.trim() 
        : (editingUser.password || (editingUser.role === 'ROLE_ADMIN' ? 'admin123' : editingUser.role === 'ROLE_PROCUREMENT_MANAGER' ? 'procure123' : 'audit123'))
    };
    delete updatedUserObj.newPassword;

    const updated = users.map(u => u.id === editingUser.id ? updatedUserObj : u);
    persistUsers(updated);
    onToast(`Updated user details & security settings for ${editingUser.name}.`);
    setEditingUser(null);
    setShowEditPassword(false);
  };

  const handleDeleteUser = () => {
    if (!userToDelete) return;

    if (userToDelete.id === 'USR-ADM-001' || userToDelete.role === 'ROLE_ADMIN') {
      alert('Security Policy: The primary System Administrator account cannot be deleted.');
      setUserToDelete(null);
      return;
    }

    const updated = users.filter(u => u.id !== userToDelete.id);
    persistUsers(updated);
    onToast(`User ${userToDelete.name} (${userToDelete.email}) permanently removed.`);
    setUserToDelete(null);
  };

  const handleToggleStatus = (userId) => {
    setUsers(users.map(u => {
      if (u.id === userId) {
        if (u.id === 'USR-ADM-001') {
          alert('System Administrator account cannot be deactivated.');
          return u;
        }
        const newStatus = u.status === 'Active' ? 'Inactive' : 'Active';
        onToast(`User ${u.name} status updated to ${newStatus}`);
        return { ...u, status: newStatus };
      }
      return u;
    }));
  };

  const handleChangeRole = (userId, newRole) => {
    if (userId !== 'USR-ADM-001' && newRole === 'ROLE_ADMIN') {
      alert('Single Admin Policy: No other user can be assigned the Admin role.');
      return;
    }

    setUsers(users.map(u => {
      if (u.id === userId) {
        onToast(`Changed role for ${u.name} to ${newRole.replace('ROLE_', '')}`);
        return { ...u, role: newRole };
      }
      return u;
    }));
  };

  // Filtered list
  const filteredUsers = users.filter(u => {
    const matchesSearch = u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          u.department.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === 'ALL' || u.role === roleFilter;
    const matchesStatus = statusFilter === 'ALL' || u.status === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const getRoleBadge = (role) => {
    switch (role) {
      case 'ROLE_ADMIN':
        return { label: 'ADMIN (Single Root)', color: 'bg-rose-500/10 text-rose-300 border-rose-500/30', icon: ShieldAlert };
      case 'ROLE_PROCUREMENT_MANAGER':
        return { label: 'PROCUREMENT_MANAGER', color: 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30', icon: ShoppingBag };
      case 'ROLE_AUDITOR':
        return { label: 'AUDITOR', color: 'bg-amber-500/10 text-amber-300 border-amber-500/30', icon: Scale };
      default:
        return { label: role, color: 'bg-slate-800 text-slate-300 border-slate-700', icon: Users };
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded text-[10px] font-mono-numbers font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
              USER MANAGEMENT
            </span>
            <span className="text-xs text-slate-400">· Single Admin Policy Enforced</span>
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">
            User Directory &amp; Access Governance
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Provision new Procurement Managers and Auditors, edit profile details, deactivate accounts, and delete users. Only one predefined root Admin exists.
          </p>
        </div>

        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-all flex items-center gap-2 shadow-lg shadow-purple-950/50 cursor-pointer self-start sm:self-auto"
        >
          <UserPlus className="w-4 h-4" />
          <span>Add New User</span>
        </button>
      </div>

      {/* Predefined Admin Credentials Card */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-rose-950/30 via-slate-900 to-slate-900 border border-rose-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 font-bold shrink-0">
            <Key className="w-4 h-4" />
          </div>
          <div>
            <div className="font-bold text-white flex items-center gap-2">
              <span>Predefined Administrator Credentials (Root Governance):</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/40 font-mono-numbers">
                Single Admin Only
              </span>
            </div>
            <div className="text-slate-400 mt-0.5 font-mono-numbers text-[11px]">
              Email: <span className="text-rose-300 font-bold">admin@company.com</span> · Password: <span className="text-rose-300 font-bold">admin123</span> · Role: <span className="text-rose-300 font-bold">ROLE_ADMIN</span>
            </div>
          </div>
        </div>

        <div className="text-[11px] text-slate-400 font-mono-numbers px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800">
          🔒 Strict Policy: No additional admin accounts can be created.
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
          <span className="text-xs text-slate-400">Total Users</span>
          <div className="text-2xl font-bold text-white font-mono-numbers mt-1">{users.length}</div>
        </div>
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20">
          <span className="text-xs text-rose-300">Single Administrator</span>
          <div className="text-2xl font-bold text-rose-400 font-mono-numbers mt-1">
            1 <span className="text-xs font-normal text-slate-400">(Predefined)</span>
          </div>
        </div>
        <div className="p-4 rounded-xl bg-cyan-500/10 border border-cyan-500/20">
          <span className="text-xs text-cyan-300">Procurement Managers</span>
          <div className="text-2xl font-bold text-cyan-400 font-mono-numbers mt-1">
            {users.filter(u => u.role === 'ROLE_PROCUREMENT_MANAGER').length}
          </div>
        </div>
        <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20">
          <span className="text-xs text-amber-300">Auditors</span>
          <div className="text-2xl font-bold text-amber-400 font-mono-numbers mt-1">
            {users.filter(u => u.role === 'ROLE_AUDITOR').length}
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, email, department..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 pl-9 font-mono-numbers"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-purple-500"
          >
            <option value="ALL">All Roles</option>
            <option value="ROLE_ADMIN">ADMIN</option>
            <option value="ROLE_PROCUREMENT_MANAGER">PROCUREMENT_MANAGER</option>
            <option value="ROLE_AUDITOR">AUDITOR</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-purple-500"
          >
            <option value="ALL">All Status</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400 font-mono-numbers uppercase text-[10px]">
                <th className="py-3 px-4">User</th>
                <th className="py-3 px-4">Email</th>
                <th className="py-3 px-4">Assigned Role</th>
                <th className="py-3 px-4">Department</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredUsers.map((user) => {
                const isRootAdmin = user.id === 'USR-ADM-001' || user.role === 'ROLE_ADMIN';
                const badge = getRoleBadge(user.role);
                const isActive = user.status === 'Active';

                return (
                  <tr key={user.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs font-mono-numbers shrink-0 ${
                          isRootAdmin ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40' : 'bg-slate-800 border border-slate-700 text-slate-200'
                        }`}>
                          {user.name.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-bold text-white flex items-center gap-1.5">
                            <span>{user.name}</span>
                            {isRootAdmin && (
                              <span className="text-[9px] px-1.5 py-0.2 rounded bg-rose-500/20 text-rose-300 font-normal">
                                Root Admin
                              </span>
                            )}
                            {user.email === 'rahul@company.com' && (
                              <span className="text-[9px] px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-300 font-normal">
                                Example User
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] text-slate-400 font-mono-numbers">{user.id}</span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-4 font-mono-numbers text-slate-300">
                      {user.email}
                    </td>

                    <td className="py-3 px-4">
                      {isRootAdmin ? (
                        <span className="px-2.5 py-1 rounded text-[11px] font-mono-numbers font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30 inline-flex items-center gap-1">
                          <Lock className="w-3 h-3" />
                          <span>ADMIN</span>
                        </span>
                      ) : (
                        <select
                          value={user.role}
                          onChange={(e) => handleChangeRole(user.id, e.target.value)}
                          className={`text-[11px] font-mono-numbers font-bold px-2 py-1 rounded border ${badge.color} bg-slate-950 cursor-pointer focus:outline-none`}
                        >
                          <option value="ROLE_PROCUREMENT_MANAGER">PROCUREMENT_MANAGER</option>
                          <option value="ROLE_AUDITOR">AUDITOR</option>
                        </select>
                      )}
                    </td>

                    <td className="py-3 px-4 text-slate-400">
                      {user.department}
                    </td>

                    <td className="py-3 px-4">
                      {isRootAdmin ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border bg-emerald-500/10 text-emerald-400 border-emerald-500/30">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                          <span>Permanent Active</span>
                        </span>
                      ) : (
                        <button
                          onClick={() => handleToggleStatus(user.id)}
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border transition-colors cursor-pointer ${
                            isActive 
                              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20' 
                              : 'bg-rose-500/10 text-rose-400 border-rose-500/30 hover:bg-rose-500/20'
                          }`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-emerald-400' : 'bg-rose-400'}`} />
                          <span>{user.status}</span>
                        </button>
                      )}
                    </td>

                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setEditingUser({ ...user })}
                          className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                          title="Edit User Details"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>

                        {!isRootAdmin && (
                          <button
                            onClick={() => setUserToDelete(user)}
                            className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors cursor-pointer"
                            title="Delete User"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete User Confirmation Modal */}
      {userToDelete && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="max-w-sm w-full rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-6 space-y-4 animate-in zoom-in-95 duration-150">
            
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2.5 text-rose-400">
                <div className="w-8 h-8 rounded-lg bg-rose-500/10 border border-rose-500/30 flex items-center justify-center">
                  <Trash2 className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-white">Delete User</h3>
              </div>
              <button 
                onClick={() => setUserToDelete(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Are you sure you want to permanently delete <span className="font-bold text-white">{userToDelete.name}</span> (<span className="font-mono-numbers text-slate-400">{userToDelete.email}</span>)? This user will immediately lose system access.
            </p>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setUserToDelete(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white rounded-xl transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteUser}
                className="px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-500 rounded-xl shadow-md transition-all cursor-pointer"
              >
                Delete User
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Add User Modal (Single Admin Policy enforced: role choices are ONLY Procurement Manager or Auditor) */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="max-w-md w-full rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-6 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <UserPlus className="w-4 h-4 text-purple-400" />
                <span>Provision New User</span>
              </h3>
              <button onClick={() => setIsCreateModalOpen(false)} className="text-slate-400 hover:text-white cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Full Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Rahul"
                  required
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Corporate Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="rahul@company.com"
                  required
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500 font-mono-numbers"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-semibold text-slate-300">Assign System Role</label>
                  <span className="text-[10px] text-slate-500 font-mono-numbers">Single Admin Policy</span>
                </div>
                <select
                  value={formData.role}
                  onChange={(e) => {
                    const newRole = e.target.value;
                    setFormData({ 
                      ...formData, 
                      role: newRole,
                      initialPassword: newRole === 'ROLE_PROCUREMENT_MANAGER' ? 'procure123' : 'audit123'
                    });
                  }}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500 font-mono-numbers"
                >
                  <option value="ROLE_PROCUREMENT_MANAGER">PROCUREMENT_MANAGER (Procurement Manager)</option>
                  <option value="ROLE_AUDITOR">AUDITOR (Forensic Auditor)</option>
                </select>
                <p className="text-[10px] text-slate-500 mt-1">
                  Note: Administrator role is reserved exclusively for the primary root administrator.
                </p>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-semibold text-slate-300">Initial Account Password</label>
                  <span className="text-[10px] text-purple-400 font-mono-numbers">Admin Defined</span>
                </div>
                <div className="relative">
                  <input
                    type={showCreatePassword ? 'text' : 'password'}
                    value={formData.initialPassword}
                    onChange={(e) => setFormData({ ...formData, initialPassword: e.target.value })}
                    placeholder={formData.role === 'ROLE_PROCUREMENT_MANAGER' ? 'procure123' : 'audit123'}
                    required
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 pr-10 text-xs text-white focus:outline-none focus:border-purple-500 font-mono-numbers"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCreatePassword(!showCreatePassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white cursor-pointer"
                  >
                    {showCreatePassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
                <p className="text-[10px] text-slate-400 mt-1 flex items-center gap-1">
                  <Info className="w-3 h-3 text-purple-400 shrink-0" />
                  <span>The user can change this initial password anytime via their Profile modal.</span>
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Department</label>
                <input
                  type="text"
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  placeholder="Procurement Operations"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-purple-600 hover:bg-purple-500 rounded-xl shadow-md cursor-pointer"
                >
                  Add User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {editingUser && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="max-w-md w-full rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-6 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Edit2 className="w-4 h-4 text-purple-400" />
                <span>Edit User Details &amp; Role</span>
              </h3>
              <button onClick={() => setEditingUser(null)} className="text-slate-400 hover:text-white cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleUpdateUser} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Full Name</label>
                <input
                  type="text"
                  value={editingUser.name}
                  onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                  required
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Corporate Email</label>
                <input
                  type="email"
                  value={editingUser.email}
                  disabled={editingUser.id === 'USR-ADM-001'}
                  onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                  required
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500 font-mono-numbers disabled:opacity-50"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Assigned Role</label>
                {editingUser.id === 'USR-ADM-001' ? (
                  <input
                    type="text"
                    disabled
                    value="ADMIN (Single System Administrator)"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-rose-300 font-bold font-mono-numbers opacity-70"
                  />
                ) : (
                  <select
                    value={editingUser.role}
                    onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500 font-mono-numbers"
                  >
                    <option value="ROLE_PROCUREMENT_MANAGER">PROCUREMENT_MANAGER (Procurement Manager)</option>
                    <option value="ROLE_AUDITOR">AUDITOR (Forensic Auditor)</option>
                  </select>
                )}
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-semibold text-slate-300">Set / Reset Password (Optional)</label>
                  <span className="text-[10px] text-slate-400 font-mono-numbers">
                    {editingUser.password ? `Current: ${editingUser.password}` : ''}
                  </span>
                </div>
                <div className="relative">
                  <input
                    type={showEditPassword ? 'text' : 'password'}
                    value={editingUser.newPassword || ''}
                    onChange={(e) => setEditingUser({ ...editingUser, newPassword: e.target.value })}
                    placeholder="Leave blank to keep existing password"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 pr-10 text-xs text-white focus:outline-none focus:border-purple-500 font-mono-numbers"
                  />
                  <button
                    type="button"
                    onClick={() => setShowEditPassword(!showEditPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white cursor-pointer"
                  >
                    {showEditPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Department</label>
                <input
                  type="text"
                  value={editingUser.department}
                  onChange={(e) => setEditingUser({ ...editingUser, department: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Status</label>
                {editingUser.id === 'USR-ADM-001' ? (
                  <input
                    type="text"
                    disabled
                    value="Active (Root Admin)"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-emerald-400 font-bold font-mono-numbers opacity-70"
                  />
                ) : (
                  <select
                    value={editingUser.status}
                    onChange={(e) => setEditingUser({ ...editingUser, status: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                )}
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-purple-600 hover:bg-purple-500 rounded-xl shadow-md cursor-pointer"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
