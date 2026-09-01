# Quill - AI-Powered SOW Authoring Platform

![Quill Logo](Quill.png)

> An enterprise-grade Statement of Work (SOW) authoring platform powered by AI, featuring framework-first generation, human-in-the-loop section review, RAG integration, and DOCX export capabilities.

---

## 📋 Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Project Structure](#project-structure)
- [Architecture](#architecture)
- [Getting Started](#getting-started)
- [Available Scripts](#available-scripts)
- [Technology Stack](#technology-stack)
- [Project Features in Detail](#project-features-in-detail)
- [Contributing](#contributing)

---

## 📌 Overview

**Quill** is an AI-powered enterprise platform designed to streamline the creation and management of Statements of Work (SOWs). It combines modern web technologies with AI capabilities to provide an intelligent, user-friendly interface for collaborative SOW authoring, framework governance, template management, and document export.

The platform supports integration with Microsoft Search for retrieval-augmented generation (RAG), enabling context-aware SOW drafting.

---

## ⭐ Key Features

### 1. **Framework-First SOW Generation**
- Define SOW frameworks with hierarchical sections and requirements
- AI-powered framework validation and optimization
- Framework approval workflow before section drafting

### 2. **Human-in-the-Loop Section Review**
- Interactive section editing with real-time AI suggestions
- Concurrency conflict detection for multi-user scenarios
- Token budget management for AI generation
- Side-by-side diff viewing for change tracking

### 3. **Retrieval-Augmented Generation (RAG)**
- Integration with Microsoft Search for document sources
- Context-aware section drafting using relevant source documents
- Source attribution and traceability

### 4. **Template Management System**
- Pre-built SOW templates for rapid project creation
- Template customization and versioning
- Template validation and preview capabilities
- Reusable section templates

### 5. **Enterprise Export Capabilities**
- DOCX (Microsoft Word) export with formatting preservation
- Multi-section batch export
- Format-aware content transformation (tables, lists, formatting)

### 6. **Project Management**
- Multi-project workspace
- Section-level drafting and review
- Audit logging for compliance tracking
- Project status indicators (draft, in-review, approved)

### 7. **Governance & Compliance**
- Framework governance service for compliance checks
- Concurrency and audit tracking
- Change history and rollback capabilities
- Unsupported claims detection


---

## 🔧 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js**: v18 or higher
- **npm** or **yarn**: v9 or higher
- **Git**: Latest version
- **TypeScript**: 5.8+ (installed via npm)


---

## 📦 Installation

### 1. Clone the Repository
```bash
git clone <repository-url>
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

## 📂 Project Structure

```
Quill/
├── index.html                          # HTML entry point
├── package.json                        # Project dependencies and scripts
├── tsconfig.json                       # TypeScript configuration
├── vite.config.ts                      # Vite bundler configuration
├── metadata.json                       # Project metadata
├── README.md                           # This file
│
├── src/
│   ├── main.tsx                        # React application entry point
│   ├── App.tsx                         # Main application component
│   ├── index.css                       # Global styles
│   │
│   ├── components/                     # React components
│   │   ├── Navbar.tsx                  # Navigation bar
│   │   ├── TopHeader.tsx               # Header component
│   │   ├── Sidebar.tsx                 # Sidebar navigation
│   │   ├── Dashboard.tsx               # Dashboard view
│   │   ├── SOWAuthoringWorkspace.tsx   # Main authoring interface
│   │   ├── FrameworkReview.tsx         # Framework review component
│   │   ├── SourcesPanel.tsx            # Document sources panel
│   │   ├── ExportModal.tsx             # Export functionality modal
│   │   ├── CreateProjectModal.tsx      # Project creation modal
│   │   │
│   │   ├── framework/
│   │   │   └── FrameworkImpactModal.tsx # Framework impact analysis
│   │   │
│   │   ├── intake/
│   │   │   └── IntakeSpecificationModal.tsx # Intake form handling
│   │   │
│   │   ├── section/
│   │   │   ├── ConcurrencyConflictModal.tsx # Conflict resolution
│   │   │   ├── DiffViewerModal.tsx          # Change tracking
│   │   │   ├── TokenBudgetDrawer.tsx        # Token usage management
│   │   │   └── UnsupportedClaimsBanner.tsx  # Validation warnings
│   │   │
│   │   └── templates/
│   │       ├── SOWTemplateList.tsx     # Template browsing
│   │       ├── SOWTemplateEditor.tsx   # Template editing
│   │       ├── SOWTemplatePreview.tsx  # Template preview
│   │       └── TemplateValidationModal.tsx # Template validation
│   │
│   ├── services/                       # Business logic and API integrations
│   │   ├── aiGeneratorService.ts       # AI content generation service
│   │   ├── concurrencyAndAuditService.ts # Concurrency & audit logging
│   │   ├── docxExportService.ts        # DOCX export functionality
│   │   ├── frameworkGovernanceService.ts # Framework compliance checks
│   │   ├── intakeNormalizationService.ts # Intake data normalization
│   │   ├── retrievalEvaluationService.ts # RAG service
│   │   ├── sectionDraftingService.ts   # Section generation logic
│   │   └── templateService.ts          # Template management
│   │
│   ├── types/                          # TypeScript type definitions
│   │   ├── quill.ts                    # Core Quill domain types
│   │   ├── template.ts                 # Template types
│   │   └── jira.ts                     # JIRA integration types
│   │
│   └── data/                           # Sample data and fixtures
│       ├── sampleProjects.ts           # Sample SOW projects
│       ├── sampleWorkflows.ts          # Sample N8n workflows
│       ├── sampleSharePointData.ts     # Sample documents

├── Asset/                              # Static assets
│   └── [Images, icons, etc.]
│
└── dist/                               # Production build output (generated)
```

---

## 🏗️ Architecture

### High-Level Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    Quill Frontend (React)                    │
│                                                               │
│  ┌──────────────────────────────────────────────────────┐   │
│  │           UI Layer (Components)                       │   │
│  │  ┌─────────────┐ ┌──────────────┐ ┌──────────────┐   │   │
│  │  │  Dashboard  │ │   Authoring  │ │  Templates   │   │   │
│  │  │             │ │  Workspace   │ │  Management  │   │   │
│  │  └─────────────┘ └──────────────┘ └──────────────┘   │   │
│  └──────────────────────────────────────────────────────┘   │
│                         ▼                                    │
│  ┌──────────────────────────────────────────────────────┐   │
│  │        Business Logic Layer (Services)               │   │
│  │  ┌──────────────┐  ┌──────────────┐  ┌────────────┐  │   │
│  │  │     AI       │  │  Framework   │  │  Template  │  │   │
│  │  │  Generator   │  │ Governance   │  │  Service   │  │   │
│  │  └──────────────┘  └──────────────┘  └────────────┘  │   │
│  │  ┌──────────────┐  ┌──────────────┐  ┌────────────┐  │   │
│  │  │ Concurrency  │  │   Section    │  │   DOCX     │  │   │
│  │  │    Audit     │  │  Drafting    │  │   Export   │  │   │
│  │  └──────────────┘  └──────────────┘  └────────────┘  │   │
│  └──────────────────────────────────────────────────────┘   │
│                         ▼                                    │
│  ┌──────────────────────────────────────────────────────┐   │
│  │        Data Layer (Types & State)                     │   │
│  │  - SOWProject, SOWSection, SOWTemplate                │   │
│  │  - AuditLogEntry, FrameworkApproval                   │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
           ▼              ▼              ▼
    ┌──────────────┐ ┌─────
    ┌──────────────┐ ┌──────────────┐
    │  Microsoft   │ │   DOCX       │
    │   Search     │ │   Export     │
    │   RAG        │ │   Library    │
   

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

#### 3. **Data & Type Layer**
- **Types** (quill.ts): Core domain models
  - `SOWProject`: Represents a Statement of Work project
  - `SOWSection`: Represents sections within a SOW
  - `SOWTemplate`: Reusable SOW templates
  - `AuditLogEntry`: Audit trail entries
  - `FrameworkApproval`: Framework review state

#### 4. **External Integrations**
- **Microsoft Search**: RAG source document retrieval
- **DOCX Library**: Document export and formatting

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

### State Management
- **React Hooks** (useState, useEffect) for local component state
- **Props drilling** for parent-to-child communication
- **Event handlers** for child-to-parent updates
- **Sample data** (sampleProjects.ts) for initialization

---

## 🚀 Getting Started

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

## 📜 Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server on port 3000 |
| `npm run build` | Build production bundle |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run TypeScript type checking |
| `npm run clean` | Remove dist and build artifacts |

---

## 🛠️ Technology Stack

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
- **Tailwind CSS** - CSS framework
- **Autoprefixer** 10.4.21 - CSS vendor prefixes
- **ESBuild** 0.25.0 - JavaScript bundler

### Runtime
- **Express** 4.21.2 - Server framework (for backend integration)
- **dotenv** 17.2.3 - Environment variable management

---

## 📋 Project Features in Detail

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

### Templates System
- **Template library**: Pre-built SOW templates
- **Template editors**: Customize and create new templates
- **Validation**: Ensure template quality
- **Preview**: See how templates render

### Document Export
- **DOCX format**: Export to Microsoft Word
- **Batch export**: Export multiple sections
- **Format preservation**: Maintain styling and structure
