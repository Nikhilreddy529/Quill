import { SOWSection, SourceDocument } from '../types/quill';
import { SAMPLE_SOURCE_DOCUMENTS } from '../data/sampleSharePointData';

export interface GenerationResult {
  content: string;
  groundedSources: SourceDocument[];
  confidenceScore: number;
  pricingVerifiedBlank: boolean;
  validationNotes: string[];
}

export function validatePricingIsBlank(content: string): { isValid: boolean; detectedViolations: string[] } {
  // Regex to detect unvetted pricing figures (e.g. $50,000, 150/hr, €20,000, $150.00)
  const currencyRegex = /(\$|€|£|¥)\s*[0-9]{1,3}(,[0-9]{3})*(\.[0-9]{2})?|\b[0-9]{2,6}\s*(USD|EUR|GBP)\b/gi;
  const matches = content.match(currencyRegex);
  
  // Also check if [TBD or [To be determined is present
  const hasPlaceholder = /\[(TBD|To be determined|TBA|Insert).*?\]/i.test(content);

  if (matches && matches.length > 0) {
    return {
      isValid: false,
      detectedViolations: matches,
    };
  }

  return {
    isValid: true,
    detectedViolations: [],
  };
}

export async function generateSectionContent(
  sectionTitle: string,
  category: SOWSection['category'],
  clientName: string,
  discoveryNotes: string,
  customInstructions?: string
): Promise<GenerationResult> {
  // Simulate network & AI thinking latency (1.2 seconds)
  await new Promise((resolve) => setTimeout(resolve, 1200));

  let content = "";
  let groundedSources: SourceDocument[] = [];
  let confidenceScore = 94;
  const validationNotes: string[] = [];

  switch (category) {
    case 'Scope':
      groundedSources = [SAMPLE_SOURCE_DOCUMENTS[0], SAMPLE_SOURCE_DOCUMENTS[1]];
      content = `### ${sectionTitle}

This section establishes the technical and operational boundaries for the **${clientName}** initiative [Ref: SRC-SOW-089].

#### In-Scope Technical Architecture
* **Landing Zone Orchestration:** Implementation of multi-region hub-and-spoke virtual networks with central Azure Firewall egress inspection [Ref: SRC-CL-001].
* **Workload Wave Execution:** Systematic discovery, dependency mapping, and migration of target application workloads.
* **Identity Governance:** Enforcement of Microsoft Entra ID Privileged Identity Management (PIM) with just-in-time access approval workflows [Ref: SRC-CL-001].

${customInstructions ? `\n> **Applied Refinement:** ${customInstructions}\n` : ''}`;
      validationNotes.push("Grounded in Master Cloud Governance Clauses and 2025 Reference SOWs");
      break;

    case 'Deliverables':
      groundedSources = [SAMPLE_SOURCE_DOCUMENTS[1], SAMPLE_SOURCE_DOCUMENTS[3]];
      content = `### ${sectionTitle}

The following formal deliverables will be generated, validated, and transferred to **${clientName}**:

| Deliverable ID | Deliverable Title | Format / Artifact | Acceptance Standard |
| :--- | :--- | :--- | :--- |
| **DEL-01** | Enterprise Cloud Architecture Blueprint | PDF & Word Document (DTMC) | Formal approval by Client Technical Architecture Review Board [Ref: SRC-SOW-089]. |
| **DEL-02** | Infrastructure as Code (IaC) Baseline | Azure Bicep / Terraform Repository | Passed automated static code security and compliance linting. |
| **DEL-03** | Workload Cutover & Rollback Runbook | Markdown / DOCX Runbook | Successful dry-run completion in Non-Production staging tier [Ref: SRC-SOW-104]. |
| **DEL-04** | Operational Handover & Knowledge Transfer | 3 Recorded Workshops & Runbooks | Minimum 85% attendee comprehension score on operational walk-through. |

${customInstructions ? `\n* **Custom Deliverable Requirement:** ${customInstructions}` : ''}`;
      validationNotes.push("All deliverables mapped to quantifiable acceptance criteria");
      break;

    case 'Assumptions':
      groundedSources = [SAMPLE_SOURCE_DOCUMENTS[2]];
      content = `### ${sectionTitle}

#### Engagement Assumptions
1. **Personnel Availability:** Client will designate a Primary Technical Sponsor and Subject Matter Experts available for weekly cadence meetings [Ref: SRC-CL-014].
2. **Access Provisioning:** Direct VPN/ExpressRoute network connectivity and Entra ID Contributor subscriptions will be granted within 5 calendar days of kickoff.
3. **Environment Staging:** Client maintains responsibility for existing legacy infrastructure stability and data backup snapshots prior to migration waves [Ref: SRC-CL-014].

#### Out-of-Scope Items
* Decommissioning or physical sanitization of legacy on-premises blade servers.
* Custom application code refactoring or rewriting legacy monolithic APIs into microservices.`;
      validationNotes.push("Standard corporate risk mitigation clauses applied");
      break;

    case 'Pricing':
      groundedSources = [SAMPLE_SOURCE_DOCUMENTS[4]];
      content = `### ${sectionTitle}

> **MANDATORY GOVERNANCE NOTICE:** In compliance with enterprise contracting guidelines, all pricing figures, rate cards, and financial commitments remain intentionally unpopulated in this generated technical draft [Ref: SRC-CL-033].

#### Estimated Professional Services Investment
* **Billing Model:** Time & Materials (T&M) / Milestone-Based
* **Total Proposed Engagement Value:** \`[TBD: Insert Approved Total Professional Services Fee]\`
* **Invoicing Schedule:** Bi-weekly in arrears (\`Net 30 Days\`)

#### Schedule B - Resource Rate Card Placeholder
| Staffing Role | Standard Rate | Estimated Hours | Extended Fee |
| :--- | :--- | :--- | :--- |
| Lead Enterprise Solution Architect | \`[TBD: Rate Card]\` | \`[TBD: Hours]\` | \`[TBD: Subtotal]\` |
| Senior Cloud Migration Engineer | \`[TBD: Rate Card]\` | \`[TBD: Hours]\` | \`[TBD: Subtotal]\` |
| Security & Identity Specialist | \`[TBD: Rate Card]\` | \`[TBD: Hours]\` | \`[TBD: Subtotal]\` |
| Engagement Delivery Lead / PM | \`[TBD: Rate Card]\` | \`[TBD: Hours]\` | \`[TBD: Subtotal]\` |`;
      confidenceScore = 100;
      validationNotes.push("Zero pricing commitments detected (100% compliant)");
      break;

    default:
      groundedSources = [SAMPLE_SOURCE_DOCUMENTS[0]];
      content = `### ${sectionTitle}

This section outlines the operational standards and management policies governing the **${clientName}** engagement [Ref: SRC-CL-001].

* **Governance Rhythm:** Weekly project status reports delivered every Friday by 5:00 PM EST.
* **Issue Escalation:** Tier 1 (Project Manager) -> Tier 2 (Practice Director) -> Tier 3 (Executive Steering Committee).
* **Change Order Protocol:** Any modification impacting timeline or resource allocation requires a formal written Change Request (CR) signed by both parties.

${customInstructions ? `\n> Refinement: ${customInstructions}` : ''}`;
      validationNotes.push("Standard operational governance framework applied");
  }

  const pricingCheck = validatePricingIsBlank(content);

  return {
    content,
    groundedSources,
    confidenceScore,
    pricingVerifiedBlank: pricingCheck.isValid,
    validationNotes,
  };
}

export function generateDefaultFramework(projectType: string, clientName: string): Partial<SOWSection>[] {
  return [
    {
      order: 1,
      title: "1. Engagement Overview",
      category: "Scope",
      isMandatory: true,
      isPricingSection: false,
    },
    {
      order: 2,
      title: "2. Goals and Objectives",
      category: "Scope",
      isMandatory: true,
      isPricingSection: false,
    },
    {
      order: 3,
      title: "3. Scope and Delivery Approach",
      category: "Deliverables",
      isMandatory: true,
      isPricingSection: false,
    },
    {
      order: 4,
      title: "4. Governance and Responsibilities",
      category: "Governance",
      isMandatory: true,
      isPricingSection: false,
    },
    {
      order: 5,
      title: "5. Schedule and Acceptance",
      category: "Timeline",
      isMandatory: true,
      isPricingSection: false,
    },
    {
      order: 6,
      title: "6. Assumptions",
      category: "Assumptions",
      isMandatory: true,
      isPricingSection: false,
    },
    {
      order: 7,
      title: "7. Out of Scope",
      category: "Scope",
      isMandatory: true,
      isPricingSection: false,
    },
    {
      order: 8,
      title: "8. Illustrative Fees",
      category: "Pricing",
      isMandatory: true,
      isPricingSection: true,
    },
    {
      order: 9,
      title: "9. Authorization",
      category: "Terms",
      isMandatory: true,
      isPricingSection: false,
    }
  ];
}
