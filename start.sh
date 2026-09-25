#!/usr/bin/env bash
set -e

echo "=========================================================================="
echo " 🔍  ProcureLens - Autonomous Procurement Fraud & Anomaly Forensic Suite"
echo "=========================================================================="
echo " ❖ Frontend: React + Tailwind CSS (JavaScript)"
echo " ❖ Backend: Java Spring Boot Microservices (backend/)"
echo " ❖ Database: MySQL 8.0 Relational Schema (procurelens_procurement)"
echo "=========================================================================="
echo " Launching ProcureLens Suite..."

cd "$(dirname "$0")/frontend"

if [ ! -d "node_modules" ]; then
    echo " Installing frontend dependencies..."
    npm install --legacy-peer-deps
fi

exec node server.js
