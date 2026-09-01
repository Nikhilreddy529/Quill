import { SOWSection, SourceDocument, UploadedProjectDocument } from './quill';

export interface SprintTicket {
  id: string; // e.g. "QTK-001"
  epicId: string; // e.g. "QEP-01"
  epicName: string; // e.g. "Input Intake and Normalization"
  track: string; // e.g. "Product / UX", "Frontend", "QA / Evaluation", "AI / Prompting", "Workflow", "State / Governance", "Reliability / QA", "Audit", "Concurrency / QA"
  summary: string;
  acceptanceCriteria: string;
  priority: 'Must Have' | 'Should Have' | 'Could Have';
  status: 'Done' | 'In Progress' | 'In Review' | 'Not Started';
  assignee: string;
  sprint: 'Sprint 1' | 'Sprint 2';
  dependencies: string[];
  interactiveDemoId?: string;
  testCasesCount?: number;
  verificationDetails?: string;
}

export interface IntakeSpecification {
  supportedFileTypes: {
    extension: string;
    mimeType: string;
    name: string;
    maxSizeBytes: number;
    description: string;
  }[];
  maxIndividualFileSizeMB: number;
  maxTotalIntakeSizeMB: number;
  maxManualTextChars: number;
  supportedTranscriptFormats: {
    format: 'VTT' | 'SRT' | 'Teams / Zoom Transcript';
    description: string;
    samplePattern: string;
  }[];
  validationRules: string[];
  sourceTraceabilityRules: string[];
}

export interface RetrievalBenchmarkTestCase {
  id: string;
  category: 'No Result' | 'Unauthorized Result' | 'Stale Content' | 'Conflicting Clauses' | 'Prompt Injection';
  query: string;
  expectedBehavior: string;
  thresholdMetric: string;
  targetThreshold: number; // e.g. 95%
  actualResult: number; // e.g. 98.2%
  status: 'PASSED' | 'FAILED' | 'WARNING';
  log: string;
}

export interface RetrievalBenchmarkReport {
  timestamp: string;
  overallScore: number;
  precision: number;
  coverage: number;
  injectionBlockRate: number;
  staleContentDetectionRate: number;
  unauthorizedAccessPrevented: number;
  averageLatencyMs: number;
  totalTests: number;
  passedTests: number;
  testCases: RetrievalBenchmarkTestCase[];
}

export interface SectionVersionSnapshot {
  version: number;
  timestamp: string;
  editedBy: string;
  status: 'Draft' | 'Review' | 'Approved' | 'Rejected' | 'Superseded';
  content: string;
  approvalRationale?: string;
  rejectionReason?: string;
  changeSummary?: string;
  confidenceScore: number;
  etag: string;
}

export interface UnsupportedClaim {
  id: string;
  type: 'UNGROUNDED_FEE' | 'UNSUPPORTED_DATE' | 'OUT_OF_SCOPE_HARDWARE' | 'UNGROUNDED_SLA' | 'MISSING_SOURCE_CITATION';
  severity: 'CRITICAL' | 'WARNING' | 'INFO';
  highlightedText: string;
  explanation: string;
  suggestedCorrection: string;
  isDismissed?: boolean;
  dismissedBy?: string;
  dismissedReason?: string;
}

export interface TokenBudgetBreakdown {
  systemPromptTokens: number;
  approvedEvidenceTokens: number;
  priorSectionsSummaryTokens: number;
  projectIntakeTokens: number;
  maxOutputTokens: number;
  totalTokens: number;
  maxAllowedTokens: number;
  modelName: string;
}

export interface ImpactAnalysisResult {
  modifiedFrameworkAt: string;
  sectionsRequiringRegeneration: {
    sectionId: string;
    sectionTitle: string;
    impactType: 'ORDER_CHANGED' | 'CATEGORY_CHANGED' | 'TITLE_CHANGED' | 'DEPENDENCY_UPDATED';
    currentStatus: string;
    recommendedAction: 'Regenerate Section' | 'Re-review Content' | 'Preserve Approved';
  }[];
  unaffectedApprovedSections: {
    sectionId: string;
    sectionTitle: string;
    status: string;
  }[];
}

export interface ConcurrencyLock {
  sectionId: string;
  isLocked: boolean;
  lockedBy?: string;
  lockedByUserEmail?: string;
  lockedAt?: string;
  lockExpiresAt?: string;
  etag: string;
}
