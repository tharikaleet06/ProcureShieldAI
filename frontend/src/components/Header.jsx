import React from 'react';
import { 
  ShieldAlert, 
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
  currentUser,
  onNavigateLanding,
  onOpenProfile,
  theme,
  onToggleTheme
}) => {
  const getRoleBadge = (rawRole) => {
    const role = (rawRole || '').toUpperCase();
    if (role.includes('AUDIT')) {
      return { label: 'Auditor', color: 'bg-amber-950/80 text-amber-300 border-amber-800' };
    }
    if (role.includes('PROC')) {
      return { label: 'Procurement Manager', color: 'bg-cyan-950/80 text-cyan-300 border-cyan-800' };
    }
    return { label: 'System Administrator', color: 'bg-rose-950/80 text-rose-300 border-rose-800' };
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

            {/* Active User Tile / Profile & Password Modal Trigger */}
            <button
              onClick={onOpenProfile}
              className="user-profile-tile flex items-center gap-2 p-1.5 rounded-xl bg-white dark:bg-slate-800/90 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 transition-all text-left cursor-pointer shadow-sm group"
              title={`Logged in as ${currentUser?.name || 'User'}. Click to view profile, password & security.`}
            >
              <div className="w-7 h-7 rounded-lg bg-rose-50 dark:bg-rose-500/20 text-rose-600 dark:text-rose-300 group-hover:bg-rose-100 dark:group-hover:bg-rose-500/30 border border-rose-200 dark:border-rose-500/40 font-bold text-xs flex items-center justify-center font-mono-numbers transition-colors">
                {currentUser?.avatarInitials || (currentUser?.name ? currentUser.name.slice(0, 2).toUpperCase() : 'US')}
              </div>
              <div className="hidden md:block text-xs leading-none pr-1">
                <span className="font-bold text-slate-800 dark:text-slate-200 block truncate max-w-[130px]">
                  {currentUser?.name || 'Authorized User'}
                </span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-300 block mt-0.5">
                  My Profile &amp; Password
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
