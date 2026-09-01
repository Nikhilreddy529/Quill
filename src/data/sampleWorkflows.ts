import { N8nWorkflowDefinition } from '../types/quill';

export const N8N_WORKFLOWS: N8nWorkflowDefinition[] = [
  {
    id: "wf-generate-framework",
    name: "Workflow 1: Generate SOW Framework",
    description: "Accepts client intake parameters, executes Graph Search against SharePoint reference SOWs, and generates an approved SOW framework outline using Azure OpenAI.",
    endpoint: "POST /api/v1/sow/framework",
    triggerEvent: "User initiates SOW generation from React intake wizard",
    nodes: [
      {
        id: "node-1-1",
        name: "Webhook Intake Listener",
        type: "n8n-nodes-base.webhook",
        category: "Trigger",
        status: "success",
        executionTime: "12ms",
        inputs: { clientName: "Contoso Ltd", industry: "Financial Services", scope: "Cloud Migration" },
        outputs: { validated: true, projectId: "PRJ-2026-001" }
      },
      {
        id: "node-1-2",
        name: "Microsoft Graph Search Query",
        type: "n8n-nodes-base.httpRequest",
        category: "HTTP/Graph",
        status: "success",
        executionTime: "450ms",
        inputs: { endpoint: "https://graph.microsoft.com/v1.0/search/query", query: "path:ReferenceSOWs AND 'Cloud Migration'" },
        outputs: { hitCount: 4, topItems: ["SRC-SOW-089", "SRC-CL-001"] }
      },
      {
        id: "node-1-3",
        name: "Context Synthesizer & Token Packer",
        type: "n8n-nodes-base.code",
        category: "Transform",
        status: "success",
        executionTime: "15ms",
        inputs: { maxTokens: 3500 },
        outputs: { promptContext: "<source_chunks>...</source_chunks>" }
      },
      {
        id: "node-1-4",
        name: "Azure OpenAI (GPT-4o) Framework Gen",
        type: "n8n-nodes-base.azureOpenAi",
        category: "Azure OpenAI",
        status: "success",
        executionTime: "1420ms",
        inputs: { model: "gpt-4o", temperature: 0.2, response_format: { type: "json_object" } },
        outputs: { sectionsCount: 6, status: "Generated" }
      },
      {
        id: "node-1-5",
        name: "SharePoint List: Write SOW_Sections",
        type: "n8n-nodes-base.sharepoint",
        category: "SharePoint List",
        status: "success",
        executionTime: "310ms",
        inputs: { targetList: "SOW_Sections", batchSize: 6 },
        outputs: { recordsCreated: 6 }
      },
      {
        id: "node-1-6",
        name: "Audit Logger: Write SOW_AuditLogs",
        type: "n8n-nodes-base.sharepoint",
        category: "SharePoint List",
        status: "success",
        executionTime: "95ms",
        inputs: { action: "FRAMEWORK_GENERATED", status: "SUCCESS" },
        outputs: { logId: "LOG-9003" }
      }
    ],
    samplePayload: {
      projectId: "PRJ-2026-001",
      clientName: "Contoso Financial Services Ltd.",
      clientIndustry: "Financial Services",
      projectType: "Cloud Migration",
      discoveryNotes: "35 VMware workloads, 1 hour RTO target..."
    },
    sampleResponse: {
      projectId: "PRJ-2026-001",
      frameworkApproved: false,
      sections: [
        { order: 1, title: "1. Executive Summary & Purpose", category: "Scope", isMandatory: true },
        { order: 2, title: "2. Detailed Scope of Work", category: "Scope", isMandatory: true },
        { order: 3, title: "3. Deliverables & Acceptance Criteria", category: "Deliverables", isMandatory: true },
        { order: 4, title: "4. Project Assumptions & Exclusions", category: "Assumptions", isMandatory: true },
        { order: 5, title: "5. Project Governance", category: "Governance", isMandatory: false },
        { order: 6, title: "6. Commercial Terms & Pricing Placeholder", category: "Pricing", isMandatory: true }
      ]
    }
  },
  {
    id: "wf-generate-section",
    name: "Workflow 2: Generate Grounded Section",
    description: "Queries targeted approved SharePoint clauses and generates deep, contractual section prose with inline source citations and blank pricing guardrails.",
    endpoint: "POST /api/v1/sow/section/generate",
    triggerEvent: "User requests AI generation of an individual section",
    nodes: [
      {
        id: "node-2-1",
        name: "Webhook Section Request",
        type: "n8n-nodes-base.webhook",
        category: "Trigger",
        status: "success",
        executionTime: "8ms",
        inputs: { projectId: "PRJ-2026-001", sectionId: "SEC-003" }
      },
      {
        id: "node-2-2",
        name: "SharePoint Get Section & Project Metadata",
        type: "n8n-nodes-base.sharepoint",
        category: "SharePoint List",
        status: "success",
        executionTime: "110ms"
      },
      {
        id: "node-2-3",
        name: "Microsoft Graph Clause Matcher",
        type: "n8n-nodes-base.httpRequest",
        category: "HTTP/Graph",
        status: "success",
        executionTime: "380ms",
        inputs: { library: "Approved_Clauses", category: "Deliverables" }
      },
      {
        id: "node-2-4",
        name: "Azure OpenAI Section Drafter",
        type: "n8n-nodes-base.azureOpenAi",
        category: "Azure OpenAI",
        status: "success",
        executionTime: "1680ms"
      },
      {
        id: "node-2-5",
        name: "Blank Pricing Regex Guardrail Filter",
        type: "n8n-nodes-base.code",
        category: "Transform",
        status: "success",
        executionTime: "5ms",
        inputs: { regex: "/\\$[0-9,]+(\\.[0-9]{2})?/" },
        outputs: { passed: true, violationsDetected: 0 }
      },
      {
        id: "node-2-6",
        name: "SharePoint Update SOW_Sections",
        type: "n8n-nodes-base.sharepoint",
        category: "SharePoint List",
        status: "success",
        executionTime: "120ms"
      }
    ],
    samplePayload: {
      projectId: "PRJ-2026-001",
      sectionId: "SEC-003",
      category: "Deliverables"
    },
    sampleResponse: {
      sectionId: "SEC-003",
      title: "3. Deliverables & Acceptance Criteria",
      content: "### 3. Deliverables & Acceptance Criteria\n\n| Deliverable ID | Deliverable Name | Description | Acceptance Criteria |...",
      confidenceScore: 92,
      groundedSources: ["SRC-SOW-089"],
      pricingVerifiedBlank: true
    }
  },
  {
    id: "wf-export-document",
    name: "Workflow 3: Assemble & Export DTMC Word Document",
    description: "Verifies 100% human approval of mandatory sections, runs the Python docxtpl service to render the DTMC Word template, and uploads the final .docx to SharePoint.",
    endpoint: "POST /api/v1/sow/export",
    triggerEvent: "User clicks Export Final SOW on approved project",
    nodes: [
      {
        id: "node-3-1",
        name: "Webhook Export Request",
        type: "n8n-nodes-base.webhook",
        category: "Trigger",
        status: "success",
        executionTime: "10ms"
      },
      {
        id: "node-3-2",
        name: "SharePoint Fetch All Sections",
        type: "n8n-nodes-base.sharepoint",
        category: "SharePoint List",
        status: "success",
        executionTime: "180ms"
      },
      {
        id: "node-3-3",
        name: "Approval Gate & Blank Pricing Assert",
        type: "n8n-nodes-base.code",
        category: "Transform",
        status: "success",
        executionTime: "14ms",
        outputs: { allApproved: true, pricingSafe: true }
      },
      {
        id: "node-3-4",
        name: "Python docxtpl Microservice Invocation",
        type: "n8n-nodes-base.httpRequest",
        category: "Python DOCX",
        status: "success",
        executionTime: "890ms",
        inputs: { template: "DTMC_Master_SOW_Template_2025.dotx" }
      },
      {
        id: "node-3-5",
        name: "SharePoint Upload to Generated_SOW_Exports",
        type: "n8n-nodes-base.sharepoint",
        category: "SharePoint List",
        status: "success",
        executionTime: "420ms"
      },
      {
        id: "node-3-6",
        name: "SharePoint Update Project: Status = Exported",
        type: "n8n-nodes-base.sharepoint",
        category: "SharePoint List",
        status: "success",
        executionTime: "115ms"
      }
    ],
    samplePayload: {
      projectId: "PRJ-2026-001",
      templateId: "DTMC_Master_SOW_Template_2025.dotx"
    },
    sampleResponse: {
      exportId: "EXP-8902",
      fileName: "SOW-2026-Contoso-CloudMigration-v1.0.docx",
      sharePointUrl: "https://contoso.sharepoint.com/sites/quill/Generated_SOW_Exports/SOW-2026-Contoso-CloudMigration-v1.0.docx",
      status: "Exported",
      pricingVerifiedBlank: true
    }
  },
  {
    id: "wf-save-version",
    name: "Workflow 4: Save & Audit Section Revision",
    description: "Persists manual user edits from the rich text editor to SharePoint Lists, increments section revision counter, and writes an audit log entry.",
    endpoint: "POST /api/v1/sow/version",
    triggerEvent: "User edits text or approves a section",
    nodes: [
      {
        id: "node-4-1",
        name: "Webhook Version Update",
        type: "n8n-nodes-base.webhook",
        category: "Trigger",
        status: "success",
        executionTime: "6ms"
      },
      {
        id: "node-4-2",
        name: "SharePoint Update SOW_Sections Content",
        type: "n8n-nodes-base.sharepoint",
        category: "SharePoint List",
        status: "success",
        executionTime: "135ms"
      },
      {
        id: "node-4-3",
        name: "SharePoint List Audit Logger",
        type: "n8n-nodes-base.sharepoint",
        category: "SharePoint List",
        status: "success",
        executionTime: "88ms"
      }
    ],
    samplePayload: {
      projectId: "PRJ-2026-001",
      sectionId: "SEC-001",
      content: "### 1. Executive Summary & Purpose\n\nUpdated text...",
      editorEmail: "david.miller@contoso.com"
    },
    sampleResponse: {
      sectionId: "SEC-001",
      version: 2,
      updatedAt: "2026-08-28T09:15:00Z"
    }
  },
  {
    id: "wf-regenerate-section",
    name: "Workflow 5: Regenerate Section with Targeted Feedback",
    description: "Re-queries Azure OpenAI combining the existing section draft, user critique/refinement prompt, and original SharePoint grounded chunks.",
    endpoint: "POST /api/v1/sow/section/regenerate",
    triggerEvent: "User specifies custom adjustment instructions and clicks Regenerate",
    nodes: [
      {
        id: "node-5-1",
        name: "Webhook Regenerate Request",
        type: "n8n-nodes-base.webhook",
        category: "Trigger",
        status: "success",
        executionTime: "7ms"
      },
      {
        id: "node-5-2",
        name: "SharePoint Fetch Historical Version & Context",
        type: "n8n-nodes-base.sharepoint",
        category: "SharePoint List",
        status: "success",
        executionTime: "120ms"
      },
      {
        id: "node-5-3",
        name: "Azure OpenAI Refinement Generator",
        type: "n8n-nodes-base.azureOpenAi",
        category: "Azure OpenAI",
        status: "success",
        executionTime: "1540ms",
        inputs: { critiquePrompt: "Emphasize high availability and disaster recovery RTO < 1 hour" }
      },
      {
        id: "node-5-4",
        name: "SharePoint Update SOW_Sections Draft",
        type: "n8n-nodes-base.sharepoint",
        category: "SharePoint List",
        status: "success",
        executionTime: "110ms"
      }
    ],
    samplePayload: {
      sectionId: "SEC-003",
      regenerationPrompt: "Make acceptance criteria more quantifiable for SQL databases"
    },
    sampleResponse: {
      sectionId: "SEC-003",
      content: "### 3. Deliverables & Acceptance Criteria (Refined)...\n",
      status: "Review",
      version: 2
    }
  }
];
