import React, { useState } from 'react';
import { 
  FileText, 
  UploadCloud, 
  CheckCircle, 
  AlertTriangle, 
  Sparkles, 
  Search, 
  Filter, 
  Eye, 
  ExternalLink,
  ShieldCheck,
  Clock
} from '../icons/Icons';
import { BorrowerDocument, DocumentType } from '../../types';

interface DocumentCenterProps {
  documents: BorrowerDocument[];
  selectedDocId: string;
  onSelectDoc: (docId: string) => void;
  onOpenViewer: (docId: string) => void;
  onSimulateUpload: (docName?: string) => void;
  isUploading: boolean;
  uploadStepName: string;
}

export const DocumentCenter: React.FC<DocumentCenterProps> = ({
  documents,
  selectedDocId,
  onSelectDoc,
  onOpenViewer,
  onSimulateUpload,
  isUploading,
  uploadStepName
}) => {
  const [filterType, setFilterType] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showUploadModal, setShowUploadModal] = useState<boolean>(false);

  const filteredDocs = documents.filter(doc => {
    const matchesFilter = filterType === 'ALL' || doc.type === filterType;
    const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          doc.subtype.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          doc.financialYear.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const selectedDoc = documents.find(d => d.id === selectedDocId) || documents[0];

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Top Header & Intake action */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-600" />
            Borrower Document Center
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            DMS intake repository, OCR pre-flight validation status, and AI classification evidence.
          </p>
        </div>

        <button
          onClick={() => setShowUploadModal(true)}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg shadow-sm flex items-center gap-2 transition-all hover:shadow"
        >
          <UploadCloud className="w-4 h-4" />
          <span>+ Upload Financial Document</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search document name, FY, or statement type..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full text-xs text-slate-700 placeholder-slate-400 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-400 font-medium">Filter Type:</span>
          {['ALL', 'Balance Sheet', 'P&L Statement', 'Bank Statement', 'GST Return'].map(type => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                filterType === type 
                  ? 'bg-blue-600 text-white font-semibold' 
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* 2-Column Split: Document Grid / List & Classification Evidence Drawer */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Document Table */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider">
              Document Inventory ({filteredDocs.length})
            </h3>
            <span className="text-[11px] text-slate-500">Click any document to inspect classification</span>
          </div>

          <div className="divide-y divide-slate-100">
            {filteredDocs.map(doc => {
              const isSelected = doc.id === selectedDoc.id;

              return (
                <div
                  key={doc.id}
                  onClick={() => onSelectDoc(doc.id)}
                  className={`p-4 flex items-center justify-between gap-4 transition-all cursor-pointer ${
                    isSelected ? 'bg-blue-50/60 border-l-4 border-blue-600' : 'hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs flex-shrink-0 ${
                      isSelected ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700'
                    }`}>
                      PDF
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-slate-900 truncate">{doc.name}</span>
                        {doc.audited && (
                          <span className="px-1.5 py-0.2 bg-emerald-50 text-emerald-700 text-[10px] font-semibold rounded border border-emerald-200">
                            Audited
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-2">
                        <span>{doc.financialYear}</span>
                        <span>·</span>
                        <span>{doc.fileSize}</span>
                        <span>·</span>
                        <span>{doc.pageCount} Pages</span>
                        <span>·</span>
                        <span className="font-mono text-slate-400">SLA: {doc.processingTimeSec}s</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 flex-shrink-0">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      doc.status === 'Processed' || doc.status === 'Approved'
                        ? 'bg-emerald-100 text-emerald-800'
                        : doc.status === 'Warning'
                          ? 'bg-amber-100 text-amber-800'
                          : doc.status === 'Exception'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-blue-100 text-blue-800'
                    }`}>
                      {doc.status}
                    </span>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenViewer(doc.id);
                      }}
                      className="px-2.5 py-1.5 bg-slate-100 hover:bg-blue-600 hover:text-white text-slate-700 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>View</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right 1 Col: AI Document Classification & Evidence */}
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4 sticky top-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-blue-600" />
                AI Classification Intelligence
              </h3>
              <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 text-[10px] font-bold rounded-full border border-emerald-200">
                {selectedDoc.confidence}% Match
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400">Selected Document</span>
                <div className="font-bold text-slate-900 mt-0.5">{selectedDoc.name}</div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                  <span className="text-[10px] text-slate-400 font-semibold uppercase">Document Type</span>
                  <div className="font-bold text-slate-800 mt-0.5">{selectedDoc.type}</div>
                </div>

                <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                  <span className="text-[10px] text-slate-400 font-semibold uppercase">Financial Year</span>
                  <div className="font-bold text-slate-800 mt-0.5">{selectedDoc.financialYear}</div>
                </div>

                <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                  <span className="text-[10px] text-slate-400 font-semibold uppercase">Entity Name</span>
                  <div className="font-bold text-slate-800 mt-0.5">ABC Mfg Pvt Ltd</div>
                </div>

                <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                  <span className="text-[10px] text-slate-400 font-semibold uppercase">Reported Currency/Unit</span>
                  <div className="font-bold text-slate-800 mt-0.5">{selectedDoc.currency} · {selectedDoc.reportedUnit}</div>
                </div>
              </div>

              {/* AI Classification Evidence Text */}
              <div className="p-3.5 bg-blue-50/70 border border-blue-100 rounded-xl space-y-1">
                <div className="text-[11px] font-bold text-blue-900 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                  AI Classification Evidence
                </div>
                <p className="text-xs text-blue-950 leading-relaxed">
                  "{selectedDoc.aiClassificationEvidence}"
                </p>
                <div className="text-[10px] text-blue-700/80 pt-1 font-mono">
                  Engine: AWS Textract + Bedrock Claude 3.5 Sonnet
                </div>
              </div>

              <button
                onClick={() => onOpenViewer(selectedDoc.id)}
                className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold shadow-sm transition-colors flex items-center justify-center gap-2"
              >
                <Eye className="w-4 h-4" />
                <span>Open in Document Intelligence Viewer</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <UploadCloud className="w-4 h-4 text-blue-600" />
                Upload Borrower Financial Document
              </h3>
              <button 
                onClick={() => setShowUploadModal(false)}
                className="text-slate-400 hover:text-slate-600 text-lg font-bold"
              >
                ×
              </button>
            </div>

            {isUploading ? (
              <div className="py-8 text-center space-y-4">
                <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
                <div>
                  <h4 className="text-sm font-bold text-slate-800">Processing Intake Pipeline</h4>
                  <p className="text-xs text-blue-600 font-medium mt-1 animate-pulse">{uploadStepName}</p>
                </div>
                <div className="max-w-xs mx-auto text-[11px] text-slate-400">
                  Executing pre-flight validation, OCR extraction, and Chart of Accounts normalization.
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="border-2 border-dashed border-slate-200 hover:border-blue-500 rounded-xl p-6 text-center space-y-3 bg-slate-50/50 cursor-pointer transition-colors">
                  <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto">
                    <UploadCloud className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-800">Drag and drop financial document PDF</div>
                    <div className="text-[11px] text-slate-400 mt-0.5">Supports scanned PDFs, balance sheets, P&L, bank statements up to 50MB</div>
                  </div>
                </div>

                <div className="space-y-2">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Quick Demo Document Staging:</span>
                  <div className="space-y-1.5">
                    <button
                      onClick={() => {
                        onSimulateUpload('Provisional Financials FY2025.pdf');
                        setShowUploadModal(false);
                      }}
                      className="w-full text-left p-2.5 bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-300 rounded-lg text-xs flex items-center justify-between transition-colors"
                    >
                      <span className="font-semibold text-slate-700">Provisional Financials FY2025.pdf (Management Certified)</span>
                      <span className="text-[10px] bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded font-bold">Simulate Intake</span>
                    </button>

                    <button
                      onClick={() => {
                        onSimulateUpload('Notes to Accounts & Contingent Liabilities.pdf');
                        setShowUploadModal(false);
                      }}
                      className="w-full text-left p-2.5 bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-300 rounded-lg text-xs flex items-center justify-between transition-colors"
                    >
                      <span className="font-semibold text-slate-700">Notes to Accounts & Auditor Report.pdf</span>
                      <span className="text-[10px] bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded font-bold">Simulate Intake</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
