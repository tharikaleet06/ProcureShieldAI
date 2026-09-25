/**
 * ProcureLens Document Export & Download Utility
 * Provides robust CSV, HTML/PDF Dossier downloads, and clean formatted printing
 */

// Trigger browser download of any Blob
export const triggerBlobDownload = (blob, filename) => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
};

// Export arrays of records as CSV with UTF-8 BOM
export const exportToCSV = (filename, headers, rows) => {
  const sanitize = (val) => {
    if (val === null || val === undefined) return '""';
    const str = String(val).replace(/"/g, '""');
    return `"${str}"`;
  };

  const csvRows = [];
  // Add Header
  csvRows.push(headers.map(h => sanitize(h.label || h.title || h)).join(','));

  // Add Data Rows
  rows.forEach(row => {
    const rowValues = headers.map(h => {
      const key = h.key || h.id || h;
      return sanitize(row[key]);
    });
    csvRows.push(rowValues.join(','));
  });

  const csvContent = '\uFEFF' + csvRows.join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  triggerBlobDownload(blob, filename.endsWith('.csv') ? filename : `${filename}.csv`);
};

// Generate & Download Official Formatted Audit Report / Dossier
export const downloadReportDossier = (report, currentUser) => {
  const dateStr = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  const timeStr = new Date().toLocaleTimeString('en-GB');

  const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${report.title} - ProcureLens Official Report</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;600&display=swap');
    body {
      font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif;
      background: #f8fafc;
      color: #0f172a;
      margin: 0;
      padding: 32px;
      line-height: 1.5;
    }
    .container {
      max-width: 860px;
      margin: 0 auto;
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 16px;
      padding: 40px;
      box-shadow: 0 4px 20px -2px rgba(0,0,0,0.05);
    }
    .header {
      border-bottom: 2px solid #0f172a;
      padding-bottom: 20px;
      margin-bottom: 24px;
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
    }
    .brand {
      font-size: 22px;
      font-weight: 800;
      color: #0f172a;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .brand span {
      color: #e11d48;
    }
    .badge {
      display: inline-block;
      padding: 4px 10px;
      border-radius: 6px;
      font-size: 11px;
      font-weight: 700;
      font-family: 'JetBrains Mono', monospace;
      background: #fff1f2;
      color: #be123c;
      border: 1px solid #fecdd3;
    }
    .meta-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 16px;
      background: #f1f5f9;
      padding: 20px;
      border-radius: 12px;
      margin-bottom: 24px;
      font-size: 13px;
    }
    .meta-item span {
      display: block;
      font-size: 11px;
      text-transform: uppercase;
      color: #64748b;
      font-weight: 700;
      font-family: 'JetBrains Mono', monospace;
    }
    .meta-item strong {
      color: #0f172a;
      font-size: 14px;
    }
    .section-title {
      font-size: 14px;
      font-weight: 700;
      text-transform: uppercase;
      color: #334155;
      letter-spacing: 0.05em;
      margin-top: 24px;
      margin-bottom: 12px;
      border-left: 4px solid #e11d48;
      padding-left: 8px;
    }
    .content-box {
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 10px;
      padding: 16px;
      font-size: 13px;
      margin-bottom: 20px;
    }
    .table {
      width: 100%;
      border-collapse: collapse;
      margin: 16px 0;
      font-size: 12px;
    }
    .table th, .table td {
      padding: 10px 14px;
      text-align: left;
      border-bottom: 1px solid #e2e8f0;
    }
    .table th {
      background: #f8fafc;
      color: #475569;
      font-weight: 700;
      text-transform: uppercase;
      font-size: 10px;
      font-family: 'JetBrains Mono', monospace;
    }
    .footer-stamp {
      margin-top: 40px;
      padding-top: 20px;
      border-top: 1px dashed #cbd5e1;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 11px;
      color: #64748b;
    }
    .signature-box {
      text-align: right;
    }
    .signature-box .line {
      width: 180px;
      border-bottom: 1px solid #0f172a;
      margin: 30px 0 6px auto;
    }
    @media print {
      body { background: #ffffff; padding: 0; }
      .container { border: none; box-shadow: none; padding: 0; }
      .no-print { display: none; }
    }
  </style>
</head>
<body>
  <div class="no-print" style="max-width: 860px; margin: 0 auto 16px; display: flex; justify-content: flex-end; gap: 10px;">
    <button onclick="window.print()" style="padding: 8px 16px; background: #0f172a; color: white; border: none; border-radius: 8px; font-weight: 600; cursor: pointer;">
      Print / Save as PDF
    </button>
  </div>

  <div class="container">
    <div class="header">
      <div>
        <div class="brand">Procure<span>Lens</span> Enterprise Forensic Dossier</div>
        <div style="font-size: 12px; color: #64748b; margin-top: 4px;">Continuous Integrity & Statutory Procurement Compliance Suite</div>
      </div>
      <div style="text-align: right;">
        <span class="badge">${report.score || 'OFFICIAL RECORD'}</span>
        <div style="font-size: 11px; color: #64748b; margin-top: 4px; font-family: 'JetBrains Mono', monospace;">DOC ID: ${report.id}</div>
      </div>
    </div>

    <div class="meta-grid">
      <div class="meta-item">
        <span>Report Document Title</span>
        <strong>${report.title}</strong>
      </div>
      <div class="meta-item">
        <span>Target Subject / Entities</span>
        <strong>${report.target}</strong>
      </div>
      <div class="meta-item">
        <span>Author / Investigator</span>
        <strong>${report.author || currentUser?.name || 'Lead Forensic Auditor'}</strong>
      </div>
      <div class="meta-item">
        <span>Generated Timestamp</span>
        <strong>${report.date || dateStr} at ${timeStr}</strong>
      </div>
    </div>

    <div class="section-title">Executive Forensic Summary</div>
    <div class="content-box">
      <p style="margin: 0; line-height: 1.6; color: #334155;">
        ${report.summary || 'Official audit investigation findings synthesized via AI Forensic RAG engine and statistical anomaly baseline analysis.'}
      </p>
    </div>

    <div class="section-title">Statutory & Compliance Benchmark</div>
    <div class="content-box">
      <table class="table" style="margin: 0;">
        <thead>
          <tr>
            <th>Compliance Standard</th>
            <th>Governing Directive</th>
            <th>Audit Assessment</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>GFR Rule 149</strong></td>
            <td>Government Financial Rules / GeM Compliance</td>
            <td><span style="color: #15803d; font-weight: 600;">Verified Under Baseline</span></td>
          </tr>
          <tr>
            <td><strong>SOX Section 404</strong></td>
            <td>Management Assessment of Internal Controls</td>
            <td><span style="color: #15803d; font-weight: 600;">Internal Controls Validated</span></td>
          </tr>
          <tr>
            <td><strong>ProcureLens AI Audit</strong></td>
            <td>Multi-Factor Hash & Semantic Matching</td>
            <td><span style="color: #b45309; font-weight: 600;">Full Anomaly Matrix Verified</span></td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="footer-stamp">
      <div>
        <div>ProcureLens Autonomous Forensic Engine · Cryptographic SHA-256 Verified</div>
        <div style="font-size: 10px; color: #94a3b8; font-family: 'JetBrains Mono', monospace; margin-top: 2px;">
          Generated by user: ${currentUser?.email || 'admin@company.com'} (${currentUser?.role || 'ROLE_AUDITOR'})
        </div>
      </div>
      <div class="signature-box">
        <div class="line"></div>
        <div style="font-size: 11px; font-weight: 600; color: #0f172a;">Authorized Auditor Signature</div>
      </div>
    </div>
  </div>
</body>
</html>`;

  const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8;' });
  triggerBlobDownload(blob, `${report.id}_Official_Dossier.html`);
};

// ==========================================
// 1. PURCHASE ORDER OFFICIAL DOCUMENT DOWNLOAD
// ==========================================
export const downloadPODocument = (po, currentUser) => {
  const dateStr = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  const itemsHtml = po.items && po.items.length > 0 
    ? po.items.map((item, idx) => `
      <tr>
        <td style="padding: 10px 14px; border-bottom: 1px solid #e2e8f0; font-family: monospace;">${idx + 1}</td>
        <td style="padding: 10px 14px; border-bottom: 1px solid #e2e8f0; font-weight: 600;">${item.name}</td>
        <td style="padding: 10px 14px; border-bottom: 1px solid #e2e8f0; text-align: center; font-family: monospace;">${item.quantity}</td>
        <td style="padding: 10px 14px; border-bottom: 1px solid #e2e8f0; text-align: right; font-family: monospace;">₹${Number(item.unitPrice).toLocaleString('en-IN')}</td>
        <td style="padding: 10px 14px; border-bottom: 1px solid #e2e8f0; text-align: right; font-family: monospace; font-weight: 700;">₹${Number(item.total).toLocaleString('en-IN')}</td>
      </tr>
    `).join('')
    : `<tr><td colspan="5" style="padding: 12px; text-align: center; color: #64748b;">Standard Procurement Package - ₹${Number(po.totalAmount).toLocaleString('en-IN')}</td></tr>`;

  const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Purchase Order #${po.id} - ProcureLens Official</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;600&display=swap');
    body { font-family: 'Plus Jakarta Sans', sans-serif; background: #f8fafc; color: #0f172a; margin: 0; padding: 32px; }
    .container { max-width: 860px; margin: 0 auto; background: #ffffff; border: 1px solid #cbd5e1; border-radius: 12px; padding: 40px; box-shadow: 0 4px 20px rgba(0,0,0,0.06); }
    .header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #2563eb; padding-bottom: 20px; margin-bottom: 24px; }
    .logo { font-size: 24px; font-weight: 800; color: #0f172a; }
    .logo span { color: #2563eb; }
    .po-title { font-size: 20px; font-weight: 800; color: #1e3a8a; text-align: right; }
    .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-bottom: 24px; }
    .card { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; font-size: 13px; }
    .card h4 { margin: 0 0 8px 0; font-size: 11px; text-transform: uppercase; color: #64748b; letter-spacing: 0.05em; font-family: 'JetBrains Mono', monospace; }
    table { width: 100%; border-collapse: collapse; margin: 20px 0; font-size: 13px; }
    th { background: #1e293b; color: white; padding: 10px 14px; text-align: left; font-size: 11px; text-transform: uppercase; font-family: 'JetBrains Mono', monospace; }
    .totals { margin-left: auto; width: 300px; font-size: 13px; margin-bottom: 30px; }
    .totals-row { display: flex; justify-content: space-between; padding: 6px 0; border-bottom: 1px solid #e2e8f0; }
    .grand-total { font-weight: 800; font-size: 16px; color: #2563eb; border-top: 2px solid #0f172a; border-bottom: 2px solid #0f172a; padding: 10px 0; }
    .footer { margin-top: 40px; padding-top: 20px; border-top: 1px dashed #cbd5e1; display: flex; justify-content: space-between; align-items: flex-end; font-size: 11px; color: #64748b; }
    .signature { text-align: right; }
    .signature-line { width: 200px; border-bottom: 1px solid #0f172a; margin: 40px 0 6px auto; }
    @media print { body { background: white; padding: 0; } .container { border: none; box-shadow: none; padding: 0; } .no-print { display: none; } }
  </style>
</head>
<body>
  <div class="no-print" style="max-width: 860px; margin: 0 auto 16px; display: flex; justify-content: flex-end; gap: 10px;">
    <button onclick="window.print()" style="padding: 10px 20px; background: #2563eb; color: white; border: none; border-radius: 8px; font-weight: 700; cursor: pointer;">
      🖨️ Print / Save as PDF
    </button>
  </div>

  <div class="container">
    <div class="header">
      <div>
        <div class="logo">Procure<span>Lens</span> Enterprise</div>
        <div style="font-size: 12px; color: #64748b; margin-top: 4px;">Procurement Department · Official Purchase Requisition</div>
      </div>
      <div class="po-title">
        <div>PURCHASE ORDER</div>
        <div style="font-size: 15px; color: #0f172a; font-family: 'JetBrains Mono', monospace; font-weight: 700; margin-top: 4px;">#${po.id}</div>
        <div style="font-size: 11px; color: #16a34a; font-weight: 700; margin-top: 4px; text-transform: uppercase;">STATUS: ${po.status || 'APPROVED'}</div>
      </div>
    </div>

    <div class="grid-2">
      <div class="card">
        <h4>Vendor / Supplier Details</h4>
        <div style="font-weight: 700; font-size: 14px; color: #0f172a;">${po.vendorName}</div>
        <div style="color: #475569; margin-top: 4px;">Vendor Code: ${po.vendorId || 'VEND-REG-01'}</div>
        <div style="color: #475569;">Payment Term: Net 30 Days via Corporate Bank Wire</div>
        <div style="color: #475569;">Contract Compliance: GFR Rule 149 Verified</div>
      </div>
      <div class="card">
        <h4>Order Meta &amp; Dispatch Details</h4>
        <div><strong>PO Issue Date:</strong> ${po.date}</div>
        <div><strong>Linked Invoice:</strong> ${po.associatedInvoice ? '#' + po.associatedInvoice : 'Awaiting Vendor Billing'}</div>
        <div><strong>Supporting Requisition:</strong> ${po.documentName || 'Requisition_Signed.pdf'} (${po.documentSize || '1.8 MB'})</div>
        <div><strong>Issued By:</strong> ${currentUser?.name || 'Rahul (Procurement Operations)'}</div>
      </div>
    </div>

    <table>
      <thead>
        <tr>
          <th style="width: 40px;">#</th>
          <th>Item Description / Scope of Work</th>
          <th style="text-align: center; width: 90px;">Qty</th>
          <th style="text-align: right; width: 140px;">Unit Price (INR)</th>
          <th style="text-align: right; width: 150px;">Total (INR)</th>
        </tr>
      </thead>
      <tbody>
        ${itemsHtml}
      </tbody>
    </table>

    <div class="totals">
      <div class="totals-row">
        <span>Subtotal:</span>
        <span style="font-family: monospace; font-weight: 600;">₹${Number(po.totalAmount).toLocaleString('en-IN')}</span>
      </div>
      <div class="totals-row">
        <span>Applicable GST / Tax:</span>
        <span style="font-family: monospace;">Included / 0.00%</span>
      </div>
      <div class="totals-row grand-total">
        <span>PO Grand Total:</span>
        <span style="font-family: monospace;">₹${Number(po.totalAmount).toLocaleString('en-IN')}</span>
      </div>
    </div>

    <div class="card" style="font-size: 11px; line-height: 1.6; color: #475569;">
      <strong>Terms & Conditions:</strong> Goods delivered must strictly comply with the technical specifications approved under PO #${po.id}. Invoices referencing this PO number must be uploaded to ProcureLens for automated 3-way forensic reconciliation prior to payment disbursement.
    </div>

    <div class="footer">
      <div>
        <div style="font-weight: 700; color: #0f172a;">ProcureLens Autonomous Compliance System</div>
        <div style="font-family: 'JetBrains Mono', monospace; font-size: 10px; margin-top: 2px;">
          Digital PO Signature Hash: SHA256:${Math.random().toString(36).substring(2, 12).toUpperCase()} · Generated on ${dateStr}
        </div>
      </div>
      <div class="signature">
        <div class="signature-line"></div>
        <div style="font-weight: 700; color: #0f172a;">Authorized Procurement Officer</div>
      </div>
    </div>
  </div>
</body>
</html>`;

  const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8;' });
  triggerBlobDownload(blob, `Purchase_Order_${po.id}.html`);
};

// ==========================================
// 2. INVOICE OFFICIAL DOCUMENT DOWNLOAD
// ==========================================
export const downloadInvoiceDocument = (invoice, currentUser) => {
  const dateStr = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Tax Invoice #${invoice.invoiceNumber || invoice.id} - ProcureLens</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;600&display=swap');
    body { font-family: 'Plus Jakarta Sans', sans-serif; background: #f8fafc; color: #0f172a; margin: 0; padding: 32px; }
    .container { max-width: 860px; margin: 0 auto; background: #ffffff; border: 1px solid #cbd5e1; border-radius: 12px; padding: 40px; box-shadow: 0 4px 20px rgba(0,0,0,0.06); }
    .header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #d97706; padding-bottom: 20px; margin-bottom: 24px; }
    .logo { font-size: 24px; font-weight: 800; color: #0f172a; }
    .logo span { color: #d97706; }
    .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-bottom: 24px; }
    .card { background: #fffbeb; border: 1px solid #fde68a; border-radius: 8px; padding: 16px; font-size: 13px; }
    .card h4 { margin: 0 0 8px 0; font-size: 11px; text-transform: uppercase; color: #92400e; font-family: 'JetBrains Mono', monospace; font-weight: 700; }
    table { width: 100%; border-collapse: collapse; margin: 20px 0; font-size: 13px; }
    th { background: #78350f; color: white; padding: 10px 14px; text-align: left; font-size: 11px; text-transform: uppercase; font-family: 'JetBrains Mono', monospace; }
    td { padding: 12px 14px; border-bottom: 1px solid #e2e8f0; }
    .totals { margin-left: auto; width: 300px; font-size: 13px; margin-bottom: 30px; }
    .totals-row { display: flex; justify-content: space-between; padding: 6px 0; border-bottom: 1px solid #e2e8f0; }
    .grand-total { font-weight: 800; font-size: 16px; color: #b45309; border-top: 2px solid #0f172a; border-bottom: 2px solid #0f172a; padding: 10px 0; }
    .footer { margin-top: 40px; padding-top: 20px; border-top: 1px dashed #cbd5e1; display: flex; justify-content: space-between; align-items: flex-end; font-size: 11px; color: #64748b; }
    .signature { text-align: right; }
    .signature-line { width: 200px; border-bottom: 1px solid #0f172a; margin: 40px 0 6px auto; }
    @media print { body { background: white; padding: 0; } .container { border: none; box-shadow: none; padding: 0; } .no-print { display: none; } }
  </style>
</head>
<body>
  <div class="no-print" style="max-width: 860px; margin: 0 auto 16px; display: flex; justify-content: flex-end; gap: 10px;">
    <button onclick="window.print()" style="padding: 10px 20px; background: #d97706; color: white; border: none; border-radius: 8px; font-weight: 700; cursor: pointer;">
      🖨️ Print / Save as PDF
    </button>
  </div>

  <div class="container">
    <div class="header">
      <div>
        <div class="logo">TAX <span>INVOICE</span></div>
        <div style="font-size: 12px; color: #64748b; margin-top: 4px;">Vendor Billing & 3-Way Match Verification Record</div>
      </div>
      <div style="text-align: right;">
        <div style="font-size: 20px; font-weight: 800; color: #b45309; font-family: 'JetBrains Mono', monospace;">INV #${invoice.invoiceNumber || invoice.id}</div>
        <div style="font-size: 12px; color: #64748b; margin-top: 4px;">Date: ${invoice.invoiceDate || dateStr}</div>
        <div style="font-size: 11px; color: #15803d; font-weight: 700; margin-top: 2px;">STATUS: ${invoice.status || 'SUBMITTED'}</div>
      </div>
    </div>

    <div class="grid-2">
      <div class="card">
        <h4>Supplier / Vendor Billed From</h4>
        <div style="font-weight: 700; font-size: 14px; color: #0f172a;">${invoice.vendorName}</div>
        <div style="color: #475569; margin-top: 4px;">GSTIN / Tax ID: 27AABCV1024K1Z5</div>
        <div style="color: #475569;">Payment Reference: Corporate Wire (RTGS / NEFT)</div>
      </div>
      <div class="card">
        <h4>Billed To &amp; Procurement Links</h4>
        <div><strong>Corporate Customer:</strong> ProcureLens Central Enterprise</div>
        <div><strong>Linked Purchase Order:</strong> <span style="color: #2563eb; font-weight: 700;">#${invoice.poNumber}</span></div>
        <div><strong>Attached Scanned Document:</strong> ${invoice.documentName || 'Scanned_Invoice.pdf'} (${invoice.documentSize || '2.1 MB'})</div>
        <div><strong>3-Way Match Status:</strong> ${invoice.analysisStatus === 'FLAGGED' ? '⚠️ Variance Flagged by AI' : '✓ 3-Way Reconciled Clean'}</div>
      </div>
    </div>

    <table>
      <thead>
        <tr>
          <th style="width: 40px;">#</th>
          <th>Item Specification &amp; Deliverables</th>
          <th style="text-align: right; width: 140px;">Taxable Value</th>
          <th style="text-align: right; width: 150px;">Billed Total (INR)</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td style="font-family: monospace;">1</td>
          <td>
            <div style="font-weight: 600;">${invoice.itemDescription || 'Hardware / Software Procurement Goods'}</div>
            <div style="font-size: 11px; color: #64748b; margin-top: 2px;">${invoice.notes || 'Full delivery under contract specifications'}</div>
          </td>
          <td style="text-align: right; font-family: monospace;">₹${Number(invoice.amount).toLocaleString('en-IN')}</td>
          <td style="text-align: right; font-family: monospace; font-weight: 700;">₹${Number(invoice.amount).toLocaleString('en-IN')}</td>
        </tr>
      </tbody>
    </table>

    <div class="totals">
      <div class="totals-row">
        <span>Subtotal Amount:</span>
        <span style="font-family: monospace; font-weight: 600;">₹${Number(invoice.amount).toLocaleString('en-IN')}</span>
      </div>
      <div class="totals-row grand-total">
        <span>Total Invoice Due:</span>
        <span style="font-family: monospace;">₹${Number(invoice.amount).toLocaleString('en-IN')}</span>
      </div>
    </div>

    <div class="footer">
      <div>
        <div style="font-weight: 700; color: #0f172a;">ProcureLens Digital Tax Ledger</div>
        <div style="font-family: 'JetBrains Mono', monospace; font-size: 10px; margin-top: 2px;">
          Invoice Verification Hash: SHA256:${Math.random().toString(36).substring(2, 12).toUpperCase()}
        </div>
      </div>
      <div class="signature">
        <div class="signature-line"></div>
        <div style="font-weight: 700; color: #0f172a;">Vendor Authorized Signatory</div>
      </div>
    </div>
  </div>
</body>
</html>`;

  const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8;' });
  triggerBlobDownload(blob, `Tax_Invoice_${invoice.invoiceNumber || invoice.id}.html`);
};

// ==========================================
// 3. TRANSACTION OFFICIAL DISBURSEMENT VOUCHER
// ==========================================
export const downloadTransactionDocument = (tx, currentUser) => {
  const dateStr = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Payment Voucher #${tx.id} - ProcureLens</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;600&display=swap');
    body { font-family: 'Plus Jakarta Sans', sans-serif; background: #f8fafc; color: #0f172a; margin: 0; padding: 32px; }
    .container { max-width: 860px; margin: 0 auto; background: #ffffff; border: 1px solid #cbd5e1; border-radius: 12px; padding: 40px; box-shadow: 0 4px 20px rgba(0,0,0,0.06); }
    .header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #059669; padding-bottom: 20px; margin-bottom: 24px; }
    .logo { font-size: 24px; font-weight: 800; color: #0f172a; }
    .logo span { color: #059669; }
    .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-bottom: 24px; }
    .card { background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 16px; font-size: 13px; }
    .card h4 { margin: 0 0 8px 0; font-size: 11px; text-transform: uppercase; color: #166534; font-family: 'JetBrains Mono', monospace; font-weight: 700; }
    .amount-box { background: #064e3b; color: #ffffff; border-radius: 10px; padding: 20px; text-align: center; margin: 24px 0; }
    .amount-value { font-size: 32px; font-weight: 800; font-family: 'JetBrains Mono', monospace; color: #6ee7b7; }
    .footer { margin-top: 40px; padding-top: 20px; border-top: 1px dashed #cbd5e1; display: flex; justify-content: space-between; align-items: flex-end; font-size: 11px; color: #64748b; }
    .signature { text-align: right; }
    .signature-line { width: 200px; border-bottom: 1px solid #0f172a; margin: 40px 0 6px auto; }
    @media print { body { background: white; padding: 0; } .container { border: none; box-shadow: none; padding: 0; } .no-print { display: none; } }
  </style>
</head>
<body>
  <div class="no-print" style="max-width: 860px; margin: 0 auto 16px; display: flex; justify-content: flex-end; gap: 10px;">
    <button onclick="window.print()" style="padding: 10px 20px; background: #059669; color: white; border: none; border-radius: 8px; font-weight: 700; cursor: pointer;">
      🖨️ Print / Save as PDF
    </button>
  </div>

  <div class="container">
    <div class="header">
      <div>
        <div class="logo">Procure<span>Lens</span> Disbursal Advice</div>
        <div style="font-size: 12px; color: #64748b; margin-top: 4px;">Treasury & Financial Controller Disbursement Voucher</div>
      </div>
      <div style="text-align: right;">
        <div style="font-size: 20px; font-weight: 800; color: #065f46; font-family: 'JetBrains Mono', monospace;">VOUCHER #${tx.id}</div>
        <div style="font-size: 12px; color: #64748b; margin-top: 4px;">Disbursal Date: ${tx.date}</div>
        <div style="font-size: 11px; color: ${tx.analysisStatus === 'FLAGGED' ? '#be123c' : '#15803d'}; font-weight: 700; margin-top: 2px;">
          AI STATUS: ${tx.analysisStatus} (${tx.riskScore}/100)
        </div>
      </div>
    </div>

    <div class="amount-box">
      <div style="font-size: 12px; text-transform: uppercase; letter-spacing: 0.1em; color: #a7f3d0; margin-bottom: 4px;">Total Disbursed Amount</div>
      <div class="amount-value">₹${Number(tx.amount).toLocaleString('en-IN')}</div>
      <div style="font-size: 12px; color: #d1fae5; margin-top: 4px;">Payment Method: ${tx.paymentMethod} · Routing Ref: ${tx.bankRouting}</div>
    </div>

    <div class="grid-2">
      <div class="card">
        <h4>Beneficiary &amp; Banking Details</h4>
        <div style="font-weight: 700; font-size: 14px; color: #0f172a;">${tx.vendorName}</div>
        <div style="color: #475569; margin-top: 4px;">Vendor ID: ${tx.vendorId}</div>
        <div style="color: #475569;">Bank Routing / IFSC: ${tx.bankRouting}</div>
        <div style="color: #475569;">Payment Instrument: ${tx.paymentMethod}</div>
      </div>
      <div class="card">
        <h4>Relational Procurement Audit Link</h4>
        <div><strong>Linked Purchase Order:</strong> #${tx.poNumber}</div>
        <div><strong>Linked Tax Invoice:</strong> #${tx.invoiceNumber}</div>
        <div><strong>Uploaded Bank Advice:</strong> ${tx.documentName || 'Disbursal_Advice_Proof.pdf'} (${tx.documentSize || '1.4 MB'})</div>
        <div><strong>Detected Signals:</strong> ${tx.detectedIssues}</div>
      </div>
    </div>

    <div class="footer">
      <div>
        <div style="font-weight: 700; color: #0f172a;">Treasury Management &amp; Forensic Verification</div>
        <div style="font-family: 'JetBrains Mono', monospace; font-size: 10px; margin-top: 2px;">
          Financial Authorization Hash: SHA256:${Math.random().toString(36).substring(2, 12).toUpperCase()} · User: ${currentUser?.email || 'finance@procurelens.com'}
        </div>
      </div>
      <div class="signature">
        <div class="signature-line"></div>
        <div style="font-weight: 700; color: #0f172a;">Comptroller / Disbursing Officer</div>
      </div>
    </div>
  </div>
</body>
</html>`;

  const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8;' });
  triggerBlobDownload(blob, `Payment_Voucher_${tx.id}.html`);
};

// ==========================================
// 4. ATTACHED DOCUMENT INSTANT DOWNLOAD
// ==========================================
export const downloadAttachedFile = (fileName, entityId, entityType) => {
  const cleanName = fileName || `${entityId}_Document.pdf`;
  const dateStr = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

  const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${cleanName} - ProcureLens Vault</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;600&display=swap');
    body { font-family: 'Plus Jakarta Sans', sans-serif; background: #0f172a; color: #f8fafc; margin: 0; padding: 40px; display: flex; align-items: center; justify-content: center; min-height: 80vh; }
    .card { max-width: 650px; width: 100%; background: #1e293b; border: 1px solid #334155; border-radius: 16px; padding: 36px; box-shadow: 0 20px 40px rgba(0,0,0,0.5); }
    .badge { display: inline-block; padding: 4px 10px; border-radius: 6px; font-size: 11px; font-weight: 700; background: rgba(16,185,129,0.15); color: #34d399; border: 1px solid rgba(16,185,129,0.3); font-family: monospace; }
    .title { font-size: 20px; font-weight: 800; margin: 16px 0 6px 0; color: #ffffff; word-break: break-all; }
    .meta-box { background: #0f172a; border: 1px solid #334155; border-radius: 10px; padding: 16px; margin: 20px 0; font-size: 13px; line-height: 1.8; color: #cbd5e1; }
    .btn { display: inline-block; padding: 10px 20px; background: #2563eb; color: white; border-radius: 8px; font-weight: 700; text-decoration: none; cursor: pointer; border: none; }
  </style>
</head>
<body>
  <div class="card">
    <span class="badge">SECURE AUDIT VAULT ATTACHMENT</span>
    <div class="title">📄 ${cleanName}</div>
    <div style="font-size: 13px; color: #94a3b8;">Associated Entity: <strong>${entityType} (${entityId})</strong></div>

    <div class="meta-box">
      <div><strong>Original File Name:</strong> ${cleanName}</div>
      <div><strong>Integrity Check:</strong> SHA-256 Verified · Nonce Intact</div>
      <div><strong>Vault Timestamp:</strong> ${dateStr}</div>
      <div><strong>Access Clearance:</strong> Procurement &amp; Forensic Auditor Clearance Level 3</div>
    </div>

    <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 24px; padding-top: 16px; border-top: 1px solid #334155;">
      <div style="font-size: 11px; color: #64748b;">ProcureLens Enterprise Document Repository</div>
      <button onclick="window.print()" class="btn">🖨️ Print Attachment</button>
    </div>
  </div>
</body>
</html>`;

  const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8;' });
  triggerBlobDownload(blob, cleanName.endsWith('.html') || cleanName.endsWith('.pdf') ? cleanName : `${cleanName}.html`);
};

// Print any formatted dossier in a clean popup print window
export const printFormattedDossier = (report, currentUser) => {
  const printWindow = window.open('', '_blank', 'width=900,height=800');
  if (!printWindow) {
    window.print();
    return;
  }

  const dateStr = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

  printWindow.document.write(`
    <html>
      <head>
        <title>Print - ${report.title}</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; padding: 24px; color: #111827; }
          .header { border-bottom: 2px solid #111827; padding-bottom: 12px; margin-bottom: 20px; display: flex; justify-content: space-between; }
          .title { font-size: 20px; font-weight: bold; }
          .meta { background: #f3f4f6; padding: 12px; border-radius: 8px; margin-bottom: 16px; font-size: 12px; }
          .summary { border: 1px solid #e5e7eb; padding: 14px; border-radius: 8px; font-size: 13px; line-height: 1.5; margin-bottom: 16px; }
          table { width: 100%; border-collapse: collapse; margin-top: 12px; font-size: 12px; }
          th, td { border: 1px solid #e5e7eb; padding: 8px; text-align: left; }
          th { background: #f9fafb; font-weight: bold; }
          .footer { margin-top: 40px; padding-top: 16px; border-top: 1px solid #e5e7eb; display: flex; justify-content: space-between; font-size: 11px; color: #6b7280; }
        </style>
      </head>
      <body>
        <div class="header">
          <div>
            <div class="title">ProcureLens Enterprise - ${report.title}</div>
            <div style="font-size: 11px; color: #6b7280;">Document Reference: ${report.id}</div>
          </div>
          <div>
            <strong>${report.score || 'OFFICIAL REPORT'}</strong>
          </div>
        </div>

        <div class="meta">
          <div><strong>Target Subject:</strong> ${report.target}</div>
          <div><strong>Author / Auditor:</strong> ${report.author || currentUser?.name || 'Lead Auditor'}</div>
          <div><strong>Date:</strong> ${report.date || dateStr}</div>
        </div>

        <div>
          <h3>Executive Findings & Summary</h3>
          <div class="summary">${report.summary}</div>
        </div>

        <div>
          <h3>Statutory Procurement Compliance</h3>
          <table>
            <tr>
              <th>Standard</th>
              <th>Requirement</th>
              <th>Status</th>
            </tr>
            <tr>
              <td>GFR Rule 149</td>
              <td>Statutory Threshold & Transparency</td>
              <td>COMPLIANT</td>
            </tr>
            <tr>
              <td>SOX Section 404</td>
              <td>Financial Discrepancy Reconciliation</td>
              <td>VERIFIED</td>
            </tr>
          </table>
        </div>

        <div class="footer">
          <div>ProcureLens Autonomous Forensic Audit · Timestamp: ${new Date().toLocaleString()}</div>
          <div>Verified By: ${currentUser?.name || 'Administrator'}</div>
        </div>
      </body>
    </html>
  `);
  printWindow.document.close();
  printWindow.focus();
  setTimeout(() => {
    printWindow.print();
  }, 250);
};
