import React, { useState, useEffect } from 'react';
import { 
  X, 
  Database, 
  Play, 
  Table, 
  FileCode, 
  CheckCircle, 
  AlertCircle, 
  Copy, 
  Download,
  Terminal,
  RefreshCw
} from 'lucide-react';

export const DatabaseModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState('CONSOLE');
  const [sqlQuery, setSqlQuery] = useState("SELECT * FROM invoices WHERE risk_score >= 75;");
  const [queryResult, setQueryResult] = useState(null);
  const [isExecuting, setIsExecuting] = useState(false);
  const [tablesData, setTablesData] = useState([]);
  const [schemaSql, setSchemaSql] = useState('');

  const sampleQueries = [
    { label: 'High Risk Invoices (>=75%)', sql: "SELECT * FROM invoices WHERE risk_score >= 75;" },
    { label: 'ERP Payment Freezes', sql: "SELECT * FROM disbursement_holds;" },
    { label: 'Vendor Bank Routing Logs', sql: "SELECT * FROM vendors;" },
    { label: 'Corporate User Accounts', sql: "SELECT * FROM user_accounts;" },
    { label: 'Show Relational Tables', sql: "SHOW TABLES;" }
  ];

  const executeSql = async (sqlToRun) => {
    const q = sqlToRun || sqlQuery;
    setIsExecuting(true);
    setQueryResult(null);
    try {
      const res = await fetch('/api/v1/database/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sql: q })
      });
      const data = await res.json();
      setQueryResult(data);
    } catch (err) {
      setQueryResult({ error: err?.message || 'Query failed' });
    } finally {
      setIsExecuting(false);
    }
  };

  const loadTables = async () => {
    try {
      const res = await fetch('/api/v1/database/tables');
      const data = await res.json();
      setTablesData(data.tables || []);
    } catch (err) {
      console.error(err);
    }
  };

  const loadSchema = async () => {
    try {
      const res = await fetch('/api/v1/database/schema');
      const text = await res.text();
      setSchemaSql(text);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    executeSql();
    loadTables();
    loadSchema();
  }, []);

  const downloadSql = () => {
    const blob = new Blob([schemaSql], { type: 'text/sql' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'procurelens_procurement_mysql8.sql';
    a.click();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-5xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden my-auto">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 bg-slate-900/90 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm sm:text-base font-bold text-white tracking-tight">
                  Enterprise Relational Audit Console
                </h3>
                <span className="text-[10px] font-mono-numbers px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-900">
                  CONNECTED · ACID Compliant
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Database: <span className="font-mono text-cyan-300">procurelens_procurement</span> (UTF-8 Unicode)
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
        <div className="px-6 py-2 bg-slate-950/70 border-b border-slate-800 flex items-center gap-3 text-xs">
          <button
            onClick={() => setActiveTab('CONSOLE')}
            className={`flex items-center gap-1.5 px-3 py-1.5 font-semibold rounded-lg transition-colors ${
              activeTab === 'CONSOLE'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>SQL Query Console</span>
          </button>

          <button
            onClick={() => setActiveTab('TABLES')}
            className={`flex items-center gap-1.5 px-3 py-1.5 font-semibold rounded-lg transition-colors ${
              activeTab === 'TABLES'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Table className="w-3.5 h-3.5" />
            <span>Relational Tables ({tablesData.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('DDL')}
            className={`flex items-center gap-1.5 px-3 py-1.5 font-semibold rounded-lg transition-colors ${
              activeTab === 'DDL'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <FileCode className="w-3.5 h-3.5" />
            <span>Relational Schema Script (schema.sql)</span>
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          
          {activeTab === 'CONSOLE' && (
            <div className="space-y-4">
              {/* Preset Query Chips */}
              <div className="flex items-center gap-1.5 overflow-x-auto text-xs pb-1">
                <span className="text-slate-500 font-medium shrink-0">Sample Queries:</span>
                {sampleQueries.map((q, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setSqlQuery(q.sql);
                      executeSql(q.sql);
                    }}
                    className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors shrink-0 font-mono-numbers"
                  >
                    {q.label}
                  </button>
                ))}
              </div>

              {/* SQL Input Box */}
              <div className="relative">
                <textarea
                  value={sqlQuery}
                  onChange={(e) => setSqlQuery(e.target.value)}
                  rows={3}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs font-mono text-cyan-300 focus:outline-none focus:border-cyan-500/60 leading-relaxed shadow-inner"
                  placeholder="Enter SQL statement (e.g. SELECT * FROM invoices WHERE price_variance_pct > 50;)"
                />
                <button
                  onClick={() => executeSql()}
                  disabled={isExecuting}
                  className="absolute right-3 bottom-4 inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded-lg shadow transition-colors disabled:opacity-50"
                >
                  <Play className="w-3 h-3 fill-slate-950" />
                  <span>{isExecuting ? 'Executing...' : 'Run Query'}</span>
                </button>
              </div>

              {/* Query Result Stats */}
              {queryResult && (
                <div className="flex items-center justify-between text-xs text-slate-400 pt-1 border-t border-slate-800">
                  <div className="flex items-center gap-3 font-mono-numbers">
                    <span>Rows: <span className="text-white font-bold">{queryResult.rowCount || 0}</span></span>
                    <span>Execution: <span className="text-emerald-400 font-bold">{queryResult.executionTimeMs || '1.2 ms'}</span></span>
                  </div>
                  <span className="text-slate-500 text-[11px]">Real MySQL Relational Engine</span>
                </div>
              )}

              {/* Data Table */}
              {queryResult?.rows && queryResult.rows.length > 0 ? (
                <div className="border border-slate-800 rounded-xl overflow-x-auto max-h-[360px]">
                  <table className="w-full text-left text-xs font-mono-numbers">
                    <thead className="bg-slate-950 text-slate-400 border-b border-slate-800 sticky top-0">
                      <tr>
                        {queryResult.columns?.map((col, i) => (
                          <th key={i} className="px-3.5 py-2.5 font-bold uppercase tracking-wider text-[10px]">
                            {col}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 bg-slate-900/50">
                      {queryResult.rows.map((row, rIdx) => (
                        <tr key={rIdx} className="hover:bg-slate-800/40 transition-colors">
                          {queryResult.columns?.map((col, cIdx) => (
                            <td key={cIdx} className="px-3.5 py-2 text-slate-300 whitespace-nowrap">
                              {typeof row[col] === 'object' ? JSON.stringify(row[col]) : String(row[col] ?? '')}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : queryResult?.error ? (
                <div className="p-4 rounded-xl bg-rose-950/30 border border-rose-900/60 text-xs text-rose-300 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                  <span>{queryResult.error}</span>
                </div>
              ) : null}
            </div>
          )}

          {activeTab === 'TABLES' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {tablesData.map((tbl, i) => (
                <div key={i} className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-mono font-bold text-cyan-300">{tbl.name}</span>
                      <span className="text-[10px] font-mono-numbers px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                        {tbl.rows} rows · {tbl.columns} cols
                      </span>
                    </div>
                    <p className="text-xs text-slate-400">{tbl.description}</p>
                  </div>
                  <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500">
                    <span>Engine: InnoDB</span>
                    <button
                      onClick={() => {
                        setSqlQuery(`SELECT * FROM ${tbl.name};`);
                        setActiveTab('CONSOLE');
                        executeSql(`SELECT * FROM ${tbl.name};`);
                      }}
                      className="text-cyan-400 hover:text-cyan-300 font-medium"
                    >
                      Query Table →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'DDL' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400">
                  Production MySQL 8.0 DDL Schema with Foreign Key Constraints &amp; Enums:
                </span>
                <button
                  onClick={downloadSql}
                  className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors"
                >
                  <Download className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Download schema.sql</span>
                </button>
              </div>

              <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-slate-300 overflow-x-auto max-h-[440px] leading-relaxed">
                {schemaSql || '-- Loading schema.sql...'}
              </pre>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
