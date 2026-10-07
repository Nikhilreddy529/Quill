# Quill - AI-Powered SOW Authoring Platform

![Quill Logo](Quill.png)

> An enterprise-grade Statement of Work (SOW) authoring platform powered by AI, featuring framework-first generation, human-in-the-loop section review, RAG integration, proposal lifecycle management, n8n orchestration, and DOCX export capabilities.

---

## Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Project Structure](#project-structure)
- [Architecture](#architecture)
- [Data Flow](#data-flow)
- [Getting Started](#getting-started)
- [Available Scripts](#available-scripts)
- [Technology Stack](#technology-stack)
- [Project Features in Detail](#project-features-in-detail)
- [Contributing](#contributing)

---

## Overview

**Quill** is an AI-powered enterprise platform designed to streamline the creation and management of Statements of Work (SOWs), proposals, and connected delivery documentation. It combines modern web technologies with AI orchestration, governance checks, retrieval-augmented generation (RAG), and workflow automation to provide a collaborative, auditable, and high-quality authoring experience.

The platform supports Microsoft Search-based document retrieval, proposal drafting workflows, human review, n8n-based automation, and DOCX export with governance-aware processing for enterprise teams.

---

## Key Features

### 1. **Framework-First SOW Generation**
- Define SOW frameworks with hierarchical sections and requirements
- AI-powered framework validation and optimization
- Framework approval workflow before section drafting

### 2. **Human-in-the-Loop Section Review**
- Interactive section editing with real-time AI suggestions
- Concurrency conflict detection for multi-user scenarios
- Token budget management for AI generation
- Diff viewer for change tracking and review

### 3. **Retrieval-Augmented Generation (RAG)**
- Integration with Google Drive for source documents
- Context-aware section drafting using relevant project documents
- Source attribution and traceability

### 4. **Proposal Lifecycle Management**
- Proposal creation, versioning, and lifecycle tracking
- AI-assisted proposal drafting and summarization
- Approval states, revision loops, and review comments

### 5. **Template Management System**
- Reusable SOW templates for rapid project creation
- Template customization and versioning
- Template validation and preview capabilities
- Structured section reuse across projects

### 6. **Enterprise Export Capabilities**
- DOCX (Microsoft Word) export with formatting preservation
- Multi-section batch export
- Format-aware content transformation for tables, lists, and headings

### 7. **Project Management**
- Multi-project workspace
- Section-level drafting and review
- Audit logging for compliance tracking
- Project status indicators such as draft, in-review, and approved

### 8. **Governance & Compliance**
- Framework governance rules and validation
- Concurrency and audit tracking
- Change history and rollback
- Unsupported claims and policy checks

---

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js**: v18 or higher
- **npm** or **yarn**: v9 or higher
- **Git**: latest version
- **TypeScript**: 5.8+ (installed via npm)
- **n8n**: for workflow automation and orchestration

### Environment Setup

Before running the app, create a local environment file from `.env.example` and add your required API keys and workflow configuration:

```bash
cp .env.example .env.local

VITE_API_BASE_URL=http://localhost:3000
VITE_OPENAI_API_KEY=your_openai_key
VITE_GOOGLE_API_KEY=your_google_key
VITE_N8N_WEBHOOK_URL=http://localhost:5678/webhook/quill
VITE_SEARCH_API_KEY=your_search_key

---
```

## Installation

### 1. Clone the Repository
```bash
git clone --single-branch --branch development https://github.com/Nikhilreddy529/Quill.git
cd Quill
```

### 2. Install Dependencies
```bash
npm install
```

### 4. Verify Installation
```bash
npm run dev
```

---

##  Project Structure

```
Quill/
├── .env
├── .env.example
├── .env.local
├── .gitignore
├── index.html
├── metadata.json
├── package.json
├── tsconfig.json
├── vite.config.ts
├── README.md
│
├── Asset/
│   └── proposal-templates/
│
├── src/
│   ├── App.tsx
│   ├── index.css
│   ├── main.tsx
│   ├── vite-env.d.ts
│   │
│   ├── components/
│   │   ├── ArchitectureSpecViewer.tsx
│   │   ├── CreateProjectModal.tsx
│   │   ├── CreateProposalModal.tsx
│   │   ├── Dashboard.tsx
│   │   ├── ExportModal.tsx
│   │   ├── FeatherLogo.tsx
│   │   ├── FrameworkReview.tsx
│   │   ├── Navbar.tsx
│   │   ├── ProposalWorkspace.tsx
│   │   ├── SectionReview.tsx
│   │   ├── Sidebar.tsx
│   │   ├── SourcesPanel.tsx
│   │   ├── SOWAuthoringWorkspace.tsx
│   │   ├── TopHeader.tsx
│   │   │
│   │   ├── framework/
│   │   │   └── FrameworkImpactModal.tsx
│   │   │
│   │   ├── intake/
│   │   │   └── IntakeSpecificationModal.tsx
│   │   │
│   │   ├── section/
│   │   │   ├── ConcurrencyConflictModal.tsx
│   │   │   ├── DiffViewerModal.tsx
│   │   │   ├── TokenBudgetDrawer.tsx
│   │   │   └── UnsupportedClaimsBanner.tsx
│   │   │
│   │   └── templates/
│   │       ├── SOWTemplateEditor.tsx
│   │       ├── SOWTemplateList.tsx
│   │       ├── SOWTemplatePreview.tsx
│   │       └── TemplateValidationModal.tsx
│   │
│   ├── data/
│   │   ├── sampleProjects.ts
│   │   ├── sampleSharePointData.ts
│   │   ├── sampleWorkflows.ts
│   │   └── sprintTicketsData.ts
│   │
│   ├── services/
│   │   ├── aiGeneratorService.ts
│   │   ├── concurrencyAndAuditService.ts
│   │   ├── docxExportService.ts
│   │   ├── frameworkGovernanceService.ts
│   │   ├── intakeNormalizationService.ts
│   │   ├── n8nServices.ts
│   │   ├── pricingValidationService.ts
│   │   ├── proposalExportService.ts
│   │   ├── proposalGenerationService.ts
│   │   ├── proposalTemplateService.ts
│   │   ├── retrievalEvaluationService.ts
│   │   ├── sectionDraftingService.ts
│   │   ├── templateService.ts
│   │   └── __tests__/
│   │       └── sowComplianceAndExport.test.ts
│   │
│   └── types/
│       ├── jira.ts
│       ├── proposal.ts
│       ├── quill.ts
│       └── template.ts
│
└── dist/
```

---

### Key Architectural Components

#### 1. **Component Layer (UI)**
- **Page Components**: Dashboard, FrameworkReview, SOWAuthoringWorkspace
- **Modal Components**: ExportModal, CreateProjectModal, etc.
- **Feature Components**: Located in subdirectories by feature (framework/, templates/, section/)
- **Layout Components**: Navbar, Sidebar, TopHeader

#### 2. **Service Layer (Business Logic)**
- **aiGeneratorService**: Handles AI-powered content generation service
- **frameworkGovernanceService**: Enforces governance rules and framework validation
- **sectionDraftingService**: Manages section drafting with AI assistance
- **docxExportService**: Converts SOW data to DOCX format using docx library
- **concurrencyAndAuditService**: Manages concurrent edits and maintains audit trails
- **templateService**: Provides template CRUD operations and management
- **retrievalEvaluationService**: RAG integration for document retrieval
- **n8nServices**: workflow integration and automation hooks
- **pricingValidationService**: checks pricing assumptions and values
- **proposalGenerationService**: generate proposal content from structured inputs
- **proposalTemplateService**: template-driven proposal logic


#### 3. **Data & Type Layer**
The app uses strongly typed domain models under **src/types/**:
- **quill.ts**: core SOW and project types
- **proposal.ts**: proposal lifecycle and proposal domain
- **template.ts**: template schema and definitions
- **jira.ts**: Jira-related data 

#### 4. **External Integrations**
- **n8nServices.ts**: provides the integration layer for orchestration
- Supports AI-driven workflow automation around proposal creation and document generation


#### 5. **External Integrations**
- **Microsoft Search**: RAG source document retrieval
- **DOCX Library**: Document export and formatting
- **n8n automation workflows**

### Data Flow

```
User Action
    ▼
React Component (UI)
    ▼
Service Layer (Business Logic)
    ▼
External API / Local State
    ▼
Updated React State
    ▼
Component Re-render
```
### Small n8n workflow example

```
Trigger: Webhook / Manual Start
  ▼
Read project context and proposal inputs
  ▼
Fetch relevant source documents
  ▼
Generate draft sections or proposal content
  ▼
Run governance + pricing validation
  ▼
Send to human review / approval
  ▼
Update audit trail and state
  ▼
Export DOCX / notify downstream systems
```

### State Management
- **React Hooks** (useState, useEffect) for local component state
- **Props drilling** for parent-to-child communication
- **Event handlers** for child-to-parent updates
- **Sample data** (sampleProjects.ts) for initialization

---

## Getting Started

### 1. Start Development Server
```bash
npm run dev
```
The application will be available at `http://localhost:3000`

### 2. Navigate the Application
- **Dashboard**: Overview of all SOW projects
- **Framework Review**: Set up project framework and structure
- **SOW Authoring**: Draft sections with AI assistance
- **Templates**: Browse and manage SOW templates
- **Export**: Generate DOCX files for delivery

### 3. Sample Workflow
1. Create a new project via "Create Project" modal
2. Define framework with sections and requirements
3. Navigate to sections view
4. Review and edit individual sections
5. Export to DOCX format

---

## Technology Stack

### Frontend Framework
- **React** 19.0.1 - UI library
- **TypeScript** 5.8.2 - Type safety
- **Vite** 6.2.3 - Build tool and dev server

### Styling & UI
- **Tailwind CSS** 4.1.14 - Utility-first CSS framework
- **Lucide React** 0.546.0 - Icon library
- **Motion** 12.23.24 - Animation library

### AI & APIs
- **DOCX** 9.7.1 - Word document generation
- **File Saver** 2.0.5 - Browser file download utilities

### Development Tools
- **TypeScript** - Type checking
- **Tailwind CSS** - CSS frameworks
- **ESBuild** 0.25.0 - JavaScript bundler

### Runtime
- **Express** 4.21.2 - Server framework (for backend integration)
- **dotenv** 17.2.3 - Environment variable management

---

## Project Features in Detail

### SOW Projects
- **Multi-section documents**: Break down SOW into logical sections
- **Section states**: Draft, In Review, Approved
- **Framework tracking**: Maintain approved frameworks for consistency

### Framework Management
- **Framework-first approach**: Define structure before drafting sections
- **Governance rules**: Enforce compliance and consistency
- **Impact analysis**: Evaluate changes to frameworks

### Section Drafting
- **AI-assisted generation**: Leverage Gemini for content suggestions
- **Edit & review workflows**: Human-in-the-loop content creation
- **Concurrency handling**: Manage simultaneous edits
- **Diff tracking**: Visualize changes AI servicesn versions

### Proposal Workspace
- **Proposal creation**: Create new proposals from project and scope inputs
- **Lifecycle states**: Draft, In Review, Approved, Rejected
- **AI-assisted drafting**: Generate proposal text from structured project context
- **Approval workflow**: Route proposals through review and approval stages

### Templates System
- **Template library**: Pre-built SOW templates
- **Template editors**: Customize and create new templates
- **Validation**: Ensure template quality
- **Preview**: See how templates render

### Document Export
- **DOCX format**: Export to Microsoft Word
- **Batch export**: Export multiple sections
- **Format preservation**: Maintain styling and structure
