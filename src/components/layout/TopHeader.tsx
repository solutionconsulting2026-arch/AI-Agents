import React, { useState } from 'react';
import { 
  Search, 
  Bell, 
  HelpCircle, 
  Play, 
  RotateCcw, 
  Sparkles, 
  ShieldCheck, 
  AlertTriangle 
} from '../icons/Icons';
import { ProposalInfo } from '../../types';

interface TopHeaderProps {
  proposal: ProposalInfo;
  isDemoRunning: boolean;
  exceptionCount: number;
  onRunFullDemo: () => void;
  onResetDemo: () => void;
  onOpenHowItWorks: () => void;
}

export const TopHeader: React.FC<TopHeaderProps> = ({
  proposal,
  isDemoRunning,
  exceptionCount,
  onRunFullDemo,
  onResetDemo,
  onOpenHowItWorks
}) => {
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between flex-shrink-0 z-20 shadow-sm">
      {/* Search and Proposal quick badge */}
      <div className="flex items-center gap-4 flex-1 max-w-xl">
        <div className="relative w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search fields, documents, checks (e.g. 'Trade Payables')..."
            className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
          />
        </div>

        <div className="hidden lg:flex items-center gap-2 px-2.5 py-1 bg-amber-50 border border-amber-200/80 rounded-md">
          <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
          <span className="text-[11px] font-bold text-amber-900 tracking-wide">
            DEMO DATA — NOT REAL CUSTOMER INFORMATION
          </span>
        </div>
      </div>

      {/* Demo Controls & Header Actions */}
      <div className="flex items-center gap-3">
        {/* Run Full Demo Button */}
        <button
          onClick={onRunFullDemo}
          disabled={isDemoRunning}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold shadow-sm transition-all ${
            isDemoRunning 
              ? 'bg-blue-100 text-blue-700 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700 text-white hover:shadow ring-2 ring-blue-600/30'
          }`}
          title="Automatically run end-to-end extraction, exception review, re-validation, and approval demo"
        >
          {isDemoRunning ? (
            <>
              <span className="w-3 h-3 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></span>
              <span>Running Live Demo...</span>
            </>
          ) : (
            <>
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Run Full Demo</span>
            </>
          )}
        </button>

        {/* Reset State Button */}
        <button
          onClick={onResetDemo}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-medium border border-slate-200 transition-colors"
          title="Reset prototype to initial state with 2 pending exceptions"
        >
          <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
          <span>Reset Demo</span>
        </button>

        <div className="h-5 w-px bg-slate-200 mx-1"></div>

        {/* Architecture / How It Works button */}
        <button
          onClick={onOpenHowItWorks}
          className="flex items-center gap-1.5 px-2.5 py-1.5 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg text-xs font-medium transition-colors"
          title="View Agent Architecture & AI vs Rule Engine breakdown"
        >
          <Sparkles className="w-4 h-4 text-blue-600" />
          <span className="hidden sm:inline">How Agent Works</span>
        </button>

        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <Bell className="w-4 h-4" />
            {exceptionCount > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white animate-ping"></span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-slate-200 p-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="text-xs font-bold text-slate-800">Agent Notifications</span>
                <span className="text-[10px] bg-rose-100 text-rose-700 font-bold px-1.5 py-0.5 rounded">
                  {exceptionCount} Exceptions
                </span>
              </div>
              <div className="py-2 space-y-2">
                <div className="p-2 bg-rose-50 border border-rose-100 rounded-lg text-xs">
                  <div className="font-semibold text-rose-800 flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                    Trade Payables (89% Confidence)
                  </div>
                  <div className="text-[11px] text-rose-600 mt-0.5">
                    Below 95% threshold. Character ambiguity on Schedule 6.
                  </div>
                </div>
                <div className="p-2 bg-amber-50 border border-amber-100 rounded-lg text-xs">
                  <div className="font-semibold text-amber-800 flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                    Bank Credits vs Turnover (16% Variance)
                  </div>
                  <div className="text-[11px] text-amber-700 mt-0.5">
                    Credits ₹21 Cr vs P&L ₹25 Cr exceeds 10% tolerance.
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
