import React, { useState } from 'react';
import { 
  Sparkles, 
  ShieldCheck, 
  Activity, 
  Cpu, 
  Database, 
  Layers, 
  Lock, 
  CreditCard, 
  CheckCircle,
  FileText,
  AlertTriangle,
  ArrowRight,
  Info
} from '../icons/Icons';

interface WorkflowNode {
  id: string;
  title: string;
  category: 'AI Engine' | 'Deterministic Rule' | 'CRM Workflow' | 'Hybrid';
  summary: string;
  inputs: string[];
  processing: string;
  outputs: string[];
  rules: string[];
  exceptionConditions: string[];
}

export const HowAgentWorksView: React.FC = () => {
  const [selectedNodeId, setSelectedNodeId] = useState<string>('node-extract');

  const nodes: WorkflowNode[] = [
    {
      id: 'node-intake',
      title: '1. DMS / S3 Document Intake',
      category: 'CRM Workflow',
      summary: 'Automatic ingestion of borrower financial document pack from DMS / S3 landing bucket.',
      inputs: ['Borrower financial pack (PDF/TIFF/Scans)', 'Proposal ID', 'Borrower CIF from LOS'],
      processing: 'Captures document manifest, computes SHA-256 integrity hash, opens 10-year WORM audit record.',
      outputs: ['Staged document execution manifest', 'Execution instance ID'],
      rules: ['Audit log opened with WORM compliance', 'Target SLA timer initialized'],
      exceptionConditions: ['Unreadable file headers', 'Corrupt archive payloads']
    },
    {
      id: 'node-preflight',
      title: '2. Pre-Flight Validation & Splitting',
      category: 'Deterministic Rule',
      summary: 'File structural validation, password stripping, page count checks, and multi-statement splitting.',
      inputs: ['Raw PDF files', 'Document metadata'],
      processing: 'Deterministic checks for PDF corruption, encryption passwords, malware signatures, and splits multi-document packs into single-statement units.',
      outputs: ['Clean page-split document units', 'Validation manifest'],
      rules: ['File size < 50MB per PDF', 'Zero password encryption allowed'],
      exceptionConditions: ['Password protected PDFs returned to Relationship Manager with rejection reason']
    },
    {
      id: 'node-class',
      title: '3. AI Document Classification',
      category: 'AI Engine',
      summary: 'Bedrock Claude 3.5 Sonnet classifies document type, statutory subtype, and financial year.',
      inputs: ['Page-split PDF units', 'Borrower company name'],
      processing: 'Multi-modal classifier recognizes statement headings (Balance Sheet, P&L, Cash Flow, GSTR-3B, Bank Statements), extracts entity name and FY.',
      outputs: ['Tagged document inventory by type and FY (e.g. FY2024-25 Audited Balance Sheet)', 'Classification confidence score'],
      rules: ['Grounding evidence required for every classification tag', 'Classification confidence must be ≥90%'],
      exceptionConditions: ['Unclassified document types routed to Credit Analyst for manual tagging']
    },
    {
      id: 'node-layout',
      title: '4. Layout Retrieval (pgvector)',
      category: 'AI Engine',
      summary: 'Searches vector database for closest known statutory statement geometry and accounting templates.',
      inputs: ['Classified statement pages', 'Entity sector & legal type'],
      processing: 'Calculates embedding cosine distance against known MCA Schedule III, Ind AS, and banking statement templates.',
      outputs: ['Statement parsing hints (table zones, expected column headers, footnote coordinates)'],
      rules: ['Template match score ≥85% uses template-directed OCR; otherwise falls back to generic layout parsing'],
      exceptionConditions: ['Non-standard proprietary formats trigger generic table parsing']
    },
    {
      id: 'node-extract',
      title: '5. Textract Table Extraction & Claude Vision Fallback',
      category: 'Hybrid',
      summary: 'High-precision cell-by-cell OCR and 2D bounding box extraction across multi-page financial schedules.',
      inputs: ['High-resolution statement pages', 'Parsing zone hints'],
      processing: 'AWS Textract extracts table cells with 2D bounding boxes. If OCR confidence <85% or handwriting is detected, Bedrock Claude Vision re-reads the zone.',
      outputs: ['Raw key-value JSON with 2D page coordinates and confidence scores per cell'],
      rules: ['Every cell anchored to Page number and normalized [x,y,w,h] bounding coordinates', 'Private VPC endpoint execution'],
      exceptionConditions: ['Faint print, skewed scans, or handwritten notes flagged for visual inspection']
    },
    {
      id: 'node-norm',
      title: '6. Normalization & Chart of Accounts Mapping',
      category: 'Deterministic Rule',
      summary: 'Standardizes original accounting labels, units (Cr $\to$ Lakhs), and currency into standard bank CoA.',
      inputs: ['Extracted line item JSON', 'Bank Chart of Accounts mapping dictionary'],
      processing: 'Deterministic unit scaling (Crores $\to$ Lakhs $\times$ 100, Absolute $\to$ Lakhs $\times$ 0.00001), negative bracket convention normalization, and CoA code binding.',
      outputs: ['Standardized 3-Year Financial Spread schema per FY'],
      rules: ['All figures converted to INR ₹ Lakhs', 'Bracketed negative expenses mapped to standard signs'],
      exceptionConditions: ['Unmapped custom line items routed to Exception Workbench']
    },
    {
      id: 'node-reconcile',
      title: '7. Deterministic Reconciliation Engine',
      category: 'Deterministic Rule',
      summary: 'Executes mathematical integrity tie-outs: Balance Sheet balancing, component sums, and bank credits vs turnover.',
      inputs: ['Normalized multi-year financial spread', '12-Month bank credit summations', 'GSTR-3B filings'],
      processing: 'Deterministic rules verify Total Assets = Total Liabilities, Current Liabilities sum, Net Worth continuity, and Turnover variances.',
      outputs: ['Pass/Fail tie-out matrix with calculated variance percentages'],
      rules: ['Balance Sheet variance must equal 0.0%', 'Bank Credits vs Turnover variance tolerance ≤ 10.0%', 'GST vs Turnover tolerance ≤ 10.0%'],
      exceptionConditions: ['Any tie-out failure forces mandatory Credit Analyst HITL review']
    },
    {
      id: 'node-ratios',
      title: '8. Ratio & Trend Derivation',
      category: 'Deterministic Rule',
      summary: 'Deterministic computation of 14 core financial ratios with 3-year trend evaluation.',
      inputs: ['Normalized 3-year financial spread'],
      processing: 'Deterministic formulas compute Current Ratio, DSCR, TOL/TNW, Debt/Equity, ICR, EBITDA Margin, PAT Margin, and Working Capital Days.',
      outputs: ['14 calculated ratios with 3-year trends and benchmark health flags'],
      rules: ['Deterministic frontend formulas only — zero LLM hallucination in mathematical calculations'],
      exceptionConditions: ['Division by zero handled gracefully with statutory boundary limits']
    },
    {
      id: 'node-conf',
      title: '9. Confidence Engine & Grounding',
      category: 'Hybrid',
      summary: 'Calculates composite confidence triad (OCR score + CoA match + tie-out result) per field.',
      inputs: ['Per-field OCR confidence', 'Template match score', 'Deterministic tie-out result'],
      processing: 'Composite weighted scoring formula: $\\text{Conf} = 0.40 \\times \\text{OCR} + 0.35 \\times \\text{CoA} + 0.25 \\times \\text{TieOut}$.',
      outputs: ['Composite confidence score (0-100%) and citation coordinates per field'],
      rules: ['≥95% Auto-Verified', '85-94% Warning Band', '<85% Mandatory HITL Review Task'],
      exceptionConditions: ['Fields <95% or with character confusion trigger Exception Queue']
    },
    {
      id: 'node-hitl',
      title: '10. Human-in-the-Loop (HITL) Exception Workbench',
      category: 'CRM Workflow',
      summary: 'Side-by-side review workspace for Credit Analyst to inspect source evidence and execute corrections.',
      inputs: ['Flagged low-confidence fields', 'Failed reconciliation checks', 'Source document crops'],
      processing: 'Credit Analyst reviews source crop, edits field value, documents reason, and triggers instant reactive re-validation of dependent checks and ratios.',
      outputs: ['Corrected financial fields', 'Analyst audit notes', 'Re-validated tie-outs'],
      rules: ['Analyst edits re-run impacted calculations automatically', 'Immutable WORM log recorded with analyst user ID'],
      exceptionConditions: ['Unresolved critical exceptions prevent spread sign-off']
    },
    {
      id: 'node-approval',
      title: '11. Spread Approval & Locking',
      category: 'CRM Workflow',
      summary: 'Credit Analyst verifies pre-flight checklist, confirms ratio health, and signs off locked spread version.',
      inputs: ['Clean, reconciled 3-year financial spread', 'Pre-flight integrity checklist'],
      processing: 'Locks spread version (v1.0), captures digital signature timestamp, seals WORM compliance record.',
      outputs: ['Approved financial spread snapshot v1.0 (Locked)'],
      rules: ['All critical exceptions must be 0 before sign-off is permitted'],
      exceptionConditions: ['Deficient spreads can be sent back to Relationship Manager with documented deficiencies']
    },
    {
      id: 'node-publish',
      title: '12. Publish & Downstream Hand-off',
      category: 'CRM Workflow',
      summary: 'Event-driven hand-off to Flow 02 CAM Drafting Agent, Risk Scoring Model, and EWS Portfolio Monitor.',
      inputs: ['Approved Financial JSON v1.0', 'Proposal PR-10045 metadata'],
      processing: 'Publishes events via Kafka / AWS EventBridge and writes back to LOS / CRMNEXT.',
      outputs: ['Downstream credit agent activation', 'Sealed 10-year audit record'],
      rules: ['100% structured JSON format compliance', 'Downstream agents consume without re-keying'],
      exceptionConditions: ['API retry backoff on core banking writeback failure']
    }
  ];

  const selectedNode = nodes.find(n => n.id === selectedNodeId) || nodes[4];

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-indigo-600" />
          How the Extraction Agent Works (Architecture & Principles)
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          End-to-end operational pipeline illustrating the exact boundaries between AI Perception, Deterministic Rules, and CRM Workflow.
        </p>
      </div>

      {/* 3 Core Architectural Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
        <div className="p-4 rounded-xl border border-indigo-200 bg-indigo-50/70 space-y-2">
          <div className="flex items-center gap-2 font-bold text-indigo-950">
            <Sparkles className="w-4 h-4 text-indigo-600" />
            AI Perception Engine
          </div>
          <p className="text-indigo-900 leading-relaxed text-[11px]">
            AWS Textract & Claude 3.5 Vision handle document classification, table coordinate extraction, layout template matching, and OCR digit interpretation.
          </p>
        </div>

        <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/70 space-y-2">
          <div className="flex items-center gap-2 font-bold text-emerald-950">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            Deterministic Rule Engine
          </div>
          <p className="text-emerald-900 leading-relaxed text-[11px]">
            Pure deterministic math handles unit scaling (Cr $\to$ Lakhs), sign normalization, balance sheet tie-outs, ratio formulas, and threshold evaluations.
          </p>
        </div>

        <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
          <div className="flex items-center gap-2 font-bold text-slate-900">
            <Activity className="w-4 h-4 text-slate-600" />
            CRM & Audit Layer
          </div>
          <p className="text-slate-700 leading-relaxed text-[11px]">
            HITL exception workbench, analyst corrections, dual-factor spread sign-off, downstream event dispatches, and 10-year WORM audit sealing.
          </p>
        </div>
      </div>

      {/* 12-Stage Visual Node Explorer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 5 Cols: Stage Nodes List */}
        <div className="lg:col-span-5 space-y-2 max-h-[550px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-slate-200">
          {nodes.map(node => {
            const isSelected = node.id === selectedNode.id;

            return (
              <div
                key={node.id}
                onClick={() => setSelectedNodeId(node.id)}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer shadow-2xs ${
                  isSelected 
                    ? 'border-blue-500 bg-blue-50/60 ring-2 ring-blue-500/20' 
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="font-bold text-xs text-slate-900">{node.title}</span>
                  <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                    node.category === 'AI Engine' 
                      ? 'bg-indigo-100 text-indigo-800' 
                      : node.category === 'Deterministic Rule' 
                        ? 'bg-emerald-100 text-emerald-800' 
                        : node.category === 'Hybrid'
                          ? 'bg-purple-100 text-purple-800'
                          : 'bg-slate-100 text-slate-800'
                  }`}>
                    {node.category}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed line-clamp-1">
                  {node.summary}
                </p>
              </div>
            );
          })}
        </div>

        {/* Right 7 Cols: Deep Dive Node Specification Card */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-5 text-xs text-slate-700">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400">Architecture Stage Inspector</span>
              <h3 className="font-bold text-base text-slate-900 mt-0.5">{selectedNode.title}</h3>
            </div>
            <span className="px-2.5 py-1 bg-blue-50 text-blue-700 font-bold rounded-lg border border-blue-200">
              {selectedNode.category}
            </span>
          </div>

          <p className="text-xs text-slate-800 leading-relaxed">
            {selectedNode.processing}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                Inputs Required
              </span>
              <ul className="space-y-1 text-[11px] list-disc list-inside text-slate-700">
                {selectedNode.inputs.map((inp, idx) => (
                  <li key={idx}>{inp}</li>
                ))}
              </ul>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                Outputs Produced
              </span>
              <ul className="space-y-1 text-[11px] list-disc list-inside text-slate-700">
                {selectedNode.outputs.map((out, idx) => (
                  <li key={idx}>{out}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="p-3.5 bg-emerald-50/60 rounded-xl border border-emerald-200 space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-900 block flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              Statutory Business Rules & Standards
            </span>
            <ul className="space-y-1 text-[11px] list-disc list-inside text-emerald-950">
              {selectedNode.rules.map((rule, idx) => (
                <li key={idx}>{rule}</li>
              ))}
            </ul>
          </div>

          <div className="p-3.5 bg-rose-50/60 rounded-xl border border-rose-200 space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-rose-900 block flex items-center gap-1">
              <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
              Exception Conditions & Human Routing
            </span>
            <ul className="space-y-1 text-[11px] list-disc list-inside text-rose-950">
              {selectedNode.exceptionConditions.map((exc, idx) => (
                <li key={idx}>{exc}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
