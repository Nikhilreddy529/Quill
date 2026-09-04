import { SOWProject } from '../types/quill';
import { SAMPLE_SOURCE_DOCUMENTS } from './sampleSharePointData';

export const INITIAL_SAMPLE_PROJECTS: SOWProject[] = [
  {
    id: "PRJ-2026-ACME",
    title: "Digital Transformation - Acme Corp",
    clientName: "Acme Corp",
    clientContact: "Riley Chen (VP Digital)",
    clientContactEmail: "riley.chen@acme.com",
    clientIndustry: "Retail & Consumer Goods",
    projectType: "Digital Transformation",
    targetStartDate: "2026-10-01",
    targetEndDate: "2027-04-30",
    currency: "USD",
    estimatedBudgetPlaceholder: "[To be determined upon finalized staffing schedule]",
    status: "Under Review",
    currentStep: 3,
    createdAt: "2026-08-27T14:30:00Z",
    updatedAt: "2026-08-28T11:32:00Z",
    ownerName: "Nikhil",
    ownerEmail: "nikhil@acme-transform.com",
    description: "Enterprise digital transformation for Acme Corp covering business process assessment, solution architecture, software development, data migration, testing, and 30-day go-live support.",
    meetingNotes: "Stakeholder discovery notes: Modernize core ERP and customer omnichannel experiences. Ensure secure data migration and SIT/UAT rigor. Zero pricing commitments until formal rate card execution.",
    discoveryDocNames: [
      "Acme_Discovery_Meeting_Transcription_Aug26.docx",
      "Acme_Client_Requirement_Clarifications.docx",
      "Acme_Omnichannel_SRS_v2.4.pdf",
      "Acme_IT_Infrastructure_Assessment.pdf",
      "Acme_Digital_Transformation_Scope_Baseline.docx"
    ],
    uploadedDocuments: [
      {
        id: "DOC-ACME-001",
        fileName: "Acme_Discovery_Meeting_Transcription_Aug26.docx",
        fileType: "docx",
        fileSizeBytes: 245760,
        uploadedAt: "2026-08-27T14:35:00Z",
        uploadedBy: "Nikhil (PM)",
        category: "Meeting Transcription",
        sectionReference: "Section 2.1 • Min 14:20",
        pageOrTimestamp: "Timestamp 14:20 - 45:10",
        snippet: "Client VP Engineering: 'We need full microservices transformation with SIT/UAT, data migration, and mandatory 30-day go-live hypercare support. Hardware procurement will remain strictly with our internal IT team.'",
        keyRequirementsExtracted: [
          "Microservices architecture migration",
          "SIT and UAT test suite sign-off",
          "30-day post go-live operational support",
          "Hardware procurement excluded from vendor scope"
        ],
        url: "https://contoso.sharepoint.com/sites/quill/Intake/Acme_Discovery_Meeting_Transcription.docx"
      },
      {
        id: "DOC-ACME-002",
        fileName: "Acme_Client_Requirement_Clarifications.docx",
        fileType: "docx",
        fileSizeBytes: 184320,
        uploadedAt: "2026-08-27T14:36:00Z",
        uploadedBy: "Nikhil (PM)",
        category: "Requirement Clarification",
        sectionReference: "Section 2.2 • Item 4",
        pageOrTimestamp: "Page 2 of 4",
        snippet: "Email confirmation with CTO: 'Confirmed that data cleansing of legacy archival databases prior to 2020 is out of scope. Third-party software licenses will be procured directly by Acme Corp.'",
        keyRequirementsExtracted: [
          "Data cleansing restricted to active 2020-present datasets",
          "Third-party software licensing excluded from SOW",
          "Access credentials provided within 5 business days"
        ],
        url: "https://contoso.sharepoint.com/sites/quill/Intake/Acme_Requirement_Clarifications.docx"
      },
      {
        id: "DOC-ACME-003",
        fileName: "Acme_Omnichannel_SRS_v2.4.pdf",
        fileType: "pdf",
        fileSizeBytes: 1258291,
        uploadedAt: "2026-08-27T14:37:00Z",
        uploadedBy: "Nikhil (PM)",
        category: "SRS Document",
        sectionReference: "Section 1 & 2 • Page 12",
        pageOrTimestamp: "Page 12-18",
        snippet: "Software Requirements Specification (SRS): High-availability web and mobile portal. System must guarantee Disaster Recovery RTO < 1 hour and RPO < 15 minutes with zero data loss on financial transactions.",
        keyRequirementsExtracted: [
          "RTO < 1 hour and RPO < 15 minutes",
          "High-concurrency e-commerce checkout API",
          "ISO 27001 and PCI-DSS Level 1 compliance"
        ],
        url: "https://contoso.sharepoint.com/sites/quill/Intake/Acme_Omnichannel_SRS_v2.4.pdf"
      },
      {
        id: "DOC-ACME-004",
        fileName: "Acme_IT_Infrastructure_Assessment.pdf",
        fileType: "pdf",
        fileSizeBytes: 860160,
        uploadedAt: "2026-08-27T14:38:00Z",
        uploadedBy: "Nikhil (PM)",
        category: "Architecture & Scope PDF",
        sectionReference: "Section 4 • Page 6",
        pageOrTimestamp: "Page 6 of 22",
        snippet: "Technical audit of on-premise VMware infrastructure: 48 virtual nodes, dual SQL Server 2019 clusters, and legacy AS400 middleware bridges.",
        keyRequirementsExtracted: [
          "Migration of 48 VM workloads",
          "Database modernization to Azure SQL Managed Instance",
          "Integration with enterprise identity via Entra ID"
        ],
        url: "https://contoso.sharepoint.com/sites/quill/Intake/Acme_IT_Infrastructure_Assessment.pdf"
      },
      {
        id: "DOC-ACME-005",
        fileName: "Acme_Digital_Transformation_Scope_Baseline.docx",
        fileType: "docx",
        fileSizeBytes: 317440,
        uploadedAt: "2026-08-27T14:39:00Z",
        uploadedBy: "Nikhil (PM)",
        category: "Client Brief Word Doc",
        sectionReference: "Section 2 & 3 • Page 3",
        pageOrTimestamp: "Page 3 of 8",
        snippet: "Deliverables baseline agreed during pre-sales: DEL-01 Architecture Blueprint, DEL-02 Microservices Codebase, DEL-03 Migration Verification, DEL-04 Operational Runbook.",
        keyRequirementsExtracted: [
          "Contractual deliverable references DEL-01 to DEL-04",
          "Agile two-week sprint cadences",
          "Formal acceptance testing sign-off protocol"
        ],
        url: "https://contoso.sharepoint.com/sites/quill/Intake/Acme_Scope_Baseline.docx"
      }
    ],
    additionalRequirements: "Adhere to ISO 27001 data isolation and DTMC corporate standards. Keep all commercial terms in blank schedule placeholders.",
    selectedTemplateId: "DTMC_Master_SOW_Template_2025.dotx",
    frameworkApproved: true,
    sections: [
      {
        id: "SEC-ACME-001",
        projectId: "PRJ-2026-ACME",
        order: 1,
        title: "1. Engagement Overview",
        category: "Scope",
        content: `GreenPath Community Network is replacing spreadsheet-driven volunteer operations with a scalable Microsoft Power Platform solution. The work includes discovery, solution design, configuration, migration support, integration, testing, training and launch stabilization.`,
        status: "Approved",
        isMandatory: true,
        isPricingSection: false,
        groundedSources: [SAMPLE_SOURCE_DOCUMENTS[0]],
        detailedSources: [
          { id: "DS-1", fileName: "Acme_Omnichannel_SRS_v2.4.pdf", fileType: "pdf", category: "SRS Document", section: "Section 1", page: 12, snippet: "Engagement overview and core transformation objectives." }
        ],
        uploadedDocumentIds: ["DOC-ACME-003", "DOC-ACME-005"],
        comments: [
          { id: "CMT-1", author: "Arjun Rao", authorInitials: "AR", authorAvatarBg: "bg-slate-700", timestamp: "Aug 27, 2025 04:15 PM", text: "Engagement overview aligns with steering committee roadmap." }
        ],
        version: 2,
        lastEditedBy: "Nikhil",
        lastEditedAt: "2026-08-28T10:30:00Z",
        approvedBy: "Arjun Rao",
        approvedAt: "2026-08-28T10:45:00Z",
        confidenceScore: 98,
        validationNotes: ["Grounded in Master Template 2025"]
      },
      {
        id: "SEC-ACME-002",
        projectId: "PRJ-2026-ACME",
        order: 2,
        title: "2. Goals and Objectives",
        category: "Scope",
        content: `* Centralize volunteer profiles, certifications, schedules and participation history.
* Automate onboarding, reminders, approvals and operational notifications.
* Migrate approved legacy volunteer data into Dataverse.
* Provide role-based training and a supportable operating model.`,
        status: "Approved",
        isMandatory: true,
        isPricingSection: false,
        groundedSources: [SAMPLE_SOURCE_DOCUMENTS[0], SAMPLE_SOURCE_DOCUMENTS[1], SAMPLE_SOURCE_DOCUMENTS[2]],
        detailedSources: [
          { id: "DS-21", fileName: "Acme_Discovery_Meeting_Transcription_Aug26.docx", fileType: "docx", category: "Meeting Transcription", section: "Section 2", page: 4, snippet: "Target goals and operational modernization requirements." }
        ],
        uploadedDocumentIds: ["DOC-ACME-001", "DOC-ACME-002", "DOC-ACME-003"],
        comments: [
          { id: "CMT-201", author: "Arjun Rao", authorInitials: "AR", authorAvatarBg: "bg-[#71717A]", timestamp: "Aug 28, 11:32 AM", text: "Objectives verified and approved." }
        ],
        version: 3.2,
        lastEditedBy: "Nikhil",
        lastEditedAt: "2026-08-28T11:30:00Z",
        approvedBy: "Arjun Rao",
        approvedAt: "2026-08-28T11:32:00Z",
        confidenceScore: 96
      },
      {
        id: "SEC-ACME-003",
        projectId: "PRJ-2026-ACME",
        order: 3,
        title: "3. Scope and Delivery Approach",
        category: "Deliverables",
        content: `* Engage: Kickoff, current-state workshops and prioritized requirements. Primary Deliverables: Requirements and process flows; draft plan; RAID log.
* Envision: Data model, solution design, integration and test planning. Primary Deliverables: Solution design; wireframes; data map; test plan.
* Enact: Configure Power Apps, Dataverse and Power Automate; migrate test data; support UAT. Primary Deliverables: Configured solution; validated migration; UAT completion.
* Empower: Admin training, train-the-trainer, launch and stabilization. Primary Deliverables: Training materials; launch checklist; closeout report.`,
        status: "Approved",
        isMandatory: true,
        isPricingSection: false,
        groundedSources: [SAMPLE_SOURCE_DOCUMENTS[1]],
        detailedSources: [
          { id: "DS-31", fileName: "Acme_Digital_Transformation_Scope_Baseline.docx", fileType: "docx", category: "Client Brief Word Doc", section: "Section 3", page: 4, snippet: "Phase delivery approach Engage, Envision, Enact, Empower." }
        ],
        uploadedDocumentIds: ["DOC-ACME-005"],
        version: 2,
        lastEditedBy: "Nikhil",
        lastEditedAt: "2026-08-28T09:10:00Z",
        approvedBy: "Arjun Rao",
        approvedAt: "2026-08-28T09:15:00Z",
        confidenceScore: 94
      },
      {
        id: "SEC-ACME-004",
        projectId: "PRJ-2026-ACME",
        order: 4,
        title: "4. Governance and Responsibilities",
        category: "Governance",
        content: `* DTMC Engagement Lead: Overall delivery quality, scope governance and executive escalation.
* DTMC Project Manager: Plan, RAID log, status reporting, decisions and deliverable tracking.
* Client Product Owner: Priorities, stakeholder access, timely decisions and acceptance.
* Client Technical Lead: Environment access, technical validation, data readiness and deployment coordination.`,
        status: "Approved",
        isMandatory: true,
        isPricingSection: false,
        groundedSources: [SAMPLE_SOURCE_DOCUMENTS[1]],
        detailedSources: [
          { id: "DS-41", fileName: "Acme_Discovery_Meeting_Transcription_Aug26.docx", fileType: "docx", category: "Meeting Transcription", section: "Section 4", page: 8, snippet: "Governance roles and responsibilities." }
        ],
        uploadedDocumentIds: ["DOC-ACME-001"],
        version: 1,
        lastEditedBy: "Nikhil",
        lastEditedAt: "2026-08-28T08:00:00Z",
        approvedBy: "Arjun Rao",
        approvedAt: "2026-08-28T08:30:00Z",
        confidenceScore: 95
      },
      {
        id: "SEC-ACME-005",
        projectId: "PRJ-2026-ACME",
        order: 5,
        title: "5. Schedule and Acceptance",
        category: "Timeline",
        content: `The detailed schedule will be baselined at kickoff. Deliverables are accepted when the client provides written approval or no material exception within five business days. Dates in this sample are intentionally illustrative.`,
        status: "Approved",
        isMandatory: true,
        isPricingSection: false,
        groundedSources: [SAMPLE_SOURCE_DOCUMENTS[0]],
        detailedSources: [
          { id: "DS-51", fileName: "Acme_Discovery_Meeting_Transcription_Aug26.docx", fileType: "docx", category: "Meeting Transcription", section: "Section 5", page: 11, snippet: "Schedule and acceptance criteria baseline." }
        ],
        uploadedDocumentIds: ["DOC-ACME-001"],
        version: 1,
        lastEditedBy: "Nikhil",
        lastEditedAt: "2026-08-27T16:00:00Z",
        approvedBy: "Arjun Rao",
        approvedAt: "2026-08-27T16:30:00Z",
        confidenceScore: 91
      },
      {
        id: "SEC-ACME-006",
        projectId: "PRJ-2026-ACME",
        order: 6,
        title: "6. Assumptions",
        category: "Assumptions",
        content: `* Client owns source-data cleansing and approval.
* Client procures required Microsoft licenses.
* One legacy system and one public-site integration are included.`,
        status: "Approved",
        isMandatory: true,
        isPricingSection: false,
        groundedSources: [SAMPLE_SOURCE_DOCUMENTS[2]],
        detailedSources: [
          { id: "DS-61", fileName: "Acme_Client_Requirement_Clarifications.docx", fileType: "docx", category: "Requirement Clarification", section: "Section 6", page: 3, snippet: "Client access credentials and sandbox readiness SLA." }
        ],
        uploadedDocumentIds: ["DOC-ACME-002"],
        version: 1,
        lastEditedBy: "Nikhil",
        lastEditedAt: "2026-08-27T17:00:00Z",
        approvedBy: "Arjun Rao",
        approvedAt: "2026-08-27T17:15:00Z",
        confidenceScore: 96
      },
      {
        id: "SEC-ACME-007",
        projectId: "PRJ-2026-ACME",
        order: 7,
        title: "7. Out of Scope",
        category: "Scope",
        content: `* Unlisted third-party integrations.
* Historical data remediation outside agreed templates.
* Support beyond the defined stabilization period.`,
        status: "Approved",
        isMandatory: true,
        isPricingSection: false,
        groundedSources: [SAMPLE_SOURCE_DOCUMENTS[4]],
        detailedSources: [
          { id: "DS-71", fileName: "Acme_Digital_Transformation_Scope_Baseline.docx", fileType: "docx", category: "Client Brief Word Doc", section: "Section 7", page: 7, snippet: "Explicit exclusions and out-of-scope boundaries." }
        ],
        uploadedDocumentIds: ["DOC-ACME-005"],
        version: 1,
        lastEditedBy: "System",
        lastEditedAt: "2026-08-28T09:00:00Z",
        confidenceScore: 100
      },
      {
        id: "SEC-ACME-008",
        projectId: "PRJ-2026-ACME",
        order: 8,
        title: "8. Illustrative Fees",
        category: "Pricing",
        content: `* Commercial Model: Time and materials
* Illustrative Amount: [ — ]
* Billing: Initial deposit plus monthly actuals

*All fee amounts remain intentionally blank pending Commercial Finance sign-off prior to contracting.*`,
        status: "Approved",
        isMandatory: true,
        isPricingSection: true,
        approvedBy: "Commercial Finance",
        approvedAt: "2026-08-28T09:00:00Z",
        groundedSources: [SAMPLE_SOURCE_DOCUMENTS[3]],
        detailedSources: [
          { id: "DS-81", fileName: "Acme_Discovery_Meeting_Transcription_Aug26.docx", fileType: "docx", category: "Meeting Transcription", section: "Section 8", page: 15, snippet: "Illustrative commercial model and placeholder fees." }
        ],
        uploadedDocumentIds: ["DOC-ACME-001"],
        version: 1,
        lastEditedBy: "System",
        lastEditedAt: "2026-08-28T09:00:00Z",
        confidenceScore: 100,
        validationNotes: ["Guardrail verified: illustrative placeholder fee structure"]
      },
      {
        id: "SEC-ACME-009",
        projectId: "PRJ-2026-ACME",
        order: 9,
        title: "9. Authorization",
        category: "Terms",
        content: `Accepted by Client:
* Name: Riley Chen
* Title: VP, Transformation
* Signature: ___________________________
* Date: ________________________________

Accepted by DTMC:
* Name: Arjun Rao
* Title: Engagement Partner
* Signature: ___________________________
* Date: ________________________________`,
        status: "Approved",
        isMandatory: true,
        isPricingSection: false,
        groundedSources: [SAMPLE_SOURCE_DOCUMENTS[0]],
        detailedSources: [
          { id: "DS-91", fileName: "Acme_Client_Requirement_Clarifications.docx", fileType: "docx", category: "Requirement Clarification", section: "Section 9", page: 4, snippet: "Authorization and signature table." }
        ],
        uploadedDocumentIds: ["DOC-ACME-002"],
        version: 1,
        lastEditedBy: "Legal Counsel",
        lastEditedAt: "2026-08-26T10:00:00Z",
        approvedBy: "Legal Counsel",
        approvedAt: "2026-08-26T10:30:00Z",
        confidenceScore: 100
      }
    ],
    exportHistory: []
  },
  {
    id: "PRJ-2026-001",
    title: "Contoso Cloud Migration & Modernization SOW",
    clientName: "Contoso Financial Services Ltd.",
    clientContact: "Sarah Jenkins (Head of Infrastructure)",
    clientContactEmail: "s.jenkins@contoso.co.uk",
    clientIndustry: "Financial Services",
    projectType: "Cloud Migration",
    targetStartDate: "2026-10-01",
    targetEndDate: "2027-03-31",
    currency: "USD",
    estimatedBudgetPlaceholder: "[To be determined upon finalized staffing schedule]",
    status: "Under Review",
    currentStep: 4,
    createdAt: "2026-08-27T14:30:00Z",
    updatedAt: "2026-08-28T09:15:00Z",
    ownerName: "David Miller",
    ownerEmail: "david.miller@contoso.com",
    description: "Enterprise lift-and-shift and containerized modernization of 35 core banking workloads into Microsoft Azure.",
    meetingNotes: "Discovery session on 2026-08-20: Client operates 35 on-premise VMware VMs and SQL Server 2019 databases.",
    discoveryDocNames: [
      "Contoso_Architecture_Discovery_Transcript.docx",
      "Contoso_Banking_SRS_Specification.pdf",
      "Contoso_Security_Requirements_Clarification.docx"
    ],
    uploadedDocuments: [
      {
        id: "DOC-CON-001",
        fileName: "Contoso_Architecture_Discovery_Transcript.docx",
        fileType: "docx",
        fileSizeBytes: 215040,
        uploadedAt: "2026-08-27T14:30:00Z",
        uploadedBy: "David Miller (PM)",
        category: "Meeting Transcription",
        sectionReference: "Section 1 • Min 08:30",
        pageOrTimestamp: "Timestamp 08:30",
        snippet: "PM David Miller discovery call: 35 on-premise VMware VMs and SQL Server databases to be migrated into Azure East US with ExpressRoute.",
        keyRequirementsExtracted: [
          "Azure East US regional deployment",
          "Dual ExpressRoute redundancy",
          "FINRA compliant data archiving"
        ],
        url: "https://contoso.sharepoint.com/sites/quill/Intake/Contoso_Discovery_Transcript.docx"
      },
      {
        id: "DOC-CON-002",
        fileName: "Contoso_Banking_SRS_Specification.pdf",
        fileType: "pdf",
        fileSizeBytes: 1450000,
        uploadedAt: "2026-08-27T14:32:00Z",
        uploadedBy: "David Miller (PM)",
        category: "SRS Document",
        sectionReference: "Section 2 • Page 8",
        pageOrTimestamp: "Page 8 of 34",
        snippet: "Core banking platform requirements: RTO < 30 minutes, AES-256 data at rest, and Entra ID PIM integration.",
        keyRequirementsExtracted: [
          "RTO < 30 minutes",
          "AES-256 data at rest encryption",
          "Entra ID Privileged Identity Management"
        ],
        url: "https://contoso.sharepoint.com/sites/quill/Intake/Contoso_Banking_SRS.pdf"
      },
      {
        id: "DOC-CON-003",
        fileName: "Contoso_Security_Requirements_Clarification.docx",
        fileType: "docx",
        fileSizeBytes: 195000,
        uploadedAt: "2026-08-27T14:33:00Z",
        uploadedBy: "David Miller (PM)",
        category: "Requirement Clarification",
        sectionReference: "Section 2.2 • Page 1",
        pageOrTimestamp: "Page 1 of 2",
        snippet: "Clarification note: Hardware procurement and on-premise rack decommission are excluded from scope.",
        keyRequirementsExtracted: [
          "Hardware decommission excluded",
          "Zero commercial rate figures in technical SOW draft"
        ],
        url: "https://contoso.sharepoint.com/sites/quill/Intake/Contoso_Security_Clarification.docx"
      }
    ],
    additionalRequirements: "Must integrate with Azure ExpressRoute and enforce Entra ID PIM.",
    selectedTemplateId: "DTMC_Master_SOW_Template_2025.dotx",
    frameworkApproved: true,
    sections: [
      {
        id: "SEC-001",
        projectId: "PRJ-2026-001",
        order: 1,
        title: "1. Engagement Overview",
        category: "Scope",
        content: `This SOW defines migration into Azure for Contoso.`,
        status: "Approved",
        isMandatory: true,
        isPricingSection: false,
        groundedSources: [SAMPLE_SOURCE_DOCUMENTS[0]],
        detailedSources: [
          { id: "DS-CON-1", fileName: "Contoso_Architecture_Discovery_Transcript.docx", fileType: "docx", category: "Meeting Transcription", section: "Section 1", page: 1, snippet: "Core banking Azure migration objectives." }
        ],
        uploadedDocumentIds: ["DOC-CON-001", "DOC-CON-002"],
        version: 2,
        lastEditedBy: "David Miller",
        lastEditedAt: "2026-08-28T08:45:00Z",
        confidenceScore: 97
      }
    ],
    exportHistory: []
  }
];
