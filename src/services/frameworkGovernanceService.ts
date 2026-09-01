import { SOWProject, SOWSection } from '../types/quill';
import { ImpactAnalysisResult } from '../types/jira';

export interface AllowedSectionCatalogueItem {
  id: string;
  name: string;
  defaultCategory: SOWSection['category'];
  isMandatory: boolean;
  isPricingSection: boolean;
  standardRationale: string;
  recommendedPosition: number;
}

export const ALLOWED_SECTION_CATALOGUE: AllowedSectionCatalogueItem[] = [
  {
    id: 'SEC-CAT-01',
    name: '1. Engagement Overview',
    defaultCategory: 'Scope',
    isMandatory: true,
    isPricingSection: false,
    standardRationale: 'Establishes the business objectives, strategic intent, and core client pain points grounded in discovery meetings.',
    recommendedPosition: 1
  },
  {
    id: 'SEC-CAT-02',
    name: '2. Goals and Objectives',
    defaultCategory: 'Scope',
    isMandatory: true,
    isPricingSection: false,
    standardRationale: 'Defines quantifiable target metrics, business outcomes, and operational goals.',
    recommendedPosition: 2
  },
  {
    id: 'SEC-CAT-03',
    name: '3. Scope and Delivery Approach',
    defaultCategory: 'Deliverables',
    isMandatory: true,
    isPricingSection: false,
    standardRationale: 'Detailed phased delivery approach (Engage, Envision, Enact, Empower) with activities and deliverables.',
    recommendedPosition: 3
  },
  {
    id: 'SEC-CAT-04',
    name: '4. Governance and Responsibilities',
    defaultCategory: 'Governance',
    isMandatory: true,
    isPricingSection: false,
    standardRationale: 'Outlines DTMC and Client roles, escalation paths, and responsibilities matrix.',
    recommendedPosition: 4
  },
  {
    id: 'SEC-CAT-05',
    name: '5. Schedule and Acceptance',
    defaultCategory: 'Timeline',
    isMandatory: true,
    isPricingSection: false,
    standardRationale: 'Milestone schedule baseline and explicit 5-day client review and acceptance criteria.',
    recommendedPosition: 5
  },
  {
    id: 'SEC-CAT-06',
    name: '6. Assumptions',
    defaultCategory: 'Assumptions',
    isMandatory: true,
    isPricingSection: false,
    standardRationale: 'Key assumptions, client dependencies, data cleansing ownership, and licensing boundaries.',
    recommendedPosition: 6
  },
  {
    id: 'SEC-CAT-07',
    name: '7. Out of Scope',
    defaultCategory: 'Scope',
    isMandatory: true,
    isPricingSection: false,
    standardRationale: 'Explicitly excluded integrations, data remediation, and unsupported customization to prevent scope creep.',
    recommendedPosition: 7
  },
  {
    id: 'SEC-CAT-08',
    name: '8. Illustrative Fees',
    defaultCategory: 'Pricing',
    isMandatory: true,
    isPricingSection: true,
    standardRationale: 'Illustrative commercial model and placeholder fee ranges.',
    recommendedPosition: 8
  },
  {
    id: 'SEC-CAT-09',
    name: '9. Authorization',
    defaultCategory: 'Terms',
    isMandatory: true,
    isPricingSection: false,
    standardRationale: 'Formal dual execution signature blocks for Authorized Representative of Client and DTMC Partner.',
    recommendedPosition: 9
  }
];

export const frameworkGovernanceService = {
  getAllowedCatalogue() {
    return ALLOWED_SECTION_CATALOGUE;
  },

  generateCorrelationId(prefix: string = 'req_fw'): string {
    return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 7)}`;
  },

  // QTK-019: Framework Approval gate check
  canProceedToSectionDrafting(project: SOWProject): { canProceed: boolean; reason?: string } {
    if (!project.frameworkApproved) {
      return {
        canProceed: false,
        reason: 'Framework approval is required before section-by-section drafting. Please review and approve the framework outline.'
      };
    }
    if (!project.sections || project.sections.length === 0) {
      return {
        canProceed: false,
        reason: 'Project framework contains no sections. Please add at least one section to the framework.'
      };
    }
    return { canProceed: true };
  },

  // QTK-020: Deterministic Impact Analysis when framework changes after initial generation
  analyzeFrameworkImpact(originalSections: SOWSection[], modifiedSections: SOWSection[]): ImpactAnalysisResult {
    const sectionsRequiringRegeneration: ImpactAnalysisResult['sectionsRequiringRegeneration'] = [];
    const unaffectedApprovedSections: ImpactAnalysisResult['unaffectedApprovedSections'] = [];

    modifiedSections.forEach(current => {
      const original = originalSections.find(s => s.id === current.id);
      if (!original) {
        // Newly added section
        sectionsRequiringRegeneration.push({
          sectionId: current.id,
          sectionTitle: current.title,
          impactType: 'DEPENDENCY_UPDATED',
          currentStatus: current.status,
          recommendedAction: 'Regenerate Section'
        });
      } else if (original.order !== current.order) {
        // Order changed
        sectionsRequiringRegeneration.push({
          sectionId: current.id,
          sectionTitle: current.title,
          impactType: 'ORDER_CHANGED',
          currentStatus: current.status,
          recommendedAction: current.status === 'Approved' ? 'Re-review Content' : 'Regenerate Section'
        });
      } else if (original.category !== current.category) {
        // Category changed
        sectionsRequiringRegeneration.push({
          sectionId: current.id,
          sectionTitle: current.title,
          impactType: 'CATEGORY_CHANGED',
          currentStatus: current.status,
          recommendedAction: 'Regenerate Section'
        });
      } else if (original.title !== current.title) {
        // Title changed
        sectionsRequiringRegeneration.push({
          sectionId: current.id,
          sectionTitle: current.title,
          impactType: 'TITLE_CHANGED',
          currentStatus: current.status,
          recommendedAction: 'Re-review Content'
        });
      } else if (current.status === 'Approved') {
        // Unaffected approved section
        unaffectedApprovedSections.push({
          sectionId: current.id,
          sectionTitle: current.title,
          status: current.status
        });
      }
    });

    return {
      modifiedFrameworkAt: new Date().toISOString(),
      sectionsRequiringRegeneration,
      unaffectedApprovedSections
    };
  }
};
