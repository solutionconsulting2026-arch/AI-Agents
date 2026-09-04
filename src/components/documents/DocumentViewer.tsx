import React, { useState } from 'react';
import { 
  BorrowerDocument, 
  ExtractedField, 
  DocumentBoundingBox 
} from '../../types';
import { 
  ZoomIn, 
  ZoomOut, 
  Search, 
  ChevronLeft, 
  ChevronRight, 
  Layers, 
  ShieldCheck, 
  AlertTriangle, 
  Sparkles, 
  Check, 
  Edit3,
  Maximize2
} from '../icons/Icons';

interface DocumentViewerProps {
  document: BorrowerDocument;
  documents: BorrowerDocument[];
  onSelectDocument: (docId: string) => void;
  fields: ExtractedField[];
  selectedFieldId: string | null;
  highlightedBoundingBoxId: string | null;
  onSelectField: (fieldId: string) => void;
  onSelectBoundingBox: (bb: DocumentBoundingBox) => void;
  activePage: number;
  setActivePage: (page: number) => void;
  zoomLevel: number;
  setZoomLevel: (zoom: number) => void;
  onOpenFieldDrawer?: (fieldId: string) => void;
}

export const DocumentViewer: React.FC<DocumentViewerProps> = ({
  document,
  documents,
  onSelectDocument,
  fields,
  selectedFieldId,
  highlightedBoundingBoxId,
  onSelectField,
  onSelectBoundingBox,
  activePage,
  setActivePage,
  zoomLevel,
  setZoomLevel,
  onOpenFieldDrawer
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showThumbnails, setShowThumbnails] = useState(true);

  const selectedField = fields.find(f => f.id === selectedFieldId);

  // Render dummy balance sheet / statement lines for document
  const isBalanceSheet = document.type === 'Balance Sheet';
  const isPL = document.type === 'P&L Statement';
  const isBank = document.type === 'Bank Statement';

  return (
    <div className="h-[calc(100vh-14rem)] flex flex-col bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl select-none">
      {/* Top Document Viewer Control Bar */}
      <div className="h-12 bg-slate-950 border-b border-slate-800 px-4 flex items-center justify-between text-xs text-slate-300 flex-shrink-0">
        {/* Document Selector Dropdown */}
        <div className="flex items-center gap-3">
          <select
            value={document.id}
            onChange={e => onSelectDocument(e.target.value)}
            className="bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-lg px-2.5 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium"
          >
            {documents.map(d => (
              <option key={d.id} value={d.id}>
                {d.name} ({d.financialYear})
              </option>
            ))}
          </select>

          <span className="text-[11px] text-slate-400">
            {document.subtype}
          </span>
        </div>

        {/* Page navigation & Zoom controls */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 bg-slate-900 px-2 py-1 rounded-lg border border-slate-800">
            <button
              onClick={() => setActivePage(Math.max(1, activePage - 1))}
              disabled={activePage <= 1}
              className="p-1 hover:text-white disabled:text-slate-600 disabled:hover:text-slate-600"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <span className="font-mono text-xs">
              Page {activePage} / {document.pageCount}
            </span>
            <button
              onClick={() => setActivePage(Math.min(document.pageCount, activePage + 1))}
              disabled={activePage >= document.pageCount}
              className="p-1 hover:text-white disabled:text-slate-600 disabled:hover:text-slate-600"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex items-center gap-1 bg-slate-900 px-2 py-1 rounded-lg border border-slate-800">
            <button
              onClick={() => setZoomLevel(Math.max(70, zoomLevel - 15))}
              className="p-1 hover:text-white"
              title="Zoom Out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="font-mono text-xs w-10 text-center">{zoomLevel}%</span>
            <button
              onClick={() => setZoomLevel(Math.min(150, zoomLevel + 15))}
              className="p-1 hover:text-white"
              title="Zoom In"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>

          <button
            onClick={() => setShowThumbnails(!showThumbnails)}
            className={`px-2.5 py-1 rounded text-xs font-medium border ${
              showThumbnails 
                ? 'bg-blue-600/30 text-blue-300 border-blue-500/40' 
                : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
            }`}
          >
            Thumbnails
          </button>
        </div>
      </div>

      {/* Main Split: Left Thumbnails Rail | Center Canvas Sheet | Right Linked Field Inspector */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Thumbnails Rail */}
        {showThumbnails && (
          <div className="w-28 bg-slate-950 border-r border-slate-800 p-2 space-y-3 overflow-y-auto flex-shrink-0 scrollbar-thin scrollbar-thumb-slate-800">
            {Array.from({ length: document.pageCount }).map((_, idx) => {
              const pageNum = idx + 1;
              const isCurrent = pageNum === activePage;

              return (
                <div
                  key={pageNum}
                  onClick={() => setActivePage(pageNum)}
                  className={`p-1 rounded-lg border cursor-pointer transition-all ${
                    isCurrent 
                      ? 'border-blue-500 bg-blue-950/40 ring-1 ring-blue-500' 
                      : 'border-slate-800 hover:border-slate-700 bg-slate-900'
                  }`}
                >
                  <div className="w-full aspect-[3/4] bg-white rounded flex flex-col p-1 text-[7px] text-slate-600 overflow-hidden shadow-inner leading-tight">
                    <div className="font-bold border-b pb-0.5 mb-1 truncate text-[6px]">ABC MFG PVT LTD</div>
                    <div className="space-y-0.5">
                      <div className="h-1 bg-slate-200 rounded w-3/4"></div>
                      <div className="h-1 bg-slate-200 rounded w-1/2"></div>
                      <div className="h-1 bg-slate-200 rounded w-5/6"></div>
                      <div className="h-1 bg-slate-200 rounded w-2/3"></div>
                    </div>
                  </div>
                  <div className="text-center text-[10px] text-slate-400 mt-1 font-mono">
                    Page {pageNum}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Center: High-Fidelity Rendered Financial Document Page */}
        <div className="flex-1 bg-slate-900 overflow-auto p-6 flex justify-center items-start scrollbar-thin scrollbar-thumb-slate-700">
          <div 
            className="bg-white text-slate-900 rounded-lg shadow-2xl transition-transform duration-150 origin-top relative border border-slate-200"
            style={{
              width: `${(650 * zoomLevel) / 100}px`,
              minHeight: `${(880 * zoomLevel) / 100}px`,
              padding: '2.5rem'
            }}
          >
            {/* Header of the Statutory Statement */}
            <div className="text-center pb-4 border-b-2 border-slate-900 space-y-1">
              <h2 className="text-lg font-bold tracking-tight text-slate-950 uppercase">
                ABC MANUFACTURING PRIVATE LIMITED
              </h2>
              <div className="text-xs font-semibold text-slate-700">
                CIN: U29253MH2012PTC234567 · Registered Office: Andheri East, Mumbai 400069
              </div>
              <div className="text-sm font-bold text-slate-900 mt-2">
                {isBalanceSheet ? 'BALANCE SHEET AS AT 31ST MARCH 2025' : isPL ? 'STATEMENT OF PROFIT AND LOSS FOR THE YEAR ENDED 31ST MARCH 2025' : '12-MONTH CURRENT ACCOUNT TRANSACTION SUMMARY'}
              </div>
              <div className="text-xs text-slate-600 italic">
                (All amounts in ₹ Lakhs, unless otherwise stated)
              </div>
            </div>

            {/* Document Statement Body */}
            {isBalanceSheet ? (
              <div className="mt-4 text-xs space-y-4 font-serif">
                {/* Equity and Liabilities */}
                <div>
                  <div className="font-bold text-slate-950 uppercase tracking-wide border-b border-slate-400 pb-0.5 mb-2 font-sans text-[11px]">
                    I. EQUITY AND LIABILITIES
                  </div>
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="border-b border-slate-300 font-sans text-[10px] text-slate-600">
                        <th className="text-left py-1">Particulars</th>
                        <th className="text-center w-14">Note</th>
                        <th className="text-right w-24">31-Mar-2025</th>
                        <th className="text-right w-24">31-Mar-2024</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {/* Net Worth row */}
                      <tr 
                        onClick={() => onSelectField('f-nw')}
                        className={`cursor-pointer transition-all ${
                          selectedFieldId === 'f-nw' ? 'bg-blue-100 font-bold ring-2 ring-blue-500' : 'hover:bg-slate-50'
                        }`}
                      >
                        <td className="py-1.5 font-bold pl-1">Shareholders' Funds (Net Worth)</td>
                        <td className="text-center">1</td>
                        <td className="text-right font-mono font-bold text-blue-900">1,100.00</td>
                        <td className="text-right font-mono">970.00</td>
                      </tr>

                      {/* LTB row */}
                      <tr 
                        onClick={() => onSelectField('f-ltb')}
                        className={`cursor-pointer transition-all ${
                          selectedFieldId === 'f-ltb' ? 'bg-blue-100 font-bold ring-2 ring-blue-500' : 'hover:bg-slate-50'
                        }`}
                      >
                        <td className="py-1.5 pl-3">Long Term Borrowings (Secured Loans)</td>
                        <td className="text-center">3</td>
                        <td className="text-right font-mono font-bold text-blue-900">450.00</td>
                        <td className="text-right font-mono">480.00</td>
                      </tr>

                      {/* STB row */}
                      <tr 
                        onClick={() => onSelectField('f-stb')}
                        className={`cursor-pointer transition-all ${
                          selectedFieldId === 'f-stb' ? 'bg-blue-100 font-bold ring-2 ring-blue-500' : 'hover:bg-slate-50'
                        }`}
                      >
                        <td className="py-1.5 pl-3">Short Term Borrowings (CC/OD Limit)</td>
                        <td className="text-center">4</td>
                        <td className="text-right font-mono font-bold text-blue-900">300.00</td>
                        <td className="text-right font-mono">280.00</td>
                      </tr>

                      {/* Trade Payables (Sundry Creditors) - CRITICAL EXCEPTION ROW */}
                      <tr 
                        onClick={() => onSelectField('f-tp')}
                        className={`cursor-pointer transition-all relative ${
                          selectedFieldId === 'f-tp' 
                            ? 'bg-amber-100 font-bold ring-2 ring-amber-500' 
                            : 'hover:bg-amber-50/60'
                        }`}
                      >
                        <td className="py-1.5 pl-3 flex items-center justify-between">
                          <span>Trade Payables (Sundry Creditors)</span>
                          <span className="text-[9px] bg-rose-100 text-rose-800 font-bold px-1 rounded font-sans">
                            OCR 89% Flag
                          </span>
                        </td>
                        <td className="text-center">6</td>
                        <td className="text-right font-mono font-bold text-rose-700 bg-rose-50/80 px-1 rounded border border-dashed border-rose-300">
                          {fields.find(f => f.id === 'f-tp')?.fy2025 === 405 ? '405.00' : '420.00'}
                        </td>
                        <td className="text-right font-mono">380.00</td>
                      </tr>

                      {/* Other Current Liabilities */}
                      <tr 
                        onClick={() => onSelectField('f-ocl')}
                        className={`cursor-pointer transition-all ${
                          selectedFieldId === 'f-ocl' ? 'bg-blue-100 font-bold ring-2 ring-blue-500' : 'hover:bg-slate-50'
                        }`}
                      >
                        <td className="py-1.5 pl-3">Other Current Liabilities & Provisions</td>
                        <td className="text-center">7</td>
                        <td className="text-right font-mono font-bold text-blue-900">180.00</td>
                        <td className="text-right font-mono">160.00</td>
                      </tr>

                      <tr className="border-t-2 border-slate-900 font-bold bg-slate-50">
                        <td className="py-2 pl-1 font-sans uppercase">TOTAL EQUITY & LIABILITIES</td>
                        <td></td>
                        <td className="text-right font-mono text-sm">
                          {fields.find(f => f.id === 'f-tp')?.fy2025 === 405 ? '2,435.00' : '2,450.00'}
                        </td>
                        <td className="text-right font-mono text-sm">2,270.00</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Assets */}
                <div className="pt-2">
                  <div className="font-bold text-slate-950 uppercase tracking-wide border-b border-slate-400 pb-0.5 mb-2 font-sans text-[11px]">
                    II. ASSETS
                  </div>
                  <table className="w-full text-xs">
                    <tbody className="divide-y divide-slate-100">
                      {/* Fixed Assets */}
                      <tr 
                        onClick={() => onSelectField('f-nfa')}
                        className={`cursor-pointer transition-all ${
                          selectedFieldId === 'f-nfa' ? 'bg-blue-100 font-bold ring-2 ring-blue-500' : 'hover:bg-slate-50'
                        }`}
                      >
                        <td className="py-1.5 pl-1">Fixed Assets (Net Block)</td>
                        <td className="text-center w-14">8</td>
                        <td className="text-right font-mono font-bold text-blue-900 w-24">1,430.00</td>
                        <td className="text-right font-mono w-24">1,350.00</td>
                      </tr>

                      {/* Inventories */}
                      <tr 
                        onClick={() => onSelectField('f-inv')}
                        className={`cursor-pointer transition-all ${
                          selectedFieldId === 'f-inv' ? 'bg-blue-100 font-bold ring-2 ring-blue-500' : 'hover:bg-slate-50'
                        }`}
                      >
                        <td className="py-1.5 pl-3">Inventories (Raw + WIP + FG)</td>
                        <td className="text-center">9</td>
                        <td className="text-right font-mono font-bold text-blue-900">480.00</td>
                        <td className="text-right font-mono">420.00</td>
                      </tr>

                      {/* Trade Receivables */}
                      <tr 
                        onClick={() => onSelectField('f-tr')}
                        className={`cursor-pointer transition-all ${
                          selectedFieldId === 'f-tr' ? 'bg-blue-100 font-bold ring-2 ring-blue-500' : 'hover:bg-slate-50'
                        }`}
                      >
                        <td className="py-1.5 pl-3">Trade Receivables (Sundry Debtors)</td>
                        <td className="text-center">10</td>
                        <td className="text-right font-mono font-bold text-blue-900">450.00</td>
                        <td className="text-right font-mono">410.00</td>
                      </tr>

                      {/* Cash */}
                      <tr 
                        onClick={() => onSelectField('f-cash')}
                        className={`cursor-pointer transition-all ${
                          selectedFieldId === 'f-cash' ? 'bg-blue-100 font-bold ring-2 ring-blue-500' : 'hover:bg-slate-50'
                        }`}
                      >
                        <td className="py-1.5 pl-3">Cash & Cash Equivalents</td>
                        <td className="text-center">11</td>
                        <td className="text-right font-mono font-bold text-blue-900">90.00</td>
                        <td className="text-right font-mono">70.00</td>
                      </tr>

                      <tr className="border-t-2 border-slate-900 font-bold bg-slate-50">
                        <td className="py-2 pl-1 font-sans uppercase">TOTAL ASSETS</td>
                        <td></td>
                        <td className="text-right font-mono text-sm">2,450.00</td>
                        <td className="text-right font-mono text-sm">2,250.00</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Auditor Signature Box */}
                <div className="pt-6 mt-6 border-t border-slate-200 flex justify-between text-[10px] text-slate-500 font-sans">
                  <div>
                    <div>For and on behalf of the Board</div>
                    <div className="font-bold text-slate-800 mt-3">Rajesh Mittal (Managing Director)</div>
                    <div>DIN: 01892345</div>
                  </div>
                  <div className="text-right">
                    <div>As per our report of even date attached</div>
                    <div className="font-bold text-slate-800 mt-3">For B.K. RATHI & CO.</div>
                    <div>Chartered Accountants (FRN: 108922W)</div>
                  </div>
                </div>
              </div>
            ) : isPL ? (
              <div className="mt-4 text-xs space-y-4 font-serif">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-slate-300 font-sans text-[10px] text-slate-600">
                      <th className="text-left py-1">Particulars</th>
                      <th className="text-right w-24">FY2024-25</th>
                      <th className="text-right w-24">FY2023-24</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    <tr 
                      onClick={() => onSelectField('f-rev')}
                      className={`cursor-pointer ${selectedFieldId === 'f-rev' ? 'bg-blue-100 font-bold' : ''}`}
                    >
                      <td className="py-2 font-bold">Revenue from Operations (Gross Turnover)</td>
                      <td className="text-right font-mono font-bold text-blue-900">2,500.00</td>
                      <td className="text-right font-mono">2,100.00</td>
                    </tr>
                    <tr 
                      onClick={() => onSelectField('f-cogs')}
                      className="cursor-pointer"
                    >
                      <td className="py-2 pl-3">Cost of Materials Consumed</td>
                      <td className="text-right font-mono">1,650.00</td>
                      <td className="text-right font-mono">1,390.00</td>
                    </tr>
                    <tr 
                      onClick={() => onSelectField('f-ebitda')}
                      className={`cursor-pointer ${selectedFieldId === 'f-ebitda' ? 'bg-blue-100 font-bold' : ''}`}
                    >
                      <td className="py-2 font-bold pl-1">Operating Profit (EBITDA)</td>
                      <td className="text-right font-mono font-bold text-blue-900">420.00</td>
                      <td className="text-right font-mono">360.00</td>
                    </tr>
                    <tr 
                      onClick={() => onSelectField('f-fin')}
                      className={`cursor-pointer ${selectedFieldId === 'f-fin' ? 'bg-blue-100 font-bold' : ''}`}
                    >
                      <td className="py-2 pl-3">Finance Costs (Bank Interest)</td>
                      <td className="text-right font-mono">75.00</td>
                      <td className="text-right font-mono">72.00</td>
                    </tr>
                    <tr 
                      onClick={() => onSelectField('f-pat')}
                      className={`cursor-pointer ${selectedFieldId === 'f-pat' ? 'bg-blue-100 font-bold' : ''}`}
                    >
                      <td className="py-2 font-bold pl-1">Profit After Tax (PAT)</td>
                      <td className="text-right font-mono font-bold text-blue-900">220.00</td>
                      <td className="text-right font-mono">180.00</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="mt-4 text-xs space-y-4 font-mono">
                <div className="p-3 bg-slate-50 border rounded text-xs space-y-2">
                  <div className="font-bold text-slate-800">12-Month Banking Summary (HDFC Current A/c 50200012345678)</div>
                  <div>Total Inward Clearing Credits: ₹21,00,42,118.00 (₹21.00 Cr)</div>
                  <div>Total Outward Debits: ₹20,85,12,000.00</div>
                  <div>Average Monthly Balance (AMB): ₹48.50 Lakhs</div>
                  <div>Total Inward Cheque Bounces: 0</div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right: Linked Field Inspector & Evidence Drawer */}
        <div className="w-80 bg-slate-950 border-l border-slate-800 p-4 flex flex-col justify-between flex-shrink-0 text-xs text-slate-300">
          <div className="space-y-4">
            <div className="pb-2 border-b border-slate-800 flex items-center justify-between">
              <span className="font-bold text-white uppercase text-[11px] tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                Source ↔ Field Link
              </span>
              {selectedField && (
                <span className={`text-[10px] px-1.5 py-0.2 rounded font-bold ${
                  selectedField.confidence >= 95 
                    ? 'bg-emerald-500/20 text-emerald-300' 
                    : 'bg-rose-500/20 text-rose-300'
                }`}>
                  {selectedField.confidence}% Conf
                </span>
              )}
            </div>

            {selectedField ? (
              <div className="space-y-3.5">
                <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 space-y-1">
                  <div className="text-[10px] uppercase font-bold text-slate-400">Standard Field</div>
                  <div className="font-bold text-sm text-white">{selectedField.standardField}</div>
                  <div className="text-[11px] text-slate-400">Original: "{selectedField.originalLabel}"</div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="p-2.5 bg-slate-900 rounded-lg border border-slate-800">
                    <span className="text-[10px] text-slate-400 uppercase">Extracted FY25</span>
                    <div className="text-base font-bold text-white mt-0.5">₹{selectedField.fy2025} L</div>
                  </div>

                  <div className="p-2.5 bg-slate-900 rounded-lg border border-slate-800">
                    <span className="text-[10px] text-slate-400 uppercase">Prior FY24</span>
                    <div className="text-base font-bold text-slate-400 mt-0.5">₹{selectedField.fy2024} L</div>
                  </div>
                </div>

                <div className="space-y-1.5 pt-1">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-slate-400">OCR Confidence:</span>
                    <span className="font-mono text-white">{selectedField.ocrConfidence}%</span>
                  </div>
                  <div className="flex justify-between text-[11px]">
                    <span className="text-slate-400">CoA Mapping Confidence:</span>
                    <span className="font-mono text-white">{selectedField.mappingConfidence}%</span>
                  </div>
                  <div className="flex justify-between text-[11px]">
                    <span className="text-slate-400">Extraction Engine:</span>
                    <span className="text-blue-400">{selectedField.extractionMethod}</span>
                  </div>
                  <div className="flex justify-between text-[11px]">
                    <span className="text-slate-400">Source Page Citation:</span>
                    <span className="text-slate-200">Page {selectedField.pageNumber}, Row Schedule</span>
                  </div>
                </div>

                {selectedField.flagReason && (
                  <div className="p-2.5 bg-rose-950/40 border border-rose-800/60 rounded-lg text-rose-300 text-xs space-y-1">
                    <div className="font-bold flex items-center gap-1 text-[11px]">
                      <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                      Flagged for Human Review
                    </div>
                    <p className="text-[11px] leading-relaxed text-rose-200">
                      {selectedField.flagReason}
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="py-8 text-center text-slate-500 space-y-2">
                <Layers className="w-8 h-8 mx-auto text-slate-700" />
                <p className="text-xs">Click any financial line item on the statement to inspect extraction evidence and bounding coordinates.</p>
              </div>
            )}
          </div>

          {selectedField && onOpenFieldDrawer && (
            <button
              onClick={() => onOpenFieldDrawer(selectedField.id)}
              className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold text-xs shadow-sm transition-colors flex items-center justify-center gap-1.5"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Open Field Action Drawer</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
