import React, { useState, useEffect } from 'react';
import { 
  Save, 
  Eye, 
  ShieldCheck, 
  CheckCircle2, 
  Copy, 
  X, 
  Plus, 
  Trash2, 
  ArrowUp, 
  ArrowDown, 
  FileText, 
  Layers, 
  Settings, 
  AlertTriangle, 
  Info, 
  Sparkles,
  HelpCircle,
  Clock,
  BookOpen,
  ChevronRight,
  FileCode,
  Tag,
  Check,
  AlertCircle
} from 'lucide-react';
import { 
  SOWTemplate, 
  TemplateSection, 
  GovernanceRoleItem, 
  TemplateType, 
  TemplateStatus 
} from '../../types/template';
import { templateService } from '../../services/templateService';
import { TemplateValidationModal } from './TemplateValidationModal';

interface SOWTemplateEditorProps {
  template: SOWTemplate;
  onSaveTemplate: (updated: SOWTemplate) => void;
  onPreviewTemplate: (template: SOWTemplate) => void;
  onCancel: () => void;
}

export const SOWTemplateEditor: React.FC<SOWTemplateEditorProps> = ({
  template: initialTemplate,
  onSaveTemplate,
  onPreviewTemplate,
  onCancel
}) => {
  const [template, setTemplate] = useState<SOWTemplate>(() => JSON.parse(JSON.stringify(initialTemplate)));
  const [activeTab, setActiveTab] = useState<'SECTIONS' | 'COVER_PAGE' | 'METADATA'>('SECTIONS');
  const [selectedSectionId, setSelectedSectionId] = useState<string>(
    initialTemplate.sections[0]?.id || ''
  );
  const [isDirty, setIsDirty] = useState(false);
  const [showUnsavedModal, setShowUnsavedModal] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Validation modal state
  const [validationResult, setValidationResult] = useState<any>(null);
  const [showValidationModal, setShowValidationModal] = useState(false);

  // New optional section modal / form
  const [isAddingSection, setIsAddingSection] = useState(false);
  const [newSectionTitle, setNewSectionTitle] = useState('');
  const [newSectionCategory, setNewSectionCategory] = useState<any>('Appendix');
  const [newSectionIsAppendix, setNewSectionIsAppendix] = useState(true);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const currentSection = template.sections.find(s => s.id === selectedSectionId) || template.sections[0];

  const handleUpdateCurrentSectionContent = (newContent: string) => {
    if (!currentSection) return;
    const updatedSections = template.sections.map(s => 
      s.id === currentSection.id ? { ...s, content: newContent } : s
    );
    setTemplate({ ...template, sections: updatedSections });
    setIsDirty(true);
  };

  const handleUpdateCurrentSectionTitle = (newTitle: string) => {
    if (!currentSection) return;
    const updatedSections = template.sections.map(s => 
      s.id === currentSection.id ? { ...s, title: newTitle } : s
    );
    setTemplate({ ...template, sections: updatedSections });
    setIsDirty(true);
  };

  // Section Reordering
  const handleMoveSection = (index: number, direction: 'UP' | 'DOWN') => {
    const targetIndex = direction === 'UP' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= template.sections.length) return;

    const sectionsCopy = [...template.sections];
    const temp = sectionsCopy[index];
    sectionsCopy[index] = sectionsCopy[targetIndex];
    sectionsCopy[targetIndex] = temp;

    // Recalculate order values
    const reordered = sectionsCopy.map((s, idx) => ({ ...s, order: idx + 1 }));
    setTemplate({ ...template, sections: reordered });
    setIsDirty(true);
  };

  // Add new optional section / appendix
  const handleAddOptionalSection = () => {
    if (!newSectionTitle.trim()) return;

    const newId = `SEC-T-OPT-${Date.now()}`;
    const newSec: TemplateSection = {
      id: newId,
      order: template.sections.length + 1,
      title: newSectionTitle.trim(),
      category: newSectionCategory,
      isMandatory: false,
      isOptional: true,
      isPricingSection: false,
      isAppendix: newSectionIsAppendix,
      content: `### ${newSectionTitle.trim()}\n\n*(Optional section content)*\n\nSpecify customized scope, architecture assumptions, or legal clauses for this engagement.`
    };

    setTemplate({
      ...template,
      sections: [...template.sections, newSec]
    });
    setSelectedSectionId(newId);
    setNewSectionTitle('');
    setIsAddingSection(false);
    setIsDirty(true);
    showToast(`Added optional section "${newSec.title}"`);
  };

  // Delete optional section
  const handleDeleteSection = (sectionId: string) => {
    const target = template.sections.find(s => s.id === sectionId);
    if (!target) return;
    if (target.isMandatory) {
      showToast('Cannot delete mandatory DTMC SOW sections.');
      return;
    }

    const filtered = template.sections.filter(s => s.id !== sectionId);
    const reordered = filtered.map((s, idx) => ({ ...s, order: idx + 1 }));
    setTemplate({ ...template, sections: reordered });
    if (selectedSectionId === sectionId) {
      setSelectedSectionId(reordered[0]?.id || '');
    }
    setIsDirty(true);
    showToast(`Removed "${target.title}"`);
  };

  // Governance Roles Handlers
  const applyGovernanceRolesUpdate = (updatedRoles: GovernanceRoleItem[]) => {
    if (!currentSection) return;
    
    // Regenerate markdown table in content
    const tableHeader = '| Role Title | Organization | Core Responsibilities |\n|---|---|---|\n';
    const tableRows = updatedRoles.map(r => 
      `| ${r.role} | ${r.role.startsWith('DTMC') ? 'DTMC Advisory' : '{{CLIENT_ORGANIZATION_NAME}}'} | ${r.responsibility} |`
    ).join('\n');

    const tableBlock = tableHeader + tableRows;
    const hasExistingTable = /\| Role Title \| Organization \| Core Responsibilities \|[\s\S]*?(?=\n\n|\n###|$)/.test(currentSection.content);

    let updatedContent = currentSection.content;
    if (hasExistingTable) {
      updatedContent = currentSection.content.replace(
        /\| Role Title \| Organization \| Core Responsibilities \|[\s\S]*?(?=\n\n|\n###|$)/,
        tableBlock
      );
    } else {
      updatedContent = `${currentSection.content.trim()}\n\n### Governance & Staffing Matrix\n\n${tableBlock}`;
    }

    const updatedSections = template.sections.map(s => 
      s.id === currentSection.id ? { 
        ...s, 
        governanceRoles: updatedRoles,
        content: updatedContent,
      } : s
    );

    setTemplate({ ...template, sections: updatedSections });
    setIsDirty(true);
  };

  const handleUpdateRole = (roleId: string, updatedField: Partial<GovernanceRoleItem>) => {
    if (!currentSection) return;
    const currentRoles = currentSection.governanceRoles || [];
    const updatedRoles = currentRoles.map(r => r.id === roleId ? { ...r, ...updatedField } : r);
    applyGovernanceRolesUpdate(updatedRoles);
  };

  const handleAddRole = () => {
    if (!currentSection) return;
    const currentRoles = currentSection.governanceRoles || [];
    const newRole: GovernanceRoleItem = {
      id: `ROLE-${Date.now()}`,
      role: 'Client Co-Lead / Advisor',
      responsibility: 'Participate in milestone sign-offs, sprint ceremonies, and quality verification.',
      isOptional: true,
      order: currentRoles.length + 1
    };

    const updatedRoles = [...currentRoles, newRole];
    applyGovernanceRolesUpdate(updatedRoles);
    showToast('Added governance role to matrix and markdown');
  };

  const handleRemoveRole = (roleId: string) => {
    if (!currentSection) return;
    const currentRoles = currentSection.governanceRoles || [];
    const targetRole = currentRoles.find(r => r.id === roleId);
    if (!targetRole?.isOptional && currentRoles.length <= 4) {
      showToast('Standard core roles cannot be removed.');
      return;
    }

    const filtered = currentRoles.filter(r => r.id !== roleId);
    applyGovernanceRolesUpdate(filtered);
    showToast('Role removed from governance matrix and markdown');
  };

  // Helper to insert placeholder into editor
  const handleInsertPlaceholder = (placeholderTag: string) => {
    if (!currentSection) return;
    handleUpdateCurrentSectionContent(`${currentSection.content} ${placeholderTag} `);
  };

  // Validation
  const handleValidate = () => {
    const result = templateService.validateTemplate(template);
    setValidationResult(result);
    setShowValidationModal(true);
  };

  // Save Draft
  const handleSaveDraft = () => {
    const updated: SOWTemplate = {
      ...template,
      metadata: {
        ...template.metadata,
        status: 'Draft',
        modifiedDate: new Date().toISOString()
      }
    };
    templateService.saveTemplate(updated);
    setTemplate(updated);
    setIsDirty(false);
    onSaveTemplate(updated);
    showToast('Draft template saved successfully');
  };

  // Mark Ready for Use
  const handleMarkReadyForUse = () => {
    const result = templateService.validateTemplate(template);
    if (!result.canMarkReady) {
      setValidationResult(result);
      setShowValidationModal(true);
      return;
    }

    const updated: SOWTemplate = {
      ...template,
      metadata: {
        ...template.metadata,
        status: 'Ready for Use',
        approvedForUse: true,
        modifiedDate: new Date().toISOString()
      }
    };
    templateService.saveTemplate(updated);
    setTemplate(updated);
    setIsDirty(false);
    onSaveTemplate(updated);
    showToast('Template approved and marked Ready for Use');
  };

  // Duplicate
  const handleDuplicate = () => {
    const copy = templateService.duplicateTemplate(template.id);
    if (copy) {
      showToast(`Duplicated template "${copy.metadata.name}"`);
      onSaveTemplate(copy);
    }
  };

  // Cancel Handler
  const handleCancelClick = () => {
    if (isDirty) {
      setShowUnsavedModal(true);
    } else {
      onCancel();
    }
  };

  const wordCount = currentSection?.content ? currentSection.content.trim().split(/\s+/).length : 0;
  const isGovernanceSection = currentSection?.category === 'Governance' || currentSection?.title.toLowerCase().includes('governance');
  const isScheduleSection = currentSection?.category === 'Schedule' || currentSection?.title.toLowerCase().includes('schedule');
  const isPricingSection = currentSection?.isPricingSection || currentSection?.title.toLowerCase().includes('fees');

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] bg-[#F8FAFC] text-[#0F172A] overflow-hidden font-sans">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#0F172A] text-white px-4 py-2.5 rounded-lg shadow-xl text-xs font-semibold flex items-center space-x-2 animate-slide-up border border-[#334155]">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Editor Top Navigation & Action Bar */}
      <div className="h-14 bg-white border-b border-[#E2E8F0] px-6 flex items-center justify-between shrink-0">
        
        {/* Left: Template Name, Version & Dirty State */}
        <div className="flex items-center space-x-3 min-w-0">
          <button 
            onClick={handleCancelClick}
            className="p-1.5 rounded-lg text-[#64748B] hover:text-[#0F172A] hover:bg-[#F1F5F9] transition cursor-pointer"
            title="Back to Templates"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center space-x-2 truncate">
            <h2 className="text-sm font-bold text-[#0F172A] truncate">
              {template.metadata.name}
            </h2>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
              v{template.metadata.version}
            </span>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
              template.metadata.status === 'Ready for Use'
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                : 'bg-amber-50 text-amber-700 border-amber-200'
            }`}>
              {template.metadata.status}
            </span>
            {isDirty && (
              <span className="text-[11px] text-amber-600 font-semibold flex items-center space-x-1">
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                <span>Unsaved changes</span>
              </span>
            )}
          </div>
        </div>

        {/* Center: Mode Tabs */}
        <div className="hidden md:flex items-center space-x-1 bg-[#F1F5F9] p-1 rounded-lg border border-[#E2E8F0] text-xs">
          <button
            onClick={() => setActiveTab('SECTIONS')}
            className={`px-3 py-1 rounded-md font-semibold transition cursor-pointer flex items-center space-x-1.5 ${
              activeTab === 'SECTIONS' ? 'bg-white text-[#1D68F2] shadow-xs' : 'text-[#64748B] hover:text-[#0F172A]'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Sections & Body ({template.sections.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('COVER_PAGE')}
            className={`px-3 py-1 rounded-md font-semibold transition cursor-pointer flex items-center space-x-1.5 ${
              activeTab === 'COVER_PAGE' ? 'bg-white text-[#1D68F2] shadow-xs' : 'text-[#64748B] hover:text-[#0F172A]'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Cover Page Placeholders</span>
          </button>

          <button
            onClick={() => setActiveTab('METADATA')}
            className={`px-3 py-1 rounded-md font-semibold transition cursor-pointer flex items-center space-x-1.5 ${
              activeTab === 'METADATA' ? 'bg-white text-[#1D68F2] shadow-xs' : 'text-[#64748B] hover:text-[#0F172A]'
            }`}
          >
            <Settings className="w-3.5 h-3.5" />
            <span>Template Settings</span>
          </button>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center space-x-2">
          
          <button
            onClick={handleValidate}
            className="flex items-center space-x-1.5 bg-white hover:bg-slate-50 text-[#334155] border border-[#CBD5E1] px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer"
            title="Validate DTMC compliance rules"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-[#1D68F2]" />
            <span className="hidden sm:inline">Validate</span>
          </button>

          <button
            onClick={() => onPreviewTemplate(template)}
            className="flex items-center space-x-1.5 bg-white hover:bg-slate-50 text-[#334155] border border-[#CBD5E1] px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer"
            title="Preview rendered document"
          >
            <Eye className="w-3.5 h-3.5 text-[#64748B]" />
            <span className="hidden sm:inline">Preview</span>
          </button>

          <button
            onClick={handleSaveDraft}
            className="flex items-center space-x-1.5 bg-white hover:bg-slate-50 text-[#334155] border border-[#CBD5E1] px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer"
            title="Save as Draft"
          >
            <Save className="w-3.5 h-3.5 text-blue-600" />
            <span>Save Draft</span>
          </button>

          <button
            onClick={handleMarkReadyForUse}
            className="flex items-center space-x-1.5 bg-[#1D68F2] hover:bg-[#1554c0] text-white px-3.5 py-1.5 rounded-lg text-xs font-bold transition shadow-xs cursor-pointer"
            title="Validate and Mark Ready for Use"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Mark Ready for Use</span>
          </button>

        </div>

      </div>

      {/* Main Body Area */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* VIEW A: SECTIONS EDITOR (3-Pane or Split View) */}
        {activeTab === 'SECTIONS' && (
          <>
            {/* Left Pane: Sections Directory */}
            <div className="w-72 bg-white border-r border-[#E2E8F0] flex flex-col shrink-0">
              
              <div className="p-3 border-b border-[#E2E8F0] flex items-center justify-between bg-[#F8FAFC]">
                <div className="text-xs font-bold text-[#0F172A] uppercase tracking-wider">
                  Template Sections ({template.sections.length})
                </div>
                <button
                  onClick={() => setIsAddingSection(true)}
                  className="p-1 rounded-md text-[#1D68F2] hover:bg-blue-50 transition cursor-pointer text-xs font-semibold flex items-center space-x-1"
                  title="Add Optional Appendix or Section"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Section</span>
                </button>
              </div>

              {/* Add Section Inline Form */}
              {isAddingSection && (
                <div className="p-3 bg-blue-50/70 border-b border-blue-200 space-y-2 text-xs">
                  <div className="font-bold text-[#1D68F2]">New Optional Section</div>
                  <input
                    type="text"
                    value={newSectionTitle}
                    onChange={(e) => setNewSectionTitle(e.target.value)}
                    placeholder="e.g. Appendix F: Security Runbook"
                    className="w-full bg-white border border-[#CBD5E1] rounded p-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                  <div className="flex items-center justify-between pt-1">
                    <label className="flex items-center space-x-1.5 text-[11px] text-[#475569]">
                      <input
                        type="checkbox"
                        checked={newSectionIsAppendix}
                        onChange={(e) => setNewSectionIsAppendix(e.target.checked)}
                        className="rounded text-[#1D68F2]"
                      />
                      <span>Mark as Appendix</span>
                    </label>
                    <div className="flex items-center space-x-1.5">
                      <button
                        onClick={() => setIsAddingSection(false)}
                        className="px-2 py-0.5 text-slate-500 hover:text-slate-800 text-[11px]"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleAddOptionalSection}
                        disabled={!newSectionTitle.trim()}
                        className="px-2.5 py-1 bg-[#1D68F2] text-white font-bold rounded text-[11px] disabled:opacity-50"
                      >
                        Add
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Sections List */}
              <div className="flex-1 overflow-y-auto p-2 space-y-1">
                {template.sections.map((sec, idx) => {
                  const isSelected = sec.id === selectedSectionId;

                  return (
                    <div
                      key={sec.id}
                      onClick={() => setSelectedSectionId(sec.id)}
                      className={`p-2.5 rounded-lg border transition cursor-pointer flex items-center justify-between group ${
                        isSelected
                          ? 'bg-blue-50/70 border-[#1D68F2] text-[#0F172A] shadow-xs'
                          : 'bg-white border-transparent hover:bg-slate-50 hover:border-[#E2E8F0] text-[#334155]'
                      }`}
                    >
                      <div className="min-w-0 flex-1 pr-2 space-y-0.5">
                        <div className="flex items-center space-x-1.5">
                          <span className="text-[10px] font-bold text-[#64748B] w-4">{idx + 1}.</span>
                          <span className="text-xs font-semibold truncate">{sec.title.replace(/^\d+\.\s*/, '')}</span>
                        </div>
                        <div className="flex items-center space-x-1.5 text-[10px]">
                          {sec.isMandatory ? (
                            <span className="text-emerald-700 font-bold">Mandatory</span>
                          ) : (
                            <span className="text-slate-500 font-medium">Optional</span>
                          )}
                          {sec.isPricingSection && (
                            <span className="text-amber-700 font-bold">• Blank Pricing</span>
                          )}
                        </div>
                      </div>

                      {/* Reorder & Delete Controls */}
                      <div className="flex items-center space-x-0.5 opacity-0 group-hover:opacity-100 transition shrink-0">
                        <button
                          onClick={(e) => { e.stopPropagation(); handleMoveSection(idx, 'UP'); }}
                          disabled={idx === 0}
                          className="p-1 text-slate-400 hover:text-[#0F172A] disabled:opacity-20 cursor-pointer"
                          title="Move up"
                        >
                          <ArrowUp className="w-3 h-3" />
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); handleMoveSection(idx, 'DOWN'); }}
                          disabled={idx === template.sections.length - 1}
                          className="p-1 text-slate-400 hover:text-[#0F172A] disabled:opacity-20 cursor-pointer"
                          title="Move down"
                        >
                          <ArrowDown className="w-3 h-3" />
                        </button>
                        {!sec.isMandatory && (
                          <button
                            onClick={(e) => { e.stopPropagation(); handleDeleteSection(sec.id); }}
                            className="p-1 text-rose-400 hover:text-rose-600 cursor-pointer"
                            title="Remove optional section"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

            </div>

            {/* Center Pane: Section Content & Template Body Editor */}
            <div className="flex-1 flex flex-col bg-white overflow-hidden">
              
              {/* Section Header Bar */}
              <div className="p-4 border-b border-[#E2E8F0] bg-[#F8FAFC] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="space-y-1 flex-1">
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-[#1D68F2]">
                      Section {currentSection?.order} of {template.sections.length}
                    </span>
                    {currentSection?.isMandatory ? (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                        DTMC Mandatory Section
                      </span>
                    ) : (
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                        Optional / Custom Appendix
                      </span>
                    )}
                  </div>

                  <input
                    type="text"
                    value={currentSection?.title || ''}
                    onChange={(e) => handleUpdateCurrentSectionTitle(e.target.value)}
                    className="text-base font-bold text-[#0F172A] bg-transparent border-b border-transparent hover:border-[#CBD5E1] focus:border-[#1D68F2] focus:outline-none w-full py-0.5"
                  />
                </div>

                <div className="text-right text-xs text-[#64748B]">
                  <div>Words: <span className="font-semibold text-[#0F172A]">{wordCount}</span></div>
                  <div className="text-[11px]">Category: {currentSection?.category}</div>
                </div>
              </div>

              {/* Placeholder Toolbar */}
              <div className="px-4 py-2 border-b border-[#E2E8F0] bg-white flex items-center space-x-2 overflow-x-auto text-xs">
                <span className="text-[11px] font-bold text-[#64748B] shrink-0 uppercase tracking-wider">
                  Insert Tag:
                </span>
                {[
                  '{{PROJECT_NAME}}',
                  '{{CLIENT_ORGANIZATION_NAME}}',
                  '{{CLIENT_CONTACT_NAME}}',
                  '{{ANTICIPATED_START_DATE}}',
                  '{{ANTICIPATED_COMPLETION_DATE}}',
                  '{{ESTIMATED_DURATION}}',
                  '{{CURRENCY}}',
                  '{{FEE_STRUCTURE_TYPE}}'
                ].map(tag => (
                  <button
                    key={tag}
                    onClick={() => handleInsertPlaceholder(tag)}
                    className="px-2 py-0.5 rounded bg-[#F1F5F9] hover:bg-blue-50 hover:text-[#1D68F2] text-[#475569] font-mono text-[10px] transition cursor-pointer border border-[#E2E8F0] shrink-0"
                    title={`Insert ${tag}`}
                  >
                    + {tag}
                  </button>
                ))}
              </div>

              {/* Editor Workspace Container */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                
                {/* SPECIALIZED SUB-EDITOR: GOVERNANCE & RESPONSIBILITIES ROLES TABLE */}
                {isGovernanceSection && (
                  <div className="p-4 bg-[#F8FAFC] border border-[#BFDBFE] rounded-xl space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <ShieldCheck className="w-4 h-4 text-[#1D68F2]" />
                        <span className="text-xs font-bold text-[#0F172A]">Standard DTMC Governance Roles Matrix</span>
                      </div>
                      <button
                        onClick={handleAddRole}
                        className="text-xs font-bold text-[#1D68F2] hover:bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200 transition cursor-pointer flex items-center space-x-1"
                      >
                        <Plus className="w-3 h-3" />
                        <span>Add Role</span>
                      </button>
                    </div>

                    <div className="space-y-2">
                      {(currentSection.governanceRoles || []).map((r, idx) => (
                        <div key={r.id} className="p-3 bg-white rounded-lg border border-[#E2E8F0] space-y-2 text-xs">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <span className="font-mono text-slate-400 font-bold">{idx + 1}.</span>
                              <input
                                type="text"
                                value={r.role}
                                onChange={(e) => handleUpdateRole(r.id, { role: e.target.value })}
                                className="font-bold text-[#0F172A] border-b border-transparent hover:border-slate-300 focus:border-[#1D68F2] focus:outline-none text-xs"
                              />
                              <span className={`text-[9px] px-1.5 py-0.2 rounded font-semibold ${
                                r.role.startsWith('DTMC') ? 'bg-blue-50 text-blue-700' : 'bg-emerald-50 text-emerald-700'
                              }`}>
                                {r.role.startsWith('DTMC') ? 'DTMC Advisory' : 'Client Org'}
                              </span>
                            </div>

                            {r.isOptional && (
                              <button
                                onClick={() => handleRemoveRole(r.id)}
                                className="text-rose-500 hover:text-rose-700 p-1 cursor-pointer"
                                title="Remove role"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>

                          <textarea
                            rows={2}
                            value={r.responsibility}
                            onChange={(e) => handleUpdateRole(r.id, { responsibility: e.target.value })}
                            className="w-full bg-[#F8FAFC] border border-[#CBD5E1] rounded p-2 text-xs text-[#334155] focus:outline-none focus:ring-1 focus:ring-blue-500"
                            placeholder="Describe primary responsibilities..."
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* SPECIALIZED BANNER: SCHEDULE AND ACCEPTANCE LEGAL NOTICE */}
                {isScheduleSection && (
                  <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl space-y-2 text-xs">
                    <div className="flex items-center space-x-2 text-amber-900 font-bold">
                      <AlertTriangle className="w-4 h-4 text-amber-600" />
                      <span>Internal Contract Review Requirement</span>
                    </div>
                    <p className="text-amber-800 leading-relaxed">
                      Acceptance language must be validated against the approved contract or clause library before the SOW is issued. Do not automatically insert a five-business-day acceptance period.
                    </p>
                  </div>
                )}

                {/* SPECIALIZED BANNER: BLANK PRICING POLICY */}
                {isPricingSection && (
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl space-y-2 text-xs">
                    <div className="flex items-center space-x-2 text-blue-950 font-bold">
                      <ShieldCheck className="w-4 h-4 text-[#1D68F2]" />
                      <span>DTMC Mandatory Blank Pricing Policy</span>
                    </div>
                    <p className="text-blue-900 leading-relaxed">
                      All pricing fields, billing rates, and fee summaries must remain blank placeholders in this template. Validation will flag any monetary values ($ / USD) to safeguard commercial pricing confidentiality.
                    </p>
                  </div>
                )}

                {/* Main Content Area */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-[#334155] uppercase tracking-wider">
                    Section Template Body (Markdown / Text)
                  </label>
                  <textarea
                    rows={18}
                    value={currentSection?.content || ''}
                    onChange={(e) => handleUpdateCurrentSectionContent(e.target.value)}
                    className="w-full bg-[#FAFAFA] font-mono text-xs text-[#0F172A] border border-[#CBD5E1] rounded-xl p-4 leading-relaxed focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#1D68F2] shadow-inner"
                    placeholder="Enter section markdown template with {{PLACEHOLDERS}}..."
                  />
                </div>

              </div>

            </div>
          </>
        )}

        {/* VIEW B: COVER PAGE PLACEHOLDERS CONFIGURATION */}
        {activeTab === 'COVER_PAGE' && (
          <div className="flex-1 overflow-y-auto p-8 max-w-4xl mx-auto w-full space-y-6">
            <div className="bg-white p-6 rounded-xl border border-[#E2E8F0] shadow-xs space-y-5">
              <div>
                <h3 className="text-base font-bold text-[#0F172A]">Cover Page Placeholders & Layout</h3>
                <p className="text-xs text-[#64748B]">
                  Configure standard DTMC Master SOW cover page branding and placeholder tags.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#334155] mb-1">Company Branding Header</label>
                  <input
                    type="text"
                    value={template.coverPage.companyBrand}
                    onChange={(e) => {
                      setTemplate({
                        ...template,
                        coverPage: { ...template.coverPage, companyBrand: e.target.value }
                      });
                      setIsDirty(true);
                    }}
                    className="w-full bg-white border border-[#CBD5E1] rounded-lg p-2 text-xs text-[#0F172A] font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#334155] mb-1">Document Title</label>
                  <input
                    type="text"
                    value={template.coverPage.documentTitle}
                    onChange={(e) => {
                      setTemplate({
                        ...template,
                        coverPage: { ...template.coverPage, documentTitle: e.target.value }
                      });
                      setIsDirty(true);
                    }}
                    className="w-full bg-white border border-[#CBD5E1] rounded-lg p-2 text-xs text-[#0F172A] font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#334155] mb-1">Project Name Placeholder</label>
                  <input
                    type="text"
                    value={template.coverPage.projectNamePlaceholder}
                    onChange={(e) => {
                      setTemplate({
                        ...template,
                        coverPage: { ...template.coverPage, projectNamePlaceholder: e.target.value }
                      });
                      setIsDirty(true);
                    }}
                    className="w-full bg-white border border-[#CBD5E1] rounded-lg p-2 text-xs font-mono text-[#0F172A]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#334155] mb-1">Client Org Placeholder</label>
                  <input
                    type="text"
                    value={template.coverPage.clientOrgPlaceholder}
                    onChange={(e) => {
                      setTemplate({
                        ...template,
                        coverPage: { ...template.coverPage, clientOrgPlaceholder: e.target.value }
                      });
                      setIsDirty(true);
                    }}
                    className="w-full bg-white border border-[#CBD5E1] rounded-lg p-2 text-xs font-mono text-[#0F172A]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#334155] mb-1">Client Contact Name</label>
                  <input
                    type="text"
                    value={template.coverPage.clientContactNamePlaceholder}
                    onChange={(e) => {
                      setTemplate({
                        ...template,
                        coverPage: { ...template.coverPage, clientContactNamePlaceholder: e.target.value }
                      });
                      setIsDirty(true);
                    }}
                    className="w-full bg-white border border-[#CBD5E1] rounded-lg p-2 text-xs font-mono text-[#0F172A]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#334155] mb-1">Client Contact Email</label>
                  <input
                    type="text"
                    value={template.coverPage.clientContactEmailPlaceholder}
                    onChange={(e) => {
                      setTemplate({
                        ...template,
                        coverPage: { ...template.coverPage, clientContactEmailPlaceholder: e.target.value }
                      });
                      setIsDirty(true);
                    }}
                    className="w-full bg-white border border-[#CBD5E1] rounded-lg p-2 text-xs font-mono text-[#0F172A]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#334155] mb-1">Issued By Organization</label>
                  <input
                    type="text"
                    value={template.coverPage.issuedByOrganization}
                    onChange={(e) => {
                      setTemplate({
                        ...template,
                        coverPage: { ...template.coverPage, issuedByOrganization: e.target.value }
                      });
                      setIsDirty(true);
                    }}
                    className="w-full bg-white border border-[#CBD5E1] rounded-lg p-2 text-xs text-[#0F172A]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#334155] mb-1">DTMC Contact Email Tag</label>
                  <input
                    type="text"
                    value={template.coverPage.dtmcContactEmailPlaceholder}
                    onChange={(e) => {
                      setTemplate({
                        ...template,
                        coverPage: { ...template.coverPage, dtmcContactEmailPlaceholder: e.target.value }
                      });
                      setIsDirty(true);
                    }}
                    className="w-full bg-white border border-[#CBD5E1] rounded-lg p-2 text-xs font-mono text-[#0F172A]"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* VIEW C: METADATA & SETTINGS */}
        {activeTab === 'METADATA' && (
          <div className="flex-1 overflow-y-auto p-8 max-w-4xl mx-auto w-full space-y-6">
            <div className="bg-white p-6 rounded-xl border border-[#E2E8F0] shadow-xs space-y-5">
              <div>
                <h3 className="text-base font-bold text-[#0F172A]">Template Header & Governance Settings</h3>
                <p className="text-xs text-[#64748B]">
                  Manage template lifecycle status, Word template file attachment, and SharePoint library URL.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-[#334155] mb-1">Template Name</label>
                  <input
                    type="text"
                    value={template.metadata.name}
                    onChange={(e) => {
                      setTemplate({
                        ...template,
                        metadata: { ...template.metadata, name: e.target.value }
                      });
                      setIsDirty(true);
                    }}
                    className="w-full bg-white border border-[#CBD5E1] rounded-lg p-2.5 text-xs text-[#0F172A] font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#334155] mb-1">Description</label>
                  <textarea
                    rows={3}
                    value={template.metadata.description}
                    onChange={(e) => {
                      setTemplate({
                        ...template,
                        metadata: { ...template.metadata, description: e.target.value }
                      });
                      setIsDirty(true);
                    }}
                    className="w-full bg-white border border-[#CBD5E1] rounded-lg p-2.5 text-xs text-[#0F172A]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#334155] mb-1">Template Type</label>
                    <select
                      value={template.metadata.templateType}
                      onChange={(e) => {
                        setTemplate({
                          ...template,
                          metadata: { ...template.metadata, templateType: e.target.value as TemplateType }
                        });
                        setIsDirty(true);
                      }}
                      className="w-full bg-white border border-[#CBD5E1] rounded-lg p-2 text-xs text-[#0F172A] cursor-pointer"
                    >
                      <option value="Master SOW">Master SOW</option>
                      <option value="Fixed-Price Modernization">Fixed-Price Modernization</option>
                      <option value="Time & Materials Consulting">Time & Materials Consulting</option>
                      <option value="Milestone-Based Delivery">Milestone-Based Delivery</option>
                      <option value="Cloud Migration & Security">Cloud Migration & Security</option>
                      <option value="Staff Augmentation">Staff Augmentation</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#334155] mb-1">Version</label>
                    <input
                      type="text"
                      value={template.metadata.version}
                      onChange={(e) => {
                        setTemplate({
                          ...template,
                          metadata: { ...template.metadata, version: e.target.value }
                        });
                        setIsDirty(true);
                      }}
                      className="w-full bg-white border border-[#CBD5E1] rounded-lg p-2 text-xs font-mono text-[#0F172A]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#334155] mb-1">Lifecycle Status</label>
                    <select
                      value={template.metadata.status}
                      onChange={(e) => {
                        setTemplate({
                          ...template,
                          metadata: { ...template.metadata, status: e.target.value as TemplateStatus }
                        });
                        setIsDirty(true);
                      }}
                      className="w-full bg-white border border-[#CBD5E1] rounded-lg p-2 text-xs text-[#0F172A] cursor-pointer"
                    >
                      <option value="Draft">Draft</option>
                      <option value="Under Review">Under Review</option>
                      <option value="Ready for Use">Ready for Use</option>
                      <option value="Archived">Archived</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div>
                    <label className="block text-xs font-semibold text-[#334155] mb-1">Word Template File (.dotx / .docx)</label>
                    <input
                      type="text"
                      value={template.metadata.wordTemplateFile}
                      onChange={(e) => {
                        setTemplate({
                          ...template,
                          metadata: { ...template.metadata, wordTemplateFile: e.target.value }
                        });
                        setIsDirty(true);
                      }}
                      className="w-full bg-white border border-[#CBD5E1] rounded-lg p-2 text-xs font-mono text-[#0F172A]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#334155] mb-1">SharePoint Template URL</label>
                    <input
                      type="text"
                      value={template.metadata.sharePointTemplateUrl}
                      onChange={(e) => {
                        setTemplate({
                          ...template,
                          metadata: { ...template.metadata, sharePointTemplateUrl: e.target.value }
                        });
                        setIsDirty(true);
                      }}
                      className="w-full bg-white border border-[#CBD5E1] rounded-lg p-2 text-xs font-mono text-[#0F172A]"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* Unsaved Changes Confirmation Modal */}
      {showUnsavedModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white border border-[#E2E8F0] rounded-xl w-full max-w-md p-6 space-y-4 shadow-2xl">
            <div className="flex items-center space-x-3 text-amber-600">
              <AlertCircle className="w-6 h-6" />
              <h3 className="text-base font-bold text-[#0F172A]">Unsaved Changes</h3>
            </div>
            <p className="text-xs text-[#475569] leading-relaxed">
              You have unsaved edits in this SOW template. If you leave now, your recent changes will be lost.
            </p>
            <div className="flex items-center justify-end space-x-3 pt-2">
              <button
                onClick={() => setShowUnsavedModal(false)}
                className="px-4 py-2 rounded-lg text-xs font-semibold text-[#475569] hover:bg-slate-100 transition cursor-pointer"
              >
                Keep Editing
              </button>
              <button
                onClick={() => { setShowUnsavedModal(false); onCancel(); }}
                className="px-4 py-2 rounded-lg text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white transition cursor-pointer shadow-xs"
              >
                Discard Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Validation Report Modal */}
      {showValidationModal && validationResult && (
        <TemplateValidationModal
          isOpen={showValidationModal}
          onClose={() => setShowValidationModal(false)}
          result={validationResult}
          templateName={template.metadata.name}
          onMarkReadyForUse={handleMarkReadyForUse}
          onGoToSection={(secId) => {
            setSelectedSectionId(secId);
            setActiveTab('SECTIONS');
          }}
        />
      )}

    </div>
  );
};
