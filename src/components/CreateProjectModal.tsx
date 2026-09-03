import React, { useState, useRef } from 'react';
import { sendToN8n } from '../services/n8nServices';
import { 
  X, 
  Sparkles, 
  Search, 
  FileText, 
  Building, 
  Calendar, 
  DollarSign, 
  ShieldCheck, 
  Check, 
  Layers, 
  AlertCircle,
  FileUp,
  Tag,
  UploadCloud,
  FileCode,
  Mic,
  FileCheck2,
  FileSpreadsheet,
  Trash2,
  Plus,
  Info,
  Sliders,
  Paperclip
} from 'lucide-react';
import { SOWProject, SourceDocument, UploadedProjectDocument, UploadedDocCategory } from '../types/quill';
import { SAMPLE_SOURCE_DOCUMENTS } from '../data/sampleSharePointData';
import { generateDefaultFramework } from '../services/aiGeneratorService';
import { templateService } from '../services/templateService';

interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateProject: (newProject: SOWProject) => void;
}

export const CreateProjectModal: React.FC<CreateProjectModalProps> = ({
  isOpen,
  onClose,
  onCreateProject,
}) => {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [availableTemplates] = useState(() => templateService.getTemplates());
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>(
    availableTemplates[0]?.id || 'TMPL-DTMC-MASTER-2026'
  );

  // Form State
  const [clientName, setClientName] = useState('Acme Global Enterprises');
  const [clientContact, setClientContact] = useState('Riley Chen');
  const [clientContactEmail, setClientContactEmail] = useState('riley.chen@acme.com');
  const [clientIndustry, setClientIndustry] = useState('Financial Services');
  const [projectType, setProjectType] = useState('Cloud Migration');
  const [projectTitle, setProjectTitle] = useState('Acme Multi-Cloud Migration & Security SOW');
  const [targetStartDate, setTargetStartDate] = useState('2026-10-01');
  const [targetEndDate, setTargetEndDate] = useState('2027-03-31');
  const [currency, setCurrency] = useState('USD');
  const [discoveryNotes, setDiscoveryNotes] = useState(
    'Discovery meeting on Aug 26: Client migrating 25 core trading systems to Azure East US. Requires SEC 17a-4 compliant storage, ExpressRoute dual-redundancy, and Zero-Trust conditional access. Strict DTMC document formatting mandated. Note: Pricing rate card will be agreed separately by Commercial Finance.'
  );

  // Uploaded Intake Resources (Meeting Transcriptions, Requirement Clarifications, SRS, PDF/Word)
  const [uploadedFiles, setUploadedFiles] = useState<UploadedProjectDocument[]>([
    {
      id: 'DOC-NEW-001',
      fileName: 'Acme_Discovery_Meeting_Transcription_Aug26.docx',
      fileType: 'docx',
      fileSizeBytes: 245760,
      uploadedAt: new Date().toISOString(),
      uploadedBy: 'Nikhil (PM)',
      category: 'Meeting Transcription',
      sectionReference: 'Section 2.1 • Min 14:20',
      pageOrTimestamp: 'Timestamp 14:20 - 45:10',
      snippet: "Client VP Engineering: 'We need full microservices transformation with SIT/UAT, data migration, and mandatory 30-day go-live hypercare support. Hardware procurement will remain strictly with our internal IT team.'",
      keyRequirementsExtracted: [
        'Microservices architecture migration',
        'SIT and UAT test suite sign-off',
        '30-day post go-live operational support'
      ]
    },
    {
      id: 'DOC-NEW-002',
      fileName: 'Acme_Client_Requirement_Clarifications.docx',
      fileType: 'docx',
      fileSizeBytes: 184320,
      uploadedAt: new Date().toISOString(),
      uploadedBy: 'Nikhil (PM)',
      category: 'Requirement Clarification',
      sectionReference: 'Section 2.2 • Item 4',
      pageOrTimestamp: 'Page 2 of 4',
      snippet: "Email confirmation with CTO: 'Confirmed that data cleansing of legacy archival databases prior to 2020 is out of scope. Third-party software licenses will be procured directly by Acme Corp.'",
      keyRequirementsExtracted: [
        'Data cleansing restricted to active 2020-present datasets',
        'Third-party software licensing excluded from SOW',
        'Access credentials provided within 5 business days'
      ]
    },
    {
      id: 'DOC-NEW-003',
      fileName: 'Acme_Omnichannel_SRS_v2.4.pdf',
      fileType: 'pdf',
      fileSizeBytes: 1258291,
      uploadedAt: new Date().toISOString(),
      uploadedBy: 'Nikhil (PM)',
      category: 'SRS Document',
      sectionReference: 'Section 1 & 2 • Page 12',
      pageOrTimestamp: 'Page 12-18',
      snippet: 'Software Requirements Specification (SRS): High-availability web and mobile portal. System must guarantee Disaster Recovery RTO < 1 hour and RPO < 15 minutes with zero data loss on financial transactions.',
      keyRequirementsExtracted: [
        'RTO < 1 hour and RPO < 15 minutes',
        'High-concurrency e-commerce checkout API',
        'ISO 27001 and PCI-DSS Level 1 compliance'
      ]
    },
    {
      id: 'DOC-NEW-004',
      fileName: 'Acme_IT_Infrastructure_Assessment.pdf',
      fileType: 'pdf',
      fileSizeBytes: 860160,
      uploadedAt: new Date().toISOString(),
      uploadedBy: 'Nikhil (PM)',
      category: 'Architecture & Scope PDF',
      sectionReference: 'Section 4 • Page 6',
      pageOrTimestamp: 'Page 6 of 22',
      snippet: 'Technical audit of on-premise VMware infrastructure: 48 virtual nodes, dual SQL Server 2019 clusters, and legacy AS400 middleware bridges.',
      keyRequirementsExtracted: [
        'Migration of 48 VM workloads',
        'Database modernization to Azure SQL Managed Instance'
      ]
    },
    {
      id: 'DOC-NEW-005',
      fileName: 'Acme_Digital_Transformation_Scope_Baseline.docx',
      fileType: 'docx',
      fileSizeBytes: 317440,
      uploadedAt: new Date().toISOString(),
      uploadedBy: 'Nikhil (PM)',
      category: 'Client Brief Word Doc',
      sectionReference: 'Section 2 & 3 • Page 3',
      pageOrTimestamp: 'Page 3 of 8',
      snippet: 'Deliverables baseline agreed during pre-sales: DEL-01 Architecture Blueprint, DEL-02 Microservices Codebase, DEL-03 Migration Verification, DEL-04 Operational Runbook.',
      keyRequirementsExtracted: [
        'Contractual deliverable references DEL-01 to DEL-04',
        'Agile two-week sprint cadences'
      ]
    }
  ]);

  // Upload Form UI State
  const [isAddingCustomFile, setIsAddingCustomFile] = useState(false);
  const [newFileName, setNewFileName] = useState('');
  const [newFileCategory, setNewFileCategory] = useState<UploadedDocCategory>('Meeting Transcription');
  const [newFileSnippet, setNewFileSnippet] = useState('');
  const [selectedSources, setSelectedSources] = useState<string[]>(['SRC-CL-001', 'SRC-SOW-089', 'SRC-CL-014']);

  if (!isOpen) return null;

  const processSelectedFiles = (files: FileList | File[]) => {
    const newDocs: UploadedProjectDocument[] = [];
    
    Array.from(files).forEach((file, index) => {
      const fileName = file.name;
      const isPdf = fileName.toLowerCase().endsWith('.pdf');
      const isDocx = fileName.toLowerCase().endsWith('.docx') || fileName.toLowerCase().endsWith('.doc');
      const isSpreadsheet = fileName.toLowerCase().endsWith('.xlsx') || fileName.toLowerCase().endsWith('.csv');
      const isTxt = fileName.toLowerCase().endsWith('.txt') || fileName.toLowerCase().endsWith('.md');
      const fileType = isPdf ? 'pdf' : (isDocx ? 'docx' : 'docx');
      
      let category: UploadedDocCategory = 'Meeting Transcription';
      const lower = fileName.toLowerCase();
      if (lower.includes('srs') || lower.includes('spec') || lower.includes('technical')) {
        category = 'SRS Document';
      } else if (lower.includes('clarif') || lower.includes('qa') || lower.includes('q&a') || lower.includes('notes') || lower.includes('requirement')) {
        category = 'Requirement Clarification';
      } else if (lower.includes('arch') || lower.includes('assess') || isPdf) {
        category = 'Architecture & Scope PDF';
      } else if (lower.includes('brief') || lower.includes('charter') || isDocx) {
        category = 'Client Brief Word Doc';
      }

      const formattedSize = file.size > 1048576 
        ? `${(file.size / 1048576).toFixed(1)} MB` 
        : `${Math.round(file.size / 1024)} KB`;

      newDocs.push({
        id: `DOC-UPLOAD-${Date.now()}-${index}`,
        fileName: fileName,
        fileType: fileType,
        fileSizeBytes: file.size || 280000,
        uploadedAt: new Date().toISOString(),
        uploadedBy: 'Nikhil (PM)',
        category: category,
        sectionReference: `Device Upload • ${category}`,
        pageOrTimestamp: isPdf ? 'Multi-page document' : 'Full intake file',
        snippet: `Locally attached file from user device (${formattedSize}). Content will be ingested for SOW section generation.`,
        keyRequirementsExtracted: [
          `Uploaded from computer: ${fileName}`,
          `Integrated into SOW contextual evidence`
        ]
      });
    });

    if (newDocs.length > 0) {
      setUploadedFiles(prev => [...newDocs, ...prev]);
    }
  };

  const handleNativeFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processSelectedFiles(e.target.files);
      e.target.value = '';
    }
  };

  const handleFileDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processSelectedFiles(e.dataTransfer.files);
    }
  };

  const handleAddUploadedFile = () => {
    if (!newFileName.trim()) return;
    const isPdf = newFileName.toLowerCase().endsWith('.pdf');
    const isDocx = newFileName.toLowerCase().endsWith('.docx') || newFileName.toLowerCase().endsWith('.doc');
    const fileType = isPdf ? 'pdf' : (isDocx ? 'docx' : 'docx');

    const newDoc: UploadedProjectDocument = {
      id: `DOC-NEW-${Date.now()}`,
      fileName: newFileName.trim(),
      fileType: fileType,
      fileSizeBytes: 350000,
      uploadedAt: new Date().toISOString(),
      uploadedBy: 'Nikhil (PM)',
      category: newFileCategory,
      sectionReference: `Section 2 • ${newFileCategory}`,
      pageOrTimestamp: isPdf ? 'Page 1-5' : 'Min 05:00',
      snippet: newFileSnippet.trim() || `Uploaded ${newFileCategory} document containing client specifications and requirements.`,
      keyRequirementsExtracted: [
        'Extracted requirement from uploaded resource',
        'Directly grounded in PM intake document'
      ]
    };

    setUploadedFiles([newDoc, ...uploadedFiles]);
    setNewFileName('');
    setNewFileSnippet('');
    setIsAddingCustomFile(false);
  };

  const handleRemoveUploadedFile = (id: string) => {
    setUploadedFiles(uploadedFiles.filter(f => f.id !== id));
  };

  const handleCreateAndDraft = async () => {
    setIsGenerating(true);
    try {
    const n8nResult = await sendToN8n({
      clientName,
      engagementName: projectTitle,
      meetingTranscript: discoveryNotes,
      uploadedDocuments: uploadedFiles.map(file => ({
        name: file.fileName,
        content: file.snippet,
      })),
      selectedTemplate: selectedTemplateId,
    });

    console.log('n8n SOW result:', n8nResult);

    if (!n8nResult.sections || n8nResult.sections.length === 0) {
      throw new Error('n8n returned no SOW sections.');
    }

    const projectId =
      n8nResult.project?.projectId || `PRJ-${Date.now()}`;

    const newProject: SOWProject = {
      id: projectId,
      title: projectTitle || `${clientName} SOW Engagement`,
      clientName,
      clientContact,
      clientContactEmail,
      clientIndustry,
      projectType,
      targetStartDate,
      targetEndDate,
      currency,
      estimatedBudgetPlaceholder:
        "[To be determined upon finalized staffing schedule]",
      status: "Generated",
      currentStep: 3,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ownerName: "Nikhil",
      ownerEmail: "nikhil@acme-transform.com",
      description:
        `SOW for ${clientName} generated using the selected template and project sources.`,
      meetingNotes: discoveryNotes,
      discoveryDocNames: uploadedFiles.map(f => f.fileName),
      uploadedDocuments: uploadedFiles,
      additionalRequirements:
        "Adhere to DTMC corporate styling standards and blank pricing placeholders.",
      selectedTemplateId,
      frameworkApproved: false,

      sections: n8nResult.sections.map((section, index) => ({
        id: `SEC-${Date.now()}-${index}`,
        projectId: projectId,
        order: index + 1,
        title: section.sectionName,
        category: 'Scope',
        content: section.content,
        status: 'Pending' as const,
        isMandatory: true,
        isPricingSection: false,
        groundedSources: SAMPLE_SOURCE_DOCUMENTS.filter(
          s => selectedSources.includes(s.id)
        ),
        detailedSources: [],
        uploadedDocumentIds: uploadedFiles.map(f => f.id),
        version: 1,
        lastEditedBy: "Nikhil",
        lastEditedAt: new Date().toISOString(),
        confidenceScore: n8nResult.confidenceScore || 0
      })),

      exportHistory: []
    };

    setIsGenerating(false);
    onCreateProject(newProject);
    onClose();

  } catch (error) {
    console.error('n8n SOW generation failed:', error);
    setIsGenerating(false);
    alert(
      'SOW generation failed. Please check the n8n workflow and try again.'
    );
  }
};
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white border border-[#E2E8F0] rounded-xl w-full max-w-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        
        {/* Modal Header */}
        <div className="p-5 border-b border-[#E2E8F0] flex items-center justify-between bg-[#F8FAFC]">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-lg bg-[#EFF6FF] border border-[#BFDBFE] flex items-center justify-center text-[#1D68F2]">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#0F172A]">Create New SOW Document</h2>
              <p className="text-xs text-[#64748B]">Step {step} of 3 • Attach Meeting Transcriptions, Clarifications & SRS Documents</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#64748B] hover:text-[#0F172A] hover:bg-[#F1F5F9] transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Indicator */}
        <div className="grid grid-cols-3 border-b border-[#E2E8F0] bg-[#F8FAFC] text-xs font-semibold">
          <button 
            onClick={() => setStep(1)}
            className={`py-3 text-center border-b-2 transition cursor-pointer ${
              step === 1 ? 'border-[#1D68F2] text-[#1D68F2] bg-blue-50/50 font-bold' : 'border-transparent text-[#64748B] hover:text-[#0F172A]'
            }`}
          >
            1. Client & Scope
          </button>
          <button 
            onClick={() => setStep(2)}
            className={`py-3 text-center border-b-2 transition cursor-pointer ${
              step === 2 ? 'border-[#1D68F2] text-[#1D68F2] bg-blue-50/50 font-bold' : 'border-transparent text-[#64748B] hover:text-[#0F172A]'
            }`}
          >
            2. Upload PM Resources ({uploadedFiles.length})
          </button>
          <button 
            onClick={() => setStep(3)}
            className={`py-3 text-center border-b-2 transition cursor-pointer ${
              step === 3 ? 'border-[#1D68F2] text-[#1D68F2] bg-blue-50/50 font-bold' : 'border-transparent text-[#64748B] hover:text-[#0F172A]'
            }`}
          >
            3. Review Grounding & Generate
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1 bg-white">
          
          {/* STEP 1: CLIENT & SCOPE */}
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#334155] uppercase tracking-wider mb-1.5">
                  SOW Title
                </label>
                <input
                  type="text"
                  value={projectTitle}
                  onChange={(e) => setProjectTitle(e.target.value)}
                  className="w-full bg-white border border-[#CBD5E1] rounded-lg px-3.5 py-2.5 text-sm text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#1D68F2] font-medium"
                  placeholder="e.g. Acme Enterprise Digital Transformation SOW"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#334155] uppercase tracking-wider mb-1.5">
                    Client Name
                  </label>
                  <input
                    type="text"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    className="w-full bg-white border border-[#CBD5E1] rounded-lg px-3.5 py-2.5 text-sm text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#1D68F2]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#334155] uppercase tracking-wider mb-1.5">
                    SOW Architecture Template
                  </label>
                  <select
                    value={selectedTemplateId}
                    onChange={(e) => setSelectedTemplateId(e.target.value)}
                    className="w-full bg-white border border-[#CBD5E1] rounded-lg px-3.5 py-2.5 text-sm text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#1D68F2] cursor-pointer"
                  >
                    {availableTemplates.map(t => (
                      <option key={t.id} value={t.id}>
                        {t.metadata.name} (v{t.metadata.version})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#334155] uppercase tracking-wider mb-1.5">
                    Client Contact
                  </label>
                  <input
                    type="text"
                    value={clientContact}
                    onChange={(e) => setClientContact(e.target.value)}
                    placeholder="e.g. Riley Chen"
                    className="w-full bg-white border border-[#CBD5E1] rounded-lg px-3.5 py-2.5 text-sm text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#1D68F2]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#334155] uppercase tracking-wider mb-1.5">
                    Client Email
                  </label>
                  <input
                    type="email"
                    value={clientContactEmail}
                    onChange={(e) => setClientContactEmail(e.target.value)}
                    placeholder="e.g. riley.chen@acme.com"
                    className="w-full bg-white border border-[#CBD5E1] rounded-lg px-3.5 py-2.5 text-sm text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#1D68F2]"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: UPLOAD PM INTAKE RESOURCES */}
          {step === 2 && (
            <div className="space-y-4">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleNativeFileUpload}
                multiple
                accept=".pdf,.docx,.doc,.txt,.md,.json,.xlsx,.csv,.pptx"
                className="hidden"
              />

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-[#0F172A]">Upload Document</h3>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center space-x-1.5 text-xs font-bold bg-[#1D68F2] hover:bg-[#1554c0] text-white px-3.5 py-1.5 rounded-lg transition cursor-pointer shadow-xs"
                  >
                    <UploadCloud className="w-3.5 h-3.5" />
                    <span>Attach Document</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsAddingCustomFile(prev => !prev)}
                    className="flex items-center space-x-1 text-xs font-semibold bg-[#F1F5F9] text-[#475569] hover:bg-[#E2E8F0] px-3 py-1.5 rounded-lg transition cursor-pointer"
                    title="Manual document text entry"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Manual Entry</span>
                  </button>
                </div>
              </div>

              {/* Drag & Drop Local Device Upload Zone */}
              <div
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleFileDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`p-4 border-2 border-dashed rounded-xl flex items-center justify-center space-x-3 cursor-pointer transition ${
                  isDragging
                    ? 'border-[#1D68F2] bg-blue-50/70'
                    : 'border-[#CBD5E1] bg-[#F8FAFC] hover:bg-[#F1F5F9] hover:border-[#94A3B8]'
                }`}
              >
                <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-[#1D68F2] shrink-0">
                  <UploadCloud className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <div className="text-xs font-semibold text-[#0F172A]">
                    Click to select or drag and drop files from your device
                  </div>
                  <div className="text-[11px] text-[#64748B]">
                    Accepts Word (.docx), PDF (.pdf), Text (.txt, .md), and Spreadsheets (.xlsx)
                  </div>
                </div>
              </div>

              {/* Add Custom File Inline Panel */}
              {isAddingCustomFile && (
                <div className="p-4 bg-[#F8FAFC] border border-[#BFDBFE] rounded-xl space-y-3 animate-fade-in">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#1D68F2]">Upload New Project Resource</span>
                    <button 
                      onClick={() => setIsAddingCustomFile(false)} 
                      className="text-xs text-[#64748B] hover:text-[#0F172A]"
                    >
                      Cancel
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-[#475569] mb-1">File Name (.docx, .pdf, .txt)</label>
                      <input
                        type="text"
                        value={newFileName}
                        onChange={(e) => setNewFileName(e.target.value)}
                        placeholder="e.g. Client_Q&A_Requirement_Clarifications.docx"
                        className="w-full bg-white border border-[#CBD5E1] rounded-lg px-3 py-1.5 text-xs text-[#0F172A] focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-[#475569] mb-1">Resource Category</label>
                      <select
                        value={newFileCategory}
                        onChange={(e) => setNewFileCategory(e.target.value as UploadedDocCategory)}
                        className="w-full bg-white border border-[#CBD5E1] rounded-lg px-3 py-1.5 text-xs text-[#0F172A] focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
                      >
                        <option value="Meeting Transcription">Meeting Transcription (.docx / .txt)</option>
                        <option value="Requirement Clarification">Requirement Clarification (.docx / .pdf)</option>
                        <option value="SRS Document">SRS Document (.pdf / .docx)</option>
                        <option value="Architecture & Scope PDF">Architecture & Scope PDF</option>
                        <option value="Client Brief Word Doc">Client Brief Word Doc</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-[#475569] mb-1">Key Excerpt / Meeting Transcript Notes</label>
                    <textarea
                      rows={2}
                      value={newFileSnippet}
                      onChange={(e) => setNewFileSnippet(e.target.value)}
                      placeholder="Paste key requirements or quotes from the meeting transcript or specification..."
                      className="w-full bg-white border border-[#CBD5E1] rounded-lg p-2 text-xs text-[#0F172A] focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={handleAddUploadedFile}
                      disabled={!newFileName.trim()}
                      className="text-xs font-bold bg-[#1D68F2] hover:bg-[#1554c0] text-white px-4 py-1.5 rounded-lg transition disabled:opacity-50 cursor-pointer"
                    >
                      Add to SOW Sources
                    </button>
                  </div>
                </div>
              )}

              {/* Uploaded Documents List */}
              <div className="space-y-2.5 max-h-[340px] overflow-y-auto pr-1">
                {uploadedFiles.map((doc, idx) => {
                  const isPdf = doc.fileType === 'pdf';
                  return (
                    <div
                      key={doc.id}
                      className="p-3.5 rounded-xl border border-[#E2E8F0] hover:border-[#BFDBFE] bg-white hover:bg-[#F8FAFC] transition flex items-start justify-between gap-3 shadow-xs"
                    >
                      <div className="flex items-start space-x-3 min-w-0 flex-1">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 font-bold text-[10px] shadow-xs">
                          {isPdf ? (
                            <div className="w-8 h-8 rounded-lg bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center font-bold text-[10px]">
                              PDF
                            </div>
                          ) : doc.category === 'Meeting Transcription' ? (
                            <div className="w-8 h-8 rounded-lg bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center font-bold text-[10px]">
                              TRX
                            </div>
                          ) : doc.category === 'SRS Document' ? (
                            <div className="w-8 h-8 rounded-lg bg-purple-50 border border-purple-200 text-purple-600 flex items-center justify-center font-bold text-[10px]">
                              SRS
                            </div>
                          ) : (
                            <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center font-bold text-[10px]">
                              DOC
                            </div>
                          )}
                        </div>

                        <div className="min-w-0 flex-1 space-y-1">
                          <div className="flex items-center space-x-2 flex-wrap">
                            <span className="text-xs font-bold text-[#0F172A] truncate">{doc.fileName}</span>
                            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                              doc.category === 'Meeting Transcription'
                                ? 'bg-amber-50 text-amber-700 border-amber-200'
                                : doc.category === 'Requirement Clarification'
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                : doc.category === 'SRS Document'
                                ? 'bg-purple-50 text-purple-700 border-purple-200'
                                : 'bg-blue-50 text-blue-700 border-blue-200'
                            }`}>
                              {doc.category}
                            </span>
                          </div>

                          <div className="text-[11px] text-[#64748B]">
                            Reference: <span className="font-semibold text-[#334155]">{doc.sectionReference}</span> • {doc.uploadedBy}
                          </div>

                          {doc.snippet && (
                            <p className="text-[11px] text-[#475569] italic bg-[#F8FAFC] p-2 rounded-lg border border-[#E2E8F0] line-clamp-2">
                              "{doc.snippet}"
                            </p>
                          )}
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleRemoveUploadedFile(doc.id)}
                        className="p-1.5 text-[#94A3B8] hover:text-rose-500 hover:bg-rose-50 rounded-md transition cursor-pointer"
                        title="Remove file"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  );
                })}
              </div>

              {/* Discovery Notes Box */}
              <div className="pt-2">
                <label className="block text-xs font-semibold text-[#334155] uppercase tracking-wider mb-1.5">
                  Discovery Meeting Notes & Summary Context
                </label>
                <textarea
                  rows={3}
                  value={discoveryNotes}
                  onChange={(e) => setDiscoveryNotes(e.target.value)}
                  className="w-full bg-white border border-[#CBD5E1] rounded-lg p-2.5 text-xs text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#1D68F2] leading-relaxed"
                  placeholder="Paste discovery notes here..."
                />
              </div>

              <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl flex items-start space-x-2.5">
                <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div className="text-xs text-amber-800 leading-relaxed">
                  <span className="font-bold text-amber-900">Mandatory Blank Pricing Policy:</span> In compliance with enterprise business rules, all generated pricing sections and rate schedules will remain intentionally blank placeholders for commercial finance sign-off.
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: REVIEW GROUNDING & GENERATE */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-[#0F172A]">SOW Grounding Sources Verification</h3>
                  <p className="text-xs text-[#64748B]">
                    Confirm the {uploadedFiles.length} project resources uploaded by the Project Manager that will be used to ground every section of this SOW.
                  </p>
                </div>
                <span className="text-xs text-[#1D68F2] font-semibold bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200">
                  {uploadedFiles.length} Uploaded Resources Active
                </span>
              </div>

              {/* Uploaded Resources Summary Card */}
              <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-4 space-y-3">
                <div className="text-xs font-bold text-[#0F172A] flex items-center justify-between">
                  <span>Resources Attached to this SOW:</span>
                  <button 
                    onClick={() => setStep(2)}
                    className="text-[11px] font-semibold text-[#1D68F2] hover:underline cursor-pointer"
                  >
                    Edit / Add more files
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {uploadedFiles.map((doc, idx) => (
                    <div key={doc.id} className="p-2 bg-white rounded-lg border border-[#E2E8F0] flex items-center space-x-2 text-xs">
                      <span className="text-slate-400 font-bold">{idx + 1}.</span>
                      <div className="w-4 h-4 rounded bg-blue-50 text-[#1D68F2] flex items-center justify-center font-bold text-[8px]">
                        {doc.fileType.toUpperCase()}
                      </div>
                      <span className="truncate font-semibold text-[#0F172A] flex-1">{doc.fileName}</span>
                      <span className="text-[10px] text-slate-500 font-medium shrink-0">{doc.category}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-[#E2E8F0] bg-[#F8FAFC] flex items-center justify-between">
          <div>
            {step > 1 ? (
              <button
                type="button"
                onClick={() => setStep(prev => (prev - 1) as any)}
                className="text-xs text-[#475569] hover:text-[#0F172A] font-semibold px-4 py-2 rounded-lg bg-white hover:bg-slate-50 border border-[#CBD5E1] transition cursor-pointer"
              >
                Back
              </button>
            ) : (
              <button
                type="button"
                onClick={onClose}
                className="text-xs text-[#64748B] hover:text-[#0F172A] font-semibold px-4 py-2 cursor-pointer"
              >
                Cancel
              </button>
            )}
          </div>

          <div className="flex items-center space-x-3">
            {step < 3 ? (
              <button
                type="button"
                onClick={() => setStep(prev => (prev + 1) as any)}
                className="text-xs bg-[#1D68F2] hover:bg-[#1554c0] text-white font-bold px-5 py-2.5 rounded-lg transition cursor-pointer shadow-xs"
              >
                Next: {step === 1 ? 'Upload PM Resources' : 'Review & Generate'}
              </button>
            ) : (
              <button
                type="button"
                onClick={handleCreateAndDraft}
                disabled={isGenerating || uploadedFiles.length === 0}
                className="flex items-center space-x-2 bg-[#1D68F2] hover:bg-[#1554c0] text-white font-bold px-6 py-2.5 rounded-lg shadow-md shadow-blue-500/20 transition active:scale-95 disabled:opacity-50 cursor-pointer text-xs"
              >
                {isGenerating ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Synthesizing PM Uploaded Resources...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Generate SOW from Uploaded Sources</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
