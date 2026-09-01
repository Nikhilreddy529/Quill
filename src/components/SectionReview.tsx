import React, { useState } from 'react';
import { 
  CheckCircle2, 
  RefreshCw, 
  Sparkles, 
  Edit3, 
  ShieldCheck, 
  FileText, 
  ChevronLeft, 
  ChevronRight, 
  BookOpen, 
  AlertTriangle,
  Lock,
  Clock,
  Send,
  Eye,
  Check,
  GitBranch,
  Cpu,
  ShieldAlert
} from 'lucide-react';
import { SOWProject, SOWSection, SourceDocument } from '../types/quill';
import { generateSectionContent, validatePricingIsBlank } from '../services/aiGeneratorService';
import { sectionDraftingService } from '../services/sectionDraftingService';
import { concurrencyAndAuditService } from '../services/concurrencyAndAuditService';
import { DiffViewerModal } from './section/DiffViewerModal';
import { TokenBudgetDrawer } from './section/TokenBudgetDrawer';
import { UnsupportedClaimsBanner } from './section/UnsupportedClaimsBanner';

interface SectionReviewProps {
  project: SOWProject;
  activeSectionId: string;
  setActiveSectionId: (id: string) => void;
  onUpdateSection: (updatedSection: SOWSection) => void;
  onOpenSourcesDrawer: (section: SOWSection) => void;
  onOpenExportModal: () => void;
}

export const SectionReview: React.FC<SectionReviewProps> = ({
  project,
  activeSectionId,
  setActiveSectionId,
  onUpdateSection,
  onOpenSourcesDrawer,
  onOpenExportModal,
}) => {
  const sections = project.sections.sort((a, b) => a.order - b.order);
  const currentSection = sections.find(s => s.id === activeSectionId) || sections[0];
  const currentIndex = sections.findIndex(s => s.id === currentSection.id);

  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(currentSection?.content || '');
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [critiquePrompt, setCritiquePrompt] = useState('');
  const [showCritiqueInput, setShowCritiqueInput] = useState(false);

  // Sprint 2 Modals
  const [showDiffModal, setShowDiffModal] = useState(false);
  const [showTokenBudget, setShowTokenBudget] = useState(false);

  // Sync state on section switch
  React.useEffect(() => {
    if (currentSection) {
      setEditedContent(currentSection.content);
      setIsEditing(false);
      setShowCritiqueInput(false);
      setCritiquePrompt('');
    }
  }, [currentSection?.id]);

  if (!currentSection) {
    return <div className="p-8 text-center text-slate-400">No sections found in project.</div>;
  }

  // QTK-023: Detect unsupported claims on active section content
  const detectedClaims = currentSection.unsupportedClaims && currentSection.unsupportedClaims.length > 0 
    ? currentSection.unsupportedClaims 
    : sectionDraftingService.detectUnsupportedClaims(currentSection.content, currentSection.category, project.clientName);

  // QTK-021: Build token budget
  const tokenBudget = currentSection.tokenBudget || sectionDraftingService.buildTokenBudget(currentSection, project);

  const handleSaveEdit = () => {
    // QTK-029: Invalidate approval and create new version when approved content is edited
    const result = concurrencyAndAuditService.handleSectionEdit(
      currentSection,
      editedContent,
      project.ownerName
    );

    onUpdateSection(result.updatedSection);
    setIsEditing(false);
  };

  const handleApprove = () => {
    const updated: SOWSection = {
      ...currentSection,
      status: 'Approved',
      approvedBy: project.ownerName,
      approvedAt: new Date().toISOString(),
      requiresReapproval: false,
      validationNotes: [...(currentSection.validationNotes || []), "Human author sign-off completed"],
    };
    onUpdateSection(updated);

    // Auto advance to next section if available
    if (currentIndex < sections.length - 1) {
      setActiveSectionId(sections[currentIndex + 1].id);
    }
  };

  const handleRegenerate = async () => {
    setIsRegenerating(true);
    try {
      const result = await generateSectionContent(
        currentSection.title,
        currentSection.category,
        project.clientName,
        project.meetingNotes,
        critiquePrompt
      );

      const claims = sectionDraftingService.detectUnsupportedClaims(result.content, currentSection.category, project.clientName);

      const updated: SOWSection = {
        ...currentSection,
        content: result.content,
        previousContentSnapshot: currentSection.content,
        status: 'Review',
        confidenceScore: result.confidenceScore,
        groundedSources: result.groundedSources,
        version: Number((currentSection.version + 0.1).toFixed(1)),
        regenerationPrompt: critiquePrompt,
        validationNotes: result.validationNotes,
        unsupportedClaims: claims,
        requiresReapproval: false,
        lastEditedAt: new Date().toISOString(),
        lastEditedBy: 'Azure OpenAI GPT-4o'
      };

      setEditedContent(result.content);
      onUpdateSection(updated);
      setShowCritiqueInput(false);
      setCritiquePrompt('');
    } finally {
      setIsRegenerating(false);
    }
  };

  const allSectionsApproved = sections.every(s => s.status === 'Approved' && !s.requiresReapproval);

  return (
    <div className="space-y-6">
      
      {/* Top Section Navigator Banner */}
      <div className="bg-white border border-[#E2E8F0] rounded-xl p-5 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          
          <div className="flex items-center space-x-3.5">
            <div className="w-10 h-10 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-[#1D68F2] font-bold text-lg">
              {currentSection.order}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <div className="text-[#1D68F2] text-xs font-medium hidden sm:inline">Currently Reviewing:</div>
                <h2 className="text-xl font-bold text-[#0F172A] tracking-tight">{currentSection.title}</h2>
                
                {currentSection.requiresReapproval ? (
                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full border bg-amber-50 text-amber-800 border-amber-300 flex items-center space-x-1">
                    <AlertTriangle className="w-3 h-3 text-amber-600" />
                    <span>Re-Approval Required (QTK-029)</span>
                  </span>
                ) : (
                  <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                    currentSection.status === 'Approved' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                    currentSection.status === 'Review' ? 'bg-blue-50 text-[#1D68F2] border-blue-200' :
                    'bg-slate-100 text-slate-600 border-slate-200'
                  }`}>
                    {currentSection.status === 'Approved' ? '✓ Approved' : 'Review Required'}
                  </span>
                )}

                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                  {currentSection.confidenceScore}% Grounding Score
                </span>
              </div>
              <p className="text-xs text-[#64748B] mt-0.5">
                Category: <strong className="text-[#334155]">{currentSection.category}</strong> • Version v{currentSection.version} • Grounded via Microsoft Graph Search RAG
              </p>
            </div>
          </div>

          {/* Action Toolbar */}
          <div className="flex flex-wrap items-center gap-2">
            
            {/* QTK-021: Token Budget Visualizer */}
            <button
              onClick={() => setShowTokenBudget(true)}
              className="flex items-center space-x-1.5 bg-white hover:bg-purple-50 text-purple-700 text-xs font-semibold px-3 py-2 rounded-lg border border-purple-200 hover:border-purple-300 transition cursor-pointer"
              title="Inspect Token Allocation & Context Window (QTK-021)"
            >
              <Cpu className="w-3.5 h-3.5" />
              <span>Token Budget ({tokenBudget.totalTokens.toLocaleString()})</span>
            </button>

            {/* QTK-026: Version Diff Viewer */}
            <button
              onClick={() => setShowDiffModal(true)}
              className="flex items-center space-x-1.5 bg-white hover:bg-blue-50 text-[#1D68F2] text-xs font-semibold px-3 py-2 rounded-lg border border-blue-200 hover:border-blue-300 transition cursor-pointer"
              title="Compare with Previous Snapshot (QTK-026)"
            >
              <GitBranch className="w-3.5 h-3.5" />
              <span>Diff / History</span>
            </button>

            <button
              onClick={() => onOpenSourcesDrawer(currentSection)}
              className="flex items-center space-x-1.5 bg-white hover:bg-slate-50 text-[#334155] text-xs font-semibold px-3 py-2 rounded-lg border border-[#CBD5E1] transition cursor-pointer"
            >
              <BookOpen className="w-3.5 h-3.5 text-[#1D68F2]" />
              <span>Retrieval Sources ({currentSection.groundedSources.length})</span>
            </button>

            <button
              onClick={() => setShowCritiqueInput(!showCritiqueInput)}
              className="flex items-center space-x-1.5 bg-white hover:bg-slate-50 text-[#334155] text-xs font-semibold px-3 py-2 rounded-lg border border-[#CBD5E1] hover:border-blue-300 transition cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5 text-[#1D68F2]" />
              <span>Regenerate with AI</span>
            </button>

            {currentSection.status !== 'Approved' || currentSection.requiresReapproval ? (
              <button
                onClick={handleApprove}
                className="flex items-center space-x-1.5 bg-[#1D68F2] hover:bg-[#1554c0] text-white text-xs font-bold px-4 py-2 rounded-lg shadow-sm shadow-blue-500/20 transition active:scale-95 cursor-pointer"
              >
                <Check className="w-4 h-4 stroke-[2.5]" />
                <span>{currentSection.requiresReapproval ? 'Re-Approve Section' : 'Approve Section'}</span>
              </button>
            ) : (
              <button
                onClick={() => onUpdateSection({ ...currentSection, status: 'Review' })}
                className="flex items-center space-x-1.5 bg-white hover:bg-slate-50 text-[#64748B] text-xs font-semibold px-3.5 py-2 rounded-lg border border-[#CBD5E1] transition cursor-pointer"
              >
                <span>Re-open for Review</span>
              </button>
            )}

            {allSectionsApproved && (
              <button
                onClick={onOpenExportModal}
                className="flex items-center space-x-1.5 bg-[#1D68F2] hover:bg-[#1554c0] text-white text-xs font-bold px-4 py-2 rounded-lg shadow-sm shadow-blue-500/20 transition active:scale-95 cursor-pointer"
              >
                <FileText className="w-4 h-4" />
                <span>Export DTMC Word Doc</span>
              </button>
            )}
          </div>

        </div>

        {/* Section Navigation Tabs */}
        <div className="flex items-center justify-between pt-4 mt-4 border-t border-[#E2E8F0]">
          <div className="flex items-center space-x-1.5 overflow-x-auto py-1">
            {sections.map((sec) => (
              <button
                key={sec.id}
                onClick={() => setActiveSectionId(sec.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition cursor-pointer flex items-center space-x-1.5 ${
                  sec.id === currentSection.id
                    ? 'bg-[#1D68F2] text-white font-bold shadow-sm shadow-blue-500/20'
                    : sec.status === 'Approved' && !sec.requiresReapproval
                    ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
                    : sec.requiresReapproval
                    ? 'bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-300'
                    : 'bg-white text-[#64748B] hover:text-[#0F172A] hover:bg-slate-50 border border-[#CBD5E1]'
                }`}
              >
                <span>{sec.order}. {sec.title.replace(/^[0-9.]+\s*/, '').substring(0, 16)}...</span>
                {sec.status === 'Approved' && !sec.requiresReapproval && (
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                )}
                {sec.requiresReapproval && (
                  <AlertTriangle className="w-3 h-3 text-amber-600" />
                )}
              </button>
            ))}
          </div>

          <div className="flex items-center space-x-1 shrink-0 ml-2">
            <button
              onClick={() => currentIndex > 0 && setActiveSectionId(sections[currentIndex - 1].id)}
              disabled={currentIndex === 0}
              className="p-1.5 rounded-lg bg-white hover:bg-slate-50 border border-[#CBD5E1] text-[#64748B] hover:text-[#0F172A] disabled:opacity-30 disabled:cursor-not-allowed transition cursor-pointer"
              title="Previous Section"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => currentIndex < sections.length - 1 && setActiveSectionId(sections[currentIndex + 1].id)}
              disabled={currentIndex === sections.length - 1}
              className="p-1.5 rounded-lg bg-white hover:bg-slate-50 border border-[#CBD5E1] text-[#64748B] hover:text-[#0F172A] disabled:opacity-30 disabled:cursor-not-allowed transition cursor-pointer"
              title="Next Section"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* QTK-023: Unsupported Claims & Grounding Alert Banner */}
      {detectedClaims.length > 0 && (
        <UnsupportedClaimsBanner claims={detectedClaims} />
      )}

      {/* Regeneration Critique Panel */}
      {showCritiqueInput && (
        <div className="bg-white border border-blue-200 rounded-xl p-5 shadow-xs space-y-3 animate-fade-in">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-[#1D68F2]" />
              <h3 className="text-sm font-bold text-[#0F172A]">Targeted AI Section Regeneration (Azure OpenAI GPT-4o)</h3>
            </div>
            <span className="text-[10px] text-[#1D68F2] uppercase tracking-widest font-mono font-semibold">Workflow 5 Prompt Tuner</span>
          </div>

          <p className="text-xs text-[#64748B]">
            Provide specific tuning instructions (e.g., "Add acceptance criteria for disaster recovery testing", "Make timeline assumptions more conservative"):
          </p>

          <div className="flex gap-2">
            <input
              type="text"
              value={critiquePrompt}
              onChange={(e) => setCritiquePrompt(e.target.value)}
              placeholder="e.g. Focus on Azure Kubernetes Service (AKS) security baselines rather than VM lift-and-shift..."
              className="flex-1 bg-white border border-[#CBD5E1] rounded-lg px-4 py-2.5 text-xs text-[#0F172A] focus:outline-none focus:border-[#1D68F2]"
            />
            <button
              onClick={handleRegenerate}
              disabled={isRegenerating}
              className="flex items-center space-x-2 bg-[#1D68F2] hover:bg-[#1554c0] text-white text-xs font-bold px-5 py-2.5 rounded-lg shadow-sm transition disabled:opacity-50 cursor-pointer"
            >
              {isRegenerating ? (
                <>
                  <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Regenerating...</span>
                </>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  <span>Execute Regen</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Main Section Content Editor / Preview Workspace */}
      <div className="bg-white border border-[#E2E8F0] rounded-xl overflow-hidden shadow-xs">
        
        {/* Editor Toolbar Header */}
        <div className="p-4 border-b border-[#E2E8F0] bg-[#F8FAFC] flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <span className="text-xs font-bold text-[#0F172A] tracking-wide">
              {isEditing ? 'Markdown Rich Editor Mode' : 'Contractual Prose Preview (DTMC Standard)'}
            </span>
            {currentSection.isPricingSection && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                Blank Pricing Rule Enforced
              </span>
            )}
          </div>

          <div className="flex items-center space-x-2">
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center space-x-1.5 bg-white hover:bg-slate-50 text-[#334155] text-xs font-semibold px-3 py-1.5 rounded-lg border border-[#CBD5E1] transition cursor-pointer"
              >
                <Edit3 className="w-3.5 h-3.5 text-[#1D68F2]" />
                <span>Edit Text Directly</span>
              </button>
            ) : (
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => {
                    setEditedContent(currentSection.content);
                    setIsEditing(false);
                  }}
                  className="text-xs text-[#64748B] hover:text-[#0F172A] font-semibold px-3 py-1.5"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveEdit}
                  className="bg-[#1D68F2] hover:bg-[#1554c0] text-white text-xs font-bold px-3.5 py-1.5 rounded-lg transition cursor-pointer shadow-2xs"
                >
                  Save Revision (v{Number((currentSection.version + 0.1).toFixed(1))})
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Content Body */}
        <div className="p-8 bg-[#F8FAFC] relative">
          
          {/* Draft indicator badge */}
          <div className="absolute top-4 right-4 bg-white border border-[#CBD5E1] px-2.5 py-1 text-[10px] uppercase tracking-widest text-[#64748B] font-mono rounded">
            Draft v{currentSection.version}
          </div>

          {isEditing ? (
            <textarea
              rows={16}
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
              className="w-full bg-white border border-[#CBD5E1] rounded-xl p-4 text-xs sm:text-sm font-mono text-[#0F172A] focus:outline-none focus:border-[#1D68F2] leading-relaxed shadow-inner"
            />
          ) : (
            <div className="border border-[#E2E8F0] bg-white p-8 sm:p-10 rounded-xl text-base sm:text-lg leading-relaxed text-[#334155] shadow-xs">
              <div className="max-w-3xl mx-auto space-y-5">
                {currentSection.content.split('\n\n').map((block, idx) => {
                  // Table Rendering
                  if (block.includes('|')) {
                    const rows = block.trim().split('\n');
                    const headerRow = rows[0]?.split('|').map(s => s.trim()).filter(Boolean) || [];
                    const bodyRows = rows.slice(2).map(r => r.split('|').map(s => s.trim()).filter(Boolean));

                    return (
                      <div key={idx} className="overflow-x-auto my-6 border border-[#E2E8F0] rounded-lg bg-white">
                        <table className="w-full text-xs font-sans text-left">
                          <thead className="bg-[#F8FAFC] text-[#0F172A] font-semibold border-b border-[#E2E8F0]">
                            <tr>
                              {headerRow.map((h, i) => (
                                <th key={i} className="py-2.5 px-3.5 font-bold">{h}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-[#E2E8F0]">
                            {bodyRows.map((r, ri) => (
                              <tr key={ri} className="hover:bg-slate-50">
                                {r.map((cell, ci) => (
                                  <td key={ci} className="py-2.5 px-3.5 text-[#334155] align-top leading-relaxed">
                                    {cell.split(/<br\s*\/?>/gi).map((line, lIdx) => {
                                      const cleanLine = line.trim();
                                      return (
                                        <div key={lIdx} className="space-y-0.5">
                                          {cleanLine.includes('[Ref:') ? (
                                            <span>
                                              {cleanLine.replace(/\[Ref:.*?\]/, '')}
                                              <span className="text-[10px] font-bold bg-blue-50 text-[#1D68F2] px-1.5 py-0.5 rounded border border-blue-200 ml-1 font-mono">
                                                {cleanLine.match(/\[Ref:.*?\]/)?.[0]}
                                              </span>
                                            </span>
                                          ) : (
                                            cleanLine.split(/(\*\*.*?\*\*)/g).map((part, pIdx) => {
                                              if (part.startsWith('**') && part.endsWith('**')) {
                                                return <strong key={pIdx} className="font-semibold text-[#0F172A]">{part.slice(2, -2)}</strong>;
                                              }
                                              return <span key={pIdx}>{part}</span>;
                                            })
                                          )}
                                        </div>
                                      );
                                    })}
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    );
                  }

                  if (block.startsWith('### ')) {
                    return (
                      <h3 key={idx} className="text-xl sm:text-2xl font-bold text-[#0F172A] border-b border-[#E2E8F0] pb-2 mt-8 tracking-tight">
                        {block.replace('### ', '')}
                      </h3>
                    );
                  }

                  if (block.startsWith('#### ')) {
                    return (
                      <h4 key={idx} className="text-base sm:text-lg font-bold text-[#1D68F2] mt-5">
                        {block.replace('#### ', '')}
                      </h4>
                    );
                  }

                  if (block.startsWith('> ')) {
                    return (
                      <div key={idx} className="p-4 bg-slate-50 border-l-3 border-[#1D68F2] text-sm text-[#475569] italic my-4 rounded-r-lg">
                        {block.replace('> ', '')}
                      </div>
                    );
                  }

                  // Render paragraphs with clickable blue citation tags
                  return (
                    <p key={idx} className="text-[#334155] leading-relaxed">
                      {block.split(/(\[Ref:\s*[^\]]+\])/).map((part, pIdx) => {
                        if (part.startsWith('[Ref:')) {
                          return (
                            <button
                              key={pIdx}
                              onClick={() => onOpenSourcesDrawer(currentSection)}
                              className="inline-flex items-center bg-blue-50 hover:bg-blue-100 border border-blue-200 text-[#1D68F2] px-1.5 py-0.5 text-xs font-mono font-medium rounded mx-1 transition cursor-pointer align-baseline"
                              title="Inspect PM-Uploaded Intake Document"
                            >
                              <span>{part}</span>
                            </button>
                          );
                        }
                        return part;
                      })}
                    </p>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Section Footer / Metadata */}
        <div className="p-4 border-t border-[#E2E8F0] bg-white flex flex-col sm:flex-row sm:items-center justify-between text-xs text-[#64748B] gap-2">
          <div className="flex items-center space-x-3">
            <span className="flex items-center space-x-1">
              <Clock className="w-3.5 h-3.5 text-[#94A3B8]" />
              <span>Section Version v{currentSection.version}</span>
            </span>
            <span>•</span>
            <span className="flex items-center space-x-1 text-[#475569]">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Mandatory Human-in-the-Loop Sign-off</span>
            </span>
          </div>

          <div className="flex items-center space-x-2">
            {currentSection.status === 'Approved' && !currentSection.requiresReapproval ? (
              <span className="text-emerald-700 font-semibold flex items-center space-x-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Signed-off by {currentSection.approvedBy} on {new Date(currentSection.approvedAt || '').toLocaleDateString()}</span>
              </span>
            ) : (
              <span className="text-amber-700 font-medium flex items-center space-x-1">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                <span>{currentSection.requiresReapproval ? 'Re-Approval Required Following Edit' : 'Pending Human Approval'}</span>
              </span>
            )}
          </div>
        </div>

      </div>

      {/* Modals for Sprint 2 */}
      <DiffViewerModal
        isOpen={showDiffModal}
        onClose={() => setShowDiffModal(false)}
        section={currentSection}
        onRestoreSnapshot={(content) => {
          setEditedContent(content);
          handleSaveEdit();
        }}
      />

      <TokenBudgetDrawer
        isOpen={showTokenBudget}
        onClose={() => setShowTokenBudget(false)}
        tokenBudget={tokenBudget}
        sectionTitle={currentSection.title}
      />

    </div>
  );
};

