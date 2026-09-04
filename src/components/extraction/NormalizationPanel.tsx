import React from 'react';
import { Database, Sparkles, ArrowRight, ShieldCheck, CheckCircle } from '../icons/Icons';
import { getSampleTransformations } from '../../engine/normalizationEngine';
import { standardCoAMappingDictionary } from '../../data/mockBorrowerData';

export const NormalizationPanel: React.FC = () => {
  const transformations = getSampleTransformations();

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <Database className="w-5 h-5 text-blue-600" />
          Normalization & Chart of Accounts Mapping Engine
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Deterministic standardization pipeline: unit conversions, sign conventions, and semantic alignment to Bank Standard CoA.
        </p>
      </div>

      {/* Live Transformation Visualizer */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
              Live Field Transformation Pipeline (Unit & CoA Normalization)
            </h3>
            <p className="text-[11px] text-slate-500">
              Raw OCR extracted values mapped deterministically to the bank's standard financial spreading schema.
            </p>
          </div>
          <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-lg border border-emerald-200 flex items-center gap-1">
            <CheckCircle className="w-3.5 h-3.5" />
            100% Normalized
          </span>
        </div>

        <div className="divide-y divide-slate-100">
          {transformations.map((t, idx) => (
            <div key={idx} className="py-3.5 grid grid-cols-1 md:grid-cols-12 gap-3 items-center text-xs">
              {/* Original Raw Value */}
              <div className="md:col-span-4 bg-slate-50 p-3 rounded-lg border border-slate-200">
                <span className="text-[10px] text-slate-400 font-semibold uppercase">Source Raw Extraction</span>
                <div className="font-bold text-slate-900 mt-0.5">{t.originalLabel}</div>
                <div className="text-xs font-mono text-slate-600 mt-1 flex items-center gap-2">
                  <span className="bg-white px-1.5 py-0.5 rounded border border-slate-200 font-bold">{t.originalValueStr}</span>
                  <span className="text-[10px] text-slate-400">({t.originalUnit})</span>
                </div>
              </div>

              {/* Conversion Rule Flow */}
              <div className="md:col-span-4 flex flex-col items-center justify-center text-center px-2 py-1">
                <div className="flex items-center gap-2 text-blue-600 font-mono font-bold text-xs">
                  <span>× {t.conversionFactor}</span>
                  <ArrowRight className="w-4 h-4 text-blue-500" />
                </div>
                <span className="text-[10px] text-slate-500 font-mono mt-1 max-w-xs truncate">
                  {t.ruleApplied}
                </span>
              </div>

              {/* Normalized Standard CoA Field */}
              <div className="md:col-span-4 bg-blue-50/70 p-3 rounded-lg border border-blue-200">
                <span className="text-[10px] text-blue-700 font-semibold uppercase">Bank Standard Field (CoA)</span>
                <div className="font-bold text-blue-950 mt-0.5">{t.standardField}</div>
                <div className="text-xs font-mono text-blue-900 mt-1 flex items-center gap-2">
                  <span className="bg-white px-1.5 py-0.5 rounded border border-blue-300 font-bold">₹{t.normalizedValue.toFixed(2)} Lakhs</span>
                  <span className="text-[10px] text-blue-600 font-bold">({t.normalizedUnit})</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Standard CoA Dictionary */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-4">
        <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider flex items-center gap-2">
          <Database className="w-4 h-4 text-blue-600" />
          Bank Standard Chart of Accounts Mapping Dictionary
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
              <tr>
                <th className="py-2.5 px-4">Borrower Raw Statement Patterns</th>
                <th className="py-2.5 px-4">Standardized Bank Line Item</th>
                <th className="py-2.5 px-4">Category</th>
                <th className="py-2.5 px-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {standardCoAMappingDictionary.map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-50">
                  <td className="py-2.5 px-4 text-slate-700 italic">"{item.original}"</td>
                  <td className="py-2.5 px-4 font-bold text-slate-900">{item.standard}</td>
                  <td className="py-2.5 px-4 text-slate-500">{item.category}</td>
                  <td className="py-2.5 px-4 text-center">
                    <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 text-[10px] font-bold rounded-full border border-emerald-200">
                      Active
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
