import React from 'react';
import { 
  Building, 
  FileText, 
  FileSpreadsheet, 
  AlertTriangle, 
  Activity, 
  ShieldCheck, 
  Layers, 
  Database, 
  BarChart2, 
  Lock, 
  HelpCircle,
  TrendingUp,
  CreditCard
} from '../icons/Icons';
import { NavigationTab } from '../../state/appState';

interface SidebarProps {
  activeTab: NavigationTab;
  setActiveTab: (tab: NavigationTab) => void;
  exceptionCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  activeTab, 
  setActiveTab, 
  exceptionCount 
}) => {
  const mainNavItems = [
    { id: 'workspace', label: 'Dashboard & Workspace', icon: Building, badge: null },
    { id: 'documents', label: 'Document Center', icon: FileText, badge: '8' },
    { id: 'viewer', label: 'Document Intelligence', icon: FileSpreadsheet, badge: 'OCR' },
    { id: 'extracted-fields', label: 'Financial Spreads', icon: Layers, badge: '186' },
    { id: 'normalization', label: 'CoA Normalization', icon: Database, badge: null },
    { id: 'reconciliation', label: 'Reconciliation Engine', icon: ShieldCheck, badge: 'Live' },
    { id: 'ratios', label: 'Ratios & Trends', icon: BarChart2, badge: '3-Yr' },
    { id: 'confidence', label: 'Confidence Center', icon: TrendingUp, badge: '93%' },
    { 
      id: 'exceptions', 
      label: 'Exceptions (HITL)', 
      icon: AlertTriangle, 
      badge: exceptionCount > 0 ? `${exceptionCount}` : null,
      badgeColor: 'bg-rose-500 text-white'
    },
    { id: 'approval', label: 'Spread Approval', icon: Lock, badge: null },
    { id: 'publish', label: 'Publish & Handoff', icon: CreditCard, badge: 'CAM' },
    { id: 'audit', label: '10-Yr Audit Trail', icon: Activity, badge: 'WORM' },
    { id: 'how-it-works', label: 'How Agent Works', icon: HelpCircle, badge: 'Arch' }
  ];

  return (
    <aside className="w-64 bg-slate-900 text-slate-200 flex flex-col flex-shrink-0 border-r border-slate-800 select-none">
      {/* Brand Header */}
      <div className="h-16 flex items-center px-5 bg-slate-950 border-b border-slate-800/80 gap-3">
        <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold shadow-md shadow-blue-900/50">
          <Building className="w-5 h-5" />
        </div>
        <div>
          <h1 className="font-bold text-sm text-white tracking-tight flex items-center gap-1.5">
            APEX BANKING
            <span className="text-[10px] bg-blue-500/20 text-blue-400 font-semibold px-1.5 py-0.5 rounded">CRM</span>
          </h1>
          <p className="text-[11px] text-slate-400">Flow 01 · Extraction Agent</p>
        </div>
      </div>

      {/* Proposal Pill Context */}
      <div className="px-4 py-3 bg-slate-800/40 border-b border-slate-800">
        <div className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider">Active Proposal</div>
        <div className="text-xs font-medium text-blue-300 truncate mt-0.5">PR-10045 · ABC Mfg</div>
        <div className="flex items-center gap-2 mt-1">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="text-[11px] text-slate-300">Credit Appraisal</span>
        </div>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-0.5 scrollbar-thin scrollbar-thumb-slate-800">
        <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
          Agent Workflow & Data
        </div>

        {mainNavItems.map(item => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as NavigationTab)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                isActive 
                  ? 'bg-blue-600 text-white font-semibold shadow-sm' 
                  : 'text-slate-300 hover:bg-slate-800/70 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                  item.badgeColor || (isActive ? 'bg-blue-700 text-white' : 'bg-slate-800 text-slate-300')
                }`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* User Card */}
      <div className="p-3 bg-slate-950 border-t border-slate-800 flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-bold text-slate-300">
          RS
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-xs font-medium text-white truncate">Rahul Sharma</div>
          <div className="text-[10px] text-slate-400 truncate">Senior Credit Analyst</div>
        </div>
        <span className="w-2 h-2 rounded-full bg-emerald-500" title="Online & Connected"></span>
      </div>
    </aside>
  );
};
