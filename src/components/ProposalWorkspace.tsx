import React, { useEffect, useState } from 'react';
import { ArrowRight, CheckCircle2, FileText, Sparkles, ShieldCheck, Presentation, Check, LayoutTemplate } from 'lucide-react';
import { SOWProject } from '../types/quill';
import { PROPOSAL_TEMPLATES, getProposalTemplate } from '../services/proposalTemplateService';
//import { generateProposalContent } from '../services/proposalGenerationService';
import { exportProposalDeck } from '../services/proposalExportService';
import { GeneratedProposalSlide } from '../types/proposal';
import { sendToN8n } from '../services/n8nServices';

interface ProposalWorkspaceProps {
  project: SOWProject;
  onUpdateProject?: (project: SOWProject) => void;
  onOpenSow?: () => void;
}

export const ProposalWorkspace: React.FC<ProposalWorkspaceProps> = ({ project, onUpdateProject, onOpenSow }) => {
  const selectedTemplate = getProposalTemplate(project.proposalTemplateId || PROPOSAL_TEMPLATES[0].id);
  const [generatedSlides, setGeneratedSlides] = useState<GeneratedProposalSlide[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationError, setGenerationError] = useState('');
  const [generatedAt, setGeneratedAt] = useState('');

  useEffect(() => {
  const existingSlides = project.proposalSlides || [];

  setGeneratedSlides(existingSlides);
  setGenerationError('');
}, [project, selectedTemplate]);

  const handleGenerate = async () => {
  setIsGenerating(true);
  setGenerationError('');

  try {
    const n8nResult = await sendToN8n({
      clientName: project.clientName,
      engagementName: project.title,
      documentType: 'Proposal',
      meetingTranscript: project.meetingNotes || '',
      uploadedDocuments: project.uploadedDocuments?.map(file => ({
        name: file.fileName,
        content: file.snippet,
      })),
      selectedTemplate: project.proposalTemplateId || PROPOSAL_TEMPLATES[0].id,
    });

    const slides: GeneratedProposalSlide[] = (n8nResult.sections || []).map(
      (section, index) => ({
        ...selectedTemplate.slides[index],
        id: `proposal-slide-${index + 1}`,
        title: section.sectionName,
        content: section.content,
      })
    );

    setGeneratedSlides(slides);
    if (onUpdateProject) {
      onUpdateProject({
        ...project,
        proposalSlides: slides,
        updatedAt: new Date().toISOString(),
      });
    }
    setGeneratedAt(
      new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      })
    );
  } catch {
    setGeneratedSlides([]);
    setGenerationError(
      'Proposal generation failed. Check the intake data and try again.'
    );
  } finally {
    setIsGenerating(false);
  }
};


  
  const uploadedDocs = project.uploadedDocuments.length > 0
    ? project.uploadedDocuments.map(doc => doc.fileName).slice(0, 4).join(', ')
    : 'Client discovery notes, meeting transcripts, requirement clarifications, and architecture inputs';

  const overviewMetrics = [
    { label: 'Client', value: project.clientName },
    { label: 'Industry', value: project.clientIndustry || 'Cross-industry' },
    { label: 'Project Type', value: project.projectType || 'Transformation' },
    { label: 'Grounding Source', value: uploadedDocs },
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto w-full space-y-8">
      <div className="rounded-2xl border border-[#E2E8F0] bg-white p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
          <div className="space-y-3">
            <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-[#1D68F2] text-[11px] font-bold uppercase tracking-[0.12em]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI Proposal Draft</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#0F172A]">
              {project.title || `${project.clientName} Proposal`}
            </h1>
            <p className="text-sm text-[#475569] max-w-3xl leading-relaxed">
              Professional consulting proposal generated from client context, discovery notes, transcript inputs, and uploaded project artifacts. This draft is structured for executive review and later conversion to a final SOW.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {onOpenSow && (
              <button
                onClick={onOpenSow}
                className="inline-flex items-center justify-center space-x-2 rounded-lg border border-[#CBD5E1] bg-white px-4 py-2 text-sm font-semibold text-[#0F172A] hover:bg-slate-50 transition cursor-pointer"
              >
                <FileText className="w-4 h-4 text-[#1D68F2]" />
                <span>Open SOW</span>
              </button>
            )}
            <button
              disabled={isGenerating || generatedSlides.length === 0} onClick={() => exportProposalDeck(project, selectedTemplate, generatedSlides)}
              className="inline-flex items-center justify-center space-x-2 rounded-lg border border-[#CBD5E1] bg-white px-4 py-2 text-sm font-semibold text-[#0F172A] hover:bg-slate-50 transition cursor-pointer disabled:opacity-50 disabled:cursor-wait"
            >
              <Presentation className="w-4 h-4 text-[#1D68F2]" />
              <span>Export PPTX</span>
            </button>
            <button disabled={isGenerating} onClick={handleGenerate} className="inline-flex items-center justify-center space-x-2 rounded-lg bg-[#1D68F2] px-4 py-2 text-sm font-bold text-white shadow-sm shadow-blue-500/20 hover:bg-[#1554c0] transition active:scale-[0.99] cursor-pointer disabled:opacity-60 disabled:cursor-wait">
              <CheckCircle2 className="w-4 h-4" />
              <span>{isGenerating ? 'Generating...' : 'Generate Proposal'}</span>
            </button>
          </div>
        </div>
      </div>

      <section className="rounded-2xl border border-[#E2E8F0] bg-white p-6 shadow-sm">
        <div className="flex items-start justify-between gap-4 mb-5">
          <div>
            <div className="flex items-center gap-2 text-[#0F172A] font-bold"><LayoutTemplate className="w-5 h-5 text-[#1D68F2]" />Proposal template library</div>
            <p className="text-sm text-[#64748B] mt-1">Choose the approved blueprint that will define this deck's sequence and story.</p>
          </div>
          <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1.5 rounded-lg">{selectedTemplate.slideCount} slides</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3">
          {PROPOSAL_TEMPLATES.map(template => (
            <button key={template.id} onClick={() => { const updated = { ...project, proposalTemplateId: template.id, updatedAt: new Date().toISOString() }; onUpdateProject?.(updated); }} className={`text-left rounded-xl border p-4 transition cursor-pointer ${selectedTemplate.id === template.id ? 'border-[#1D68F2] bg-blue-50/60 ring-2 ring-blue-100' : 'border-[#E2E8F0] hover:border-blue-300 hover:bg-slate-50'}`}>
              <div className="flex items-center justify-between gap-2"><span className="text-sm font-bold text-[#0F172A]">{template.name}</span>{selectedTemplate.id === template.id && <Check className="w-4 h-4 text-[#1D68F2]" />}</div>
              <p className="text-xs leading-5 text-[#64748B] mt-2">{template.description}</p>
              <p className="text-[11px] font-semibold text-[#475569] mt-3">{template.narrativeFlow}</p>
            </button>
          ))}
        </div>
      </section>

      {(generationError || generatedAt) && (
        <div className={`rounded-xl border p-4 text-sm ${generationError ? 'border-red-200 bg-red-50 text-red-700' : 'border-emerald-200 bg-emerald-50 text-emerald-700'}`}>
          {generationError || `Generated ${generatedSlides.length} slides from the ${selectedTemplate.name} blueprint at ${generatedAt}.`}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {overviewMetrics.map((metric) => (
          <div key={metric.label} className="rounded-xl border border-[#E2E8F0] bg-white p-4 shadow-sm">
            <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#64748B]">
              {metric.label}
            </div>
            <div className="mt-2 text-sm font-semibold text-[#0F172A] leading-relaxed">
              {metric.value}
            </div>
          </div>
        ))}
      </div>

      <div className="space-y-5">
        {generatedSlides.map((slide, index) => (
          <article key={`${selectedTemplate.id}-${slide.title}`} className="rounded-xl border border-[#E2E8F0] bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between gap-3 pb-3 border-b border-[#E2E8F0] mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#1D68F2] border border-blue-200 flex items-center justify-center text-xs font-bold">
                  {index + 1}
                </div>
                <h2 className="text-lg font-bold text-[#0F172A]">{slide.title}</h2>
              </div>
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
            </div>
            <p className="text-[15px] leading-8 text-[#334155] whitespace-pre-line">
              {slide.content}
            </p>
          </article>
        ))}
      </div>

      <div className="rounded-xl border border-dashed border-[#CBD5E1] bg-[#F8FAFC] p-5 text-sm text-[#475569]">
        <div className="flex items-center space-x-2 text-[#0F172A] font-semibold mb-2">
          <ArrowRight className="w-4 h-4 text-[#1D68F2]" />
          <span>Proposal readiness</span>
        </div>
        <p>
          {`This proposal draft is grounded in ${project.clientName}'s intake inputs and client artifacts, with placeholders for commercial alignment and any final commercial review required before client submission.`}
        </p>
      </div>
    </div>
  );
};
