export type SOWStatus = 'Draft' | 'Generated' | 'Under Review' | 'Approved' | 'Exported';

export type SectionStatus = 'Pending' | 'Generating' | 'Review' | 'Approved' | 'Rejected' | 'Superseded';

export interface SectionComment {
  id: string;
  author: string;
  authorEmail?: string;
  authorInitials: string;
  authorAvatarBg?: string;
  timestamp: string;
  text: string;
}

export type UploadedDocCategory = 
  | 'Meeting Transcription' 
  | 'Requirement Clarification' 
  | 'SRS Document' 
  | 'Architecture & Scope PDF' 
  | 'Client Brief Word Doc' 
  | 'Discovery Notes';

export interface UploadedProjectDocument {
  id: string;
  fileName: string;
  fileType: 'pdf' | 'docx' | 'xlsx' | 'txt' | 'srs' | 'vtt' | 'srt';
  fileSizeBytes?: number;
  uploadedAt: string;
  uploadedBy: string;
  category: UploadedDocCategory;
  sectionReference?: string;
  pageOrTimestamp?: string;
  snippet?: string;
  keyRequirementsExtracted?: string[];
  url?: string;
}

export interface DetailedSourceCitation {
  id: string;
  documentId?: string;
  fileName: string;
  fileType: 'pdf' | 'docx' | 'xlsx' | 'txt' | 'srs' | 'vtt' | 'srt';
  category?: UploadedDocCategory;
  section: string;
  page: number | string;
  snippet?: string;
  url?: string;
}

export interface SectionVersionSnapshot {
  version: number;
  timestamp: string;
  editedBy: string;
  status: SectionStatus;
  content: string;
  approvalRationale?: string;
  rejectionReason?: string;
  changeSummary?: string;
  confidenceScore: number;
  etag: string;
}

export interface UnsupportedClaimItem {
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

export interface TokenBudgetInfo {
  systemPromptTokens: number;
  approvedEvidenceTokens: number;
  priorSectionsSummaryTokens: number;
  projectIntakeTokens: number;
  maxOutputTokens: number;
  totalTokens: number;
  maxAllowedTokens: number;
  modelName: string;
}

export interface SOWSection {
  id: string;
  projectId: string;
  order: number;
  title: string;
  category: 'Scope' | 'Deliverables' | 'Assumptions' | 'Governance' | 'Acceptance' | 'Pricing' | 'Timeline' | 'Staffing' | 'Terms';
  content: string;
  status: SectionStatus;
  isMandatory: boolean;
  isPricingSection: boolean;
  groundedSources: SourceDocument[];
  detailedSources?: DetailedSourceCitation[];
  uploadedDocumentIds?: string[]; // IDs of PM uploaded documents used for this specific section
  comments?: SectionComment[];
  version: number;
  lastEditedBy: string;
  lastEditedAt: string;
  approvedBy?: string;
  approvedAt?: string;
  approvalRationale?: string;
  rejectionReason?: string;
  regenerationPrompt?: string;
  confidenceScore: number; // 0-100
  validationNotes?: string[];
  etag?: string;
  isLocked?: boolean;
  lockedBy?: string;
  lockExpiresAt?: string;
  versionHistory?: SectionVersionSnapshot[];
  unsupportedClaims?: UnsupportedClaimItem[];
  tokenBudget?: TokenBudgetInfo;
  previousContentSnapshot?: string; // For diff viewer
  requiresReapproval?: boolean;
}

export interface SOWProject {
  id: string;
  title: string;
  clientName: string;
  clientIndustry: string;
  projectType: string;
  targetStartDate: string;
  targetEndDate: string;
  currency: string;
  estimatedBudgetPlaceholder: string; // e.g. "[To be determined upon finalized staffing plan]"
  status: SOWStatus;
  currentStep: number;
  createdAt: string;
  updatedAt: string;
  ownerName: string;
  ownerEmail: string;
  description: string;
  meetingNotes: string;
  discoveryDocNames: string[];
  uploadedDocuments: UploadedProjectDocument[]; // Resources uploaded by PM during SOW creation
  additionalRequirements: string;
  selectedTemplateId: string;
  proposalTemplateId?: string;
  frameworkApproved: boolean;
  frameworkApprovedBy?: string;
  frameworkApprovedAt?: string;
  frameworkVersion?: number;
  sections: SOWSection[];
  exportHistory: ExportRecord[];
}

export interface SourceDocument {
  id: string;
  title: string;
  library: 'Approved Clauses' | 'Reference SOWs' | 'Discovery Documents' | 'Templates';
  url: string;
  relevanceScore: number; // 0.0 - 1.0
  snippet: string;
  author: string;
  modifiedDate: string;
  securityClearance: 'Public' | 'Internal' | 'Confidential' | 'Restricted';
  matchedClauses: string[];
}

export interface SharePointListSchema {
  listName: string;
  description: string;
  fields: {
    name: string;
    type: 'Single line of text' | 'Multiple lines of text' | 'Choice' | 'Number' | 'DateTime' | 'Lookup' | 'Boolean' | 'Person or Group';
    required: boolean;
    description: string;
    allowedValues?: string[];
  }[];
}

export interface ExportRecord {
  id: string;
  exportDate: string;
  exportedBy: string;
  fileName: string;
  fileSizeBytes: number;
  format: 'DOCX (DTMC Formatted)';
  versionNumber: string;
  sharePointUrl: string;
  pricingFieldsVerifiedBlank: boolean;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  projectId: string;
  projectTitle: string;
  user: string;
  userEmail: string;
  action: 'PROJECT_CREATED' | 'GRAPH_SEARCH_TRIGGERED' | 'FRAMEWORK_GENERATED' | 'FRAMEWORK_APPROVED' | 'SECTION_GENERATED' | 'SECTION_REGENERATED' | 'SECTION_APPROVED' | 'SECTION_EDITED' | 'DOCUMENT_EXPORTED' | 'VERSION_SAVED' | 'TEMPLATE_USED_FOR_SOW';
  details: string;
  status: 'SUCCESS' | 'WARNING' | 'FAILED';
  executionTimeMs?: number;
}

export interface N8nWorkflowNode {
  id: string;
  name: string;
  type: string;
  category: 'Trigger' | 'HTTP/Graph' | 'Azure OpenAI' | 'SharePoint List' | 'Python DOCX' | 'Transform' | 'Router';
  status: 'idle' | 'running' | 'success' | 'error';
  executionTime?: string;
  inputs?: Record<string, any>;
  outputs?: Record<string, any>;
}

export interface N8nWorkflowDefinition {
  id: string;
  name: string;
  description: string;
  endpoint: string;
  triggerEvent: string;
  nodes: N8nWorkflowNode[];
  samplePayload: Record<string, any>;
  sampleResponse: Record<string, any>;
}
