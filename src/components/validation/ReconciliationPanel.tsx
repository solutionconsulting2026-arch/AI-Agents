import React, { useState } from 'react';
import { ReconciliationCheck, CheckStatus } from '../../types';
import { 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle, 
  ArrowRight, 
  Info,
  ChevronRight,
  Sparkles
} from '../icons/Icons';
import { NavigationTab } from '../../state/appState';

interface ReconciliationPanelProps {
  checks: ReconciliationCheck[];
  onOpenExceptions: () => void;
  setActiveTab: (tab: NavigationTab) => void;
}

export const ReconciliationPanel: React.FC<ReconciliationPanelProps> = ({
  checks,
  onOpenExceptions,
  setActiveTab
}) => {
  const [selectedCheckId, setSelectedCheckId] = useState<string>(checks[0]?.id || 'rc-bs-balance');
  const selectedCheck = checks.find(c => c.id === selectedCheckId) || checks[0];

  const getStatusBadge = (status: CheckStatus) => {
    switch (status) {
      case 'PASS':
        return (
          <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-full border border-emerald-200 flex items-center gap-1">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
            PASS
          </span>
        );
      case 'WARNING':
        return (
          <span className="px-2.5 py-0.5 bg-amber-50 text-amber-800 text-xs font-bold rounded-full border border-amber-200 flex items-center gap-1">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
            WARNING
          </span>
        );
      case 'FAIL':
        return (
          <span className="px-2.5 py-0.5 bg-rose-50 text-rose-800 text-xs font-bold rounded-full border border-rose-200 flex items-center gap-1 animate-pulse">
            <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
            FAIL
          </span>
        );
    }
  };

  const passCount = checks.filter(c => c.status === 'PASS').length;
  const failCount = checks.filter(c => c.status === 'FAIL').length;
  const warnCount = checks.filter(c => c.status === 'WARNING').length;

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-blue-600" />
            Financial Reconciliation & Integrity Validation Engine
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Deterministic tie-out matrix enforcing balance sheet equality, cross-statement consistency, and banking reconciliation.
          </p>
        </div>

        {/* Status Score Pill */}
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-lg border border-emerald-200">
            {passCount} Passed
          </span>
          {warnCount > 0 && (
            <span className="px-3 py-1 bg-amber-50 text-amber-800 text-xs font-bold rounded-lg border border-amber-200">
              {warnCount} Warnings
            </span>
          )}
          {failCount > 0 && (
            <span className="px-3 py-1 bg-rose-50 text-rose-800 text-xs font-bold rounded-lg border border-rose-200 animate-pulse">
              {failCount} Failed
            </span>
          )}
        </div>
      </div>

      {/* 2-Column Split: Rule List vs Deep Dive Evidence Drawer */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Checks Grid */}
        <div className="lg:col-span-2 space-y-3">
          {checks.map(check => {
            const isSelected = check.id === selectedCheck.id;

            return (
              <div
                key={check.id}
                onClick={() => setSelectedCheckId(check.id)}
                className={`bg-white p-4 rounded-xl border transition-all cursor-pointer shadow-2xs ${
                  isSelected 
                    ? 'border-blue-500 ring-2 ring-blue-500/20 bg-blue-50/20' 
                    : check.status === 'FAIL' 
                      ? 'border-rose-200 hover:border-rose-300' 
                      : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] uppercase font-bold text-slate-400">
                        {check.category}
                      </span>
                      {check.requiresHITL && (
                        <span className="px-1.5 py-0.2 bg-rose-100 text-rose-700 text-[9px] font-bold rounded">
                          HITL Review Required
                        </span>
                      )}
                    </div>

                    <h3 className="font-bold text-sm text-slate-900 truncate">
                      {check.name}
                    </h3>
                    <p className="text-xs text-slate-500 leading-relaxed line-clamp-1">
                      {check.description}
                    </p>
                  </div>

                  <div className="flex items-center gap-3 flex-shrink-0">
                    {getStatusBadge(check.status)}
                    <ChevronRight className="w-4 h-4 text-slate-300" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mt-3 pt-3 border-t border-slate-100 text-xs">
                  <div className="font-mono text-slate-600">
                    <span className="text-[10px] text-slate-400 block">Reported Metric</span>
                    {check.reportedValueStr}
                  </div>
                  <div className="font-mono text-right text-slate-600">
                    <span className="text-[10px] text-slate-400 block">Validation Calculation</span>
                    {check.calculatedValueStr}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right 1 Col: Rule Detail & Mathematical Evidence */}
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4 sticky top-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400">Tie-Out Rule Inspector</span>
                <h3 className="font-bold text-slate-900 text-sm mt-0.5">{selectedCheck.name}</h3>
              </div>
              {getStatusBadge(selectedCheck.status)}
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-[10px] uppercase font-bold text-slate-400">Rule Logic</span>
                <p className="text-slate-800 mt-1 leading-relaxed">{selectedCheck.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">Detected Variance</span>
                  <div className={`text-base font-bold font-mono mt-0.5 ${
                    selectedCheck.variancePercentage > selectedCheck.allowedTolerancePercentage 
                      ? 'text-rose-600' 
                      : 'text-emerald-700'
                  }`}>
                    {selectedCheck.variancePercentage}%
                  </div>
                </div>

                <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">Allowed Tolerance</span>
                  <div className="text-base font-bold font-mono text-slate-800 mt-0.5">
                    ≤ {selectedCheck.allowedTolerancePercentage}%
                  </div>
                </div>
              </div>

              {/* Mathematical Evidence breakdown */}
              <div className={`p-3.5 rounded-xl border space-y-1.5 ${
                selectedCheck.status === 'PASS' 
                  ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950' 
                  : 'bg-rose-50/70 border-rose-200 text-rose-950'
              }`}>
                <div className="font-bold text-xs flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-blue-600" />
                  Deterministic Validation Evidence
                </div>
                <p className="text-xs leading-relaxed">
                  {selectedCheck.evidence}
                </p>
              </div>

              {selectedCheck.status === 'FAIL' && (
                <button
                  onClick={onOpenExceptions}
                  className="w-full py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-lg text-xs shadow-sm transition-colors flex items-center justify-center gap-1.5"
                >
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>Resolve in Exception Workbench</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
