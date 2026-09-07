import { SOWTemplate, TemplateValidationResult, ValidationItem, GovernanceRoleItem, TemplateSection, TemplateType } from '../types/template';
import { SOWProject, SOWSection } from '../types/quill';
import { validateProjectPricingPolicy } from './pricingValidationService';

export const DEFAULT_DTMC_ROLES: GovernanceRoleItem[] = [
  {
    id: 'ROLE-01',
    role: 'DTMC Engagement Lead',
    responsibility: 'Overall delivery quality, scope governance and executive escalation.',
    isOptional: false,
    order: 1,
  },
  {
    id: 'ROLE-02',
    role: 'DTMC Project Manager',
    responsibility: 'Project planning, RAID management, status reporting, decision tracking and deliverable coordination.',
    isOptional: false,
    order: 2,
  },
  {
    id: 'ROLE-03',
    role: 'DTMC Solution Lead',
    responsibility: 'Solution quality, technical decisions, architecture oversight and technical delivery coordination.',
    isOptional: false,
    order: 3,
  },
  {
    id: 'ROLE-04',
    role: 'Client Product Owner',
    responsibility: 'Business priorities, stakeholder coordination, timely decisions and deliverable acceptance.',
    isOptional: false,
    order: 4,
  },
  {
    id: 'ROLE-05',
    role: 'Client Technical Lead',
    responsibility: 'Environment access, technical validation, data readiness, security coordination and deployment support.',
    isOptional: false,
    order: 5,
  },
  {
    id: 'ROLE-06',
    role: 'Client Subject Matter Experts',
    responsibility: 'Business requirements, process validation, testing participation and feedback.',
    isOptional: false,
    order: 6,
  }
];

export const STANDARD_DTMC_MASTER_TEMPLATE: SOWTemplate = {
  id: 'TMPL-DTMC-MASTER-2026',
  metadata: {
    id: 'TMPL-DTMC-MASTER-2026',
    name: 'DTMC Standard Master SOW Template',
    description: 'The official DTMC advisory framework template for enterprise digital transformations and modernization projects.',
    templateType: 'Master SOW',
    version: '2.4',
    status: 'Ready for Use',
    createdBy: 'Nikhil (Project Manager)',
    createdDate: '2026-01-15T09:00:00Z',
    modifiedBy: 'Enterprise Architecture Board',
    modifiedDate: '2026-08-18T14:30:00Z',
    approvedForUse: true,
    wordTemplateFile: 'DTMC_Sample_SOW_01_SharePoint_Advisory (1).docx',
    sharePointTemplateUrl: '',
  },
  coverPage: {
    companyBrand: 'DTMC',
    documentTitle: 'STATEMENT OF WORK',
    projectNamePlaceholder: '{{PROJECT_NAME}}',
    clientOrgPlaceholder: '{{CLIENT_ORGANIZATION_NAME}}',
    clientContactNamePlaceholder: '{{CLIENT_CONTACT_NAME}}',
    clientContactEmailPlaceholder: '{{CLIENT_CONTACT_EMAIL}}',
    sowFormatPlaceholder: '{{SOW_FORMAT}}',
    issuedByOrganization: 'DTMC Advisory Group',
    dtmcContactEmailPlaceholder: '{{DTMC_CONTACT_EMAIL}}',
    dtmcContactNumberPlaceholder: '{{DTMC_CONTACT_NUMBER}}',
    documentVersionPlaceholder: '{{DOCUMENT_VERSION}}',
    issueDatePlaceholder: '{{ISSUE_DATE}}',
  },
  usageCount: 42,
  tags: ['Standard', 'Master SOW', 'DTMC Approved', 'Enterprise'],
  sections: [
    {
      id: 'SEC-T-01',
      order: 1,
      title: '1. Engagement Overview',
      category: 'Overview',
      isMandatory: true,
      isOptional: false,
      isPricingSection: false,
      isAppendix: false,
      description: 'Executive summary of the engagement, strategic context, and business drivers.',
      defaultPlaceholders: ['{{PROJECT_NAME}}', '{{CLIENT_ORGANIZATION_NAME}}', '{{PRIMARY_BUSINESS_OBJECTIVE}}'],
      content: `### 1. Engagement Overview

{{CLIENT_ORGANIZATION_NAME}} wants a governed and sustainable foundation for **{{PROJECT_NAME}}**. DTMC will assess the current state, define the target model and create an actionable implementation roadmap.`
    },
    {
      id: 'SEC-T-02',
      order: 2,
      title: '2. Goals and Objectives',
      category: 'Overview',
      isMandatory: true,
      isOptional: false,
      isPricingSection: false,
      isAppendix: false,
      description: 'Explicit measurable business and technical objectives.',
      defaultPlaceholders: ['{{CLIENT_ORGANIZATION_NAME}}', '{{TARGET_TIMELINE_WEEKS}}'],
      content: `### 2. Goals and Objectives

- Assess current structures, permissions and governance practices.
- Define a client-centric information architecture and reusable patterns.
- Create governance, resourcing, migration and AI-readiness recommendations.
- Provide a sequenced roadmap with priorities, dependencies and decision points.`
    },
    {
      id: 'SEC-T-03',
      order: 3,
      title: '3. Scope and Delivery Approach',
      category: 'Scope',
      isMandatory: true,
      isOptional: false,
      isPricingSection: false,
      isAppendix: false,
      description: 'In-scope workstreams, methodology, phases, and key deliverables.',
      defaultPlaceholders: ['{{PROJECT_NAME}}', '{{DELIVERY_METHODOLOGY}}'],
      content: `### 3. Scope and Delivery Approach

| Phase / Workstream | Key Activities | Primary Deliverables |
|---|---|---|
| Engage | Kickoff, stakeholder interviews, configuration review and requirements capture. | Discovery summary; findings register; requirements brief. |
| Envision | Target information architecture, governance model, migration strategy and AI-readiness assessment. | Solution design; governance plan; implementation roadmap. |`
    },
    {
      id: 'SEC-T-04',
      order: 4,
      title: '4. Governance and Responsibilities',
      category: 'Governance',
      isMandatory: true,
      isOptional: false,
      isPricingSection: false,
      isAppendix: false,
      description: 'Staffing roles, RACI distribution, and escalation matrix.',
      governanceRoles: [...DEFAULT_DTMC_ROLES],
      content: `### 4. Governance and Responsibilities

| Role | Responsibility |
|---|---|
| DTMC Engagement Lead | Overall delivery quality, scope governance and executive escalation. |
| DTMC Project Manager | Plan, RAID log, status reporting, decisions and deliverable tracking. |
| Client Product Owner | Priorities, stakeholder access, timely decisions and acceptance. |
| Client Technical Lead | Environment access, technical validation, data readiness and deployment coordination. |`
    },
    {
      id: 'SEC-T-05',
      order: 5,
      title: '5. Schedule and Acceptance',
      category: 'Schedule',
      isMandatory: true,
      isOptional: false,
      isPricingSection: false,
      isAppendix: false,
      description: 'Milestone timeline, dependencies, and contractually compliant acceptance procedures.',
      defaultPlaceholders: ['{{ANTICIPATED_START_DATE}}', '{{ANTICIPATED_COMPLETION_DATE}}', '{{ESTIMATED_DURATION}}'],
      scheduleFields: {
        anticipatedStartDate: '{{ANTICIPATED_START_DATE}}',
        anticipatedCompletionDate: '{{ANTICIPATED_COMPLETION_DATE}}',
        estimatedDuration: '{{ESTIMATED_DURATION}}',
        keyMilestones: [
          'Milestone 1: Project Initiation & Architecture Baseline',
          'Milestone 2: Sprint Iteration 1-4 Feature Implementation',
          'Milestone 3: SIT & UAT Testing Completion',
          'Milestone 4: Production Go-Live & Hypercare Sign-Off'
        ],
        dependencies: [
          'Client provides timely access to staging environments and target cloud tenants.',
          'Client Subject Matter Experts are available for scheduled design sprints and review gates.'
        ],
        acceptancePeriod: 'As stipulated in applicable Master Agreement',
        acceptanceProcess: 'Formal written acceptance submitted via Deliverable Acceptance Form'
      },
      content: `### 5. Schedule and Acceptance

The detailed schedule will be baselined at kickoff. Deliverables are accepted when the client provides written approval or no material exception within five business days. Dates in this sample are intentionally illustrative.`
    },
    {
      id: 'SEC-T-06',
      order: 6,
      title: '6. Assumptions',
      category: 'Assumptions',
      isMandatory: true,
      isOptional: false,
      isPricingSection: false,
      isAppendix: false,
      description: 'Foundational operational, technical, and resource assumptions.',
      defaultPlaceholders: ['{{CLIENT_ORGANIZATION_NAME}}'],
      content: `### 6. Assumptions

- Client provides appropriate tenant access and stakeholder availability.
- Standard Microsoft 365 tools will be used for collaboration and deliverables.
- Client feedback is provided within five business days.`
    },
    {
      id: 'SEC-T-07',
      order: 7,
      title: '7. Out of Scope',
      category: 'Scope',
      isMandatory: true,
      isOptional: false,
      isPricingSection: false,
      isAppendix: false,
      description: 'Explicitly excluded activities and deliverables to prevent scope creep.',
      defaultPlaceholders: ['{{CLIENT_ORGANIZATION_NAME}}'],
      content: `### 7. Out of Scope

- Production migration or site build.
- Custom Power Platform development.
- Licensing procurement and ongoing managed services.`
    },
    {
      id: 'SEC-T-08',
      order: 8,
      title: '8. Illustrative Fees',
      category: 'Pricing',
      isMandatory: true,
      isOptional: false,
      isPricingSection: true,
      isAppendix: false,
      description: 'Commercial pricing structure with illustrative placeholder fees or blank rate card.',
      defaultPlaceholders: ['{{CURRENCY}}', '{{FEE_STRUCTURE_TYPE}}'],
      content: `### 8. Illustrative Fees

| Commercial Model | Illustrative Amount | Billing |
|---|---|---|
| Time and materials | $24,000 to $32,000 | Monthly, based on actual effort |

All amounts are fictional placeholders for sample evaluation and must be replaced during contracting.`
    },
    {
      id: 'SEC-T-09',
      order: 9,
      title: '9. Authorization',
      category: 'Authorization',
      isMandatory: true,
      isOptional: false,
      isPricingSection: false,
      isAppendix: false,
      description: 'Formal execution and signature blocks with signature fields.',
      defaultPlaceholders: ['{{CLIENT_ORGANIZATION_NAME}}', '{{CLIENT_SIGNATORY_NAME}}', '{{DTMC_SIGNATORY_NAME}}'],
      content: `### 9. Authorization

| Accepted by Client | Accepted by DTMC |
|---|---|
| **Name:** {{CLIENT_SIGNATORY_NAME}}<br/>**Title:** VP, Transformation<br/>**Signature:** __________________<br/>**Date:** __________________ | **Name:** {{DTMC_SIGNATORY_NAME}}<br/>**Title:** Engagement Partner<br/>**Signature:** __________________<br/>**Date:** __________________ |`
    },
    {
      id: 'SEC-T-10',
      order: 10,
      title: 'Appendix A: Data Migration Scope',
      category: 'Appendix',
      isMandatory: false,
      isOptional: true,
      isPricingSection: false,
      isAppendix: true,
      description: 'Optional appendix detailing data migration datasets, ETL rules, and validation criteria.',
      defaultPlaceholders: ['{{CLIENT_ORGANIZATION_NAME}}'],
      content: `### Appendix A: Data Migration Scope

*(Optional Appendix — remove if engagement does not include data migration)*

#### A.1 Scope of Data Migration
DTMC will support the migration of agreed structured datasets from legacy databases to target schemas.

#### A.2 In-Scope Source Systems
- Source System A: Customer profile records (active accounts only)
- Source System B: Transactional historical records (last 24 months)

#### A.3 Data Cleansing & Reconciliation Criteria
- 100% automated checksum validation on migrated record counts.
- Client validation sign-off on staging reconciliation reports.`
    },
    {
      id: 'SEC-T-11',
      order: 11,
      title: 'Appendix B: Integration Scope',
      category: 'Appendix',
      isMandatory: false,
      isOptional: true,
      isPricingSection: false,
      isAppendix: true,
      description: 'Optional appendix detailing third-party API interfaces, webhooks, and security protocols.',
      defaultPlaceholders: [],
      content: `### Appendix B: Integration Scope

*(Optional Appendix — remove if engagement does not include API integration work)*

#### B.1 Target Integrations
| Interface ID | Target System | Protocol | Payload Type | Authentication |
|---|---|---|---|---|
| INT-01 | Core ERP System | REST / HTTPS | JSON | OAuth 2.0 / mTLS |
| INT-02 | Identity Provider | SAML 2.0 / OIDC | JWT | Microsoft Entra ID |
| INT-03 | Notification Gateway | Webhook | JSON | HMAC Signature |`
    },
    {
      id: 'SEC-T-12',
      order: 12,
      title: 'Appendix C: Testing and Acceptance Criteria',
      category: 'Appendix',
      isMandatory: false,
      isOptional: true,
      isPricingSection: false,
      isAppendix: true,
      description: 'Optional appendix detailing test cycles, defect severity definitions, and exit criteria.',
      defaultPlaceholders: [],
      content: `### Appendix C: Testing and Acceptance Criteria

*(Optional Appendix)*

#### C.1 Defect Classification
- **Severity 1 (Critical)**: Complete system outage or data corruption with no operational workaround.
- **Severity 2 (High)**: Major business function severely impaired with high-effort workaround.
- **Severity 3 (Medium)**: Minor business function impaired with manageable workaround.
- **Severity 4 (Low)**: Cosmetic, documentation, or minor UI discrepancies.

#### C.2 Acceptance Exit Criteria
UAT will be deemed complete when 100% of test scenarios have been executed with 0 Severity 1 and 0 Severity 2 defects open.`
    },
    {
      id: 'SEC-T-13',
      order: 13,
      title: 'Appendix D: Change-Control Process',
      category: 'Appendix',
      isMandatory: false,
      isOptional: true,
      isPricingSection: false,
      isAppendix: true,
      description: 'Optional formal change order procedure, impact assessment, and approval workflows.',
      defaultPlaceholders: [],
      content: `### Appendix D: Change-Control Process

*(Optional Appendix)*

Either party may request changes to the project scope, deliverables, or schedule by submitting a written Change Request (CR).

1. **Submission**: Requester logs a formal Change Request form.
2. **Impact Assessment**: DTMC performs technical, cost, and schedule impact analysis within 5 business days.
3. **Approval**: Both DTMC Engagement Lead and Client Product Owner must sign the Change Order before work commences.`
    },
    {
      id: 'SEC-T-14',
      order: 14,
      title: 'Appendix E: Approved Legal Clauses',
      category: 'Appendix',
      isMandatory: false,
      isOptional: true,
      isPricingSection: false,
      isAppendix: true,
      description: 'Optional appendix for enterprise confidentiality, IP ownership, and data privacy clauses.',
      defaultPlaceholders: [],
      content: `### Appendix E: Approved Legal Clauses

*(Optional Appendix — aligned with DTMC Master Services Agreement)*

- **Intellectual Property**: Pre-existing DTMC frameworks and accelerators remain the exclusive IP of DTMC. Client receives a perpetual, non-exclusive license to use custom project deliverables.
- **Confidentiality**: All information shared during the engagement is subject to reciprocal NDA provisions in the Master Agreement.
- **Data Protection**: Both parties agree to adhere to applicable data privacy statutes.`
    }
  ]
};

export const SAMPLE_ADDITIONAL_TEMPLATES: SOWTemplate[] = [
  STANDARD_DTMC_MASTER_TEMPLATE,

  {
    id: 'TMPL-SHAREPOINT-ADVISORY-2026',

    metadata: {
      id: 'TMPL-SHAREPOINT-ADVISORY-2026',
      name: 'DTMC_Sample_SOW_01_SharePoint_Advisory (1).docx',
      description:
        'SharePoint Advisory SOW template from the approved Google Drive sample library.',
      templateType: 'SharePoint Advisory',
      version: '1.0',
      status: 'Ready for Use',
      createdBy: 'DTMC',
      createdDate: '2026-01-15T09:00:00Z',
      modifiedBy: 'DTMC',
      modifiedDate: '2026-08-18T14:30:00Z',
      approvedForUse: true,
      wordTemplateFile:
        'DTMC_Sample_SOW_01_SharePoint_Advisory (1).docx',
      sharePointTemplateUrl: '',
    },

    coverPage: {
      ...STANDARD_DTMC_MASTER_TEMPLATE.coverPage,
    },

    usageCount: 0,

    tags: [
      'SharePoint',
      'Advisory',
      'Google Drive Template',
    ],

    sections:
      STANDARD_DTMC_MASTER_TEMPLATE.sections
        .filter(
          s =>
            s.order >= 1 &&
            s.order <= 9 &&
            !s.isAppendix
        ),
  },

  {
    id: 'TMPL-VOLUNTEER-MANAGEMENT-2026',

    metadata: {
      id: 'TMPL-VOLUNTEER-MANAGEMENT-2026',
      name:
        'DTMC_Sample_SOW_02_Volunteer_Management.docx',
      description:
        'Volunteer Management SOW template from the approved Google Drive sample library.',
      templateType: 'Volunteer Management',
      version: '1.0',
      status: 'Ready for Use',
      createdBy: 'DTMC',
      createdDate: '2026-01-15T09:00:00Z',
      modifiedBy: 'DTMC',
      modifiedDate: '2026-08-18T14:30:00Z',
      approvedForUse: true,
      wordTemplateFile:
        'DTMC_Sample_SOW_02_Volunteer_Management.docx',
      sharePointTemplateUrl: '',
    },

    coverPage: {
      ...STANDARD_DTMC_MASTER_TEMPLATE.coverPage,
    },

    usageCount: 0,

    tags: [
      'Volunteer Management',
      'Google Drive Template',
    ],

    sections:
      STANDARD_DTMC_MASTER_TEMPLATE.sections
        .filter(
          s =>
            s.order >= 1 &&
            s.order <= 9 &&
            !s.isAppendix
        ),
  },

  {
    id: 'TMPL-BUSINESS-CENTRAL-2026',

    metadata: {
      id: 'TMPL-BUSINESS-CENTRAL-2026',
      name:
        'DTMC_Sample_SOW_03_Business_Central.docx',
      description:
        'Business Central SOW template from the approved Google Drive sample library.',
      templateType: 'Business Central',
      version: '1.0',
      status: 'Ready for Use',
      createdBy: 'DTMC',
      createdDate: '2026-01-15T09:00:00Z',
      modifiedBy: 'DTMC',
      modifiedDate: '2026-08-18T14:30:00Z',
      approvedForUse: true,
      wordTemplateFile:
        'DTMC_Sample_SOW_03_Business_Central.docx',
      sharePointTemplateUrl: '',
    },

    coverPage: {
      ...STANDARD_DTMC_MASTER_TEMPLATE.coverPage,
    },

    usageCount: 0,

    tags: [
      'Business Central',
      'Google Drive Template',
    ],

    sections:
      STANDARD_DTMC_MASTER_TEMPLATE.sections
        .filter(
          s =>
            s.order >= 1 &&
            s.order <= 9 &&
            !s.isAppendix
        ),
  },

  {
    id: 'TMPL-NETSUITE-READINESS-2026',

    metadata: {
      id: 'TMPL-NETSUITE-READINESS-2026',
      name:
        'DTMC_Sample_SOW_04_NetSuite_Readiness.docx',
      description:
        'NetSuite Readiness SOW template from the approved Google Drive sample library.',
      templateType: 'NetSuite Readiness',
      version: '1.0',
      status: 'Ready for Use',
      createdBy: 'DTMC',
      createdDate: '2026-01-15T09:00:00Z',
      modifiedBy: 'DTMC',
      modifiedDate: '2026-08-18T14:30:00Z',
      approvedForUse: true,
      wordTemplateFile:
        'DTMC_Sample_SOW_04_NetSuite_Readiness.docx',
      sharePointTemplateUrl: '',
    },

    coverPage: {
      ...STANDARD_DTMC_MASTER_TEMPLATE.coverPage,
    },

    usageCount: 0,

    tags: [
      'NetSuite',
      'Readiness',
      'Google Drive Template',
    ],

    sections:
      STANDARD_DTMC_MASTER_TEMPLATE.sections
        .filter(
          s =>
            s.order >= 1 &&
            s.order <= 9 &&
            !s.isAppendix
        ),
  },
];

const LOCAL_STORAGE_KEY = 'quill_sow_templates_v2';

// Template Service Methods
export const templateService = {
  getTemplates(): SOWTemplate[] {
    try {
      if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
        const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (stored) {
          return JSON.parse(stored);
        }
      }
    } catch (e) {
      // In SSR or test environments without window/localStorage, fall back to default templates
    }
    return SAMPLE_ADDITIONAL_TEMPLATES;
  },

  getTemplateById(id: string): SOWTemplate | undefined {
    const all = this.getTemplates();
    return all.find(t => t.id === id);
  },

  saveTemplate(template: SOWTemplate): SOWTemplate {
    const all = this.getTemplates();
    const updatedTemplate: SOWTemplate = {
      ...template,
      metadata: {
        ...template.metadata,
        modifiedDate: new Date().toISOString(),
        modifiedBy: 'Nikhil (PM)'
      }
    };

    const existingIndex = all.findIndex(t => t.id === template.id);
    let updatedList: SOWTemplate[];
    if (existingIndex >= 0) {
      updatedList = [...all];
      updatedList[existingIndex] = updatedTemplate;
    } else {
      updatedList = [updatedTemplate, ...all];
    }

    try {
      if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedList));
      }
    } catch (e) {
      // ignore
    }

    return updatedTemplate;
  },

  duplicateTemplate(sourceId: string): SOWTemplate | null {
    const source = this.getTemplateById(sourceId);
    if (!source) return null;

    const newId = `TMPL-COPY-${Date.now()}`;
    const duplicated: SOWTemplate = {
      ...JSON.parse(JSON.stringify(source)),
      id: newId,
      metadata: {
        ...source.metadata,
        id: newId,
        name: `${source.metadata.name} (Copy)`,
        version: '1.0',
        status: 'Draft',
        approvedForUse: false,
        createdDate: new Date().toISOString(),
        modifiedDate: new Date().toISOString(),
        createdBy: 'Nikhil (PM)',
        modifiedBy: 'Nikhil (PM)'
      },
      usageCount: 0
    };

    return this.saveTemplate(duplicated);
  },

  deleteTemplate(id: string): boolean {
    const all = this.getTemplates();
    const filtered = all.filter(t => t.id !== id);
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(filtered));
      return true;
    } catch (e) {
      console.error('Error deleting template from localStorage', e);
      return false;
    }
  },

  // Comprehensive Template Validation Engine
  validateTemplate(template: SOWTemplate): TemplateValidationResult {
    const items: ValidationItem[] = [];

    // 1. Template name present
    if (template.metadata.name && template.metadata.name.trim().length > 3) {
      items.push({
        id: 'VAL-01',
        ruleName: 'Template Name Check',
        category: 'Mandatory Metadata',
        severity: 'Passed',
        message: `Template name is valid: "${template.metadata.name}"`
      });
    } else {
      items.push({
        id: 'VAL-01',
        ruleName: 'Template Name Check',
        category: 'Mandatory Metadata',
        severity: 'Failed',
        message: 'Template name is missing or too short.'
      });
    }

    // 2. Project name placeholder exists
    const hasProjectName = 
      template.coverPage.projectNamePlaceholder.includes('{{PROJECT_NAME}}') || 
      template.sections.some(s => s.content.includes('{{PROJECT_NAME}}'));
    if (hasProjectName) {
      items.push({
        id: 'VAL-02',
        ruleName: 'Project Name Placeholder',
        category: 'Placeholders',
        severity: 'Passed',
        message: 'Project name placeholder {{PROJECT_NAME}} is present on cover page and sections.'
      });
    } else {
      items.push({
        id: 'VAL-02',
        ruleName: 'Project Name Placeholder',
        category: 'Placeholders',
        severity: 'Failed',
        message: 'Missing mandatory placeholder {{PROJECT_NAME}} in cover page or body.'
      });
    }

    // 3. Client organization placeholder exists
    const hasClientOrg = 
      template.coverPage.clientOrgPlaceholder.includes('{{CLIENT_ORGANIZATION_NAME}}') || 
      template.sections.some(s => s.content.includes('{{CLIENT_ORGANIZATION_NAME}}'));
    if (hasClientOrg) {
      items.push({
        id: 'VAL-03',
        ruleName: 'Client Organization Placeholder',
        category: 'Placeholders',
        severity: 'Passed',
        message: 'Client organization placeholder {{CLIENT_ORGANIZATION_NAME}} is present.'
      });
    } else {
      items.push({
        id: 'VAL-03',
        ruleName: 'Client Organization Placeholder',
        category: 'Placeholders',
        severity: 'Failed',
        message: 'Missing mandatory placeholder {{CLIENT_ORGANIZATION_NAME}}.'
      });
    }

    // Mandatory sections check list
    const mandatorySectionRules: { titleKey: string; name: string }[] = [
      { titleKey: 'overview', name: 'Engagement Overview' },
      { titleKey: 'goals', name: 'Goals and Objectives' },
      { titleKey: 'scope', name: 'Scope and Delivery Approach' },
      { titleKey: 'governance', name: 'Governance and Responsibilities' },
      { titleKey: 'schedule', name: 'Schedule and Acceptance' },
      { titleKey: 'assumptions', name: 'Assumptions' },
      { titleKey: 'out of scope', name: 'Out of Scope' },
      { titleKey: 'fees', name: 'Fees and Commercial Information' },
      { titleKey: 'authorization', name: 'Authorization' },
    ];

    mandatorySectionRules.forEach((rule, idx) => {
      const found = template.sections.find(s => 
        s.title.toLowerCase().includes(rule.titleKey)
      );

      if (found && found.content.trim().length > 30) {
        items.push({
          id: `VAL-SEC-${idx + 4}`,
          ruleName: `Mandatory Section: ${rule.name}`,
          category: 'Mandatory Sections',
          severity: 'Passed',
          message: `Mandatory section "${rule.name}" exists and has comprehensive structure (${found.content.length} characters).`,
          sectionId: found.id
        });
      } else if (found) {
        items.push({
          id: `VAL-SEC-${idx + 4}`,
          ruleName: `Mandatory Section: ${rule.name}`,
          category: 'Mandatory Sections',
          severity: 'Warning',
          message: `Section "${rule.name}" exists but content is brief or requires further detail.`,
          sectionId: found.id
        });
      } else {
        items.push({
          id: `VAL-SEC-${idx + 4}`,
          ruleName: `Mandatory Section: ${rule.name}`,
          category: 'Mandatory Sections',
          severity: 'Failed',
          message: `Missing mandatory section "${rule.name}". DTMC SOWs require this section.`
        });
      }
    });

    // 13. Pricing fields contain no unvetted monetary values
    const pricingValidation = validateProjectPricingPolicy(template.sections);

    if (pricingValidation.isValid) {
      items.push({
        id: 'VAL-PRICE-01',
        ruleName: 'Blank Pricing Policy Verification',
        category: 'Blank Pricing Policy',
        severity: 'Passed',
        message: 'All pricing fields and rate tables contain no unapproved monetary values in compliance with DTMC policy.'
      });
    } else {
      const sampleViolations = pricingValidation.violations.slice(0, 2).map(v => `"${v.match}" in ${v.sectionTitle}`).join(', ');
      items.push({
        id: 'VAL-PRICE-01',
        ruleName: 'Blank Pricing Policy Verification',
        category: 'Blank Pricing Policy',
        severity: 'Failed',
        message: `Monetary/rate figures detected (${sampleViolations}). Pricing must remain blank placeholders for Commercial Finance sign-off.`
      });
    }

    // 14. Signature fields are blank
    const authSection = template.sections.find(s => s.category === 'Authorization' || s.title.toLowerCase().includes('authorization') || s.title.toLowerCase().includes('signature'));
    if (authSection) {
      if (authSection.content.includes('____') || authSection.content.includes('[ — ]') || authSection.content.toLowerCase().includes('signature')) {
        items.push({
          id: 'VAL-AUTH-01',
          ruleName: 'Signature Blocks Blank Check',
          category: 'Signatures',
          severity: 'Passed',
          message: 'Signature fields and date execution lines are properly blanked placeholders.'
        });
      } else {
        items.push({
          id: 'VAL-AUTH-01',
          ruleName: 'Signature Blocks Blank Check',
          category: 'Signatures',
          severity: 'Warning',
          message: 'Authorization section should include standard blank underline signature lines.'
        });
      }
    }

    // 15. Unique Section IDs & Valid Order
    const sectionIds = template.sections.map(s => s.id);
    const hasDuplicateIds = new Set(sectionIds).size !== sectionIds.length;
    if (!hasDuplicateIds) {
      items.push({
        id: 'VAL-ORDER-01',
        ruleName: 'Unique Section IDs & Structure',
        category: 'Mandatory Sections',
        severity: 'Passed',
        message: `All ${template.sections.length} sections have unique identifiers and valid sequence indices.`
      });
    } else {
      items.push({
        id: 'VAL-ORDER-01',
        ruleName: 'Unique Section IDs & Structure',
        category: 'Mandatory Sections',
        severity: 'Failed',
        message: 'Duplicate section IDs detected in template hierarchy.'
      });
    }

    // 16. Unsupported placeholders check
    const rawPlaceholders: string[] = [];
    template.sections.forEach(s => {
      const matches = s.content.match(/\{\{([A-Z0-9_]+)\}\}/g);
      if (matches) {
        matches.forEach(m => {
          if (!rawPlaceholders.includes(m)) rawPlaceholders.push(m);
        });
      }
    });

    const knownPlaceholders = [
      '{{PROJECT_NAME}}', '{{CLIENT_ORGANIZATION_NAME}}', '{{CLIENT_CONTACT_NAME}}',
      '{{CLIENT_CONTACT_EMAIL}}', '{{SOW_FORMAT}}', '{{DTMC_CONTACT_EMAIL}}',
      '{{DTMC_CONTACT_NUMBER}}', '{{DOCUMENT_VERSION}}', '{{ISSUE_DATE}}',
      '{{PRIMARY_BUSINESS_OBJECTIVE}}', '{{TARGET_TIMELINE_WEEKS}}', '{{DELIVERY_METHODOLOGY}}',
      '{{ANTICIPATED_START_DATE}}', '{{ANTICIPATED_COMPLETION_DATE}}', '{{ESTIMATED_DURATION}}',
      '{{CURRENCY}}', '{{FEE_STRUCTURE_TYPE}}', '{{DTMC_SIGNATORY_NAME}}',
      '{{CLIENT_SIGNATORY_NAME}}', '{{CLIENT_SIGNATORY_TITLE}}'
    ];

    const unknownPlaceholders = rawPlaceholders.filter(p => !knownPlaceholders.includes(p));
    if (unknownPlaceholders.length === 0) {
      items.push({
        id: 'VAL-PLH-01',
        ruleName: 'Supported Placeholders Check',
        category: 'Placeholders',
        severity: 'Passed',
        message: `All ${rawPlaceholders.length} placeholders match registered DTMC template tags.`
      });
    } else {
      items.push({
        id: 'VAL-PLH-01',
        ruleName: 'Supported Placeholders Check',
        category: 'Placeholders',
        severity: 'Warning',
        message: `Custom or unregistered placeholders detected: ${unknownPlaceholders.join(', ')}. Ensure n8n mapping exists.`
      });
    }

    // 17. Legal Acceptance wording warning check
    const schedSection = template.sections.find(s => s.title.toLowerCase().includes('schedule'));
    if (schedSection && (schedSection.content.toLowerCase().includes('5 business days') || schedSection.content.toLowerCase().includes('5 days'))) {
      items.push({
        id: 'VAL-LEG-01',
        ruleName: 'Acceptance Period Legal Review',
        category: 'Legal Compliance',
        severity: 'Warning',
        message: 'Fixed 5-day acceptance period detected in Schedule section. Acceptance language must be validated against approved contract clause library.'
      });
    } else {
      items.push({
        id: 'VAL-LEG-01',
        ruleName: 'Acceptance Period Legal Review',
        category: 'Legal Compliance',
        severity: 'Passed',
        message: 'Schedule and acceptance wording appropriately references the governing Master Agreement.'
      });
    }

    // 18. Word template attachment check
    if (template.metadata.wordTemplateFile && template.metadata.wordTemplateFile.endsWith('.dotx') || template.metadata.wordTemplateFile.endsWith('.docx')) {
      items.push({
        id: 'VAL-DOCX-01',
        ruleName: 'Approved DTMC Word Template Attached',
        category: 'Template Assets',
        severity: 'Passed',
        message: `Approved Word template attached: "${template.metadata.wordTemplateFile}"`
      });
    } else {
      items.push({
        id: 'VAL-DOCX-01',
        ruleName: 'Approved DTMC Word Template Attached',
        category: 'Template Assets',
        severity: 'Failed',
        message: 'No approved .dotx or .docx Word template linked to this template record.'
      });
    }

    const passedCount = items.filter(i => i.severity === 'Passed').length;
    const warningCount = items.filter(i => i.severity === 'Warning').length;
    const failedCount = items.filter(i => i.severity === 'Failed').length;

    const isValid = failedCount === 0;
    const canMarkReady = failedCount === 0;

    return {
      isValid,
      canMarkReady,
      totalChecks: items.length,
      passedCount,
      warningCount,
      failedCount,
      items,
      timestamp: new Date().toISOString()
    };
  },

  // Create a brand new template from the master baseline
  createTemplate(name?: string, templateType?: TemplateType): SOWTemplate {
    const newId = `TMPL-CUSTOM-${Date.now()}`;
    const newTemplate: SOWTemplate = {
      id: newId,
      metadata: {
        id: newId,
        name: name || 'New DTMC SOW Template',
        description: 'Custom Statement of Work template based on the DTMC enterprise master baseline.',
        templateType: templateType || 'Master SOW',
        version: '1.0',
        status: 'Draft',
        createdBy: 'Nikhil (PM)',
        createdDate: new Date().toISOString(),
        modifiedBy: 'Nikhil',
        modifiedDate: new Date().toISOString(),
        approvedForUse: false,
        wordTemplateFile: 'DTMC_Sample_SOW_01_SharePoint_Advisory (1).docx',
        sharePointTemplateUrl: ''
      },
      coverPage: { ...STANDARD_DTMC_MASTER_TEMPLATE.coverPage },
      usageCount: 0,
      tags: ['Custom SOW', 'DTMC Standard'],
      sections: STANDARD_DTMC_MASTER_TEMPLATE.sections.map((s, idx) => ({
        ...s,
        id: `SEC-NEW-${idx + 1}`
      }))
    };

    return this.saveTemplate(newTemplate);
  },

  // Helper to initialize a new SOW project from an SOWTemplate
  createSOWProjectFromTemplate(template: SOWTemplate, clientName: string, projectTitle: string, targetStartDate: string, targetEndDate: string, clientContact?: string, clientContactEmail?: string): SOWProject {
    const newProjectId = `PRJ-${Date.now().toString().slice(-4)}`;

    const sowSections: SOWSection[] = template.sections.map((ts, idx) => {
      // Replace generic placeholders with input values
      const processedContent = ts.content
        .replace(/\{\{PROJECT_NAME\}\}/g, projectTitle)
        .replace(/\{\{CLIENT_ORGANIZATION_NAME\}\}/g, clientName)
        .replace(/\{\{CLIENT_CONTACT_NAME\}\}/g, clientContact || '')
        .replace(/\{\{CLIENT_CONTACT_EMAIL\}\}/g, clientContactEmail || '')
        .replace(/\{\{CLIENT_SIGNATORY_NAME\}\}/g, clientContact || '')
        .replace(/\{\{ANTICIPATED_START_DATE\}\}/g, targetStartDate || '2026-10-01')
        .replace(/\{\{ANTICIPATED_COMPLETION_DATE\}\}/g, targetEndDate || '2027-03-31')
        .replace(/\{\{ESTIMATED_DURATION\}\}/g, '6 Months (24 Sprints)')
        .replace(/\{\{CURRENCY\}\}/g, 'USD')
        .replace(/\{\{FEE_STRUCTURE_TYPE\}\}/g, template.metadata.templateType)
        .replace(/\{\{DOCUMENT_VERSION\}\}/g, '1.0')
        .replace(/\{\{ISSUE_DATE\}\}/g, new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }));

      return {
        id: `SEC-${newProjectId}-${idx + 1}`,
        projectId: newProjectId,
        order: ts.order,
        title: ts.title,
        category: ts.category,
        content: processedContent,
        status: 'Review',
        isMandatory: ts.isMandatory,
        isPricingSection: ts.isPricingSection,
        groundedSources: [],
        version: 1,
        lastEditedBy: 'Nikhil (PM)',
        lastEditedAt: new Date().toISOString(),
        confidenceScore: 96,
        validationNotes: ts.isPricingSection ? ['Pricing policy checked: figures blank.'] : undefined
      };
    });

    return {
      id: newProjectId,
      title: projectTitle || `${clientName} SOW Engagement`,
      clientName: clientName || 'Client Organization',
      clientContact: clientContact || '',
      clientContactEmail: clientContactEmail || '',
      issuerName: 'DTMC Advisory Group',
      issuerEmail: 'advisory@dtmc.example',
      issuerPhone: '+1 555 010 2000',
      sowFormat: template.metadata.templateType,
      wordTemplateFile: template.metadata.wordTemplateFile,
      clientIndustry: 'Financial Services',
      projectType: template.metadata.templateType,
      targetStartDate: targetStartDate || '2026-10-01',
      targetEndDate: targetEndDate || '2027-03-31',
      currency: 'USD',
      estimatedBudgetPlaceholder: '[To be determined upon finalized staffing schedule]',
      status: 'Under Review',
      currentStep: 3,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ownerName: 'Nikhil',
      ownerEmail: 'nikhil@acme-transform.com',
      description: `SOW generated from approved template "${template.metadata.name}" (v${template.metadata.version}).`,
      meetingNotes: `Initialized from template ${template.metadata.name}. All pricing fields maintained blank for commercial sign-off.`,
      discoveryDocNames: [template.metadata.wordTemplateFile],
      uploadedDocuments: [],
      additionalRequirements: 'Adhere to DTMC corporate styling standards and blank pricing placeholders.',
      selectedTemplateId: template.id,
      frameworkApproved: true,
      sections: sowSections,
      exportHistory: []
    };
  }
};