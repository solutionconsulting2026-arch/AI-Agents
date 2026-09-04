import React from 'react';
import { 
  FileText, 
  Layers, 
  ShieldCheck, 
  AlertTriangle, 
  Activity, 
  Sparkles, 
  TrendingUp, 
  Clock, 
  ArrowRight, 
  CheckCircle,
  Database,
  Cpu,
  Lock
} from '../icons/Icons';
import { 
  ProposalInfo, 
  BorrowerDocument, 
  ExtractedField, 
  ReconciliationCheck, 
  ExceptionItem 
} from '../../types';
import { NavigationTab } from '../../state/appState';

interface DashboardOverviewProps {
  proposal: ProposalInfo;
  documents: BorrowerDocument[];
  fields: ExtractedField[];
  reconciliations: ReconciliationCheck[];
  exceptions: ExceptionItem[];
  spreadVersion: string;
  isApproved: boolean;
  isPublished: boolean;
  setActiveTab: (tab: NavigationTab) => void;
  onSimulateUpload: () => void;
  onOpenExceptions: () => void;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  proposal,
  documents,
  fields,
  reconciliations,
  exceptions,
  spreadVersion,
  isApproved,
  isPublished,
  setActiveTab,
  onSimulateUpload,
  onOpenExceptions
}) => {
  const pendingExceptions = exceptions.filter(e => e.status === 'PENDING_REVIEW' || e.status === 'IN_REVIEW');
  const failedReconciliations = reconciliations.filter(r => r.status === 'FAIL');
  const warningReconciliations = reconciliations.filter(r => r.status === 'WARNING');
  const avgConfidence = Math.round(fields.reduce((acc, f) => acc + f.confidence, 0) / (fields.length || 1));

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Welcome & System Summary Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 rounded-2xl p-6 text-white shadow-md relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-500/20 via-transparent to-transparent pointer-events-none"></div>

        <div className="relative z-10 flex flex-wrap items-center justify-between gap-6">
          <div className="space-y-1.5 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 bg-blue-500/20 text-blue-300 text-xs font-semibold rounded-full border border-blue-400/30">
                Flow 01 · Borrower Financial Document Extraction
              </span>
              <span className="text-xs text-slate-400">Target SLA &lt; 15 min</span>
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-white">
              Borrower Financial Extraction & Normalization Agent
            </h2>
            <p className="text-xs text-slate-300 leading-relaxed">
              Automated ingestion, OCR table extraction, chart of accounts mapping, deterministic ratio derivation, and tie-out integrity checks for <strong className="text-white">{proposal.borrowerName}</strong>.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {pendingExceptions.length > 0 ? (
              <button
                onClick={onOpenExceptions}
                className="px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold rounded-xl shadow-lg flex items-center gap-2 transition-transform active:scale-95"
              >
                <AlertTriangle className="w-4 h-4 text-slate-950" />
                <span>Review {pendingExceptions.length} Pending Exceptions</span>
              </button>
            ) : isApproved ? (
              <button
                onClick={() => setActiveTab('publish')}
                className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-lg flex items-center gap-2"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Spread Approved · View Downstream Hand-off</span>
              </button>
            ) : (
              <button
                onClick={() => setActiveTab('approval')}
                className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-lg flex items-center gap-2"
              >
                <Lock className="w-4 h-4" />
                <span>Review & Sign Off Spread</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 8 Primary Key Metrics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
        {/* Card 1: Total Docs */}
        <div 
          onClick={() => setActiveTab('documents')}
          className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm hover:border-blue-400 cursor-pointer transition-all hover:shadow"
        >
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[10px] uppercase font-bold tracking-wider">Total Docs</span>
            <FileText className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-xl font-bold text-slate-900">{documents.length}</div>
          <div className="text-[10px] text-slate-500 mt-1 truncate">All files staged in S3</div>
        </div>

        {/* Card 2: Processed */}
        <div 
          onClick={() => setActiveTab('documents')}
          className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm hover:border-emerald-400 cursor-pointer transition-all hover:shadow"
        >
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[10px] uppercase font-bold tracking-wider">Processed</span>
            <CheckCircle className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-xl font-bold text-emerald-700">
            {documents.filter(d => d.status === 'Processed' || d.status === 'Approved').length}
          </div>
          <div className="text-[10px] text-emerald-600 mt-1 truncate">OCR & Layout match</div>
        </div>

        {/* Card 3: Pending/HITL */}
        <div 
          onClick={() => setActiveTab('exceptions')}
          className={`p-3.5 rounded-xl border shadow-sm cursor-pointer transition-all hover:shadow ${
            pendingExceptions.length > 0 
              ? 'bg-rose-50 border-rose-200 hover:border-rose-300' 
              : 'bg-white border-slate-200 hover:border-blue-400'
          }`}
        >
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[10px] uppercase font-bold tracking-wider">Exceptions</span>
            <AlertTriangle className={`w-4 h-4 ${pendingExceptions.length > 0 ? 'text-rose-600' : 'text-slate-400'}`} />
          </div>
          <div className={`text-xl font-bold ${pendingExceptions.length > 0 ? 'text-rose-700' : 'text-slate-900'}`}>
            {pendingExceptions.length}
          </div>
          <div className={`text-[10px] mt-1 truncate ${pendingExceptions.length > 0 ? 'text-rose-600 font-semibold' : 'text-slate-500'}`}>
            {pendingExceptions.length > 0 ? 'Action required' : 'All cleared'}
          </div>
        </div>

        {/* Card 4: Fields Extracted */}
        <div 
          onClick={() => setActiveTab('extracted-fields')}
          className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm hover:border-indigo-400 cursor-pointer transition-all hover:shadow"
        >
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[10px] uppercase font-bold tracking-wider">Fields</span>
            <Layers className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="text-xl font-bold text-indigo-700">186</div>
          <div className="text-[10px] text-slate-500 mt-1 truncate">3 Years financial line items</div>
        </div>

        {/* Card 5: Average Confidence */}
        <div 
          onClick={() => setActiveTab('confidence')}
          className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm hover:border-blue-400 cursor-pointer transition-all hover:shadow"
        >
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[10px] uppercase font-bold tracking-wider">Avg Conf</span>
            <TrendingUp className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-xl font-bold text-slate-900">{avgConfidence}%</div>
          <div className="text-[10px] text-emerald-600 font-medium mt-1 truncate">≥95% Auto-verified</div>
        </div>

        {/* Card 6: Normalization */}
        <div 
          onClick={() => setActiveTab('normalization')}
          className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm hover:border-blue-400 cursor-pointer transition-all hover:shadow"
        >
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[10px] uppercase font-bold tracking-wider">Norm / CoA</span>
            <Database className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-xl font-bold text-slate-900">100%</div>
          <div className="text-[10px] text-slate-500 mt-1 truncate">Mapped to ₹ Lakhs</div>
        </div>

        {/* Card 7: Reconciliation */}
        <div 
          onClick={() => setActiveTab('reconciliation')}
          className={`p-3.5 rounded-xl border shadow-sm cursor-pointer transition-all hover:shadow ${
            failedReconciliations.length > 0 
              ? 'bg-rose-50 border-rose-200' 
              : warningReconciliations.length > 0 
                ? 'bg-amber-50 border-amber-200' 
                : 'bg-emerald-50 border-emerald-200'
          }`}
        >
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[10px] uppercase font-bold tracking-wider">Reconcile</span>
            <ShieldCheck className={`w-4 h-4 ${failedReconciliations.length > 0 ? 'text-rose-600' : 'text-emerald-600'}`} />
          </div>
          <div className={`text-base font-bold truncate ${
            failedReconciliations.length > 0 ? 'text-rose-700' : warningReconciliations.length > 0 ? 'text-amber-700' : 'text-emerald-700'
          }`}>
            {failedReconciliations.length > 0 ? '1 Failed' : 'Passed'}
          </div>
          <div className="text-[10px] text-slate-600 mt-1 truncate">Bank vs P&L Tie-out</div>
        </div>

        {/* Card 8: Spread Status */}
        <div 
          onClick={() => setActiveTab('approval')}
          className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm hover:border-blue-400 cursor-pointer transition-all hover:shadow"
        >
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[10px] uppercase font-bold tracking-wider">Spread</span>
            <Lock className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-xs font-bold text-slate-800 truncate mt-1">
            {isPublished ? 'Published' : isApproved ? 'Approved v1.0' : 'Pending Sign-Off'}
          </div>
          <div className="text-[10px] text-blue-600 font-medium mt-1 truncate">Locked versioning</div>
        </div>
      </div>

      {/* Main Split: Left Document Intake & Quick Actions | Right AI Agent Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Staged Documents List & Quick Launch */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <FileText className="w-4 h-4 text-blue-600" />
                  Borrower Financial Document Pack (8 Files)
                </h3>
                <p className="text-xs text-slate-500">
                  Audited financial statements, GST filings, and bank statements submitted for Proposal PR-10045.
                </p>
              </div>

              <button
                onClick={onSimulateUpload}
                className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-semibold rounded-lg border border-blue-200 transition-colors flex items-center gap-1.5"
              >
                <span>+ Upload Demo File</span>
              </button>
            </div>

            <div className="divide-y divide-slate-100 max-h-96 overflow-y-auto">
              {documents.map(doc => (
                <div 
                  key={doc.id}
                  onClick={() => {
                    setActiveTab('viewer');
                  }}
                  className="py-2.5 flex items-center justify-between gap-4 hover:bg-slate-50 px-2 rounded-lg cursor-pointer transition-colors group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs flex-shrink-0">
                      PDF
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-slate-800 group-hover:text-blue-600 truncate transition-colors">
                        {doc.name}
                      </div>
                      <div className="text-[11px] text-slate-400 flex items-center gap-2 mt-0.5">
                        <span>{doc.subtype}</span>
                        <span>·</span>
                        <span>{doc.financialYear}</span>
                        <span>·</span>
                        <span>{doc.pageCount} Pages</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 flex-shrink-0">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      doc.status === 'Processed' || doc.status === 'Approved'
                        ? 'bg-emerald-100 text-emerald-800'
                        : doc.status === 'Warning'
                          ? 'bg-amber-100 text-amber-800'
                          : doc.status === 'Exception'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-blue-100 text-blue-800'
                    }`}>
                      {doc.status}
                    </span>

                    <span className="text-xs font-mono font-semibold text-slate-600">
                      {doc.confidence}%
                    </span>

                    <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-blue-600 transition-colors" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right 1 Col: Agent Core Architecture & Boundaries Breakdown */}
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <Cpu className="w-4 h-4 text-indigo-600" />
              Engine Architecture Separation
            </h3>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-indigo-50/60 border border-indigo-100 rounded-lg">
                <div className="font-bold text-indigo-900 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                  AI Agent (Textract + Claude Vision)
                </div>
                <p className="text-[11px] text-indigo-800 mt-1">
                  Document classification, table extraction, 2D bounding boxes, semantic mapping to Bank Standard CoA, and vision fallback.
                </p>
              </div>

              <div className="p-3 bg-emerald-50/60 border border-emerald-100 rounded-lg">
                <div className="font-bold text-emerald-900 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  Deterministic Rule Engine
                </div>
                <p className="text-[11px] text-emerald-800 mt-1">
                  Unit conversions (Cr $\to$ Lakhs), balance sheet balancing, bank credit variance calculations, and ratio computations (Current Ratio, DSCR, TOL/TNW).
                </p>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                <div className="font-bold text-slate-800 flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-slate-600" />
                  CRM & Workflow Layer
                </div>
                <p className="text-[11px] text-slate-600 mt-1">
                  HITL exception routing, analyst correction workbench, dual-factor spread sign-off, and 10-year WORM audit sealing.
                </p>
              </div>
            </div>

            <button
              onClick={() => setActiveTab('how-it-works')}
              className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
            >
              <span>Explore Interactive Architecture Diagram</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
