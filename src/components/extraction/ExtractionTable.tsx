import React, { useState } from 'react';
import { ExtractedField, FieldStatus } from '../../types';
import { 
  Layers, 
  Search, 
  Filter, 
  CheckCircle, 
  AlertTriangle, 
  Eye, 
  Edit3, 
  Sparkles,
  ChevronRight,
  Database
} from '../icons/Icons';

interface ExtractionTableProps {
  fields: ExtractedField[];
  selectedFieldId: string | null;
  onSelectField: (fieldId: string) => void;
  onOpenFieldDrawer: (fieldId: string) => void;
}

export const ExtractionTable: React.FC<ExtractionTableProps> = ({
  fields,
  selectedFieldId,
  onSelectField,
  onOpenFieldDrawer
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const categories = [
    'ALL',
    'Balance Sheet - Liabilities',
    'Balance Sheet - Assets',
    'P&L - Revenue',
    'P&L - Expenses',
    'P&L - Profitability',
    'Banking'
  ];

  const filteredFields = fields.filter(f => {
    const matchesSearch = f.standardField.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          f.originalLabel.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'ALL' || f.category === categoryFilter;
    const matchesStatus = statusFilter === 'ALL' || f.status === statusFilter;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const getStatusBadge = (status: FieldStatus) => {
    switch (status) {
      case 'Verified':
        return (
          <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 text-[10px] font-bold rounded-full border border-emerald-200 flex items-center gap-1">
            <CheckCircle className="w-3 h-3 text-emerald-600" />
            Verified
          </span>
        );
      case 'Corrected':
        return (
          <span className="px-2 py-0.5 bg-blue-50 text-blue-700 text-[10px] font-bold rounded-full border border-blue-200 flex items-center gap-1">
            <CheckCircle className="w-3 h-3 text-blue-600" />
            Analyst Corrected
          </span>
        );
      case 'Warning':
        return (
          <span className="px-2 py-0.5 bg-amber-50 text-amber-800 text-[10px] font-bold rounded-full border border-amber-200 flex items-center gap-1">
            <AlertTriangle className="w-3 h-3 text-amber-600" />
            Warning
          </span>
        );
      case 'Requires Review':
        return (
          <span className="px-2 py-0.5 bg-rose-50 text-rose-800 text-[10px] font-bold rounded-full border border-rose-200 flex items-center gap-1 animate-pulse">
            <AlertTriangle className="w-3 h-3 text-rose-600" />
            Requires Review
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 bg-slate-100 text-slate-700 text-[10px] font-bold rounded-full">
            {status}
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
            <Layers className="w-5 h-5 text-blue-600" />
            AI Extracted Financial Fields & Spreading Grid
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Multi-year standardized financial dataset mapped from MCA Schedule III and P&L schedules.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">Total Fields:</span>
          <span className="text-xs font-bold font-mono px-2 py-1 bg-slate-100 rounded-md text-slate-800 border border-slate-200">
            {fields.length} Extracted
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-1 max-w-sm">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search standard field or raw document label..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full text-xs text-slate-700 placeholder-slate-400 focus:outline-none"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="text-slate-400 font-medium">Category:</span>
          <select
            value={categoryFilter}
            onChange={e => setCategoryFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-xs text-slate-700 focus:outline-none"
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>

          <span className="text-slate-400 font-medium ml-2">Status:</span>
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-xs text-slate-700 focus:outline-none"
          >
            <option value="ALL">All Statuses</option>
            <option value="Verified">Verified</option>
            <option value="Requires Review">Requires Review</option>
            <option value="Warning">Warning</option>
            <option value="Corrected">Corrected</option>
          </select>
        </div>
      </div>

      {/* Financial Spreading Grid Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Standard Field (CoA)</th>
                <th className="py-3 px-4">Original Extracted Label</th>
                <th className="py-3 px-3 text-right">FY2024-25</th>
                <th className="py-3 px-3 text-right">FY2023-24</th>
                <th className="py-3 px-3 text-right">FY2022-23</th>
                <th className="py-3 px-2 text-center">Unit</th>
                <th className="py-3 px-3 text-center">Confidence</th>
                <th className="py-3 px-3 text-center">Status</th>
                <th className="py-3 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredFields.map(field => {
                const isSelected = field.id === selectedFieldId;

                return (
                  <tr
                    key={field.id}
                    onClick={() => onSelectField(field.id)}
                    className={`cursor-pointer transition-all ${
                      isSelected 
                        ? 'bg-blue-50/80 font-medium' 
                        : field.status === 'Requires Review' 
                          ? 'bg-rose-50/40 hover:bg-rose-50' 
                          : 'hover:bg-slate-50'
                    }`}
                  >
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900">{field.standardField}</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">{field.category}</div>
                    </td>

                    <td className="py-3 px-4">
                      <div className="text-slate-700 italic">"{field.originalLabel}"</div>
                      <div className="text-[10px] text-slate-400 mt-0.5 font-mono">
                        {field.documentName} (Pg {field.pageNumber})
                      </div>
                    </td>

                    <td className="py-3 px-3 text-right font-mono font-bold text-blue-900">
                      ₹{field.fy2025.toFixed(2)}
                    </td>

                    <td className="py-3 px-3 text-right font-mono text-slate-600">
                      ₹{field.fy2024.toFixed(2)}
                    </td>

                    <td className="py-3 px-3 text-right font-mono text-slate-500">
                      ₹{field.fy2023.toFixed(2)}
                    </td>

                    <td className="py-3 px-2 text-center text-slate-500 font-mono text-[11px]">
                      {field.normalizedUnit}
                    </td>

                    <td className="py-3 px-3 text-center">
                      <span className={`font-mono font-bold text-xs px-2 py-0.5 rounded ${
                        field.confidence >= 95 
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                          : field.confidence >= 85 
                            ? 'bg-amber-50 text-amber-800 border border-amber-200' 
                            : 'bg-rose-50 text-rose-800 border border-rose-200'
                      }`}>
                        {field.confidence}%
                      </span>
                    </td>

                    <td className="py-3 px-3 text-center">
                      {getStatusBadge(field.status)}
                    </td>

                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onOpenFieldDrawer(field.id);
                        }}
                        className="px-2.5 py-1 bg-slate-100 hover:bg-blue-600 hover:text-white text-slate-700 rounded-lg text-xs font-semibold transition-colors inline-flex items-center gap-1"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Inspect</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
