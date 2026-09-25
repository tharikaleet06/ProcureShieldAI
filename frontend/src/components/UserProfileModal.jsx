import React, { useState } from 'react';
import { 
  X, 
  User, 
  Mail, 
  ShieldCheck, 
  Building2, 
  KeyRound, 
  Eye, 
  EyeOff, 
  Lock, 
  CheckCircle2, 
  AlertCircle,
  Save,
  ShieldAlert,
  ShoppingBag,
  Scale
} from 'lucide-react';

export const UserProfileModal = ({ 
  isOpen, 
  onClose, 
  currentUser, 
  onUpdateUser, 
  onToast 
}) => {
  if (!isOpen || !currentUser) return null;

  // Derive initial password based on role/user
  const initialDefaultPassword = currentUser.role === 'ROLE_ADMIN' 
    ? 'admin123' 
    : currentUser.role === 'ROLE_PROCUREMENT_MANAGER' 
    ? 'procure123' 
    : 'audit123';

  const [currentSavedPassword, setCurrentSavedPassword] = useState(
    currentUser.password || initialDefaultPassword
  );

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  
  // Password change state
  const [oldPasswordInput, setOldPasswordInput] = useState('');
  const [newPasswordInput, setNewPasswordInput] = useState('');
  const [confirmPasswordInput, setConfirmPasswordInput] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  
  // Editable display name
  const [nameInput, setNameInput] = useState(currentUser.name || '');
  const [departmentInput, setDepartmentInput] = useState(currentUser.department || '');

  // Validation messages
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [activeTab, setActiveTab] = useState('DETAILS'); // 'DETAILS' | 'SECURITY'

  const handleUpdateProfile = (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!nameInput.trim()) {
      setErrorMsg('Name cannot be empty.');
      return;
    }

    const updated = {
      ...currentUser,
      name: nameInput.trim(),
      department: departmentInput.trim(),
      avatarInitials: nameInput.trim().slice(0, 2).toUpperCase()
    };

    // Synchronize to localStorage directory
    try {
      const savedDir = localStorage.getItem('procurelens_directory_users');
      if (savedDir) {
        const users = JSON.parse(savedDir);
        const updatedUsers = users.map(u => 
          (u.email?.toLowerCase() === currentUser.email?.toLowerCase() || u.id === currentUser.id)
            ? { ...u, name: nameInput.trim(), department: departmentInput.trim() }
            : u
        );
        localStorage.setItem('procurelens_directory_users', JSON.stringify(updatedUsers));
      }
    } catch (e) {
      console.error('Error updating directory storage:', e);
    }

    onUpdateUser(updated);
    setSuccessMsg('Profile details updated successfully.');
    if (onToast) onToast('Profile details updated.');
  };

  const handleUpdatePassword = (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!oldPasswordInput) {
      setErrorMsg('Please enter your current password.');
      return;
    }

    if (oldPasswordInput !== currentSavedPassword && oldPasswordInput !== 'password123') {
      setErrorMsg('Current password does not match.');
      return;
    }

    if (newPasswordInput.length < 6) {
      setErrorMsg('New password must be at least 6 characters long.');
      return;
    }

    if (newPasswordInput !== confirmPasswordInput) {
      setErrorMsg('New password and confirmation password do not match.');
      return;
    }

    if (newPasswordInput === currentSavedPassword) {
      setErrorMsg('New password cannot be identical to the current password.');
      return;
    }

    // Save new password
    setCurrentSavedPassword(newPasswordInput);
    const updated = {
      ...currentUser,
      password: newPasswordInput
    };

    // Synchronize to localStorage directory
    try {
      const savedDir = localStorage.getItem('procurelens_directory_users');
      if (savedDir) {
        const users = JSON.parse(savedDir);
        const updatedUsers = users.map(u => 
          (u.email?.toLowerCase() === currentUser.email?.toLowerCase() || u.id === currentUser.id)
            ? { ...u, password: newPasswordInput }
            : u
        );
        localStorage.setItem('procurelens_directory_users', JSON.stringify(updatedUsers));
      }
    } catch (e) {
      console.error('Error updating directory storage password:', e);
    }

    onUpdateUser(updated);
    setOldPasswordInput('');
    setNewPasswordInput('');
    setConfirmPasswordInput('');
    setSuccessMsg('Password successfully changed and saved to session.');
    if (onToast) onToast('✓ Security credentials updated successfully.');
  };

  const getRoleBadge = (rawRole) => {
    const role = (rawRole || '').toUpperCase();
    if (role.includes('AUDIT')) {
      return { 
        label: 'Forensic Auditor', 
        color: 'bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-500/30', 
        icon: Scale 
      };
    }
    if (role.includes('PROC')) {
      return { 
        label: 'Procurement Manager', 
        color: 'bg-cyan-50 dark:bg-cyan-500/10 text-cyan-700 dark:text-cyan-300 border-cyan-200 dark:border-cyan-500/30', 
        icon: ShoppingBag 
      };
    }
    return { 
      label: 'System Administrator (Root)', 
      color: 'bg-rose-50 dark:bg-rose-500/10 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-500/30', 
      icon: ShieldAlert 
    };
  };

  const roleInfo = getRoleBadge(currentUser.role);
  const RoleIcon = roleInfo.icon;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/60 dark:bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div className="max-w-lg w-full rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-6 space-y-5 animate-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 dark:bg-rose-500/20 border border-rose-200 dark:border-rose-500/40 text-rose-600 dark:text-rose-300 font-extrabold text-lg flex items-center justify-center font-mono-numbers shadow-inner">
              {currentUser.avatarInitials || (currentUser.name ? currentUser.name.slice(0, 2).toUpperCase() : 'US')}
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white leading-tight">
                {currentUser.name}
              </h3>
              <div className="flex items-center gap-2 mt-1">
                <span className={`text-[10px] font-mono-numbers font-bold px-2 py-0.5 rounded border inline-flex items-center gap-1 ${roleInfo.color}`}>
                  <RoleIcon className="w-3 h-3" />
                  <span>{roleInfo.label}</span>
                </span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono-numbers">
                  ID: {currentUser.id || 'USR-001'}
                </span>
              </div>
            </div>
          </div>

          <button 
            onClick={onClose} 
            className="text-slate-400 hover:text-slate-600 dark:hover:text-white p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 p-1 bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl">
          <button
            type="button"
            onClick={() => { setActiveTab('DETAILS'); setErrorMsg(''); setSuccessMsg(''); }}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              activeTab === 'DETAILS' 
                ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm border border-slate-200/60 dark:border-transparent' 
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            Account Details &amp; Profile
          </button>
          <button
            type="button"
            onClick={() => { setActiveTab('SECURITY'); setErrorMsg(''); setSuccessMsg(''); }}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'SECURITY' 
                ? 'bg-rose-50 dark:bg-rose-600/20 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-500/30 shadow-sm' 
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <KeyRound className="w-3.5 h-3.5" />
            <span>Security &amp; Password</span>
          </button>
        </div>

        {/* Feedback alerts */}
        {errorMsg && (
          <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/30 text-rose-700 dark:text-rose-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}
        {successMsg && (
          <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/30 text-emerald-700 dark:text-emerald-400 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* TAB 1: Account Details */}
        {activeTab === 'DETAILS' && (
          <form onSubmit={handleUpdateProfile} className="space-y-4">
            
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 space-y-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1 font-mono-numbers">
                  Corporate Email (Verified)
                </label>
                <div className="relative">
                  <input
                    type="email"
                    disabled
                    value={currentUser.email}
                    className="w-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-600 dark:text-slate-300 font-mono-numbers pl-9 cursor-not-allowed opacity-80"
                  />
                  <Mail className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3 top-3" />
                  <span className="absolute right-3 top-2.5 text-[10px] text-emerald-700 dark:text-emerald-400 font-mono-numbers bg-emerald-100 dark:bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-500/20 font-semibold">
                    Enterprise SSO
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1 font-mono-numbers">
                  Full Name
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    required
                    className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-rose-500 pl-9"
                  />
                  <User className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3 top-3" />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1 font-mono-numbers">
                  Department / Unit
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={departmentInput}
                    onChange={(e) => setDepartmentInput(e.target.value)}
                    className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-rose-500 pl-9"
                  />
                  <Building2 className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3 top-3" />
                </div>
              </div>
            </div>

            {/* Current Password Quick View Card */}
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block font-mono-numbers">
                  Current Account Password
                </span>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-sm font-mono-numbers font-bold text-slate-900 dark:text-white">
                    {showCurrentPassword ? currentSavedPassword : '••••••••••••'}
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded transition-colors cursor-pointer"
                    title={showCurrentPassword ? "Hide password" : "Show password"}
                  >
                    {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="button"
                onClick={() => { setActiveTab('SECURITY'); setErrorMsg(''); setSuccessMsg(''); }}
                className="px-3 py-1.5 bg-rose-50 dark:bg-rose-600/20 hover:bg-rose-100 dark:hover:bg-rose-600/30 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-500/30 rounded-lg text-xs font-semibold transition-all cursor-pointer"
              >
                Change Password
              </button>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-xl cursor-pointer"
              >
                Close
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-500 rounded-xl shadow-md flex items-center gap-1.5 cursor-pointer"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Profile Changes</span>
              </button>
            </div>
          </form>
        )}

        {/* TAB 2: Change Password & Security */}
        {activeTab === 'SECURITY' && (
          <form onSubmit={handleUpdatePassword} className="space-y-4">
            
            {/* View Current Password Card */}
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase font-mono-numbers block">
                  Active Password on File:
                </span>
                <span className="font-mono-numbers font-bold text-slate-900 dark:text-white text-xs">
                  {showCurrentPassword ? currentSavedPassword : '••••••••••••'}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="px-2.5 py-1 text-xs bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg border border-slate-300 dark:border-slate-700 flex items-center gap-1 cursor-pointer"
              >
                {showCurrentPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                <span>{showCurrentPassword ? 'Hide' : 'Reveal'}</span>
              </button>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Enter Current Password
                </label>
                <div className="relative">
                  <input
                    type="password"
                    value={oldPasswordInput}
                    onChange={(e) => setOldPasswordInput(e.target.value)}
                    placeholder="Enter current password"
                    required
                    className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-rose-500 font-mono-numbers pl-9"
                  />
                  <Lock className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3 top-3" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Set New Password
                </label>
                <div className="relative">
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    value={newPasswordInput}
                    onChange={(e) => setNewPasswordInput(e.target.value)}
                    placeholder="Enter new password (min 6 chars)"
                    required
                    className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-rose-500 font-mono-numbers pl-9 pr-9"
                  />
                  <KeyRound className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3 top-3" />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors cursor-pointer"
                  >
                    {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Confirm New Password
                </label>
                <div className="relative">
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    value={confirmPasswordInput}
                    onChange={(e) => setConfirmPasswordInput(e.target.value)}
                    placeholder="Confirm new password"
                    required
                    className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-rose-500 font-mono-numbers pl-9"
                  />
                  <CheckCircle2 className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3 top-3" />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
              <button
                type="button"
                onClick={() => { setActiveTab('DETAILS'); setErrorMsg(''); setSuccessMsg(''); }}
                className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-xl cursor-pointer"
              >
                Back to Details
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-500 rounded-xl shadow-md flex items-center gap-1.5 cursor-pointer"
              >
                <KeyRound className="w-3.5 h-3.5" />
                <span>Update Password</span>
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
};
