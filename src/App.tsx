import React, { useState } from 'react';
import { useAppState } from './state/appState';
import { Sidebar } from './components/layout/Sidebar';
import { TopHeader } from './components/layout/TopHeader';
import { ProposalHeader } from './components/layout/ProposalHeader';
import { AgentStatusBar } from './components/layout/AgentStatusBar';
import { WorkflowStepper } from './components/workflow/WorkflowStepper';
import { DashboardOverview } from './components/dashboard/DashboardOverview';
import { DocumentCenter } from './components/documents/DocumentCenter';
import { DocumentViewer } from './components/documents/DocumentViewer';
import { ExtractionTable } from './components/extraction/ExtractionTable';
import { FieldDetailDrawer } from './components/extraction/FieldDetailDrawer';
import { NormalizationPanel } from './components/extraction/NormalizationPanel';
import { ReconciliationPanel } from './components/validation/ReconciliationPanel';
import { RatioEngineTable } from './components/validation/RatioEngineTable';
import { ConfidenceMatrix } from './components/validation/ConfidenceMatrix';
import { ExceptionWorkbench } from './components/hitl/ExceptionWorkbench';
import { ApprovalPanel } from './components/approval/ApprovalPanel';
import { PublishPanel } from './components/approval/PublishModal';
import { AuditTrailTable } from './components/audit/AuditTrailTable';
import { AgentActivityTimeline } from './components/audit/AgentActivityTimeline';
import { HowAgentWorksView } from './components/architecture/HowAgentWorksView';
import { CheckCircle, AlertTriangle, Info, X } from './components/icons/Icons';

export const App: React.FC = () => {
  const {
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
    handleSelectField,
    handleSelectBoundingBox,
    handleSaveCorrection,
    handleAcceptException,
    handleApproveSpread,
    handlePublishDataset,
    handleSimulateUpload,
    handleResetDemo,
    handleRunFullDemo
  } = useAppState();

  const [isFieldDrawerOpen, setIsFieldDrawerOpen] = useState(false);

  const selectedDocument = documents.find(d => d.id === selectedDocumentId) || documents[0];
  const selectedField = fields.find(f => f.id === selectedFieldId) || null;
  const pendingExceptionsCount = exceptions.filter(
    e => e.status === 'PENDING_REVIEW' || e.status === 'IN_REVIEW'
  ).length;

  const handleOpenFieldDrawer = (fieldId: string) => {
    handleSelectField(fieldId);
    setIsFieldDrawerOpen(true);
  };

  const renderActiveView = () => {
    switch (activeTab) {
      case 'workspace':
        return (
          <DashboardOverview
            proposal={proposal}
            documents={documents}
            fields={fields}
            reconciliations={reconciliations}
            exceptions={exceptions}
            spreadVersion={spreadVersion}
            isApproved={isApproved}
            isPublished={isPublished}
            setActiveTab={setActiveTab}
            onSimulateUpload={handleSimulateUpload}
            onOpenExceptions={() => setActiveTab('exceptions')}
          />
        );

      case 'documents':
        return (
          <DocumentCenter
            documents={documents}
            selectedDocId={selectedDocumentId}
            onSelectDoc={setSelectedDocumentId}
            onOpenViewer={(docId) => {
              setSelectedDocumentId(docId);
              setActiveTab('viewer');
            }}
            onSimulateUpload={handleSimulateUpload}
            isUploading={isUploading}
            uploadStepName={uploadStepName}
          />
        );

      case 'viewer':
        return (
          <div className="p-6 max-w-7xl mx-auto">
            <DocumentViewer
              document={selectedDocument}
              documents={documents}
              onSelectDocument={setSelectedDocumentId}
              fields={fields}
              selectedFieldId={selectedFieldId}
              highlightedBoundingBoxId={highlightedBoundingBoxId}
              onSelectField={handleSelectField}
              onSelectBoundingBox={handleSelectBoundingBox}
              activePage={activeViewerPage}
              setActivePage={setActiveViewerPage}
              zoomLevel={zoomLevel}
              setZoomLevel={setZoomLevel}
              onOpenFieldDrawer={handleOpenFieldDrawer}
            />
          </div>
        );

      case 'extracted-fields':
        return (
          <ExtractionTable
            fields={fields}
            selectedFieldId={selectedFieldId}
            onSelectField={handleSelectField}
            onOpenFieldDrawer={handleOpenFieldDrawer}
          />
        );

      case 'normalization':
        return <NormalizationPanel />;

      case 'reconciliation':
        return (
          <ReconciliationPanel
            checks={reconciliations}
            onOpenExceptions={() => setActiveTab('exceptions')}
            setActiveTab={setActiveTab}
          />
        );

      case 'ratios':
        return <RatioEngineTable ratios={ratios} />;

      case 'confidence':
        return (
          <ConfidenceMatrix
            fields={fields}
            setActiveTab={setActiveTab}
            onSelectField={handleSelectField}
          />
        );

      case 'exceptions':
        return (
          <ExceptionWorkbench
            exceptions={exceptions}
            selectedExceptionId={selectedExceptionId}
            onSelectException={setSelectedExceptionId}
            fields={fields}
            onSaveCorrection={handleSaveCorrection}
            onAcceptException={handleAcceptException}
            setActiveTab={setActiveTab}
            onOpenSourceViewer={(docId, page) => {
              setSelectedDocumentId(docId);
              setActiveViewerPage(page);
              setActiveTab('viewer');
            }}
          />
        );

      case 'approval':
        return (
          <ApprovalPanel
            proposal={proposal}
            exceptions={exceptions}
            reconciliations={reconciliations}
            spreadVersion={spreadVersion}
            isApproved={isApproved}
            isPublished={isPublished}
            onApproveSpread={handleApproveSpread}
            setActiveTab={setActiveTab}
          />
        );

      case 'publish':
        return (
          <PublishPanel
            proposal={proposal}
            fields={fields}
            isApproved={isApproved}
            isPublished={isPublished}
            onPublish={handlePublishDataset}
          />
        );

      case 'audit':
        return <AuditTrailTable logs={auditLogs} />;

      case 'activity':
        return <AgentActivityTimeline activities={agentActivities} />;

      case 'how-it-works':
        return <HowAgentWorksView />;

      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-100 font-sans text-slate-900">
      {/* Left CRM Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        exceptionCount={pendingExceptionsCount}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <TopHeader
          proposal={proposal}
          isDemoRunning={isDemoRunning}
          exceptionCount={pendingExceptionsCount}
          onRunFullDemo={handleRunFullDemo}
          onResetDemo={handleResetDemo}
          onOpenHowItWorks={() => setActiveTab('how-it-works')}
        />

        {/* Credit Proposal Header */}
        <ProposalHeader
          proposal={proposal}
          spreadVersion={spreadVersion}
          isApproved={isApproved}
          isPublished={isPublished}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />

        {/* 12-Stage Horizontal Workflow Stepper */}
        <WorkflowStepper
          stages={stages}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />

        {/* Scrollable Center View Body */}
        <main className="flex-1 overflow-y-auto bg-slate-100 scrollbar-thin scrollbar-thumb-slate-300">
          {renderActiveView()}
        </main>

        {/* Persistent Dynamic Agent Status Bar */}
        <AgentStatusBar
          status={agentStatus}
          currentAction={agentCurrentAction}
          nextAction={agentNextAction}
          progressPct={agentProgressPct}
          onOpenExceptions={() => setActiveTab('exceptions')}
          onOpenApproval={() => setActiveTab('publish')}
        />
      </div>

      {/* Global Field Detail Drawer */}
      <FieldDetailDrawer
        field={selectedField}
        isOpen={isFieldDrawerOpen}
        onClose={() => setIsFieldDrawerOpen(false)}
        onSaveCorrection={handleSaveCorrection}
        onOpenSourceViewer={(docId, page) => {
          setSelectedDocumentId(docId);
          setActiveViewerPage(page);
          setIsFieldDrawerOpen(false);
          setActiveTab('viewer');
        }}
      />

      {/* Global Toast Notification */}
      {toast && (
        <div className="fixed top-20 right-6 z-50 animate-in fade-in slide-in-from-top-4 duration-200">
          <div className={`p-4 rounded-xl shadow-2xl border flex items-start gap-3 max-w-md ${
            toast.type === 'success' 
              ? 'bg-emerald-950 text-white border-emerald-800' 
              : toast.type === 'error' 
                ? 'bg-rose-950 text-white border-rose-800' 
                : toast.type === 'warning' 
                  ? 'bg-amber-950 text-white border-amber-800' 
                  : 'bg-slate-900 text-white border-slate-800'
          }`}>
            {toast.type === 'success' && <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />}
            {toast.type === 'warning' && <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />}
            {toast.type === 'error' && <AlertTriangle className="w-5 h-5 text-rose-400 flex-shrink-0 mt-0.5" />}
            {toast.type === 'info' && <Info className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />}

            <div className="flex-1 min-w-0">
              <div className="font-bold text-xs">{toast.title}</div>
              <div className="text-[11px] opacity-90 mt-0.5 leading-relaxed">{toast.desc}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
