import { SourceDocument, SharePointListSchema, AuditLogEntry } from '../types/quill';

export const SAMPLE_SOURCE_DOCUMENTS: SourceDocument[] = [
  {
    id: "SRC-CL-001",
    title: "Master_Cloud_Governance_Clauses_v4.2.docx",
    library: "Approved Clauses",
    url: "https://contoso.sharepoint.com/sites/quill/Approved_Clauses/Master_Cloud_Governance_Clauses_v4.2.docx",
    relevanceScore: 0.96,
    author: "Enterprise Legal Counsel",
    modifiedDate: "2025-11-14",
    securityClearance: "Internal",
    snippet: "Client agrees to maintain cloud subscription ownership and root tenant administration. Consultant will be provisioned delegated RBAC contributor access limited strictly to agreed landing zone resource groups.",
    matchedClauses: [
      "Clause 4.1: Cloud Infrastructure Ownership & Tenant Boundaries",
      "Clause 4.3: Identity & Access Management (PIM/PAM Mandate)",
      "Clause 9.2: Data Residency and Sovereign Compliance"
    ]
  },
  {
    id: "SRC-SOW-089",
    title: "SOW-2025-Northwind-Azure-Enterprise-Migration.docx",
    library: "Reference SOWs",
    url: "https://contoso.sharepoint.com/sites/quill/Reference_SOWs/SOW-2025-Northwind-Azure-Enterprise-Migration.docx",
    relevanceScore: 0.92,
    author: "Elena Rostova (Lead Cloud Architect)",
    modifiedDate: "2025-09-28",
    securityClearance: "Confidential",
    snippet: "The engagement encompasses discovery, landing zone automated provisioning via Terraform, lift-and-shift migration of 45 Tier-2 workloads, and post-cutover hypercare support for 14 calendar days.",
    matchedClauses: [
      "Section 2.1: In-Scope Workload Inventory & Waves",
      "Section 3.4: Acceptance Criteria for Automated Landing Zones",
      "Section 5.2: Shared Responsibility Matrix & Exclusions"
    ]
  },
  {
    id: "SRC-CL-014",
    title: "Standard_Assumptions_and_Exclusions_Matrix_2025.docx",
    library: "Approved Clauses",
    url: "https://contoso.sharepoint.com/sites/quill/Approved_Clauses/Standard_Assumptions_and_Exclusions_Matrix_2025.docx",
    relevanceScore: 0.89,
    author: "Delivery Operations & Risk Office",
    modifiedDate: "2025-12-02",
    securityClearance: "Internal",
    snippet: "All work will be conducted remotely during standard business hours (8:00 AM - 5:00 PM EST). Client is responsible for procuring third-party software licenses, SSL certificates, and network interconnect bandwidth.",
    matchedClauses: [
      "Assumption A-1: Remote Delivery Model and Connectivity",
      "Assumption A-4: Third-Party Licensing & Pre-requisites",
      "Exclusion E-2: Performance Optimization of Legacy Codebases"
    ]
  },
  {
    id: "SRC-SOW-104",
    title: "SOW-2025-Fabrikam-ZeroTrust-Security-Architecture.docx",
    library: "Reference SOWs",
    url: "https://contoso.sharepoint.com/sites/quill/Reference_SOWs/SOW-2025-Fabrikam-ZeroTrust-Security-Architecture.docx",
    relevanceScore: 0.85,
    author: "Marcus Vance (Principal Security Partner)",
    modifiedDate: "2025-10-15",
    securityClearance: "Internal",
    snippet: "Deliverables include Entra ID Conditional Access baseline policies, Defender for Cloud deployment across 12 subscriptions, and executive security handover documentation.",
    matchedClauses: [
      "Deliverable D-1: Enterprise Security Architecture Document (ESAD)",
      "Deliverable D-3: Automated Policy-as-Code Deployment Scripts",
      "Section 6: Change Order Governance Mechanism"
    ]
  },
  {
    id: "SRC-CL-033",
    title: "DTMC_Commercial_Terms_Blank_Placeholder_Template.docx",
    library: "Templates",
    url: "https://contoso.sharepoint.com/sites/quill/Templates/DTMC_Commercial_Terms_Blank_Placeholder_Template.docx",
    relevanceScore: 0.99,
    author: "Commercial Operations",
    modifiedDate: "2026-01-10",
    securityClearance: "Internal",
    snippet: "Services will be rendered on a Time & Materials (T&M) or Milestone basis as set forth in the finalized Schedule B. [TBD: Insert Approved Resource Rate Card / Pricing Schedule]. All travel expenses require prior written approval.",
    matchedClauses: [
      "Schedule B: Blank Pricing & Fee Schedule Template",
      "Clause 8.1: Invoicing Schedule & Payment Terms Placeholder",
      "Clause 8.4: Out-of-Pocket Expense Policy"
    ]
  }
];

export const SHAREPOINT_LIST_SCHEMAS: SharePointListSchema[] = [
  {
    listName: "SOW_Projects",
    description: "Core table tracking top-level project metadata, client parameters, and global lifecycle status.",
    fields: [
      { name: "Title", type: "Single line of text", required: true, description: "Unique Project Code (e.g., PRJ-2026-001)" },
      { name: "ClientName", type: "Single line of text", required: true, description: "Official corporate name of the client" },
      { name: "ClientIndustry", type: "Choice", required: true, description: "Industry vertical", allowedValues: ["Financial Services", "Healthcare", "Retail & CPG", "Manufacturing", "Technology"] },
      { name: "ProjectType", type: "Choice", required: true, description: "Core engagement category", allowedValues: ["Cloud Migration", "Modern App Dev", "Zero-Trust Security", "Data & AI Modernization"] },
      { name: "TargetStartDate", type: "DateTime", required: true, description: "Target engagement kickoff date" },
      { name: "TargetEndDate", type: "DateTime", required: true, description: "Target completion date" },
      { name: "Status", type: "Choice", required: true, description: "Current SOW state", allowedValues: ["Draft", "Generated", "Under Review", "Approved", "Exported"] },
      { name: "FrameworkApproved", type: "Boolean", required: true, description: "Flag indicating human sign-off on framework" },
      { name: "OwnerEmail", type: "Single line of text", required: true, description: "Entra ID UPN of author" },
      { name: "DiscoveryNotes", type: "Multiple lines of text", required: false, description: "Discovery transcript, intake parameters, and meeting notes" },
      { name: "SelectedTemplateId", type: "Single line of text", required: true, description: "Target DTMC Word template ID" }
    ]
  },
  {
    listName: "SOW_Sections",
    description: "Child entity tracking each individual section, its generated content, citations, and approval status.",
    fields: [
      { name: "Title", type: "Single line of text", required: true, description: "Section headline" },
      { name: "ProjectId", type: "Lookup", required: true, description: "Foreign key lookup to SOW_Projects" },
      { name: "SectionOrder", type: "Number", required: true, description: "Ordering sequence in the final Word doc" },
      { name: "Category", type: "Choice", required: true, description: "Section classification", allowedValues: ["Scope", "Deliverables", "Assumptions", "Governance", "Acceptance", "Pricing", "Timeline", "Staffing"] },
      { name: "Content", type: "Multiple lines of text", required: false, description: "Drafted markdown or HTML section prose" },
      { name: "Status", type: "Choice", required: true, description: "Micro-state", allowedValues: ["Pending", "Generating", "Review", "Approved", "Rejected"] },
      { name: "IsPricingSection", type: "Boolean", required: true, description: "Flag enforcing blank pricing guardrails" },
      { name: "ConfidenceScore", type: "Number", required: false, description: "RAG grounding confidence score (0-100)" },
      { name: "Version", type: "Number", required: true, description: "Incremental revision count" },
      { name: "GroundedSourcesJson", type: "Multiple lines of text", required: false, description: "Serialized JSON array of source citations" }
    ]
  },
  {
    listName: "SOW_Approvals",
    description: "Immutable approval sign-off records for regulatory compliance and audit readiness.",
    fields: [
      { name: "Title", type: "Single line of text", required: true, description: "Approval Transaction ID (e.g. APV-8829)" },
      { name: "ProjectId", type: "Lookup", required: true, description: "Target Project" },
      { name: "SectionId", type: "Lookup", required: true, description: "Target Section" },
      { name: "ApprovedBy", type: "Person or Group", required: true, description: "Entra ID user principal who signed off" },
      { name: "ApprovalTimestamp", type: "DateTime", required: true, description: "Exact UTC timestamp of approval" },
      { name: "ReviewNotes", type: "Multiple lines of text", required: false, description: "Optional reviewer commentary" }
    ]
  },
  {
    listName: "SOW_AuditLogs",
    description: "System-wide immutable audit trail capturing every AI execution, search query, edit, and export.",
    fields: [
      { name: "Title", type: "Single line of text", required: true, description: "LOG-UUID" },
      { name: "Timestamp", type: "DateTime", required: true, description: "System timestamp" },
      { name: "ProjectId", type: "Single line of text", required: true, description: "Project identifier" },
      { name: "UserEmail", type: "Single line of text", required: true, description: "User email" },
      { name: "Action", type: "Choice", required: true, description: "Event type", allowedValues: ["PROJECT_CREATED", "GRAPH_SEARCH_TRIGGERED", "FRAMEWORK_GENERATED", "FRAMEWORK_APPROVED", "SECTION_GENERATED", "SECTION_REGENERATED", "SECTION_APPROVED", "SECTION_EDITED", "DOCUMENT_EXPORTED"] },
      { name: "Details", type: "Multiple lines of text", required: false, description: "Event context and latency payload" },
      { name: "ExecutionStatus", type: "Choice", required: true, description: "Result", allowedValues: ["SUCCESS", "WARNING", "FAILED"] }
    ]
  }
];

export const SAMPLE_AUDIT_LOGS: AuditLogEntry[] = [
  {
    id: "LOG-9001",
    timestamp: "2026-08-28T09:14:22Z",
    projectId: "PRJ-2026-001",
    projectTitle: "Contoso Enterprise Azure Modernization",
    user: "David Miller",
    userEmail: "david.miller@contoso.com",
    action: "PROJECT_CREATED",
    details: "Initiated new SOW project with Financial Services vertical context and 5 discovery notes.",
    status: "SUCCESS",
    executionTimeMs: 140
  },
  {
    id: "LOG-9002",
    timestamp: "2026-08-28T09:14:35Z",
    projectId: "PRJ-2026-001",
    projectTitle: "Contoso Enterprise Azure Modernization",
    user: "System (n8n)",
    userEmail: "n8n-service-principal@contoso.com",
    action: "GRAPH_SEARCH_TRIGGERED",
    details: "Queried Microsoft Search for KQL: 'path:\"ReferenceSOWs\" AND \"Azure Migration\"' - Retrieved 4 driveItems.",
    status: "SUCCESS",
    executionTimeMs: 620
  },
  {
    id: "LOG-9003",
    timestamp: "2026-08-28T09:15:02Z",
    projectId: "PRJ-2026-001",
    projectTitle: "Contoso Enterprise Azure Modernization",
    user: "System (Azure OpenAI)",
    userEmail: "azure-openai@contoso.com",
    action: "FRAMEWORK_GENERATED",
    details: "Azure OpenAI GPT-4o synthesized 7 structured SOW sections with zero monetary commitments.",
    status: "SUCCESS",
    executionTimeMs: 1850
  },
  {
    id: "LOG-9004",
    timestamp: "2026-08-28T09:16:10Z",
    projectId: "PRJ-2026-001",
    projectTitle: "Contoso Enterprise Azure Modernization",
    user: "David Miller",
    userEmail: "david.miller@contoso.com",
    action: "FRAMEWORK_APPROVED",
    details: "Author approved framework outline with 7 ordered sections.",
    status: "SUCCESS",
    executionTimeMs: 95
  }
];
