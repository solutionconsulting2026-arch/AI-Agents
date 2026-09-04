import React, { useState } from 'react';
import { AuditLogEntry } from '../../types';
import { Activity, ShieldCheck, Search, Filter, Lock, CheckCircle, Sparkles, User } from '../icons/Icons';

interface AuditTrailTableProps {
  logs: AuditLogEntry[];
}

export const AuditTrailTable: React.FC<AuditTrailTableProps> = ({ logs }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [actorFilter, setActorFilter] = useState('ALL');

  const filteredLogs = logs.filter(log => {
    const matchesSearch = log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          log.fieldOrComponent.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          log.reason.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesActor = actorFilter === 'ALL' || log.actorRole === actorFilter;
    return matchesSearch && matchesActor;
  });

  const getActorBadge = (role: AuditLogEntry['actorRole']) => {
    switch (role) {
      case 'AI Agent':
        return (
          <span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 text-[10px] font-bold rounded-full border border-indigo-200 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-indigo-600" />
            AI Agent
          </span>
        );
      case 'Credit Analyst':
        return (
          <span className="px-2 py-0.5 bg-blue-50 text-blue-700 text-[10px] font-bold rounded-full border border-blue-200 flex items-center gap-1">
            <User className="w-3 h-3 text-blue-600" />
            Credit Analyst
          </span>
        );
      case 'Validation Engine':
        return (
          <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 text-[10px] font-bold rounded-full border border-emerald-200 flex items-center gap-1">
            <ShieldCheck className="w-3 h-3 text-emerald-600" />
            Rule Engine
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 bg-slate-100 text-slate-700 text-[10px] font-bold rounded-full">
            {role}
          </span>
        );
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Activity className="w-5 h-5 text-blue-600" />
            10-Year WORM Immutable Audit Trail
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Write-Once-Read-Many statutory compliance log preserving every OCR cell extraction, analyst edit, and tie-out calculation.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 bg-slate-100 text-slate-700 text-xs font-mono font-bold rounded-lg border border-slate-200 flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-slate-500" />
            WORM Sealed (SHA-256)
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-1 max-w-sm">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search action, field name, or audit rationale..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full text-xs text-slate-700 placeholder-slate-400 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-400 font-medium">Actor Filter:</span>
          {['ALL', 'AI Agent', 'Credit Analyst', 'Validation Engine'].map(role => (
            <button
              key={role}
              onClick={() => setActorFilter(role)}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                actorFilter === role 
                  ? 'bg-blue-600 text-white font-semibold' 
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {role}
            </button>
          ))}
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">Actor</th>
                <th className="py-3 px-4">Action Event</th>
                <th className="py-3 px-4">Target Field / Component</th>
                <th className="py-3 px-3 text-right">Old Value</th>
                <th className="py-3 px-3 text-right">New Value</th>
                <th className="py-3 px-4">Audit Rationale & Justification</th>
                <th className="py-3 px-3 text-center">WORM Hash</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-sans">
              {filteredLogs.map(log => (
                <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-4 font-mono text-slate-500 whitespace-nowrap">
                    {log.timestamp}
                  </td>

                  <td className="py-3 px-4">
                    <div className="flex items-center gap-1.5">
                      {getActorBadge(log.actorRole)}
                      <span className="text-slate-700 font-semibold">{log.actor}</span>
                    </div>
                  </td>

                  <td className="py-3 px-4 font-bold text-slate-900">
                    {log.action}
                  </td>

                  <td className="py-3 px-4 text-blue-700 font-medium font-mono text-[11px]">
                    {log.fieldOrComponent}
                  </td>

                  <td className="py-3 px-3 text-right font-mono text-slate-400">
                    {log.oldValue}
                  </td>

                  <td className="py-3 px-3 text-right font-mono font-bold text-slate-900">
                    {log.newValue}
                  </td>

                  <td className="py-3 px-4 text-slate-600 text-[11px] max-w-xs leading-relaxed">
                    {log.reason}
                  </td>

                  <td className="py-3 px-3 text-center">
                    <span className="font-mono text-[10px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-500 truncate block max-w-[90px]">
                      {log.verificationHash}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
