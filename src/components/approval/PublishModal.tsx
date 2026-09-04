import React, { useState } from 'react';
import { 
  CreditCard, 
  CheckCircle, 
  Sparkles, 
  Activity, 
  Database, 
  ShieldCheck, 
  ExternalLink,
  Lock
} from '../icons/Icons';
import { ProposalInfo, ExtractedField } from '../../types';

interface PublishPanelProps {
  proposal: ProposalInfo;
  fields: ExtractedField[];
  isApproved: boolean;
  isPublished: boolean;
  onPublish: (destinations: string[]) => void;
}

export const PublishPanel: React.FC<PublishPanelProps> = ({
  proposal,
  fields,
  isApproved,
  isPublished,
  onPublish
}) => {
  const [selectedDestinations, setSelectedDestinations] = useState<string[]>([
    'CRM Financial Spread Data Store',
    'LOS / CRMNEXT Core API',
    'Flow 02 — Credit Note (CAM) Drafting Agent',
    'Risk Scoring & Scrutiny Engine',
    'Early Warning Signals (EWS) Portfolio Monitor'
  ]);

  const toggleDestination = (dest: string) => {
    if (selectedDestinations.includes(dest)) {
      setSelectedDestinations(selectedDestinations.filter(d => d !== dest));
    } else {
      setSelectedDestinations([...selectedDestinations, dest]);
    }
  };

  const handleTriggerPublish = () => {
    onPublish(selectedDestinations);
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-blue-600" />
            Publish & Downstream Credit Flow Hand-off
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Event-driven publishing of approved, standardized financial JSON payloads to downstream AI agents and core banking systems.
          </p>
        </div>

        <div>
          {isPublished ? (
            <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-full flex items-center gap-1.5 border border-emerald-200">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              Published to {selectedDestinations.length} Systems
            </span>
          ) : isApproved ? (
            <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-bold rounded-full flex items-center gap-1.5 border border-blue-200">
              <Lock className="w-3.5 h-3.5 text-blue-600" />
              Approved v1.0 · Ready to Publish
            </span>
          ) : (
            <span className="px-3 py-1 bg-amber-100 text-amber-800 text-xs font-bold rounded-full flex items-center gap-1.5 border border-amber-200">
              Requires Spread Sign-Off First
            </span>
          )}
        </div>
      </div>

      {/* Downstream Systems Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Destination 1: CAM Drafting Agent */}
        <div className={`p-5 rounded-2xl border transition-all ${
          isPublished 
            ? 'bg-indigo-50/70 border-indigo-200 shadow-sm' 
            : 'bg-white border-slate-200 shadow-2xs'
        }`}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] uppercase font-bold text-indigo-700">Downstream Agent</span>
            {isPublished && (
              <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded-full">
                Active & Running
              </span>
            )}
          </div>
          <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-600" />
            Flow 02 — CAM Drafting Agent
          </h3>
          <p className="text-xs text-slate-600 mt-1">
            Synthesizes 3-year financials, liquidity trends, and audited schedules into executive Credit Appraisal Memo drafts.
          </p>
          <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] font-mono text-slate-500 flex justify-between">
            <span>Protocol: Kafka / EventBridge</span>
            <span className="text-indigo-600 font-bold">{isPublished ? 'Triggered' : 'Pending'}</span>
          </div>
        </div>

        {/* Destination 2: Risk Scoring */}
        <div className={`p-5 rounded-2xl border transition-all ${
          isPublished 
            ? 'bg-blue-50/70 border-blue-200 shadow-sm' 
            : 'bg-white border-slate-200 shadow-2xs'
        }`}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] uppercase font-bold text-blue-700">Risk Engine</span>
            {isPublished && (
              <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded-full">
                Score Computed
              </span>
            )}
          </div>
          <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-blue-600" />
            Risk Scrutiny & Rating Model
          </h3>
          <p className="text-xs text-slate-600 mt-1">
            Computes internal borrower risk rating (CRISIL/ICRA benchmarked) based on TOL/TNW and DSCR ratios.
          </p>
          <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] font-mono text-slate-500 flex justify-between">
            <span>Protocol: REST API / Private VPC</span>
            <span className="text-blue-600 font-bold">{isPublished ? 'Triggered' : 'Pending'}</span>
          </div>
        </div>

        {/* Destination 3: EWS Monitor */}
        <div className={`p-5 rounded-2xl border transition-all ${
          isPublished 
            ? 'bg-amber-50/70 border-amber-200 shadow-sm' 
            : 'bg-white border-slate-200 shadow-2xs'
        }`}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] uppercase font-bold text-amber-700">Portfolio Monitoring</span>
            {isPublished && (
              <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded-full">
                Monitored
              </span>
            )}
          </div>
          <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
            <Activity className="w-4 h-4 text-amber-600" />
            Early Warning Signals (EWS)
          </h3>
          <p className="text-xs text-slate-600 mt-1">
            Enrolls borrower in real-time quarterly bank credit summations, GST return filing, and SMA alert tracker.
          </p>
          <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] font-mono text-slate-500 flex justify-between">
            <span>Protocol: Webhook WebSub</span>
            <span className="text-amber-600 font-bold">{isPublished ? 'Triggered' : 'Pending'}</span>
          </div>
        </div>
      </div>

      {/* JSON Payload Preview & Publish Action */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
              Structured Financial Output Payload JSON (Schema v1.0)
            </h3>
            <p className="text-[11px] text-slate-500">
              Strict JSON schema verified for downstream machine ingestion without human re-keying.
            </p>
          </div>

          <span className="text-xs font-mono text-slate-500 font-semibold">
            Payload Size: 42.8 KB
          </span>
        </div>

        <pre className="p-4 bg-slate-950 text-emerald-400 font-mono text-xs rounded-xl overflow-x-auto max-h-56 scrollbar-thin scrollbar-thumb-slate-800">
{`{
  "proposalId": "${proposal.proposalId}",
  "cif": "${proposal.cif}",
  "borrowerName": "${proposal.borrowerName}",
  "version": "v1.0",
  "status": "APPROVED",
  "signedOffBy": "${proposal.creditAnalyst}",
  "signedOffTimestamp": "2026-09-01T10:48:15Z",
  "financialSummary": {
    "fy2025": {
      "revenue": 2500.0,
      "ebitda": 420.0,
      "pat": 220.0,
      "tangibleNetWorth": 1100.0,
      "totalCurrentAssets": 1020.0,
      "totalCurrentLiabilities": 885.0,
      "tradePayables": 405.0,
      "totalDebt": 750.0
    },
    "ratios": {
      "currentRatio": 1.15,
      "dscr": 1.58,
      "tolTnw": 1.30,
      "interestCoverage": 5.60,
      "ebitdaMargin": 16.8
    }
  },
  "auditProof": {
    "wormRecordId": "WORM-2026-PR10045-V1",
    "sha256Hash": "sha256:7f8a91b38c2049d91024e31...",
    "retentionPolicy": "10_YEARS_STATUTORY"
  }
}`}
        </pre>

        <div className="pt-2 flex justify-end">
          <button
            onClick={handleTriggerPublish}
            disabled={!isApproved || isPublished}
            className={`px-6 py-2.5 rounded-xl text-xs font-bold shadow-md transition-all flex items-center gap-2 ${
              !isApproved
                ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                : isPublished
                  ? 'bg-emerald-600 text-white cursor-default'
                  : 'bg-blue-600 hover:bg-blue-700 text-white cursor-pointer hover:shadow-lg'
            }`}
          >
            {isPublished ? (
              <>
                <CheckCircle className="w-4 h-4" />
                <span>Dataset Successfully Published to All Downstream Systems</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Publish Financial Dataset to Downstream Credit Flows</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
