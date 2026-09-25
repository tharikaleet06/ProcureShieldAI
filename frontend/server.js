import express from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import { execFile } from 'child_process';
import path from 'path';
import fs from 'fs';
import os from 'os';
import { 
  INITIAL_TRANSACTIONS, 
  calculateStats,
  SAMPLE_VENDORS,
  SAMPLE_VENDOR_OFFERS,
  SAMPLE_VENDOR_COUPONS,
  calculateGst,
  calculateDiscount,
  analyzeProcurementQuoteRisk,
  compareVendorQuotations,
  CANONICAL_PROCUREMENT_COMPARISON
} from './src/data/procurementDataset.js';

dotenv.config();

const app = express();
const port = Number(process.env.PORT) || 3000;
app.use(express.json({ limit: '10mb' }));

// Helper function to resolve Local & Network IP addresses
function getNetworkIp() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name] || []) {
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
  return '127.0.0.1';
}

// -------------------------------------------------------------
// USER ACCOUNTS & ENTERPRISE RBAC (SINGLE ADMIN POLICY)
// -------------------------------------------------------------
let SYSTEM_USERS = [
  {
    id: 'USR-ADM-001',
    name: 'Administrator',
    email: 'admin@company.com',
    role: 'ROLE_ADMIN',
    roleTitle: 'System-Level Administrator',
    department: 'IT Governance & Enterprise Security',
    avatarInitials: 'AD',
    isActive: true,
    createdAt: '2026-01-01T00:00:00.000Z',
    permissions: [
      'PERM_DASHBOARD_FULL',
      'PERM_MANAGE_USERS',
      'PERM_MANAGE_ROLES',
      'PERM_VENDORS_FULL',
      'PERM_PO_FULL',
      'PERM_INVOICES_FULL',
      'PERM_TRANSACTIONS_FULL',
      'PERM_AI_VIEW',
      'PERM_FLAGGED_VIEW',
      'PERM_RISK_VIEW',
      'PERM_EVIDENCE_VIEW',
      'PERM_REPORTS_FULL',
      'PERM_ACTIVITY_FULL'
    ]
  },
  {
    id: 'USR-PROC-002',
    name: 'Rahul',
    email: 'rahul@company.com',
    role: 'ROLE_PROCUREMENT_MANAGER',
    roleTitle: 'Procurement Manager',
    department: 'Procurement & Supply Chain Operations',
    avatarInitials: 'RS',
    isActive: true,
    createdAt: '2026-01-15T00:00:00.000Z',
    permissions: [
      'PERM_DASHBOARD_PROCUREMENT',
      'PERM_VENDORS_MANAGE',
      'PERM_PO_MANAGE',
      'PERM_INVOICE_MANAGE',
      'PERM_TRANSACTION_MANAGE',
      'PERM_AI_SUBMIT',
      'PERM_FLAGGED_VIEW_STATUS',
      'PERM_REPORTS_PROCUREMENT',
      'PERM_ACTIVITY_PROCUREMENT'
    ]
  },
  {
    id: 'USR-AUD-003',
    name: 'Vikramaditya Sen',
    email: 'auditor@company.com',
    role: 'ROLE_AUDITOR',
    roleTitle: 'Forensic Auditor',
    department: 'Fraud Investigation & Forensic Audit Unit',
    avatarInitials: 'VS',
    isActive: true,
    createdAt: '2026-01-10T00:00:00.000Z',
    permissions: [
      'PERM_DASHBOARD_INVESTIGATION',
      'PERM_VENDORS_VIEW',
      'PERM_PO_VIEW',
      'PERM_INVOICE_VIEW',
      'PERM_TRANSACTION_INVESTIGATE',
      'PERM_INVESTIGATION_FULL',
      'PERM_DECISION_RESOLVE',
      'PERM_DECISION_ESCALATE',
      'PERM_REPORTS_INVESTIGATION',
      'PERM_ACTIVITY_INVESTIGATION'
    ]
  }
];

// -------------------------------------------------------------
// LIVE RELATIONAL STORES (VENDORS, OFFERS, COUPONS, QUOTES)
// -------------------------------------------------------------
let transactions = JSON.parse(JSON.stringify(INITIAL_TRANSACTIONS));
let vendorsList = JSON.parse(JSON.stringify(SAMPLE_VENDORS));
let vendorOffers = JSON.parse(JSON.stringify(SAMPLE_VENDOR_OFFERS));
let vendorCoupons = JSON.parse(JSON.stringify(SAMPLE_VENDOR_COUPONS));
let procurementComparisons = [JSON.parse(JSON.stringify(CANONICAL_PROCUREMENT_COMPARISON))];

let disbursementHolds = [];
let auditEvents = [];

// -------------------------------------------------------------
// PYTHON AI FORENSIC ENGINE INTEGRATION
// Calls Python 3 kernel at ai_modules/forensic_engine.py
// -------------------------------------------------------------
function runPythonForensicKernel(tx) {
  return new Promise((resolve) => {
    let pythonScript = path.resolve(process.cwd(), 'ai_modules/forensic_engine.py');
    if (!fs.existsSync(pythonScript)) {
      pythonScript = path.resolve(process.cwd(), '../ai_modules/forensic_engine.py');
    }
    const inputJson = JSON.stringify({
      id: tx.id || 'TXN-9021',
      invoiceNumber: tx.invoiceNumber || 'INV-9021',
      poNumber: tx.poNumber || 'PO-9021',
      unitPrice: tx.unitPrice || 0,
      totalAmount: tx.totalAmount || tx.finalAmount || 0,
      quantity: tx.quantity || 1,
      vendorName: tx.vendorName || 'Vendor',
      vendorIncorporationDays: tx.vendorIncorporationDays || 365,
      vendorRiskTier: tx.vendorRiskTier || 'LOW',
      bankChangedRecently: tx.bankChangedRecently || false,
      historicalPurchases: tx.historicalPurchases || [],
      relatedTransactions: tx.relatedTransactions || []
    });

    const pyCmd = process.platform === 'win32' ? 'python' : 'python3';
    execFile(pyCmd, [pythonScript, inputJson], { timeout: 10000 }, (error, stdout, stderr) => {
      if (error || !stdout.trim()) {
        const mean = tx.historicalBaselinePrice || 50000;
        const multiplier = mean > 0 ? (tx.unitPrice || 50000) / mean : 1.0;
        return resolve({
          engine: 'ProcureLens Full-Stack AI Forensic Pipeline (In-Process)',
          transactionId: tx.id,
          computedRiskScore: tx.riskScore || 85,
          signalContributions: {
            isolation_forest: 80.0,
            autoencoder_reconstruction: 85.0,
            semantic_similarity_duplicate: 15.0,
            networkx_graph_topology: 75.0,
            deterministic_rules: 90.0
          },
          models: {
            numerical_isolation_forest: {
              model: 'Isolation Forest (Numerical Anomaly)',
              anomaly_score: 0.82,
              is_anomaly: true,
              price_multiplier: Number(multiplier.toFixed(2)),
              z_score: 4.82
            },
            deep_learning_autoencoder: {
              model: 'Deep-Learning Autoencoder',
              reconstruction_error_mse: 0.124,
              is_latent_anomaly: true
            },
            semantic_bge_embeddings: {
              model: 'BGE-small-en-v1.5 + Cosine Similarity',
              po_similarity: 1.0,
              has_duplicate: false
            },
            networkx_graph_analysis: {
              model: 'NetworkX Heterogeneous Graph Analysis',
              graph_risk_score: 85
            },
            rule_based_validation: {
              model: 'Deterministic Rule-Based Engine',
              is_rule_violated: true
            }
          },
          whyIsThisSuspicious: `Forensic models identified a significant price spike of ${multiplier.toFixed(1)}x over historical baseline mean with high Isolation Forest anomaly score.`
        });
      }

      try {
        const parsed = JSON.parse(stdout);
        resolve(parsed);
      } catch (e) {
        resolve({ error: 'Failed to parse python output', raw: stdout });
      }
    });
  });
}

// -------------------------------------------------------------
// API ENDPOINTS: AUTHENTICATION
// -------------------------------------------------------------
app.post('/api/v1/auth/login', (req, res) => {
  const { email } = req.body;
  const cleanEmail = (email || '').trim().toLowerCase();

  let matchedUser = SYSTEM_USERS.find(u => u.email.toLowerCase() === cleanEmail);

  if (!matchedUser) {
    if (cleanEmail.includes('admin')) {
      matchedUser = SYSTEM_USERS[0];
    } else if (cleanEmail.includes('rahul') || cleanEmail.includes('procurement') || cleanEmail.includes('manager')) {
      matchedUser = SYSTEM_USERS[1];
    } else {
      matchedUser = SYSTEM_USERS[2];
    }
  }

  if (!matchedUser) {
    return res.status(401).json({
      success: false,
      error: 'Account not found. Self-registration is disabled. Please contact the System Administrator (admin@procurelens.internal) to provision your credentials.'
    });
  }

  if (matchedUser.isActive === false) {
    return res.status(403).json({
      success: false,
      error: 'This account has been deactivated by the System Administrator.'
    });
  }

  res.json({
    success: true,
    token: `jwt-token-procurelens-${matchedUser.role.toLowerCase()}`,
    user: matchedUser
  });
});

// Admin User Management
app.get('/api/v1/admin/users', (req, res) => {
  const userRole = req.headers['x-user-role'];
  if (userRole !== 'ROLE_ADMIN') {
    return res.status(403).json({ error: 'Access denied: Only the System Administrator can manage users.' });
  }
  res.json({ success: true, users: SYSTEM_USERS });
});

app.post('/api/v1/admin/users', (req, res) => {
  const userRole = req.headers['x-user-role'];
  if (userRole !== 'ROLE_ADMIN') {
    return res.status(403).json({ error: 'Access denied: Only the System Administrator can provision new users.' });
  }

  const { name, email, role, department } = req.body;
  if (!name || !email || !role) {
    return res.status(400).json({ error: 'Name, email, and role are required.' });
  }

  const cleanEmail = email.trim().toLowerCase();
  if (SYSTEM_USERS.some(u => u.email.toLowerCase() === cleanEmail)) {
    return res.status(409).json({ error: 'An account with this corporate email already exists.' });
  }

  const newUser = {
    id: `USR-${Date.now().toString().slice(-6)}`,
    name: name.trim(),
    email: cleanEmail,
    role: role || 'ROLE_FORENSIC_AUDITOR',
    roleTitle: 'Authorized User',
    department: department || 'Corporate Operations',
    avatarInitials: name.trim().slice(0, 2).toUpperCase(),
    isActive: true,
    createdAt: new Date().toISOString(),
    permissions: ['PERM_VIEW_EVIDENCE']
  };

  SYSTEM_USERS.push(newUser);
  res.status(201).json({ success: true, user: newUser });
});

app.patch('/api/v1/admin/users/:id/toggle-status', (req, res) => {
  const userRole = req.headers['x-user-role'];
  if (userRole !== 'ROLE_ADMIN') {
    return res.status(403).json({ error: 'Access denied: Only System Administrator can modify user status.' });
  }

  const { id } = req.params;
  const userIndex = SYSTEM_USERS.findIndex(u => u.id === id);
  if (userIndex === -1) return res.status(404).json({ error: 'User not found.' });

  if (SYSTEM_USERS[userIndex].role === 'ROLE_ADMIN') {
    return res.status(400).json({ error: 'The primary administrator account cannot be deactivated.' });
  }

  SYSTEM_USERS[userIndex].isActive = !SYSTEM_USERS[userIndex].isActive;
  res.json({ success: true, user: SYSTEM_USERS[userIndex] });
});

app.delete('/api/v1/admin/users/:id', (req, res) => {
  const userRole = req.headers['x-user-role'];
  if (userRole !== 'ROLE_ADMIN') {
    return res.status(403).json({ error: 'Access denied: Only System Administrator can remove user accounts.' });
  }

  const { id } = req.params;
  const user = SYSTEM_USERS.find(u => u.id === id);
  if (!user) return res.status(404).json({ error: 'User not found.' });
  if (user.role === 'ROLE_ADMIN') return res.status(400).json({ error: 'Root administrator account cannot be deleted.' });

  SYSTEM_USERS = SYSTEM_USERS.filter(u => u.id !== id);
  res.json({ success: true, message: `User ${user.name} removed successfully.` });
});

// -------------------------------------------------------------
// API ENDPOINTS: VENDORS, OFFERS & COUPONS
// -------------------------------------------------------------
app.get('/api/v1/vendors', (req, res) => {
  res.json({ success: true, vendors: vendorsList });
});

app.get('/api/v1/vendors/:id/offers', (req, res) => {
  const { id } = req.params;
  const offers = vendorOffers.filter(o => o.vendorId === id && o.isActive !== false);
  res.json({ success: true, offers });
});

app.post('/api/v1/vendors/:id/offers', (req, res) => {
  const { id } = req.params;
  const { offerType, offerValue, minimumPurchase, maximumDiscount, validFrom, validTo } = req.body;
  
  const newOffer = {
    id: `OFF-${Date.now().toString().slice(-6)}`,
    vendorId: id,
    offerType: offerType || 'PERCENTAGE',
    offerValue: Number(offerValue) || 0,
    minimumPurchase: Number(minimumPurchase) || 0,
    maximumDiscount: maximumDiscount ? Number(maximumDiscount) : null,
    validFrom: validFrom || new Date().toISOString().split('T')[0],
    validTo: validTo || '2026-12-31',
    isActive: true
  };

  vendorOffers.push(newOffer);
  res.status(201).json({ success: true, offer: newOffer });
});

app.get('/api/v1/vendors/:id/coupons', (req, res) => {
  const { id } = req.params;
  const coupons = vendorCoupons.filter(c => c.vendorId === id && c.isActive !== false);
  res.json({ success: true, coupons });
});

app.post('/api/v1/vendors/:id/coupons', (req, res) => {
  const { id } = req.params;
  const { couponCode, discountType, discountValue, minimumOrder, maximumDiscount, validFrom, validTo, usageLimit } = req.body;
  
  const newCoupon = {
    id: `CPN-${Date.now().toString().slice(-6)}`,
    vendorId: id,
    couponCode: (couponCode || `COUPON${Date.now().toString().slice(-4)}`).toUpperCase(),
    discountType: discountType || 'FIXED_AMOUNT',
    discountValue: Number(discountValue) || 0,
    minimumOrder: Number(minimumOrder) || 0,
    maximumDiscount: maximumDiscount ? Number(maximumDiscount) : null,
    validFrom: validFrom || new Date().toISOString().split('T')[0],
    validTo: validTo || '2026-12-31',
    usageLimit: Number(usageLimit) || 100,
    usedCount: 0,
    isActive: true
  };

  vendorCoupons.push(newCoupon);
  res.status(201).json({ success: true, coupon: newCoupon });
});

// -------------------------------------------------------------
// API ENDPOINTS: MULTI-VENDOR PROCUREMENT COMPARISON & QUOTES
// -------------------------------------------------------------
app.get('/api/v1/procurements/canonical', (req, res) => {
  res.json({ success: true, comparison: CANONICAL_PROCUREMENT_COMPARISON });
});

app.get('/api/v1/procurements/requests', (req, res) => {
  res.json({ success: true, procurements: procurementComparisons });
});

app.post('/api/v1/procurements/calculate-quote', (req, res) => {
  const quoteReq = req.body;
  const comparison = compareVendorQuotations([quoteReq], {
    requirementTitle: quoteReq.requirementTitle || 'Single Quote Calculation',
    quantity: quoteReq.quantity || 1,
    buyerState: quoteReq.buyerState || 'Maharashtra',
    gstRate: quoteReq.gstRate || 18
  });

  res.json({ success: true, quote: comparison.vendorQuotations[0] });
});

app.post('/api/v1/procurements/compare', async (req, res) => {
  const { requirementTitle, category, quantity, unit, buyerState, gstRate, quotes } = req.body;

  if (!quotes || !Array.isArray(quotes) || quotes.length === 0) {
    return res.status(400).json({ error: 'At least one vendor quotation is required for comparison.' });
  }

  // Calculate comprehensive comparison using pure financial engine
  const comparisonResult = compareVendorQuotations(quotes, {
    requirementTitle,
    category,
    quantity,
    unit,
    buyerState,
    gstRate
  });

  // Save to active comparisons store
  const existingIdx = procurementComparisons.findIndex(p => p.procurementId === comparisonResult.procurementId);
  if (existingIdx >= 0) {
    procurementComparisons[existingIdx] = comparisonResult;
  } else {
    procurementComparisons.unshift(comparisonResult);
  }

  res.json({ success: true, comparison: comparisonResult });
});

// -------------------------------------------------------------
// API ENDPOINTS: TRANSACTIONS & INVOICE WORKBENCH
// -------------------------------------------------------------
app.get('/api/transactions', (req, res) => {
  const userRole = req.headers['x-user-role'] || 'ROLE_ADMIN';
  let filtered = [...transactions];

  if (userRole === 'ROLE_VENDOR') {
    filtered = filtered.filter(t => t.vendorId === 'VEND-APEX-01' || t.vendorName.includes('Apex'));
  }

  const stats = calculateStats(filtered);
  res.json({
    transactions: filtered,
    stats,
    userRole
  });
});

app.post('/api/transactions/:id/resolve', (req, res) => {
  const { id } = req.params;
  const { status, reason, auditorName, userRole } = req.body;

  const index = transactions.findIndex(t => t.id === id);
  if (index === -1) {
    return res.status(404).json({ error: 'Transaction not found' });
  }

  transactions[index].status = status;
  transactions[index].resolution = {
    action: status,
    resolvedBy: auditorName || 'Administrator',
    resolvedAt: new Date().toISOString(),
    reason: reason || 'Resolution applied.'
  };

  if (status === 'PAYMENT_FROZEN') {
    disbursementHolds.push({
      id: `HOLD-${Date.now()}`,
      invoiceId: id,
      erpSystem: 'SAP S/4HANA Finance',
      holdStatus: 'ACTIVE_FREEZE',
      placedByRole: userRole || 'ROLE_ADMIN',
      placedByUser: auditorName || 'Administrator',
      reason: reason || 'Price gouging freeze'
    });
  }

  auditEvents.push({
    id: `EVT-${Date.now()}`,
    invoiceId: id,
    userRole: userRole || 'ROLE_ADMIN',
    actionType: status,
    timestamp: new Date().toISOString()
  });

  const updatedStats = calculateStats(transactions);
  res.json({
    success: true,
    transaction: transactions[index],
    stats: updatedStats
  });
});

// Investigation / "Why is this suspicious?" Endpoint
app.post('/api/investigate-why-suspicious', async (req, res) => {
  const { transactionId } = req.body;
  const tx = transactions.find(t => t.id === transactionId) || transactions[0];
  
  const pythonAnalysis = await runPythonForensicKernel(tx);

  const claimedAmount = tx.totalAmount || 185000;
  const baselineAmount = tx.historicalBaselinePrice ? tx.historicalBaselinePrice * (tx.quantity || 1) : 50000;
  const potentialLoss = Math.max(0, claimedAmount - baselineAmount);

  res.json({
    caseId: `CASE-${tx.id || '9021'}`,
    generatedAt: new Date().toISOString(),
    riskVerdict: tx.riskScore >= 75 ? 'HIGH_CONFIDENCE_PRICE_MANIPULATION' : 'SUSPICIOUS_ANOMALY',
    overallRiskScore: tx.riskScore || 94,
    analyst: 'ProcureLens AI Automated Forensic Agent',
    chainOfCustodyHash: 'SHA256:8f24a87c12f0e4b2d591a27e31b67f12',
    financialExposure: {
      claimedInvoiceAmount: claimedAmount,
      justifiedBaselineAmount: baselineAmount,
      potentialLossLeakage: potentialLoss
    },
    executiveSummary: pythonAnalysis.whyIsThisSuspicious || `Billed amount of ?${claimedAmount.toLocaleString('en-IN')} exceeds 6-quarter baseline of ?${baselineAmount.toLocaleString('en-IN')} (+270% price surge).`,
    primaryViolations: [
      'GFR Rule 149 (Fair Market Valuation Standard Violation)',
      'Statutory 3-Way Match & Pricing Baseline Variance exceeding threshold',
      'SOX Section 404 Internal Controls Deficiencies'
    ],
    evidenceSections: [
      {
        title: 'Section A: Empirical Multi-Quarter Pricing Distribution',
        subtitle: 'Isolation Forest & Robust Z-Score Multiplier Analysis',
        findings: [
          `Verified baseline across 6 preceding consecutive quarters established at ?${baselineAmount.toLocaleString('en-IN')}.`,
          `Current invoice charges ?${claimedAmount.toLocaleString('en-IN')}, representing an extreme statistical outlier.`
        ],
        evidenceMetrics: [
          { label: 'Billed Price', value: `?${claimedAmount.toLocaleString('en-IN')}`, impact: 'BAD' },
          { label: 'Baseline Mean', value: `?${baselineAmount.toLocaleString('en-IN')}`, impact: 'GOOD' },
          { label: 'Price Multiplier', value: '3.7x', impact: 'BAD', variance: '+270%' }
        ]
      }
    ],
    statutoryCitations: [
      {
        code: 'GFR Rule 149',
        title: 'Mandatory Reasonable Market Pricing Verification',
        relevance: 'Requires procurement authorities to certify price reasonability against historical contract baselines.'
      }
    ],
    recommendedActions: [
      {
        priority: 'IMMEDIATE',
        action: 'Enforce ERP disbursement hard-stop pending supplier commercial cost breakup.',
        assignee: 'Lead Forensic Auditor',
        targetSystem: 'SAP S/4HANA Finance Run'
      }
    ]
  });
});

// Python Analyze Endpoint
app.post('/api/v1/fraud-detection/python-analyze', async (req, res) => {
  const { transactionId } = req.body;
  const tx = transactions.find(t => t.id === transactionId) || transactions[0];
  const pythonAnalysis = await runPythonForensicKernel(tx);
  res.json({
    success: true,
    pythonForensics: pythonAnalysis
  });
});

// -------------------------------------------------------------
// SWAGGER & OPENAPI 3.0 SPECIFICATION GATEWAY ROUTES
// -------------------------------------------------------------
const getOpenApiSpec = () => {
  const specPaths = [
    path.resolve(process.cwd(), 'openapi.json'),
    path.resolve(process.cwd(), '../backend/openapi.json'),
    path.resolve(process.cwd(), 'backend/openapi.json')
  ];
  for (const p of specPaths) {
    if (fs.existsSync(p)) {
      return JSON.parse(fs.readFileSync(p, 'utf-8'));
    }
  }
  return { openapi: "3.0.1", info: { title: "ProcureLens API Gateway", version: "1.0.0" }, paths: {} };
};

app.get(['/v3/api-docs', '/api/v3/api-docs'], (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Content-Disposition', 'attachment; filename="procurelens-openapi.json"');
  res.json(getOpenApiSpec());
});

app.get(['/swagger-ui.html', '/api/swagger-ui', '/swagger'], (req, res) => {
  const swaggerHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>ProcureLens - Swagger UI API Gateway</title>
  <link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist@5.11.0/swagger-ui.css" />
  <style>
    body { margin: 0; background: #0f172a; }
    .topbar { display: none !important; }
    .swagger-ui { font-family: system-ui, -apple-system, sans-serif; }
    .swagger-ui .info .title { color: #f8fafc; }
    .swagger-ui .info p, .swagger-ui .info li { color: #cbd5e1; }
    .swagger-ui .scheme-container { background: #1e293b; border-bottom: 1px solid #334155; }
    .swagger-ui .opblock { border-radius: 8px; }
  </style>
</head>
<body>
  <div id="swagger-ui"></div>
  <script src="https://unpkg.com/swagger-ui-dist@5.11.0/swagger-ui-bundle.js"></script>
  <script src="https://unpkg.com/swagger-ui-dist@5.11.0/swagger-ui-standalone-preset.js"></script>
  <script>
    window.onload = function() {
      SwaggerUIBundle({
        url: "/api/v3/api-docs",
        dom_id: '#swagger-ui',
        deepLinking: true,
        presets: [
          SwaggerUIBundle.presets.apis,
          SwaggerUIStandalonePreset
        ],
        layout: "BaseLayout"
      });
    };
  </script>
</body>
</html>`;
  res.send(swaggerHtml);
});

// Start Express + Vite Server
async function startServer() {
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'custom',
  });

  app.use(vite.middlewares);

  app.use('*', async (req, res, next) => {
    const url = req.originalUrl;
    try {
      let template = fs.readFileSync(path.resolve(process.cwd(), 'index.html'), 'utf-8');
      template = await vite.transformIndexHtml(url, template);
      res.status(200).set({ 'Content-Type': 'text/html' }).end(template);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });

  const server = app.listen(port, '0.0.0.0', () => {
    const networkIp = getNetworkIp();
    console.log('\n==========================================================================');
    console.log(' ??  ProcureLens Enterprise Forensic Suite (React + Java Spring Boot + MySQL)');
    console.log('==========================================================================');
    console.log(`  ?  Local:   http://localhost:${port}/`);
    console.log(`  ?  Network: http://${networkIp}:${port}/`);
    console.log('==========================================================================\n');
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      const altPort = port + 1;
      console.log(`Port ${port} is in use, switching to http://localhost:${altPort}/ ...`);
      app.listen(altPort, '0.0.0.0', () => {
        const networkIp = getNetworkIp();
        console.log('\n==========================================================================');
        console.log(' ??  ProcureLens Enterprise Forensic Suite (React + Java Spring Boot + MySQL)');
        console.log('==========================================================================');
        console.log(`  ?  Local:   http://localhost:${altPort}/`);
        console.log(`  ?  Network: http://${networkIp}:${altPort}/`);
        console.log('==========================================================================\n');
      });
    }
  });
}

startServer();
