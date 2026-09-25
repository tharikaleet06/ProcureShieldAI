import React, { useState, useEffect, useCallback } from 'react';
import { LandingPage } from './components/LandingPage';
import { LoginPage } from './components/LoginPage';
import { Header } from './components/Header';
import { SideNav } from './components/SideNav';
import { AdminDashboard } from './components/AdminDashboard';
import { UserManagementPage } from './components/UserManagementPage';
import { ProcurementDashboard } from './components/ProcurementDashboard';
import { ProcurementVendors } from './components/ProcurementVendors';
import { ProcurementPurchaseOrders } from './components/ProcurementPurchaseOrders';
import { ProcurementInvoices } from './components/ProcurementInvoices';
import { ProcurementTransactions } from './components/ProcurementTransactions';
import { AuditorDashboard } from './components/AuditorDashboard';
import { AuditorFlaggedTransactions } from './components/AuditorFlaggedTransactions';
import { AuditorInvestigationView } from './components/AuditorInvestigationView';
import { SystemActivityLog } from './components/SystemActivityLog';
import { ReportsView } from './components/ReportsView';
import { CheckCircle2 } from 'lucide-react';

const TAB_HASH_MAP = {
  'DASHBOARD': '#/dashboard',
  'USERS': '#/users',
  'VENDORS': '#/vendors',
  'PURCHASE_ORDERS': '#/purchase-orders',
  'INVOICES': '#/invoices',
  'TRANSACTIONS': '#/transactions',
  'FLAGGED_TRANSACTIONS': '#/flagged-transactions',
  'INVESTIGATION_DETAILS': '#/investigation',
  'INVESTIGATIONS': '#/investigation',
  'REPORTS': '#/reports',
  'ACTIVITY_LOGS': '#/activity-logs'
};

const HASH_TAB_MAP = {
  '#/dashboard': { view: 'WORKBENCH', tab: 'DASHBOARD' },
  '#/users': { view: 'WORKBENCH', tab: 'USERS' },
  '#/vendors': { view: 'WORKBENCH', tab: 'VENDORS' },
  '#/purchase-orders': { view: 'WORKBENCH', tab: 'PURCHASE_ORDERS' },
  '#/invoices': { view: 'WORKBENCH', tab: 'INVOICES' },
  '#/transactions': { view: 'WORKBENCH', tab: 'TRANSACTIONS' },
  '#/flagged-transactions': { view: 'WORKBENCH', tab: 'FLAGGED_TRANSACTIONS' },
  '#/investigation': { view: 'WORKBENCH', tab: 'INVESTIGATION_DETAILS' },
  '#/investigations': { view: 'WORKBENCH', tab: 'INVESTIGATION_DETAILS' },
  '#/reports': { view: 'WORKBENCH', tab: 'REPORTS' },
  '#/activity-logs': { view: 'WORKBENCH', tab: 'ACTIVITY_LOGS' },
  '#/login': { view: 'LOGIN', tab: 'DASHBOARD' },
  '#/landing': { view: 'LANDING', tab: 'DASHBOARD' }
};

export default function App() {
  // Theme state: 'dark' | 'light'
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('procurelens_theme') || 'dark';
  });

  useEffect(() => {
    if (theme === 'light') {
      document.documentElement.classList.add('light');
    } else {
      document.documentElement.classList.remove('light');
    }
    localStorage.setItem('procurelens_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Active User Profile with Session Persistence
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('procurelens_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return {
      id: 'USR-ADM-001',
      name: 'Administrator',
      email: 'admin@company.com',
      role: 'ROLE_ADMIN',
      roleTitle: 'System Administrator & Governance Lead',
      department: 'IT Governance & Enterprise Security',
      avatarInitials: 'AD'
    };
  });

  // Navigation View State: 'LANDING' | 'LOGIN' | 'WORKBENCH'
  const [currentView, setCurrentView] = useState(() => {
    const hash = window.location.hash.toLowerCase();
    if (hash === '#/login') return 'LOGIN';
    if (HASH_TAB_MAP[hash]) return HASH_TAB_MAP[hash].view;
    return localStorage.getItem('procurelens_view') || 'LANDING';
  });

  // Active Tab inside Workbench
  const [activeTab, setActiveTab] = useState(() => {
    const hash = window.location.hash.toLowerCase();
    if (HASH_TAB_MAP[hash] && HASH_TAB_MAP[hash].view === 'WORKBENCH') {
      return HASH_TAB_MAP[hash].tab;
    }
    return localStorage.getItem('procurelens_tab') || 'DASHBOARD';
  });

  const [isLoading, setIsLoading] = useState(false);
  const [activeInvestigationTx, setActiveInvestigationTx] = useState(null);

  // Action Notification Banner
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Sync state to URL hash & localStorage without reloading the app
  const navigateTo = useCallback((view, tab) => {
    setCurrentView(view);
    localStorage.setItem('procurelens_view', view);
    
    if (tab) {
      setActiveTab(tab);
      localStorage.setItem('procurelens_tab', tab);
    }

    let targetHash = '#/landing';
    if (view === 'LOGIN') {
      targetHash = '#/login';
    } else if (view === 'WORKBENCH') {
      const active = tab || activeTab;
      targetHash = TAB_HASH_MAP[active] || '#/dashboard';
    }

    if (window.location.hash !== targetHash) {
      window.history.replaceState(null, '', targetHash);
    }
  }, [activeTab]);

  // Listen for browser popstate / hashchange so reloading or navigating specific window works directly
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.toLowerCase();
      if (hash === '#/login') {
        setCurrentView('LOGIN');
      } else if (hash === '#/landing' || hash === '' || hash === '#') {
        setCurrentView('LANDING');
      } else if (HASH_TAB_MAP[hash]) {
        const route = HASH_TAB_MAP[hash];
        setCurrentView(route.view);
        setActiveTab(route.tab);
        localStorage.setItem('procurelens_view', route.view);
        localStorage.setItem('procurelens_tab', route.tab);
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Handle Login
  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
    localStorage.setItem('procurelens_user', JSON.stringify(user));
    navigateTo('WORKBENCH', 'DASHBOARD');
    showToast(`Authenticated as ${user.name} (${user.role.replace('ROLE_', '')})`);
  };

  // Handle Sign Out with clean notification and view reset
  const handleSignOut = () => {
    localStorage.removeItem('procurelens_view');
    localStorage.removeItem('procurelens_tab');
    navigateTo('LANDING', 'DASHBOARD');
    showToast('Signed out successfully. Session closed.');
  };

  // Open investigation view
  const handleOpenInvestigation = (tx) => {
    setActiveInvestigationTx(tx);
    const targetTab = currentUser.role === 'ROLE_ADMIN' ? 'INVESTIGATIONS' : 'INVESTIGATION_DETAILS';
    navigateTo('WORKBENCH', targetTab);
  };

  // Switch tab in-place
  const handleSelectTab = (tab) => {
    setActiveTab(tab);
    localStorage.setItem('procurelens_tab', tab);
    const targetHash = TAB_HASH_MAP[tab] || '#/dashboard';
    window.history.replaceState(null, '', targetHash);

    if (tab === 'INVESTIGATION_DETAILS' && !activeInvestigationTx) {
      setActiveInvestigationTx({
        id: 'TX1025',
        vendor: 'ABC Computers',
        po: 'PO1025',
        invoice: 'INV1025',
        amount: '₹8,00,000',
        numericAmount: 800000,
        riskScore: 87,
        riskLevel: 'HIGH',
        detectedIssues: 'PO-Invoice mismatch',
        investigationStatus: 'UNDER_REVIEW',
        date: '25-09-2026'
      });
    }
  };

  // Render Landing Page
  if (currentView === 'LANDING') {
    return (
      <LandingPage
        onLaunch={() => navigateTo('LOGIN')}
        onLogin={() => navigateTo('LOGIN')}
        theme={theme}
        onToggleTheme={toggleTheme}
      />
    );
  }

  // Render Login Page
  if (currentView === 'LOGIN') {
    return (
      <LoginPage
        onLoginSuccess={handleLoginSuccess}
        onBackToLanding={() => navigateTo('LANDING')}
        theme={theme}
        onToggleTheme={toggleTheme}
      />
    );
  }

  // Render Main Workbench View with Persistent SideNav & Single-Page Dynamic Tab Switching
  return (
    <div className={`min-h-screen ${theme === 'light' ? 'light bg-slate-100 text-slate-900' : 'bg-slate-950 text-slate-100'} flex font-sans selection:bg-rose-500/30 selection:text-rose-200`}>
      
      {/* Toast Banner */}
      {toastMessage && (
        <div className="fixed top-4 right-4 z-50 bg-slate-900 border border-slate-700 text-white text-xs px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2.5 animate-in slide-in-from-top duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Persistent Side Navigation Bar with Sign Out Confirmation Modal */}
      <SideNav
        currentTab={activeTab}
        onSelectTab={handleSelectTab}
        currentUser={currentUser}
        onLogout={handleSignOut}
      />

      {/* Right Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">
        
        {/* Global Header */}
        <Header
          onRefresh={() => {
            setIsLoading(true);
            setTimeout(() => {
              setIsLoading(false);
              showToast('Active window refreshed.');
            }, 300);
          }}
          isLoading={isLoading}
          currentUser={currentUser}
          onNavigateLanding={() => navigateTo('LANDING')}
          onNavigateLogin={() => navigateTo('LOGIN')}
          theme={theme}
          onToggleTheme={toggleTheme}
        />

        {/* Dynamic Main Workspace Tab View - Isolated per window */}
        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-6">
          
          {/* ROLE 1: ADMIN VIEWS */}
          {currentUser?.role === 'ROLE_ADMIN' && activeTab === 'DASHBOARD' && (
            <AdminDashboard
              onNavigateTab={handleSelectTab}
              currentUser={currentUser}
            />
          )}

          {currentUser?.role === 'ROLE_ADMIN' && activeTab === 'USERS' && (
            <UserManagementPage
              currentUser={currentUser}
              onToast={showToast}
            />
          )}

          {/* ROLE 2: PROCUREMENT MANAGER VIEWS */}
          {currentUser?.role === 'ROLE_PROCUREMENT_MANAGER' && activeTab === 'DASHBOARD' && (
            <ProcurementDashboard
              onNavigateTab={handleSelectTab}
              currentUser={currentUser}
            />
          )}

          {/* ROLE 3: AUDITOR VIEWS */}
          {currentUser?.role === 'ROLE_AUDITOR' && activeTab === 'DASHBOARD' && (
            <AuditorDashboard
              onNavigateTab={handleSelectTab}
              onOpenInvestigation={handleOpenInvestigation}
              currentUser={currentUser}
            />
          )}

          {activeTab === 'FLAGGED_TRANSACTIONS' && (
            <AuditorFlaggedTransactions
              onOpenInvestigation={handleOpenInvestigation}
            />
          )}

          {(activeTab === 'INVESTIGATION_DETAILS' || activeTab === 'INVESTIGATIONS') && (
            <AuditorInvestigationView
              transaction={activeInvestigationTx}
              onBack={() => handleSelectTab(currentUser?.role === 'ROLE_AUDITOR' ? 'FLAGGED_TRANSACTIONS' : 'DASHBOARD')}
              onToast={showToast}
              currentUser={currentUser}
            />
          )}

          {/* COMMON SHARED MODULES */}
          {activeTab === 'VENDORS' && (
            <ProcurementVendors
              currentUser={currentUser}
              onToast={showToast}
            />
          )}

          {activeTab === 'PURCHASE_ORDERS' && (
            <ProcurementPurchaseOrders
              currentUser={currentUser}
              onToast={showToast}
              onNavigateTab={handleSelectTab}
            />
          )}

          {activeTab === 'INVOICES' && (
            <ProcurementInvoices
              currentUser={currentUser}
              onToast={showToast}
              onNavigateTab={handleSelectTab}
            />
          )}

          {activeTab === 'TRANSACTIONS' && (
            <ProcurementTransactions
              currentUser={currentUser}
              onToast={showToast}
              onOpenInvestigation={handleOpenInvestigation}
            />
          )}

          {/* REPORTS & ACTIVITY LOGS */}
          {activeTab === 'REPORTS' && (
            <ReportsView
              currentUser={currentUser}
              onToast={showToast}
            />
          )}

          {activeTab === 'ACTIVITY_LOGS' && (
            <SystemActivityLog
              currentUser={currentUser}
            />
          )}

        </main>

        {/* Footer */}
        <footer className="border-t border-slate-900 bg-slate-950 py-4 text-center text-xs text-slate-500 shrink-0">
          <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
            <span>ProcureLens Enterprise · Continuous Integrity &amp; Statutory Compliance</span>
            <span className="font-mono-numbers text-[11px] text-slate-600">
              Role: {currentUser?.role ? currentUser.role.replace('ROLE_', '') : 'ADMIN'} · GFR Rule 149 · SOX Section 404
            </span>
          </div>
        </footer>

      </div>

    </div>
  );
}
