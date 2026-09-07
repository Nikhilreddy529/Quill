import React, { useState } from 'react';
import { submitContributorApproval } from '../services/n8nServices';
import { QuillUser, SOWSectionContributor } from '../types/quill';
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

  currentUser: QuillUser;
  onChangeCurrentUser?: (user: QuillUser) => void;

  onNavigateStep?: (step: number) => void;
}
function cleanContentForDisplay(rawText: string, project?: SOWProject, sectionTitle?: string): string {
  if (!rawText) return '';
  
  let text = rawText;

  // 1. If it's Section 9 or Authorization with Accepted by Client / DTMC
  const isAuthSection = 
    (sectionTitle && sectionTitle.toLowerCase().includes('authorization')) ||
    text.includes('Accepted by Client') || 
    text.includes('Accepted by DTMC');

  if (isAuthSection) {
    const clientSignatory = project?.clientContact || project?.clientName || 'Riley Chen';
    const dtmcCreator = project?.ownerName || 'Arjun Rao';

    // If it's in a markdown pipe table
    if (text.includes('| Accepted by Client') || (text.includes('|') && text.includes('Accepted by Client'))) {
      const lines = text.split('\n');
      const dataRow = lines.find(l => l.includes('**Name:**') || l.includes('Name:'));
      if (dataRow) {
        const parts = dataRow.split('|').map(s => s.trim()).filter(Boolean);
        if (parts.length >= 2) {
          return `Accepted by Client:\n* Name: ${clientSignatory}\n* Title: VP, Transformation\n* Signature: ___________________________\n* Date: ________________________________\n\nAccepted by DTMC:\n* Name: ${dtmcCreator}\n* Title: Engagement Partner\n* Signature: ___________________________\n* Date: ________________________________`;
        }
      }
    }

    // Replace dynamic values in standard list format
    let authText = text
      .replace(/(\*?\s*Name:\s*)(?:Riley Chen|\{\{CLIENT_SIGNATORY_NAME\}\}|\[.*?\])(?=\s*\n\s*\*?\s*Title:)/i, `$1${clientSignatory}`)
      .replace(/(Accepted by Client:[\s\S]*?\*\s*Name:\s*)([^\n]+)/i, `$1${clientSignatory}`)
      .replace(/(Accepted by Client:[\s\S]*?\*\s*Title:\s*)([^\n]+)/i, '$1VP, Transformation')
      .replace(/(Accepted by DTMC:[\s\S]*?\*\s*Name:\s*)([^\n]+)/i, `$1${dtmcCreator}`)
      .replace(/(Accepted by DTMC:[\s\S]*?\*\s*Title:\s*)([^\n]+)/i, '$1Engagement Partner');

    // Also replace hardcoded Jordan Lee if still present
    authText = authText.replace(/(Accepted by DTMC:[\s\S]*?\*\s*Name:\s*)Jordan Lee/i, `$1${dtmcCreator}`);

    // If text was missing the structure, format standard template
    if (!authText.includes('Accepted by Client:') || !authText.includes('Accepted by DTMC:')) {
      return `Accepted by Client:\n* Name: ${clientSignatory}\n* Title: VP, Transformation\n* Signature: ___________________________\n* Date: ________________________________\n\nAccepted by DTMC:\n* Name: ${dtmcCreator}\n* Title: Engagement Partner\n* Signature: ___________________________\n* Date: ________________________________`;
    }

    // Clean any leading # marks if any
    return authText.replace(/^\s*#{1,6}\s*\d+\.\s*[^\n]+\n+/, '').replace(/^[\t ]*#{1,6}[\t ]+/gm, '');
  }

  // 2. Remove redundant section title heading at the very start of the text
  // e.g. "### 1. Engagement Overview", "### 2. Goals and Objectives", "### <Title>"
  text = text.replace(/^\s*#{1,6}\s*(?:\d+\.\s*)?[^\n]+\n+/, (match) => {
    const headingText = match.replace(/^[\s#]+/, '').trim().toLowerCase();
    const currentTitleText = (sectionTitle || '').trim().toLowerCase();
    if (
      !sectionTitle ||
      headingText.includes(currentTitleText) ||
      currentTitleText.includes(headingText) ||
      /^\d+\.\s+/.test(headingText)
    ) {
      return '';
    }
    return match;
  });

  // 3. Strip all leading markdown heading hash symbols (e.g. '### ', '#### ') from any line
  // This turns "#### 1.2 Background & Strategic Alignment" into "1.2 Background & Strategic Alignment"
  // and removes stray `#` symbols entirely
  text = text.replace(/^[\t ]*#{1,6}[\t ]+/gm, '');
  text = text.replace(/[\t ]+#{1,6}[\t ]*$/gm, '');

  // 4. If it's Section 3 with Phase / Workstream table
  if (text.includes('| Phase / Workstream') || text.includes('| Phase')) {
    const lines = text.split('\n');
    const tableRows = lines.filter(l => l.trim().startsWith('|') && !l.includes('---') && !l.includes('Phase / Workstream') && !l.includes('Phase'));
    if (tableRows.length > 0) {
      const converted = tableRows.map(row => {
        const cols = row.split('|').map(s => s.trim()).filter(Boolean);
        if (cols.length >= 3) {
          return `* ${cols[0]}: ${cols[1]} Primary Deliverables: ${cols[2]}`;
        } else if (cols.length === 2) {
          return `* ${cols[0]}: ${cols[1]}`;
        }
        return row;
      });
      return converted.join('\n');
    }
  }

  // 5. If it's Section 4 with Role | Responsibility table
  if (text.includes('| Role') && text.includes('Responsibility')) {
    const lines = text.split('\n');
    const tableRows = lines.filter(l => l.trim().startsWith('|') && !l.includes('---') && !l.includes('Role'));
    if (tableRows.length > 0) {
      const converted = tableRows.map(row => {
        const cols = row.split('|').map(s => s.trim()).filter(Boolean);
        if (cols.length >= 2) {
          return `* ${cols[0]}: ${cols[1]}`;
        }
        return row;
      });
      return converted.join('\n');
    }
  }

  // 6. If it's Section 8 with Commercial Model table
  if (text.includes('| Commercial Model')) {
    const lines = text.split('\n');
    const tableRow = lines.find(l => l.trim().startsWith('|') && !l.includes('---') && !l.includes('Commercial Model'));
    const noteLine = lines.find(l => l.includes('fictional placeholders') || l.includes('Commercial Finance') || l.includes('blank pending'));
    if (tableRow) {
      const cols = tableRow.split('|').map(s => s.trim()).filter(Boolean);
      if (cols.length >= 3) {
        let amount = cols[1];
        if (amount.includes('$') || amount.includes('88,000') || amount.includes('116,000')) {
          amount = '[ — ]';
        }
        return `* Commercial Model: ${cols[0]}\n* Illustrative Amount: ${amount}\n* Billing: ${cols[2]}${noteLine ? `\n\n${noteLine.trim()}` : '\n\n*All fee amounts remain intentionally blank pending Commercial Finance sign-off prior to contracting.*'}`;
      }
    }
  }

  // 7. Replace any unvetted price in Section 8 ($88,000 to $116,000) with blank [ — ]
  const sanitized = text
    .replace(/\$88,000(?:\s*to\s*\$116,000)?/gi, '[ — ]')
    .replace(/\$116,000/gi, '[ — ]');

  // 8. Replace any remaining <br/> tags and HTML tags
  return sanitized
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/?[^>]+(>|$)/g, '');
}

export const SOWAuthoringWorkspace: React.FC<SOWAuthoringWorkspaceProps> = ({
  project,
  activeSectionId,
  setActiveSectionId,
  onUpdateSection,
  onUpdateProject,
  onOpenSourcesDrawer,
  onOpenExportModal,
  currentUser,
  onChangeCurrentUser,
  onNavigateStep,
}) => {
    const isManager = currentUser.role === 'Project Manager';

  const allSections = [...project.sections]
    .filter(
      s =>
        s.order <= 9 &&
        !s.title.toLowerCase().startsWith('appendix') &&
        !(s as any).isAppendix
    )
    .sort((a, b) => a.order - b.order);

  // Always show the complete SOW outline.
  // Contributors can view every section, but can edit only the section assigned to them.
  const sections = allSections;

  const currentSection =
    sections.find(s => s.id === activeSectionId) || sections[0];

  // Find the section assigned to the current contributor.
  const assignedSection = !isManager
    ? sections.find(
        section =>
          project.sectionContributors?.[section.id]?.email ===
          currentUser.email
      )
    : undefined;

  // Check whether the currently selected section belongs to this contributor.
  const isAssignedToMe =
    currentUser.role === 'Contributor' &&
    assignedSection?.id === currentSection?.id;

  // Check whether the currently selected section is approved.
  const isApproved = currentSection?.status === 'Approved';

  // Manager can edit everything. Contributor can edit only their assigned, unapproved section.
  const canEditCurrentSection =
    isManager || (isAssignedToMe && !isApproved);

  // Editor states
  const [activeTab, setActiveTab] = useState<'editor' | 'history'>('editor');
  const [editorText, setEditorText] = useState(cleanContentForDisplay(currentSection?.content || '', project, currentSection?.title));
  const [isRegenerating, setIsRegenerating] = useState(false);
  
  // AI Assistant input
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiStatusMsg, setAiStatusMsg] = useState<string | null>(null);

  // Toast notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Contributor management
  const [showContributorPanel, setShowContributorPanel] = useState(false);
  const [contributorName, setContributorName] = useState('');
  const [contributorEmail, setContributorEmail] = useState('');
  const [contributorSectionId, setContributorSectionId] = useState('');

  const handleAssignContributor = () => {
    if (!isManager) return;

    const name = contributorName.trim();
    const email = contributorEmail.trim().toLowerCase();
    const sectionId = contributorSectionId || allSections[0]?.id;

    if (!name || !email || !sectionId) {
      showToast('Enter contributor name, email, and section.');
      return;
    }

    const contributor: SOWSectionContributor = {
      id: `CONTRIB-${Date.now()}`,
      name,
      email,
      assignedAt: new Date().toISOString(),
      assignedBy: currentUser.name,
    };

    onUpdateProject({
      ...project,
      sectionContributors: {
        ...(project.sectionContributors || {}),
        [sectionId]: contributor,
      },
    });

    setActiveSectionId(sectionId);

    // MVP session switch: contributor sees only their assigned section(s).
    onChangeCurrentUser?.({
      id: contributor.id,
      name: contributor.name,
      email: contributor.email,
      role: 'Contributor',
    });

    setContributorName('');
    setContributorEmail('');
    setContributorSectionId('');
    setShowContributorPanel(false);
    showToast(`Assigned ${name}`);
  };

  const handleRemoveContributor = (sectionId: string) => {
    if (!isManager) return;

    const existing = project.sectionContributors?.[sectionId];
    if (!existing) return;

    const nextAssignments = { ...(project.sectionContributors || {}) };
    delete nextAssignments[sectionId];

    onUpdateProject({
      ...project,
      sectionContributors: nextAssignments,
    });

    showToast(`Removed ${existing.name}`);
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Sync state on section change
  React.useEffect(() => {
    if (currentSection) {
      const cleaned = cleanContentForDisplay(currentSection.content, project, currentSection.title);
      setEditorText(cleaned);
      setAiPrompt('');
      setAiStatusMsg(null);

      if (currentSection.content !== cleaned) {
        onUpdateSection({
          ...currentSection,
          content: cleaned,
        });
      }
    }
  }, [currentSection?.id, project.id, project.ownerName, project.clientContact, project.clientName]);

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
  const progressPercent =
  sections.length > 0
    ? Math.round((approvedCount / sections.length) * 100)
    : 0;

  // Handlers
    const handleSaveText = () => {
    if (!canEditCurrentSection) {
      showToast('You do not have permission to edit this section.');
      return;
    }

    const updated: SOWSection = {
      ...currentSection,
      content: editorText,
      lastEditedAt: new Date().toISOString(),
      lastEditedBy: currentUser.name,
      version: Number((currentSection.version + 0.1).toFixed(1)),
      requiresReapproval: !isManager,
    };

    onUpdateSection(updated);

    showToast(
      isManager
        ? `Saved version ${updated.version}`
        : `Saved version ${updated.version} — approval required`
    );
  };
  const currentIndex = sections.findIndex(
  s => s.id === currentSection.id
);

    const handleApproveAndMoveNext = async () => {
    if (!canEditCurrentSection) {
      showToast('You do not have permission to approve this section.');
      return;
    }

    const approvedAt = new Date().toISOString();

    const updated: SOWSection = {
      ...currentSection,
      content: editorText,
      status: 'Approved',
      approvedBy: currentUser.name,
      approvedAt,
      requiresReapproval: false,
      lastEditedBy: currentUser.name,
      lastEditedAt: approvedAt,
    };

    onUpdateSection(updated);

    // Contributor approval → notify manager through n8n
    if (!isManager) {
      try {
        await submitContributorApproval({
          action: 'CONTRIBUTOR_SECTION_APPROVED',
          projectId: project.id,
          sectionId: currentSection.id,
          sectionTitle: currentSection.title,

          contributor: {
            id: currentUser.id,
            name: currentUser.name,
            email: currentUser.email,
          },

          content: editorText,
          version: updated.version,
          approvedAt,
        });

        showToast(
          `"${currentSection.title}" approved and sent to Project Manager`
        );
      } catch (error) {
        console.error(
          'Failed to notify Project Manager:',
          error
        );

        showToast(
          'Section approved, but notification could not be sent.'
        );
      }

      return;
    }
      // Existing manager behavior
      const hasNext =
        currentIndex >= 0 &&
        currentIndex < sections.length - 1;
      if (hasNext) {
        const nextSection = sections[currentIndex + 1];
        setActiveSectionId(nextSection.id);
        showToast(
          `Approved "${currentSection.title}" & moved to next section`
        );
      } else {
        showToast(
          `Approved "${currentSection.title}" (All sections reviewed)`
        );
      }
    };
      const handleRunAiAction = async (instruction: string) => {
    if (!canEditCurrentSection) {
      showToast('You do not have permission to regenerate this section.');
      return;
    }

    setIsRegenerating(true);
    setAiStatusMsg(null);

    try {
      const result = await generateSectionContent(
        currentSection,
        project,
        instruction
      );

      const cleanedContent = cleanContentForDisplay(
        result.content,
        project,
        currentSection.title
      );

      const updated: SOWSection = {
        ...currentSection,
        content: cleanedContent,
        confidenceScore: result.confidenceScore,
        groundedSources: result.groundedSources,
        version: Number((currentSection.version + 0.1).toFixed(1)),
        regenerationPrompt: instruction,
        requiresReapproval: !isManager,
        lastEditedBy: currentUser.name,
        lastEditedAt: new Date().toISOString(),
      };

      setEditorText(cleanedContent);
      onUpdateSection(updated);
      setAiStatusMsg(
        'Updated section successfully based on reference documents.'
      );
      setAiPrompt('');
      showToast(`AI content updated (v${updated.version})`);
    } catch (e) {
      console.error('AI regeneration failed:', e);
      setAiStatusMsg('Failed to run AI assistance.');
      showToast('AI regeneration failed.');
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
      content: `Additional client requirements and architectural specifications for this engagement.`,
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
            disabled={isRegenerating || !canEditCurrentSection}
            className="flex items-center space-x-1.5 bg-white hover:bg-slate-50 text-[#334155] border border-[#CBD5E1] px-3.5 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRegenerating ? 'animate-spin text-blue-600' : 'text-[#64748B]'}`} />
            <span>{isRegenerating ? 'Regenerating...' : 'Regenerate'}</span>
          </button>

          <button
            onClick={handleSaveText}
            disabled={!canEditCurrentSection}
            className="flex items-center space-x-1.5 border border-[#CBD5E1] bg-white hover:bg-slate-50 text-[#1D68F2] px-3.5 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer shadow-xs"
            title="Save draft edits for this section"
          >
            <Edit3 className="w-3.5 h-3.5 text-[#1D68F2]" />
            <span>Save Section</span>
          </button>

          <button
            onClick={handleApproveAndMoveNext}
            disabled={!canEditCurrentSection}
            className={`flex items-center space-x-1.5 px-4 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer shadow-sm active:scale-95 ${
              currentSection.status === 'Approved'
                ? 'bg-[#15803D] hover:bg-[#166534] text-white'
                : 'bg-[#1D68F2] hover:bg-[#1557d0] text-white'
            }`}
            title={
              isManager
                ? 'Approve section and advance to the next section'
                : 'Approve your assigned section'
            }
          >
            <Check className="w-4 h-4 stroke-[2.5]" />
            <span>
              {isManager ? 'Approve & Next' : 'Approve Changes'}
            </span>
          </button>
        </div>
      </div>

      {/* Main 3-Column Content Body */}
      <div className="flex-1 p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* ============================================================ */}
        {/* COLUMN 1: DOCUMENT OUTLINE (Width ~260px / 3 cols) */}
        {/* ============================================================ */}
        <div className="lg:col-span-3 space-y-4">
          {isManager && (
            <div className="bg-white rounded-xl border border-[#E2E8F0] p-4 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-bold text-[#0F172A]">Section Contributors</h3>
                  <p className="text-[10px] text-[#64748B]">Assign access by section</p>
                </div>
                <button
                  onClick={() => setShowContributorPanel(v => !v)}
                  className="text-xs font-semibold text-[#1D68F2] hover:underline cursor-pointer"
                >
                  {showContributorPanel ? 'Close' : 'Assign'}
                </button>
              </div>

              {showContributorPanel && (
                <div className="space-y-2">
                  <input
                    value={contributorName}
                    onChange={e => setContributorName(e.target.value)}
                    placeholder="Contributor name"
                    className="w-full px-3 py-2 text-xs border border-[#CBD5E1] rounded-lg"
                  />
                  <input
                    value={contributorEmail}
                    onChange={e => setContributorEmail(e.target.value)}
                    placeholder="Contributor email"
                    type="email"
                    className="w-full px-3 py-2 text-xs border border-[#CBD5E1] rounded-lg"
                  />
                  <select
                    value={contributorSectionId}
                    onChange={e => setContributorSectionId(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-[#CBD5E1] rounded-lg bg-white"
                  >
                    <option value="">Select section</option>
                    {allSections.map(section => (
                      <option key={section.id} value={section.id}>{section.title}</option>
                    ))}
                  </select>
                  <button
                    onClick={handleAssignContributor}
                    className="w-full py-2 bg-[#1D68F2] hover:bg-[#1557d0] text-white rounded-lg text-xs font-semibold cursor-pointer"
                  >
                    Assign Contributor
                  </button>
                </div>
              )}

              {Object.entries(project.sectionContributors || {}).map(([sectionId, contributor]) => {
                const section = allSections.find(s => s.id === sectionId);
                if (!section) return null;
                return (
                  <div key={sectionId} className="flex items-center justify-between gap-2 p-2 bg-slate-50 border border-slate-200 rounded-lg">
                    <div className="min-w-0">
                      <div className="text-[11px] font-semibold text-[#0F172A] truncate">{contributor.name}</div>
                      <div className="text-[10px] text-[#64748B] truncate">{section.title}</div>
                    </div>
                    <button
                      onClick={() => handleRemoveContributor(sectionId)}
                      className="text-[10px] font-semibold text-rose-600 cursor-pointer"
                    >
                      Remove
                    </button>
                  </div>
                );
              })}
            </div>
          )}

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
                const sectionApproved = sec.status === 'Approved';
                const sectionContributor = project.sectionContributors?.[sec.id];
                const sectionAssignedToMe =
                  currentUser.role === 'Contributor' &&
                  sectionContributor?.email === currentUser.email;
                const isViewOnly =
                  currentUser.role === 'Contributor' && !sectionAssignedToMe;
                const isLocked = sec.isPricingSection || sec.category === 'Terms';

                return (
                  <button
                    key={sec.id}
                    type="button"
                    onClick={() => setActiveSectionId(sec.id)}
                    className={`w-full text-left px-3 py-2.5 rounded-lg text-xs font-medium flex items-center justify-between transition border ${
                      isSelected && sectionAssignedToMe
                        ? 'bg-[#EFF6FF] text-[#1D68F2] font-bold border-[#BFDBFE]'
                        : isSelected
                          ? 'bg-[#F8FAFC] text-[#334155] border-[#E2E8F0]'
                          : isViewOnly
                            ? 'bg-[#F8FAFC] text-[#94A3B8] border-transparent hover:bg-[#F1F5F9]'
                            : 'text-[#334155] hover:bg-[#F8FAFC] hover:text-[#0F172A] border-transparent'
                    }`}
                    title={
                      sectionAssignedToMe
                        ? 'Assigned to you — editable'
                        : isViewOnly
                          ? 'View only — you cannot edit this section'
                          : undefined
                    }
                  >
                    <div className="flex items-center gap-2 min-w-0">
                  
                      <span className="truncate">{sec.title}</span>
                    </div>
                    <div className="shrink-0 flex items-center gap-2">
                      {sectionAssignedToMe && !sectionApproved && (
                        <span className="text-[10px] font-semibold text-[#1D68F2]">Editing</span>
                      )}
                      {isViewOnly && (
                        <span className="flex items-center gap-1 text-[10px] text-[#94A3B8]">
                          <Lock className="w-3 h-3" />
                          View only
                        </span>
                      )}
                      {sectionApproved && (
                        <div className="w-4 h-4 rounded-full bg-[#DCFCE7] text-[#15803D] flex items-center justify-center">
                          <Check className="w-2.5 h-2.5 stroke-[3]" />
                        </div>
                      )}
                      {!isViewOnly && !sectionAssignedToMe && !sectionApproved && isLocked && (
                        <Lock className="w-3 h-3 text-[#94A3B8]" />
                      )}
                      {!isViewOnly && !sectionAssignedToMe && !sectionApproved && !isLocked && sec.status === 'Review' && (
                        <div className="w-2 h-2 rounded-full bg-amber-400" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            {isManager && (
            <button
              onClick={handleAddNewSection}
              className="w-full flex items-center justify-center space-x-1.5 py-2 px-3 border border-[#CBD5E1] rounded-lg text-xs font-semibold text-[#1D68F2] hover:bg-blue-50/60 transition cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Section</span>
            </button>
            )}
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
          
          {/* Contributor permission banner */}
          {currentUser.role === 'Contributor' && isAssignedToMe && !isApproved && (
            <div className="mx-5 mt-4 mb-2">
              <div className="flex items-start gap-3 rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-blue-700">
                <Info className="w-4 h-4 mt-0.5 shrink-0" />
                <div className="text-xs">
                  <div className="font-semibold">This section has been assigned to you by the Project Manager.</div>
                  <div className="mt-1 text-blue-600">You can edit, save, and approve this section. Other sections are view-only.</div>
                </div>
              </div>
            </div>
          )}
          {currentUser.role === 'Contributor' && !isAssignedToMe && (
            <div className="mx-5 mt-4 mb-2">
              <div className="flex items-start gap-3 rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-slate-500">
                <Lock className="w-4 h-4 mt-0.5 shrink-0" />
                <div className="text-xs">
                  <div className="font-semibold text-slate-600">View-only section</div>
                  <div className="mt-1">This section is part of the current SOW but has not been assigned to you. You can view it, but you cannot make changes.</div>
                </div>
              </div>
            </div>
          )}

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

          {/* Document Content Canvas */}
          <div className="flex-1 p-8 overflow-y-auto flex flex-col">
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
            ) : (
              <div className="flex-1 flex flex-col space-y-4">
                {/* Section Title */}
                <h2 className="text-lg font-bold text-[#0F172A]">
                  {currentSection.title}
                </h2>

                {/* Direct Writing Document Area */}
                <textarea
                  value={editorText}
                  readOnly={!canEditCurrentSection}
                  onChange={(e) => {
                    if (!canEditCurrentSection) return;

                    const newText = e.target.value;

                    setEditorText(newText);

                    onUpdateSection({
                      ...currentSection,
                      content: newText,
                      lastEditedAt: new Date().toISOString(),
                      lastEditedBy: currentUser.name,
                      requiresReapproval: !isManager,
                    });
                  }}
                  placeholder="Type anything here... Add or edit deliverables, scope details, specifications, notes, or section prose."
                  className="w-full flex-1 min-h-[380px] p-0 text-sm font-sans text-[#334155] bg-transparent border-none focus:outline-none leading-relaxed resize-y placeholder:text-slate-400 focus:ring-0"
                />
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