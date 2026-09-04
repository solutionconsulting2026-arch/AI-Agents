import { useState, useCallback, useEffect } from 'react';
import { 
  ProposalInfo, 
  WorkflowStage, 
  BorrowerDocument, 
  ExtractedField, 
  ReconciliationCheck, 
  FinancialRatio, 
  ExceptionItem, 
  AuditLogEntry, 
  AgentActivityEvent,
  DocumentBoundingBox
} from '../types';
import { 
  initialProposal, 
  initialStages, 
  initialDocuments, 
  initialExtractedFields, 
  initialReconciliationChecks, 
  initialExceptions, 
  initialAuditLogs, 
  initialAgentActivities 
} from '../data/mockBorrowerData';
import { evaluateReconciliation } from '../engine/reconciliationEngine';
import { computeFinancialRatios } from '../engine/ratioEngine';

export type NavigationTab = 
  | 'workspace'
  | 'documents'
  | 'viewer'
  | 'extracted-fields'
  | 'normalization'
  | 'reconciliation'
  | 'ratios'
  | 'confidence'
  | 'exceptions'
  | 'approval'
  | 'publish'
  | 'audit'
  | 'activity'
  | 'how-it-works';

export interface ToastInfo {
  type: 'success' | 'info' | 'warning' | 'error';
  title: string;
  desc: string;
}

export function useAppState() {
  const [activeTab, setActiveTab] = useState<NavigationTab>('workspace');
  const [proposal] = useState<ProposalInfo>(initialProposal);
  const [stages, setStages] = useState<WorkflowStage[]>(initialStages);
  const [documents, setDocuments] = useState<BorrowerDocument[]>(initialDocuments);
  const [fields, setFields] = useState<ExtractedField[]>(initialExtractedFields);
  const [reconciliations, setReconciliations] = useState<ReconciliationCheck[]>(initialReconciliationChecks);
  const [ratios, setRatios] = useState<FinancialRatio[]>(() => computeFinancialRatios(initialExtractedFields));
  const [exceptions, setExceptions] = useState<ExceptionItem[]>(initialExceptions);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(initialAuditLogs);
  const [agentActivities, setAgentActivities] = useState<AgentActivityEvent[]>(initialAgentActivities);

  // Selection & UI controls
  const [selectedDocumentId, setSelectedDocumentId] = useState<string>('doc-01');
  const [selectedFieldId, setSelectedFieldId] = useState<string | null>(null);
  const [selectedExceptionId, setSelectedExceptionId] = useState<string | null>(null);
  const [activeViewerPage, setActiveViewerPage] = useState<number>(1);
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [highlightedBoundingBoxId, setHighlightedBoundingBoxId] = useState<string | null>(null);

  // Workflow progress & Agent state
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadStepName, setUploadStepName] = useState<string>('');
  const [isDemoRunning, setIsDemoRunning] = useState<boolean>(false);
  const [agentStatus, setAgentStatus] = useState<'idle' | 'processing' | 'waiting_hitl' | 'approved' | 'published'>('waiting_hitl');
  const [agentCurrentAction, setAgentCurrentAction] = useState<string>('Awaiting Credit Analyst review on 2 flagged exceptions');
  const [agentNextAction, setAgentNextAction] = useState<string>('Re-run reconciliation & recalculate ratios upon analyst correction');
  const [agentProgressPct, setAgentProgressPct] = useState<number>(85);
  const [spreadVersion, setSpreadVersion] = useState<string>('v0.9 (Draft - HITL Pending)');
  const [isApproved, setIsApproved] = useState<boolean>(false);
  const [isPublished, setIsPublished] = useState<boolean>(false);
  const [toast, setToast] = useState<ToastInfo | null>(null);

  // Auto-dismiss toast after 4.5s
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 4500);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const showToast = useCallback((type: ToastInfo['type'], title: string, desc: string) => {
    setToast({ type, title, desc });
  }, []);

  // Bidirectional interaction: Select Field from Table -> Highlight in Document Viewer
  const handleSelectField = useCallback((fieldId: string) => {
    setSelectedFieldId(fieldId);
    const targetField = fields.find(f => f.id === fieldId);
    if (targetField) {
      if (targetField.documentId) {
        setSelectedDocumentId(targetField.documentId);
      }
      if (targetField.pageNumber) {
        setActiveViewerPage(targetField.pageNumber);
      }
      if (targetField.boundingBoxId) {
        setHighlightedBoundingBoxId(targetField.boundingBoxId);
      } else {
        setHighlightedBoundingBoxId(null);
      }
    }
  }, [fields]);

  // Bidirectional interaction: Select Bounding Box in Document Viewer -> Highlight in Table / Open Drawer
  const handleSelectBoundingBox = useCallback((bb: DocumentBoundingBox) => {
    setHighlightedBoundingBoxId(bb.id);
    setSelectedFieldId(bb.fieldId);
  }, []);

  // STEP 23 & 24: Core Analyst Correction & Reactive Agent Re-Validation
  const handleSaveCorrection = useCallback((
    fieldId: string, 
    correctedValue: number, 
    reason: string, 
    comment: string
  ) => {
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const targetField = fields.find(f => f.id === fieldId);
    const oldValue = targetField ? `₹${targetField.fy2025.toFixed(2)} Lakhs` : '—';
    const newValue = `₹${correctedValue.toFixed(2)} Lakhs`;

    // 1. Update fields state
    const updatedFields = fields.map(f => {
      if (f.id === fieldId) {
        return {
          ...f,
          fy2025: correctedValue,
          status: 'Corrected' as const,
          confidence: 98,
          ocrConfidence: 99,
          mappingConfidence: 100,
          tieOutConfidence: 99,
          correctedValue,
          correctedBy: 'Rahul Sharma (Credit Analyst)',
          correctedAt: timestamp,
          flagReason: `Corrected by Analyst: ${reason}. (${comment})`
        };
      }
      return f;
    });
    setFields(updatedFields);

    // 2. Deterministically re-run reconciliation engine
    const newReconciliations = evaluateReconciliation(updatedFields);
    setReconciliations(newReconciliations);

    // 3. Deterministically recalculate financial ratios
    const newRatios = computeFinancialRatios(updatedFields);
    setRatios(newRatios);

    // 4. Update Exception state
    const updatedExceptions = exceptions.map(exc => {
      if (exc.fieldId === fieldId) {
        return {
          ...exc,
          status: 'RESOLVED_BY_ANALYST' as const,
          analystComment: `${reason}: ${comment}`,
          resolvedAt: timestamp,
          resolvedBy: 'Rahul Sharma'
        };
      }
      return exc;
    });
    setExceptions(updatedExceptions);

    // 5. Update Documents status if doc-01
    setDocuments(prevDocs => prevDocs.map(d => {
      if (d.id === 'doc-01') {
        return { ...d, status: 'Processed' as const, confidence: 97 };
      }
      return d;
    }));

    // 6. Update Workflow Stepper stages
    setStages(prevStages => prevStages.map(s => {
      if (s.id === 'reconciliation') {
        return { 
          ...s, 
          status: 'completed', 
          summaryText: 'All 5 core tie-outs validated after analyst correction.' 
        };
      }
      if (s.id === 'confidence') {
        return { 
          ...s, 
          status: 'completed', 
          summaryText: 'Average confidence elevated to 96.8%. 0 critical flags.' 
        };
      }
      if (s.id === 'exceptions') {
        return { 
          ...s, 
          status: 'completed', 
          summaryText: '1 Critical exception resolved. 1 Secondary exception flagged.' 
        };
      }
      if (s.id === 'approval') {
        return {
          ...s,
          status: 'requires_review',
          summaryText: 'Financial spread is ready for Credit Analyst sign-off.'
        };
      }
      return s;
    }));

    // 7. Append immutable WORM Audit Log
    const newAuditLog: AuditLogEntry = {
      id: `aud-${Date.now()}`,
      timestamp,
      actor: 'Rahul Sharma',
      actorRole: 'Credit Analyst',
      action: 'Analyst Field Correction',
      fieldOrComponent: targetField ? targetField.standardField : 'Field',
      oldValue,
      newValue,
      reason: `${reason} — ${comment}`,
      verificationHash: `sha256:e83f${Math.random().toString(36).substring(2, 9)}`
    };

    const revalidationAuditLog: AuditLogEntry = {
      id: `aud-${Date.now() + 1}`,
      timestamp,
      actor: 'Validation Engine',
      actorRole: 'Validation Engine',
      action: 'Deterministic Re-validation',
      fieldOrComponent: 'Balance Sheet Balancing & Ratio Engine',
      oldValue: 'FAIL (Variance ₹15.00 L)',
      newValue: 'PASS (Zero Variance)',
      reason: 'Automated re-computation of 4 dependent checks & 14 ratios after field update',
      verificationHash: `sha256:77bc${Math.random().toString(36).substring(2, 9)}`
    };

    setAuditLogs(prev => [newAuditLog, revalidationAuditLog, ...prev]);

    // 8. Log Agent Activity
    const newActivity: AgentActivityEvent = {
      id: `act-${Date.now()}`,
      timestamp,
      durationMs: 410,
      status: 'SUCCESS',
      component: 'Reconciliation',
      action: 'Reactive Re-validation Triggered',
      result: 'Agent revalidated 4 dependent checks: Balance Sheet balanced, Current Ratio updated to 1.15x, TOL/TNW to 1.30x.'
    };
    setAgentActivities(prev => [newActivity, ...prev]);

    // 9. Update live persistent Agent Status Bar
    setAgentStatus('processing');
    setAgentCurrentAction('Agent revalidated 4 dependent checks after analyst correction');
    setAgentNextAction('Proceed to Spread Approval for Proposal PR-10045');
    setAgentProgressPct(95);

    // 10. Show rich Toast notification
    showToast(
      'success',
      'Correction Saved & Re-validation Complete',
      'Agent re-ran Balance Sheet tie-outs and recalculated Current Ratio (1.15x) and TOL/TNW (1.30x).'
    );
  }, [fields, exceptions, showToast]);

  // Accept secondary exception (e.g. Bank Turnover variance with analyst note)
  const handleAcceptException = useCallback((exceptionId: string, comment: string) => {
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    setExceptions(prev => prev.map(exc => {
      if (exc.id === exceptionId) {
        return {
          ...exc,
          status: 'ACCEPTED_WITH_FLAG',
          analystComment: comment || 'Verified against secondary export collection account statement.',
          resolvedAt: timestamp,
          resolvedBy: 'Rahul Sharma'
        };
      }
      return exc;
    }));

    const targetExc = exceptions.find(e => e.id === exceptionId);
    const newAuditLog: AuditLogEntry = {
      id: `aud-${Date.now()}`,
      timestamp,
      actor: 'Rahul Sharma',
      actorRole: 'Credit Analyst',
      action: 'Exception Accepted with Commentary',
      fieldOrComponent: targetExc ? targetExc.title : 'Exception',
      oldValue: 'PENDING_REVIEW',
      newValue: 'ACCEPTED_WITH_FLAG',
      reason: comment || 'Commentary documented for CAM Note preparation',
      verificationHash: `sha256:acc${Math.random().toString(36).substring(2, 9)}`
    };
    setAuditLogs(prev => [newAuditLog, ...prev]);

    showToast('info', 'Exception Acknowledged', 'Credit Analyst commentary attached to Proposal audit trail.');
  }, [exceptions, showToast]);

  // STEP 25: Financial Spread Approval
  const handleApproveSpread = useCallback((comments: string) => {
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    setIsApproved(true);
    setSpreadVersion('v1.0 (Audited & Locked)');
    
    setStages(prev => prev.map(s => {
      if (s.id === 'approval') {
        return { ...s, status: 'approved', summaryText: `Signed off by Rahul Sharma at ${timestamp}.` };
      }
      if (s.id === 'publish') {
        return { ...s, status: 'requires_review', summaryText: 'Ready for downstream publishing to LOS, CAM Agent, and Risk Engine.' };
      }
      return s;
    }));

    const approvalAudit: AuditLogEntry = {
      id: `aud-${Date.now()}`,
      timestamp,
      actor: 'Rahul Sharma',
      actorRole: 'Credit Analyst',
      action: 'Financial Spread Sign-Off',
      fieldOrComponent: 'Spread Dataset v1.0',
      oldValue: 'v0.9 (Draft)',
      newValue: 'v1.0 (Locked & Approved)',
      reason: `Sign-off completed: ${comments || 'All statutory schedules and ratios verified'}`,
      verificationHash: `sha256:apprv${Math.random().toString(36).substring(2, 9)}`
    };
    setAuditLogs(prev => [approvalAudit, ...prev]);

    setAgentStatus('approved');
    setAgentCurrentAction('Financial Spread v1.0 approved and locked for proposal PR-10045');
    setAgentNextAction('Dispatch structured JSON to Downstream Credit Flows');
    setAgentProgressPct(98);

    showToast('success', 'Financial Spread Approved', 'Dataset versioned as v1.0 (Locked). Ready to publish.');
  }, [showToast]);

  // STEP 26: Publish & Downstream Hand-off
  const handlePublishDataset = useCallback((destinations: string[]) => {
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    setIsPublished(true);

    setStages(prev => prev.map(s => {
      if (s.id === 'publish') {
        return { ...s, status: 'published', summaryText: `Published to ${destinations.length} downstream endpoints at ${timestamp}.` };
      }
      return s;
    }));

    const publishAudit: AuditLogEntry = {
      id: `aud-${Date.now()}`,
      timestamp,
      actor: 'System (Publisher)',
      actorRole: 'System',
      action: 'Downstream Event Emitter',
      fieldOrComponent: 'Event Bridge / Kafka',
      oldValue: 'Unpublished',
      newValue: `Published to: ${destinations.join(', ')}`,
      reason: '10-Year WORM record sealed and published for Proposal PR-10045',
      verificationHash: `sha256:pub${Math.random().toString(36).substring(2, 9)}`
    };
    setAuditLogs(prev => [publishAudit, ...prev]);

    const publishActivity: AgentActivityEvent = {
      id: `act-${Date.now()}`,
      timestamp,
      durationMs: 290,
      status: 'SUCCESS',
      component: 'Publisher',
      action: 'Downstream Hand-off Dispatched',
      result: `Emitted payloads to Flow 02 CAM Drafting Agent, LOS CRMNEXT, Risk Scrutiny Engine, and EWS Portfolio Monitor.`
    };
    setAgentActivities(prev => [publishActivity, ...prev]);

    setAgentStatus('published');
    setAgentCurrentAction('Published to CAM Agent, Risk Scoring, EWS, and LOS');
    setAgentNextAction('Flow 01 Complete. Downstream agents actively preparing Credit Appraisal Memo (CAM).');
    setAgentProgressPct(100);

    showToast('success', 'Published to Downstream Systems', 'Flow 02 CAM Agent, Risk Scoring, and EWS have received the structured financial dataset.');
  }, [showToast]);

  // STEP 11: Interactive Document Upload Simulation
  const handleSimulateUpload = useCallback((docName: string = 'Provisional Financials FY2025.pdf') => {
    setIsUploading(true);
    setUploadStepName('Uploading to S3 Staging Drop...');

    setTimeout(() => {
      setUploadStepName('Running Pre-Flight Validation...');
      setTimeout(() => {
        setUploadStepName('Classifying Document & FY...');
        setTimeout(() => {
          setUploadStepName('Extracting Table Layout & Line Items...');
          setTimeout(() => {
            setUploadStepName('Normalizing to Bank CoA...');
            setTimeout(() => {
              // Add new document
              const newDoc: BorrowerDocument = {
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
                processedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
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
          }, 800);
        }, 700);
      }, 700);
    }, 700);
  }, [showToast]);

  // STEP 33: Reset to Initial Demo State
  const handleResetDemo = useCallback(() => {
    setStages(initialStages);
    setDocuments(initialDocuments);
    setFields(initialExtractedFields);
    setReconciliations(initialReconciliationChecks);
    setRatios(computeFinancialRatios(initialExtractedFields));
    setExceptions(initialExceptions);
    setAuditLogs(initialAuditLogs);
    setAgentActivities(initialAgentActivities);
    setSelectedDocumentId('doc-01');
    setSelectedFieldId(null);
    setSelectedExceptionId(null);
    setActiveViewerPage(1);
    setHighlightedBoundingBoxId(null);
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

  // STEP 33: Automated "Run Full Demo" Walkthrough Orchestrator
  const handleRunFullDemo = useCallback(() => {
    setIsDemoRunning(true);
    setActiveTab('workspace');
    showToast('info', 'Starting Interactive Demo Walkthrough', 'Demonstrating complete end-to-end extraction, exception review, re-validation, and publishing.');

    // Step 1: Open Document Viewer & Highlight Trade Payables
    setTimeout(() => {
      setActiveTab('viewer');
      setSelectedDocumentId('doc-01');
      setActiveViewerPage(1);
      handleSelectField('f-tp');

      // Step 2: Open Exceptions Workbench
      setTimeout(() => {
        setActiveTab('exceptions');
        setSelectedExceptionId('exc-01');

        // Step 3: Automatically trigger Analyst Correction
        setTimeout(() => {
          handleSaveCorrection(
            'f-tp', 
            405, 
            'OCR Misrecognition Correction', 
            'Verified against Audited Schedule 6: Creditors for goods ₹310L + expenses ₹95L = ₹405L.'
          );

          // Step 4: Acknowledge Bank credits variance exception
          setTimeout(() => {
            handleAcceptException('exc-02', 'Borrower explained ₹400L revenue was routed through export collection LC account at Axis Bank. Verified swift copy.');

            // Step 5: Switch to Reconciliation tab to observe live tie-outs
            setTimeout(() => {
              setActiveTab('reconciliation');

              // Step 6: Switch to Ratios tab to see updated ratios
              setTimeout(() => {
                setActiveTab('ratios');

                // Step 7: Navigate to Approval tab and execute Sign-Off
                setTimeout(() => {
                  setActiveTab('approval');
                  
                  setTimeout(() => {
                    handleApproveSpread('Audited financials, 3-year ratios, and ROC schedules fully reconciled.');

                    // Step 8: Open Publish tab and trigger Downstream Handoff
                    setTimeout(() => {
                      setActiveTab('publish');

                      setTimeout(() => {
                        handlePublishDataset(['LOS / CRMNEXT', 'Flow 02 CAM Drafting Agent', 'Risk Scrutiny Engine', 'EWS Portfolio Monitor']);
                        setIsDemoRunning(false);
                      }, 2000);
                    }, 2500);
                  }, 2000);
                }, 2500);
              }, 2500);
            }, 2500);
          }, 2000);
        }, 3000);
      }, 2500);
    }, 2000);
  }, [handleSelectField, handleSaveCorrection, handleAcceptException, handleApproveSpread, handlePublishDataset, showToast]);

  return {
    activeTab,
    setActiveTab,
    proposal,
    stages,
    documents,
    fields,
    reconciliations,
    ratios,
    exceptions,
    auditLogs,
    agentActivities,
    selectedDocumentId,
    setSelectedDocumentId,
    selectedFieldId,
    setSelectedFieldId,
    selectedExceptionId,
    setSelectedExceptionId,
    activeViewerPage,
    setActiveViewerPage,
    zoomLevel,
    setZoomLevel,
    highlightedBoundingBoxId,
    setHighlightedBoundingBoxId,
    isUploading,
    uploadStepName,
    isDemoRunning,
    agentStatus,
    agentCurrentAction,
    agentNextAction,
    agentProgressPct,
    spreadVersion,
    isApproved,
    isPublished,
    toast,
    showToast,
    handleSelectField,
    handleSelectBoundingBox,
    handleSaveCorrection,
    handleAcceptException,
    handleApproveSpread,
    handlePublishDataset,
    handleSimulateUpload,
    handleResetDemo,
    handleRunFullDemo
  };
}
