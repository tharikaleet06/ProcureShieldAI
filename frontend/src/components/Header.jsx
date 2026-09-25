import React from 'react';
import { 
  ShieldAlert, 
  RefreshCw, 
  Sparkles, 
  LogOut, 
  UserCircle2,
  Lock,
  Users,
  Building2,
  Scale
} from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';

export const Header = ({
  onRefresh,
  isLoading,
  currentUser,
  onNavigateLanding,
  onNavigateLogin,
  theme,
  onToggleTheme
}) => {
  const getRoleBadge = (role) => {
    switch (role) {
      case 'ROLE_ADMIN':
        return { label: 'System Administrator', color: 'bg-rose-950/80 text-rose-300 border-rose-800' };
      case 'ROLE_PROCUREMENT_MANAGER':
        return { label: 'Procurement Manager', color: 'bg-cyan-950/80 text-cyan-300 border-cyan-800' };
      case 'ROLE_AUDITOR':
        return { label: 'Auditor', color: 'bg-amber-950/80 text-amber-300 border-amber-800' };
      default:
        return { label: 'Enterprise User', color: 'bg-slate-800 text-slate-300 border-slate-700' };
    }
  };

  const badge = getRoleBadge(currentUser?.role);

  return (
    <header className="border-b border-slate-800 bg-slate-900/90 backdrop-blur sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Brand & Active Role Title */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 shadow-inner">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-display text-base font-bold tracking-tight text-white text-left">
                  ProcureLens
                </span>
                <span className={`text-[10px] font-mono-numbers font-semibold tracking-wide px-2 py-0.5 rounded border ${badge.color}`}>
                  {badge.label}
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2.5">
            
            {/* Refresh */}
            <button
              onClick={onRefresh}
              disabled={isLoading}
              className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800 border border-transparent hover:border-slate-700 rounded-lg transition-colors disabled:opacity-50 cursor-pointer"
              title="Refresh ledger state"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </button>

            <div className="h-6 w-px bg-slate-800 mx-1 hidden sm:block" />

            {/* Active User Tile / Role Switcher */}
            <button
              onClick={onNavigateLogin}
              className="flex items-center gap-2 p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 border border-slate-700 transition-colors text-left cursor-pointer"
              title={`Logged in as ${currentUser?.name || 'User'}. Click to switch role login.`}
            >
              <div className="w-7 h-7 rounded-md bg-rose-500/20 text-rose-300 font-bold text-xs flex items-center justify-center font-mono-numbers">
                {currentUser?.avatarInitials || (currentUser?.name ? currentUser.name.slice(0, 2).toUpperCase() : 'US')}
              </div>
              <div className="hidden md:block text-xs leading-none pr-1">
                <span className="font-semibold text-slate-200 block truncate max-w-[120px]">
                  {currentUser?.name || 'Authorized User'}
                </span>
                <span className="text-[10px] text-slate-400 block mt-0.5">
                  Switch Role
                </span>
              </div>
            </button>

            {/* Light / Dark Theme Toggle at Top Right Corner */}
            <ThemeToggle theme={theme} onToggle={onToggleTheme} />

          </div>
        </div>
      </div>
    </header>
  );
};
