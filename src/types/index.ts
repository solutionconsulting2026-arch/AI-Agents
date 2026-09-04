export type WorkflowStageId = 
  | 'intake'
  | 'validation'
  | 'classification'
  | 'layout'
  | 'extraction'
  | 'normalization'
  | 'reconciliation'
  | 'ratios'
  | 'confidence'
  | 'exceptions'
  | 'approval'
  | 'publish';

export type StageStatus = 'pending' | 'in_progress' | 'completed' | 'warning' | 'failed' | 'requires_review' | 'approved' | 'published';

export interface WorkflowStage {
  id: WorkflowStageId;
  name: string;
  stageNumber: number;
  status: StageStatus;
  description: string;
  engine: 'AI Engine' | 'Deterministic Rule' | 'CRM Workflow' | 'Hybrid';
  timestamp?: string;
  durationMs?: number;
  summaryText?: string;
}

export type DocumentType = 
  | 'Balance Sheet' 
  | 'P&L Statement' 
  | 'Cash Flow Statement' 
  | 'Bank Statement' 
  | 'GST Return' 
  | 'ITR' 
  | 'Provisional Financials' 
  | 'Notes to Accounts';

export type DocumentStatus = 
  | 'Uploaded' 
  | 'Validating' 
  | 'Classified' 
  | 'Processing' 
  | 'Processed' 
  | 'Warning' 
  | 'Exception' 
  | 'Approved';

export interface DocumentBoundingBox {
  id: string;
  page: number;
  x: number; // percentage 0-100
  y: number; // percentage 0-100
  width: number;
  height: number;
  fieldId: string;
  rawText: string;
  confidence: number;
}

export interface BorrowerDocument {
  id: string;
  name: string;
  type: DocumentType;
  subtype: string;
  financialYear: string;
  period: string;
  version: string;
  fileSize: string;
  pageCount: number;
  status: DocumentStatus;
  confidence: number; // 0-100
  processingTimeSec: number;
  uploadedAt: string;
  processedAt?: string;
  audited: boolean;
  currency: string;
  reportedUnit: string;
  aiClassificationEvidence: string;
  boundingBoxes?: DocumentBoundingBox[];
  thumbnailUrl?: string;
}

export type FieldStatus = 'Verified' | 'Warning' | 'Requires Review' | 'Corrected' | 'Rejected';

export interface ExtractedField {
  id: string;
  standardField: string;
  originalLabel: string;
  category: 'Balance Sheet - Assets' | 'Balance Sheet - Liabilities' | 'P&L - Revenue' | 'P&L - Expenses' | 'P&L - Profitability' | 'Cash Flow' | 'Banking';
  fy2025: number;
  fy2024: number;
  fy2023: number;
  unit: string;
  normalizedUnit: string;
  conversionFactor: number;
  confidence: number; // overall confidence 0-100
  ocrConfidence: number;
  mappingConfidence: number;
  tieOutConfidence: number;
  status: FieldStatus;
  documentId: string;
  documentName: string;
  pageNumber: number;
  boundingBoxId?: string;
  extractionMethod: 'AWS Textract' | 'Claude Vision Fallback' | 'Analyst Manual Entry';
  flagReason?: string;
  suggestedValue?: number;
  correctedValue?: number;
  correctedBy?: string;
  correctedAt?: string;
  isMandatory: boolean;
  dependentRuleIds: string[];
}

export type CheckStatus = 'PASS' | 'WARNING' | 'FAIL';

export interface ReconciliationCheck {
  id: string;
  name: string;
  category: 'Balance Sheet Tie-Out' | 'Component Summation' | 'YoY Continuity' | 'Cross-Document Reconciliation' | 'Bank vs P&L';
  description: string;
  status: CheckStatus;
  reportedValueStr: string;
  calculatedValueStr: string;
  variancePercentage: number;
  allowedTolerancePercentage: number;
  evidence: string;
  impactedFieldIds: string[];
  requiresHITL: boolean;
}

export interface FinancialRatio {
  id: string;
  name: string;
  category: 'Liquidity' | 'Solvency & Leverage' | 'Coverage & Service' | 'Profitability' | 'Working Capital' | 'Banking Health';
  formula: string;
  benchmark: string;
  fy2023: number | string;
  fy2024: number | string;
  fy2025: number | string;
  unit: string;
  trend: 'improving' | 'stable' | 'deteriorating';
  isHealthy: boolean;
  impactedByFieldIds: string[];
}

export interface ExceptionItem {
  id: string;
  fieldId?: string;
  checkId?: string;
  title: string;
  type: 'Low Confidence' | 'Reconciliation Mismatch' | 'GST Variance' | 'Unmapped Field';
  severity: 'CRITICAL' | 'WARNING' | 'INFO';
  status: 'PENDING_REVIEW' | 'IN_REVIEW' | 'RESOLVED_BY_ANALYST' | 'ACCEPTED_WITH_FLAG' | 'REJECTED';
  sourceDocument: string;
  page: number;
  extractedValue: string;
  suggestedValue: string;
  confidenceScore: number;
  flagReason: string;
  recommendation: string;
  analystComment?: string;
  resolvedAt?: string;
  resolvedBy?: string;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  actor: string;
  actorRole: 'AI Agent' | 'Credit Analyst' | 'Validation Engine' | 'System';
  action: string;
  fieldOrComponent: string;
  oldValue: string;
  newValue: string;
  reason: string;
  verificationHash: string;
}

export interface AgentActivityEvent {
  id: string;
  timestamp: string;
  durationMs: number;
  status: 'SUCCESS' | 'WARNING' | 'INFO' | 'PROCESSING';
  component: 'PreFlight' | 'Classification' | 'Textract OCR' | 'Vision Fallback' | 'Normalization' | 'Reconciliation' | 'Ratio Engine' | 'HITL Gateway' | 'Publisher';
  action: string;
  result: string;
}

export interface ProposalInfo {
  proposalId: string;
  borrowerName: string;
  cif: string;
  loanProduct: string;
  requestedAmount: string;
  requestedAmountLakhs: number;
  creditStage: string;
  relationshipManager: string;
  creditAnalyst: string;
  branch: string;
  createdDate: string;
  targetSlaMinutes: number;
}
