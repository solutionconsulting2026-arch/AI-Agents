import React, { useState } from 'react';
import { ExtractedField } from '../../types';
import { 
  X, 
  Sparkles, 
  Check, 
  Edit3, 
  AlertTriangle, 
  ShieldCheck, 
  FileText, 
  Layers,
  RotateCcw
} from '../icons/Icons';

interface FieldDetailDrawerProps {
  field: ExtractedField | null;
  isOpen: boolean;
  onClose: () => void;
  onSaveCorrection: (fieldId: string, correctedValue: number, reason: string, comment: string) => void;
  onOpenSourceViewer?: (docId: string, page: number) => void;
}

export const FieldDetailDrawer: React.FC<FieldDetailDrawerProps> = ({
  field,
  isOpen,
  onClose,
  onSaveCorrection,
  onOpenSourceViewer
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState<string>('');
  const [editReason, setEditReason] = useState('OCR misread / scan ambiguity');
  const [editComment, setEditComment] = useState('Verified against Audited Schedule 6');

  if (!isOpen || !field) return null;

  const handleStartEdit = () => {
    setEditValue(String(field.suggestedValue || field.fy2025));
    setIsEditing(true);
  };

  const handleSave = () => {
    const numVal = parseFloat(editValue);
    if (!isNaN(numVal)) {
      onSaveCorrection(field.id, numVal, editReason, editComment);
      setIsEditing(false);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex justify-end animate-in fade-in duration-150">
      <div className="w-full max-w-lg bg-white h-full shadow-2xl flex flex-col justify-between border-l border-slate-200 overflow-y-auto">
        {/* Drawer Header */}
        <div>
          <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Field Detail Inspector</span>
              <h3 className="font-bold text-base text-slate-900 mt-0.5">{field.standardField}</h3>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Drawer Body Content */}
          <div className="p-6 space-y-5 text-xs text-slate-700">
            {/* Status & Confidence Banner */}
            <div className={`p-3.5 rounded-xl border flex items-center justify-between ${
              field.confidence >= 95 
                ? 'bg-emerald-50 border-emerald-200 text-emerald-900' 
                : 'bg-rose-50 border-rose-200 text-rose-900'
            }`}>
              <div className="flex items-center gap-2">
                {field.confidence >= 95 ? (
                  <ShieldCheck className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                ) : (
                  <AlertTriangle className="w-5 h-5 text-rose-600 flex-shrink-0" />
                )}
                <div>
                  <div className="font-bold">{field.status}</div>
                  <div className="text-[11px] opacity-90">
                    {field.confidence >= 95 ? 'Passed ≥95% auto-verification threshold' : 'Flagged: Below 95% auto-verification threshold'}
                  </div>
                </div>
              </div>

              <div className="text-right">
                <span className="text-lg font-bold font-mono">{field.confidence}%</span>
                <div className="text-[10px] uppercase tracking-wider font-semibold">Composite</div>
              </div>
            </div>

            {/* Extracted Values Grid */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
              <div className="text-[11px] uppercase font-bold text-slate-500">Multi-Year Spreading Data</div>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="bg-white p-2.5 rounded-lg border border-slate-200 shadow-2xs">
                  <div className="text-[10px] text-slate-400 font-semibold">FY2024-25</div>
                  <div className="text-base font-bold text-blue-900 font-mono mt-0.5">₹{field.fy2025.toFixed(2)} L</div>
                </div>
                <div className="bg-white p-2.5 rounded-lg border border-slate-200 shadow-2xs">
                  <div className="text-[10px] text-slate-400 font-semibold">FY2023-24</div>
                  <div className="text-base font-bold text-slate-700 font-mono mt-0.5">₹{field.fy2024.toFixed(2)} L</div>
                </div>
                <div className="bg-white p-2.5 rounded-lg border border-slate-200 shadow-2xs">
                  <div className="text-[10px] text-slate-400 font-semibold">FY2022-23</div>
                  <div className="text-base font-bold text-slate-600 font-mono mt-0.5">₹{field.fy2023.toFixed(2)} L</div>
                </div>
              </div>
            </div>

            {/* Extraction & Mapping Details */}
            <div className="space-y-2.5">
              <div className="text-[11px] uppercase font-bold text-slate-500">Source Document Citation</div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-500">Original Document Label:</span>
                  <span className="font-semibold text-slate-900">"{field.originalLabel}"</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Source File:</span>
                  <span className="font-medium text-blue-700">{field.documentName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Page Citation:</span>
                  <span className="font-mono text-slate-800">Page {field.pageNumber} (Schedule)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">OCR Extraction Method:</span>
                  <span className="text-slate-800">{field.extractionMethod}</span>
                </div>
              </div>
            </div>

            {/* Confidence Triad Breakdown */}
            <div className="space-y-2.5">
              <div className="text-[11px] uppercase font-bold text-slate-500">Confidence Triad Breakdown</div>
              <div className="grid grid-cols-3 gap-2">
                <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 text-center">
                  <div className="text-[10px] text-slate-400 font-semibold uppercase">OCR Score</div>
                  <div className="text-sm font-bold font-mono text-slate-800 mt-0.5">{field.ocrConfidence}%</div>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 text-center">
                  <div className="text-[10px] text-slate-400 font-semibold uppercase">CoA Match</div>
                  <div className="text-sm font-bold font-mono text-slate-800 mt-0.5">{field.mappingConfidence}%</div>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 text-center">
                  <div className="text-[10px] text-slate-400 font-semibold uppercase">Tie-Out Score</div>
                  <div className="text-sm font-bold font-mono text-slate-800 mt-0.5">{field.tieOutConfidence}%</div>
                </div>
              </div>
            </div>

            {/* Editing / Correction Form */}
            {isEditing ? (
              <div className="p-4 bg-blue-50/70 border border-blue-200 rounded-xl space-y-3 animate-in fade-in duration-150">
                <div className="font-bold text-xs text-blue-900 flex items-center gap-1.5">
                  <Edit3 className="w-4 h-4 text-blue-600" />
                  Analyst Correction Workbench
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-slate-700 block mb-1">
                    Corrected Value (₹ Lakhs):
                  </label>
                  <input
                    type="number"
                    value={editValue}
                    onChange={e => setEditValue(e.target.value)}
                    className="w-full px-3 py-1.5 bg-white border border-blue-300 rounded-lg font-mono font-bold text-sm text-slate-900 focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
                  />
                  {field.suggestedValue && (
                    <div className="text-[10px] text-blue-700 mt-1">
                      Suggested by Schedule 6 reconciliation: <strong>₹{field.suggestedValue} Lakhs</strong>
                    </div>
                  )}
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-slate-700 block mb-1">
                    Correction Reason:
                  </label>
                  <select
                    value={editReason}
                    onChange={e => setEditReason(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs text-slate-800 focus:outline-none"
                  >
                    <option value="OCR misread / scan ambiguity">OCR misread / scan ambiguity</option>
                    <option value="Faint digit misrecognition">Faint digit misrecognition (405 read as 420)</option>
                    <option value="Audited schedule reconciliation">Audited schedule reconciliation</option>
                    <option value="Tax schedule reclassification">Tax schedule reclassification</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-slate-700 block mb-1">
                    Auditor Verification Note:
                  </label>
                  <textarea
                    rows={2}
                    value={editComment}
                    onChange={e => setEditComment(e.target.value)}
                    className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs text-slate-800 focus:outline-none"
                    placeholder="Enter verification commentary for WORM audit trail..."
                  />
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <button
                    onClick={handleSave}
                    className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg text-xs shadow-sm transition-colors"
                  >
                    Save Correction & Re-Validate
                  </button>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="px-3 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold rounded-lg text-xs transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : null}
          </div>
        </div>

        {/* Drawer Action Bar */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center gap-3">
          {!isEditing && (
            <>
              <button
                onClick={handleStartEdit}
                className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg text-xs shadow-sm transition-colors flex items-center justify-center gap-1.5"
              >
                <Edit3 className="w-4 h-4" />
                <span>Edit / Correct Value</span>
              </button>

              <button
                onClick={onClose}
                className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold rounded-lg text-xs transition-colors"
              >
                Close
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
