import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  Building2, 
  FileText, 
  Receipt, 
  ArrowLeftRight, 
  ShieldAlert, 
  Scale, 
  FileCheck2, 
  Activity, 
  LogOut, 
  ShieldCheck,
  ShoppingBag,
  AlertCircle,
  X
} from 'lucide-react';

export const SideNav = ({ 
  currentTab, 
  onSelectTab, 
  currentUser, 
  onLogout,
  onOpenProfile
}) => {
  const [isSignOutModalOpen, setIsSignOutModalOpen] = useState(false);
  const rawRole = currentUser?.role || 'ROLE_ADMIN';
  const role = rawRole.includes('AUDIT') ? 'ROLE_AUDITOR' : 
               rawRole.includes('PROC') ? 'ROLE_PROCUREMENT_MANAGER' : 
               'ROLE_ADMIN';

  // Define role-specific navigation menus strictly according to the permission matrix
  const getNavItems = () => {
    switch (role) {
      case 'ROLE_ADMIN':
        return [
          { id: 'DASHBOARD', label: 'Admin Dashboard', icon: LayoutDashboard },
          { id: 'USERS', label: 'User Management', icon: Users, badge: 'Admin' },
          { id: 'VENDORS', label: 'All Vendors', icon: Building2 },
          { id: 'PURCHASE_ORDERS', label: 'Purchase Orders', icon: FileText },
          { id: 'INVOICES', label: 'Invoices', icon: Receipt },
          { id: 'TRANSACTIONS', label: 'Transactions', icon: ArrowLeftRight },
          { id: 'INVESTIGATIONS', label: 'Flagged Investigations', icon: Scale, badge: 'AuditLens' },
          { id: 'REPORTS', label: 'System Reports', icon: FileCheck2 },
          { id: 'ACTIVITY_LOGS', label: 'System Activity Log', icon: Activity },
        ];

      case 'ROLE_PROCUREMENT_MANAGER':
        return [
          { id: 'DASHBOARD', label: 'Procurement Dashboard', icon: LayoutDashboard },
          { id: 'VENDORS', label: 'Vendors', icon: Building2 },
          { id: 'PURCHASE_ORDERS', label: 'Purchase Orders', icon: FileText, badge: '32 Pending' },
          { id: 'INVOICES', label: 'Invoices', icon: Receipt, badge: '18 Pending' },
          { id: 'TRANSACTIONS', label: 'Transactions', icon: ArrowLeftRight, badge: '45 To Analyze' },
          { id: 'REPORTS', label: 'Procurement Reports', icon: FileCheck2 },
          { id: 'ACTIVITY_LOGS', label: 'My Activity Log', icon: Activity },
        ];

      case 'ROLE_AUDITOR':
        return [
          { id: 'DASHBOARD', label: 'Auditor Dashboard', icon: LayoutDashboard },
          { id: 'FLAGGED_TRANSACTIONS', label: 'Flagged Transactions', icon: ShieldAlert, badge: '86 Alerts' },
          { id: 'INVESTIGATION_DETAILS', label: 'Investigation Details', icon: Scale, badge: 'AuditLens' },
          { id: 'REPORTS', label: 'Investigation Reports', icon: FileCheck2 },
          { id: 'ACTIVITY_LOGS', label: 'Audit Activity Log', icon: Activity },
        ];

      default:
        return [
          { id: 'DASHBOARD', label: 'Dashboard', icon: LayoutDashboard },
        ];
    }
  };

  const navItems = getNavItems();

  const getRoleBadgeStyle = (userRole) => {
    switch (userRole) {
      case 'ROLE_ADMIN':
        return 'text-rose-400 bg-rose-500/10 border-rose-500/30';
      case 'ROLE_PROCUREMENT_MANAGER':
        return 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30';
      case 'ROLE_AUDITOR':
        return 'text-amber-400 bg-amber-500/10 border-amber-500/30';
      default:
        return 'text-slate-400 bg-slate-800 border-slate-700';
    }
  };

  const getRoleDisplayName = (userRole) => {
    switch (userRole) {
      case 'ROLE_ADMIN':
        return 'ADMIN';
      case 'ROLE_PROCUREMENT_MANAGER':
        return 'PROCUREMENT_MANAGER';
      case 'ROLE_AUDITOR':
        return 'AUDITOR';
      default:
        return userRole ? userRole.replace('ROLE_', '') : 'USER';
    }
  };

  const handleConfirmSignOut = () => {
    setIsSignOutModalOpen(false);
    onLogout();
  };

  return (
    <>
      <aside className="w-64 bg-slate-950 border-r border-slate-800/80 flex flex-col shrink-0 h-screen sticky top-0 selection:bg-rose-500/30 select-none">
        
        {/* Brand Header */}
        <div className="p-4 border-b border-slate-800/80 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 shadow-inner">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-display text-sm font-extrabold text-white tracking-tight leading-none">
              ProcureLens
            </h1>
            <span className="text-[10px] text-slate-400 font-mono-numbers">
              Continuous Integrity Suite
            </span>
          </div>
        </div>

        {/* User Profile Summary */}
        {currentUser && (
          <button
            type="button"
            onClick={onOpenProfile}
            className="p-3.5 mx-3 my-3 rounded-xl bg-slate-900/80 hover:bg-slate-800/90 border border-slate-800/80 hover:border-slate-700 flex flex-col gap-1.5 text-left transition-all cursor-pointer group shadow-sm"
            title="Click to view full profile, account details & set new password"
          >
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-rose-500/20 text-rose-300 font-bold text-xs flex items-center justify-center border border-rose-500/40 font-mono-numbers group-hover:bg-rose-500/30 transition-colors">
                  {currentUser.avatarInitials || (currentUser.name ? currentUser.name.slice(0, 2).toUpperCase() : 'US')}
                </div>
                <div className="truncate max-w-[130px]">
                  <p className="text-xs font-bold text-white group-hover:text-rose-200 transition-colors truncate">{currentUser.name}</p>
                  <p className="text-[10px] text-slate-400 truncate">{currentUser.department}</p>
                </div>
              </div>
            </div>

            <div className={`mt-1 px-2 py-0.5 rounded text-[10px] font-mono-numbers font-semibold border flex items-center justify-between w-full ${getRoleBadgeStyle(currentUser.role)}`}>
              <span>{getRoleDisplayName(currentUser.role)}</span>
              <ShieldCheck className="w-3 h-3 shrink-0" />
            </div>
          </button>
        )}

        {/* Main Navigation Links */}
        <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider px-3 mb-2 font-mono-numbers">
            {getRoleDisplayName(currentUser?.role)} Navigation
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-rose-500/10 border border-rose-500/30 text-rose-300 shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-rose-400' : 'text-slate-500'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="text-[9px] font-bold font-mono-numbers px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Sign Out Button (renamed to "Sign Out" with Confirmation Modal) */}
        <div className="p-3 border-t border-slate-900 bg-slate-950 space-y-1">
          <button
            onClick={() => setIsSignOutModalOpen(true)}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>

      </aside>

      {/* Sign Out Confirmation Modal */}
      {isSignOutModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="max-w-sm w-full rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-6 space-y-4 animate-in zoom-in-95 duration-150">
            
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2.5 text-rose-400">
                <div className="w-8 h-8 rounded-lg bg-rose-500/10 border border-rose-500/30 flex items-center justify-center">
                  <LogOut className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-white">Sign Out Confirmation</h3>
              </div>
              <button 
                onClick={() => setIsSignOutModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Are you sure you want to sign out of your active session? You will be redirected to the landing page.
            </p>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsSignOutModalOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white rounded-xl transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmSignOut}
                className="px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-500 rounded-xl shadow-md transition-all cursor-pointer"
              >
                Sign Out
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
};
