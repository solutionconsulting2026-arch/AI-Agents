import React, { useState } from 'react';
import { ExceptionItem, ExtractedField } from '../../types';
import { 
  AlertTriangle, 
  CheckCircle, 
  ShieldCheck, 
  Sparkles, 
  Edit3, 
  Check, 
  X, 
  FileText, 
  ArrowRight, 
  RotateCcw,
  Activity,
  Layers
} from '../icons/Icons';
import { NavigationTab } from '../../state/appState';

interface ExceptionWorkbenchProps {
  exceptions: ExceptionItem[];
  selectedExceptionId: string | null;
  onSelectException: (id: string) => void;
  fields: ExtractedField[];
  onSaveCorrection: (fieldId: string, correctedValue: number, reason: string, comment: string) => void;
  onAcceptException: (exceptionId: string, comment: string) => void;
  setActiveTab: (tab: NavigationTab) => void;
  onOpenSourceViewer: (docId: string, page: number) => void;
}

export const ExceptionWorkbench: React.FC<ExceptionWorkbenchProps> = ({
  exceptions,
  selectedExceptionId,
  onSelectException,
  fields,
  onSaveCorrection,
  onAcceptException,
  setActiveTab,
  onOpenSourceViewer
}) => {
  const activeException = exceptions.find(e => e.id === selectedExceptionId) || exceptions[0];

  const [editValue, setEditValue] = useState('405');
  const [editReason, setEditReason] = useState('OCR misread / faint schedule printing');
  const [editComment, setEditComment] = useState('Verified against Audited Schedule 6: Creditors for goods ₹310L + expenses ₹95L = ₹405L.');
  const [showEditForm, setShowEditForm] = useState(false);

  const pendingExceptions = exceptions.filter(e => e.status === 'PENDING_REVIEW' || e.status === 'IN_REVIEW');

  const handleApplyCorrection = () => {
    const num = parseFloat(editValue);
    if (!isNaN(num) && activeException.fieldId) {
      onSaveCorrection(activeException.fieldId, num, editReason, editComment);
      setShowEditForm(false);
    }
  };

  const handleAcceptWithNote = () => {
    onAcceptException(activeException.id, editComment);
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-500" />
            Human-in-the-Loop (HITL) Exception Workbench
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Exception-only review gateway for OCR low-confidence scores (&lt;95%) and deterministic reconciliation variances.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {pendingExceptions.length > 0 ? (
            <span className="px-3 py-1 bg-rose-50 text-rose-800 text-xs font-bold rounded-lg border border-rose-200 flex items-center gap-1.5 animate-pulse">
              <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
              {pendingExceptions.length} Items Require Human Attention
            </span>
          ) : (
            <span className="px-3 py-1 bg-emerald-50 text-emerald-800 text-xs font-bold rounded-lg border border-emerald-200 flex items-center gap-1.5">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
              All Critical Exceptions Resolved
            </span>
          )}
        </div>
      </div>

      {/* 2-Column Split: Exception Queue vs 3-Pane Resolution Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 4 Cols: Exception Queue List */}
        <div className="lg:col-span-4 space-y-3">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400 px-1">
            Exception Queue ({exceptions.length})
          </div>

          <div className="space-y-2.5">
            {exceptions.map(exc => {
              const isSelected = exc.id === activeException.id;
              const isResolved = exc.status === 'RESOLVED_BY_ANALYST' || exc.status === 'ACCEPTED_WITH_FLAG';

              return (
                <div
                  key={exc.id}
                  onClick={() => {
                    onSelectException(exc.id);
                    setShowEditForm(false);
                  }}
                  className={`p-4 rounded-xl border transition-all cursor-pointer shadow-2xs ${
                    isSelected 
                      ? 'border-blue-500 bg-blue-50/40 ring-2 ring-blue-500/20' 
                      : isResolved
                        ? 'border-emerald-200 bg-emerald-50/30'
                        : exc.severity === 'CRITICAL'
                          ? 'border-rose-200 bg-white hover:border-rose-300'
                          : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      isResolved 
                        ? 'bg-emerald-100 text-emerald-800' 
                        : exc.severity === 'CRITICAL' 
                          ? 'bg-rose-100 text-rose-800' 
                          : 'bg-amber-100 text-amber-800'
                    }`}>
                      {isResolved ? 'Resolved' : exc.severity}
                    </span>

                    <span className="text-[10px] font-mono text-slate-400">
                      {exc.confidenceScore}% Conf
                    </span>
                  </div>

                  <h3 className="font-bold text-xs text-slate-900 leading-snug">
                    {exc.title}
                  </h3>

                  <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
                    <FileText className="w-3 h-3 text-slate-400" />
                    <span className="truncate">{exc.sourceDocument} (Pg {exc.page})</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right 8 Cols: 3-Pane Side-by-Side Review Workspace */}
        <div className="lg:col-span-8 bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-6">
          {/* Top Metadata Header of Active Exception */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                Active Exception ID: {activeException.id} · {activeException.type}
              </span>
              <h3 className="font-bold text-base text-slate-900 mt-0.5">
                {activeException.title}
              </h3>
            </div>

            {activeException.status === 'RESOLVED_BY_ANALYST' ? (
              <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-full flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                Corrected & Re-validated
              </span>
            ) : activeException.status === 'ACCEPTED_WITH_FLAG' ? (
              <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-bold rounded-full flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-blue-600" />
                Accepted with Commentary
              </span>
            ) : (
              <span className="px-3 py-1 bg-rose-100 text-rose-800 text-xs font-bold rounded-full flex items-center gap-1.5 animate-pulse">
                <AlertTriangle className="w-4 h-4 text-rose-600" />
                Pending Analyst Action
              </span>
            )}
          </div>

          {/* 3-Pane Resolution Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            {/* Pane 1: Source Document Evidence */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                  <FileText className="w-3.5 h-3.5 text-blue-500" />
                  1. Source Document
                </div>
                <div className="font-bold text-slate-800 text-xs">{activeException.sourceDocument}</div>
                <div className="text-[11px] text-slate-500">Page {activeException.page} (Audited Schedule 6)</div>
                
                {/* Simulated Visual Source Crop Box */}
                <div className="mt-2 p-2 bg-white border border-dashed border-slate-300 rounded text-[11px] font-serif text-slate-800">
                  <div className="text-[9px] text-slate-400 uppercase font-sans">Scanned Textract Raw Snippet:</div>
                  <div className="font-mono mt-1 font-bold text-slate-900 bg-amber-50 px-1 rounded">
                    "Sundry Creditors (Goods & Expenses) ... 405.00"
                  </div>
                  <div className="text-[9px] text-rose-600 font-sans mt-1">
                    OCR Conf: {activeException.confidenceScore}% (Faint 0 misread as 2)
                  </div>
                </div>
              </div>

              <button
                onClick={() => setActiveTab('viewer')}
                className="w-full py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold rounded-lg text-[11px] transition-colors"
              >
                Inspect in Document Viewer
              </button>
            </div>

            {/* Pane 2: Extracted Value vs Flag Reason */}
            <div className="p-4 bg-rose-50/60 rounded-xl border border-rose-200 space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="text-[10px] font-bold text-rose-800 uppercase tracking-wider flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                  2. Agent Extracted
                </div>
                <div className="text-xl font-bold font-mono text-rose-900">
                  {activeException.extractedValue}
                </div>
                <div className="p-2 bg-white rounded border border-rose-200 text-[11px] text-rose-900 leading-relaxed">
                  {activeException.flagReason}
                </div>
              </div>

              <div className="text-[10px] text-rose-700 font-medium">
                Policy Rule: Confidence &lt;95% blocks auto-approval
              </div>
            </div>

            {/* Pane 3: Agent Recommendation */}
            <div className="p-4 bg-blue-50/60 rounded-xl border border-blue-200 space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="text-[10px] font-bold text-blue-800 uppercase tracking-wider flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                  3. Agent Suggestion
                </div>
                <div className="text-xl font-bold font-mono text-blue-900">
                  {activeException.suggestedValue}
                </div>
                <div className="p-2 bg-white rounded border border-blue-200 text-[11px] text-blue-950 leading-relaxed">
                  {activeException.recommendation}
                </div>
              </div>

              <div className="text-[10px] text-blue-700 font-medium">
                Recommendation based on Schedule 6 break-up
              </div>
            </div>
          </div>

          {/* Action Resolution Box */}
          {activeException.status === 'PENDING_REVIEW' || activeException.status === 'IN_REVIEW' ? (
            <div className="p-5 bg-slate-50 rounded-xl border border-slate-200 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-xs text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <Edit3 className="w-4 h-4 text-blue-600" />
                  Credit Analyst Action Workspace
                </h4>
                <span className="text-[11px] text-slate-500">Actor: Rahul Sharma (Credit Analyst)</span>
              </div>

              {activeException.fieldId ? (
                /* Field Correction Form */
                <div className="space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-semibold text-slate-700 block mb-1">
                        Corrected Value (₹ Lakhs):
                      </label>
                      <input
                        type="number"
                        value={editValue}
                        onChange={e => setEditValue(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-blue-300 rounded-lg font-mono font-bold text-sm text-slate-900 focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
                      />
                      <span className="text-[10px] text-slate-500 mt-1 block">
                        Changing ₹420L $\to$ ₹405L will automatically re-run 4 dependent validations and recalculate Current Ratio and TOL/TNW.
                      </span>
                    </div>

                    <div>
                      <label className="text-[11px] font-semibold text-slate-700 block mb-1">
                        Correction Rationale:
                      </label>
                      <select
                        value={editReason}
                        onChange={e => setEditReason(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-800 focus:outline-none"
                      >
                        <option value="OCR misread / faint schedule printing">OCR misread / faint schedule printing</option>
                        <option value="Audited Schedule 6 reconciliation">Audited Schedule 6 reconciliation</option>
                        <option value="Tax sub-classification adjustment">Tax sub-classification adjustment</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-slate-700 block mb-1">
                      Auditor Verification Commentary (WORM Immutable Log):
                    </label>
                    <textarea
                      rows={2}
                      value={editComment}
                      onChange={e => setEditComment(e.target.value)}
                      className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs text-slate-800 focus:outline-none"
                    />
                  </div>

                  <div className="flex flex-wrap items-center gap-3 pt-2">
                    <button
                      onClick={handleApplyCorrection}
                      className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg text-xs shadow-md transition-all flex items-center gap-2"
                    >
                      <Check className="w-4 h-4" />
                      <span>Save Correction & Trigger Agent Re-Validation</span>
                    </button>

                    <button
                      onClick={handleAcceptWithNote}
                      className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold rounded-lg text-xs transition-colors"
                    >
                      Accept As-Is with Flag
                    </button>
                  </div>
                </div>
              ) : (
                /* Cross-Document / Turnover Exception Form */
                <div className="space-y-3">
                  <div className="p-3 bg-amber-50 rounded-lg border border-amber-200 text-xs text-amber-900 leading-relaxed">
                    <strong>Bank Credit Variance Note:</strong> Inward credits of ₹21.00 Cr vs reported revenue of ₹25.00 Cr (16.0% gap). The borrower utilizes an export collection account at Axis Bank. Document analyst justification for the Credit Appraisal Memo (CAM).
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-slate-700 block mb-1">
                      Analyst Commentary for Credit Committee:
                    </label>
                    <textarea
                      rows={2}
                      value={editComment}
                      onChange={e => setEditComment(e.target.value)}
                      className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs text-slate-800 focus:outline-none"
                      placeholder="Enter justification regarding export letters of credit or secondary banking channels..."
                    />
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={handleAcceptWithNote}
                      className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg text-xs shadow-md transition-colors flex items-center gap-2"
                    >
                      <Check className="w-4 h-4" />
                      <span>Document Commentary & Clear Exception</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Resolved State Banner */
            <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 flex items-center justify-between text-xs text-emerald-950">
              <div className="flex items-center gap-2.5">
                <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                <div>
                  <div className="font-bold">Exception Successfully Resolved</div>
                  <div className="text-[11px] text-emerald-800 mt-0.5">
                    {activeException.analystComment || 'All dependent tie-outs re-validated and logged to 10-year WORM audit trail.'}
                  </div>
                </div>
              </div>

              <button
                onClick={() => setActiveTab('reconciliation')}
                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg transition-colors flex items-center gap-1.5"
              >
                <span>View Reconciliation Tie-Outs</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
