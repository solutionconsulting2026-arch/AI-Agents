import React from 'react';
import { ExtractedField } from '../../types';
import { TrendingUp, ShieldCheck, AlertTriangle, AlertCircle, ArrowRight, Layers } from '../icons/Icons';
import { NavigationTab } from '../../state/appState';

interface ConfidenceMatrixProps {
  fields: ExtractedField[];
  setActiveTab: (tab: NavigationTab) => void;
  onSelectField: (fieldId: string) => void;
}

export const ConfidenceMatrix: React.FC<ConfidenceMatrixProps> = ({
  fields,
  setActiveTab,
  onSelectField
}) => {
  const highConfFields = fields.filter(f => f.confidence >= 95);
  const medConfFields = fields.filter(f => f.confidence >= 85 && f.confidence < 95);
  const lowConfFields = fields.filter(f => f.confidence < 85 || f.status === 'Requires Review');

  const avgConfidence = Math.round(
    fields.reduce((acc, f) => acc + f.confidence, 0) / (fields.length || 1)
  );

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            AI Confidence Scoring Center
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Triad confidence model combining Textract OCR confidence, pgvector CoA mapping similarity, and deterministic tie-out validation.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">Target Grounding Accuracy:</span>
          <span className="text-xs font-bold font-mono px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-lg border border-emerald-200">
            ≥ 95.0%
          </span>
        </div>
      </div>

      {/* 3 Tier Confidence Distribution Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Overall Average */}
        <div className="bg-slate-900 text-white p-5 rounded-2xl border border-slate-800 shadow-md flex flex-col justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400">Overall Portfolio Score</span>
            <div className="text-3xl font-bold font-mono text-white mt-1">{avgConfidence}%</div>
            <p className="text-xs text-slate-300 mt-1">Average composite confidence across 186 extracted fields.</p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-800 text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            High Grounding Integrity
          </div>
        </div>

        {/* High Tier (>=95%) */}
        <div className="bg-emerald-50/70 p-5 rounded-2xl border border-emerald-200 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-emerald-800">
              <span className="text-[10px] uppercase font-bold tracking-wider">High Confidence (≥95%)</span>
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-3xl font-bold font-mono text-emerald-900 mt-1">
              {highConfFields.length}
            </div>
            <p className="text-xs text-emerald-700 mt-1">
              Auto-verified. Zero human intervention needed.
            </p>
          </div>
          <button
            onClick={() => setActiveTab('extracted-fields')}
            className="mt-4 text-xs font-bold text-emerald-800 hover:text-emerald-950 flex items-center gap-1"
          >
            <span>View Auto-Verified Fields</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        {/* Medium Tier (85-94%) */}
        <div className="bg-amber-50/70 p-5 rounded-2xl border border-amber-200 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-amber-800">
              <span className="text-[10px] uppercase font-bold tracking-wider">Medium (85–94%)</span>
              <AlertTriangle className="w-4 h-4 text-amber-600" />
            </div>
            <div className="text-3xl font-bold font-mono text-amber-900 mt-1">
              {medConfFields.length}
            </div>
            <p className="text-xs text-amber-700 mt-1">
              Warning band. Verified with schedule cross-checks.
            </p>
          </div>
          <button
            onClick={() => setActiveTab('extracted-fields')}
            className="mt-4 text-xs font-bold text-amber-800 hover:text-amber-950 flex items-center gap-1"
          >
            <span>Inspect Warning Fields</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        {/* Low Tier (<85% or Flagged) */}
        <div className="bg-rose-50/70 p-5 rounded-2xl border border-rose-200 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-rose-800">
              <span className="text-[10px] uppercase font-bold tracking-wider">Low / Flagged (&lt;95%)</span>
              <AlertCircle className="w-4 h-4 text-rose-600 animate-pulse" />
            </div>
            <div className="text-3xl font-bold font-mono text-rose-900 mt-1">
              {lowConfFields.length}
            </div>
            <p className="text-xs text-rose-700 mt-1">
              Routed to Credit Analyst in Exception Workbench.
            </p>
          </div>
          <button
            onClick={() => setActiveTab('exceptions')}
            className="mt-4 text-xs font-bold text-rose-800 hover:text-rose-950 flex items-center gap-1"
          >
            <span>Open Exception Workbench</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Flagged / Review Items Detail List */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-4">
        <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-500" />
          Fields Requiring Analyst Attention & Tie-Out Review
        </h3>

        <div className="divide-y divide-slate-100">
          {fields.filter(f => f.confidence < 95 || f.status === 'Requires Review' || f.status === 'Warning').map(field => (
            <div key={field.id} className="py-3 flex items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-xs text-slate-900">{field.standardField}</span>
                  <span className="text-[10px] text-slate-400 italic">"{field.originalLabel}"</span>
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5">
                  {field.flagReason || 'OCR character ambiguity on scanned schedule.'}
                </div>
              </div>

              <div className="flex items-center gap-3 flex-shrink-0">
                <span className="font-mono font-bold text-xs px-2 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-200">
                  {field.confidence}% Confidence
                </span>

                <button
                  onClick={() => {
                    onSelectField(field.id);
                    setActiveTab('viewer');
                  }}
                  className="px-3 py-1 bg-slate-100 hover:bg-blue-600 hover:text-white text-slate-700 rounded-lg text-xs font-semibold transition-colors"
                >
                  Inspect Source
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
