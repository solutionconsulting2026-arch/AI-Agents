import React from 'react';
import { Sparkles, Activity, ShieldCheck, AlertTriangle, ArrowRight } from '../icons/Icons';

interface AgentStatusBarProps {
  status: 'idle' | 'processing' | 'waiting_hitl' | 'approved' | 'published';
  currentAction: string;
  nextAction: string;
  progressPct: number;
  onOpenExceptions?: () => void;
  onOpenApproval?: () => void;
}

export const AgentStatusBar: React.FC<AgentStatusBarProps> = ({
  status,
  currentAction,
  nextAction,
  progressPct,
  onOpenExceptions,
  onOpenApproval
}) => {
  const getStatusBadge = () => {
    switch (status) {
      case 'processing':
        return (
          <span className="px-2 py-0.5 bg-blue-500/20 text-blue-300 text-xs font-semibold rounded-full border border-blue-400/30 flex items-center gap-1.5 animate-pulse">
            <span className="w-2 h-2 rounded-full bg-blue-400"></span>
            Agent Active
          </span>
        );
      case 'waiting_hitl':
        return (
          <span className="px-2 py-0.5 bg-amber-500/20 text-amber-300 text-xs font-semibold rounded-full border border-amber-400/30 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>
            HITL Review Required
          </span>
        );
      case 'approved':
        return (
          <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 text-xs font-semibold rounded-full border border-emerald-400/30 flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            Spread Approved
          </span>
        );
      case 'published':
        return (
          <span className="px-2 py-0.5 bg-indigo-500/20 text-indigo-300 text-xs font-semibold rounded-full border border-indigo-400/30 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            Dataset Published
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 bg-slate-700 text-slate-300 text-xs font-semibold rounded-full flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-slate-400"></span>
            Idle
          </span>
        );
    }
  };

  return (
    <div className="bg-slate-900 border-t border-slate-800 px-6 py-2.5 text-white flex flex-wrap items-center justify-between gap-4 z-30 shadow-lg select-none">
      {/* Left: Agent Heartbeat & Current Action */}
      <div className="flex items-center gap-3 min-w-0 flex-1">
        <div className="flex items-center gap-2 flex-shrink-0">
          <Sparkles className="w-4 h-4 text-blue-400" />
          <span className="text-xs font-bold text-slate-200">Financial Extraction Agent:</span>
          {getStatusBadge()}
        </div>

        <div className="h-4 w-px bg-slate-800 hidden sm:block"></div>

        {/* Current Agent Action text */}
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <span className="text-xs text-slate-300 font-medium truncate">
            {currentAction}
          </span>
        </div>
      </div>

      {/* Right: Next Action & Progress Indicator */}
      <div className="flex items-center gap-4 flex-shrink-0">
        <div className="hidden md:flex items-center gap-2 text-xs text-slate-400">
          <span className="text-[11px] uppercase tracking-wider font-semibold text-slate-400">Next:</span>
          <span className="text-slate-300 truncate max-w-xs">{nextAction}</span>
        </div>

        <div className="flex items-center gap-2">
          <div className="w-28 bg-slate-800 rounded-full h-2 overflow-hidden border border-slate-700">
            <div 
              className={`h-full transition-all duration-500 rounded-full ${
                progressPct === 100 
                  ? 'bg-emerald-500' 
                  : progressPct >= 90 
                    ? 'bg-blue-500' 
                    : 'bg-amber-500'
              }`}
              style={{ width: `${progressPct}%` }}
            ></div>
          </div>
          <span className="text-xs font-mono font-bold text-slate-300">{progressPct}%</span>
        </div>

        {status === 'waiting_hitl' && onOpenExceptions && (
          <button
            onClick={onOpenExceptions}
            className="px-2.5 py-1 bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold rounded flex items-center gap-1 shadow-sm transition-colors"
          >
            <AlertTriangle className="w-3 h-3" />
            <span>Review Exceptions</span>
          </button>
        )}

        {status === 'approved' && onOpenApproval && (
          <button
            onClick={onOpenApproval}
            className="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded flex items-center gap-1 shadow-sm transition-colors"
          >
            <span>Publish Dataset</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        )}
      </div>
    </div>
  );
};
