import React, { useRef, useState } from 'react';
import { sendToN8n } from '../services/n8nServices';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  FileText,
  Mic,
  Plus,
  Trash2,
  X,
} from 'lucide-react';
import { PROPOSAL_TEMPLATES } from '../services/proposalTemplateService';
import { SOWProject, UploadedDocCategory, UploadedProjectDocument } from '../types/quill';
import { GeneratedProposalSlide } from '../types/proposal';

interface CreateProposalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateProposal: (proposal: SOWProject) => void;
}

const inputClass = 'w-full rounded-lg border border-[#CBD5E1] bg-white px-3.5 py-2.5 text-sm text-[#0F172A] focus:border-[#1D68F2] focus:outline-none focus:ring-2 focus:ring-blue-500/20';
const defaultTemplateId = PROPOSAL_TEMPLATES[0]?.id || '';

export const CreateProposalModal: React.FC<CreateProposalModalProps> = ({ isOpen, onClose, onCreateProposal }) => {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [isCreating, setIsCreating] = useState(false);
  const [title, setTitle] = useState('Acme Enterprise Transformation Proposal');
  const [clientName, setClientName] = useState('Acme Global Enterprises');
  const [industry, setIndustry] = useState('Financial Services');
  const [opportunityType, setOpportunityType] = useState('Digital Transformation');
  const [description, setDescription] = useState('Executive proposal grounded in discovery, requirements, and the client\'s current transformation priorities.');
  const [notes, setNotes] = useState('Discovery notes, meeting transcript themes, and requirement clarifications will be used as proposal context.');
  const [selectedTemplateId, setSelectedTemplateId] = useState('');
  const [files, setFiles] = useState<UploadedProjectDocument[]>([]);
  const [resourceInputValue, setResourceInputValue] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [generationError, setGenerationError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const requestInProgress = useRef(false);

  if (!isOpen) return null;

  const handleAddResourceFromCapsule = (textToSubmit?: string) => {
    const rawText = (textToSubmit !== undefined ? textToSubmit : resourceInputValue).trim();
    if (!rawText) return;

    const lower = rawText.toLowerCase();
    let category: UploadedDocCategory = 'Discovery Notes';
    let prefix = 'Discovery_Note';
    if (lower.includes('transcript') || lower.includes('meeting') || lower.includes('call') || lower.includes('recording')) {
      category = 'Meeting Transcription';
      prefix = 'Meeting_Transcription';
    } else if (lower.includes('srs') || lower.includes('spec') || lower.includes('technical') || lower.includes('api') || lower.includes('architecture')) {
      category = 'SRS Document';
      prefix = 'Technical_Spec';
    } else if (lower.includes('requirement') || lower.includes('clarif') || lower.includes('scope') || lower.includes('deliverable')) {
      category = 'Requirement Clarification';
      prefix = 'Requirement_Note';
    }

    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const cleanTitle = rawText.length > 35 ? `${rawText.substring(0, 32)}...` : rawText;
    const newResource: UploadedProjectDocument = {
      id: `PROP-CAPSULE-${Date.now()}`,
      fileName: `${prefix}_${Date.now().toString().slice(-4)}.docx`,
      fileType: 'docx',
      fileSizeBytes: 145000,
      uploadedAt: new Date().toISOString(),
      uploadedBy: 'Nikhil (PM)',
      category,
      sectionReference: `Direct Input • ${timestamp}`,
      pageOrTimestamp: `Recorded at ${timestamp}`,
      snippet: rawText,
      keyRequirementsExtracted: [cleanTitle, 'Directly ingested via proposal resource bar'],
    };

    setFiles(previous => [newResource, ...previous]);
    setResourceInputValue('');
    setIsListening(false);
  };

  const handleToggleDictation = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      try {
        if (isListening) {
          setIsListening(false);
          return;
        }
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US';
        recognition.onstart = () => setIsListening(true);
        recognition.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          if (transcript) setResourceInputValue(previous => previous ? `${previous} ${transcript}` : transcript);
          setIsListening(false);
        };
        recognition.onerror = () => setIsListening(false);
        recognition.onend = () => setIsListening(false);
        recognition.start();
        return;
      } catch (error) {
        console.warn('Speech recognition init error', error);
      }
    }

    if (!isListening) {
      setIsListening(true);
      setTimeout(() => {
        setResourceInputValue('Discovery meeting note: confirm the proposal scope, outcomes, and implementation priorities.');
        setIsListening(false);
      }, 1500);
    } else {
      setIsListening(false);
    }
  };

  const handleFileDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    if (event.dataTransfer.files.length > 0) processFiles(event.dataTransfer.files);
  };

  const processFiles = (fileList: FileList | File[]) => {
    const newFiles = Array.from(fileList).map((file, index): UploadedProjectDocument => {
      const lowerName = file.name.toLowerCase();
      const isPdf = lowerName.endsWith('.pdf');
      let category: UploadedDocCategory = 'Discovery Notes';
      if (lowerName.includes('transcript') || lowerName.includes('meeting')) category = 'Meeting Transcription';
      else if (lowerName.includes('requirement') || lowerName.includes('clarif')) category = 'Requirement Clarification';
      else if (lowerName.includes('srs') || lowerName.includes('spec')) category = 'SRS Document';
      else if (lowerName.includes('arch')) category = 'Architecture & Scope PDF';
      else if (lowerName.includes('brief')) category = 'Client Brief Word Doc';

      return {
        id: `PROP-DOC-${Date.now()}-${index}`,
        fileName: file.name,
        fileType: isPdf ? 'pdf' : lowerName.endsWith('.xlsx') ? 'xlsx' : lowerName.endsWith('.txt') ? 'txt' : 'docx',
        fileSizeBytes: file.size,
        uploadedAt: new Date().toISOString(),
        uploadedBy: 'Nikhil (PM)',
        category,
        sectionReference: `Proposal Intake • ${category}`,
        pageOrTimestamp: isPdf ? 'Multi-page document' : 'Full intake file',
        snippet: `Uploaded proposal resource (${Math.max(1, Math.round(file.size / 1024))} KB).`,
        keyRequirementsExtracted: [`Available as proposal grounding evidence: ${file.name}`],
      };
    });
    setFiles(previous => [...newFiles, ...previous]);
  };
  const handleCreate = async () => {
  if (!selectedTemplateId || requestInProgress.current) return;

  const selectedTemplate = PROPOSAL_TEMPLATES.find(
    template => template.id === selectedTemplateId
  );

  if (!selectedTemplate) {
    setGenerationError('Please select a valid proposal template.');
    return;
  }

  requestInProgress.current = true;
  setIsCreating(true);
  setGenerationError('');

  try {
    // 1. Execute n8n ONCE and generate the proposal content
    const n8nResult = await sendToN8n({
      clientName,
      engagementName: title,
      documentType: 'Proposal',
      meetingTranscript: notes,
      uploadedDocuments: files.map(file => ({
        name: file.fileName,
        content: file.snippet,
      })),
      selectedTemplate: selectedTemplateId,

      // IMPORTANT:
      // Give AI the exact slide structure of the selected template
      templateSections: selectedTemplate.slides.map((slide, index) => ({
        title: slide.title,
        content: slide.content,
        order: index + 1,
      })),
    });

    console.log('N8N GENERATED PROPOSAL:', n8nResult);
    console.log('N8N GENERATED SECTIONS:', n8nResult.sections);

    // 2. Convert AI-generated sections into actual proposal slides
    const generatedSlides: GeneratedProposalSlide[] = (
      n8nResult.sections || []
    )
      .slice(0, selectedTemplate.slides.length)
      .map((section, index): GeneratedProposalSlide => ({
        ...selectedTemplate.slides[index],
        id: `proposal-slide-${index + 1}`,
        title: section.sectionName,
        content: section.content,
      }));

    console.log(
      'PROPOSAL CREATED WITH SLIDES:',
      generatedSlides
    );

    // 3. Make sure AI actually returned slides
    if (generatedSlides.length === 0) {
      throw new Error(
        'n8n completed but did not return any generated proposal slides.'
      );
    }

    // 4. Create the project WITH the generated slides
    const now = new Date().toISOString();

    const proposal: SOWProject = {
      id: `PROP-2026-${Math.floor(Math.random() * 900) + 100}`,
      title: title || `${clientName} Proposal`,
      clientName: clientName || 'Client Organization',
      clientIndustry: industry || 'Enterprise',
      projectType: opportunityType || 'Transformation',
      description,
      meetingNotes: notes,
      uploadedDocuments: files,
      discoveryDocNames: files.map(file => file.fileName),

      proposalTemplateId: selectedTemplateId,

      clientContact: '',
      clientContactEmail: '',
      targetStartDate: '',
      targetEndDate: '',
      currency: 'USD',

      estimatedBudgetPlaceholder:
        '[To be determined during commercial review]',

      status: 'Draft',
      currentStep: 4,
      createdAt: now,
      updatedAt: now,

      ownerName: 'Nikhil',
      ownerEmail: 'nikhil@acme-transform.com',

      additionalRequirements:
        'Use only grounded intake evidence and preserve blank commercial placeholders.',

      selectedTemplateId: '',
      frameworkApproved: true,

      sections: [],

      // THIS IS THE IMPORTANT PART
      // Workspace receives the AI-generated slides immediately
      proposalSlides: generatedSlides,

      exportHistory: [],
    };

    // 5. Open ProposalWorkspace with those already-generated slides
    onCreateProposal(proposal);
    onClose();

  } catch (error) {
    console.error('Proposal n8n generation failed:', error);

    setGenerationError(
      error instanceof Error
        ? error.message
        : 'Proposal generation failed. Check n8n execution.'
    );
  } finally {
    requestInProgress.current = false;
    setIsCreating(false);
  }
};

  
  const canContinue = step === 1 ? Boolean(title.trim() && clientName.trim() && opportunityType.trim()) : step === 3 ? Boolean(selectedTemplateId) : true;
  const selectedTemplate = PROPOSAL_TEMPLATES.find(template => template.id === selectedTemplateId);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs animate-fade-in">
      <div className="flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-xl border border-[#E2E8F0] bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-[#E2E8F0] bg-[#F8FAFC] p-5">
          <div className="flex items-center gap-3">
            <div>
              <h2 className="text-base font-bold text-[#0F172A]">Create New Proposal</h2>
              <p className="text-xs text-[#64748B]">Step {step} of 4 • Prepare grounded proposal inputs</p>
            </div>
          </div>
          <button onClick={onClose} aria-label="Close" className="cursor-pointer rounded-lg p-1.5 text-[#64748B] transition hover:bg-[#F1F5F9] hover:text-[#0F172A]"><X className="h-5 w-5" /></button>
        </div>

        <div className="grid grid-cols-4 border-b border-[#E2E8F0] bg-[#F8FAFC] text-xs font-semibold">
          {['Proposal Information', 'Upload PM Resources', 'Select Template', 'Review & Generate'].map((label, index) => {
            const itemStep = (index + 1) as 1 | 2 | 3 | 4;
            return <button key={label} onClick={() => itemStep <= step && setStep(itemStep)} className={`border-b-2 px-2 py-3 text-center transition ${itemStep <= step ? 'cursor-pointer' : 'cursor-default'} ${step === itemStep ? 'border-[#1D68F2] bg-blue-50/50 text-[#1D68F2]' : 'border-transparent text-[#64748B]'}`}>{index + 1}. {label}</button>;
          })}
        </div>

        <div className="flex-1 space-y-5 overflow-y-auto bg-white p-6">
          {step === 1 && <div className="space-y-4">
            <div><label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[#334155]">Proposal Title</label><input className={inputClass} value={title} onChange={event => setTitle(event.target.value)} placeholder="e.g. Enterprise Cloud Transformation Proposal" /></div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div><label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[#334155]">Client Name</label><input className={inputClass} value={clientName} onChange={event => setClientName(event.target.value)} /></div>
              <div><label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[#334155]">Client Industry</label><input className={inputClass} value={industry} onChange={event => setIndustry(event.target.value)} /></div>
            </div>
            <div><label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[#334155]">Opportunity Type</label><input className={inputClass} value={opportunityType} onChange={event => setOpportunityType(event.target.value)} placeholder="e.g. Modernization, advisory, implementation" /></div>
            <div><label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[#334155]">Proposal Description</label><textarea rows={5} className={`${inputClass} leading-relaxed`} value={description} onChange={event => setDescription(event.target.value)} placeholder="Describe the opportunity and intended business outcome." /></div>
          </div>}

          {step === 2 && <div className="space-y-4">
            <div><h3 className="text-sm font-bold text-[#0F172A]">Upload Document</h3><p className="mt-1 text-xs text-[#64748B]">Attach PM documents or enter live meeting notes & clarifications</p></div>
            <input ref={fileInputRef} type="file" multiple accept=".pdf,.docx,.doc,.txt,.md,.xlsx,.csv,.pptx" className="hidden" onChange={event => { if (event.target.files) processFiles(event.target.files); event.target.value = ''; }} />
            <div onDragOver={event => { event.preventDefault(); setIsDragging(true); }} onDragLeave={() => setIsDragging(false)} onDrop={handleFileDrop} className={`relative flex w-full items-center rounded-full border px-4 py-2.5 shadow-sm transition ${isDragging ? 'border-[#1D68F2] bg-blue-50 ring-2 ring-blue-100' : 'border-[#33353A] bg-white hover:bg-[#FDFBD3] focus-within:border-[#525660] focus-within:ring-1 focus-within:ring-[#525660]'}`}>
              <button type="button" onClick={() => fileInputRef.current?.click()} title="Attach file or document" className="-ml-1 shrink-0 cursor-pointer rounded-full p-1 text-[#94A3B8] transition hover:bg-slate-700/50 hover:text-white"><Plus className="h-5 w-5" /></button>
              <input type="text" value={resourceInputValue} onChange={event => setResourceInputValue(event.target.value)} onKeyDown={event => { if (event.key === 'Enter' && !event.shiftKey) { event.preventDefault(); handleAddResourceFromCapsule(); } }} placeholder="Add resource to create Proposal" className="flex-1 bg-transparent px-3 py-0.5 text-xs text-slate-700 placeholder-[#71717A] focus:outline-none sm:text-sm" />
              <div className="flex shrink-0 items-center space-x-1.5">{resourceInputValue.trim() && <button type="button" onClick={() => handleAddResourceFromCapsule()} className="cursor-pointer rounded-full bg-[#1D68F2] px-3 py-1 text-[11px] font-bold text-white transition hover:bg-[#1554c0]">Add</button>}<button type="button" onClick={handleToggleDictation} title={isListening ? 'Listening... click to stop' : 'Voice dictation / speech transcript'} className={`cursor-pointer rounded-full p-1.5 transition ${isListening ? 'animate-pulse bg-rose-500/20 text-rose-400' : 'text-[#94A3B8] hover:bg-slate-700/50 hover:text-white'}`}><Mic className="h-4 w-4" /></button></div>
            </div>
            <div className="max-h-[340px] space-y-2.5 overflow-y-auto pr-1">{files.map(file => { const isPdf = file.fileType === 'pdf'; return <div key={file.id} className="flex items-start justify-between gap-3 rounded-xl border border-[#E2E8F0] bg-white p-3.5 shadow-xs transition hover:border-[#BFDBFE] hover:bg-[#F8FAFC]"><div className="flex min-w-0 flex-1 items-start space-x-3"><div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-[10px] font-bold">{isPdf ? <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-rose-200 bg-rose-50 text-rose-600">PDF</div> : file.category === 'Meeting Transcription' ? <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-amber-200 bg-amber-50 text-amber-600">TRX</div> : file.category === 'SRS Document' ? <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-purple-200 bg-purple-50 text-purple-600">SRS</div> : <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-blue-200 bg-blue-50 text-blue-600">DOC</div>}</div><div className="min-w-0 flex-1 space-y-1"><div className="flex flex-wrap items-center space-x-2"><span className="truncate text-xs font-bold text-[#0F172A]">{file.fileName}</span><span className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold ${file.category === 'Meeting Transcription' ? 'border-amber-200 bg-amber-50 text-amber-700' : file.category === 'Requirement Clarification' ? 'border-emerald-50 bg-emerald-50 text-emerald-700' : file.category === 'SRS Document' ? 'border-purple-200 bg-purple-50 text-purple-700' : 'border-blue-200 bg-blue-50 text-blue-700'}`}>{file.category}</span></div><div className="text-[11px] text-[#64748B]">Reference: <span className="font-semibold text-[#334155]">{file.sectionReference}</span> • {file.uploadedBy}</div>{file.snippet && <p className="line-clamp-2 rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] p-2 text-[11px] italic text-[#475569]">"{file.snippet}"</p>}</div></div><button type="button" onClick={() => setFiles(previous => previous.filter(item => item.id !== file.id))} title="Remove resource" className="cursor-pointer rounded-md p-1.5 text-[#94A3B8] transition hover:bg-rose-50 hover:text-rose-500"><Trash2 className="h-4 w-4" /></button></div>; })}</div>
          </div>}

          {step === 3 && <div className="space-y-4">
            <div><h3 className="text-sm font-bold text-[#0F172A]">Select Proposal Template</h3><p className="mt-1 text-xs text-[#64748B]">Choose the approved PowerPoint blueprint. The AI will use this structure after you confirm.</p></div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">{PROPOSAL_TEMPLATES.map(template => <button key={template.id} onClick={() => setSelectedTemplateId(template.id)} className={`cursor-pointer rounded-xl border p-4 text-left transition ${selectedTemplateId === template.id ? 'border-[#1D68F2] bg-blue-50/60 ring-2 ring-blue-100' : 'border-[#E2E8F0] hover:border-blue-300 hover:bg-slate-50'}`}><div className="flex items-start justify-between gap-3"><span className="text-sm font-bold text-[#0F172A]">{template.name}</span>{selectedTemplateId === template.id && <Check className="h-4 w-4 shrink-0 text-[#1D68F2]" />}</div><p className="mt-2 text-xs leading-5 text-[#64748B]">{template.description}</p><div className="mt-3 text-[11px] font-semibold text-[#475569]">{template.slideCount} slides • {template.audience}</div></button>)}</div>
            {!selectedTemplateId && <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs font-semibold text-amber-800">Choose a proposal template before continuing.</div>}
          </div>}

          {step === 4 && <div className="space-y-4">
            <div className={`flex items-center gap-3 rounded-xl border p-4 ${generationError ? 'border-red-200 bg-red-50' : 'border-emerald-200 bg-emerald-50'}`}><div><div className={`text-sm font-bold ${generationError ? 'text-red-950' : 'text-emerald-950'}`}>{generationError ? 'Proposal generation failed' : 'Ready to generate proposal'}</div><div className={`mt-1 text-xs ${generationError ? 'text-red-800' : 'text-emerald-800'}`}>{generationError || 'Your selected intake evidence and template will be passed to Proposal Workspace.'}</div></div></div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2"><div className="rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-4"><div className="text-[10px] font-bold uppercase tracking-wider text-[#64748B]">Proposal</div><div className="mt-2 text-sm font-bold text-[#0F172A]">{title}</div><div className="mt-1 text-xs text-[#475569]">{clientName} • {industry}</div><p className="mt-3 text-xs leading-5 text-[#64748B]">{description || 'No additional description provided.'}</p></div><div className="rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-4"><div className="text-[10px] font-bold uppercase tracking-wider text-[#64748B]">Grounding & template</div><div className="mt-2 text-sm font-bold text-[#0F172A]">{selectedTemplate?.name}</div><div className="mt-1 text-xs text-[#475569]">{files.length} uploaded resource{files.length === 1 ? '' : 's'}</div><div className="mt-3 text-xs leading-5 text-[#64748B]">{notes || 'No meeting context provided.'}</div></div></div>
          </div>}
        </div>

        <div className="flex items-center justify-between border-t border-[#E2E8F0] bg-[#F8FAFC] p-4"><button onClick={() => step === 1 ? onClose() : setStep((step - 1) as 1 | 2 | 3 | 4)} className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-[#CBD5E1] bg-white px-4 py-2 text-xs font-semibold text-[#475569] transition hover:bg-slate-50">{step === 1 ? 'Cancel' : <><ArrowLeft className="h-3.5 w-3.5" /> Back</>}</button>{step < 4 ? <button disabled={!canContinue} onClick={() => setStep((step + 1) as 1 | 2 | 3 | 4)} className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-[#1D68F2] px-5 py-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-[#1554c0] disabled:cursor-not-allowed disabled:opacity-50">Next <ArrowRight className="h-3.5 w-3.5" /></button> : <button disabled={isCreating || !selectedTemplateId} onClick={handleCreate} className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-[#1D68F2] px-5 py-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-[#1554c0] disabled:cursor-wait disabled:opacity-60">{isCreating ? 'Preparing Proposal...' : 'Generate Proposal'}</button>}</div>
      </div>
    </div>
  );
};