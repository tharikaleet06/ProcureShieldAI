# ProcureLens - Autonomous Procurement Fraud & Anomaly Forensic Suite

Enterprise Forensic Investigation Platform for Procurement Fraud & Anomaly Detection.

## Features & Access Control
- **ProcureLens Autonomous Forensic Engine**: Pre-payment anomaly detection (3.7× price spikes, duplicate invoices, split PO structuring, shell vendors).
- **Single Administrator Access Governance**: Strictly controlled user provisioning by the root System Administrator. Public sign-up is disabled.
- **Enterprise RBAC Portals**: Role-guarded workbenches for Administrators, Forensic Auditors, Procurement Specialists, Finance Directors (CFOs), and Suppliers.

## Directory Layout
- `frontend/` - React 19 + Vite Single Page Application & Enterprise Forensic Workbench
- `backend/` - Multi-module Spring Boot Microservices Suite:
  - `backend/auth-service/` - Enterprise User Authentication, RBAC Role Provisioning, and Stateless JWT Security Service (Port 8081)
  - `backend/fraud-detection-service/` - Empirical Multi-Model Anomaly Scoring, Z-Score Outlier Detection, and ERP Payment Holds (Port 8082)
  - `backend/procurement-comparison-service/` - Multi-Vendor Quotation Scoring, Tiered Trade Discounts, and CGST/SGST/IGST Tax Engine (Port 8083)
  - `backend/pom.xml` - Master Maven Multi-Module Aggregator POM
  - `backend/schema.sql` - MySQL 8.0 Relational DDL Schema
  - `backend/openapi.json` - Master OpenAPI 3.0 Specification
- `ai_modules/` - Python 3 AI empirical forensic anomaly engine (`forensic_engine.py`)

## Running the App
Run either of the following commands from the root directory:

```bash
npm start
```
or
```bash
./start.sh
```

The application server will start natively on **http://localhost:3000**.
