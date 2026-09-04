import React, { useState } from 'react';
import { 
  Layers, 
  CheckCircle2, 
  ArrowUp, 
  ArrowDown, 
  Plus, 
  Trash2, 
  Sparkles, 
  Lock, 
  AlertCircle, 
  ShieldCheck,
  FileText,
  RefreshCw,
  Sliders,
  AlertTriangle
} from 'lucide-react';
import { SOWProject, SOWSection } from '../types/quill';
import { frameworkGovernanceService, ALLOWED_SECTION_CATALOGUE } from '../services/frameworkGovernanceService';
import { FrameworkImpactModal } from './framework/FrameworkImpactModal';
import { ImpactAnalysisResult } from '../types/jira';

interface FrameworkReviewProps {
  project: SOWProject;
  onUpdateProject: (updated: SOWProject) => void;
  onApproveFramework: () => void;
  onProceedToSectionReview: () => void;
}

export const FrameworkReview: React.FC<FrameworkReviewProps> = ({
  project,
  onUpdateProject,
  onApproveFramework,
  onProceedToSectionReview,
}) => {
  const [sections, setSections] = useState<SOWSection[]>(project.sections);
  const [newSectionTitle, setNewSectionTitle] = useState('');
  const [newSectionCategory, setNewSectionCategory] = useState<SOWSection['category']>('Scope');
  const [isManualMode, setIsManualMode] = useState(false);
  const [showCatalogue, setShowCatalogue] = useState(false);

  // Impact analysis modal state (QTK-020)
  const [impactResult, setImpactResult] = useState<ImpactAnalysisResult | null>(null);
  const [pendingModifiedSections, setPendingModifiedSections] = useState<SOWSection[] | null>(null);

  const applySectionsUpdate = (newSecs: SOWSection[]) => {
    // If framework was already approved and sections were drafted, check impact (QTK-020)
    const hasApprovedOrDrafted = project.sections.some(s => s.status === 'Approved' || s.status === 'Review');
    if (project.frameworkApproved && hasApprovedOrDrafted) {
      const analysis = frameworkGovernanceService.analyzeFrameworkImpact(project.sections, newSecs);
      setImpactResult(analysis);
      setPendingModifiedSections(newSecs);
    } else {
      setSections(newSecs);
      onUpdateProject({ ...project, sections: newSecs });
    }
  };

  const moveSection = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= sections.length) return;

    const updated = [...sections];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;

    // Recalculate order numbers
    const reordered = updated.map((s, idx) => ({ ...s, order: idx + 1 }));
    applySectionsUpdate(reordered);
  };

  const handleAddSection = () => {
    if (!newSectionTitle.trim()) return;

    const newSec: SOWSection = {
      id: `SEC-${Math.floor(Math.random() * 9000) + 1000}`,
      projectId: project.id,
      order: sections.length + 1,
      title: `${sections.length + 1}. ${newSectionTitle.trim()}`,
      category: newSectionCategory,
      content: `*Pending generation and grounding.*`,
      status: 'Pending',
      isMandatory: true,
      isPricingSection: newSectionCategory === 'Pricing',
      groundedSources: project.sections[0]?.groundedSources || [],
      version: 1,
      lastEditedBy: project.ownerName,
      lastEditedAt: new Date().toISOString(),
      confidenceScore: 90,
    };

    const updated = [...sections, newSec];
    applySectionsUpdate(updated);
    setNewSectionTitle('');
  };

  const handleAddFromCatalogue = (catItem: typeof ALLOWED_SECTION_CATALOGUE[0]) => {
    const newSec: SOWSection = {
      id: `SEC-${Math.floor(Math.random() * 9000) + 1000}`,
      projectId: project.id,
      order: sections.length + 1,
      title: catItem.name,
      category: catItem.defaultCategory,
      content: `${catItem.standardRationale}`,
      status: 'Pending',
      isMandatory: catItem.isMandatory,
      isPricingSection: catItem.isPricingSection,
      groundedSources: project.sections[0]?.groundedSources || [],
      version: 1,
      lastEditedBy: project.ownerName,
      lastEditedAt: new Date().toISOString(),
      confidenceScore: 95,
    };

    const updated = [...sections, newSec];
    applySectionsUpdate(updated);
    setShowCatalogue(false);
  };

  const handleDeleteSection = (id: string) => {
    const updated = sections.filter(s => s.id !== id).map((s, idx) => ({ ...s, order: idx + 1 }));
    applySectionsUpdate(updated);
  };

  const handleApprove = () => {
    onApproveFramework();
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="bg-white border border-[#E2E8F0] rounded-xl p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-blue-50 text-[#1D68F2] border border-blue-200">
                Phase 1: SOW Framework Outline (QTK-016 - 020)
              </span>
              {project.frameworkApproved ? (
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center space-x-1">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>Approved by {project.frameworkApprovedBy || project.ownerName}</span>
                </span>
              ) : (
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                  Approval Required to Unlock Drafting
                </span>
              )}
            </div>
            <h2 className="text-xl font-bold text-[#0F172A] tracking-tight">SOW Framework & Document Structure</h2>
            <p className="text-xs text-[#64748B]">
              Review, reorder, or add custom sections from the <strong className="text-[#1D68F2]">DTMC Allowed Section Catalogue</strong>. Deep drafting is strictly gated behind framework sign-off (QTK-019).
            </p>
          </div>

          <div className="flex items-center space-x-3">
            {!project.frameworkApproved ? (
              <button
                onClick={handleApprove}
                className="flex items-center space-x-2 bg-[#1D68F2] hover:bg-[#1554c0] text-white text-xs font-bold px-5 py-2.5 rounded-lg shadow-sm shadow-blue-500/20 transition active:scale-95 cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
                <span>Approve Framework & Unlock Drafting</span>
              </button>
            ) : (
              <button
                onClick={onProceedToSectionReview}
                className="flex items-center space-x-2 bg-[#1D68F2] hover:bg-[#1554c0] text-white text-xs font-bold px-5 py-2.5 rounded-lg shadow-sm shadow-blue-500/20 transition active:scale-95 cursor-pointer"
              >
                <span>Proceed to Section Review</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Sections List */}
      <div className="bg-white border border-[#E2E8F0] rounded-xl overflow-hidden shadow-xs">
        <div className="p-4 border-b border-[#E2E8F0] flex items-center justify-between bg-[#F8FAFC]">
          <div className="flex items-center space-x-2">
            <Layers className="w-4 h-4 text-[#1D68F2]" />
            <h3 className="text-sm font-bold text-[#0F172A]">Table of Contents / SOW Section Tree</h3>
            <span className="text-xs text-[#64748B]">({sections.length} Sections Defined)</span>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowCatalogue(!showCatalogue)}
              className="text-xs text-purple-700 hover:text-purple-900 font-semibold flex items-center space-x-1 cursor-pointer bg-purple-50 px-2.5 py-1 rounded-md border border-purple-200"
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>{showCatalogue ? 'Hide Catalogue' : 'Browse Allowed Catalogue (QTK-016)'}</span>
            </button>

            <button
              onClick={() => setIsManualMode(!isManualMode)}
              className="text-xs text-[#1D68F2] hover:underline font-semibold flex items-center space-x-1 cursor-pointer"
            >
              <span>{isManualMode ? 'Hide Section Builder' : '+ Add Custom Section'}</span>
            </button>
          </div>
        </div>

        {/* Allowed Section Catalogue Selector */}
        {showCatalogue && (
          <div className="p-4 bg-purple-50/50 border-b border-purple-100 space-y-3">
            <div className="flex items-center justify-between">
              <div className="text-xs font-bold text-purple-900">DTMC Allowed Section Catalogue (QTK-016 Schema)</div>
              <span className="text-[10px] text-purple-700">Click any standard section to append to framework</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {ALLOWED_SECTION_CATALOGUE.map(catItem => {
                const isAlreadyPresent = sections.some(s => s.title.includes(catItem.name) || s.title.toLowerCase().includes(catItem.name.toLowerCase()));
                return (
                  <div
                    key={catItem.id}
                    onClick={() => !isAlreadyPresent && handleAddFromCatalogue(catItem)}
                    className={`p-2.5 rounded-lg border text-xs text-left transition ${
                      isAlreadyPresent
                        ? 'bg-slate-100 border-slate-200 opacity-60 cursor-not-allowed'
                        : 'bg-white border-purple-200 hover:border-purple-400 hover:shadow-xs cursor-pointer'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[#0F172A]">{catItem.name}</span>
                      <span className="text-[9px] font-semibold px-1.5 py-0.2 rounded bg-purple-100 text-purple-800">
                        {catItem.defaultCategory}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">{catItem.standardRationale}</p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Custom Section Builder */}
        {isManualMode && (
          <div className="p-4 bg-[#F8FAFC] border-b border-[#E2E8F0] space-y-3">
            <div className="text-xs font-semibold text-[#1D68F2]">Add Custom SOW Section</div>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                value={newSectionTitle}
                onChange={(e) => setNewSectionTitle(e.target.value)}
                placeholder="Section Title (e.g., Disaster Recovery & Failover SLAs)"
                className="flex-1 bg-white border border-[#CBD5E1] rounded-lg px-3.5 py-2 text-xs text-[#0F172A] focus:outline-none focus:border-[#1D68F2]"
              />
              <select
                value={newSectionCategory}
                onChange={(e) => setNewSectionCategory(e.target.value as any)}
                className="bg-white border border-[#CBD5E1] rounded-lg px-3 py-2 text-xs text-[#334155] focus:outline-none focus:border-[#1D68F2] cursor-pointer"
              >
                <option value="Scope">Scope</option>
                <option value="Deliverables">Deliverables</option>
                <option value="Assumptions">Assumptions</option>
                <option value="Governance">Governance</option>
                <option value="Acceptance">Acceptance</option>
                <option value="Pricing">Pricing</option>
                <option value="Timeline">Timeline</option>
                <option value="Staffing">Staffing</option>
              </select>
              <button
                onClick={handleAddSection}
                className="bg-[#1D68F2] hover:bg-[#1554c0] text-white text-xs font-bold px-4 py-2 rounded-lg transition cursor-pointer flex items-center space-x-1.5 shadow-2xs"
              >
                <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>Insert Section</span>
              </button>
            </div>
          </div>
        )}

        {/* Section Rows */}
        <div className="divide-y divide-[#E2E8F0]">
          {sections.map((section, idx) => (
            <div
              key={section.id}
              className="p-4 flex items-center justify-between hover:bg-[#F8FAFC] transition group"
            >
              <div className="flex items-center space-x-3.5">
                <div className="w-7 h-7 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-xs font-bold text-[#1D68F2]">
                  {section.order}
                </div>

                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-bold text-[#0F172A] group-hover:text-[#1D68F2] transition">
                      {section.title}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                      {section.category}
                    </span>
                    {section.isPricingSection && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                        Blank Pricing Rule Enforced
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-[#64748B] mt-0.5 flex items-center space-x-3">
                    <span>Status: <strong className="text-[#0F172A]">{section.status}</strong></span>
                    <span>•</span>
                    <span>Grounded Sources: <strong className="text-[#1D68F2]">{section.groundedSources.length} Reference Docs</strong></span>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-1.5">
                <button
                  onClick={() => moveSection(idx, 'up')}
                  disabled={idx === 0}
                  className="p-1.5 rounded-lg bg-white hover:bg-slate-50 text-[#64748B] hover:text-[#0F172A] border border-[#CBD5E1] disabled:opacity-30 disabled:cursor-not-allowed transition cursor-pointer"
                  title="Move Up"
                >
                  <ArrowUp className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => moveSection(idx, 'down')}
                  disabled={idx === sections.length - 1}
                  className="p-1.5 rounded-lg bg-white hover:bg-slate-50 text-[#64748B] hover:text-[#0F172A] border border-[#CBD5E1] disabled:opacity-30 disabled:cursor-not-allowed transition cursor-pointer"
                  title="Move Down"
                >
                  <ArrowDown className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleDeleteSection(section.id)}
                  className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 transition cursor-pointer"
                  title="Delete Section"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Grounding and Safeguards Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white border border-[#E2E8F0] rounded-xl p-4 flex items-start space-x-3 shadow-xs">
          <ShieldCheck className="w-5 h-5 text-[#1D68F2] shrink-0 mt-0.5" />
          <div className="text-xs text-[#334155] space-y-1">
            <span className="font-bold text-[#0F172A]">Framework-First Architecture (QTK-016 & QTK-019):</span>
            <p className="text-[#64748B] leading-relaxed">
              Locking the outline before drafting guarantees structural alignment with legal standards and prevents sprawling ungrounded text generation.
            </p>
          </div>
        </div>

        <div className="bg-white border border-[#E2E8F0] rounded-xl p-4 flex items-start space-x-3 shadow-xs">
          <Lock className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="text-xs text-[#334155] space-y-1">
            <span className="font-bold text-[#0F172A]">Blank Pricing Safeguard (QTK-016):</span>
            <p className="text-[#64748B] leading-relaxed">
              All commercial and fee sections strictly use standardized blank placeholders to safeguard against binding commercial commitments.
            </p>
          </div>
        </div>
      </div>

      {/* Impact Analysis Modal (QTK-020) */}
      {impactResult && (
        <FrameworkImpactModal
          isOpen={Boolean(impactResult)}
          onClose={() => {
            setImpactResult(null);
            setPendingModifiedSections(null);
          }}
          impactResult={impactResult}
          onConfirmChanges={() => {
            if (pendingModifiedSections) {
              setSections(pendingModifiedSections);
              onUpdateProject({ 
                ...project, 
                sections: pendingModifiedSections,
                frameworkApproved: false // Reset framework approval if altered post-approval
              });
            }
            setImpactResult(null);
            setPendingModifiedSections(null);
          }}
        />
      )}

    </div>
  );
};

