import React, { useState, useRef } from 'react';
import { 
  X, 
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
import { sendToN8n } from '../services/n8nServices';

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
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
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

  // Upload Form & Capsule Input State
  const [resourceInputValue, setResourceInputValue] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [selectedSources, setSelectedSources] = useState<string[]>(['SRC-CL-001', 'SRC-SOW-089', 'SRC-CL-014']);

  if (!isOpen) return null;

  const handleAddResourceFromCapsule = (textToSubmit?: string) => {
    const rawText = (textToSubmit !== undefined ? textToSubmit : resourceInputValue).trim();
    if (!rawText) return;

    const lower = rawText.toLowerCase();
    let category: UploadedDocCategory = 'Requirement Clarification';
    let prefix = 'Intake_Note';

    if (lower.includes('transcript') || lower.includes('meeting') || lower.includes('said') || lower.includes('call') || lower.includes('recording')) {
      category = 'Meeting Transcription';
      prefix = 'Meeting_Transcription';
    } else if (lower.includes('srs') || lower.includes('spec') || lower.includes('technical') || lower.includes('api') || lower.includes('architecture')) {
      category = 'SRS Document';
      prefix = 'Technical_Spec';
    } else if (lower.includes('scope') || lower.includes('deliverable') || lower.includes('phase')) {
      category = 'Client Brief Word Doc';
      prefix = 'Scope_Baseline';
    }

    const timestampStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const cleanTitle = rawText.length > 35 ? `${rawText.substring(0, 32)}...` : rawText;

    const newDoc: UploadedProjectDocument = {
      id: `DOC-CAPSULE-${Date.now()}`,
      fileName: `${prefix}_${Date.now().toString().slice(-4)}.docx`,
      fileType: 'docx',
      fileSizeBytes: 145000,
      uploadedAt: new Date().toISOString(),
      uploadedBy: 'Nikhil (PM)',
      category: category,
      sectionReference: `Direct Input • ${timestampStr}`,
      pageOrTimestamp: `Recorded at ${timestampStr}`,
      snippet: rawText,
      keyRequirementsExtracted: [
        cleanTitle,
        `Directly ingested via SOW resource bar`
      ]
    };

    setUploadedFiles(prev => [newDoc, ...prev]);
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

        recognition.onstart = () => {
          setIsListening(true);
        };

        recognition.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          if (transcript) {
            setResourceInputValue(prev => prev ? `${prev} ${transcript}` : transcript);
          }
          setIsListening(false);
        };

        recognition.onerror = () => {
          setIsListening(false);
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognition.start();
        return;
      } catch (err) {
        console.warn('Speech recognition init error', err);
      }
    }

    // Fallback simulation if speech recognition is unavailable or blocked in iframe
    if (!isListening) {
      setIsListening(true);
      const sampleTranscripts = [
        "Client VP Engineering: Architecture must enforce ISO 27001 compliance and 99.99% availability.",
        "Clarification with PM: 30-day post go-live hypercare support is included within Phase 3.",
        "Discovery meeting note: SSO authentication via Azure AD with conditional MFA required.",
      ];
      const randomTranscript = sampleTranscripts[Math.floor(Math.random() * sampleTranscripts.length)];
      setTimeout(() => {
        setResourceInputValue(randomTranscript);
        setIsListening(false);
      }, 1500);
    } else {
      setIsListening(false);
    }
  };

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

  const handleRemoveUploadedFile = (id: string) => {
    setUploadedFiles(uploadedFiles.filter(f => f.id !== id));
  };

  const handleCreateAndDraft = async () => {
  setIsGenerating(true);

  
    const newId = `PRJ-2026-00${Math.floor(Math.random() * 900) + 100}`;

    const selectedTemplate =
      availableTemplates.find(t => t.id === selectedTemplateId) ||
      availableTemplates[0];
console.log('SENDING TO N8N:', {
  clientName,
  engagementName: projectTitle,
  documentType: 'SOW',
  meetingTranscript: discoveryNotes,
  uploadedDocuments: uploadedFiles,
  selectedTemplateId,
  selectedTemplate,
  templateFileName:
    selectedTemplate?.metadata.wordTemplateFile ||
    selectedTemplate?.metadata.name,
  templateSections: selectedTemplate?.sections
    .filter(section => section.order <= 9 && !section.isAppendix)
    .map(section => ({
      title: section.title,
      category: section.category,
      content: section.content,
      order: section.order,
      isMandatory: section.isMandatory,
    })),
});
console.log('TEMPLATE SENT TO N8N:', {
  selectedTemplateId,
  selectedTemplateName: selectedTemplate?.metadata.name,
  templateFileName: selectedTemplate?.metadata.wordTemplateFile,
});
const n8nResponse = await sendToN8n({
  clientName,
  engagementName: projectTitle,
  documentType: 'SOW',
  meetingTranscript: discoveryNotes,
  uploadedDocuments: uploadedFiles.map(file => ({
    name: file.fileName,
    content: file.snippet,
  })),
  selectedTemplate: selectedTemplateId,
  templateFileName:
    selectedTemplate?.metadata.wordTemplateFile ||
    selectedTemplate?.metadata.name,
  templateSections: selectedTemplate?.sections
    .filter(section => section.order <= 9 && !section.isAppendix)
    .map(section => ({
      title: section.title,
      category: section.category,
      content: section.content,
      order: section.order,
      isMandatory: section.isMandatory,
    })),
});

console.log('n8n SOW response:', n8nResponse);
    

    // Continue building the project from the n8n response...
    
    // Generate sections based on selected template if available
    let fullSections: any[] = [];
    if (selectedTemplate) {
      fullSections = selectedTemplate.sections.map((sec, idx) => {
        const sectionUploadedFiles = uploadedFiles.filter((_, fIdx) => (fIdx % selectedTemplate.sections.length) === (idx % uploadedFiles.length || 0));
        const activeFilesForSec = sectionUploadedFiles.length > 0 ? sectionUploadedFiles : uploadedFiles.slice(0, 2);

        // Replace template placeholders for this project
        const clientSignatory = clientContact || clientName || 'Riley Chen';
        const dtmcCreator = 'Nikhil';

        let synthesizedContent = sec.content
          .split('{{PROJECT_NAME}}').join(projectTitle || `${clientName} SOW`)
          .split('{{CLIENT_ORGANIZATION_NAME}}').join(clientName)
          .split('{{CLIENT_CONTACT_NAME}}').join(clientSignatory)
          .split('{{CLIENT_CONTACT_EMAIL}}').join(clientContactEmail || 'riley.chen@acme.com')
          .split('{{CLIENT_SIGNATORY_NAME}}').join(clientSignatory)
          .split('{{DTMC_SIGNATORY_NAME}}').join(dtmcCreator)
          .split('{{ANTICIPATED_START_DATE}}').join(targetStartDate)
          .split('{{ANTICIPATED_COMPLETION_DATE}}').join(targetEndDate)
          .split('{{CURRENCY}}').join(currency);

        if (sec.order === 9 || (sec.title && sec.title.toLowerCase().includes('authorization')) || synthesizedContent.includes('Accepted by Client')) {
          synthesizedContent = synthesizedContent
            .replace(/(Accepted by Client:[\s\S]*?\*\s*Name:\s*)([^\n]+)/i, `$1${clientSignatory}`)
            .replace(/(Accepted by Client:[\s\S]*?\*\s*Title:\s*)([^\n]+)/i, '$1VP, Transformation')
            .replace(/(Accepted by DTMC:[\s\S]*?\*\s*Name:\s*)([^\n]+)/i, `$1${dtmcCreator}`)
            .replace(/(Accepted by DTMC:[\s\S]*?\*\s*Title:\s*)([^\n]+)/i, '$1Engagement Partner');
        }

        // Clean redundant top title and # heading marks
        synthesizedContent = synthesizedContent
          .replace(/^\s*#{1,6}\s*\d+\.\s*[^\n]+\n+/, '')
          .split('\n')
          .map((line: string) => (/^\s*#{1,6}\s+/.test(line) ? line.replace(/^\s*#{1,6}\s+/, '') : line))
          .join('\n');

        return {
          id: `SEC-${Math.floor(Math.random() * 9000) + 1000}`,
          projectId: newId,
          order: sec.order || idx + 1,
          title: sec.title || `Section ${idx + 1}`,
          category: sec.category || 'Scope',
          content: synthesizedContent,
          status: 'Pending' as const,
          isMandatory: sec.isMandatory,
          isPricingSection: sec.isPricingSection,
          groundedSources: SAMPLE_SOURCE_DOCUMENTS.filter(s => selectedSources.includes(s.id)),
          detailedSources: activeFilesForSec.map((f, dIdx) => ({
            id: `DS-${idx}-${dIdx}`,
            documentId: f.id,
            fileName: f.fileName,
            fileType: f.fileType,
            category: f.category,
            section: sec.title.split(' ')[0] || `Section ${idx + 1}`,
            page: f.fileType === 'pdf' ? (dIdx + 1) * 2 : `Min ${(dIdx + 1) * 10}:00`,
            snippet: f.snippet
          })),
          uploadedDocumentIds: activeFilesForSec.map(f => f.id),
          version: 1,
          lastEditedBy: "Nikhil",
          lastEditedAt: new Date().toISOString(),
          confidenceScore: 94
        };
      });
    } else {
      const defaultSections = generateDefaultFramework(projectType, clientName);
      fullSections = defaultSections.map((sec, idx) => {
        const sectionUploadedFiles = uploadedFiles.filter((_, fIdx) => (fIdx % defaultSections.length) === (idx % uploadedFiles.length || 0));
        const activeFilesForSec = sectionUploadedFiles.length > 0 ? sectionUploadedFiles : uploadedFiles.slice(0, 2);

        return {
          id: `SEC-${Math.floor(Math.random() * 9000) + 1000}`,
          projectId: newId,
          order: sec.order || idx + 1,
          title: sec.title || `Section ${idx + 1}`,
          category: sec.category || 'Scope',
          content: `This section has been synthesized using the uploaded project intake resources (**${uploadedFiles.map(f => f.fileName).slice(0, 2).join('**, **')}**).\n\n*Pending final approval and DTMC formatting.*`,
          status: 'Pending' as const,
          isMandatory: sec.isMandatory ?? true,
          isPricingSection: sec.isPricingSection ?? false,
          groundedSources: SAMPLE_SOURCE_DOCUMENTS.filter(s => selectedSources.includes(s.id)),
          detailedSources: activeFilesForSec.map((f, dIdx) => ({
            id: `DS-${idx}-${dIdx}`,
            documentId: f.id,
            fileName: f.fileName,
            fileType: f.fileType,
            category: f.category,
            section: sec.title.split(' ')[0] || `Section ${idx + 1}`,
            page: f.fileType === 'pdf' ? (dIdx + 1) * 2 : `Min ${(dIdx + 1) * 10}:00`,
            snippet: f.snippet
          })),
          uploadedDocumentIds: activeFilesForSec.map(f => f.id),
          version: 1,
          lastEditedBy: "Nikhil",
          lastEditedAt: new Date().toISOString(),
          confidenceScore: 94
        };
      });
    }

    const newProject: SOWProject = {
      id: newId,
      title: projectTitle || `${clientName} SOW Engagement`,
      clientName,
      clientContact,
      clientContactEmail,
      clientIndustry,
      projectType,
      targetStartDate,
      targetEndDate,
      currency,
      estimatedBudgetPlaceholder: "[To be determined upon finalized staffing schedule]",
      status: "Generated",
      currentStep: 3, // Framework review step
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ownerName: "Nikhil",
      ownerEmail: "nikhil@acme-transform.com",
      description: `SOW for ${clientName} adhering to DTMC Master Services Agreement and SOW standards.`,
      meetingNotes: discoveryNotes,
      discoveryDocNames: uploadedFiles.map(f => f.fileName),
      uploadedDocuments: uploadedFiles,
      additionalRequirements: "Adhere to DTMC corporate styling standards and blank pricing placeholders.",
      selectedTemplateId: selectedTemplateId || "TMPL-DTMC-2025-01",
      wordTemplateFile: "DTMC_Master_SOW_Template_2025.dotx",
      sowFormat: projectType,
      issuerName: "DTMC Advisory Group",
      issuerEmail: "advisory@dtmc.example",
      issuerPhone: "+1 555 010 2000",
      frameworkApproved: false,
      sections: fullSections,
      exportHistory: []
    };

    setIsGenerating(false);
    onCreateProject(newProject);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white border border-[#E2E8F0] rounded-xl w-full max-w-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        
        {/* Modal Header */}
        <div className="p-5 border-b border-[#E2E8F0] flex items-center justify-between bg-[#F8FAFC]">
          <div className="flex items-center space-x-3">

            <div>
              <h2 className="text-base font-bold text-[#0F172A]">Create New SOW Document</h2>
              <p className="text-xs text-[#64748B]">Step {step} of 4 • Prepare grounded SOW inputs</p>
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
        <div className="grid grid-cols-4 border-b border-[#E2E8F0] bg-[#F8FAFC] text-xs font-semibold">
          {[1, 2, 3, 4].map(item => (
            <button
              key={item}
              onClick={() => setStep(item as 1 | 2 | 3 | 4)}
              className={`py-3 text-center border-b-2 transition cursor-pointer ${
                step === item
                  ? 'border-[#1D68F2] text-[#1D68F2] bg-blue-50/50 font-bold'
                  : 'border-transparent text-[#64748B] hover:text-[#0F172A]'
              }`}
            >
              {item === 1 && '1. Client & Scope'}
              {item === 2 && '2. Select Template'}
              {item === 3 && `3. Upload PM Resources (${uploadedFiles.length})`}
              {item === 4 && '4. Review & Generate'}
            </button>
          ))}
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
                 <div className="sm:col-span-2">
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

          {/* STEP 2: SELECT SOW TEMPLATE */}
          {step === 2 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-bold text-[#0F172A]">Select SOW Template</h3>
                <p className="mt-1 text-xs text-[#64748B]">
                  Choose the approved Word blueprint. The AI will use this structure after you confirm.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {availableTemplates.map(template => (
                  <button
                    key={template.id}
                    type="button"
                    onClick={() => setSelectedTemplateId(template.id)}
                    className={`cursor-pointer rounded-xl border p-4 text-left transition ${
                      selectedTemplateId === template.id
                        ? 'border-[#1D68F2] bg-blue-50/60 ring-2 ring-blue-100'
                        : 'border-[#E2E8F0] hover:border-blue-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <span className="text-sm font-bold text-[#0F172A]">
                        {template.metadata.templateType || template.metadata.name}
                      </span>
                      {selectedTemplateId === template.id && (
                        <Check className="h-4 w-4 shrink-0 text-[#1D68F2]" />
                      )}
                    </div>
                    <p className="mt-2 text-xs leading-5 text-[#64748B]">
                      {template.metadata.description}
                    </p>
                    <div className="mt-3 text-[11px] font-semibold text-[#475569]">
                      {template.sections.filter(section => section.order <= 9 && !section.isAppendix).length} sections • v{template.metadata.version}
                    </div>
                    <div className="mt-1 truncate text-[10px] text-[#94A3B8]" title={template.metadata.wordTemplateFile}>
                      {template.metadata.wordTemplateFile}
                    </div>
                  </button>
                ))}
              </div>

              {!selectedTemplateId && (
                <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs font-semibold text-amber-800">
                  Choose an SOW template before continuing.
                </div>
              )}
            </div>
          )}

          {/* STEP 3: UPLOAD PM INTAKE RESOURCES */}
          {step === 3 && (
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
                  <p className="text-xs text-[#64748B]">Attach PM documents or enter live meeting notes & clarifications</p>
                </div>
              </div>

              {/* Resource Capsule Input Bar */}
              <div className="relative flex items-center w-full bg-[#FFFFFF] hover:bg-[#FDFBD3] border border-[#33353A] focus-within:border-[#525660] focus-within:ring-1 focus-within:ring-[#525660] rounded-full px-4 py-2.5 shadow-sm transition">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  title="Attach file or document"
                  className="text-[#94A3B8] hover:text-white transition p-1 -ml-1 rounded-full hover:bg-slate-700/50 cursor-pointer shrink-0"
                >
                  <Plus className="w-5 h-5" />
                </button>

                <input
                  type="text"
                  value={resourceInputValue}
                  onChange={(e) => setResourceInputValue(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleAddResourceFromCapsule();
                    }
                  }}
                  placeholder="Add resource to create SOW"
                  className="flex-1 bg-transparent border-none text-xs sm:text-sm text-slate-100 placeholder-[#71717A] focus:outline-none px-3 py-0.5"
                />

                <div className="flex items-center space-x-1.5 shrink-0">
                  {resourceInputValue.trim() && (
                    <button
                      type="button"
                      onClick={() => handleAddResourceFromCapsule()}
                      className="text-[11px] font-bold bg-[#1D68F2] hover:bg-[#1554c0] text-white px-3 py-1 rounded-full transition cursor-pointer"
                    >
                      Add
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={handleToggleDictation}
                    title={isListening ? "Listening... click to stop" : "Voice dictation / speech transcript"}
                    className={`p-1.5 rounded-full transition cursor-pointer ${
                      isListening 
                        ? 'text-rose-400 bg-rose-500/20 animate-pulse' 
                        : 'text-[#94A3B8] hover:text-white hover:bg-slate-700/50'
                    }`}
                  >
                    <Mic className="w-4 h-4" />
                  </button>
                </div>
              </div>

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
            </div>
          )}

          {/* STEP 4: REVIEW GROUNDING & GENERATE */}
          {step === 4 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-[#0F172A]">SOW Grounding Sources Verification</h3>
                  <p className="text-xs text-[#64748B]">
                    Confirm the {uploadedFiles.length} project resources uploaded.
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
                    onClick={() => setStep(3)}
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
                onClick={() => setStep(prev => (prev - 1) as 1 | 2 | 3 | 4)}
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
            {step < 4 ? (
              <button
                type="button"
                onClick={() => setStep(prev => (prev + 1) as any)}
                className="text-xs bg-[#1D68F2] hover:bg-[#1554c0] text-white font-bold px-5 py-2.5 rounded-lg transition cursor-pointer shadow-xs"
              >
                Next: {step === 1 ? 'Select Template' : step === 2 ? 'Upload PM Resources' : 'Review & Generate'}
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