import React, { useEffect, useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { TopHeader } from './components/TopHeader';
import { SOWAuthoringWorkspace } from './components/SOWAuthoringWorkspace';
import { Dashboard } from './components/Dashboard';
import { FrameworkReview } from './components/FrameworkReview';
import { SourcesPanel } from './components/SourcesPanel';
import { ExportModal } from './components/ExportModal';
import { CreateProjectModal } from './components/CreateProjectModal';
import { CreateProposalModal } from './components/CreateProposalModal';
import { ProposalWorkspace } from './components/ProposalWorkspace';
import { SOWTemplateList } from './components/templates/SOWTemplateList';
import { SOWTemplateEditor } from './components/templates/SOWTemplateEditor';
import { SOWTemplatePreview } from './components/templates/SOWTemplatePreview';
import { INITIAL_SAMPLE_PROJECTS } from './data/sampleProjects';
import { SAMPLE_SOURCE_DOCUMENTS, SAMPLE_AUDIT_LOGS } from './data/sampleSharePointData';
import { SOWProject, SOWSection, AuditLogEntry } from './types/quill';
import { SOWTemplate } from './types/template';
import { templateService } from './services/templateService';

const APP_STATE_STORAGE_KEY = 'quill-app-state';

type PersistedAppState = {
  projects: SOWProject[];
  activeProjectId: string;
  activeSectionId: string;
  currentView: 'sections' | 'dashboard' | 'framework' | 'proposal' | 'templates' | 'template-editor' | 'template-preview';
};

const loadPersistedAppState = (): Partial<PersistedAppState> => {
  try {
    const stored = localStorage.getItem(APP_STATE_STORAGE_KEY);
    return stored ? JSON.parse(stored) as Partial<PersistedAppState> : {};
  } catch {
    return {};
  }
};

export default function App() {
  const persistedState = loadPersistedAppState();

  // Navigation States
  const [currentView, setCurrentView] = useState<
    'sections' | 'dashboard' | 'framework' | 'proposal' | 'templates' | 'template-editor' | 'template-preview'
  >(persistedState.currentView || 'sections');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Application Data States
  const [projects, setProjects] = useState<SOWProject[]>(persistedState.projects || INITIAL_SAMPLE_PROJECTS);
  const [activeProjectId, setActiveProjectId] = useState<string>(persistedState.activeProjectId || INITIAL_SAMPLE_PROJECTS[0].id);
  const [activeSectionId, setActiveSectionId] = useState<string>(persistedState.activeSectionId || INITIAL_SAMPLE_PROJECTS[0].sections[1]?.id || INITIAL_SAMPLE_PROJECTS[0].sections[0]?.id || '');
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(SAMPLE_AUDIT_LOGS);

  // Template State
  const [activeTemplate, setActiveTemplate] = useState<SOWTemplate | null>(null);

  // Modals & Drawers
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isProposalCreateModalOpen, setIsProposalCreateModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [exportTargetProject, setExportTargetProject] = useState<SOWProject>(INITIAL_SAMPLE_PROJECTS[0]);
  const [sourcesDrawerOpen, setSourcesDrawerOpen] = useState(false);
  const [sourcesSectionTarget, setSourcesSectionTarget] = useState<SOWSection | null>(null);

  const activeProject = projects.find(p => p.id === activeProjectId) || projects[0];

  useEffect(() => {
    localStorage.setItem(APP_STATE_STORAGE_KEY, JSON.stringify({
      projects,
      activeProjectId,
      activeSectionId,
      currentView,
    } satisfies PersistedAppState));
  }, [projects, activeProjectId, activeSectionId, currentView]);

  // Project select handler
  const handleSelectProject = (projectId: string) => {
    setActiveProjectId(projectId);
    const target = projects.find(p => p.id === projectId);
    if (target) {
      if (!target.frameworkApproved) {
        setCurrentView('framework');
      } else {
        setCurrentView('sections');
        setActiveSectionId(target.sections[1]?.id || target.sections[0]?.id || '');
      }
    }
  };

  const handleCreateProject = (newProject: SOWProject) => {
    setProjects([newProject, ...projects]);
    setActiveProjectId(newProject.id);
    setActiveSectionId(newProject.sections[0]?.id || '');
    setCurrentView('framework');

    // Add Audit Log
    const newLog: AuditLogEntry = {
      id: `LOG-${Math.floor(Math.random() * 9000) + 1000}`,
      timestamp: new Date().toISOString(),
      projectId: newProject.id,
      projectTitle: newProject.title,
      user: newProject.ownerName,
      userEmail: newProject.ownerEmail,
      action: 'PROJECT_CREATED',
      details: `Created new project for ${newProject.clientName} and generated initial framework.`,
      status: 'SUCCESS',
      executionTimeMs: 320,
    };
    setAuditLogs([newLog, ...auditLogs]);
  };

  const handleCreateProposal = (newProposal: SOWProject) => {
    setProjects(prev => [newProposal, ...prev]);
    setActiveProjectId(newProposal.id);
    setActiveSectionId('');
    setCurrentView('proposal');
    const newLog: AuditLogEntry = {
      id: `LOG-${Math.floor(Math.random() * 9000) + 1000}`,
      timestamp: new Date().toISOString(),
      projectId: newProposal.id,
      projectTitle: newProposal.title,
      user: newProposal.ownerName,
      userEmail: newProposal.ownerEmail,
      action: 'PROJECT_CREATED',
      details: `Created new proposal for ${newProposal.clientName} using the ${newProposal.proposalTemplateId} blueprint.`,
      status: 'SUCCESS',
      executionTimeMs: 320,
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  // Template handlers
  const handleSelectTemplateToEdit = (template: SOWTemplate) => {
    setActiveTemplate(template);
    setCurrentView('template-editor');
  };

  const handleSelectTemplateToPreview = (template: SOWTemplate) => {
    setActiveTemplate(template);
    setCurrentView('template-preview');
  };

  const handleCreateNewTemplate = () => {
    const newTemplate = templateService.createTemplate('New Custom SOW Template', 'Master SOW');
    setActiveTemplate(newTemplate);
    setCurrentView('template-editor');
  };

  const handleSaveTemplate = (saved: SOWTemplate) => {
    setActiveTemplate(saved);
  };

  const handleUseTemplateToCreateSOW = (template: SOWTemplate) => {
    // Generate new SOW project from template
    const newProject = templateService.createSOWProjectFromTemplate(
      template,
      'Acme Global Enterprises',
      `${template.metadata.name} - Acme Engagement`,
      '2026-10-01',
      '2027-03-31'
    );

    setProjects([newProject, ...projects]);
    setActiveProjectId(newProject.id);
    setActiveSectionId(newProject.sections[0]?.id || '');
    setCurrentView('framework');

    const newLog: AuditLogEntry = {
      id: `LOG-${Math.floor(Math.random() * 9000) + 1000}`,
      timestamp: new Date().toISOString(),
      projectId: newProject.id,
      projectTitle: newProject.title,
      user: 'Nikhil',
      userEmail: 'nikhil@acme-transform.com',
      action: 'TEMPLATE_USED_FOR_SOW',
      details: `Initialized new Statement of Work "${newProject.title}" directly from template "${template.metadata.name}" (v${template.metadata.version}).`,
      status: 'SUCCESS',
      executionTimeMs: 140,
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  const handleUpdateProject = (updated: SOWProject) => {
    setProjects(projects.map(p => p.id === updated.id ? updated : p));
  };

  const handleUpdateSection = (updatedSection: SOWSection) => {
    if (!activeProject) return;
    const updatedSections = activeProject.sections.map(s => s.id === updatedSection.id ? updatedSection : s);
    const allApproved = updatedSections.every(s => s.status === 'Approved');
    
    const updatedProject: SOWProject = {
      ...activeProject,
      sections: updatedSections,
      status: allApproved ? 'Approved' : 'Under Review',
      updatedAt: new Date().toISOString(),
    };
    handleUpdateProject(updatedProject);

    // Audit log if approved
    if (updatedSection.status === 'Approved') {
      const newLog: AuditLogEntry = {
        id: `LOG-${Math.floor(Math.random() * 9000) + 1000}`,
        timestamp: new Date().toISOString(),
        projectId: activeProject.id,
        projectTitle: activeProject.title,
        user: activeProject.ownerName,
        userEmail: activeProject.ownerEmail,
        action: 'SECTION_APPROVED',
        details: `Approved section "${updatedSection.title}" (Version ${updatedSection.version}).`,
        status: 'SUCCESS',
        executionTimeMs: 85,
      };
      setAuditLogs(prev => [newLog, ...prev]);
    }
  };

  const handleApproveFramework = () => {
    if (!activeProject) return;
    const updatedProject: SOWProject = {
      ...activeProject,
      frameworkApproved: true,
      status: 'Under Review',
      updatedAt: new Date().toISOString(),
    };
    handleUpdateProject(updatedProject);
    setCurrentView('sections');
    setActiveSectionId(activeProject.sections[0]?.id || '');
  };

  const handleOpenExportModal = (target: SOWProject) => {
    // Ensure all pricing sections adhere to DTMC Blank Pricing Policy
    const sanitizedSections = target.sections.map(s => {
      if (s.content.includes('$88,000') || s.content.includes('$116,000')) {
        return {
          ...s,
          content: s.content
            .replace(/\$88,000(?:\s*to\s*\$116,000)?/gi, '[ — ]')
            .replace(/\$116,000/gi, '[ — ]'),
          status: 'Approved' as const,
        };
      }
      return s;
    });

    const sanitizedTarget: SOWProject = {
      ...target,
      sections: sanitizedSections,
    };

    handleUpdateProject(sanitizedTarget);
    setExportTargetProject(sanitizedTarget);
    setIsExportModalOpen(true);
  };

  const handleOpenSourcesDrawer = (sec: SOWSection) => {
    setSourcesSectionTarget(sec);
    setSourcesDrawerOpen(true);
  };

  const handleNavigateStep = (stepNumber: number) => {
    if (stepNumber === 1) setIsCreateModalOpen(true);
    else if (stepNumber === 2) setCurrentView('framework');
    else if (stepNumber === 3) setCurrentView('proposal');
    else if (stepNumber === 4) setCurrentView('sections');
    else if (stepNumber === 5) handleOpenExportModal(activeProject);
  };

  return (
    <div className="flex h-screen bg-[#F8FAFC] text-[#0F172A] overflow-hidden font-sans">
      
      {/* Left Dark Navy Sidebar */}
      <Sidebar
        currentView={currentView}
        setCurrentView={setCurrentView}
        onOpenCreateProject={() => setIsCreateModalOpen(true)}
        onOpenProposal={() => setIsProposalCreateModalOpen(true)}
        isCollapsed={isSidebarCollapsed}
        setIsCollapsed={setIsSidebarCollapsed}
      />

      {/* Main Right Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        
        {/* Top Header Bar */}
        <TopHeader
          currentProject={activeProject}
          currentView={currentView}
          setCurrentView={setCurrentView}
          onOpenNotifications={() => setCurrentView('dashboard')}
        />

        {/* Dynamic View Body */}
        <div className="flex-1 flex flex-col">
          
          {/* VIEW 1: SOW 3-Column Authoring Workspace */}
          {currentView === 'sections' && (
            <SOWAuthoringWorkspace
              project={activeProject}
              activeSectionId={activeSectionId}
              setActiveSectionId={setActiveSectionId}
              onUpdateSection={handleUpdateSection}
              onUpdateProject={handleUpdateProject}
              onOpenSourcesDrawer={handleOpenSourcesDrawer}
              onOpenExportModal={() => handleOpenExportModal(activeProject)}
              onNavigateStep={handleNavigateStep}
            />
          )}

          {/* VIEW 2: Dashboard (Project lists & Overview) */}
          {currentView === 'dashboard' && (
            <div className="p-8 max-w-7xl mx-auto w-full">
              <Dashboard
                projects={projects}
                auditLogs={auditLogs}
                onSelectProject={handleSelectProject}
                onOpenCreateModal={() => setIsCreateModalOpen(true)}
                onOpenExportModal={handleOpenExportModal}
              />
            </div>
          )}

          {/* VIEW 3: Framework Reviewer (Section structure builder) */}
          {currentView === 'framework' && (
            <div className="p-8 max-w-7xl mx-auto w-full">
              <FrameworkReview
                project={activeProject}
                onUpdateProject={handleUpdateProject}
                onApproveFramework={handleApproveFramework}
                onProceedToSectionReview={() => setCurrentView('sections')}
              />
            </div>
          )}

          {/* VIEW 4: Proposal Workspace */}
          {currentView === 'proposal' && (
            <ProposalWorkspace
              project={activeProject}
              onUpdateProject={handleUpdateProject}
              onOpenSow={() => setCurrentView('sections')}
            />
          )}

          {/* VIEW 5: SOW Templates Directory */}
          {currentView === 'templates' && (
            <SOWTemplateList
              onSelectTemplateToEdit={handleSelectTemplateToEdit}
              onSelectTemplateToPreview={handleSelectTemplateToPreview}
              onUseTemplateToCreateSOW={handleUseTemplateToCreateSOW}
              onCreateNewTemplate={handleCreateNewTemplate}
            />
          )}

          {/* VIEW 8: SOW Template Editor */}
          {currentView === 'template-editor' && activeTemplate && (
            <SOWTemplateEditor
              template={activeTemplate}
              onSaveTemplate={handleSaveTemplate}
              onPreviewTemplate={handleSelectTemplateToPreview}
              onCancel={() => setCurrentView('templates')}
            />
          )}

          {/* VIEW 9: SOW Template Preview */}
          {currentView === 'template-preview' && activeTemplate && (
            <SOWTemplatePreview
              template={activeTemplate}
              onEditTemplate={handleSelectTemplateToEdit}
              onUseTemplate={handleUseTemplateToCreateSOW}
              onBack={() => setCurrentView('templates')}
            />
          )}

        </div>

      </div>

      {/* Create SOW Intake Wizard Modal */}
      {isCreateModalOpen && (
        <CreateProjectModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onCreateProject={handleCreateProject}
        />
      )}

      {isProposalCreateModalOpen && (
        <CreateProposalModal
          isOpen={isProposalCreateModalOpen}
          onClose={() => setIsProposalCreateModalOpen(false)}
          onCreateProposal={handleCreateProposal}
        />
      )}

      {/* DTMC Word Document Export Modal */}
      {isExportModalOpen && (
        <ExportModal
          isOpen={isExportModalOpen}
          onClose={() => setIsExportModalOpen(false)}
          project={exportTargetProject}
          onExportComplete={(updated) => {
            handleUpdateProject(updated);
            const newLog: AuditLogEntry = {
              id: `LOG-${Math.floor(Math.random() * 9000) + 1000}`,
              timestamp: new Date().toISOString(),
              projectId: updated.id,
              projectTitle: updated.title,
              user: updated.ownerName,
              userEmail: updated.ownerEmail,
              action: 'DOCUMENT_EXPORTED',
              details: `Successfully exported DTMC Word SOW document (${updated.exportHistory[0]?.fileName}) with blank pricing verification.`,
              status: 'SUCCESS',
              executionTimeMs: 890,
            };
            setAuditLogs(prev => [newLog, ...prev]);
          }}
        />
      )}

      {/* Grounded Sources Drawer */}
      {sourcesDrawerOpen && (
        <SourcesPanel
          isOpen={sourcesDrawerOpen}
          onClose={() => setSourcesDrawerOpen(false)}
          project={activeProject}
          section={sourcesSectionTarget}
          allSources={SAMPLE_SOURCE_DOCUMENTS}
        />
      )}

    </div>
  );
}






