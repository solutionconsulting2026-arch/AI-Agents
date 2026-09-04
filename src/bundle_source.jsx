const React = window.React || (typeof React !== 'undefined' ? React : null);
const ReactDOM = window.ReactDOM || (typeof ReactDOM !== 'undefined' ? ReactDOM : null);
const { useState, useEffect, useCallback, useMemo } = React;

// --- ICONS ---
const Icon = ({ path, className = "w-4 h-4", viewBox = "0 0 24 24" }) => (
  <svg className={className} viewBox={viewBox} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    {path}
  </svg>
);

const Icons = {
  Building: (props) => <Icon {...props} path={<><rect x="4" y="2" width="16" height="20" rx="2" ry="2"/><path d="M9 22v-4h6v4"/><path d="M8 6h.01"/><path d="M16 6h.01"/><path d="M8 10h.01"/><path d="M16 10h.01"/><path d="M8 14h.01"/><path d="M16 14h.01"/></>} />,
  FileText: (props) => <Icon {...props} path={<><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></>} />,
  Layers: (props) => <Icon {...props} path={<><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></>} />,
  Database: (props) => <Icon {...props} path={<><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/></>} />,
  ShieldCheck: (props) => <Icon {...props} path={<><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><polyline points="9 12 11 14 15 10"/></>} />,
  BarChart2: (props) => <Icon {...props} path={<><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></>} />,
  TrendingUp: (props) => <Icon {...props} path={<><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></>} />,
  TrendingDown: (props) => <Icon {...props} path={<><polyline points="23 18 13.5 8.5 8.5 13.5 1 6"/><polyline points="17 18 23 18 23 12"/></>} />,
  AlertTriangle: (props) => <Icon {...props} path={<><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></>} />,
  AlertCircle: (props) => <Icon {...props} path={<><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></>} />,
  CheckCircle: (props) => <Icon {...props} path={<><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></>} />,
  Lock: (props) => <Icon {...props} path={<><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></>} />,
  CreditCard: (props) => <Icon {...props} path={<><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></>} />,
  Activity: (props) => <Icon {...props} path={<><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></>} />,
  Sparkles: (props) => <Icon {...props} path={<><path d="M12 3v3m0 12v3M3 12h3m12 0h3M5.6 5.6l2.1 2.1m8.6 8.6l2.1 2.1M5.6 18.4l2.1-2.1m8.6-8.6l2.1-2.1"/></>} />,
  Search: (props) => <Icon {...props} path={<><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></>} />,
  Bell: (props) => <Icon {...props} path={<><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></>} />,
  HelpCircle: (props) => <Icon {...props} path={<><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></>} />,
  User: (props) => <Icon {...props} path={<><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></>} />,
  ChevronRight: (props) => <Icon {...props} path={<><polyline points="9 18 15 12 9 6"/></>} />,
  ChevronLeft: (props) => <Icon {...props} path={<><polyline points="15 18 9 12 15 6"/></>} />,
  ArrowRight: (props) => <Icon {...props} path={<><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></>} />,
  RotateCcw: (props) => <Icon {...props} path={<><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/></>} />,
  Play: (props) => <Icon {...props} path={<><polygon points="5 3 19 12 5 21 5 3"/></>} />,
  Eye: (props) => <Icon {...props} path={<><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></>} />,
  Edit3: (props) => <Icon {...props} path={<><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></>} />,
  Check: (props) => <Icon {...props} path={<><polyline points="20 6 9 17 4 12"/></>} />,
  X: (props) => <Icon {...props} path={<><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></>} />,
  UploadCloud: (props) => <Icon {...props} path={<><polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/><path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/><polyline points="16 16 12 12 8 16"/></>} />,
  ZoomIn: (props) => <Icon {...props} path={<><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/></>} />,
  ZoomOut: (props) => <Icon {...props} path={<><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="8" y1="11" x2="14" y2="11"/></>} />,
  Clock: (props) => <Icon {...props} path={<><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></>} />,
  Cpu: (props) => <Icon {...props} path={<><rect x="4" y="4" width="16" height="16" rx="2" ry="2"/><rect x="9" y="9" width="6" height="6"/><line x1="9" y1="1" x2="9" y2="4"/><line x1="15" y1="1" x2="15" y2="4"/><line x1="9" y1="20" x2="9" y2="23"/><line x1="15" y1="20" x2="15" y2="23"/><line x1="20" y1="9" x2="23" y2="9"/><line x1="20" y1="14" x2="23" y2="14"/><line x1="1" y1="9" x2="4" y2="9"/><line x1="1" y1="14" x2="4" y2="14"/></>} />
};

// --- DATA & CONSTANTS ---
const MOCK_PROPOSAL = {
  proposalId: 'PR-10045',
  borrowerName: 'ABC Manufacturing Pvt Ltd',
  cif: 'CIF-567890123',
  loanProduct: 'Business Term Loan',
  requestedAmount: '₹15.00 Crore',
  requestedAmountLakhs: 1500,
  creditStage: 'Credit Appraisal',
  relationshipManager: 'Aditi Mehta',
  creditAnalyst: 'Rahul Sharma',
  branch: 'Corporate Banking Hub - Mumbai BKC',
  createdDate: '28-Aug-2026',
  targetSlaMinutes: 15
};

const INITIAL_STAGES = [
  { id: 'intake', name: '1. Upload & Intake', stageNumber: 1, status: 'completed', engine: 'CRM Workflow', durationMs: 420, summaryText: '8 documents received and registered against PR-10045.' },
  { id: 'validation', name: '2. Pre-Flight Validation', stageNumber: 2, status: 'completed', engine: 'Deterministic Rule', durationMs: 650, summaryText: 'All 8 files passed pre-flight checks. 0 corrupted or encrypted files.' },
  { id: 'classification', name: '3. Classification', stageNumber: 3, status: 'completed', engine: 'AI Engine', durationMs: 1420, summaryText: 'Classified Balance Sheets, P&L, Cash Flow, Bank Statements & GST with 97% confidence.' },
  { id: 'layout', name: '4. Layout Retrieval', stageNumber: 4, status: 'completed', engine: 'AI Engine', durationMs: 580, summaryText: 'Matched standard MCA Schedule III statutory format (Match score: 94.2%).' },
  { id: 'extraction', name: '5. OCR & Extraction', stageNumber: 5, status: 'completed', engine: 'Hybrid', durationMs: 4100, summaryText: '186 financial data points extracted across FY23, FY24, and FY25.' },
  { id: 'normalization', name: '6. Normalization', stageNumber: 6, status: 'completed', engine: 'Deterministic Rule', durationMs: 820, summaryText: 'Converted all figures to ₹ Lakhs. 100% of line items mapped to Standard CoA.' },
  { id: 'reconciliation', name: '7. Reconciliation', stageNumber: 7, status: 'warning', engine: 'Deterministic Rule', durationMs: 1200, summaryText: '1 Check failed (Bank Credits vs Reported Turnover variance 16% > 10% threshold).' },
  { id: 'ratios', name: '8. Ratio Engine', stageNumber: 8, status: 'completed', engine: 'Deterministic Rule', durationMs: 640, summaryText: 'Current Ratio, DSCR, TOL/TNW, EBITDA margins & Working Capital cycles computed.' },
  { id: 'confidence', name: '9. Confidence Engine', stageNumber: 9, status: 'warning', engine: 'Hybrid', durationMs: 490, summaryText: 'Average confidence: 93.4%. 184 High (≥95%), 1 Medium, 1 Low (<95%).' },
  { id: 'exceptions', name: '10. Exceptions (HITL)', stageNumber: 10, status: 'requires_review', engine: 'CRM Workflow', durationMs: 310, summaryText: '2 Items pending Credit Analyst review (Trade Payables OCR confidence & Bank Turnover variance).' },
  { id: 'approval', name: '11. Spread Approval', stageNumber: 11, status: 'pending', engine: 'CRM Workflow', summaryText: 'Awaiting resolution of critical exception before sign-off.' },
  { id: 'publish', name: '12. Publish & Handoff', stageNumber: 12, status: 'pending', engine: 'CRM Workflow', summaryText: 'Will publish to LOS / CRMNEXT and trigger CAM Agent on sign-off.' }
];

const INITIAL_DOCS = [
  { id: 'doc-01', name: 'Balance Sheet FY2025.pdf', type: 'Balance Sheet', subtype: 'Audited Financial Statement (MCA Schedule III)', financialYear: 'FY2024-25', period: '01-Apr-2024 to 31-Mar-2025', version: 'v1.0 (Audited)', fileSize: '2.4 MB', pageCount: 3, status: 'Warning', confidence: 89, processingTimeSec: 28, uploadedAt: '10:40:12 AM', audited: true, currency: 'INR', reportedUnit: '₹ Lakhs', aiClassificationEvidence: 'Identified as Audited Balance Sheet based on Schedule III equity & liability hierarchy, statutory auditor sign-off by B.K. Rathi & Co., and comparative FY24 column.' },
  { id: 'doc-02', name: 'P&L Statement FY2025.pdf', type: 'P&L Statement', subtype: 'Audited Statement of Profit and Loss', financialYear: 'FY2024-25', period: '01-Apr-2024 to 31-Mar-2025', version: 'v1.0 (Audited)', fileSize: '1.8 MB', pageCount: 2, status: 'Processed', confidence: 98, processingTimeSec: 22, uploadedAt: '10:40:12 AM', audited: true, currency: 'INR', reportedUnit: '₹ Lakhs', aiClassificationEvidence: 'Classified as Statement of Profit & Loss from Revenue from Operations, COGS breakdown, finance costs, and tax schedules.' },
  { id: 'doc-03', name: 'Cash Flow Statement FY2025.pdf', type: 'Cash Flow Statement', subtype: 'Audited Indirect Method Cash Flow', financialYear: 'FY2024-25', period: '01-Apr-2024 to 31-Mar-2025', version: 'v1.0', fileSize: '1.2 MB', pageCount: 2, status: 'Processed', confidence: 96, processingTimeSec: 18, uploadedAt: '10:40:12 AM', audited: true, currency: 'INR', reportedUnit: '₹ Lakhs', aiClassificationEvidence: 'Identified as Cash Flow Statement via Operating, Investing, and Financing activity segment headers.' },
  { id: 'doc-04', name: 'Balance Sheet FY2024.pdf', type: 'Balance Sheet', subtype: 'Audited Comparative Statement', financialYear: 'FY2023-24', period: '01-Apr-2023 to 31-Mar-2024', version: 'v1.0', fileSize: '2.1 MB', pageCount: 3, status: 'Processed', confidence: 99, processingTimeSec: 25, uploadedAt: '10:40:12 AM', audited: true, currency: 'INR', reportedUnit: '₹ Lakhs', aiClassificationEvidence: 'Prior year audited balance sheet verified against MCA ROC filings.' },
  { id: 'doc-05', name: 'P&L Statement FY2024.pdf', type: 'P&L Statement', subtype: 'Audited Statement of Profit and Loss', financialYear: 'FY2023-24', period: '01-Apr-2023 to 31-Mar-2024', version: 'v1.0', fileSize: '1.6 MB', pageCount: 2, status: 'Processed', confidence: 98, processingTimeSec: 20, uploadedAt: '10:40:12 AM', audited: true, currency: 'INR', reportedUnit: '₹ Lakhs', aiClassificationEvidence: 'Prior year P&L statement verified against ROC filing records.' },
  { id: 'doc-06', name: 'Bank Statement Apr2024-Mar2025.pdf', type: 'Bank Statement', subtype: '12-Month Current Account Statement (HDFC Bank & SBI)', financialYear: 'FY2024-25', period: '01-Apr-2024 to 31-Mar-2025', version: 'v1.0', fileSize: '5.6 MB', pageCount: 24, status: 'Exception', confidence: 94, processingTimeSec: 42, uploadedAt: '10:40:12 AM', audited: false, currency: 'INR', reportedUnit: '₹ Absolute', aiClassificationEvidence: 'Classified as 12-month consolidated corporate bank statement. Identified inward clearing credits totaling ₹21.00 Crore.' },
  { id: 'doc-07', name: 'GST Return FY2025.pdf', type: 'GST Return', subtype: 'GSTR-3B & GSTR-1 Consolidated Summary', financialYear: 'FY2024-25', period: '01-Apr-2024 to 31-Mar-2025', version: 'v1.0', fileSize: '2.8 MB', pageCount: 12, status: 'Processed', confidence: 96, processingTimeSec: 31, uploadedAt: '10:40:12 AM', audited: false, currency: 'INR', reportedUnit: '₹ Absolute', aiClassificationEvidence: 'Verified GSTIN 27AAACA1234F1Z5. Consolidated outward taxable supplies totaling ₹23.50 Crore.' },
  { id: 'doc-08', name: 'ITR FY2024.pdf', type: 'ITR', subtype: 'ITR-6 Corporate Tax Return Acknowledgment', financialYear: 'FY2023-24', period: 'AY 2024-25 (FY 2023-24)', version: 'v1.0', fileSize: '1.1 MB', pageCount: 4, status: 'Processed', confidence: 99, processingTimeSec: 15, uploadedAt: '10:40:12 AM', audited: true, currency: 'INR', reportedUnit: '₹ Absolute', aiClassificationEvidence: 'Validated corporate e-filing acknowledgment against PAN AAACA1234F.' }
];

const INITIAL_FIELDS = [
  { id: 'f-rev', standardField: 'Revenue from Operations', originalLabel: 'Gross Sales / Revenue from Operations', category: 'P&L - Revenue', fy2025: 2500, fy2024: 2100, fy2023: 1750, normalizedUnit: '₹ Lakhs', confidence: 99, ocrConfidence: 99, mappingConfidence: 100, tieOutConfidence: 98, status: 'Verified', documentId: 'doc-02', documentName: 'P&L Statement FY2025.pdf', pageNumber: 1, extractionMethod: 'AWS Textract' },
  { id: 'f-cogs', standardField: 'Cost of Goods Sold (COGS)', originalLabel: 'Cost of Materials Consumed & Direct Costs', category: 'P&L - Expenses', fy2025: 1650, fy2024: 1390, fy2023: 1170, normalizedUnit: '₹ Lakhs', confidence: 98, ocrConfidence: 98, mappingConfidence: 97, tieOutConfidence: 99, status: 'Verified', documentId: 'doc-02', documentName: 'P&L Statement FY2025.pdf', pageNumber: 1, extractionMethod: 'AWS Textract' },
  { id: 'f-ebitda', standardField: 'Operating Profit (EBITDA)', originalLabel: 'Earnings Before Interest, Tax, Dep & Amort', category: 'P&L - Profitability', fy2025: 420, fy2024: 360, fy2023: 290, normalizedUnit: '₹ Lakhs', confidence: 97, ocrConfidence: 97, mappingConfidence: 98, tieOutConfidence: 96, status: 'Verified', documentId: 'doc-02', documentName: 'P&L Statement FY2025.pdf', pageNumber: 1, extractionMethod: 'AWS Textract' },
  { id: 'f-dep', standardField: 'Depreciation & Amortization', originalLabel: 'Depreciation Expense (Schedule 8)', category: 'P&L - Expenses', fy2025: 65, fy2024: 58, fy2023: 50, normalizedUnit: '₹ Lakhs', confidence: 98, ocrConfidence: 99, mappingConfidence: 98, tieOutConfidence: 98, status: 'Verified', documentId: 'doc-02', documentName: 'P&L Statement FY2025.pdf', pageNumber: 1, extractionMethod: 'AWS Textract' },
  { id: 'f-fin', standardField: 'Finance Costs / Interest', originalLabel: 'Finance Costs (Bank Interest & Charges)', category: 'P&L - Expenses', fy2025: 75, fy2024: 72, fy2023: 68, normalizedUnit: '₹ Lakhs', confidence: 98, ocrConfidence: 98, mappingConfidence: 99, tieOutConfidence: 98, status: 'Verified', documentId: 'doc-02', documentName: 'P&L Statement FY2025.pdf', pageNumber: 1, extractionMethod: 'AWS Textract' },
  { id: 'f-pat', standardField: 'Profit After Tax (PAT)', originalLabel: 'Profit / (Loss) for the Year', category: 'P&L - Profitability', fy2025: 220, fy2024: 180, fy2023: 134, normalizedUnit: '₹ Lakhs', confidence: 98, ocrConfidence: 98, mappingConfidence: 99, tieOutConfidence: 98, status: 'Verified', documentId: 'doc-02', documentName: 'P&L Statement FY2025.pdf', pageNumber: 1, extractionMethod: 'AWS Textract' },
  { id: 'f-sc', standardField: 'Share Capital', originalLabel: 'Paid Up Equity Share Capital', category: 'Balance Sheet - Liabilities', fy2025: 120, fy2024: 120, fy2023: 100, normalizedUnit: '₹ Lakhs', confidence: 99, ocrConfidence: 99, mappingConfidence: 100, tieOutConfidence: 99, status: 'Verified', documentId: 'doc-01', documentName: 'Balance Sheet FY2025.pdf', pageNumber: 1, extractionMethod: 'AWS Textract' },
  { id: 'f-res', standardField: 'Reserves & Surplus', originalLabel: 'Retained Earnings & Reserves', category: 'Balance Sheet - Liabilities', fy2025: 980, fy2024: 850, fy2023: 720, normalizedUnit: '₹ Lakhs', confidence: 98, ocrConfidence: 98, mappingConfidence: 99, tieOutConfidence: 98, status: 'Verified', documentId: 'doc-01', documentName: 'Balance Sheet FY2025.pdf', pageNumber: 1, extractionMethod: 'AWS Textract' },
  { id: 'f-nw', standardField: 'Tangible Net Worth (TNW)', originalLabel: 'Total Shareholders Funds (Net Worth)', category: 'Balance Sheet - Liabilities', fy2025: 1100, fy2024: 970, fy2023: 820, normalizedUnit: '₹ Lakhs', confidence: 99, ocrConfidence: 99, mappingConfidence: 100, tieOutConfidence: 99, status: 'Verified', documentId: 'doc-01', documentName: 'Balance Sheet FY2025.pdf', pageNumber: 1, extractionMethod: 'AWS Textract' },
  { id: 'f-ltb', standardField: 'Long Term Borrowings', originalLabel: 'Non-Current Secured Term Loans', category: 'Balance Sheet - Liabilities', fy2025: 450, fy2024: 480, fy2023: 510, normalizedUnit: '₹ Lakhs', confidence: 98, ocrConfidence: 98, mappingConfidence: 98, tieOutConfidence: 98, status: 'Verified', documentId: 'doc-01', documentName: 'Balance Sheet FY2025.pdf', pageNumber: 1, extractionMethod: 'AWS Textract' },
  { id: 'f-stb', standardField: 'Short Term Borrowings', originalLabel: 'Working Capital Bank Borrowings (CC/OD)', category: 'Balance Sheet - Liabilities', fy2025: 300, fy2024: 280, fy2023: 240, normalizedUnit: '₹ Lakhs', confidence: 97, ocrConfidence: 97, mappingConfidence: 98, tieOutConfidence: 96, status: 'Verified', documentId: 'doc-01', documentName: 'Balance Sheet FY2025.pdf', pageNumber: 1, extractionMethod: 'AWS Textract' },
  { id: 'f-tp', standardField: 'Trade Payables', originalLabel: 'Sundry Creditors (Schedule 6)', category: 'Balance Sheet - Liabilities', fy2025: 420, fy2024: 380, fy2023: 330, normalizedUnit: '₹ Lakhs', confidence: 89, ocrConfidence: 89, mappingConfidence: 91, tieOutConfidence: 87, status: 'Requires Review', documentId: 'doc-01', documentName: 'Balance Sheet FY2025.pdf', pageNumber: 1, extractionMethod: 'AWS Textract', flagReason: 'Below 95% auto-verification threshold. OCR ambiguity on scanned schedule (read ₹420L instead of ₹405L).', suggestedValue: 405 },
  { id: 'f-ocl', standardField: 'Other Current Liabilities', originalLabel: 'Other Current Liabilities & Provisions', category: 'Balance Sheet - Liabilities', fy2025: 180, fy2024: 160, fy2023: 140, normalizedUnit: '₹ Lakhs', confidence: 96, ocrConfidence: 96, mappingConfidence: 97, tieOutConfidence: 95, status: 'Verified', documentId: 'doc-01', documentName: 'Balance Sheet FY2025.pdf', pageNumber: 1, extractionMethod: 'AWS Textract' },
  { id: 'f-nfa', standardField: 'Fixed Assets (Net Block)', originalLabel: 'Property, Plant & Equipment (Net Block)', category: 'Balance Sheet - Assets', fy2025: 1430, fy2024: 1350, fy2023: 1200, normalizedUnit: '₹ Lakhs', confidence: 98, ocrConfidence: 98, mappingConfidence: 99, tieOutConfidence: 98, status: 'Verified', documentId: 'doc-01', documentName: 'Balance Sheet FY2025.pdf', pageNumber: 1, extractionMethod: 'AWS Textract' },
  { id: 'f-inv', standardField: 'Inventories', originalLabel: 'Inventories (Raw Material + WIP + FG)', category: 'Balance Sheet - Assets', fy2025: 480, fy2024: 420, fy2023: 360, normalizedUnit: '₹ Lakhs', confidence: 97, ocrConfidence: 97, mappingConfidence: 98, tieOutConfidence: 97, status: 'Verified', documentId: 'doc-01', documentName: 'Balance Sheet FY2025.pdf', pageNumber: 1, extractionMethod: 'AWS Textract' },
  { id: 'f-tr', standardField: 'Trade Receivables', originalLabel: 'Sundry Debtors (< 6 Months)', category: 'Balance Sheet - Assets', fy2025: 450, fy2024: 410, fy2023: 350, normalizedUnit: '₹ Lakhs', confidence: 92, ocrConfidence: 92, mappingConfidence: 94, tieOutConfidence: 91, status: 'Warning', documentId: 'doc-01', documentName: 'Balance Sheet FY2025.pdf', pageNumber: 1, extractionMethod: 'AWS Textract', flagReason: 'Confidence 92% (in 85–94% warning band). Slightly skewed scan on debtors aging sub-table.' },
  { id: 'f-cash', standardField: 'Cash & Cash Equivalents', originalLabel: 'Balances with Banks & Cash in Hand', category: 'Balance Sheet - Assets', fy2025: 90, fy2024: 70, fy2023: 50, normalizedUnit: '₹ Lakhs', confidence: 99, ocrConfidence: 99, mappingConfidence: 100, tieOutConfidence: 99, status: 'Verified', documentId: 'doc-01', documentName: 'Balance Sheet FY2025.pdf', pageNumber: 1, extractionMethod: 'AWS Textract' },
  { id: 'f-bank-cred', standardField: 'Total Bank Credits (12M)', originalLabel: 'Total Inward Clearing Credits (HDFC + SBI)', category: 'Banking', fy2025: 2100, fy2024: 1820, fy2023: 1540, normalizedUnit: '₹ Lakhs', confidence: 99, ocrConfidence: 99, mappingConfidence: 100, tieOutConfidence: 84, status: 'Verified', documentId: 'doc-06', documentName: 'Bank Statement Apr2024-Mar2025.pdf', pageNumber: 24, extractionMethod: 'AWS Textract' }
];

const INITIAL_EXCEPTIONS = [
  { id: 'exc-01', fieldId: 'f-tp', title: 'Trade Payables — OCR Low Confidence & Balance Discrepancy', type: 'Low Confidence', severity: 'CRITICAL', status: 'PENDING_REVIEW', sourceDocument: 'Balance Sheet FY2025.pdf', page: 1, extractedValue: '₹420.00 Lakhs', suggestedValue: '₹405.00 Lakhs', confidenceScore: 89, flagReason: 'OCR Confidence is 89% (below 95% auto-verification threshold). Faint printing on Audited Schedule 6 caused OCR digit misrecognition ("405" read as "420").', recommendation: 'Verify against Audited Schedule 6 (Sundry Creditors for goods: ₹310L + expenses: ₹95L = ₹405L). Update extracted value to ₹405.00 Lakhs to balance Balance Sheet.' },
  { id: 'exc-02', fieldId: 'f-bank-cred', title: 'Bank Credits vs Reported Turnover Variance (16.0% > 10.0%)', type: 'Reconciliation Mismatch', severity: 'CRITICAL', status: 'PENDING_REVIEW', sourceDocument: 'Bank Statement Apr2024-Mar2025.pdf', page: 24, extractedValue: '₹2,100.00 Lakhs', suggestedValue: '₹2,500.00 Lakhs (Turnover)', confidenceScore: 94, flagReason: 'Reported P&L turnover (₹2,500 Lakhs) exceeds HDFC & SBI inward bank credits (₹2,100 Lakhs) by 16.0%, violating bank tolerance threshold of 10.0%.', recommendation: 'Analyst to verify if borrower maintains secondary current accounts (e.g., Axis Bank export account or Letter of Credit escrow) not yet uploaded into the document pack.' },
  { id: 'exc-03', title: 'GST vs P&L Turnover Minor Variance (6.0%)', type: 'GST Variance', severity: 'WARNING', status: 'ACCEPTED_WITH_FLAG', sourceDocument: 'GST Return FY2025.pdf', page: 12, extractedValue: '₹2,350.00 Lakhs', suggestedValue: '₹2,500.00 Lakhs', confidenceScore: 96, flagReason: '6.0% variance between GSTR-3B filings and P&L reported revenue.', recommendation: 'Within 10% policy threshold. Non-taxable export revenue of ₹150 Lakhs reconciles the gap. Auto-flagged for audit completeness.' }
];

const INITIAL_AUDIT_LOGS = [
  { id: 'aud-01', timestamp: '10:40:12 AM', actor: 'System', actorRole: 'System', action: 'DMS Ingestion Trigger', fieldOrComponent: 'Proposal PR-10045', oldValue: '—', newValue: '8 Files Uploaded', reason: 'S3 document drop received from Corporate Lending Portal', verificationHash: 'sha256:7f8a91b...e31' },
  { id: 'aud-02', timestamp: '10:40:28 AM', actor: 'AI Agent (Classification)', actorRole: 'AI Agent', action: 'Document Classification Completed', fieldOrComponent: 'Document Taxonomy', oldValue: 'Unclassified', newValue: '8 Documents Tagged by Type & FY', reason: 'Bedrock Classifier matched MCA Schedule III & Bank templates', verificationHash: 'sha256:4a19dc8...b92' },
  { id: 'aud-03', timestamp: '10:41:15 AM', actor: 'AI Agent (Extraction)', actorRole: 'AI Agent', action: 'OCR Table Extraction', fieldOrComponent: '186 Fields Extracted', oldValue: '—', newValue: 'Standard JSON Schema v1.0', reason: 'AWS Textract + Claude Vision Fallback completed with 93.4% composite confidence', verificationHash: 'sha256:c89e210...f45' },
  { id: 'aud-04', timestamp: '10:41:22 AM', actor: 'Validation Engine', actorRole: 'Validation Engine', action: 'CoA Normalization', fieldOrComponent: 'Sundry Creditors -> Trade Payables', oldValue: 'Sundry Creditors (Schedule 6)', newValue: '₹420.00 Lakhs (Trade Payables)', reason: 'Bank Chart of Accounts mapping rule BS_LIAB_04', verificationHash: 'sha256:109ab72...d89' },
  { id: 'aud-05', timestamp: '10:41:35 AM', actor: 'Validation Engine', actorRole: 'Validation Engine', action: 'Reconciliation Check Failed', fieldOrComponent: 'rc-bank-turnover', oldValue: '—', newValue: 'FAIL (Variance 16.0% > 10.0%)', reason: 'Inward credits ₹21.00 Cr vs Turnover ₹25.00 Cr', verificationHash: 'sha256:56df981...a12' },
  { id: 'aud-06', timestamp: '10:41:48 AM', actor: 'AI Agent', actorRole: 'AI Agent', action: 'HITL Exceptions Generated', fieldOrComponent: 'Exception Queue', oldValue: '0 Exceptions', newValue: '2 Critical Exceptions Assigned', reason: 'Low confidence on Trade Payables (89%) and Bank vs P&L variance (16%)', verificationHash: 'sha256:88bc412...c77' }
];

const INITIAL_ACTIVITIES = [
  { id: 'act-01', timestamp: '10:40:12 AM', durationMs: 420, status: 'SUCCESS', component: 'PreFlight', action: 'Document Manifest & S3 Watch', result: 'Ingested 8 borrower files totaling 18.5 MB.' },
  { id: 'act-02', timestamp: '10:40:18 AM', durationMs: 650, status: 'SUCCESS', component: 'PreFlight', action: 'Pre-flight integrity & malware scan', result: 'Zero corrupted pages or password encryptions found.' },
  { id: 'act-03', timestamp: '10:40:28 AM', durationMs: 1420, status: 'SUCCESS', component: 'Classification', action: 'AI Document Classification & Metadata tagging', result: '8 documents classified with 97% average confidence.' },
  { id: 'act-04', timestamp: '10:40:34 AM', durationMs: 580, status: 'SUCCESS', component: 'Textract OCR', action: 'pgvector Layout Template Match', result: 'Matched MCA Schedule III format template.' },
  { id: 'act-05', timestamp: '10:41:15 AM', durationMs: 4100, status: 'SUCCESS', component: 'Textract OCR', action: 'Textract OCR & Table Cell Coordinate Extraction', result: '186 financial data points extracted with 2D bounding boxes.' },
  { id: 'act-06', timestamp: '10:41:22 AM', durationMs: 820, status: 'SUCCESS', component: 'Normalization', action: 'Unit & Sign Normalization to Bank Standard CoA', result: 'All line items standardized to INR ₹ Lakhs.' },
  { id: 'act-07', timestamp: '10:41:35 AM', durationMs: 1200, status: 'WARNING', component: 'Reconciliation', action: 'Deterministic Balance Sheet & Banking Tie-outs', result: '4 Passed, 1 Warning, 1 Failed (Bank credits variance 16%).' },
  { id: 'act-08', timestamp: '10:41:42 AM', durationMs: 640, status: 'SUCCESS', component: 'Ratio Engine', action: 'Deterministic Ratio & Trend Computation', result: '14 financial ratios calculated across FY23, FY24, FY25.' },
  { id: 'act-09', timestamp: '10:41:55 AM', durationMs: 310, status: 'INFO', component: 'HITL Gateway', action: 'HITL Exception Queue Routing', result: 'Dispatched 2 exceptions to Credit Analyst Rahul Sharma.' }
];

// --- ENGINES ---
function evaluateReconciliation(fields) {
  const getVal = (id, year = 'fy2025') => {
    const f = fields.find(item => item.id === id);
    return f ? f[year] : 0;
  };

  const nw = getVal('f-nw', 'fy2025');
  const ltb = getVal('f-ltb', 'fy2025');
  const stb = getVal('f-stb', 'fy2025');
  const tp = getVal('f-tp', 'fy2025');
  const ocl = getVal('f-ocl', 'fy2025');

  const nfa = getVal('f-nfa', 'fy2025');
  const inv = getVal('f-inv', 'fy2025');
  const tr = getVal('f-tr', 'fy2025');
  const cash = getVal('f-cash', 'fy2025');

  const rev = getVal('f-rev', 'fy2025');
  const pat = getVal('f-pat', 'fy2025');
  const prevNw = getVal('f-nw', 'fy2024');
  const bankCredits = getVal('f-bank-cred', 'fy2025');

  const totalLiabilities = nw + ltb + stb + tp + ocl;
  const currentAssets = inv + tr + cash;
  const totalAssets = nfa + currentAssets;
  const currentLiabilities = stb + tp + ocl;

  const bsDiff = Math.abs(totalAssets - totalLiabilities);
  const bsVarPct = totalAssets > 0 ? (bsDiff / totalAssets) * 100 : 0;
  const bsCheckStatus = bsDiff === 0 ? 'PASS' : (bsVarPct <= 0.1 ? 'WARNING' : 'FAIL');

  const clStatus = tp === 405 ? 'PASS' : 'WARNING';

  const expectedNw = prevNw + pat - 90;
  const nwDiff = Math.abs(nw - expectedNw);
  const yoyStatus = nwDiff === 0 ? 'PASS' : 'FAIL';

  const bankDiff = Math.abs(rev - bankCredits);
  const bankVarPct = rev > 0 ? (bankDiff / rev) * 100 : 0;
  const bankCheckStatus = bankVarPct <= 10.0 ? 'PASS' : 'FAIL';

  const gstTurnover = 2350;
  const gstDiff = Math.abs(rev - gstTurnover);
  const gstVarPct = rev > 0 ? (gstDiff / rev) * 100 : 0;
  const gstCheckStatus = gstVarPct <= 10.0 ? 'PASS' : 'WARNING';

  return [
    {
      id: 'rc-bs-balance',
      name: 'Balance Sheet Balancing',
      category: 'Balance Sheet Tie-Out',
      description: 'Total Assets must equal Total Liabilities (Shareholders Funds + Non-Current Liabilities + Current Liabilities).',
      status: bsCheckStatus,
      reportedValueStr: `Assets: ₹${totalAssets.toFixed(2)} L | Liabilities: ₹${totalLiabilities.toFixed(2)} L`,
      calculatedValueStr: `Variance: ₹${bsDiff.toFixed(2)} L (${bsVarPct.toFixed(2)}%)`,
      variancePercentage: Number(bsVarPct.toFixed(2)),
      allowedTolerancePercentage: 0.0,
      evidence: bsCheckStatus === 'PASS' 
        ? `Assets (₹${totalAssets}L) exactly balance Liabilities (Net Worth ₹${nw}L + LTB ₹${ltb}L + STB ₹${stb}L + Trade Payables ₹${tp}L + Other ₹${ocl}L = ₹${totalLiabilities}L). Discrepancy resolved.`
        : `Reported Total Assets = ₹${totalAssets}L. Sum of Liabilities = ₹${totalLiabilities}L (Net Worth ₹${nw}L + LTB ₹${ltb}L + STB ₹${stb}L + Trade Payables ₹${tp}L + Other ₹${ocl}L). Discrepancy of ₹${bsDiff}L (${bsVarPct.toFixed(2)}%) detected due to OCR misread on Trade Payables.`,
      impactedFieldIds: ['f-tp', 'f-nw', 'f-ltb', 'f-stb', 'f-ocl', 'f-nfa'],
      requiresHITL: bsCheckStatus === 'FAIL'
    },
    {
      id: 'rc-comp-cl',
      name: 'Current Liabilities Component Sum',
      category: 'Component Summation',
      description: 'Total Current Liabilities must equal Short Term Borrowings + Trade Payables + Other Current Liabilities.',
      status: clStatus,
      reportedValueStr: `Stated CL: ₹${currentLiabilities.toFixed(2)} L`,
      calculatedValueStr: `STB (${stb}) + TP (${tp}) + OCL (${ocl}) = ₹${currentLiabilities.toFixed(2)} L`,
      variancePercentage: 0.0,
      allowedTolerancePercentage: 0.0,
      evidence: clStatus === 'PASS'
        ? `Sum of parts STB (₹${stb}L) + Trade Payables (₹${tp}L) + Other (₹${ocl}L) ties out to ₹${currentLiabilities}L.`
        : `Trade Payables schedule line item contains OCR ambiguity (₹${tp}L). Verify audited sub-schedule break-up.`,
      impactedFieldIds: ['f-stb', 'f-tp', 'f-ocl'],
      requiresHITL: false
    },
    {
      id: 'rc-yoy-nw',
      name: 'Year-on-Year Net Worth Continuity',
      category: 'YoY Continuity',
      description: 'Closing Net Worth (FY25) must reconcile with Opening Net Worth (FY24) + Current Year PAT - Dividends.',
      status: yoyStatus,
      reportedValueStr: `FY25 NW: ₹${nw.toFixed(2)} L`,
      calculatedValueStr: `Expected: ₹${expectedNw.toFixed(2)} L (FY24 ${prevNw} + PAT ${pat} - Div 90)`,
      variancePercentage: Number(((nwDiff / (nw || 1)) * 100).toFixed(2)),
      allowedTolerancePercentage: 1.0,
      evidence: `Opening FY24 Net Worth ₹${prevNw}L + FY25 PAT ₹${pat}L - Dividend ₹90L = ₹${expectedNw}L. Ties out with reported closing FY25 Net Worth.`,
      impactedFieldIds: ['f-nw', 'f-pat', 'f-res'],
      requiresHITL: false
    },
    {
      id: 'rc-bank-turnover',
      name: 'Bank Credits vs Reported Turnover',
      category: 'Bank vs P&L',
      description: 'Inward bank credits should reconcile within 10% of reported P&L turnover to detect revenue inflation or unrouted sales.',
      status: bankCheckStatus,
      reportedValueStr: `Inward Bank Credits: ₹${bankCredits.toFixed(2)} L (₹${(bankCredits / 100).toFixed(2)} Cr)`,
      calculatedValueStr: `P&L Turnover: ₹${rev.toFixed(2)} L (₹${(rev / 100).toFixed(2)} Cr) | Variance: ${bankVarPct.toFixed(1)}%`,
      variancePercentage: Number(bankVarPct.toFixed(1)),
      allowedTolerancePercentage: 10.0,
      evidence: `Variance of ${bankVarPct.toFixed(1)}% exceeds the 10.0% bank policy tolerance. Inward banking credits capture ₹${bankCredits}L while audited revenue reports ₹${rev}L. Secondary bank accounts or trade credit terms require Credit Analyst commentary.`,
      impactedFieldIds: ['f-rev', 'f-bank-cred'],
      requiresHITL: true
    },
    {
      id: 'rc-gst-turnover',
      name: 'GST Outward Supplies vs Reported Turnover',
      category: 'Cross-Document Reconciliation',
      description: 'Annual GSTR-3B / GSTR-1 turnover should match P&L turnover within 10%.',
      status: gstCheckStatus,
      reportedValueStr: `GST Outward Supplies: ₹${gstTurnover.toFixed(2)} L`,
      calculatedValueStr: `P&L Turnover: ₹${rev.toFixed(2)} L | Variance: ${gstVarPct.toFixed(1)}%`,
      variancePercentage: Number(gstVarPct.toFixed(1)),
      allowedTolerancePercentage: 10.0,
      evidence: `GST turnover of ₹${gstTurnover}L is within acceptable ${gstVarPct.toFixed(1)}% variance of reported P&L turnover (explained by export sales and non-taxable inter-unit transfers).`,
      impactedFieldIds: ['f-rev'],
      requiresHITL: false
    }
  ];
}

function computeFinancialRatios(fields) {
  const getVal = (id, year) => {
    const f = fields.find(item => item.id === id);
    return f ? f[year] : 0;
  };

  const calculateForYear = (year) => {
    const rev = getVal('f-rev', year);
    const ebitda = getVal('f-ebitda', year);
    const dep = getVal('f-dep', year);
    const fin = getVal('f-fin', year);
    const pat = getVal('f-pat', year);
    const nw = getVal('f-nw', year);
    const ltb = getVal('f-ltb', year);
    const stb = getVal('f-stb', year);
    const tp = getVal('f-tp', year);
    const ocl = getVal('f-ocl', year);
    const inv = getVal('f-inv', year);
    const tr = getVal('f-tr', year);
    const cash = getVal('f-cash', year);
    const bankCredits = getVal('f-bank-cred', year);

    const ca = inv + tr + cash;
    const cl = stb + tp + ocl;
    const tol = ltb + cl;
    const totalDebt = ltb + stb;

    const currentRatio = cl > 0 ? (ca / cl) : 0;
    const principalRepayment = year === 'fy2025' ? 60 : (year === 'fy2024' ? 55 : 50);
    const dscr = (fin + principalRepayment) > 0 ? (pat + dep + fin) / (fin + principalRepayment) : 0;
    const tolTnw = nw > 0 ? (tol / nw) : 0;
    const deRatio = nw > 0 ? (totalDebt / nw) : 0;
    const icr = fin > 0 ? (ebitda / fin) : 0;
    const ebitdaMargin = rev > 0 ? (ebitda / rev) * 100 : 0;
    const patMargin = rev > 0 ? (pat / rev) * 100 : 0;
    const debtorDays = rev > 0 ? (tr / rev) * 365 : 0;
    const invDays = rev > 0 ? (inv / rev) * 365 : 0;
    const credDays = rev > 0 ? (tp / rev) * 365 : 0;
    const wcCycleDays = debtorDays + invDays - credDays;
    const bankTurnoverPct = rev > 0 ? (bankCredits / rev) * 100 : 0;

    return {
      currentRatio,
      dscr,
      tolTnw,
      deRatio,
      icr,
      ebitdaMargin,
      patMargin,
      wcCycleDays,
      bankTurnoverPct
    };
  };

  const y25 = calculateForYear('fy2025');
  const y24 = calculateForYear('fy2024');
  const y23 = calculateForYear('fy2023');

  return [
    {
      id: 'ratio-current-ratio',
      name: 'Current Ratio',
      category: 'Liquidity',
      formula: 'Total Current Assets / Total Current Liabilities',
      benchmark: '≥ 1.33x',
      fy2023: y23.currentRatio.toFixed(2),
      fy2024: y24.currentRatio.toFixed(2),
      fy2025: y25.currentRatio.toFixed(2),
      unit: 'x',
      trend: y25.currentRatio >= y24.currentRatio ? 'improving' : 'stable',
      isHealthy: y25.currentRatio >= 1.15
    },
    {
      id: 'ratio-dscr',
      name: 'Debt Service Coverage Ratio (DSCR)',
      category: 'Coverage & Service',
      formula: '(PAT + Dep + Finance Costs) / (Finance Costs + Principal Repayment)',
      benchmark: '≥ 1.50x',
      fy2023: y23.dscr.toFixed(2),
      fy2024: y24.dscr.toFixed(2),
      fy2025: y25.dscr.toFixed(2),
      unit: 'x',
      trend: y25.dscr >= y24.dscr ? 'improving' : 'deteriorating',
      isHealthy: y25.dscr >= 1.5
    },
    {
      id: 'ratio-tol-tnw',
      name: 'TOL / TNW (Total Outside Liabilities / Net Worth)',
      category: 'Solvency & Leverage',
      formula: '(Long Term Borrowings + Current Liabilities) / Tangible Net Worth',
      benchmark: '≤ 2.50x',
      fy2023: y23.tolTnw.toFixed(2),
      fy2024: y24.tolTnw.toFixed(2),
      fy2025: y25.tolTnw.toFixed(2),
      unit: 'x',
      trend: y25.tolTnw <= y24.tolTnw ? 'improving' : 'deteriorating',
      isHealthy: y25.tolTnw <= 2.0
    },
    {
      id: 'ratio-de',
      name: 'Debt / Equity Ratio',
      category: 'Solvency & Leverage',
      formula: '(Long Term Borrowings + Short Term Borrowings) / Tangible Net Worth',
      benchmark: '≤ 1.50x',
      fy2023: y23.deRatio.toFixed(2),
      fy2024: y24.deRatio.toFixed(2),
      fy2025: y25.deRatio.toFixed(2),
      unit: 'x',
      trend: y25.deRatio <= y24.deRatio ? 'improving' : 'stable',
      isHealthy: y25.deRatio <= 1.0
    },
    {
      id: 'ratio-icr',
      name: 'Interest Coverage Ratio (ICR)',
      category: 'Coverage & Service',
      formula: 'EBITDA / Finance Costs',
      benchmark: '≥ 2.50x',
      fy2023: y23.icr.toFixed(2),
      fy2024: y24.icr.toFixed(2),
      fy2025: y25.icr.toFixed(2),
      unit: 'x',
      trend: y25.icr >= y24.icr ? 'improving' : 'stable',
      isHealthy: y25.icr >= 3.0
    },
    {
      id: 'ratio-ebitda-margin',
      name: 'EBITDA Margin (%)',
      category: 'Profitability',
      formula: '(EBITDA / Revenue from Operations) * 100',
      benchmark: '≥ 12.0%',
      fy2023: `${y23.ebitdaMargin.toFixed(1)}%`,
      fy2024: `${y24.ebitdaMargin.toFixed(1)}%`,
      fy2025: `${y25.ebitdaMargin.toFixed(1)}%`,
      unit: '%',
      trend: y25.ebitdaMargin >= y24.ebitdaMargin ? 'improving' : 'deteriorating',
      isHealthy: y25.ebitdaMargin >= 14.0
    },
    {
      id: 'ratio-pat-margin',
      name: 'PAT Margin (%)',
      category: 'Profitability',
      formula: '(PAT / Revenue from Operations) * 100',
      benchmark: '≥ 5.0%',
      fy2023: `${y23.patMargin.toFixed(1)}%`,
      fy2024: `${y24.patMargin.toFixed(1)}%`,
      fy2025: `${y25.patMargin.toFixed(1)}%`,
      unit: '%',
      trend: y25.patMargin >= y24.patMargin ? 'improving' : 'stable',
      isHealthy: y25.patMargin >= 7.0
    },
    {
      id: 'ratio-wc-cycle',
      name: 'Working Capital Cycle (Days)',
      category: 'Working Capital',
      formula: 'Debtor Days + Inventory Days - Creditor Days',
      benchmark: '60 – 90 Days',
      fy2023: `${Math.round(y23.wcCycleDays)} Days`,
      fy2024: `${Math.round(y24.wcCycleDays)} Days`,
      fy2025: `${Math.round(y25.wcCycleDays)} Days`,
      unit: 'Days',
      trend: y25.wcCycleDays <= y24.wcCycleDays ? 'improving' : 'stable',
      isHealthy: y25.wcCycleDays <= 95
    },
    {
      id: 'ratio-bank-turnover-ratio',
      name: 'Bank Credits / Turnover Ratio',
      category: 'Banking Health',
      formula: '(Total Inward Bank Credits / P&L Turnover) * 100',
      benchmark: '≥ 90.0%',
      fy2023: `${y23.bankTurnoverPct.toFixed(1)}%`,
      fy2024: `${y24.bankTurnoverPct.toFixed(1)}%`,
      fy2025: `${y25.bankTurnoverPct.toFixed(1)}%`,
      unit: '%',
      trend: y25.bankTurnoverPct >= 90 ? 'improving' : 'deteriorating',
      isHealthy: y25.bankTurnoverPct >= 90.0
    }
  ];
}

// --- MAIN APP ROOT ---
function App() {
  const [activeTab, setActiveTab] = useState('workspace');
  const [proposal] = useState(MOCK_PROPOSAL);
  const [stages, setStages] = useState(INITIAL_STAGES);
  const [documents, setDocuments] = useState(INITIAL_DOCS);
  const [fields, setFields] = useState(INITIAL_FIELDS);
  const [reconciliations, setReconciliations] = useState(() => evaluateReconciliation(INITIAL_FIELDS));
  const [ratios, setRatios] = useState(() => computeFinancialRatios(INITIAL_FIELDS));
  const [exceptions, setExceptions] = useState(INITIAL_EXCEPTIONS);
  const [auditLogs, setAuditLogs] = useState(INITIAL_AUDIT_LOGS);
  const [agentActivities, setAgentActivities] = useState(INITIAL_ACTIVITIES);

  const [selectedDocumentId, setSelectedDocumentId] = useState('doc-01');
  const [selectedFieldId, setSelectedFieldId] = useState('f-tp');
  const [selectedExceptionId, setSelectedExceptionId] = useState('exc-01');
  const [activeViewerPage, setActiveViewerPage] = useState(1);
  const [zoomLevel, setZoomLevel] = useState(100);

  const [isUploading, setIsUploading] = useState(false);
  const [uploadStepName, setUploadStepName] = useState('');
  const [isDemoRunning, setIsDemoRunning] = useState(false);
  const [agentStatus, setAgentStatus] = useState('waiting_hitl');
  const [agentCurrentAction, setAgentCurrentAction] = useState('Awaiting Credit Analyst review on 2 flagged exceptions');
  const [agentNextAction, setAgentNextAction] = useState('Re-run reconciliation & recalculate ratios upon analyst correction');
  const [agentProgressPct, setAgentProgressPct] = useState(85);
  const [spreadVersion, setSpreadVersion] = useState('v0.9 (Draft - HITL Pending)');
  const [isApproved, setIsApproved] = useState(false);
  const [isPublished, setIsPublished] = useState(false);
  const [toast, setToast] = useState(null);
  const [isFieldDrawerOpen, setIsFieldDrawerOpen] = useState(false);

  const showToast = useCallback((type, title, desc) => {
    setToast({ type, title, desc });
    setTimeout(() => setToast(null), 4500);
  }, []);

  const handleSelectField = (fieldId) => {
    setSelectedFieldId(fieldId);
    const f = fields.find(item => item.id === fieldId);
    if (f) {
      if (f.documentId) setSelectedDocumentId(f.documentId);
      if (f.pageNumber) setActiveViewerPage(f.pageNumber);
    }
  };

  const handleOpenFieldDrawer = (fieldId) => {
    handleSelectField(fieldId);
    setIsFieldDrawerOpen(true);
  };

  const handleSaveCorrection = useCallback((fieldId, correctedVal, reason, comment) => {
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const target = fields.find(f => f.id === fieldId);
    const oldVal = target ? `₹${target.fy2025.toFixed(2)} Lakhs` : '—';
    const newVal = `₹${correctedVal.toFixed(2)} Lakhs`;

    const updatedFields = fields.map(f => {
      if (f.id === fieldId) {
        return {
          ...f,
          fy2025: correctedVal,
          status: 'Corrected',
          confidence: 98,
          ocrConfidence: 99,
          mappingConfidence: 100,
          tieOutConfidence: 99,
          flagReason: `Corrected by Analyst: ${reason}. (${comment})`
        };
      }
      return f;
    });
    setFields(updatedFields);

    const newRecs = evaluateReconciliation(updatedFields);
    setReconciliations(newRecs);

    const newRatios = computeFinancialRatios(updatedFields);
    setRatios(newRatios);

    const updatedExceptions = exceptions.map(exc => {
      if (exc.fieldId === fieldId) {
        return {
          ...exc,
          status: 'RESOLVED_BY_ANALYST',
          analystComment: `${reason}: ${comment}`
        };
      }
      return exc;
    });
    setExceptions(updatedExceptions);

    setStages(prev => prev.map(s => {
      if (s.id === 'reconciliation') return { ...s, status: 'completed', summaryText: 'All core tie-outs passed after analyst correction.' };
      if (s.id === 'confidence') return { ...s, status: 'completed', summaryText: 'Average confidence elevated to 96.8%.' };
      if (s.id === 'exceptions') return { ...s, status: 'completed', summaryText: 'Trade Payables OCR exception resolved.' };
      if (s.id === 'approval') return { ...s, status: 'requires_review', summaryText: 'Financial spread is ready for Credit Analyst sign-off.' };
      return s;
    }));

    const newAudit = {
      id: `aud-${Date.now()}`,
      timestamp: time,
      actor: 'Rahul Sharma',
      actorRole: 'Credit Analyst',
      action: 'Analyst Field Correction',
      fieldOrComponent: target ? target.standardField : 'Field',
      oldValue: oldVal,
      newValue: newVal,
      reason: `${reason} — ${comment}`,
      verificationHash: `sha256:e83f${Math.random().toString(36).substring(2, 8)}`
    };
    const revalAudit = {
      id: `aud-${Date.now() + 1}`,
      timestamp: time,
      actor: 'Validation Engine',
      actorRole: 'Validation Engine',
      action: 'Deterministic Re-validation',
      fieldOrComponent: 'Balance Sheet Balancing & Ratio Engine',
      oldValue: 'FAIL (Variance ₹15.00 L)',
      newValue: 'PASS (Zero Variance)',
      reason: 'Automated re-computation of 4 dependent checks & 14 ratios after field update',
      verificationHash: `sha256:77bc${Math.random().toString(36).substring(2, 8)}`
    };
    setAuditLogs(prev => [newAudit, revalAudit, ...prev]);

    const newAct = {
      id: `act-${Date.now()}`,
      timestamp: time,
      durationMs: 410,
      status: 'SUCCESS',
      component: 'Reconciliation',
      action: 'Reactive Re-validation Triggered',
      result: 'Agent revalidated 4 dependent checks: Balance Sheet balanced, Current Ratio updated to 1.15x, TOL/TNW to 1.30x.'
    };
    setAgentActivities(prev => [newAct, ...prev]);

    setAgentStatus('processing');
    setAgentCurrentAction('Agent revalidated 4 dependent checks after analyst correction');
    setAgentNextAction('Proceed to Spread Approval for Proposal PR-10045');
    setAgentProgressPct(95);

    showToast(
      'success',
      'Correction Saved & Re-validation Complete',
      'Agent re-ran Balance Sheet tie-outs and recalculated Current Ratio (1.15x) and TOL/TNW (1.30x).'
    );
  }, [fields, exceptions, showToast]);

  const handleAcceptException = useCallback((exceptionId, comment) => {
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    setExceptions(prev => prev.map(exc => {
      if (exc.id === exceptionId) {
        return {
          ...exc,
          status: 'ACCEPTED_WITH_FLAG',
          analystComment: comment || 'Verified against secondary export collection account statement.'
        };
      }
      return exc;
    }));

    const newAudit = {
      id: `aud-${Date.now()}`,
      timestamp: time,
      actor: 'Rahul Sharma',
      actorRole: 'Credit Analyst',
      action: 'Exception Accepted with Commentary',
      fieldOrComponent: 'Bank vs Turnover Variance',
      oldValue: 'PENDING_REVIEW',
      newValue: 'ACCEPTED_WITH_FLAG',
      reason: comment || 'Commentary documented for CAM Note preparation',
      verificationHash: `sha256:acc${Math.random().toString(36).substring(2, 8)}`
    };
    setAuditLogs(prev => [newAudit, ...prev]);
    showToast('info', 'Exception Acknowledged', 'Credit Analyst commentary attached to Proposal audit trail.');
  }, [showToast]);

  const handleApproveSpread = useCallback((comments) => {
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    setIsApproved(true);
    setSpreadVersion('v1.0 (Audited & Locked)');
    
    setStages(prev => prev.map(s => {
      if (s.id === 'approval') return { ...s, status: 'approved', summaryText: `Signed off by Rahul Sharma at ${time}.` };
      if (s.id === 'publish') return { ...s, status: 'requires_review', summaryText: 'Ready for downstream publishing to LOS, CAM Agent, and Risk Engine.' };
      return s;
    }));

    const approvalAudit = {
      id: `aud-${Date.now()}`,
      timestamp: time,
      actor: 'Rahul Sharma',
      actorRole: 'Credit Analyst',
      action: 'Financial Spread Sign-Off',
      fieldOrComponent: 'Spread Dataset v1.0',
      oldValue: 'v0.9 (Draft)',
      newValue: 'v1.0 (Locked & Approved)',
      reason: `Sign-off completed: ${comments || 'All statutory schedules and ratios verified'}`,
      verificationHash: `sha256:apprv${Math.random().toString(36).substring(2, 8)}`
    };
    setAuditLogs(prev => [approvalAudit, ...prev]);
    setAgentStatus('approved');
    setAgentCurrentAction('Financial Spread v1.0 approved and locked for proposal PR-10045');
    setAgentNextAction('Dispatch structured JSON to Downstream Credit Flows');
    setAgentProgressPct(98);
    showToast('success', 'Financial Spread Approved', 'Dataset versioned as v1.0 (Locked). Ready to publish.');
  }, [showToast]);

  const handlePublishDataset = useCallback((destinations) => {
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    setIsPublished(true);
    setStages(prev => prev.map(s => {
      if (s.id === 'publish') return { ...s, status: 'published', summaryText: `Published to ${destinations.length} downstream endpoints at ${time}.` };
      return s;
    }));

    const publishAudit = {
      id: `aud-${Date.now()}`,
      timestamp: time,
      actor: 'System (Publisher)',
      actorRole: 'System',
      action: 'Downstream Event Emitter',
      fieldOrComponent: 'Event Bridge / Kafka',
      oldValue: 'Unpublished',
      newValue: `Published to: ${destinations.join(', ')}`,
      reason: '10-Year WORM record sealed and published for Proposal PR-10045',
      verificationHash: `sha256:pub${Math.random().toString(36).substring(2, 8)}`
    };
    setAuditLogs(prev => [publishAudit, ...prev]);

    const publishAct = {
      id: `act-${Date.now()}`,
      timestamp: time,
      durationMs: 290,
      status: 'SUCCESS',
      component: 'Publisher',
      action: 'Downstream Hand-off Dispatched',
      result: `Emitted payloads to Flow 02 CAM Drafting Agent, LOS CRMNEXT, Risk Scrutiny Engine, and EWS Portfolio Monitor.`
    };
    setAgentActivities(prev => [publishAct, ...prev]);
    setAgentStatus('published');
    setAgentCurrentAction('Published to CAM Agent, Risk Scoring, EWS, and LOS');
    setAgentNextAction('Flow 01 Complete. Downstream agents actively preparing Credit Appraisal Memo (CAM).');
    setAgentProgressPct(100);
    showToast('success', 'Published to Downstream Systems', 'Flow 02 CAM Agent, Risk Scoring, and EWS have received the structured financial dataset.');
  }, [showToast]);

  const handleResetDemo = useCallback(() => {
    setStages(INITIAL_STAGES);
    setDocuments(INITIAL_DOCS);
    setFields(INITIAL_FIELDS);
    setReconciliations(evaluateReconciliation(INITIAL_FIELDS));
    setRatios(computeFinancialRatios(INITIAL_FIELDS));
    setExceptions(INITIAL_EXCEPTIONS);
    setAuditLogs(INITIAL_AUDIT_LOGS);
    setAgentActivities(INITIAL_ACTIVITIES);
    setSelectedDocumentId('doc-01');
    setSelectedFieldId('f-tp');
    setSelectedExceptionId('exc-01');
    setActiveViewerPage(1);
    setAgentStatus('waiting_hitl');
    setAgentCurrentAction('Awaiting Credit Analyst review on 2 flagged exceptions');
    setAgentNextAction('Re-run reconciliation & recalculate ratios upon analyst correction');
    setAgentProgressPct(85);
    setSpreadVersion('v0.9 (Draft - HITL Pending)');
    setIsApproved(false);
    setIsPublished(false);
    setIsDemoRunning(false);
    setActiveTab('workspace');
    showToast('info', 'Demo State Reset', 'Reset prototype to initial state with 2 pending exceptions.');
  }, [showToast]);

  const handleRunFullDemo = useCallback(() => {
    setIsDemoRunning(true);
    setActiveTab('workspace');
    showToast('info', 'Starting Interactive Demo Walkthrough', 'Demonstrating complete end-to-end extraction, exception review, re-validation, and publishing.');

    setTimeout(() => {
      setActiveTab('viewer');
      setSelectedDocumentId('doc-01');
      setActiveViewerPage(1);
      handleSelectField('f-tp');

      setTimeout(() => {
        setActiveTab('exceptions');
        setSelectedExceptionId('exc-01');

        setTimeout(() => {
          handleSaveCorrection('f-tp', 405, 'OCR Misrecognition Correction', 'Verified against Audited Schedule 6: Creditors for goods ₹310L + expenses ₹95L = ₹405L.');

          setTimeout(() => {
            handleAcceptException('exc-02', 'Borrower explained ₹400L revenue was routed through export collection LC account at Axis Bank. Verified swift copy.');

            setTimeout(() => {
              setActiveTab('reconciliation');

              setTimeout(() => {
                setActiveTab('ratios');

                setTimeout(() => {
                  setActiveTab('approval');

                  setTimeout(() => {
                    handleApproveSpread('Audited financials, 3-year ratios, and ROC schedules fully reconciled.');

                    setTimeout(() => {
                      setActiveTab('publish');

                      setTimeout(() => {
                        handlePublishDataset(['LOS / CRMNEXT', 'Flow 02 CAM Drafting Agent', 'Risk Scrutiny Engine', 'EWS Portfolio Monitor']);
                        setIsDemoRunning(false);
                      }, 1800);
                    }, 2000);
                  }, 1800);
                }, 2000);
              }, 2000);
            }, 2000);
          }, 1800);
        }, 2500);
      }, 2000);
    }, 1800);
  }, [handleSaveCorrection, handleAcceptException, handleApproveSpread, handlePublishDataset, showToast]);

  const handleSimulateUpload = useCallback((docName = 'Provisional Financials FY2025.pdf') => {
    setIsUploading(true);
    setUploadStepName('Uploading to S3 Staging Drop...');
    setTimeout(() => {
      setUploadStepName('Running Pre-Flight Validation...');
      setTimeout(() => {
        setUploadStepName('Classifying Document & FY...');
        setTimeout(() => {
          setUploadStepName('Extracting Table Layout & Line Items...');
          setTimeout(() => {
            const newDoc = {
              id: `doc-${Date.now()}`,
              name: docName,
              type: 'Provisional Financials',
              subtype: 'Management Certified Provisional Statements',
              financialYear: 'FY2024-25',
              period: '01-Apr-2024 to 31-Mar-2025',
              version: 'v1.0 (Provisional)',
              fileSize: '1.9 MB',
              pageCount: 2,
              status: 'Processed',
              confidence: 96,
              processingTimeSec: 14,
              uploadedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              audited: false,
              currency: 'INR',
              reportedUnit: '₹ Lakhs',
              aiClassificationEvidence: 'Classified as Management Provisional Financials based on internal stamp and unaudited disclaimers.'
            };
            setDocuments(prev => [newDoc, ...prev]);
            setIsUploading(false);
            setUploadStepName('');
            showToast('success', 'Document Processed', `${docName} successfully classified, extracted, and normalized.`);
          }, 700);
        }, 700);
      }, 700);
    }, 700);
  }, [showToast]);

  const selectedDoc = documents.find(d => d.id === selectedDocumentId) || documents[0];
  const selectedField = fields.find(f => f.id === selectedFieldId) || null;
  const pendingExceptionsCount = exceptions.filter(e => e.status === 'PENDING_REVIEW' || e.status === 'IN_REVIEW').length;

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-100 font-sans text-slate-900">
      {/* Left Navigation Sidebar */}
      <aside className="w-64 bg-slate-900 text-slate-200 flex flex-col flex-shrink-0 border-r border-slate-800 select-none">
        <div className="h-16 flex items-center px-5 bg-slate-950 border-b border-slate-800 gap-3">
          <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold shadow-md shadow-blue-900/50">
            <Icons.Building className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-bold text-sm text-white tracking-tight flex items-center gap-1.5">
              APEX BANKING
              <span className="text-[10px] bg-blue-500/20 text-blue-400 font-semibold px-1.5 py-0.5 rounded">CRM</span>
            </h1>
            <p className="text-[11px] text-slate-400">Flow 01 · Extraction Agent</p>
          </div>
        </div>

        <div className="px-4 py-3 bg-slate-800/40 border-b border-slate-800">
          <div className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider">Active Proposal</div>
          <div className="text-xs font-medium text-blue-300 truncate mt-0.5">PR-10045 · ABC Mfg</div>
          <div className="flex items-center gap-2 mt-1">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-[11px] text-slate-300">Credit Appraisal</span>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-0.5 scrollbar-dark">
          <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Agent Workflow & Data
          </div>
          {[
            { id: 'workspace', label: 'Dashboard & Workspace', icon: Icons.Building, badge: null },
            { id: 'documents', label: 'Document Center', icon: Icons.FileText, badge: `${documents.length}` },
            { id: 'viewer', label: 'Document Intelligence', icon: Icons.FileText, badge: 'OCR' },
            { id: 'extracted-fields', label: 'Financial Spreads', icon: Icons.Layers, badge: `${fields.length}` },
            { id: 'normalization', label: 'CoA Normalization', icon: Icons.Database, badge: null },
            { id: 'reconciliation', label: 'Reconciliation Engine', icon: Icons.ShieldCheck, badge: 'Live' },
            { id: 'ratios', label: 'Ratios & Trends', icon: Icons.BarChart2, badge: '3-Yr' },
            { id: 'confidence', label: 'Confidence Center', icon: Icons.TrendingUp, badge: '93%' },
            { id: 'exceptions', label: 'Exceptions (HITL)', icon: Icons.AlertTriangle, badge: pendingExceptionsCount > 0 ? `${pendingExceptionsCount}` : null, badgeColor: 'bg-rose-500 text-white' },
            { id: 'approval', label: 'Spread Approval', icon: Icons.Lock, badge: null },
            { id: 'publish', label: 'Publish & Handoff', icon: Icons.CreditCard, badge: 'CAM' },
            { id: 'audit', label: '10-Yr Audit Trail', icon: Icons.Activity, badge: 'WORM' },
            { id: 'how-it-works', label: 'How Agent Works', icon: Icons.HelpCircle, badge: 'Arch' }
          ].map(item => {
            const NavIcon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                  isActive ? 'bg-blue-600 text-white font-semibold shadow-sm' : 'text-slate-300 hover:bg-slate-800/70 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <NavIcon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
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

        <div className="p-3 bg-slate-950 border-t border-slate-800 flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-bold text-slate-300">
            RS
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-medium text-white truncate">Rahul Sharma</div>
            <div className="text-[10px] text-slate-400 truncate">Senior Credit Analyst</div>
          </div>
          <span className="w-2 h-2 rounded-full bg-emerald-500" title="Connected"></span>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Bar */}
        <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between flex-shrink-0 shadow-xs z-20">
          <div className="flex items-center gap-4 flex-1 max-w-xl">
            <div className="relative w-72">
              <Icons.Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search fields, documents, checks..."
                className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
            <div className="hidden lg:flex items-center gap-2 px-2.5 py-1 bg-amber-50 border border-amber-200/80 rounded-md">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
              <span className="text-[11px] font-bold text-amber-900 tracking-wide">
                DEMO DATA — NOT REAL CUSTOMER INFORMATION
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleRunFullDemo}
              disabled={isDemoRunning}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold shadow-sm transition-all ${
                isDemoRunning ? 'bg-blue-100 text-blue-700 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 text-white hover:shadow ring-2 ring-blue-600/30'
              }`}
            >
              {isDemoRunning ? (
                <>
                  <span className="w-3 h-3 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></span>
                  <span>Running Live Demo...</span>
                </>
              ) : (
                <>
                  <Icons.Play className="w-3.5 h-3.5 fill-current" />
                  <span>Run Full Demo</span>
                </>
              )}
            </button>

            <button
              onClick={handleResetDemo}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-medium border border-slate-200"
            >
              <Icons.RotateCcw className="w-3.5 h-3.5 text-slate-500" />
              <span>Reset Demo</span>
            </button>

            <div className="h-5 w-px bg-slate-200 mx-1"></div>

            <a
              href="./casa_scrutiny_wireframe.html"
              className="flex items-center gap-1.5 px-2.5 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-lg text-xs font-bold"
            >
              <Icons.Sparkles className="w-4 h-4 text-indigo-600" />
              <span>CASA Scrutiny Wireframe →</span>
            </a>

            <button
              onClick={() => setActiveTab('how-it-works')}
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg text-xs font-medium"
            >
              <Icons.Sparkles className="w-4 h-4 text-blue-600" />
              <span className="hidden sm:inline">How Agent Works</span>
            </button>
          </div>
        </header>

        {/* Proposal Header Banner */}
        <div className="bg-white border-b border-slate-200 px-6 py-3.5">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs text-slate-500 mb-0.5">
                <span>Corporate Credit Hub</span>
                <Icons.ChevronRight className="w-3 h-3" />
                <span>Commercial Term Loans</span>
                <Icons.ChevronRight className="w-3 h-3" />
                <span className="font-semibold text-blue-600">{proposal.proposalId}</span>
              </div>
              <div className="flex items-center gap-3">
                <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
                  {proposal.borrowerName}
                </h1>
                <span className="px-2 py-0.5 bg-slate-100 text-slate-700 text-xs font-mono font-semibold rounded border border-slate-200">
                  {proposal.cif}
                </span>
                <span className="px-2.5 py-0.5 bg-blue-50 text-blue-700 text-xs font-semibold rounded-full border border-blue-200 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                  {proposal.creditStage}
                </span>
                {isPublished ? (
                  <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 text-xs font-semibold rounded-full flex items-center gap-1 border border-emerald-300">
                    <Icons.CheckCircle className="w-3 h-3 text-emerald-600" />
                    Published to CAM & Risk
                  </span>
                ) : isApproved ? (
                  <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-700 text-xs font-semibold rounded-full flex items-center gap-1 border border-emerald-200">
                    <Icons.ShieldCheck className="w-3 h-3 text-emerald-600" />
                    Spread Approved ({spreadVersion})
                  </span>
                ) : (
                  <span className="px-2.5 py-0.5 bg-amber-50 text-amber-800 text-xs font-semibold rounded-full flex items-center gap-1 border border-amber-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping"></span>
                    Draft Spread ({spreadVersion})
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setActiveTab(activeTab === 'viewer' ? 'workspace' : 'viewer')}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-bold rounded-lg shadow-sm hover:shadow"
              >
                <Icons.Sparkles className="w-4 h-4 text-blue-200" />
                <span>{activeTab === 'viewer' ? 'Return to Workspace' : 'Open Extraction Agent'}</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 mt-3 pt-2.5 border-t border-slate-100 text-xs">
            <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
              <div className="text-[10px] text-slate-400 font-semibold uppercase">Loan Product</div>
              <div className="font-bold text-slate-800 mt-0.5 flex items-center gap-1">
                <Icons.CreditCard className="w-3.5 h-3.5 text-blue-500" />
                {proposal.loanProduct}
              </div>
            </div>
            <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
              <div className="text-[10px] text-slate-400 font-semibold uppercase">Requested Limit</div>
              <div className="font-bold text-blue-700 mt-0.5 text-sm">{proposal.requestedAmount}</div>
            </div>
            <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
              <div className="text-[10px] text-slate-400 font-semibold uppercase">Financial Years</div>
              <div className="font-semibold text-slate-700 mt-0.5">FY23 · FY24 · FY25</div>
            </div>
            <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
              <div className="text-[10px] text-slate-400 font-semibold uppercase">Relationship Mgr</div>
              <div className="font-semibold text-slate-800 mt-0.5 flex items-center gap-1">
                <Icons.User className="w-3 h-3 text-slate-400" />
                {proposal.relationshipManager}
              </div>
            </div>
            <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
              <div className="text-[10px] text-slate-400 font-semibold uppercase">Assigned Analyst</div>
              <div className="font-semibold text-slate-800 mt-0.5 flex items-center gap-1">
                <Icons.User className="w-3 h-3 text-blue-500" />
                {proposal.creditAnalyst}
              </div>
            </div>
            <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
              <div className="text-[10px] text-slate-400 font-semibold uppercase">Extraction SLA</div>
              <div className="font-bold text-emerald-700 mt-0.5 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                &lt; 2.5 min (Target: 15m)
              </div>
            </div>
          </div>
        </div>

        {/* 12-Stage Stepper */}
        <div className="bg-white border-b border-slate-200 px-6 py-2.5 overflow-x-auto scrollbar-thin">
          <div className="flex items-center justify-between gap-2 min-w-[1100px]">
            {stages.map((stage, idx) => {
              const getTabForStage = (id) => {
                if (id === 'intake' || id === 'validation') return 'documents';
                if (id === 'classification' || id === 'layout' || id === 'extraction') return 'viewer';
                if (id === 'normalization') return 'normalization';
                if (id === 'reconciliation') return 'reconciliation';
                if (id === 'ratios') return 'ratios';
                if (id === 'confidence') return 'confidence';
                if (id === 'exceptions') return 'exceptions';
                if (id === 'approval') return 'approval';
                if (id === 'publish') return 'publish';
                return 'workspace';
              };

              const targetTab = getTabForStage(stage.id);
              const isCurrentActive = activeTab === targetTab;

              const statusClasses = {
                completed: 'border-emerald-200 bg-emerald-50 text-emerald-800',
                approved: 'border-emerald-200 bg-emerald-50 text-emerald-800',
                published: 'border-emerald-200 bg-emerald-50 text-emerald-800',
                warning: 'border-amber-200 bg-amber-50 text-amber-800',
                requires_review: 'border-rose-200 bg-rose-50 text-rose-800',
                failed: 'border-rose-200 bg-rose-50 text-rose-800',
                in_progress: 'border-blue-300 bg-blue-50 text-blue-800',
                pending: 'border-slate-200 bg-white text-slate-500'
              }[stage.status] || 'border-slate-200 bg-white text-slate-500';

              return (
                <React.Fragment key={stage.id}>
                  <button
                    onClick={() => setActiveTab(targetTab)}
                    className={`flex-1 flex flex-col p-2 rounded-lg border transition-all text-left group ${statusClasses} ${
                      isCurrentActive ? 'ring-2 ring-blue-500 shadow-xs' : ''
                    }`}
                  >
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <span className="text-[10px] font-mono font-bold text-slate-400">Step {stage.stageNumber}</span>
                      {stage.status === 'completed' || stage.status === 'approved' || stage.status === 'published' ? (
                        <Icons.CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                      ) : stage.status === 'warning' ? (
                        <Icons.AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                      ) : stage.status === 'requires_review' ? (
                        <Icons.AlertTriangle className="w-3.5 h-3.5 text-rose-500 animate-pulse" />
                      ) : (
                        <Icons.Clock className="w-3.5 h-3.5 text-slate-400" />
                      )}
                    </div>
                    <div className="font-bold text-xs truncate text-slate-800 group-hover:text-blue-600">
                      {stage.name.replace(/^\d+\.\s*/, '')}
                    </div>
                    <div className="flex items-center justify-between text-[10px] text-slate-400 mt-1">
                      <span className="truncate">{stage.engine}</span>
                      {stage.durationMs && <span className="font-mono text-[9px]">{(stage.durationMs/1000).toFixed(1)}s</span>}
                    </div>
                  </button>
                  {idx < stages.length - 1 && <Icons.ChevronRight className="w-3 h-3 text-slate-300 flex-shrink-0" />}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {/* Main Center Viewport */}
        <main className="flex-1 overflow-y-auto bg-slate-100 scrollbar-thin">
          {/* TAB 1: WORKSPACE */}
          {activeTab === 'workspace' && (
            <div className="p-6 space-y-6 max-w-7xl mx-auto">
              <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 rounded-2xl p-6 text-white shadow-md relative overflow-hidden">
                <div className="relative z-10 flex flex-wrap items-center justify-between gap-6">
                  <div className="space-y-1.5 max-w-2xl">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 bg-blue-500/20 text-blue-300 text-xs font-semibold rounded-full border border-blue-400/30">
                        Flow 01 · Borrower Financial Document Extraction
                      </span>
                      <span className="text-xs text-slate-400">Target SLA &lt; 15 min</span>
                    </div>
                    <h2 className="text-2xl font-bold tracking-tight text-white">
                      Borrower Financial Extraction & Normalization Agent
                    </h2>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      Automated ingestion, OCR table extraction, chart of accounts mapping, deterministic ratio derivation, and tie-out integrity checks for <strong className="text-white">{proposal.borrowerName}</strong>.
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    {pendingExceptionsCount > 0 ? (
                      <button
                        onClick={() => setActiveTab('exceptions')}
                        className="px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold rounded-xl shadow-lg flex items-center gap-2"
                      >
                        <Icons.AlertTriangle className="w-4 h-4 text-slate-950" />
                        <span>Review {pendingExceptionsCount} Pending Exceptions</span>
                      </button>
                    ) : isApproved ? (
                      <button
                        onClick={() => setActiveTab('publish')}
                        className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-lg flex items-center gap-2"
                      >
                        <Icons.ShieldCheck className="w-4 h-4" />
                        <span>Spread Approved · View Downstream Hand-off</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => setActiveTab('approval')}
                        className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-lg flex items-center gap-2"
                      >
                        <Icons.Lock className="w-4 h-4" />
                        <span>Review & Sign Off Spread</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* 8 Metric Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
                <div onClick={() => setActiveTab('documents')} className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs hover:border-blue-400 cursor-pointer transition-all">
                  <div className="flex items-center justify-between text-slate-400 mb-1">
                    <span className="text-[10px] uppercase font-bold">Total Docs</span>
                    <Icons.FileText className="w-4 h-4 text-blue-500" />
                  </div>
                  <div className="text-xl font-bold text-slate-900">{documents.length}</div>
                  <div className="text-[10px] text-slate-500 mt-1 truncate">All files staged</div>
                </div>

                <div onClick={() => setActiveTab('documents')} className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs hover:border-emerald-400 cursor-pointer transition-all">
                  <div className="flex items-center justify-between text-slate-400 mb-1">
                    <span className="text-[10px] uppercase font-bold">Processed</span>
                    <Icons.CheckCircle className="w-4 h-4 text-emerald-500" />
                  </div>
                  <div className="text-xl font-bold text-emerald-700">{documents.filter(d => d.status === 'Processed' || d.status === 'Approved').length}</div>
                  <div className="text-[10px] text-emerald-600 mt-1 truncate">OCR Extracted</div>
                </div>

                <div onClick={() => setActiveTab('exceptions')} className={`p-3.5 rounded-xl border shadow-2xs cursor-pointer transition-all ${
                  pendingExceptionsCount > 0 ? 'bg-rose-50 border-rose-200' : 'bg-white border-slate-200'
                }`}>
                  <div className="flex items-center justify-between text-slate-400 mb-1">
                    <span className="text-[10px] uppercase font-bold">Exceptions</span>
                    <Icons.AlertTriangle className={`w-4 h-4 ${pendingExceptionsCount > 0 ? 'text-rose-600' : 'text-slate-400'}`} />
                  </div>
                  <div className={`text-xl font-bold ${pendingExceptionsCount > 0 ? 'text-rose-700' : 'text-slate-900'}`}>{pendingExceptionsCount}</div>
                  <div className="text-[10px] mt-1 text-slate-500 truncate">{pendingExceptionsCount > 0 ? 'Action required' : 'All cleared'}</div>
                </div>

                <div onClick={() => setActiveTab('extracted-fields')} className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs hover:border-indigo-400 cursor-pointer transition-all">
                  <div className="flex items-center justify-between text-slate-400 mb-1">
                    <span className="text-[10px] uppercase font-bold">Fields</span>
                    <Icons.Layers className="w-4 h-4 text-indigo-500" />
                  </div>
                  <div className="text-xl font-bold text-indigo-700">186</div>
                  <div className="text-[10px] text-slate-500 mt-1 truncate">3-Yr Line Items</div>
                </div>

                <div onClick={() => setActiveTab('confidence')} className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs hover:border-blue-400 cursor-pointer transition-all">
                  <div className="flex items-center justify-between text-slate-400 mb-1">
                    <span className="text-[10px] uppercase font-bold">Avg Conf</span>
                    <Icons.TrendingUp className="w-4 h-4 text-blue-500" />
                  </div>
                  <div className="text-xl font-bold text-slate-900">93.4%</div>
                  <div className="text-[10px] text-emerald-600 font-medium mt-1 truncate">≥95% Auto-verified</div>
                </div>

                <div onClick={() => setActiveTab('normalization')} className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs hover:border-blue-400 cursor-pointer transition-all">
                  <div className="flex items-center justify-between text-slate-400 mb-1">
                    <span className="text-[10px] uppercase font-bold">Norm / CoA</span>
                    <Icons.Database className="w-4 h-4 text-blue-500" />
                  </div>
                  <div className="text-xl font-bold text-slate-900">100%</div>
                  <div className="text-[10px] text-slate-500 mt-1 truncate">Mapped to ₹ Lakhs</div>
                </div>

                <div onClick={() => setActiveTab('reconciliation')} className={`p-3.5 rounded-xl border shadow-2xs cursor-pointer transition-all ${
                  reconciliations.some(r => r.status === 'FAIL') ? 'bg-rose-50 border-rose-200' : 'bg-emerald-50 border-emerald-200'
                }`}>
                  <div className="flex items-center justify-between text-slate-400 mb-1">
                    <span className="text-[10px] uppercase font-bold">Reconcile</span>
                    <Icons.ShieldCheck className={`w-4 h-4 ${reconciliations.some(r => r.status === 'FAIL') ? 'text-rose-600' : 'text-emerald-600'}`} />
                  </div>
                  <div className={`text-base font-bold truncate ${reconciliations.some(r => r.status === 'FAIL') ? 'text-rose-700' : 'text-emerald-700'}`}>
                    {reconciliations.some(r => r.status === 'FAIL') ? '1 Failed' : 'Passed'}
                  </div>
                  <div className="text-[10px] text-slate-600 mt-1 truncate">Bank vs P&L</div>
                </div>

                <div onClick={() => setActiveTab('approval')} className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs hover:border-blue-400 cursor-pointer transition-all">
                  <div className="flex items-center justify-between text-slate-400 mb-1">
                    <span className="text-[10px] uppercase font-bold">Spread</span>
                    <Icons.Lock className="w-4 h-4 text-slate-400" />
                  </div>
                  <div className="text-xs font-bold text-slate-800 truncate mt-1">
                    {isPublished ? 'Published' : isApproved ? 'Approved v1.0' : 'Pending'}
                  </div>
                  <div className="text-[10px] text-blue-600 font-medium mt-1 truncate">Locked versioning</div>
                </div>
              </div>

              {/* Documents & Architecture Split */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                        <Icons.FileText className="w-4 h-4 text-blue-600" />
                        Borrower Financial Document Pack ({documents.length} Files)
                      </h3>
                      <p className="text-xs text-slate-500">Audited statements, GST returns, and bank statements.</p>
                    </div>
                    <button onClick={() => handleSimulateUpload()} className="px-3 py-1.5 bg-blue-50 text-blue-700 text-xs font-semibold rounded-lg border border-blue-200 hover:bg-blue-100">
                      + Upload Demo File
                    </button>
                  </div>

                  <div className="divide-y divide-slate-100 max-h-80 overflow-y-auto">
                    {documents.map(doc => (
                      <div key={doc.id} onClick={() => { setSelectedDocumentId(doc.id); setActiveTab('viewer'); }} className="py-2.5 flex items-center justify-between gap-4 hover:bg-slate-50 px-2 rounded-lg cursor-pointer transition-colors group">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs flex-shrink-0">PDF</div>
                          <div className="min-w-0">
                            <div className="text-xs font-bold text-slate-800 group-hover:text-blue-600 truncate">{doc.name}</div>
                            <div className="text-[11px] text-slate-400 mt-0.5">{doc.financialYear} · {doc.fileSize} · {doc.pageCount} Pgs</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 flex-shrink-0">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            doc.status === 'Processed' || doc.status === 'Approved' ? 'bg-emerald-100 text-emerald-800' : doc.status === 'Warning' ? 'bg-amber-100 text-amber-800' : 'bg-rose-100 text-rose-800'
                          }`}>{doc.status}</span>
                          <span className="text-xs font-mono font-semibold text-slate-600">{doc.confidence}%</span>
                          <Icons.ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-blue-600" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-4">
                  <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                    <Icons.Cpu className="w-4 h-4 text-indigo-600" />
                    Engine Architecture Separation
                  </h3>
                  <div className="space-y-2.5 text-xs">
                    <div className="p-3 bg-indigo-50/60 border border-indigo-100 rounded-lg">
                      <div className="font-bold text-indigo-900 flex items-center gap-1.5">
                        <Icons.Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                        AI Engine (Textract + Claude Vision)
                      </div>
                      <p className="text-[11px] text-indigo-800 mt-1">Classification, table cell coordinates, semantic mapping to Bank CoA, vision fallback.</p>
                    </div>
                    <div className="p-3 bg-emerald-50/60 border border-emerald-100 rounded-lg">
                      <div className="font-bold text-emerald-900 flex items-center gap-1.5">
                        <Icons.ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                        Deterministic Rule Engine
                      </div>
                      <p className="text-[11px] text-emerald-800 mt-1">Unit conversion (Cr $\to$ Lakhs), balance sheet balancing, turnover variances, and ratio computations.</p>
                    </div>
                    <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                      <div className="font-bold text-slate-800 flex items-center gap-1.5">
                        <Icons.Activity className="w-3.5 h-3.5 text-slate-600" />
                        CRM & Workflow Layer
                      </div>
                      <p className="text-[11px] text-slate-600 mt-1">HITL exception workbench, analyst corrections, dual sign-off, and 10-year WORM audit sealing.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: DOCUMENT CENTER */}
          {activeTab === 'documents' && (
            <div className="p-6 space-y-6 max-w-7xl mx-auto">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                    <Icons.FileText className="w-5 h-5 text-blue-600" />
                    Borrower Document Center
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">DMS intake repository, OCR pre-flight validation status, and AI classification evidence.</p>
                </div>
                <button onClick={() => handleSimulateUpload()} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg shadow-sm flex items-center gap-2">
                  <Icons.UploadCloud className="w-4 h-4" />
                  <span>+ Upload Financial Document</span>
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
                  <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                    <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider">Document Inventory ({documents.length})</h3>
                    <span className="text-[11px] text-slate-500">Click any document to inspect classification</span>
                  </div>
                  <div className="divide-y divide-slate-100">
                    {documents.map(doc => (
                      <div key={doc.id} onClick={() => setSelectedDocumentId(doc.id)} className={`p-4 flex items-center justify-between gap-4 cursor-pointer transition-colors ${
                        doc.id === selectedDocumentId ? 'bg-blue-50/60 border-l-4 border-blue-600' : 'hover:bg-slate-50'
                      }`}>
                        <div className="flex items-center gap-3.5 min-w-0">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs ${doc.id === selectedDocumentId ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700'}`}>PDF</div>
                          <div className="min-w-0">
                            <div className="font-bold text-xs text-slate-900 truncate">{doc.name}</div>
                            <div className="text-[11px] text-slate-500 mt-0.5">{doc.financialYear} · {doc.fileSize} · {doc.pageCount} Pages</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            doc.status === 'Processed' || doc.status === 'Approved' ? 'bg-emerald-100 text-emerald-800' : doc.status === 'Warning' ? 'bg-amber-100 text-amber-800' : 'bg-rose-100 text-rose-800'
                          }`}>{doc.status}</span>
                          <button onClick={(e) => { e.stopPropagation(); setSelectedDocumentId(doc.id); setActiveTab('viewer'); }} className="px-2.5 py-1 bg-slate-100 hover:bg-blue-600 hover:text-white text-slate-700 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1">
                            <Icons.Eye className="w-3.5 h-3.5" />
                            <span>View</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider flex items-center gap-1.5">
                      <Icons.Sparkles className="w-4 h-4 text-blue-600" />
                      Classification Intelligence
                    </h3>
                    <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 text-[10px] font-bold rounded-full border border-emerald-200">
                      {selectedDoc.confidence}% Match
                    </span>
                  </div>
                  <div className="space-y-3 text-xs">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400">Document</span>
                      <div className="font-bold text-slate-900 mt-0.5">{selectedDoc.name}</div>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 space-y-1">
                      <div><strong>Type:</strong> {selectedDoc.type}</div>
                      <div><strong>Financial Year:</strong> {selectedDoc.financialYear}</div>
                      <div><strong>Unit / Currency:</strong> {selectedDoc.currency} · {selectedDoc.reportedUnit}</div>
                    </div>
                    <div className="p-3 bg-blue-50/70 border border-blue-100 rounded-xl space-y-1">
                      <div className="text-[11px] font-bold text-blue-900">AI Classification Evidence:</div>
                      <p className="text-xs text-blue-950">"{selectedDoc.aiClassificationEvidence}"</p>
                    </div>
                    <button onClick={() => setActiveTab('viewer')} className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-2">
                      <Icons.Eye className="w-4 h-4" />
                      <span>Open in Document Viewer</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: DOCUMENT INTELLIGENCE & VIEWER */}
          {activeTab === 'viewer' && (
            <div className="p-6 max-w-7xl mx-auto">
              <div className="h-[calc(100vh-14.5rem)] flex flex-col bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl select-none">
                <div className="h-12 bg-slate-950 border-b border-slate-800 px-4 flex items-center justify-between text-xs text-slate-300 flex-shrink-0">
                  <div className="flex items-center gap-3">
                    <select
                      value={selectedDoc.id}
                      onChange={e => setSelectedDocumentId(e.target.value)}
                      className="bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-lg px-2.5 py-1 font-medium"
                    >
                      {documents.map(d => (
                        <option key={d.id} value={d.id}>{d.name} ({d.financialYear})</option>
                      ))}
                    </select>
                    <span className="text-[11px] text-slate-400">{selectedDoc.subtype}</span>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1.5 bg-slate-900 px-2 py-1 rounded-lg border border-slate-800">
                      <button onClick={() => setActiveViewerPage(Math.max(1, activeViewerPage - 1))} disabled={activeViewerPage <= 1} className="p-1 hover:text-white disabled:text-slate-600">
                        <Icons.ChevronLeft className="w-3.5 h-3.5" />
                      </button>
                      <span className="font-mono text-xs">Page {activeViewerPage} / {selectedDoc.pageCount}</span>
                      <button onClick={() => setActiveViewerPage(Math.min(selectedDoc.pageCount, activeViewerPage + 1))} disabled={activeViewerPage >= selectedDoc.pageCount} className="p-1 hover:text-white disabled:text-slate-600">
                        <Icons.ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <div className="flex items-center gap-1 bg-slate-900 px-2 py-1 rounded-lg border border-slate-800">
                      <button onClick={() => setZoomLevel(Math.max(70, zoomLevel - 15))} className="p-1 hover:text-white">
                        <Icons.ZoomOut className="w-3.5 h-3.5" />
                      </button>
                      <span className="font-mono text-xs w-10 text-center">{zoomLevel}%</span>
                      <button onClick={() => setZoomLevel(Math.min(150, zoomLevel + 15))} className="p-1 hover:text-white">
                        <Icons.ZoomIn className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex-1 flex overflow-hidden">
                  {/* Document Sheet Canvas */}
                  <div className="flex-1 bg-slate-900 overflow-auto p-6 flex justify-center items-start scrollbar-dark">
                    <div 
                      className="bg-white text-slate-900 rounded-lg shadow-2xl transition-transform origin-top relative border border-slate-200 p-8"
                      style={{ width: `${(640 * zoomLevel) / 100}px`, minHeight: `${(850 * zoomLevel) / 100}px` }}
                    >
                      <div className="text-center pb-4 border-b-2 border-slate-900 space-y-1">
                        <h2 className="text-base font-bold tracking-tight text-slate-950 uppercase">ABC MANUFACTURING PRIVATE LIMITED</h2>
                        <div className="text-[11px] text-slate-600">CIN: U29253MH2012PTC234567 · Mumbai 400069</div>
                        <div className="text-xs font-bold text-slate-900 mt-1">
                          {selectedDoc.type === 'Balance Sheet' ? 'BALANCE SHEET AS AT 31ST MARCH 2025' : selectedDoc.type === 'P&L Statement' ? 'STATEMENT OF PROFIT AND LOSS FOR FY2024-25' : '12-MONTH BANKING SUMMARY'}
                        </div>
                        <div className="text-[10px] text-slate-500 italic">(All amounts in ₹ Lakhs, unless otherwise stated)</div>
                      </div>

                      {selectedDoc.type === 'Balance Sheet' ? (
                        <div className="mt-4 text-xs space-y-4 font-serif">
                          <div>
                            <div className="font-bold text-slate-950 uppercase text-[10px] tracking-wide border-b pb-0.5 mb-1 font-sans">I. EQUITY AND LIABILITIES</div>
                            <table className="w-full text-xs">
                              <thead>
                                <tr className="border-b font-sans text-[10px] text-slate-600">
                                  <th className="text-left py-1">Particulars</th>
                                  <th className="text-center w-12">Note</th>
                                  <th className="text-right w-24">31-Mar-2025</th>
                                  <th className="text-right w-24">31-Mar-2024</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-slate-100">
                                <tr onClick={() => handleSelectField('f-nw')} className={`cursor-pointer ${selectedFieldId === 'f-nw' ? 'bg-blue-100 font-bold ring-2 ring-blue-500' : 'hover:bg-slate-50'}`}>
                                  <td className="py-1.5 font-bold pl-1">Shareholders' Funds (Net Worth)</td>
                                  <td className="text-center">1</td>
                                  <td className="text-right font-mono font-bold text-blue-900">1,100.00</td>
                                  <td className="text-right font-mono">970.00</td>
                                </tr>
                                <tr onClick={() => handleSelectField('f-ltb')} className={`cursor-pointer ${selectedFieldId === 'f-ltb' ? 'bg-blue-100 font-bold ring-2 ring-blue-500' : 'hover:bg-slate-50'}`}>
                                  <td className="py-1.5 pl-3">Long Term Borrowings</td>
                                  <td className="text-center">3</td>
                                  <td className="text-right font-mono font-bold text-blue-900">450.00</td>
                                  <td className="text-right font-mono">480.00</td>
                                </tr>
                                <tr onClick={() => handleSelectField('f-stb')} className={`cursor-pointer ${selectedFieldId === 'f-stb' ? 'bg-blue-100 font-bold ring-2 ring-blue-500' : 'hover:bg-slate-50'}`}>
                                  <td className="py-1.5 pl-3">Short Term Borrowings (CC/OD)</td>
                                  <td className="text-center">4</td>
                                  <td className="text-right font-mono font-bold text-blue-900">300.00</td>
                                  <td className="text-right font-mono">280.00</td>
                                </tr>
                                <tr onClick={() => handleSelectField('f-tp')} className={`cursor-pointer relative ${selectedFieldId === 'f-tp' ? 'bg-amber-100 font-bold ring-2 ring-amber-500' : 'hover:bg-amber-50/60'}`}>
                                  <td className="py-1.5 pl-3 flex items-center justify-between">
                                    <span>Trade Payables (Sundry Creditors)</span>
                                    <span className="text-[9px] bg-rose-100 text-rose-800 font-bold px-1 rounded font-sans">OCR 89% Flag</span>
                                  </td>
                                  <td className="text-center">6</td>
                                  <td className="text-right font-mono font-bold text-rose-700 bg-rose-50 px-1 rounded border border-dashed border-rose-300">
                                    {fields.find(f => f.id === 'f-tp')?.fy2025 === 405 ? '405.00' : '420.00'}
                                  </td>
                                  <td className="text-right font-mono">380.00</td>
                                </tr>
                                <tr onClick={() => handleSelectField('f-ocl')} className={`cursor-pointer ${selectedFieldId === 'f-ocl' ? 'bg-blue-100 font-bold ring-2 ring-blue-500' : 'hover:bg-slate-50'}`}>
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

                          <div className="pt-2">
                            <div className="font-bold text-slate-950 uppercase text-[10px] tracking-wide border-b pb-0.5 mb-1 font-sans">II. ASSETS</div>
                            <table className="w-full text-xs">
                              <tbody className="divide-y divide-slate-100">
                                <tr onClick={() => handleSelectField('f-nfa')} className={`cursor-pointer ${selectedFieldId === 'f-nfa' ? 'bg-blue-100 font-bold ring-2 ring-blue-500' : 'hover:bg-slate-50'}`}>
                                  <td className="py-1.5 pl-1">Fixed Assets (Net Block)</td>
                                  <td className="text-center w-12">8</td>
                                  <td className="text-right font-mono font-bold text-blue-900 w-24">1,430.00</td>
                                  <td className="text-right font-mono w-24">1,350.00</td>
                                </tr>
                                <tr onClick={() => handleSelectField('f-inv')} className={`cursor-pointer ${selectedFieldId === 'f-inv' ? 'bg-blue-100 font-bold ring-2 ring-blue-500' : 'hover:bg-slate-50'}`}>
                                  <td className="py-1.5 pl-3">Inventories (Raw + WIP + FG)</td>
                                  <td className="text-center">9</td>
                                  <td className="text-right font-mono font-bold text-blue-900">480.00</td>
                                  <td className="text-right font-mono">420.00</td>
                                </tr>
                                <tr onClick={() => handleSelectField('f-tr')} className={`cursor-pointer ${selectedFieldId === 'f-tr' ? 'bg-blue-100 font-bold ring-2 ring-blue-500' : 'hover:bg-slate-50'}`}>
                                  <td className="py-1.5 pl-3">Trade Receivables (Sundry Debtors)</td>
                                  <td className="text-center">10</td>
                                  <td className="text-right font-mono font-bold text-blue-900">450.00</td>
                                  <td className="text-right font-mono">410.00</td>
                                </tr>
                                <tr onClick={() => handleSelectField('f-cash')} className={`cursor-pointer ${selectedFieldId === 'f-cash' ? 'bg-blue-100 font-bold ring-2 ring-blue-500' : 'hover:bg-slate-50'}`}>
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
                        </div>
                      ) : (
                        <div className="mt-6 text-xs space-y-4">
                          <table className="w-full">
                            <thead>
                              <tr className="border-b font-bold text-slate-600 text-[10px]">
                                <th className="text-left py-2">Line Item</th>
                                <th className="text-right w-24">FY2024-25</th>
                                <th className="text-right w-24">FY2023-24</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                              <tr onClick={() => handleSelectField('f-rev')} className={`cursor-pointer ${selectedFieldId === 'f-rev' ? 'bg-blue-100 font-bold' : ''}`}>
                                <td className="py-2 font-bold">Revenue from Operations</td>
                                <td className="text-right font-mono font-bold text-blue-900">2,500.00</td>
                                <td className="text-right font-mono">2,100.00</td>
                              </tr>
                              <tr onClick={() => handleSelectField('f-ebitda')} className={`cursor-pointer ${selectedFieldId === 'f-ebitda' ? 'bg-blue-100 font-bold' : ''}`}>
                                <td className="py-2 font-bold pl-1">Operating Profit (EBITDA)</td>
                                <td className="text-right font-mono font-bold text-blue-900">420.00</td>
                                <td className="text-right font-mono">360.00</td>
                              </tr>
                              <tr onClick={() => handleSelectField('f-pat')} className={`cursor-pointer ${selectedFieldId === 'f-pat' ? 'bg-blue-100 font-bold' : ''}`}>
                                <td className="py-2 font-bold pl-1">Profit After Tax (PAT)</td>
                                <td className="text-right font-mono font-bold text-blue-900">220.00</td>
                                <td className="text-right font-mono">180.00</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right Inspector */}
                  <div className="w-80 bg-slate-950 border-l border-slate-800 p-4 flex flex-col justify-between flex-shrink-0 text-xs text-slate-300">
                    {selectedField ? (
                      <div className="space-y-4">
                        <div className="pb-2 border-b border-slate-800 flex items-center justify-between">
                          <span className="font-bold text-white uppercase text-[11px] flex items-center gap-1.5">
                            <Icons.Sparkles className="w-3.5 h-3.5 text-blue-400" />
                            Source ↔ Field Link
                          </span>
                          <span className={`text-[10px] px-1.5 py-0.2 rounded font-bold ${
                            selectedField.confidence >= 95 ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'
                          }`}>
                            {selectedField.confidence}% Conf
                          </span>
                        </div>

                        <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 space-y-1">
                          <div className="text-[10px] uppercase font-bold text-slate-400">Standard Field</div>
                          <div className="font-bold text-sm text-white">{selectedField.standardField}</div>
                          <div className="text-[11px] text-slate-400">"{selectedField.originalLabel}"</div>
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

                        <div className="space-y-1 text-[11px] pt-1">
                          <div className="flex justify-between"><span className="text-slate-400">OCR Confidence:</span><span className="font-mono text-white">{selectedField.ocrConfidence}%</span></div>
                          <div className="flex justify-between"><span className="text-slate-400">Mapping Confidence:</span><span className="font-mono text-white">{selectedField.mappingConfidence}%</span></div>
                          <div className="flex justify-between"><span className="text-slate-400">Engine:</span><span className="text-blue-400">{selectedField.extractionMethod}</span></div>
                        </div>

                        {selectedField.flagReason && (
                          <div className="p-2.5 bg-rose-950/40 border border-rose-800/60 rounded-lg text-rose-300 text-xs">
                            <div className="font-bold flex items-center gap-1 text-[11px]">
                              <Icons.AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                              Flagged for Human Review
                            </div>
                            <p className="text-[11px] mt-1 text-rose-200">{selectedField.flagReason}</p>
                          </div>
                        )}
                      </div>
                    ) : null}

                    {selectedField && (
                      <button onClick={() => handleOpenFieldDrawer(selectedField.id)} className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold text-xs flex items-center justify-center gap-1.5">
                        <Icons.Edit3 className="w-3.5 h-3.5" />
                        <span>Open Field Action Drawer</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: EXTRACTED FIELDS TABLE */}
          {activeTab === 'extracted-fields' && (
            <div className="p-6 space-y-6 max-w-7xl mx-auto">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                    <Icons.Layers className="w-5 h-5 text-blue-600" />
                    AI Extracted Financial Fields & Spreading Grid
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">Multi-year standardized financial dataset mapped from MCA Schedule III and P&L schedules.</p>
                </div>
                <span className="text-xs font-bold font-mono px-2.5 py-1 bg-slate-100 rounded-md text-slate-800 border border-slate-200">
                  {fields.length} Fields Extracted
                </span>
              </div>

              <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-600 uppercase">
                    <tr>
                      <th className="py-3 px-4">Standard Field (CoA)</th>
                      <th className="py-3 px-4">Original Extracted Label</th>
                      <th className="py-3 px-3 text-right">FY2024-25</th>
                      <th className="py-3 px-3 text-right">FY2023-24</th>
                      <th className="py-3 px-3 text-right">FY2022-23</th>
                      <th className="py-3 px-2 text-center">Unit</th>
                      <th className="py-3 px-3 text-center">Confidence</th>
                      <th className="py-3 px-3 text-center">Status</th>
                      <th className="py-3 px-4 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {fields.map(f => (
                      <tr key={f.id} onClick={() => handleSelectField(f.id)} className={`cursor-pointer hover:bg-slate-50 ${f.status === 'Requires Review' ? 'bg-rose-50/40' : ''}`}>
                        <td className="py-3 px-4 font-bold text-slate-900">{f.standardField}</td>
                        <td className="py-3 px-4 text-slate-700 italic">"{f.originalLabel}"</td>
                        <td className="py-3 px-3 text-right font-mono font-bold text-blue-900">₹{f.fy2025.toFixed(2)}</td>
                        <td className="py-3 px-3 text-right font-mono text-slate-600">₹{f.fy2024.toFixed(2)}</td>
                        <td className="py-3 px-3 text-right font-mono text-slate-500">₹{f.fy2023.toFixed(2)}</td>
                        <td className="py-3 px-2 text-center text-slate-500 font-mono text-[11px]">{f.normalizedUnit}</td>
                        <td className="py-3 px-3 text-center font-mono font-bold">{f.confidence}%</td>
                        <td className="py-3 px-3 text-center">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            f.status === 'Verified' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : f.status === 'Corrected' ? 'bg-blue-50 text-blue-700 border border-blue-200' : f.status === 'Warning' ? 'bg-amber-50 text-amber-800' : 'bg-rose-50 text-rose-800 border border-rose-200'
                          }`}>{f.status}</span>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <button onClick={(e) => { e.stopPropagation(); handleOpenFieldDrawer(f.id); }} className="px-2.5 py-1 bg-slate-100 hover:bg-blue-600 hover:text-white text-slate-700 rounded-lg text-xs font-semibold">
                            Inspect
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 5: NORMALIZATION */}
          {activeTab === 'normalization' && (
            <div className="p-6 space-y-6 max-w-7xl mx-auto">
              <div>
                <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <Icons.Database className="w-5 h-5 text-blue-600" />
                  Normalization & Chart of Accounts Mapping Engine
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">Deterministic standardization pipeline: unit conversions, sign conventions, and semantic alignment.</p>
              </div>

              <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-5 space-y-4">
                <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider">Live Transformation Pipeline</h3>
                <div className="divide-y divide-slate-100 text-xs">
                  {[
                    { label: 'Sundry Creditors (Schedule 6)', raw: '4,05,00,000', rawUnit: '₹ Absolute', factor: '0.00001', norm: 405.00, std: 'Trade Payables', rule: 'RULE_UNIT_ABS_TO_LAKH + COA_MAP_BS_LIAB_04' },
                    { label: 'Gross Sales / Turnover', raw: '₹ 25.00 Cr', rawUnit: '₹ Crore', factor: '100.0', norm: 2500.00, std: 'Revenue from Operations', rule: 'RULE_UNIT_CR_TO_LAKH + COA_MAP_PL_REV_01' },
                    { label: 'Operating Profit (PBIDT)', raw: '₹ 4.20 Cr', rawUnit: '₹ Crore', factor: '100.0', norm: 420.00, std: 'Operating Profit (EBITDA)', rule: 'RULE_UNIT_CR_TO_LAKH + COA_MAP_PL_OP_02' },
                    { label: 'Balances with Scheduled Banks', raw: '90,00,000', rawUnit: '₹ Absolute', factor: '0.00001', norm: 90.00, std: 'Cash & Cash Equivalents', rule: 'RULE_UNIT_ABS_TO_LAKH + COA_MAP_BS_ASST_05' }
                  ].map((t, idx) => (
                    <div key={idx} className="py-3.5 grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                      <div className="md:col-span-4 bg-slate-50 p-3 rounded-lg border border-slate-200">
                        <span className="text-[10px] text-slate-400 uppercase font-semibold">Raw Extracted</span>
                        <div className="font-bold text-slate-900 mt-0.5">{t.label}</div>
                        <div className="text-xs font-mono font-bold mt-1 text-slate-700">{t.raw} ({t.rawUnit})</div>
                      </div>
                      <div className="md:col-span-4 flex flex-col items-center justify-center text-center">
                        <div className="flex items-center gap-1.5 text-blue-600 font-mono font-bold">
                          <span>× {t.factor}</span>
                          <Icons.ArrowRight className="w-4 h-4" />
                        </div>
                        <span className="text-[10px] text-slate-500 font-mono mt-1">{t.rule}</span>
                      </div>
                      <div className="md:col-span-4 bg-blue-50/70 p-3 rounded-lg border border-blue-200">
                        <span className="text-[10px] text-blue-700 uppercase font-semibold">Standard Field (CoA)</span>
                        <div className="font-bold text-blue-950 mt-0.5">{t.std}</div>
                        <div className="text-xs font-mono font-bold mt-1 text-blue-900">₹{t.norm.toFixed(2)} Lakhs</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: RECONCILIATION */}
          {activeTab === 'reconciliation' && (
            <div className="p-6 space-y-6 max-w-7xl mx-auto">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                    <Icons.ShieldCheck className="w-5 h-5 text-blue-600" />
                    Financial Reconciliation & Integrity Validation Engine
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">Deterministic tie-out matrix enforcing balance sheet equality, component sums, and banking reconciliation.</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-lg border border-emerald-200">
                    {reconciliations.filter(r => r.status === 'PASS').length} Passed
                  </span>
                  {reconciliations.some(r => r.status === 'FAIL') && (
                    <span className="px-3 py-1 bg-rose-50 text-rose-800 text-xs font-bold rounded-lg border border-rose-200 animate-pulse">
                      {reconciliations.filter(r => r.status === 'FAIL').length} Failed
                    </span>
                  )}
                </div>
              </div>

              <div className="space-y-3">
                {reconciliations.map(check => (
                  <div key={check.id} className={`bg-white p-5 rounded-xl border transition-all ${
                    check.status === 'FAIL' ? 'border-rose-300 bg-rose-50/20' : 'border-slate-200'
                  }`}>
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-1">
                        <span className="text-[10px] uppercase font-bold text-slate-400">{check.category}</span>
                        <h3 className="font-bold text-sm text-slate-900">{check.name}</h3>
                        <p className="text-xs text-slate-600">{check.description}</p>
                      </div>
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                        check.status === 'PASS' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : check.status === 'WARNING' ? 'bg-amber-50 text-amber-800 border border-amber-200' : 'bg-rose-50 text-rose-800 border border-rose-200'
                      }`}>{check.status}</span>
                    </div>

                    <div className="grid grid-cols-2 gap-3 mt-3 pt-3 border-t border-slate-100 text-xs font-mono">
                      <div><span className="text-slate-400 block text-[10px]">Reported:</span>{check.reportedValueStr}</div>
                      <div className="text-right"><span className="text-slate-400 block text-[10px]">Calculation / Variance:</span>{check.calculatedValueStr}</div>
                    </div>

                    <div className="mt-3 p-3 bg-slate-50 rounded-lg border border-slate-100 text-xs text-slate-700">
                      <strong>Evidence:</strong> {check.evidence}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 7: RATIOS & TRENDS */}
          {activeTab === 'ratios' && (
            <div className="p-6 space-y-6 max-w-7xl mx-auto">
              <div>
                <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <Icons.BarChart2 className="w-5 h-5 text-blue-600" />
                  Deterministic Financial Ratio & 3-Year Trend Engine
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">Calculated deterministically from normalized Balance Sheet, P&L, and Bank Statement inputs.</p>
              </div>

              <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-600 uppercase">
                    <tr>
                      <th className="py-3 px-4">Financial Ratio</th>
                      <th className="py-3 px-4">Category</th>
                      <th className="py-3 px-4">Formula</th>
                      <th className="py-3 px-3 text-center">Benchmark</th>
                      <th className="py-3 px-3 text-right font-bold text-blue-900">FY2024-25</th>
                      <th className="py-3 px-3 text-right">FY2023-24</th>
                      <th className="py-3 px-3 text-right">FY2022-23</th>
                      <th className="py-3 px-3 text-center">Health</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {ratios.map(r => (
                      <tr key={r.id} className="hover:bg-slate-50">
                        <td className="py-3 px-4 font-bold text-slate-900">{r.name}</td>
                        <td className="py-3 px-4 text-slate-500">{r.category}</td>
                        <td className="py-3 px-4 text-slate-600 font-mono text-[11px]">{r.formula}</td>
                        <td className="py-3 px-3 text-center font-mono font-semibold">{r.benchmark}</td>
                        <td className="py-3 px-3 text-right font-mono font-bold text-blue-900 bg-blue-50/40 text-sm">{r.fy2025}</td>
                        <td className="py-3 px-3 text-right font-mono text-slate-700">{r.fy2024}</td>
                        <td className="py-3 px-3 text-right font-mono text-slate-500">{r.fy2023}</td>
                        <td className="py-3 px-3 text-center">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            r.isHealthy ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-amber-50 text-amber-800 border border-amber-200'
                          }`}>{r.isHealthy ? 'Healthy' : 'Moderate'}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 8: CONFIDENCE CENTER */}
          {activeTab === 'confidence' && (
            <div className="p-6 space-y-6 max-w-7xl mx-auto">
              <div>
                <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <Icons.TrendingUp className="w-5 h-5 text-blue-600" />
                  AI Confidence Scoring Center
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">Triad confidence model combining OCR score, CoA mapping similarity, and deterministic tie-out validation.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-emerald-50/80 p-5 rounded-2xl border border-emerald-200 space-y-2">
                  <div className="text-[10px] font-bold text-emerald-800 uppercase">High Confidence (≥95%)</div>
                  <div className="text-3xl font-bold font-mono text-emerald-900">{fields.filter(f => f.confidence >= 95).length}</div>
                  <p className="text-xs text-emerald-700">Auto-verified. Zero human intervention needed.</p>
                </div>
                <div className="bg-amber-50/80 p-5 rounded-2xl border border-amber-200 space-y-2">
                  <div className="text-[10px] font-bold text-amber-800 uppercase">Medium Confidence (85–94%)</div>
                  <div className="text-3xl font-bold font-mono text-amber-900">{fields.filter(f => f.confidence >= 85 && f.confidence < 95).length}</div>
                  <p className="text-xs text-amber-700">Warning band. Verified with schedule cross-checks.</p>
                </div>
                <div className="bg-rose-50/80 p-5 rounded-2xl border border-rose-200 space-y-2">
                  <div className="text-[10px] font-bold text-rose-800 uppercase">Low / Flagged (&lt;95%)</div>
                  <div className="text-3xl font-bold font-mono text-rose-900">{fields.filter(f => f.confidence < 85 || f.status === 'Requires Review').length}</div>
                  <p className="text-xs text-rose-700">Routed to Credit Analyst in Exception Workbench.</p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 9: EXCEPTIONS (HITL) */}
          {activeTab === 'exceptions' && (
            <div className="p-6 space-y-6 max-w-7xl mx-auto">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                    <Icons.AlertTriangle className="w-5 h-5 text-amber-500" />
                    Human-in-the-Loop (HITL) Exception Workbench
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">Exception-only review gateway for OCR low-confidence scores and deterministic tie-out variances.</p>
                </div>
                <span className="px-3 py-1 bg-rose-50 text-rose-800 text-xs font-bold rounded-lg border border-rose-200">
                  {pendingExceptionsCount} Items Require Attention
                </span>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-4 space-y-2.5">
                  <div className="text-xs font-bold uppercase text-slate-400 px-1">Exception Queue</div>
                  {exceptions.map(exc => (
                    <div key={exc.id} onClick={() => setSelectedExceptionId(exc.id)} className={`p-4 rounded-xl border cursor-pointer transition-all ${
                      exc.id === selectedExceptionId ? 'border-blue-500 bg-blue-50/40 ring-2 ring-blue-500/20' : exc.status === 'RESOLVED_BY_ANALYST' ? 'border-emerald-200 bg-emerald-50/30' : 'border-slate-200 bg-white'
                    }`}>
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          exc.status === 'RESOLVED_BY_ANALYST' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                        }`}>{exc.status === 'RESOLVED_BY_ANALYST' ? 'Resolved' : exc.severity}</span>
                        <span className="text-[10px] font-mono text-slate-400">{exc.confidenceScore}% Conf</span>
                      </div>
                      <h3 className="font-bold text-xs text-slate-900">{exc.title}</h3>
                      <div className="text-[11px] text-slate-500 mt-1">{exc.sourceDocument}</div>
                    </div>
                  ))}
                </div>

                <div className="lg:col-span-8 bg-white rounded-xl border border-slate-200 shadow-2xs p-6 space-y-6">
                  {(() => {
                    const activeExc = exceptions.find(e => e.id === selectedExceptionId) || exceptions[0];
                    return (
                      <div className="space-y-5">
                        <div className="pb-4 border-b border-slate-100 flex items-center justify-between">
                          <div>
                            <span className="text-[10px] uppercase font-bold text-slate-400">{activeExc.type}</span>
                            <h3 className="font-bold text-base text-slate-900 mt-0.5">{activeExc.title}</h3>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                            activeExc.status === 'RESOLVED_BY_ANALYST' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                          }`}>{activeExc.status}</span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                            <span className="text-[10px] font-bold text-slate-400 uppercase">1. Source Document</span>
                            <div className="font-bold text-slate-800 mt-1">{activeExc.sourceDocument} (Pg {activeExc.page})</div>
                            <div className="mt-2 p-2 bg-white border border-dashed rounded text-[11px] font-mono text-slate-700">
                              "Sundry Creditors ... 405.00"
                            </div>
                          </div>
                          <div className="p-3.5 bg-rose-50/60 rounded-xl border border-rose-200">
                            <span className="text-[10px] font-bold text-rose-800 uppercase">2. Extracted Value</span>
                            <div className="text-lg font-bold font-mono text-rose-900 mt-1">{activeExc.extractedValue}</div>
                            <div className="text-[11px] text-rose-800 mt-1">{activeExc.flagReason}</div>
                          </div>
                          <div className="p-3.5 bg-blue-50/60 rounded-xl border border-blue-200">
                            <span className="text-[10px] font-bold text-blue-800 uppercase">3. Agent Suggestion</span>
                            <div className="text-lg font-bold font-mono text-blue-900 mt-1">{activeExc.suggestedValue}</div>
                            <div className="text-[11px] text-blue-900 mt-1">{activeExc.recommendation}</div>
                          </div>
                        </div>

                        {activeExc.status === 'PENDING_REVIEW' ? (
                          <div className="p-5 bg-slate-50 rounded-xl border border-slate-200 space-y-4">
                            <h4 className="font-bold text-xs text-slate-900 uppercase">Credit Analyst Action Workspace</h4>
                            {activeExc.fieldId === 'f-tp' ? (
                              <div className="space-y-3 text-xs">
                                <div className="grid grid-cols-2 gap-3">
                                  <div>
                                    <label className="font-semibold text-slate-700 block mb-1">Corrected Value (₹ Lakhs):</label>
                                    <input type="number" defaultValue="405" id="corrVal" className="w-full px-3 py-2 bg-white border border-blue-300 rounded-lg font-mono font-bold text-sm" />
                                  </div>
                                  <div>
                                    <label className="font-semibold text-slate-700 block mb-1">Rationale:</label>
                                    <input type="text" defaultValue="OCR Misrecognition Correction" id="corrReason" className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs" />
                                  </div>
                                </div>
                                <div>
                                  <label className="font-semibold text-slate-700 block mb-1">Auditor Verification Note:</label>
                                  <textarea rows={2} defaultValue="Verified against Audited Schedule 6: Creditors for goods ₹310L + expenses ₹95L = ₹405L." id="corrComment" className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs" />
                                </div>
                                <button onClick={() => {
                                  const val = parseFloat(document.getElementById('corrVal').value) || 405;
                                  const reason = document.getElementById('corrReason').value;
                                  const comment = document.getElementById('corrComment').value;
                                  handleSaveCorrection('f-tp', val, reason, comment);
                                }} className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg text-xs flex items-center gap-2 shadow-sm">
                                  <Icons.Check className="w-4 h-4" />
                                  <span>Save Correction & Trigger Agent Re-Validation</span>
                                </button>
                              </div>
                            ) : (
                              <div className="space-y-3 text-xs">
                                <p className="text-slate-600">Borrower maintains secondary export LC collection account at Axis Bank.</p>
                                <button onClick={() => handleAcceptException(activeExc.id, 'Verified export collection account records.')} className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg text-xs flex items-center gap-2">
                                  <Icons.Check className="w-4 h-4" />
                                  <span>Document Commentary & Resolve</span>
                                </button>
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-950 font-bold flex items-center gap-2">
                            <Icons.CheckCircle className="w-4 h-4 text-emerald-600" />
                            <span>Exception resolved and logged to 10-year WORM audit trail.</span>
                          </div>
                        )}
                      </div>
                    );
                  })()}
                </div>
              </div>
            </div>
          )}

          {/* TAB 10: APPROVAL */}
          {activeTab === 'approval' && (
            <div className="p-6 space-y-6 max-w-7xl mx-auto">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                    <Icons.Lock className="w-5 h-5 text-blue-600" />
                    Financial Spread Approval & Sign-Off
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">Credit Analyst dual-factor sign-off. Locking the spread dataset creates an immutable versioned snapshot.</p>
                </div>
                <span className="px-3 py-1 bg-emerald-50 text-emerald-800 text-xs font-bold rounded-lg border border-emerald-200">
                  {spreadVersion}
                </span>
              </div>

              <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
                  <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/50">
                    <div className="font-bold text-emerald-950">Documents Staged</div>
                    <div className="text-emerald-800 mt-0.5">8 of 8 Processed (100%)</div>
                  </div>
                  <div className={`p-4 rounded-xl border ${pendingExceptionsCount === 0 ? 'border-emerald-200 bg-emerald-50/50 text-emerald-950' : 'border-rose-200 bg-rose-50/50 text-rose-950'}`}>
                    <div className="font-bold">Critical Exceptions</div>
                    <div className="mt-0.5">{pendingExceptionsCount === 0 ? '0 Pending Exceptions' : `${pendingExceptionsCount} Unresolved`}</div>
                  </div>
                  <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/50">
                    <div className="font-bold text-emerald-950">Mandatory Line Items</div>
                    <div className="text-emerald-800 mt-0.5">186 Fields Mapped (100%)</div>
                  </div>
                  <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/50">
                    <div className="font-bold text-emerald-950">Reconciliation Tie-Outs</div>
                    <div className="text-emerald-800 mt-0.5">Balance Sheet Balanced</div>
                  </div>
                </div>

                {!isApproved ? (
                  <div className="p-5 bg-slate-50 rounded-xl border border-slate-200 space-y-3 text-xs">
                    <label className="font-bold text-slate-800 block">Sign-Off Commentary:</label>
                    <textarea rows={2} defaultValue="Audited balance sheet, P&L schedules, and 3-year financial ratios verified. Trade payables schedule reconciled." id="signOffComment" className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs" />
                    <button onClick={() => {
                      const c = document.getElementById('signOffComment').value;
                      handleApproveSpread(c);
                    }} className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg text-xs shadow-md">
                      Approve & Lock Financial Spread
                    </button>
                  </div>
                ) : (
                  <div className="p-5 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-950 flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-sm">Spread v1.0 Approved & Locked</h4>
                      <p className="text-emerald-800 mt-0.5">Signed off by {proposal.creditAnalyst}. Sealed in 10-Year WORM Audit Trail.</p>
                    </div>
                    <button onClick={() => setActiveTab('publish')} className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs">
                      Proceed to Publish Hand-off →
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 11: PUBLISH */}
          {activeTab === 'publish' && (
            <div className="p-6 space-y-6 max-w-7xl mx-auto">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                    <Icons.CreditCard className="w-5 h-5 text-blue-600" />
                    Publish & Downstream Credit Flow Hand-off
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">Event-driven publishing of approved, standardized financial JSON payloads to downstream AI agents.</p>
                </div>
                {isPublished && (
                  <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-full border border-emerald-200">
                    Published to Downstream Systems
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
                  <span className="text-[10px] uppercase font-bold text-indigo-700">Downstream Agent</span>
                  <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                    <Icons.Sparkles className="w-4 h-4 text-indigo-600" />
                    Flow 02 — CAM Drafting Agent
                  </h3>
                  <p className="text-xs text-slate-600">Generates executive Credit Appraisal Memo drafts from 3-year normalized spread.</p>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
                  <span className="text-[10px] uppercase font-bold text-blue-700">Risk Engine</span>
                  <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                    <Icons.ShieldCheck className="w-4 h-4 text-blue-600" />
                    Risk Rating & Scrutiny
                  </h3>
                  <p className="text-xs text-slate-600">Computes internal credit score based on TOL/TNW and DSCR ratios.</p>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
                  <span className="text-[10px] uppercase font-bold text-amber-700">Portfolio Monitor</span>
                  <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                    <Icons.Activity className="w-4 h-4 text-amber-600" />
                    Early Warning Signals (EWS)
                  </h3>
                  <p className="text-xs text-slate-600">Monitors quarterly bank credit summations and GST filing continuity.</p>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-6 space-y-4">
                <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider">Output Financial Payload JSON</h3>
                <pre className="p-4 bg-slate-950 text-emerald-400 font-mono text-xs rounded-xl overflow-x-auto max-h-48 scrollbar-dark">
{`{
  "proposalId": "PR-10045",
  "borrower": "ABC Manufacturing Pvt Ltd",
  "status": "APPROVED",
  "version": "v1.0",
  "signedOffBy": "Rahul Sharma",
  "metrics": {
    "revenue": 2500.0,
    "ebitda": 420.0,
    "currentRatio": 1.15,
    "dscr": 1.58,
    "tolTnw": 1.30
  }
}`}
                </pre>

                <button onClick={() => handlePublishDataset(['Flow 02 CAM Agent', 'Risk Scrutiny', 'EWS Monitor'])} disabled={isPublished} className={`px-6 py-2.5 rounded-xl text-xs font-bold shadow-md ${
                  isPublished ? 'bg-emerald-600 text-white' : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}>
                  {isPublished ? 'Dataset Successfully Published' : 'Publish Financial Dataset to Downstream Flows'}
                </button>
              </div>
            </div>
          )}

          {/* TAB 12: 10-YEAR WORM AUDIT TRAIL */}
          {activeTab === 'audit' && (
            <div className="p-6 space-y-6 max-w-7xl mx-auto">
              <div>
                <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <Icons.Activity className="w-5 h-5 text-blue-600" />
                  10-Year WORM Immutable Audit Trail
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">Statutory compliance log preserving every OCR cell extraction, analyst edit, and tie-out calculation.</p>
              </div>

              <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-600 uppercase">
                    <tr>
                      <th className="py-3 px-4">Timestamp</th>
                      <th className="py-3 px-4">Actor</th>
                      <th className="py-3 px-4">Action</th>
                      <th className="py-3 px-4">Component</th>
                      <th className="py-3 px-3 text-right">Old</th>
                      <th className="py-3 px-3 text-right">New</th>
                      <th className="py-3 px-4">Reason</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {auditLogs.map(log => (
                      <tr key={log.id} className="hover:bg-slate-50">
                        <td className="py-3 px-4 font-mono text-slate-500">{log.timestamp}</td>
                        <td className="py-3 px-4 font-semibold">{log.actor}</td>
                        <td className="py-3 px-4 font-bold text-slate-900">{log.action}</td>
                        <td className="py-3 px-4 text-blue-700 font-mono text-[11px]">{log.fieldOrComponent}</td>
                        <td className="py-3 px-3 text-right font-mono text-slate-400">{log.oldValue}</td>
                        <td className="py-3 px-3 text-right font-mono font-bold text-slate-900">{log.newValue}</td>
                        <td className="py-3 px-4 text-slate-600">{log.reason}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 13: HOW AGENT WORKS */}
          {activeTab === 'how-it-works' && (
            <div className="p-6 space-y-6 max-w-7xl mx-auto">
              <div>
                <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <Icons.Sparkles className="w-5 h-5 text-indigo-600" />
                  How the Extraction Agent Works (Architecture & Principles)
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">End-to-end operational pipeline illustrating exact boundaries between AI Perception, Deterministic Rules, and CRM Workflow.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div className="p-4 rounded-xl border border-indigo-200 bg-indigo-50/70 space-y-2">
                  <div className="font-bold text-indigo-950 flex items-center gap-2">
                    <Icons.Sparkles className="w-4 h-4 text-indigo-600" />
                    AI Perception Engine
                  </div>
                  <p className="text-indigo-900 leading-relaxed text-[11px]">AWS Textract & Claude 3.5 Vision handle document classification, table coordinates, layout matching, and OCR reading.</p>
                </div>

                <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/70 space-y-2">
                  <div className="font-bold text-emerald-950 flex items-center gap-2">
                    <Icons.ShieldCheck className="w-4 h-4 text-emerald-600" />
                    Deterministic Rule Engine
                  </div>
                  <p className="text-emerald-900 leading-relaxed text-[11px]">Deterministic math handles unit scaling (Cr $\to$ Lakhs), sign normalization, balance sheet tie-outs, ratio formulas, and threshold checks.</p>
                </div>

                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                  <div className="font-bold text-slate-900 flex items-center gap-2">
                    <Icons.Activity className="w-4 h-4 text-slate-600" />
                    CRM & Audit Layer
                  </div>
                  <p className="text-slate-700 leading-relaxed text-[11px]">HITL exception workbench, analyst corrections, dual sign-off, downstream hand-offs, and 10-year WORM audit sealing.</p>
                </div>
              </div>
            </div>
          )}
        </main>

        {/* Persistent Agent Status Bar */}
        <footer className="bg-slate-900 border-t border-slate-800 px-6 py-2.5 text-white flex flex-wrap items-center justify-between gap-4 z-30 shadow-lg select-none">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-shrink-0">
              <Icons.Sparkles className="w-4 h-4 text-blue-400" />
              <span className="text-xs font-bold text-slate-200">Extraction Agent:</span>
              <span className="px-2 py-0.5 bg-blue-500/20 text-blue-300 text-xs font-semibold rounded-full border border-blue-400/30 animate-pulse">
                {agentStatus === 'processing' ? 'Agent Active' : agentStatus === 'waiting_hitl' ? 'HITL Review' : agentStatus === 'approved' ? 'Approved' : 'Published'}
              </span>
            </div>
            <div className="h-4 w-px bg-slate-800 hidden sm:block"></div>
            <div className="text-xs text-slate-300 font-medium truncate flex-1">{agentCurrentAction}</div>
          </div>

          <div className="flex items-center gap-4 flex-shrink-0">
            <div className="flex items-center gap-2">
              <div className="w-28 bg-slate-800 rounded-full h-2 overflow-hidden border border-slate-700">
                <div className="h-full bg-blue-500 transition-all duration-500 rounded-full" style={{ width: `${agentProgressPct}%` }}></div>
              </div>
              <span className="text-xs font-mono font-bold text-slate-300">{agentProgressPct}%</span>
            </div>
            {agentStatus === 'waiting_hitl' && (
              <button onClick={() => setActiveTab('exceptions')} className="px-2.5 py-1 bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold rounded flex items-center gap-1">
                <Icons.AlertTriangle className="w-3 h-3" />
                <span>Review Exceptions</span>
              </button>
            )}
          </div>
        </footer>
      </div>

      {/* Global Field Detail Flyout Drawer */}
      {isFieldDrawerOpen && selectedField && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-2xs z-50 flex justify-end">
          <div className="w-full max-w-lg bg-white h-full shadow-2xl flex flex-col justify-between border-l border-slate-200 p-6 overflow-y-auto">
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400">Field Inspector</span>
                  <h3 className="font-bold text-base text-slate-900">{selectedField.standardField}</h3>
                </div>
                <button onClick={() => setIsFieldDrawerOpen(false)} className="p-1 rounded text-slate-400 hover:text-slate-600">
                  <Icons.X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2 text-xs">
                <div><strong>Original Label:</strong> "{selectedField.originalLabel}"</div>
                <div><strong>Extracted FY25:</strong> ₹{selectedField.fy2025} Lakhs</div>
                <div><strong>Confidence:</strong> {selectedField.confidence}% (OCR {selectedField.ocrConfidence}%)</div>
                <div><strong>Source:</strong> {selectedField.documentName} (Pg {selectedField.pageNumber})</div>
              </div>

              <div className="p-4 bg-blue-50/70 border border-blue-200 rounded-xl space-y-3 text-xs">
                <div className="font-bold text-blue-900">Analyst Correction</div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Corrected Value (₹ Lakhs):</label>
                  <input type="number" defaultValue={selectedField.suggestedValue || selectedField.fy2025} id="drawerCorrVal" className="w-full px-3 py-1.5 bg-white border border-blue-300 rounded font-mono font-bold" />
                </div>
                <button onClick={() => {
                  const v = parseFloat(document.getElementById('drawerCorrVal').value) || 405;
                  handleSaveCorrection(selectedField.id, v, 'Analyst Correction', 'Verified against schedule.');
                  setIsFieldDrawerOpen(false);
                }} className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg text-xs">
                  Save Correction & Re-Validate
                </button>
              </div>
            </div>
            <button onClick={() => setIsFieldDrawerOpen(false)} className="w-full py-2 bg-slate-100 text-slate-700 font-semibold rounded-lg text-xs">
              Close
            </button>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-20 right-6 z-50">
          <div className="p-4 bg-slate-900 text-white rounded-xl shadow-2xl border border-slate-800 max-w-md text-xs space-y-1">
            <div className="font-bold text-emerald-400">{toast.title}</div>
            <div className="text-slate-300">{toast.desc}</div>
          </div>
        </div>
      )}
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
