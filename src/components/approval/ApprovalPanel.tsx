import React, { useState } from 'react';
import { 
  Lock, 
  ShieldCheck, 
  CheckCircle, 
  AlertTriangle, 
  RotateCcw, 
  ArrowRight,
  FileText,
  User,
  Sparkles
} from '../icons/Icons';
import { ProposalInfo, ExceptionItem, ReconciliationCheck } from '../../types';
import { NavigationTab } from '../../state/appState';

interface ApprovalPanelProps {
  proposal: ProposalInfo;
  exceptions: ExceptionItem[];
  reconciliations: ReconciliationCheck[];
  spreadVersion: string;
  isApproved: boolean;
  isPublished: boolean;
  onApproveSpread: (comment: string) => void;
  setActiveTab: (tab: NavigationTab) => void;
}

export const ApprovalPanel: React.FC<ApprovalPanelProps> = ({
  proposal,
  exceptions,
  reconciliations,
  spreadVersion,
  isApproved,
  isPublished,
  onApproveSpread,
  setActiveTab
}) => {
  const [approvalComment, setApprovalComment] = useState(
    'Audited balance sheet, P&L schedules, and 3-year financial ratios verified. Trade payables schedule reconciled.'
  );
  const [sendBackReason, setSendBackReason] = useState('');
  const [showSendBackModal, setShowSendBackModal] = useState(false);

  const pendingCriticalExceptions = exceptions.filter(
    e => (e.status === 'PENDING_REVIEW' || e.status === 'IN_REVIEW') && e.severity === 'CRITICAL'
  );
  const failedReconciliations = reconciliations.filter(r => r.status === 'FAIL');

  const isReadyForApproval = pendingCriticalExceptions.length === 0 && failedReconciliations.length === 0;

  const handleApprove = () => {
    onApproveSpread(approvalComment);
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Lock className="w-5 h-5 text-blue-600" />
            Financial Spread Approval & Sign-Off
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Credit Analyst dual-factor sign-off. Locking the spread dataset creates an immutable versioned snapshot.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">Dataset Status:</span>
          <span className={`text-xs font-bold px-2.5 py-1 rounded-lg border ${
            isApproved 
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200' 
              : 'bg-amber-50 text-amber-800 border-amber-200'
          }`}>
            {spreadVersion}
          </span>
        </div>
      </div>

      {/* Pre-Flight Sign-Off Checklist */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-6">
        <h3 className="font-bold text-xs uppercase tracking-wider text-slate-800 pb-3 border-b border-slate-100 flex items-center justify-between">
          <span>Pre-Approval Integrity Checklist</span>
          <span className="text-[11px] font-normal text-slate-500">Proposal ID: {proposal.proposalId}</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          {/* Checklist 1: Documents */}
          <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/50 flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
            <div>
              <div className="font-bold text-emerald-950">Documents Staged</div>
              <div className="text-emerald-800 text-[11px] mt-0.5">8 of 8 Files Processed</div>
              <div className="text-[10px] text-emerald-600 font-mono mt-1">100% Ingested</div>
            </div>
          </div>

          {/* Checklist 2: Critical Exceptions */}
          <div className={`p-4 rounded-xl border flex items-start gap-3 ${
            pendingCriticalExceptions.length === 0 
              ? 'border-emerald-200 bg-emerald-50/50' 
              : 'border-rose-200 bg-rose-50/50'
          }`}>
            {pendingCriticalExceptions.length === 0 ? (
              <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
            ) : (
              <AlertTriangle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5 animate-pulse" />
            )}
            <div>
              <div className={`font-bold ${pendingCriticalExceptions.length === 0 ? 'text-emerald-950' : 'text-rose-950'}`}>
                Critical Exceptions
              </div>
              <div className={`text-[11px] mt-0.5 ${pendingCriticalExceptions.length === 0 ? 'text-emerald-800' : 'text-rose-800'}`}>
                {pendingCriticalExceptions.length === 0 ? '0 Pending Exceptions' : `${pendingCriticalExceptions.length} Unresolved`}
              </div>
              <div className="text-[10px] text-slate-500 font-mono mt-1">
                {pendingCriticalExceptions.length === 0 ? 'All Cleared' : 'Must Resolve in HITL'}
              </div>
            </div>
          </div>

          {/* Checklist 3: Mandatory Fields */}
          <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/50 flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
            <div>
              <div className="font-bold text-emerald-950">Mandatory Line Items</div>
              <div className="text-emerald-800 text-[11px] mt-0.5">186 Fields Mapped</div>
              <div className="text-[10px] text-emerald-600 font-mono mt-1">100% Standardized</div>
            </div>
          </div>

          {/* Checklist 4: Reconciliation */}
          <div className={`p-4 rounded-xl border flex items-start gap-3 ${
            failedReconciliations.length === 0 
              ? 'border-emerald-200 bg-emerald-50/50' 
              : 'border-rose-200 bg-rose-50/50'
          }`}>
            {failedReconciliations.length === 0 ? (
              <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
            ) : (
              <AlertTriangle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
            )}
            <div>
              <div className={`font-bold ${failedReconciliations.length === 0 ? 'text-emerald-950' : 'text-rose-950'}`}>
                Reconciliation Tie-Outs
              </div>
              <div className={`text-[11px] mt-0.5 ${failedReconciliations.length === 0 ? 'text-emerald-800' : 'text-rose-800'}`}>
                {failedReconciliations.length === 0 ? 'All Passed' : '1 Tie-out Discrepancy'}
              </div>
              <div className="text-[10px] text-slate-500 font-mono mt-1">
                {failedReconciliations.length === 0 ? 'Balance Sheet Balanced' : 'Unbalanced BS'}
              </div>
            </div>
          </div>
        </div>

        {/* Approval Sign-off Box */}
        {!isApproved ? (
          <div className="p-5 bg-slate-50 rounded-xl border border-slate-200 space-y-4 text-xs">
            <div>
              <label className="text-xs font-bold text-slate-900 block mb-1">
                Credit Analyst Sign-Off Commentary:
              </label>
              <textarea
                rows={3}
                value={approvalComment}
                onChange={e => setApprovalComment(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-800 focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
                placeholder="Enter sign-off comments for corporate lending committee..."
              />
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
              <div className="text-[11px] text-slate-500 flex items-center gap-1.5">
                <User className="w-4 h-4 text-slate-400" />
                <span>Signing Officer: <strong>{proposal.creditAnalyst}</strong> (Senior Credit Analyst)</span>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowSendBackModal(true)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg text-xs transition-colors"
                >
                  Send Back to RM
                </button>

                <button
                  onClick={handleApprove}
                  disabled={!isReadyForApproval}
                  className={`px-6 py-2 rounded-lg text-xs font-bold shadow-md transition-all flex items-center gap-2 ${
                    isReadyForApproval 
                      ? 'bg-blue-600 hover:bg-blue-700 text-white cursor-pointer hover:shadow-lg' 
                      : 'bg-slate-300 text-slate-500 cursor-not-allowed'
                  }`}
                >
                  <Lock className="w-4 h-4" />
                  <span>Approve & Lock Financial Spread</span>
                </button>
              </div>
            </div>

            {!isReadyForApproval && (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-amber-900 text-[11px] flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0" />
                <span>
                  Please resolve the remaining critical exceptions in the <strong>Exception Workbench</strong> before approving the financial spread.
                </span>
              </div>
            )}
          </div>
        ) : (
          <div className="p-5 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-950 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-6 h-6 text-emerald-600" />
                <div>
                  <h4 className="font-bold text-sm">Financial Spread v1.0 Approved and Locked</h4>
                  <p className="text-[11px] text-emerald-800 mt-0.5">
                    Signed off by {proposal.creditAnalyst} on 01-Sep-2026. Sealed in 10-Year WORM Audit Trail.
                  </p>
                </div>
              </div>

              <button
                onClick={() => setActiveTab('publish')}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md transition-colors flex items-center gap-2"
              >
                <span>Proceed to Downstream Publish</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Send Back Reason Modal */}
      {showSendBackModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <h3 className="font-bold text-sm text-slate-900">Send Back Proposal to Relationship Manager</h3>
            <p className="text-xs text-slate-500">
              Please specify the deficiency or missing statutory financial schedules.
            </p>
            <textarea
              rows={3}
              value={sendBackReason}
              onChange={e => setSendBackReason(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none"
              placeholder="e.g., Unaudited draft schedules uploaded. Requesting certified 3CB-3CD tax audit report..."
            />
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowSendBackModal(false)}
                className="px-3 py-1.5 bg-slate-100 text-slate-700 rounded-lg text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowSendBackModal(false);
                }}
                className="px-4 py-1.5 bg-rose-600 text-white rounded-lg text-xs font-bold shadow-sm"
              >
                Confirm Send Back
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
