import React from 'react';
import { FinancialRatio } from '../../types';
import { 
  BarChart2, 
  TrendingUp, 
  TrendingDown, 
  ShieldCheck, 
  CheckCircle, 
  AlertTriangle,
  Activity
} from '../icons/Icons';

interface RatioEngineTableProps {
  ratios: FinancialRatio[];
}

export const RatioEngineTable: React.FC<RatioEngineTableProps> = ({ ratios }) => {
  const getTrendIcon = (trend: FinancialRatio['trend']) => {
    switch (trend) {
      case 'improving':
        return <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />;
      case 'deteriorating':
        return <TrendingDown className="w-3.5 h-3.5 text-rose-600" />;
      default:
        return <span className="text-slate-400 font-bold">—</span>;
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <BarChart2 className="w-5 h-5 text-blue-600" />
            Deterministic Financial Ratio & 3-Year Trend Engine
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Key credit appraisal ratios computed deterministically from normalized Balance Sheet, P&L, and Bank Statement inputs.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 font-bold rounded-lg border border-emerald-200">
            Deterministic Math · Zero AI Hallucination
          </span>
        </div>
      </div>

      {/* Ratios Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Financial Ratio</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Underlying Formula</th>
                <th className="py-3 px-3 text-center">Bank Policy Benchmark</th>
                <th className="py-3 px-3 text-right font-bold text-blue-950">FY2024-25</th>
                <th className="py-3 px-3 text-right">FY2023-24</th>
                <th className="py-3 px-3 text-right">FY2022-23</th>
                <th className="py-3 px-3 text-center">3-Yr Trend</th>
                <th className="py-3 px-3 text-center">Health</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {ratios.map(ratio => (
                <tr key={ratio.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-4 font-bold text-slate-900">
                    {ratio.name}
                  </td>

                  <td className="py-3 px-4 text-slate-500">
                    <span className="px-2 py-0.5 bg-slate-100 rounded text-[10px] font-semibold text-slate-700">
                      {ratio.category}
                    </span>
                  </td>

                  <td className="py-3 px-4 text-slate-600 font-mono text-[11px]">
                    {ratio.formula}
                  </td>

                  <td className="py-3 px-3 text-center font-mono font-semibold text-slate-700">
                    {ratio.benchmark}
                  </td>

                  <td className="py-3 px-3 text-right font-mono font-bold text-sm text-blue-900 bg-blue-50/40">
                    {ratio.fy2025}
                  </td>

                  <td className="py-3 px-3 text-right font-mono text-slate-700">
                    {ratio.fy2024}
                  </td>

                  <td className="py-3 px-3 text-right font-mono text-slate-500">
                    {ratio.fy2023}
                  </td>

                  <td className="py-3 px-3 text-center">
                    <div className="flex items-center justify-center gap-1 font-semibold text-[11px] capitalize">
                      {getTrendIcon(ratio.trend)}
                      <span className={
                        ratio.trend === 'improving' ? 'text-emerald-700' : ratio.trend === 'deteriorating' ? 'text-rose-700' : 'text-slate-500'
                      }>
                        {ratio.trend}
                      </span>
                    </div>
                  </td>

                  <td className="py-3 px-3 text-center">
                    {ratio.isHealthy ? (
                      <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 text-[10px] font-bold rounded-full border border-emerald-200">
                        Healthy
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 bg-amber-50 text-amber-800 text-[10px] font-bold rounded-full border border-amber-200">
                        Moderate
                      </span>
                    )}
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
