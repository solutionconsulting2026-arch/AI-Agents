import React from 'react';
import { AgentActivityEvent } from '../../types';
import { Sparkles, CheckCircle, AlertTriangle, Clock, Activity, Cpu, ShieldCheck } from '../icons/Icons';

interface AgentActivityTimelineProps {
  activities: AgentActivityEvent[];
}

export const AgentActivityTimeline: React.FC<AgentActivityTimelineProps> = ({ activities }) => {
  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-600" />
            Agent Activity & Execution Stream
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time chronological telemetry across OCR models, layout parsers, rule engines, and HITL gateways.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">Total Execution Events:</span>
          <span className="text-xs font-bold font-mono px-2.5 py-1 bg-slate-100 rounded-lg text-slate-800 border border-slate-200">
            {activities.length} Events
          </span>
        </div>
      </div>

      {/* Activity Timeline List */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-6">
        <div className="relative border-l-2 border-slate-200 ml-4 space-y-6">
          {activities.map((act, idx) => (
            <div key={act.id} className="relative pl-6">
              {/* Dot Icon */}
              <div className={`absolute -left-[9px] top-0.5 w-4 h-4 rounded-full border-2 border-white shadow-xs flex items-center justify-center ${
                act.status === 'SUCCESS' 
                  ? 'bg-emerald-500' 
                  : act.status === 'WARNING' 
                    ? 'bg-amber-500' 
                    : act.status === 'PROCESSING' 
                      ? 'bg-blue-500 animate-ping' 
                      : 'bg-indigo-500'
              }`}></div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 hover:border-slate-300 transition-colors space-y-1.5 text-xs">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-xs">{act.action}</span>
                    <span className="px-2 py-0.2 bg-white text-slate-600 text-[10px] font-semibold rounded border border-slate-200">
                      {act.component}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-slate-400 font-mono text-[11px]">
                    {act.durationMs > 0 && (
                      <span className="text-slate-500">{(act.durationMs / 1000).toFixed(2)}s</span>
                    )}
                    <span>{act.timestamp}</span>
                  </div>
                </div>

                <p className="text-slate-700 text-xs leading-relaxed">
                  {act.result}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
