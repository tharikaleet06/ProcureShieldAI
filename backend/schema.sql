-- =====================================================================
-- ProcureLens Enterprise Relational Schema (MySQL 8.0)
-- Real Relational Schema with Foreign Keys, Enums, Indexes, & Audit Logs
-- =====================================================================

CREATE DATABASE IF NOT EXISTS procurelens_procurement CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE procurelens_procurement;

-- 1. User & RBAC Accounts Table (Single Admin Policy)
CREATE TABLE IF NOT EXISTS user_accounts (
    id VARCHAR(36) PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    email VARCHAR(150) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL, -- ROLE_ADMIN, ROLE_FORENSIC_AUDITOR, ROLE_PROCUREMENT_OFFICER, ROLE_FINANCE_DIRECTOR, ROLE_VENDOR
    role_title VARCHAR(100) NOT NULL,
    department VARCHAR(100) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 2. Master Vendor Registry
CREATE TABLE IF NOT EXISTS vendors (
    id VARCHAR(50) PRIMARY KEY,
    vendor_name VARCHAR(255) NOT NULL,
    category VARCHAR(150) NOT NULL,
    risk_tier ENUM('CRITICAL', 'HIGH', 'ELEVATED', 'LOW', 'VERIFIED') NOT NULL DEFAULT 'LOW',
    incorporation_days INT NOT NULL,
    gstin VARCHAR(20) NOT NULL UNIQUE,
    registered_address TEXT NOT NULL,
    state VARCHAR(50) NOT NULL DEFAULT 'Maharashtra',
    gst_status ENUM('ACTIVE', 'SUSPENDED', 'CANCELLED', 'UNREGISTERED') NOT NULL DEFAULT 'ACTIVE',
    bank_routing VARCHAR(100) NOT NULL,
    bank_changed_recently BOOLEAN DEFAULT FALSE,
    historical_risk_score INT NOT NULL DEFAULT 15,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_vendor_gstin (gstin),
    INDEX idx_vendor_risk (risk_tier)
) ENGINE=InnoDB;

-- 3. Vendor Offers (Volume & Trade Discounts)
CREATE TABLE IF NOT EXISTS vendor_offers (
    id VARCHAR(50) PRIMARY KEY,
    vendor_id VARCHAR(50) NOT NULL,
    offer_type ENUM('PERCENTAGE', 'FIXED_AMOUNT') NOT NULL,
    offer_value DECIMAL(15, 2) NOT NULL,
    minimum_purchase DECIMAL(15, 2) DEFAULT 0.00,
    maximum_discount DECIMAL(15, 2) NULL,
    valid_from DATE NOT NULL,
    valid_to DATE NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (vendor_id) REFERENCES vendors(id) ON DELETE CASCADE,
    INDEX idx_offer_vendor (vendor_id)
) ENGINE=InnoDB;

-- 4. Vendor Coupons (Promo Codes)
CREATE TABLE IF NOT EXISTS vendor_coupons (
    id VARCHAR(50) PRIMARY KEY,
    vendor_id VARCHAR(50) NOT NULL,
    coupon_code VARCHAR(50) NOT NULL UNIQUE,
    discount_type ENUM('PERCENTAGE', 'FIXED_AMOUNT') NOT NULL,
    discount_value DECIMAL(15, 2) NOT NULL,
    minimum_order DECIMAL(15, 2) DEFAULT 0.00,
    maximum_discount DECIMAL(15, 2) NULL,
    valid_from DATE NOT NULL,
    valid_to DATE NOT NULL,
    usage_limit INT DEFAULT 100,
    used_count INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (vendor_id) REFERENCES vendors(id) ON DELETE CASCADE,
    INDEX idx_coupon_code (coupon_code)
) ENGINE=InnoDB;

-- 5. Procurement Requests (Comparison Containers)
CREATE TABLE IF NOT EXISTS procurement_requests (
    id VARCHAR(50) PRIMARY KEY,
    requirement_title VARCHAR(255) NOT NULL,
    category VARCHAR(150) NOT NULL,
    quantity DECIMAL(12, 2) NOT NULL,
    unit VARCHAR(30) NOT NULL,
    buyer_state VARCHAR(50) NOT NULL DEFAULT 'Maharashtra',
    gst_rate DECIMAL(5, 2) NOT NULL DEFAULT 18.00,
    target_unit_price DECIMAL(15, 2) NULL,
    status ENUM('DRAFT', 'QUOTES_RECEIVED', 'UNDER_AUDIT', 'APPROVED', 'REJECTED') DEFAULT 'QUOTES_RECEIVED',
    created_by VARCHAR(150) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 6. Procurement Quotations (Vendor Quotes with GST & Discounts)
CREATE TABLE IF NOT EXISTS procurement_quotes (
    id VARCHAR(50) PRIMARY KEY,
    procurement_id VARCHAR(50) NOT NULL,
    vendor_id VARCHAR(50) NOT NULL,
    quantity DECIMAL(12, 2) NOT NULL,
    unit_price DECIMAL(15, 2) NOT NULL,
    base_amount DECIMAL(15, 2) NOT NULL,
    offer_percent DECIMAL(5, 2) DEFAULT 0.00,
    offer_amount DECIMAL(15, 2) DEFAULT 0.00,
    coupon_code VARCHAR(50) NULL,
    coupon_amount DECIMAL(15, 2) DEFAULT 0.00,
    eligible_discount_amount DECIMAL(15, 2) NOT NULL DEFAULT 0.00,
    taxable_amount DECIMAL(15, 2) NOT NULL,
    gst_rate DECIMAL(5, 2) NOT NULL,
    tax_type ENUM('INTRA_STATE', 'INTER_STATE') NOT NULL,
    cgst_amount DECIMAL(15, 2) NOT NULL DEFAULT 0.00,
    sgst_amount DECIMAL(15, 2) NOT NULL DEFAULT 0.00,
    igst_amount DECIMAL(15, 2) NOT NULL DEFAULT 0.00,
    additional_charges DECIMAL(15, 2) NOT NULL DEFAULT 0.00,
    final_amount DECIMAL(15, 2) NOT NULL,
    declared_invoice_amount DECIMAL(15, 2) NULL,
    declared_taxable_amount DECIMAL(15, 2) NULL,
    declared_cgst DECIMAL(15, 2) NULL,
    declared_sgst DECIMAL(15, 2) NULL,
    declared_igst DECIMAL(15, 2) NULL,
    declared_discount DECIMAL(15, 2) NULL,
    risk_score INT NOT NULL DEFAULT 0,
    risk_level ENUM('LOW', 'MEDIUM', 'HIGH', 'CRITICAL') NOT NULL DEFAULT 'LOW',
    anomaly_flags JSON NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (procurement_id) REFERENCES procurement_requests(id) ON DELETE CASCADE,
    FOREIGN KEY (vendor_id) REFERENCES vendors(id) ON DELETE RESTRICT,
    INDEX idx_quote_proc (procurement_id),
    INDEX idx_quote_risk (risk_score)
) ENGINE=InnoDB;

-- 7. Purchase Orders Table
CREATE TABLE IF NOT EXISTS purchase_orders (
    id VARCHAR(50) PRIMARY KEY,
    po_number VARCHAR(50) NOT NULL UNIQUE,
    vendor_id VARCHAR(50) NOT NULL,
    item_code VARCHAR(50) NOT NULL,
    item_description VARCHAR(255) NOT NULL,
    quantity DECIMAL(12, 2) NOT NULL,
    unit VARCHAR(30) NOT NULL,
    unit_price DECIMAL(15, 2) NOT NULL,
    total_amount DECIMAL(15, 2) NOT NULL,
    approver_name VARCHAR(150) NOT NULL,
    approver_role VARCHAR(150) NOT NULL,
    department VARCHAR(150) NOT NULL,
    po_status ENUM('PENDING', 'APPROVED', 'HOLD', 'CANCELLED') DEFAULT 'PENDING',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (vendor_id) REFERENCES vendors(id) ON DELETE RESTRICT,
    INDEX idx_po_approver (approver_name),
    INDEX idx_po_vendor (vendor_id)
) ENGINE=InnoDB;

-- 8. Invoices Ledger (Core Auditable Transactions)
CREATE TABLE IF NOT EXISTS invoices (
    id VARCHAR(50) PRIMARY KEY,
    invoice_number VARCHAR(50) NOT NULL UNIQUE,
    po_number VARCHAR(50) NOT NULL,
    vendor_id VARCHAR(50) NOT NULL,
    item_code VARCHAR(50) NOT NULL,
    item_description VARCHAR(255) NOT NULL,
    quantity DECIMAL(12, 2) NOT NULL,
    unit VARCHAR(30) NOT NULL,
    unit_price DECIMAL(15, 2) NOT NULL,
    total_amount DECIMAL(15, 2) NOT NULL,
    historical_baseline_price DECIMAL(15, 2) NOT NULL,
    market_index_price DECIMAL(15, 2) NULL,
    price_variance_percent DECIMAL(8, 2) NOT NULL DEFAULT 0.00,
    department VARCHAR(150) NOT NULL,
    approver_name VARCHAR(150) NOT NULL,
    approver_role VARCHAR(150) NOT NULL,
    submission_date DATE NOT NULL,
    payment_due_date DATE NOT NULL,
    status ENUM('FLAGGED_CRITICAL', 'UNDER_INVESTIGATION', 'PAYMENT_FROZEN', 'APPROVED', 'REJECTED_AUDIT') NOT NULL,
    anomaly_type ENUM('PRICE_SPIKE', 'SPLIT_PO_STRUCTURING', 'DUPLICATE_INVOICE', 'SHELL_VENDOR_NETWORK', 'QUANTITY_GHOSTING', 'BENIGN_NORMAL') NOT NULL,
    risk_score INT NOT NULL,
    confidence_score INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (vendor_id) REFERENCES vendors(id) ON DELETE RESTRICT,
    INDEX idx_inv_status (status),
    INDEX idx_inv_risk (risk_score),
    INDEX idx_inv_anomaly (anomaly_type)
) ENGINE=InnoDB;

-- 9. Forensic Audit Flags & Evidentiary Triggers
CREATE TABLE IF NOT EXISTS invoice_audit_flags (
    id VARCHAR(50) PRIMARY KEY,
    invoice_id VARCHAR(50) NOT NULL,
    category ENUM('PRICE', 'VENDOR', 'DUPLICATE', 'STRUCTURING', 'DELIVERY', 'GST', 'COUPON', 'OFFER') NOT NULL,
    severity ENUM('CRITICAL', 'HIGH', 'MEDIUM', 'LOW') NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    metric VARCHAR(255) NOT NULL,
    statutory_ref VARCHAR(255) NULL,
    FOREIGN KEY (invoice_id) REFERENCES invoices(id) ON DELETE CASCADE,
    INDEX idx_flag_severity (severity)
) ENGINE=InnoDB;

-- 10. Three-Way Match: Goods Receipt Notes (GRN)
CREATE TABLE IF NOT EXISTS goods_receipt_notes (
    id VARCHAR(50) PRIMARY KEY,
    invoice_id VARCHAR(50) NOT NULL UNIQUE,
    dock_receipt_no VARCHAR(50) NOT NULL,
    billed_qty DECIMAL(12, 2) NOT NULL,
    dock_received_qty DECIMAL(12, 2) NOT NULL,
    discrepancy_units DECIMAL(12, 2) NOT NULL,
    inspector_name VARCHAR(150) NOT NULL,
    received_date DATE NOT NULL,
    FOREIGN KEY (invoice_id) REFERENCES invoices(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 11. Payment Disbursement Freezes (ERP Hard Stops)
CREATE TABLE IF NOT EXISTS disbursement_holds (
    id VARCHAR(50) PRIMARY KEY,
    invoice_id VARCHAR(50) NOT NULL,
    erp_system VARCHAR(50) DEFAULT 'SAP S/4HANA Finance',
    hold_status ENUM('ACTIVE_FREEZE', 'RELEASED_BY_CFO', 'RETURNED_TO_VENDOR') NOT NULL,
    placed_by_role VARCHAR(100) NOT NULL,
    placed_by_user VARCHAR(150) NOT NULL,
    reason TEXT NOT NULL,
    placed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (invoice_id) REFERENCES invoices(id) ON DELETE CASCADE,
    INDEX idx_hold_status (hold_status)
) ENGINE=InnoDB;

-- 12. Immutable Auditor Trail & Chain of Custody
CREATE TABLE IF NOT EXISTS audit_trail_events (
    id VARCHAR(50) PRIMARY KEY,
    invoice_id VARCHAR(50) NOT NULL,
    user_email VARCHAR(150) NOT NULL,
    user_role VARCHAR(50) NOT NULL,
    action_type VARCHAR(100) NOT NULL,
    payload_snapshot JSON NULL,
    ip_address VARCHAR(45) DEFAULT '127.0.0.1',
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (invoice_id) REFERENCES invoices(id) ON DELETE CASCADE
) ENGINE=InnoDB;
