import React from 'react';
import { WorkflowStage, StageStatus } from '../../types';
import { 
  CheckCircle, 
  AlertTriangle, 
  Clock, 
  ShieldCheck, 
  Sparkles, 
  ChevronRight,
  Activity,
  Lock
} from '../icons/Icons';
import { NavigationTab } from '../../state/appState';

interface WorkflowStepperProps {
  stages: WorkflowStage[];
  activeTab: NavigationTab;
  setActiveTab: (tab: NavigationTab) => void;
}

export const WorkflowStepper: React.FC<WorkflowStepperProps> = ({
  stages,
  activeTab,
  setActiveTab
}) => {
  const getStatusIcon = (status: StageStatus) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />;
      case 'approved':
      case 'published':
        return <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />;
      case 'warning':
        return <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />;
      case 'requires_review':
      case 'failed':
        return <AlertTriangle className="w-3.5 h-3.5 text-rose-500" />;
      case 'in_progress':
        return <span className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-ping"></span>;
      default:
        return <Clock className="w-3.5 h-3.5 text-slate-400" />;
    }
  };

  const getStatusClass = (status: StageStatus) => {
    switch (status) {
      case 'completed':
      case 'approved':
      case 'published':
        return 'border-emerald-200 bg-emerald-50 text-emerald-800 hover:border-emerald-300';
      case 'warning':
        return 'border-amber-200 bg-amber-50 text-amber-800 hover:border-amber-300';
      case 'requires_review':
      case 'failed':
        return 'border-rose-200 bg-rose-50 text-rose-800 hover:border-rose-300';
      case 'in_progress':
        return 'border-blue-300 bg-blue-50 text-blue-800 hover:border-blue-400';
      default:
        return 'border-slate-200 bg-white text-slate-500 hover:border-slate-300';
    }
  };

  const mapStageToTab = (stageId: string): NavigationTab => {
    switch (stageId) {
      case 'intake':
      case 'validation':
        return 'documents';
      case 'classification':
      case 'layout':
      case 'extraction':
        return 'viewer';
      case 'normalization':
        return 'normalization';
      case 'reconciliation':
        return 'reconciliation';
      case 'ratios':
        return 'ratios';
      case 'confidence':
        return 'confidence';
      case 'exceptions':
        return 'exceptions';
      case 'approval':
        return 'approval';
      case 'publish':
        return 'publish';
      default:
        return 'workspace';
    }
  };

  return (
    <div className="bg-white border-b border-slate-200 px-6 py-3 overflow-x-auto scrollbar-thin scrollbar-thumb-slate-200">
      <div className="flex items-center justify-between gap-2 min-w-[1100px]">
        {stages.map((stage, idx) => {
          const targetTab = mapStageToTab(stage.id);
          const isCurrentActive = activeTab === targetTab;

          return (
            <React.Fragment key={stage.id}>
              <button
                onClick={() => setActiveTab(targetTab)}
                className={`flex-1 flex flex-col p-2 rounded-lg border transition-all text-left group ${
                  getStatusClass(stage.status)
                } ${isCurrentActive ? 'ring-2 ring-blue-500 shadow-sm' : ''}`}
              >
                <div className="flex items-center justify-between gap-1 mb-1">
                  <span className="text-[10px] font-mono font-bold text-slate-400">
                    Step {stage.stageNumber}
                  </span>
                  {getStatusIcon(stage.status)}
                </div>

                <div className="font-bold text-xs truncate text-slate-800 group-hover:text-blue-600 transition-colors">
                  {stage.name.replace(/^\d+\.\s*/, '')}
                </div>

                <div className="flex items-center justify-between text-[10px] text-slate-400 mt-1">
                  <span className="truncate">{stage.engine}</span>
                  {stage.durationMs && (
                    <span className="font-mono text-[9px]">{(stage.durationMs / 1000).toFixed(1)}s</span>
                  )}
                </div>
              </button>

              {idx < stages.length - 1 && (
                <ChevronRight className="w-3.5 h-3.5 text-slate-300 flex-shrink-0" />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};
