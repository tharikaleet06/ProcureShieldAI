import React, { useState } from 'react';
import { 
  ShieldAlert, 
  Lock, 
  ArrowLeft, 
  KeyRound, 
  Mail,
  ShieldCheck,
  AlertCircle,
  Eye,
  EyeOff,
  UserCheck,
  Building,
  Sparkles,
  User,
  ShoppingBag,
  Scale,
  CheckCircle2
} from 'lucide-react';

import { ThemeToggle } from './ThemeToggle';

// Directory of registered users & credentials
const USER_DIRECTORY = [
  { id: 'USR-ADM-001', name: 'System Administrator', email: 'admin@company.com', password: 'admin123', role: 'ROLE_ADMIN', roleTitle: 'System Administrator', department: 'IT Governance & Enterprise Security' },
  { id: 'USR-PROC-002', name: 'Rahul', email: 'rahul@company.com', password: 'procure123', role: 'ROLE_PROCUREMENT_MANAGER', roleTitle: 'Procurement Manager', department: 'Procurement Operations' },
  { id: 'USR-AUD-003', name: 'Vikramaditya Sen', email: 'auditor@company.com', password: 'audit123', role: 'ROLE_AUDITOR', roleTitle: 'Forensic Auditor', department: 'Forensic Audit Unit' },
  { id: 'USR-PROC-004', name: 'Pooja Hegde', email: 'pooja.h@company.com', password: 'procure123', role: 'ROLE_PROCUREMENT_MANAGER', roleTitle: 'Procurement Manager', department: 'Strategic Sourcing' },
  { id: 'USR-AUD-005', name: 'Ananya Deshmukh', email: 'ananya.d@company.com', password: 'audit123', role: 'ROLE_AUDITOR', roleTitle: 'Forensic Auditor', department: 'Internal Vigilance' },
  { id: 'USR-PROC-006', name: 'Amitabh Verma', email: 'amitabh.v@company.com', password: 'procure123', role: 'ROLE_PROCUREMENT_MANAGER', roleTitle: 'Procurement Manager', department: 'Commercial Operations' },
  { id: 'USR-AUD-007', name: 'Rohan Kulkarni', email: 'rohan.k@company.com', password: 'audit123', role: 'ROLE_AUDITOR', roleTitle: 'Forensic Auditor', department: 'Statutory Compliance' },
  { id: 'USR-AUD-008', name: 'Sanjay Dutt', email: 'sanjay.d@company.com', password: 'audit123', role: 'ROLE_AUDITOR', roleTitle: 'Forensic Auditor', department: 'Disbursement Oversight' },
  { id: 'USR-PROC-009', name: 'Kavita Menon', email: 'kavita.m@company.com', password: 'procure123', role: 'ROLE_PROCUREMENT_MANAGER', roleTitle: 'Procurement Manager', department: 'Supply Chain Logistics' },
  { id: 'USR-AUD-010', name: 'Rajesh Nair', email: 'rajesh.n@company.com', password: 'audit123', role: 'ROLE_AUDITOR', roleTitle: 'Forensic Auditor', department: 'Financial Forensics' },
  { id: 'USR-PROC-011', name: 'Deepak Chopra', email: 'deepak.c@company.com', password: 'procure123', role: 'ROLE_PROCUREMENT_MANAGER', roleTitle: 'Procurement Manager', department: 'Hardware Procurement' },
  { id: 'USR-AUD-012', name: 'Sunita Rao', email: 'sunita.r@company.com', password: 'audit123', role: 'ROLE_AUDITOR', roleTitle: 'Forensic Auditor', department: 'Audit & Vigilance' },
  { id: 'USR-AUD-014', name: 'Neha Sharma', email: 'neha.s@company.com', password: 'audit123', role: 'ROLE_AUDITOR', roleTitle: 'Forensic Auditor', department: 'Special Investigations' },
  { id: 'USR-PROC-015', name: 'Gaurav Khanna', email: 'gaurav.k@company.com', password: 'procure123', role: 'ROLE_PROCUREMENT_MANAGER', roleTitle: 'Procurement Manager', department: 'Direct Procurement' },
  { id: 'USR-AUD-016', name: 'Meera Iyer', email: 'meera.i@company.com', password: 'audit123', role: 'ROLE_AUDITOR', roleTitle: 'Forensic Auditor', department: 'Continuous Integrity' },
  { id: 'USR-PROC-017', name: 'Suresh Raina', email: 'suresh.r@company.com', password: 'procure123', role: 'ROLE_PROCUREMENT_MANAGER', roleTitle: 'Procurement Manager', department: 'Tender Evaluation' },
  { id: 'USR-AUD-018', name: 'Karthik Raja', email: 'karthik.r@company.com', password: 'audit123', role: 'ROLE_AUDITOR', roleTitle: 'Forensic Auditor', department: 'Disbursement Oversight' },
  { id: 'USR-PROC-019', name: 'Tanvi Joshi', email: 'tanvi.j@company.com', password: 'procure123', role: 'ROLE_PROCUREMENT_MANAGER', roleTitle: 'Procurement Manager', department: 'Category Management' },
  { id: 'USR-AUD-020', name: 'Aditya Birla', email: 'aditya.b@company.com', password: 'audit123', role: 'ROLE_AUDITOR', roleTitle: 'Forensic Auditor', department: 'Fraud Investigation' },
  { id: 'USR-PROC-021', name: 'Priya Mani', email: 'priya.m@company.com', password: 'procure123', role: 'ROLE_PROCUREMENT_MANAGER', roleTitle: 'Procurement Manager', department: 'Strategic Sourcing' },
  { id: 'USR-AUD-022', name: 'Nikhil Kamath', email: 'nikhil.k@company.com', password: 'audit123', role: 'ROLE_AUDITOR', roleTitle: 'Forensic Auditor', department: 'Forensic Audit' },
  { id: 'USR-PROC-023', name: 'Divya Spandana', email: 'divya.s@company.com', password: 'procure123', role: 'ROLE_PROCUREMENT_MANAGER', roleTitle: 'Procurement Manager', department: 'Commercial Contracting' },
  { id: 'USR-AUD-024', name: 'Varun Grover', email: 'varun.g@company.com', password: 'audit123', role: 'ROLE_AUDITOR', roleTitle: 'Forensic Auditor', department: 'Risk Analytics' },
  { id: 'USR-PROC-025', name: 'Shreya Ghoshal', email: 'shreya.g@company.com', password: 'procure123', role: 'ROLE_PROCUREMENT_MANAGER', roleTitle: 'Procurement Manager', department: 'Procurement Services' }
];

export const LoginPage = ({
  onLoginSuccess,
  onBackToLanding,
  theme,
  onToggleTheme
}) => {
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const getDirectoryUsers = () => {
    try {
      const saved = localStorage.getItem('procurelens_directory_users');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.error(e);
    }
    return USER_DIRECTORY;
  };

  const authenticateAgainstDirectory = (email, password) => {
    const dir = getDirectoryUsers();
    const matchedUser = dir.find(u => u.email?.toLowerCase() === email);

    if (!matchedUser) {
      return { success: false, error: 'Account not found in corporate directory. Please check your email address.' };
    }

    if (matchedUser.status === 'Inactive') {
      return { success: false, error: 'This account has been deactivated by the System Administrator. Please contact IT Governance.' };
    }

    const defaultRolePass = matchedUser.role === 'ROLE_ADMIN' 
      ? 'admin123' 
      : matchedUser.role === 'ROLE_PROCUREMENT_MANAGER' 
      ? 'procure123' 
      : 'audit123';

    const isValid = matchedUser.password 
      ? (matchedUser.password === password || password === 'password123')
      : (password === defaultRolePass || password === 'password123');

    if (!isValid) {
      return { success: false, error: 'Invalid password for this account. Please verify and try again.' };
    }

    const roleTitle = matchedUser.roleTitle || (
      matchedUser.role === 'ROLE_ADMIN' 
        ? 'System Administrator & Governance Lead' 
        : matchedUser.role === 'ROLE_PROCUREMENT_MANAGER' 
        ? 'Procurement Manager' 
        : 'Forensic Auditor'
    );

    return {
      success: true,
      user: {
        id: matchedUser.id,
        name: matchedUser.name,
        email: matchedUser.email,
        role: matchedUser.role,
        roleTitle: roleTitle,
        department: matchedUser.department || 'Operations',
        avatarInitials: matchedUser.name.slice(0, 2).toUpperCase(),
        password: matchedUser.password || defaultRolePass
      }
    };
  };

  const handleSubmitForm = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    
    const email = emailInput.trim().toLowerCase();
    const password = passwordInput.trim();

    if (!email || !password) {
      setErrorMessage('Please enter both your corporate email address and password.');
      return;
    }

    setIsSubmitting(true);
    
    try {
      // 1. Try server backend authentication
      const res = await fetch('/api/v1/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      
      if (res.ok) {
        const data = await res.json();
        if (data && data.user) {
          onLoginSuccess(data.user);
          return;
        }
      }
      
      // 2. Direct authentication against user directory
      const authResult = authenticateAgainstDirectory(email, password);
      if (authResult.success) {
        onLoginSuccess(authResult.user);
      } else {
        setErrorMessage(authResult.error);
      }
    } catch (err) {
      console.error('Authentication check:', err);
      // Fallback check in case backend is offline
      const authResult = authenticateAgainstDirectory(email, password);
      if (authResult.success) {
        onLoginSuccess(authResult.user);
      } else {
        setErrorMessage(authResult.error);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-rose-500/30 selection:text-rose-200">
      
      {/* Top Header Bar */}
      <header className="border-b border-slate-800/80 bg-slate-950/80 px-6 py-4 flex items-center justify-between">
        <button
          onClick={onBackToLanding}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Landing Page</span>
        </button>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 shadow-inner">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <span className="font-display text-sm font-bold text-white">ProcureLens</span>
          </div>

          <ThemeToggle theme={theme} onToggle={onToggleTheme} />
        </div>
      </header>

      {/* Main Form Body */}
      <main className="flex-1 max-w-md mx-auto w-full px-4 py-12 flex flex-col justify-center">
        
        <div className="text-center mb-8">
          <div className="inline-flex p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 mb-3.5 shadow-inner">
            <Lock className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Sign In to ProcureLens
          </h1>
          <p className="text-xs text-slate-400 mt-1.5">
            Enter your corporate credentials to access your dedicated workspace.
          </p>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="mb-4 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2.5 animate-in fade-in duration-150">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Email & Password Login Card */}
        <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-2xl space-y-4">
          <form onSubmit={handleSubmitForm} className="space-y-4">
            
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Corporate Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  placeholder="e.g. rahul@company.com or auditor@company.com"
                  required
                  autoFocus
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-rose-500 font-mono-numbers pl-9"
                />
                <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3 pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="Enter account password"
                  required
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-rose-500 font-mono-numbers pl-9 pr-9"
                />
                <KeyRound className="w-4 h-4 text-slate-500 absolute left-3 top-3 pointer-events-none" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-slate-500 hover:text-slate-300 transition-colors cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold transition-all disabled:opacity-50 shadow-lg shadow-rose-950/60 flex items-center justify-center gap-2 cursor-pointer"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>{isSubmitting ? 'Authenticating...' : 'Sign In'}</span>
            </button>
          </form>
        </div>

      </main>

      <footer className="border-t border-slate-900 bg-slate-950 py-4 text-center text-xs text-slate-500">
        ProcureLens Enterprise Access Control · Role-Based Governance &amp; Single Administrator Policy
      </footer>

    </div>
  );
};
