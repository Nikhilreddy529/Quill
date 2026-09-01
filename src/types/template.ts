export type TemplateStatus = 'Draft' | 'Under Review' | 'Ready for Use' | 'Archived';

export type TemplateType = 
  | 'Master SOW'
  | 'Fixed-Price Modernization'
  | 'Time & Materials Consulting'
  | 'Milestone-Based Delivery'
  | 'Cloud Migration & Security'
  | 'Staff Augmentation'
  | 'Retainer & Advisory';

export interface GovernanceRoleItem {
  id: string;
  role: string;
  responsibility: string;
  isOptional: boolean;
  order: number;
}

export interface TemplateSection {
  id: string;
  order: number;
  title: string;
  category: 'Overview' | 'Scope' | 'Governance' | 'Schedule' | 'Assumptions' | 'Pricing' | 'Authorization' | 'Appendix';
  content: string;
  isMandatory: boolean;
  isOptional: boolean;
  isPricingSection: boolean;
  isAppendix: boolean;
  description?: string;
  defaultPlaceholders?: string[];
  governanceRoles?: GovernanceRoleItem[];
  scheduleFields?: {
    anticipatedStartDate: string;
    anticipatedCompletionDate: string;
    estimatedDuration: string;
    keyMilestones: string[];
    dependencies: string[];
    acceptancePeriod: string;
    acceptanceProcess: string;
  };
}

export interface SOWTemplateMetadata {
  id: string;
  name: string;
  description: string;
  templateType: TemplateType;
  version: string;
  status: TemplateStatus;
  createdBy: string;
  createdDate: string;
  modifiedBy: string;
  modifiedDate: string;
  approvedForUse: boolean;
  wordTemplateFile: string;
  sharePointTemplateUrl: string;
}

export interface SOWCoverPageConfig {
  companyBrand: string;
  documentTitle: string;
  projectNamePlaceholder: string;
  clientOrgPlaceholder: string;
  clientContactNamePlaceholder: string;
  clientContactEmailPlaceholder: string;
  sowFormatPlaceholder: string;
  issuedByOrganization: string;
  dtmcContactEmailPlaceholder: string;
  dtmcContactNumberPlaceholder: string;
  documentVersionPlaceholder: string;
  issueDatePlaceholder: string;
}

export interface SOWTemplate {
  id: string;
  metadata: SOWTemplateMetadata;
  coverPage: SOWCoverPageConfig;
  sections: TemplateSection[];
  usageCount: number;
  tags: string[];
}

export type ValidationSeverity = 'Passed' | 'Warning' | 'Failed';

export interface ValidationItem {
  id: string;
  ruleName: string;
  category: 'Mandatory Metadata' | 'Placeholders' | 'Mandatory Sections' | 'Blank Pricing Policy' | 'Signatures' | 'Legal Compliance' | 'Template Assets';
  severity: ValidationSeverity;
  message: string;
  details?: string;
  sectionId?: string;
}

export interface TemplateValidationResult {
  isValid: boolean;
  canMarkReady: boolean;
  totalChecks: number;
  passedCount: number;
  warningCount: number;
  failedCount: number;
  items: ValidationItem[];
  timestamp: string;
}
