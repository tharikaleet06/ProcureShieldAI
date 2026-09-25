import React from 'react';
import { 
  ShieldAlert, 
  ArrowRight, 
  Lock, 
  Cpu, 
  Users, 
  Server, 
  ChevronRight,
  Code2,
  FileCheck2,
  FileText,
  Search,
  Scale
} from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';

export const LandingPage = ({
  onLaunch,
  onLogin,
  theme,
  onToggleTheme
}) => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-rose-500/30 selection:text-rose-200">
      
      {/* Top Navigation */}
      <nav className="border-b border-slate-800/80 bg-slate-950/80 backdrop-blur sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 shadow-inner">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <span className="font-display text-lg font-bold tracking-tight text-white">ProcureLens</span>
              <span className="ml-2 text-[10px] font-mono-numbers px-2 py-0.5 rounded bg-rose-950 text-rose-400 border border-rose-900 hidden sm:inline-block">
                Enterprise Suite
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onLogin}
              className="px-3.5 py-1.5 text-xs font-semibold text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Lock className="w-3.5 h-3.5 text-rose-400" />
              <span>Login</span>
            </button>

            <button
              onClick={onLogin}
              className="inline-flex items-center gap-2 px-4 py-1.5 text-xs font-bold text-white bg-rose-600 hover:bg-rose-500 rounded-lg shadow-md shadow-rose-950/60 transition-colors cursor-pointer"
            >
              <span>Get Started</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            {/* Light / Dark Theme Toggle */}
            <ThemeToggle theme={theme} onToggle={onToggleTheme} />
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-14 pb-20 sm:pt-20 sm:pb-28 border-b border-slate-900">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(225,29,72,0.15),rgba(255,255,255,0))]" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          
          {/* Eyebrow badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-xs font-medium text-slate-300 mb-6 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
            <span>Autonomous Pre-Payment Procurement Anomaly &amp; Fraud Defense</span>
            <ChevronRight className="w-3 h-3 text-slate-500" />
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-tight sm:leading-none">
            Detect Procurement Fraud <br />
            <span className="bg-gradient-to-r from-rose-400 via-rose-300 to-amber-300 bg-clip-text text-transparent">
              Before Payments Are Released
            </span>
          </h1>

          <p className="mt-5 text-sm sm:text-base text-slate-400 max-w-2xl mx-auto leading-relaxed">
            ProcureLens empowers organizations to safeguard corporate capital by autonomously identifying pricing anomalies, PO-invoice discrepancies, split tender structuring, and high-risk vendor signals before disbursement.
          </p>

          {/* CTA Button */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={onLogin}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-3.5 text-sm font-bold text-white bg-rose-600 hover:bg-rose-500 rounded-xl shadow-lg shadow-rose-950/70 border border-rose-400/30 transition-all hover:scale-[1.02] cursor-pointer"
            >
              <ShieldAlert className="w-4 h-4" />
              <span>Get Started</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </button>
          </div>

        </div>
      </section>

      {/* Engineered for Continuous Integrity & Statutory Compliance Section */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="text-center mb-12">
          <span className="text-xs font-mono-numbers text-rose-400 uppercase tracking-wider font-bold">
            Comprehensive Procurement Defense
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mt-1">
            Engineered for Continuous Integrity &amp; Statutory Compliance
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-2xl mx-auto mt-2">
            A cohesive platform combining end-to-end procurement lifecycle tracking, empirical AI anomaly detection, evidence-backed audit investigations, and chronological audit logs.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Card 1: Procurement Operations */}
          <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 flex flex-col justify-between hover:border-slate-700 transition-colors">
            <div>
              <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 w-fit mb-3">
                <FileCheck2 className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-white tracking-tight">Procurement Lifecycle Management</h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Streamlines the entire organizational workflow from Vendor Registration to Purchase Orders, Invoices, and Transactions with automatic relationship integrity.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] font-mono-numbers text-cyan-300">
              Vendor → PO → Invoice → Transaction
            </div>
          </div>

          {/* Card 2: Automated Anomaly Detection */}
          <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 flex flex-col justify-between hover:border-slate-700 transition-colors">
            <div>
              <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 w-fit mb-3">
                <Cpu className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-white tracking-tight">Autonomous Anomaly Detection</h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Calculates empirical Z-score deviation multipliers, checks Benford's Law distribution, flags tender limit structuring, and detects PO-Invoice discrepancies.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] font-mono-numbers text-emerald-300">
              Statistical Scoring · Multi-Model Signals
            </div>
          </div>

          {/* Card 3: Evidence & Audit Investigation */}
          <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 flex flex-col justify-between hover:border-slate-700 transition-colors">
            <div>
              <div className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-400 w-fit mb-3">
                <Scale className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-white tracking-tight">Auditor Evidence &amp; Comparison</h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Side-by-side PO vs Invoice comparison table, vendor transaction history, semantic similarity graphs, and explainable AI insights for informed resolution or escalation.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] font-mono-numbers text-purple-300">
              Side-by-Side Comparison · RAG Evidence
            </div>
          </div>

          {/* Card 4: Governance & System Activity */}
          <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 flex flex-col justify-between hover:border-slate-700 transition-colors">
            <div>
              <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 w-fit mb-3">
                <Server className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-white tracking-tight">System Activity &amp; Audit Logs</h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Enforces strict segregation of duties across 3 designated roles with a complete chronological activity log tracking all vendor additions, PO creations, and audit escalations.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] font-mono-numbers text-amber-300">
              Immutable Audit Trail · Granular RBAC
            </div>
          </div>

        </div>
      </section>

      {/* Role-Based Personas Section */}
      <section className="py-12 bg-slate-900/40 border-y border-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <span className="text-xs font-mono-numbers text-rose-400 uppercase tracking-wider font-bold">
              Role-Based Access Control (RBAC)
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight mt-1">
              Customized Workbenches for 3 Core Stakeholders
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Persona 1: Admin */}
            <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 hover:border-rose-900/50 transition-colors">
              <div className="flex items-center gap-2 mb-2">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                <span className="text-sm font-bold text-rose-400">ADMIN</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                System-level administrator responsible for user account provisioning, role assignments, system-wide KPIs monitoring, system activity audit logs, and complete oversight across all procurement and audit modules.
              </p>
            </div>

            {/* Persona 2: Procurement Manager */}
            <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 hover:border-cyan-900/50 transition-colors">
              <div className="flex items-center gap-2 mb-2">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-500" />
                <span className="text-sm font-bold text-cyan-400">PROCUREMENT MANAGER</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Manages the organization's procurement lifecycle: registering vendors, creating and approving Purchase Orders, uploading and linking invoices, recording transactions, and submitting records for autonomous AI analysis.
              </p>
            </div>

            {/* Persona 3: Auditor */}
            <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 hover:border-amber-900/50 transition-colors">
              <div className="flex items-center gap-2 mb-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                <span className="text-sm font-bold text-amber-400">AUDITOR</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Investigates flagged transactions by reviewing detected empirical signals, inspecting side-by-side PO vs Invoice difference breakdowns, reviewing vendor transaction history, adding investigation notes, and issuing Resolve or Escalate decisions.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-900 bg-slate-950 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span>ProcureLens Enterprise · Autonomous Procurement Anomaly &amp; Fraud Defense Platform</span>
          <span className="font-mono-numbers text-[11px] text-slate-600">
            GFR Rule 149 · SOX Section 404 · ISO 37001 Anti-Bribery
          </span>
        </div>
      </footer>

    </div>
  );
};
