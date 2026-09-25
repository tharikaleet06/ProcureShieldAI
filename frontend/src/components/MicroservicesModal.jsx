import React, { useState, useEffect } from 'react';
import { 
  X, 
  Server, 
  Cpu, 
  Database, 
  ShieldCheck, 
  CheckCircle2, 
  Layers, 
  Activity, 
  FileCode, 
  Terminal,
  Code,
  Network,
  Binary,
  Sparkles,
  Search,
  FileText,
  Workflow
} from 'lucide-react';

export const MicroservicesModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState('AI_MODELS');

  const aiModels = [
    {
      num: 1,
      name: 'Numerical Anomaly Detection',
      model: 'Isolation Forest',
      role: 'Multi-Dimensional Numerical Outlier Scoring',
      desc: 'Detects unusual transaction amounts, unit prices, order quantities, and vendor spending spikes across 6-quarter distributions.'
    },
    {
      num: 2,
      name: 'Deep-Learning Anomaly Detection',
      model: 'Autoencoder',
      role: 'Latent Procurement Pattern Learning',
      desc: 'Compresses multi-variate feature vectors into a bottleneck representation and flags transactions exhibiting high Reconstruction Error (MSE).'
    },
    {
      num: 3,
      name: 'Semantic Understanding',
      model: 'BGE-small-en-v1.5',
      role: 'Dense Contextual Text Embedding',
      desc: 'Converts PO and invoice line-item text specifications into 384-dimensional dense semantic vectors to capture domain semantics.'
    },
    {
      num: 4,
      name: 'Semantic Similarity',
      model: 'Cosine Similarity',
      role: 'PO-Invoice Consistency & Duplicate Detection',
      desc: 'Measures angle-distance between item description vectors to identify duplicate-like invoices (e.g. 96% match) and product substitution mismatches.'
    },
    {
      num: 5,
      name: 'Relationship Analysis',
      model: 'NetworkX Graph Analysis',
      role: 'Entity Graph & Shell Network Detection',
      desc: 'Constructs heterogeneous graphs (Vendor -> PO -> Invoice -> Approver -> Bank Account) to detect circular paths and approver collusion density.'
    },
    {
      num: 6,
      name: 'Deterministic Validation',
      model: 'Rule-Based Checks',
      role: 'Statutory & Exact Invariant Checks',
      desc: 'Enforces deterministic validations that do not depend on ML: 3-way match shortfall, duplicate invoice IDs, and PO structuring under ?2,00,000 threshold.'
    },
    {
      num: 7,
      name: 'Risk Calculation',
      model: 'Weighted Risk Scoring',
      role: 'Composite Signal Synthesis',
      desc: 'Combines isolation tree scores, reconstruction loss, semantic duplicate scores, graph risk, and deterministic violations into an overall 0-100% score.'
    },
    {
      num: 8,
      name: 'Evidence Retrieval',
      model: 'RAG + Vector Search',
      role: 'Corroborating Document Retrieval',
      desc: 'Retrieves relevant PO contracts, dock receipt notes (GRN), vendor incorporation history, and statutory policy compendiums related to the flagged case.'
    },
    {
      num: 9,
      name: 'Explanation / Report Generation',
      model: 'Instruction-Tuned LLM',
      role: 'Forensic Report & Dossier Synthesis',
      desc: 'Transforms verified ML signals and retrieved RAG evidence into a clear, statutory \'Why is this suspicious?\' investigation report.'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-5xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden my-auto">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 bg-slate-900/90 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm sm:text-base font-bold text-white tracking-tight">
                  ProcureLens AI Models &amp; Architectural Pipeline
                </h3>
                <span className="text-[10px] font-mono-numbers px-2 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-900">
                  9-COMPONENT STACK
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Empirical ML Anomaly Detection + NetworkX Graph + RAG Vector Evidence + LLM Explanation
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-md transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="px-6 py-2 bg-slate-950/70 border-b border-slate-800 flex items-center gap-3 text-xs overflow-x-auto">
          <button
            onClick={() => setActiveTab('AI_MODELS')}
            className={`flex items-center gap-1.5 px-3 py-1.5 font-semibold rounded-lg transition-colors shrink-0 ${
              activeTab === 'AI_MODELS'
                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>AI Models &amp; Algorithms</span>
          </button>

          <button
            onClick={() => setActiveTab('ARCHITECTURE_FLOW')}
            className={`flex items-center gap-1.5 px-3 py-1.5 font-semibold rounded-lg transition-colors shrink-0 ${
              activeTab === 'ARCHITECTURE_FLOW'
                ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Workflow className="w-3.5 h-3.5" />
            <span>End-to-End Pipeline Architecture</span>
          </button>

          <button
            onClick={() => setActiveTab('PYTHON_SOURCE')}
            className={`flex items-center gap-1.5 px-3 py-1.5 font-semibold rounded-lg transition-colors shrink-0 ${
              activeTab === 'PYTHON_SOURCE'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>Python AI Kernel Source (forensic_engine.py)</span>
          </button>

          <button
            onClick={() => setActiveTab('SWAGGER_DOCS')}
            className={`flex items-center gap-1.5 px-3 py-1.5 font-semibold rounded-lg transition-colors shrink-0 ${
              activeTab === 'SWAGGER_DOCS'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <FileCode className="w-3.5 h-3.5" />
            <span>Swagger / OpenAPI 3.0 Gateway</span>
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          
          {/* TAB 1: AI MODELS & ALGORITHMS TABLE */}
          {activeTab === 'AI_MODELS' && (
            <div className="space-y-6">
              
              {/* Important Technical Distinction Banner */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-2">
                <span className="font-bold text-slate-200 uppercase tracking-wider block text-[11px] text-rose-400">
                  Critical Technical Design Principles:
                </span>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-slate-300">
                  <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                    <span className="font-bold text-white block mb-1">1. Evidence-Grounded Explanation</span>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      <strong className="text-emerald-400">"The ML models detect anomalies; the LLM explains the detected evidence."</strong> Prevents hallucinated decisions by ensuring the LLM acts purely as an interpreter of verified model outputs.
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                    <span className="font-bold text-white block mb-1">2. Evidence Retrieval Purpose</span>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      <strong className="text-cyan-400">"RAG retrieves relevant procurement evidence to support AI-generated investigation explanations."</strong> Vector search extracts corroborating PO contracts, GRNs, and statutes.
                    </p>
                  </div>
                </div>
              </div>

              {/* Models List */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {aiModels.map((item) => (
                  <div 
                    key={item.num}
                    className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col justify-between hover:border-slate-700 transition-colors"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-mono-numbers px-2 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-800">
                          #{item.num} {item.name}
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-rose-300 tracking-tight font-mono-numbers">
                        {item.model}
                      </h4>
                      <span className="text-[11px] font-semibold text-slate-300 block mt-1">
                        {item.role}
                      </span>
                      <p className="text-[11px] text-slate-400 mt-2 leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          )}

          {/* TAB 2: PIPELINE ARCHITECTURE FLOW */}
          {activeTab === 'ARCHITECTURE_FLOW' && (
            <div className="space-y-6">
              
              <div className="p-6 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-slate-300 overflow-x-auto leading-relaxed shadow-inner">
                <pre className="text-center font-bold text-rose-300 mb-2">
{`                          PROCUREMENT DATA (Invoices, POs, GRN, KYC)
                                        ?
                                        ?
                                 PREPROCESSING
                                        ?
                 ???????????????????????????????????????????????
                 ?                      ?                      ?
        Isolation Forest           Autoencoder          BGE Embeddings
       (Numerical Outliers)     (Latent Patterns)    (Contextual Vectors)
                 ?                      ?                      ?
                 ?                      ?              Cosine Similarity
                 ?                      ?             (Duplicates/Match)
                 ?                      ?                      ?
                 ???????????????????????????????????????????????
                                        ?
                               Rule-Based Validation
                            (3-Way Match, Structuring)
                                        ?
                                        ?
                                 Graph Analysis
                                   (NetworkX)
                                        ?
                                        ?
                              Risk Scoring Engine
                                (Weighted Risk)
                                        ?
                                        ?
                                  FLAGGED CASE
                                        ?
                                        ?
                               RAG / Vector Search
                                        ?
                 ???????????????????????????????????????????????
                 ?                      ?                      ?
           PO Contracts            Vouchers / GRN        Vendor KYC / MCA
                 ?                      ?                      ?
                 ???????????????????????????????????????????????
                                        ?
                                        ?
                            Instruction-Tuned LLM
                                        ?
                                        ?
                            "WHY IS THIS SUSPICIOUS?"
                                        ?
                                        ?
                           FORENSIC INVESTIGATION REPORT`}
                </pre>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <h4 className="font-bold text-white flex items-center gap-2">
                    <Activity className="w-4 h-4 text-rose-400" />
                    Detection Phase (Models &amp; Graphs)
                  </h4>
                  <p className="text-slate-400 leading-relaxed">
                    Isolation Forest and Autoencoder compute outlier scores on pricing and feature matrices. BGE-small-en-v1.5 and Cosine Similarity detect near-duplicate billing. NetworkX analyzes graph centrality to flag shell networks.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <h4 className="font-bold text-white flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-purple-400" />
                    Reasoning Phase (RAG &amp; LLM)
                  </h4>
                  <p className="text-slate-400 leading-relaxed">
                    RAG extracts the actual contracts, historical baselines, and statutory rules. The instruction-tuned LLM synthesizes this verified evidence into an explainable, court-ready dossier without hallucinating.
                  </p>
                </div>
              </div>

            </div>
          )}

          {/* TAB 3: PYTHON KERNEL CODE */}
          {activeTab === 'PYTHON_SOURCE' && (
            <div className="space-y-4">
              <span className="text-xs text-slate-400">
                ProcureLens Multi-Model Forensic Pipeline (<span className="font-mono text-emerald-300">ai_modules/forensic_engine.py</span>):
              </span>
              <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-slate-300 overflow-x-auto max-h-[460px] leading-relaxed">
{`# 1. Numerical Anomaly: Isolation Forest Detector
class IsolationForestDetector:
    def analyze(self, unit_price, historical_prices, total_amount, quantity):
        # Computes path length isolation s = 2^(-E(h)/c(n))
        # Flags z-score, price multiplier, and price variance % outliers

# 2. Deep-Learning Anomaly: Procurement Autoencoder
class ProcurementAutoencoder:
    def analyze(self, unit_price, baseline_price, total_amount, incorporation_days, bank_changed, po_proximity):
        # Computes Mean Squared Error (MSE) reconstruction loss across latent bottleneck

# 3. & 4. Semantic Understanding: BGE-small-en-v1.5 + Cosine Similarity
class SemanticEmbeddingEngine:
    def analyze_semantic_consistency(self, invoice_desc, po_desc, related_invoices):
        # Generates 384-dimensional dense semantic vectors
        # Computes (u . v) / (||u|| * ||v||) for PO consistency & near-duplicate fingerprinting

# 5. Relationship Analysis: NetworkX Procurement Graph
class NetworkXProcurementGraph:
    def analyze_relationships(self, vendor_id, vendor_name, po_number, invoice_id, approver_name, department, bank_changed, risk_tier):
        # Evaluates degree centrality, betweenness, and shell vendor circular paths

# 6. Deterministic Validation: Rule-Based Checks
class DeterministicRuleChecker:
    def evaluate(self, total_amount, po_number, grn_billed_qty, grn_received_qty, bank_changed, incorporation_days):
        # Validates 3-way match, tender threshold structuring (SOX-404 / GFR Rule 149)

# 7. Risk Calculation: Weighted Risk Scoring Engine
class WeightedRiskScorer:
    def calculate(self, iforest_res, autoenc_res, semantic_res, graph_res, rules_res):
        # Combines weights: Total = W_iso*S_iso + W_auto*S_auto + W_sem*S_sem + W_graph*S_graph + W_rules*S_rules

# 8. Evidence Retrieval: RAG + Vector Search
class RAGEvidenceRetriever:
    def retrieve_case_evidence(self, tx_data, semantic_res, rules_res):
        # Retrieves PO contracts, GRNs, MCA profiles, and GFR/SOX compliance policies

# 9. Explanation Generation: Instruction-Tuned LLM
class LLMInvestigationReporter:
    def synthesize_explanation(self, tx_data, risk_summary, rag_evidence, iforest_res):
        # Synthesizes "Why is this suspicious?" report grounded in verified evidence`}
              </pre>
            </div>
          )}

          {/* TAB 4: SWAGGER / OPENAPI 3.0 GATEWAY */}
          {activeTab === 'SWAGGER_DOCS' && (
            <div className="space-y-6">
              
              {/* Swagger Gateway Banner */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
                      Springdoc OpenAPI 3.0 / Swagger UI
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
                      v1.0.0
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    Interactive API explorer with JWT Bearer authentication, schema models, and test execution.
                  </p>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  <a
                    href="/swagger-ui.html"
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold transition-all shadow-md"
                  >
                    <span>Launch Swagger UI</span>
                    <span className="text-xs">↗</span>
                  </a>
                  <a
                    href="/v3/api-docs"
                    download="procurelens-openapi.json"
                    className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition-colors shadow-sm"
                  >
                    <span>Download OpenAPI (JSON)</span>
                    <span className="text-xs">↓</span>
                  </a>
                  <a
                    href="/api/v3/api-docs"
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-colors border border-slate-700"
                  >
                    <span>Raw JSON View</span>
                  </a>
                </div>
              </div>

              {/* Endpoints Inventory */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Documented Gateway Endpoints &amp; Microservices
                </h4>

                <div className="space-y-2 text-xs">
                  
                  {/* Auth */}
                  <div className="p-3 rounded-lg bg-slate-950 border border-slate-800/80 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="px-2 py-0.5 rounded font-mono font-bold text-[10px] bg-emerald-950 text-emerald-400 border border-emerald-800">POST</span>
                      <code className="font-mono text-slate-200 font-semibold">/api/v1/auth/login</code>
                      <span className="text-slate-400 text-[11px] hidden sm:inline">Authenticate user credentials &amp; issue signed JWT token</span>
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono">Public</span>
                  </div>

                  {/* Fraud Detection Investigate */}
                  <div className="p-3 rounded-lg bg-slate-950 border border-slate-800/80 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="px-2 py-0.5 rounded font-mono font-bold text-[10px] bg-emerald-950 text-emerald-400 border border-emerald-800">POST</span>
                      <code className="font-mono text-slate-200 font-semibold">/api/v1/fraud-detection/investigate</code>
                      <span className="text-slate-400 text-[11px] hidden sm:inline">Execute 9-stage Python AI forensic pipeline on invoice payload</span>
                    </div>
                    <span className="text-[10px] text-rose-400 font-mono font-semibold">Auditor / CFO</span>
                  </div>

                  {/* Freeze */}
                  <div className="p-3 rounded-lg bg-slate-950 border border-slate-800/80 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="px-2 py-0.5 rounded font-mono font-bold text-[10px] bg-emerald-950 text-emerald-400 border border-emerald-800">POST</span>
                      <code className="font-mono text-slate-200 font-semibold">/api/v1/fraud-detection/freeze/{'{id}'}</code>
                      <span className="text-slate-400 text-[11px] hidden sm:inline">Enforce ERP SAP/Oracle batch payment disbursement freeze</span>
                    </div>
                    <span className="text-[10px] text-rose-400 font-mono font-semibold">Auditor / CFO</span>
                  </div>

                  {/* Calculate Quote */}
                  <div className="p-3 rounded-lg bg-slate-950 border border-slate-800/80 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="px-2 py-0.5 rounded font-mono font-bold text-[10px] bg-emerald-950 text-emerald-400 border border-emerald-800">POST</span>
                      <code className="font-mono text-slate-200 font-semibold">/api/v1/procurements/calculate-quote</code>
                      <span className="text-slate-400 text-[11px] hidden sm:inline">Calculate single vendor quote with GST tax split &amp; discounts</span>
                    </div>
                    <span className="text-[10px] text-cyan-400 font-mono font-semibold">JWT Bearer</span>
                  </div>

                  {/* Compare Quotes */}
                  <div className="p-3 rounded-lg bg-slate-950 border border-slate-800/80 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="px-2 py-0.5 rounded font-mono font-bold text-[10px] bg-emerald-950 text-emerald-400 border border-emerald-800">POST</span>
                      <code className="font-mono text-slate-200 font-semibold">/api/v1/procurements/compare</code>
                      <span className="text-slate-400 text-[11px] hidden sm:inline">Multi-vendor quote comparison matrix with anomaly detection</span>
                    </div>
                    <span className="text-[10px] text-cyan-400 font-mono font-semibold">JWT Bearer</span>
                  </div>

                  {/* Vendor Offers */}
                  <div className="p-3 rounded-lg bg-slate-950 border border-slate-800/80 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="px-2 py-0.5 rounded font-mono font-bold text-[10px] bg-sky-950 text-sky-400 border border-sky-800">GET</span>
                      <code className="font-mono text-slate-200 font-semibold">/api/v1/procurements/vendors/{'{vendorId}'}/offers</code>
                      <span className="text-slate-400 text-[11px] hidden sm:inline">Fetch active trade and volume discount offers for vendor</span>
                    </div>
                    <span className="text-[10px] text-cyan-400 font-mono font-semibold">JWT Bearer</span>
                  </div>

                  {/* Vendor Coupons */}
                  <div className="p-3 rounded-lg bg-slate-950 border border-slate-800/80 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="px-2 py-0.5 rounded font-mono font-bold text-[10px] bg-sky-950 text-sky-400 border border-sky-800">GET</span>
                      <code className="font-mono text-slate-200 font-semibold">/api/v1/procurements/vendors/{'{vendorId}'}/coupons</code>
                      <span className="text-slate-400 text-[11px] hidden sm:inline">Fetch active promotional coupon codes for vendor</span>
                    </div>
                    <span className="text-[10px] text-cyan-400 font-mono font-semibold">JWT Bearer</span>
                  </div>

                </div>
              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
};
