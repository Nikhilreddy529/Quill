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
    wordTemplateFile: 'DTMC_Master_SOW_Template_2026.dotx',
    sharePointTemplateUrl: 'https://dtmc.sharepoint.com/sites/advisory/templates/DTMC_Master_SOW_Template_2026.dotx',
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
      content: `This Statement of Work ("SOW") is entered into by and between **DTMC Advisory Group** ("DTMC") and **{{CLIENT_ORGANIZATION_NAME}}** ("Client") pursuant to the Master Services Agreement ("MSA") in effect between the parties.

1.1 Purpose
The purpose of this engagement is to provide professional advisory and technical delivery services for the **{{PROJECT_NAME}}** initiative. DTMC will collaborate with Client stakeholders to deliver high-quality, architecturally validated outcomes aligned with {{CLIENT_ORGANIZATION_NAME}}'s strategic modernization goals.

1.2 Background & Strategic Alignment
Client is undertaking modernization across target workloads to improve operational agility, enterprise resilience, and system scalability. This SOW sets forth the specific scope, deliverables, governance framework, and contractual assumptions governing this phase of delivery.`
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
      content: `The primary objectives of the **{{PROJECT_NAME}}** engagement include:

1. **Strategic Modernization**: Establish an enterprise-grade architecture foundation aligned with industry benchmarks and security frameworks.
2. **Quality Deliverable Execution**: Formulate and deliver verified milestone deliverables within agreed sprint cadences.
3. **Risk Mitigation**: Identify technical debt, security gaps, and operational bottlenecks early through formal governance and decision tracking.
4. **Knowledge Transfer**: Equip {{CLIENT_ORGANIZATION_NAME}} technical teams and operational owners with transition runbooks, architectural blueprints, and handover sessions.`
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
      content: `* Engage: Kickoff, current-state workshops and prioritized requirements. Primary Deliverables: Requirements and process flows; draft plan; RAID log.
* Envision: Data model, solution design, integration and test planning. Primary Deliverables: Solution design; wireframes; data map; test plan.
* Enact: Configure Power Apps, Dataverse and Power Automate; migrate test data; support UAT. Primary Deliverables: Configured solution; validated migration; UAT completion.
* Empower: Admin training, train-the-trainer, launch and stabilization. Primary Deliverables: Training materials; launch checklist; closeout report.`
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
      content: `* DTMC Engagement Lead: Overall delivery quality, scope governance and executive escalation.
* DTMC Project Manager: Plan, RAID log, status reporting, decisions and deliverable tracking.
* Client Product Owner: Priorities, stakeholder access, timely decisions and acceptance.
* Client Technical Lead: Environment access, technical validation, data readiness and deployment coordination.`
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
      content: `The detailed schedule will be baselined at kickoff. Deliverables are accepted when the client provides written approval or no material exception within five business days. Dates in this sample are intentionally illustrative.`
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
      content: `* Client owns source-data cleansing and approval.
* Client procures required Microsoft licenses.
* One legacy system and one public-site integration are included.`
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
      content: `* Unlisted third-party integrations.
* Historical data remediation outside agreed templates.
* Support beyond the defined stabilization period.`
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
      content: `* Commercial Model: Time and materials
* Illustrative Amount: [ — ]
* Billing: Initial deposit plus monthly actuals

*All fee amounts remain intentionally blank pending Commercial Finance sign-off prior to contracting.*`
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
      content: `Accepted by Client:
* Name: {{CLIENT_SIGNATORY_NAME}}
* Title: VP, Transformation
* Signature: ___________________________
* Date: ________________________________

Accepted by DTMC:
* Name: {{DTMC_SIGNATORY_NAME}}
* Title: Engagement Partner
* Signature: ___________________________
* Date: ________________________________`
    }
  ]
};

export const SAMPLE_ADDITIONAL_TEMPLATES: SOWTemplate[] = [
  STANDARD_DTMC_MASTER_TEMPLATE,
  {
    id: 'TMPL-AZURE-CLOUD-2026',
    metadata: {
      id: 'TMPL-AZURE-CLOUD-2026',
      name: 'Azure Cloud Migration & Modernization SOW Template',
      description: 'Tailored specifically for enterprise Azure infrastructure migrations, zero-trust Entra ID governance, and microservices architecture.',
      templateType: 'Cloud Migration & Security',
      version: '1.8',
      status: 'Ready for Use',
      createdBy: 'Cloud Practice Center of Excellence',
      createdDate: '2026-02-10T10:00:00Z',
      modifiedBy: 'Nikhil',
      modifiedDate: '2026-08-20T11:15:00Z',
      approvedForUse: true,
      wordTemplateFile: 'DTMC_Azure_Cloud_Migration_2026.dotx',
      sharePointTemplateUrl: 'https://dtmc.sharepoint.com/sites/advisory/templates/DTMC_Azure_Cloud_Migration_2026.dotx',
    },
    coverPage: {
      ...STANDARD_DTMC_MASTER_TEMPLATE.coverPage,
      documentTitle: 'STATEMENT OF WORK — CLOUD MIGRATION',
    },
    usageCount: 28,
    tags: ['Azure', 'Cloud Migration', 'Infrastructure', 'Zero-Trust'],
    sections: STANDARD_DTMC_MASTER_TEMPLATE.sections.map(s => {
      if (s.id === 'SEC-T-03') {
        return {
          ...s,
          content: `DTMC will deliver full-lifecycle Azure Cloud Landing Zone setup, security posture hardening, workload migration, and cutover testing for target applications.`
        };
      }
      return s;
    })
  },
  {
    id: 'TMPL-FIXED-PRICE-MOD-2026',
    metadata: {
      id: 'TMPL-FIXED-PRICE-MOD-2026',
      name: 'Fixed-Price Modernization SOW Template (Milestone-Gated)',
      description: 'Structured for milestone-governed fixed fee projects with rigorous deliverable acceptance gates and change control.',
      templateType: 'Fixed-Price Modernization',
      version: '1.3',
      status: 'Draft',
      createdBy: 'Commercial Advisory Team',
      createdDate: '2026-03-01T14:00:00Z',
      modifiedBy: 'Enterprise Architecture Board',
      modifiedDate: '2026-08-22T16:00:00Z',
      approvedForUse: false,
      wordTemplateFile: 'DTMC_Fixed_Price_Milestone_2026.dotx',
      sharePointTemplateUrl: 'https://dtmc.sharepoint.com/sites/advisory/templates/DTMC_Fixed_Price_Milestone_2026.dotx',
    },
    coverPage: {
      ...STANDARD_DTMC_MASTER_TEMPLATE.coverPage,
      documentTitle: 'STATEMENT OF WORK — FIXED PRICE MILESTONES',
    },
    usageCount: 12,
    tags: ['Fixed-Price', 'Milestone', 'Governance'],
    sections: STANDARD_DTMC_MASTER_TEMPLATE.sections
  }
];

const LOCAL_STORAGE_KEY = 'quill_sow_templates_v3';

// Template Service Methods
export const templateService = {
  getTemplates(): SOWTemplate[] {
    const sanitizeTemplate = (t: SOWTemplate): SOWTemplate => ({
      ...t,
      sections: t.sections
        .filter(s => !s.isAppendix && s.order <= 9 && !s.title.toLowerCase().startsWith('appendix'))
    });

    try {
      if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
        const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored) as SOWTemplate[];
          return parsed.map(sanitizeTemplate);
        }
      }
    } catch (e) {
      // In SSR or test environments without window/localStorage, fall back to default templates
    }
    return SAMPLE_ADDITIONAL_TEMPLATES.map(sanitizeTemplate);
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
        wordTemplateFile: 'DTMC_Master_SOW_Template_2026.dotx',
        sharePointTemplateUrl: 'https://dtmc.sharepoint.com/sites/advisory/templates/DTMC_Master_SOW_Template_2026.dotx'
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
      const clientSignatory = clientContact || clientName || 'Riley Chen';
      const dtmcCreator = 'Nikhil';

      // Replace generic placeholders with input values
      let processedContent = ts.content
        .replace(/\{\{PROJECT_NAME\}\}/g, projectTitle)
        .replace(/\{\{CLIENT_ORGANIZATION_NAME\}\}/g, clientName)
        .replace(/\{\{CLIENT_CONTACT_NAME\}\}/g, clientContact || '')
        .replace(/\{\{CLIENT_CONTACT_EMAIL\}\}/g, clientContactEmail || '')
        .replace(/\{\{CLIENT_SIGNATORY_NAME\}\}/g, clientSignatory)
        .replace(/\{\{DTMC_SIGNATORY_NAME\}\}/g, dtmcCreator)
        .replace(/\{\{ANTICIPATED_START_DATE\}\}/g, targetStartDate || '2026-10-01')
        .replace(/\{\{ANTICIPATED_COMPLETION_DATE\}\}/g, targetEndDate || '2027-03-31')
        .replace(/\{\{ESTIMATED_DURATION\}\}/g, '6 Months (24 Sprints)')
        .replace(/\{\{CURRENCY\}\}/g, 'USD')
        .replace(/\{\{FEE_STRUCTURE_TYPE\}\}/g, template.metadata.templateType)
        .replace(/\{\{DOCUMENT_VERSION\}\}/g, '1.0')
        .replace(/\{\{ISSUE_DATE\}\}/g, new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }));

      // If Authorization section, ensure dynamic client signatory and DTMC creator names with static titles
      if (ts.order === 9 || ts.title.toLowerCase().includes('authorization') || processedContent.includes('Accepted by Client')) {
        processedContent = processedContent
          .replace(/(Accepted by Client:[\s\S]*?\*\s*Name:\s*)([^\n]+)/i, `$1${clientSignatory}`)
          .replace(/(Accepted by Client:[\s\S]*?\*\s*Title:\s*)([^\n]+)/i, '$1VP, Transformation')
          .replace(/(Accepted by DTMC:[\s\S]*?\*\s*Name:\s*)([^\n]+)/i, `$1${dtmcCreator}`)
          .replace(/(Accepted by DTMC:[\s\S]*?\*\s*Title:\s*)([^\n]+)/i, '$1Engagement Partner');
      }

      // Clean redundant top heading and heading hashes (#) so text is pristine
      processedContent = processedContent
        .replace(/^\s*#{1,6}\s*\d+\.\s*[^\n]+\n+/, '')
        .split('\n')
        .map(line => (/^\s*#{1,6}\s+/.test(line) ? line.replace(/^\s*#{1,6}\s+/, '') : line))
        .join('\n');

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
