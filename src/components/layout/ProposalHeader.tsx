import React from 'react';
import { ProposalInfo } from '../../types';
import { 
  Building, 
  CreditCard, 
  User, 
  Layers, 
  ShieldCheck, 
  ChevronRight, 
  Sparkles,
  CheckCircle
} from '../icons/Icons';
import { NavigationTab } from '../../state/appState';

interface ProposalHeaderProps {
  proposal: ProposalInfo;
  spreadVersion: string;
  isApproved: boolean;
  isPublished: boolean;
  activeTab: NavigationTab;
  setActiveTab: (tab: NavigationTab) => void;
}

export const ProposalHeader: React.FC<ProposalHeaderProps> = ({
  proposal,
  spreadVersion,
  isApproved,
  isPublished,
  activeTab,
  setActiveTab
}) => {
  return (
    <div className="bg-white border-b border-slate-200 px-6 py-4">
      {/* Top Breadcrumb & Metadata row */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
            <span>Corporate Credit Hub</span>
            <ChevronRight className="w-3 h-3" />
            <span>Commercial Term Loans</span>
            <ChevronRight className="w-3 h-3" />
            <span className="font-semibold text-blue-600">{proposal.proposalId}</span>
          </div>

          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
              {proposal.borrowerName}
            </h1>
            <span className="px-2 py-0.5 bg-slate-100 text-slate-700 text-xs font-mono font-semibold rounded border border-slate-200">
              {proposal.cif}
            </span>
            <span className="px-2.5 py-0.5 bg-blue-50 text-blue-700 text-xs font-semibold rounded-full border border-blue-200/60 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
              {proposal.creditStage}
            </span>
            {isPublished ? (
              <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 text-xs font-semibold rounded-full flex items-center gap-1 border border-emerald-300">
                <CheckCircle className="w-3 h-3 text-emerald-600" />
                Published to Downstream (CAM / Risk / EWS)
              </span>
            ) : isApproved ? (
              <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-700 text-xs font-semibold rounded-full flex items-center gap-1 border border-emerald-200">
                <ShieldCheck className="w-3 h-3 text-emerald-600" />
                Spread Approved ({spreadVersion})
              </span>
            ) : (
              <span className="px-2.5 py-0.5 bg-amber-50 text-amber-800 text-xs font-semibold rounded-full flex items-center gap-1 border border-amber-200">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping"></span>
                Draft Spread ({spreadVersion})
              </span>
            )}
          </div>
        </div>

        {/* Primary Agent Action button */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveTab(activeTab === 'viewer' ? 'workspace' : 'viewer')}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-bold rounded-lg shadow-sm hover:shadow transition-all"
          >
            <Sparkles className="w-4 h-4 text-blue-200" />
            <span>{activeTab === 'viewer' ? 'Return to Workspace' : 'Open Financial Extraction Agent'}</span>
          </button>
        </div>
      </div>

      {/* Credit Proposal Attribute Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 mt-4 pt-3 border-t border-slate-100 text-xs">
        <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
          <div className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Loan Product</div>
          <div className="font-bold text-slate-800 mt-0.5 flex items-center gap-1">
            <CreditCard className="w-3.5 h-3.5 text-blue-500" />
            {proposal.loanProduct}
          </div>
        </div>

        <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
          <div className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Requested Limit</div>
          <div className="font-bold text-blue-700 mt-0.5 text-sm">
            {proposal.requestedAmount}
          </div>
        </div>

        <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
          <div className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Financial Years</div>
          <div className="font-semibold text-slate-700 mt-0.5">
            FY23 · FY24 · FY25
          </div>
        </div>

        <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
          <div className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Relationship Mgr</div>
          <div className="font-semibold text-slate-800 mt-0.5 flex items-center gap-1">
            <User className="w-3 h-3 text-slate-400" />
            {proposal.relationshipManager}
          </div>
        </div>

        <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
          <div className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Assigned Analyst</div>
          <div className="font-semibold text-slate-800 mt-0.5 flex items-center gap-1">
            <User className="w-3 h-3 text-blue-500" />
            {proposal.creditAnalyst}
          </div>
        </div>

        <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
          <div className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Extraction SLA</div>
          <div className="font-bold text-emerald-700 mt-0.5 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            &lt; 2.5 min (Target: 15m)
          </div>
        </div>
      </div>
    </div>
  );
};
