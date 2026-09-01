import React, { useState } from 'react';
import { 
  FileText, 
  CheckCircle2, 
  RefreshCw, 
  Sparkles, 
  Edit3, 
  ShieldCheck, 
  ChevronLeft, 
  ChevronRight, 
  BookOpen, 
  AlertTriangle,
  Lock,
  Clock,
  Send,
  Eye,
  Check,
  Plus,
  ExternalLink,
  MessageSquare,
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Link2,
  CornerUpLeft,
  CornerUpRight,
  FileCode,
  FileSpreadsheet,
  ChevronDown,
  Info,
  Layers,
  CircleCheck,
  Trash2
} from 'lucide-react';
import { SOWProject, SOWSection, SourceDocument, DetailedSourceCitation, SectionComment, UploadedProjectDocument } from '../types/quill';
import { generateSectionContent, validatePricingIsBlank } from '../services/aiGeneratorService';

interface SOWAuthoringWorkspaceProps {
  project: SOWProject;
  activeSectionId: string;
  setActiveSectionId: (id: string) => void;
  onUpdateSection: (updatedSection: SOWSection) => void;
  onUpdateProject: (updatedProject: SOWProject) => void;
  onOpenSourcesDrawer: (section: SOWSection) => void;
  onOpenExportModal: () => void;
  onNavigateStep?: (step: number) => void;
}

export const SOWAuthoringWorkspace: React.FC<SOWAuthoringWorkspaceProps> = ({
  project,
  activeSectionId,
  setActiveSectionId,
  onUpdateSection,
  onUpdateProject,
  onOpenSourcesDrawer,
  onOpenExportModal,
  onNavigateStep,
}) => {
  const sections = project.sections.sort((a, b) => a.order - b.order);
  const currentSection = sections.find(s => s.id === activeSectionId) || sections[1] || sections[0];

  // Editor states
  const [activeTab, setActiveTab] = useState<'editor' | 'history'>('editor');
  const [isEditingMode, setIsEditingMode] = useState(false);
  const [editorText, setEditorText] = useState(currentSection?.content || '');
  const [isRegenerating, setIsRegenerating] = useState(false);
  
  // AI Assistant input
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiStatusMsg, setAiStatusMsg] = useState<string | null>(null);

  // Toast notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Sync state on section change
  React.useEffect(() => {
    if (currentSection) {
      setEditorText(currentSection.content);
      setIsEditingMode(false);
      setAiPrompt('');
      setAiStatusMsg(null);
    }
  }, [currentSection?.id]);

  if (!currentSection) {
    return <div className="p-8 text-center text-slate-500">No active section found.</div>;
  }

  // Word count helper
  const wordCount = editorText.trim().split(/\s+/).filter(Boolean).length;

  // Counts for document progress
  const approvedCount = sections.filter(s => s.status === 'Approved').length;
  const inProgressCount = sections.filter(s => s.status === 'Review').length;
  const pendingCount = sections.filter(s => s.status === 'Pending').length;
  const lockedCount = sections.filter(s => s.isPricingSection || s.category === 'Terms').length;
  const progressPercent = Math.round((approvedCount / sections.length) * 100);

  // Handlers
  const handleSaveText = () => {
    const updated: SOWSection = {
      ...currentSection,
      content: editorText,
      lastEditedAt: new Date().toISOString(),
      lastEditedBy: project.ownerName,
      version: Number((currentSection.version + 0.1).toFixed(1)),
    };
    onUpdateSection(updated);
    setIsEditingMode(false);
    showToast(`Saved version ${updated.version}`);
  };

  const handleApproveCurrentSection = () => {
    const isAlreadyApproved = currentSection.status === 'Approved';
    const updated: SOWSection = {
      ...currentSection,
      status: isAlreadyApproved ? 'Review' : 'Approved',
      approvedBy: isAlreadyApproved ? undefined : 'Arjun Rao',
      approvedAt: isAlreadyApproved ? undefined : new Date().toISOString(),
    };
    onUpdateSection(updated);
    showToast(isAlreadyApproved ? 'Section status moved to Review' : 'Section Approved by Arjun Rao');
  };

  const handleRunAiAction = async (instruction: string) => {
    setIsRegenerating(true);
    setAiStatusMsg(`Applying AI action: "${instruction}"...`);
    try {
      const result = await generateSectionContent(
        currentSection.title,
        currentSection.category,
        project.clientName,
        project.meetingNotes,
        instruction + "\nExisting Content:\n" + editorText
      );

      const updated: SOWSection = {
        ...currentSection,
        content: result.content,
        confidenceScore: result.confidenceScore,
        groundedSources: result.groundedSources,
        version: Number((currentSection.version + 0.1).toFixed(1)),
        regenerationPrompt: instruction,
      };

      setEditorText(result.content);
      onUpdateSection(updated);
      setAiStatusMsg(`Updated section successfully based on reference documents.`);
      setAiPrompt('');
      showToast(`AI content updated (v${updated.version})`);
    } catch (e) {
      setAiStatusMsg('Failed to run AI assistance.');
    } finally {
      setIsRegenerating(false);
    }
  };

  const handleAddNewSection = () => {
    const nextOrder = sections.length + 1;
    const newSec: SOWSection = {
      id: `SEC-ACME-${String(nextOrder).padStart(3, '0')}`,
      projectId: project.id,
      order: nextOrder,
      title: `${nextOrder}. Custom Scope Addendum`,
      category: 'Scope',
      content: `### ${nextOrder}. Custom Scope Addendum\n\nAdditional client requirements and architectural specifications.`,
      status: 'Pending',
      isMandatory: false,
      isPricingSection: false,
      groundedSources: [],
      version: 1,
      lastEditedBy: project.ownerName,
      lastEditedAt: new Date().toISOString(),
      confidenceScore: 90
    };
    const updatedSections = [...project.sections, newSec];
    onUpdateProject({ ...project, sections: updatedSections });
    setActiveSectionId(newSec.id);
    showToast(`Added Section ${nextOrder}`);
  };

  // Detailed sources strictly derived from the PM-uploaded intake documents for this SOW
  const projectUploadedDocs: UploadedProjectDocument[] = project.uploadedDocuments || [];
  
  // Find documents associated with the current section or project
  const relevantUploadedDocs = projectUploadedDocs.filter(doc => {
    if (currentSection.uploadedDocumentIds && currentSection.uploadedDocumentIds.length > 0) {
      return currentSection.uploadedDocumentIds.includes(doc.id);
    }
    return true;
  });

  const activeUploadedDocs = relevantUploadedDocs.length > 0 ? relevantUploadedDocs : projectUploadedDocs;

  const defaultDetailedSources: DetailedSourceCitation[] = activeUploadedDocs.map((doc, idx) => ({
    id: `DS-${doc.id}-${idx}`,
    documentId: doc.id,
    fileName: doc.fileName,
    fileType: doc.fileType,
    category: doc.category,
    section: doc.sectionReference || currentSection.title.split(' ')[0] || `Section ${currentSection.order}`,
    page: doc.pageOrTimestamp || (doc.fileType === 'pdf' ? `Page ${idx + 2}` : `Min ${10 + idx * 5}:00`),
    snippet: doc.snippet
  }));

  return (
    <div className="flex-1 flex flex-col bg-[#F8FAFC] min-h-screen">
      
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-4 right-6 z-50 bg-[#0F172A] text-white px-4 py-2.5 rounded-lg shadow-xl text-xs font-medium flex items-center space-x-2 animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Sub-Header / SOW Bar */}
      <div className="bg-white border-b border-[#E2E8F0] px-6 py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3.5">
          <div className="w-10 h-10 rounded-lg bg-[#F1F5F9] border border-[#E2E8F0] flex items-center justify-center text-[#475569]">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2.5">
              <h1 className="text-lg font-bold text-[#0F172A] tracking-tight">
                {currentSection.title.replace(/^[0-9.]+\s*/, '')}
              </h1>
              <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-[#DCFCE7] text-[#15803D] border border-[#BBF7D0]">
                {currentSection.status}
              </span>
            </div>
            <div className="flex items-center space-x-2 text-xs text-[#64748B] mt-0.5">
              <span>Last saved by you 2 mins ago</span>
              <span>•</span>
              <span>Version {currentSection.version}</span>
            </div>
          </div>
        </div>

        {/* Right SOW Action Bar */}
        <div className="flex items-center space-x-2.5">
          <div className="hidden md:flex items-center space-x-2 mr-2">
            <span className="text-xs text-[#64748B]">Section status</span>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#DCFCE7] text-[#15803D]">
              {currentSection.status}
            </span>
          </div>

          <button
            onClick={() => handleRunAiAction("Regenerate section with maximum grounding clarity and accurate deliverables.")}
            disabled={isRegenerating}
            className="flex items-center space-x-1.5 bg-white hover:bg-slate-50 text-[#334155] border border-[#CBD5E1] px-3.5 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRegenerating ? 'animate-spin text-blue-600' : 'text-[#64748B]'}`} />
            <span>{isRegenerating ? 'Regenerating...' : 'Regenerate'}</span>
          </button>

          <button
            onClick={() => {
              if (isEditingMode) {
                handleSaveText();
              } else {
                setIsEditingMode(true);
              }
            }}
            className={`flex items-center space-x-1.5 border px-3.5 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
              isEditingMode 
                ? 'bg-blue-50 border-blue-300 text-blue-700'
                : 'bg-white hover:bg-slate-50 text-[#2563EB] border-[#CBD5E1]'
            }`}
          >
            <Edit3 className="w-3.5 h-3.5 text-[#2563EB]" />
            <span>{isEditingMode ? 'Save Text' : 'Edit'}</span>
          </button>

          <button
            onClick={handleApproveCurrentSection}
            className={`flex items-center space-x-1.5 px-4 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer shadow-sm ${
              currentSection.status === 'Approved'
                ? 'bg-[#15803D] hover:bg-[#166534] text-white'
                : 'bg-[#1D68F2] hover:bg-[#1557d0] text-white'
            }`}
          >
            <Check className="w-4 h-4 stroke-[2.5]" />
            <span>{currentSection.status === 'Approved' ? 'Approved' : 'Approve'}</span>
          </button>
        </div>
      </div>

      {/* Main 3-Column Content Body */}
      <div className="flex-1 p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* ============================================================ */}
        {/* COLUMN 1: DOCUMENT OUTLINE (Width ~260px / 3 cols) */}
        {/* ============================================================ */}
        <div className="lg:col-span-3 space-y-4">
          <div className="bg-white rounded-xl border border-[#E2E8F0] p-4 shadow-sm space-y-4">
            
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-1.5">
                <h3 className="text-xs font-bold text-[#0F172A] tracking-tight">
                  Document Outline
                </h3>
                <CircleCheck className="w-3.5 h-3.5 text-[#15803D]" />
              </div>
            </div>

            {/* List of Numbered Sections */}
            <div className="space-y-1">
              {sections.map((sec) => {
                const isSelected = sec.id === currentSection.id;
                const isApproved = sec.status === 'Approved';
                const isLocked = sec.isPricingSection || sec.category === 'Terms';

                return (
                  <button
                    key={sec.id}
                    onClick={() => setActiveSectionId(sec.id)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium flex items-center justify-between transition cursor-pointer ${
                      isSelected
                        ? 'bg-[#EFF6FF] text-[#1D68F2] font-bold border border-[#BFDBFE]'
                        : 'text-[#334155] hover:bg-[#F8FAFC] hover:text-[#0F172A] border border-transparent'
                    }`}
                  >
                    <span className="truncate pr-2">{sec.title}</span>

                    {/* Status Indicator Icon */}
                    <div className="shrink-0 flex items-center">
                      {isSelected ? (
                        <div className="w-4 h-4 rounded-full bg-[#15803D] text-white flex items-center justify-center">
                          <Check className="w-2.5 h-2.5 stroke-[3]" />
                        </div>
                      ) : isApproved ? (
                        <div className="w-3.5 h-3.5 rounded-full bg-[#DCFCE7] text-[#15803D] flex items-center justify-center">
                          <Check className="w-2.5 h-2.5 stroke-[3]" />
                        </div>
                      ) : isLocked ? (
                        <Lock className="w-3 h-3 text-[#94A3B8]" />
                      ) : sec.status === 'Review' ? (
                        <div className="w-2 h-2 rounded-full bg-amber-400" />
                      ) : (
                        <Info className="w-3 h-3 text-[#94A3B8]" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* + Add Section Button */}
            <button
              onClick={handleAddNewSection}
              className="w-full flex items-center justify-center space-x-1.5 py-2 px-3 border border-[#CBD5E1] rounded-lg text-xs font-semibold text-[#1D68F2] hover:bg-blue-50/60 transition cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Section</span>
            </button>
          </div>

          {/* Document Progress Card */}
          <div className="bg-white rounded-xl border border-[#E2E8F0] p-4 shadow-sm space-y-3">
            <h4 className="text-xs font-bold text-[#0F172A]">Document Progress</h4>
            
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-[#334155]">{approvedCount} / {sections.length} sections approved</span>
                <span className="font-bold text-[#64748B]">{progressPercent}%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-[#E2E8F0] overflow-hidden">
                <div 
                  className="h-full bg-[#1D68F2] rounded-full transition-all duration-500" 
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            {/* Status Breakdown Legend */}
            <div className="pt-2 border-t border-[#F1F5F9] space-y-1.5 text-xs text-[#475569]">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 rounded-full bg-[#15803D]" />
                  <span>Approved</span>
                </div>
                <span className="font-semibold text-[#0F172A]">{approvedCount}</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 rounded-full bg-amber-400" />
                  <span>In Progress</span>
                </div>
                <span className="font-semibold text-[#0F172A]">{inProgressCount}</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 rounded-full bg-slate-300" />
                  <span>Pending</span>
                </div>
                <span className="font-semibold text-[#0F172A]">{pendingCount}</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Lock className="w-2.5 h-2.5 text-slate-400" />
                  <span>Locked</span>
                </div>
                <span className="font-semibold text-[#0F172A]">{lockedCount}</span>
              </div>
            </div>
          </div>

        </div>

        {/* ============================================================ */}
        {/* COLUMN 2: RICH EDITOR & AI WORKSPACE (Center 6 cols) */}
        {/* ============================================================ */}
        <div className="lg:col-span-6 bg-white rounded-xl border border-[#E2E8F0] shadow-sm flex flex-col min-h-[720px] overflow-hidden">
          
          {/* Editor Header Tab Bar */}
          <div className="px-5 pt-3 border-b border-[#E2E8F0] flex items-center space-x-6">
            <button
              onClick={() => setActiveTab('editor')}
              className={`pb-2.5 text-xs font-bold transition cursor-pointer border-b-2 ${
                activeTab === 'editor'
                  ? 'text-[#1D68F2] border-[#1D68F2]'
                  : 'text-[#64748B] border-transparent hover:text-[#0F172A]'
              }`}
            >
              Editor
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`pb-2.5 text-xs font-semibold transition cursor-pointer border-b-2 ${
                activeTab === 'history'
                  ? 'text-[#1D68F2] border-[#1D68F2]'
                  : 'text-[#64748B] border-transparent hover:text-[#0F172A]'
              }`}
            >
              History
            </button>
          </div>

          {/* Formatting Toolbar */}
          <div className="px-4 py-2 bg-[#F8FAFC] border-b border-[#E2E8F0] flex items-center justify-between flex-wrap gap-1 text-[#475569]">
            <div className="flex items-center space-x-1">
              <button className="flex items-center space-x-1 px-2 py-1 hover:bg-slate-200/70 rounded text-xs font-semibold text-[#334155]">
                <span>Paragraph</span>
                <ChevronDown className="w-3 h-3 text-[#64748B]" />
              </button>

              <div className="h-4 w-px bg-[#CBD5E1] mx-1" />

              <button className="p-1.5 hover:bg-slate-200/70 rounded text-[#334155]" title="Bold">
                <Bold className="w-3.5 h-3.5" />
              </button>
              <button className="p-1.5 hover:bg-slate-200/70 rounded text-[#334155]" title="Italic">
                <Italic className="w-3.5 h-3.5" />
              </button>
              <button className="p-1.5 hover:bg-slate-200/70 rounded text-[#334155]" title="Underline">
                <Underline className="w-3.5 h-3.5" />
              </button>

              <div className="h-4 w-px bg-[#CBD5E1] mx-1" />

              <button className="p-1.5 hover:bg-slate-200/70 rounded text-[#334155]" title="Bullet List">
                <List className="w-3.5 h-3.5" />
              </button>
              <button className="p-1.5 hover:bg-slate-200/70 rounded text-[#334155]" title="Numbered List">
                <ListOrdered className="w-3.5 h-3.5" />
              </button>

              <div className="h-4 w-px bg-[#CBD5E1] mx-1" />

              <button className="p-1.5 hover:bg-slate-200/70 rounded text-[#334155]" title="Align Left">
                <AlignLeft className="w-3.5 h-3.5" />
              </button>
              <button className="p-1.5 hover:bg-slate-200/70 rounded text-[#334155]" title="Align Center">
                <AlignCenter className="w-3.5 h-3.5" />
              </button>

              <div className="h-4 w-px bg-[#CBD5E1] mx-1" />

              <button className="p-1.5 hover:bg-slate-200/70 rounded text-[#334155]" title="Insert Link">
                <Link2 className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="flex items-center space-x-1">
              <button className="p-1.5 hover:bg-slate-200/70 rounded text-[#64748B]" title="Undo">
                <CornerUpLeft className="w-3.5 h-3.5" />
              </button>
              <button className="p-1.5 hover:bg-slate-200/70 rounded text-[#64748B]" title="Redo">
                <CornerUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Document Content Canvas */}
          <div className="flex-1 p-8 overflow-y-auto space-y-5">
            {activeTab === 'history' ? (
              <div className="space-y-4">
                <h4 className="text-xs font-bold text-[#0F172A] uppercase tracking-wider">Revision History for {currentSection.title}</h4>
                <div className="space-y-2 text-xs">
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between">
                    <div>
                      <span className="font-bold text-[#0F172A]">Version {currentSection.version}</span>
                      <span className="text-[#64748B] ml-2">by {currentSection.lastEditedBy}</span>
                    </div>
                    <span className="text-[#94A3B8] font-mono">Current Active</span>
                  </div>
                  <div className="p-3 bg-white border border-slate-200 rounded-lg flex items-center justify-between">
                    <div>
                      <span className="font-semibold text-[#334155]">Version 2.0</span>
                      <span className="text-[#64748B] ml-2">Approved by Arjun Rao</span>
                    </div>
                    <button 
                      onClick={() => showToast('Restored previous snapshot')}
                      className="text-xs text-[#1D68F2] hover:underline"
                    >
                      Restore
                    </button>
                  </div>
                </div>
              </div>
            ) : isEditingMode ? (
              <textarea
                rows={18}
                value={editorText}
                onChange={(e) => setEditorText(e.target.value)}
                className="w-full h-full p-4 text-sm font-sans text-[#0F172A] border border-[#CBD5E1] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#1D68F2] leading-relaxed"
                placeholder="Type or format section prose..."
              />
            ) : (
              <div className="space-y-5 text-[#334155] text-sm leading-relaxed">
                
                {/* Section Title */}
                <h2 className="text-lg font-bold text-[#0F172A]">
                  {currentSection.title}
                </h2>

                {/* Render Content Blocks */}
                {editorText.split('\n\n').map((block, bIdx) => {
                  if (block.startsWith('### 2.1 ') || block.startsWith('2.1 ') || block.startsWith('### In-Scope') || block.startsWith('### 2.1 In-Scope')) {
                    return (
                      <h3 key={bIdx} className="text-base font-bold text-[#0F172A] pt-2">
                        {block.replace(/###\s*/, '')}
                      </h3>
                    );
                  }

                  if (block.startsWith('### 2.2 ') || block.startsWith('2.2 ') || block.startsWith('### Out of Scope') || block.startsWith('### 2.2 Out of Scope')) {
                    return (
                      <h3 key={bIdx} className="text-base font-bold text-[#0F172A] pt-2">
                        {block.replace(/###\s*/, '')}
                      </h3>
                    );
                  }

                  if (block.startsWith('### ')) {
                    return (
                      <h3 key={bIdx} className="text-base font-bold text-[#0F172A] pt-2">
                        {block.replace('### ', '')}
                      </h3>
                    );
                  }

                  if (block.startsWith('* ') || block.startsWith('- ')) {
                    const items = block.split('\n').map(i => i.replace(/^[\*\-]\s*/, ''));
                    return (
                      <ul key={bIdx} className="space-y-1.5 pl-5 list-disc text-[#334155]">
                        {items.map((item, iIdx) => (
                          <li key={iIdx}>{item}</li>
                        ))}
                      </ul>
                    );
                  }

                  return (
                    <p key={bIdx} className="text-[#334155] leading-relaxed">
                      {block}
                    </p>
                  );
                })}
              </div>
            )}
          </div>

          {/* Editor Status Bar */}
          <div className="px-5 py-3 bg-[#F8FAFC] border-t border-[#E2E8F0] flex items-center justify-between text-xs text-[#64748B]">
            <div className="flex items-center space-x-2">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-500" />
              <span>Version {currentSection.version} • Last edited by {currentSection.lastEditedBy || project.ownerName}</span>
            </div>
            <span className="font-semibold text-[#475569]">Words: {wordCount}</span>
          </div>

        </div>

        {/* ============================================================ */}
        {/* COLUMN 3: SOURCES, SECTION METADATA & COMMENTS (Right 3 cols) */}
        {/* ============================================================ */}
        <div className="lg:col-span-3 space-y-4">
          
          {/* Card 1: Sources Used */}
          <div className="bg-white rounded-xl border border-[#E2E8F0] p-4 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-1.5">
                <h4 className="text-xs font-bold text-[#0F172A]">Sources Used</h4>
                <span className="w-4 h-4 rounded-full bg-[#DBEAFE] text-[#1D68F2] text-[10px] font-bold flex items-center justify-center">
                  {defaultDetailedSources.length}
                </span>
              </div>
              <button 
                onClick={() => onOpenSourcesDrawer(currentSection)}
                className="text-xs font-semibold text-[#1D68F2] hover:underline cursor-pointer"
              >
                View all
              </button>
            </div>

            {/* List of PM Uploaded Intake Sources for this SOW */}
            <div className="space-y-2.5">
              {defaultDetailedSources.length === 0 ? (
                <div className="p-3 bg-[#F8FAFC] rounded-lg border border-[#E2E8F0] text-center text-xs text-[#64748B]">
                  No intake documents attached to this SOW yet.
                </div>
              ) : (
                defaultDetailedSources.map((source, sIdx) => {
                  const isPdf = source.fileType === 'pdf';
                  return (
                    <div 
                      key={source.id} 
                      onClick={() => onOpenSourcesDrawer(currentSection)}
                      className="flex items-start justify-between p-2 rounded-lg border border-[#F1F5F9] hover:border-[#BFDBFE] hover:bg-[#F8FAFC] transition cursor-pointer group shadow-2xs"
                      title={source.snippet || source.fileName}
                    >
                      <div className="flex items-start space-x-2 min-w-0 flex-1">
                        <span className="text-xs font-bold text-[#94A3B8] mt-0.5 shrink-0">{sIdx + 1}.</span>
                        <div className="w-5 h-5 rounded flex items-center justify-center shrink-0 mt-0.5">
                          {isPdf ? (
                            <div className="w-5 h-5 rounded bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center text-[7px] font-bold">
                              PDF
                            </div>
                          ) : source.category === 'Meeting Transcription' ? (
                            <div className="w-5 h-5 rounded bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center text-[7px] font-bold">
                              TRX
                            </div>
                          ) : source.category === 'SRS Document' ? (
                            <div className="w-5 h-5 rounded bg-purple-50 border border-purple-200 text-purple-600 flex items-center justify-center text-[7px] font-bold">
                              SRS
                            </div>
                          ) : (
                            <div className="w-5 h-5 rounded bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center text-[7px] font-bold">
                              DOC
                            </div>
                          )}
                        </div>
                        <div className="space-y-1 min-w-0 flex-1">
                          <div className="flex items-center space-x-1.5 flex-wrap">
                            <span className="text-xs font-semibold text-[#0F172A] group-hover:text-[#1D68F2] leading-tight truncate">
                              {source.fileName}
                            </span>
                          </div>
                          
                          <div className="flex items-center space-x-1.5 flex-wrap text-[10px]">
                            {source.category && (
                              <span className={`px-1.5 py-0.2 rounded font-medium ${
                                source.category === 'Meeting Transcription'
                                  ? 'bg-amber-50 text-amber-700 border border-amber-200'
                                  : source.category === 'Requirement Clarification'
                                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                  : source.category === 'SRS Document'
                                  ? 'bg-purple-50 text-purple-700 border border-purple-200'
                                  : 'bg-blue-50 text-blue-700 border border-blue-200'
                              }`}>
                                {source.category}
                              </span>
                            )}
                            <span className="text-[#64748B]">
                              {source.section} • {source.page}
                            </span>
                          </div>
                        </div>
                      </div>

                      <ExternalLink className="w-3 h-3 text-[#94A3B8] group-hover:text-[#1D68F2] shrink-0 mt-1 ml-1" />
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Card 2: Section Information */}
          <div className="bg-white rounded-xl border border-[#E2E8F0] p-4 shadow-sm space-y-3">
            <h4 className="text-xs font-bold text-[#0F172A]">Section Information</h4>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-[#64748B]">Status</span>
                <span className="px-2 py-0.5 rounded-full bg-[#DCFCE7] text-[#15803D] font-semibold text-[11px]">
                  {currentSection.status}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-[#64748B]">Approved by</span>
                <span className="font-semibold text-[#0F172A]">{currentSection.approvedBy || "Arjun Rao"}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-[#64748B]">Approved on</span>
                <span className="font-medium text-[#334155]">Aug 28, 2025 11:32 AM</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-[#64748B]">Version</span>
                <span className="font-semibold text-[#0F172A]">{currentSection.version}</span>
              </div>
            </div>

            <div className="pt-1">
              <button 
                onClick={() => setActiveTab('history')}
                className="text-xs font-semibold text-[#1D68F2] hover:underline cursor-pointer"
              >
                View version history
              </button>
            </div>
          </div>

        </div>

      </div>

      {/* ============================================================ */}
      {/* BOTTOM STEPPER & FOOTER ACTION BAR */}
      {/* ============================================================ */}
      <div className="sticky bottom-0 z-30 bg-white border-t border-[#E2E8F0] px-8 py-3.5 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-lg">
        
        {/* Stepper Navigation */}
        <div className="flex items-center space-x-2 sm:space-x-4 overflow-x-auto text-xs font-medium text-[#64748B]">
          
          {/* Step 1 */}
          <button 
            onClick={() => onNavigateStep?.(1)}
            className="flex items-center space-x-1.5 hover:text-[#0F172A] transition cursor-pointer shrink-0"
          >
            <div className="w-5 h-5 rounded-full bg-[#15803D] text-white flex items-center justify-center">
              <Check className="w-3 h-3 stroke-[3]" />
            </div>
            <span>Create Project</span>
          </button>

          <span className="text-[#CBD5E1]">—</span>

          {/* Step 2 */}
          <button 
            onClick={() => onNavigateStep?.(2)}
            className="flex items-center space-x-1.5 hover:text-[#0F172A] transition cursor-pointer shrink-0"
          >
            <div className="w-5 h-5 rounded-full bg-[#15803D] text-white flex items-center justify-center">
              <Check className="w-3 h-3 stroke-[3]" />
            </div>
            <span>Framework</span>
          </button>

          <span className="text-[#CBD5E1]">—</span>

          {/* Step 3 (Active) */}
          <div className="flex items-center space-x-1.5 font-bold text-[#1D68F2] shrink-0">
            <div className="w-5 h-5 rounded-full bg-[#1D68F2] text-white flex items-center justify-center text-[11px] font-bold">
              3
            </div>
            <span>Sections</span>
          </div>

          <span className="text-[#CBD5E1]">—</span>

          {/* Step 4 */}
          <button 
            onClick={() => onNavigateStep?.(4)}
            className="flex items-center space-x-1.5 hover:text-[#0F172A] transition cursor-pointer shrink-0"
          >
            <div className="w-5 h-5 rounded-full bg-[#F1F5F9] text-[#64748B] border border-[#CBD5E1] flex items-center justify-center text-[11px] font-semibold">
              4
            </div>
            <span>Review</span>
          </button>

          <span className="text-[#CBD5E1]">—</span>

          {/* Step 5 */}
          <button 
            onClick={onOpenExportModal}
            className="flex items-center space-x-1.5 hover:text-[#0F172A] transition cursor-pointer shrink-0"
          >
            <div className="w-5 h-5 rounded-full bg-[#F1F5F9] text-[#64748B] border border-[#CBD5E1] flex items-center justify-center text-[11px] font-semibold">
              5
            </div>
            <span>Export</span>
          </button>

        </div>

        {/* Action Buttons: Save Draft & Preview Document */}
        <div className="flex items-center space-x-3 shrink-0">
          <button
            onClick={() => {
              handleSaveText();
              showToast("Draft saved successfully to SharePoint");
            }}
            className="px-4 py-2 bg-white hover:bg-slate-50 text-[#334155] border border-[#CBD5E1] text-xs font-semibold rounded-lg transition cursor-pointer"
          >
            Save Draft
          </button>

          <button
            onClick={onOpenExportModal}
            className="flex items-center space-x-2 px-4 py-2 bg-[#1D68F2] hover:bg-[#1557d0] text-white text-xs font-bold rounded-lg shadow-md shadow-blue-500/20 transition active:scale-95 cursor-pointer"
          >
            <FileText className="w-4 h-4" />
            <span>Preview Document</span>
          </button>
        </div>

      </div>

    </div>
  );
};
