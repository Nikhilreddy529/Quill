import React, { useState } from 'react';
import { 
  X, 
  Search, 
  ExternalLink, 
  CheckCircle2, 
  ShieldCheck, 
  BookOpen, 
  FileText,
  Building,
  Tag,
  Clock,
  Sparkles,
  FileCode,
  FileCheck2,
  FileSpreadsheet,
  Mic,
  Calendar,
  Layers,
  User,
  Info
} from 'lucide-react';
import { SOWProject, SOWSection, SourceDocument, UploadedProjectDocument } from '../types/quill';

interface SourcesPanelProps {
  isOpen: boolean;
  onClose: () => void;
  project?: SOWProject | null;
  section: SOWSection | null;
  allSources?: SourceDocument[];
}

export const SourcesPanel: React.FC<SourcesPanelProps> = ({
  isOpen,
  onClose,
  project,
  section,
  allSources = [],
}) => {
  const [filterTab, setFilterTab] = useState<'section' | 'all'>('section');
  const [selectedDocId, setSelectedDocId] = useState<string | null>(null);

  if (!isOpen) return null;

  // Project PM-uploaded documents
  const uploadedDocs: UploadedProjectDocument[] = project?.uploadedDocuments || [];

  // Filter documents cited in this active section
  const sectionDocs = uploadedDocs.filter(doc => {
    if (!section) return true;
    if (section.uploadedDocumentIds && section.uploadedDocumentIds.length > 0) {
      return section.uploadedDocumentIds.includes(doc.id);
    }
    return true;
  });

  const displayDocs = filterTab === 'section' ? (sectionDocs.length > 0 ? sectionDocs : uploadedDocs) : uploadedDocs;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/60 backdrop-blur-xs animate-fade-in">
      <div className="w-full max-w-xl bg-white border-l border-[#E2E8F0] h-full flex flex-col shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="p-5 border-b border-[#E2E8F0] flex items-center justify-between bg-[#F8FAFC]">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-lg bg-[#EFF6FF] border border-[#BFDBFE] flex items-center justify-center text-[#1D68F2]">
              <Search className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-[#0F172A]">SOW Intake Sources & Grounding</h2>
              <p className="text-xs text-[#64748B]">
                {section ? `Resources Grounding: ${section.title}` : `PM Uploaded Resources (${project?.title || 'Current SOW'})`}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#64748B] hover:text-[#0F172A] hover:bg-[#F1F5F9] transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Project Scope Context Banner */}
        <div className="p-4 bg-[#F8FAFC] border-b border-[#E2E8F0] text-xs space-y-2">
          <div className="flex items-center justify-between text-[#64748B]">
            <span className="font-semibold text-[#0F172A]">Active Project:</span>
            <span className="font-medium text-[#1D68F2]">{project?.title || 'SOW Document'}</span>
          </div>
          <div className="p-2.5 bg-white rounded-lg border border-[#E2E8F0] text-[11px] text-[#475569] space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-[#0F172A]">Intake Grounding Scope:</span>
              <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-bold text-[10px] border border-emerald-200">
                Strict PM Intake Only
              </span>
            </div>
            <p className="text-[#64748B]">
              Only documents uploaded by the Project Manager during creation of this SOW (Meeting Transcripts, Clarifications, SRS, Scope PDFs, Word briefs) are referenced.
            </p>
          </div>
        </div>

        {/* Tabs Filter */}
        <div className="flex border-b border-[#E2E8F0] bg-[#F8FAFC] px-5 text-xs font-semibold">
          <button
            onClick={() => setFilterTab('section')}
            className={`py-3 px-3 border-b-2 transition cursor-pointer ${
              filterTab === 'section'
                ? 'border-[#1D68F2] text-[#1D68F2] font-bold'
                : 'border-transparent text-[#64748B] hover:text-[#0F172A]'
            }`}
          >
            Cited in This Section ({sectionDocs.length})
          </button>
          <button
            onClick={() => setFilterTab('all')}
            className={`py-3 px-3 border-b-2 transition cursor-pointer ${
              filterTab === 'all'
                ? 'border-[#1D68F2] text-[#1D68F2] font-bold'
                : 'border-transparent text-[#64748B] hover:text-[#0F172A]'
            }`}
          >
            All SOW Uploaded Resources ({uploadedDocs.length})
          </button>
        </div>

        {/* Sources List */}
        <div className="p-5 overflow-y-auto space-y-3.5 flex-1 bg-white">
          <div className="flex items-center justify-between text-xs text-[#64748B]">
            <span className="font-bold text-[#0F172A]">
              {filterTab === 'section' ? "This Section's Cited Documents" : "All Intake Resources Uploaded for this SOW"}
            </span>
            <span className="text-[11px] text-[#64748B]">{displayDocs.length} documents found</span>
          </div>

          {displayDocs.map((doc, idx) => {
            const isPdf = doc.fileType === 'pdf';
            const isSelected = selectedDocId === doc.id;

            return (
              <div
                key={doc.id}
                onClick={() => setSelectedDocId(isSelected ? null : doc.id)}
                className={`border rounded-xl p-4 space-y-3 transition cursor-pointer ${
                  isSelected 
                    ? 'bg-[#F0F7FF] border-[#1D68F2] ring-1 ring-[#1D68F2]/30 shadow-sm' 
                    : 'bg-white border-[#E2E8F0] hover:border-[#BFDBFE] hover:bg-[#F8FAFC]'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start space-x-2.5 min-w-0">
                    <span className="text-xs font-bold text-slate-400 mt-0.5">{idx + 1}.</span>
                    <div className="shrink-0">
                      {isPdf ? (
                        <div className="w-7 h-7 rounded-lg bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center font-bold text-[10px]">
                          PDF
                        </div>
                      ) : doc.category === 'Meeting Transcription' ? (
                        <div className="w-7 h-7 rounded-lg bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center font-bold text-[10px]">
                          TRX
                        </div>
                      ) : doc.category === 'SRS Document' ? (
                        <div className="w-7 h-7 rounded-lg bg-purple-50 border border-purple-200 text-purple-600 flex items-center justify-center font-bold text-[10px]">
                          SRS
                        </div>
                      ) : (
                        <div className="w-7 h-7 rounded-lg bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center font-bold text-[10px]">
                          DOC
                        </div>
                      )}
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-[#0F172A] hover:text-[#1D68F2] transition truncate">
                        {doc.fileName}
                      </div>
                      <div className="text-[11px] text-[#64748B] flex items-center space-x-2 mt-0.5">
                        <span className="font-semibold text-[#334155]">{doc.sectionReference}</span>
                        <span>•</span>
                        <span>{doc.pageOrTimestamp || 'Cited'}</span>
                      </div>
                    </div>
                  </div>

                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border shrink-0 ${
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

                {/* Excerpt Snippet */}
                {doc.snippet && (
                  <div className="p-3 bg-[#F8FAFC] rounded-lg border border-[#E2E8F0] text-xs text-[#334155] leading-relaxed italic">
                    "{doc.snippet}"
                  </div>
                )}

                {/* Extracted Key Requirements list */}
                {doc.keyRequirementsExtracted && doc.keyRequirementsExtracted.length > 0 && (
                  <div className="space-y-1.5 pt-1">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-[#64748B]">
                      Extracted Requirements & PM Inputs:
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {doc.keyRequirementsExtracted.map((req, rIdx) => (
                        <span
                          key={rIdx}
                          className="text-[10px] font-medium bg-white text-[#1D68F2] px-2 py-0.5 rounded-md border border-[#BFDBFE]"
                        >
                          ✓ {req}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Footer details */}
                <div className="pt-2 border-t border-[#F1F5F9] flex items-center justify-between text-[11px] text-[#64748B]">
                  <span>Uploaded by: <strong className="text-[#334155]">{doc.uploadedBy}</strong></span>
                  <span className="text-[10px] text-slate-400">
                    {Math.round(doc.fileSizeBytes / 1024)} KB
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#E2E8F0] bg-[#F8FAFC] flex items-center justify-between">
          <span className="text-xs text-[#64748B]">
            All citations are tied to <strong className="text-[#0F172A]">{project?.title || 'this SOW'}</strong>
          </span>
          <button
            onClick={onClose}
            className="text-xs font-bold px-4 py-2 bg-white hover:bg-slate-50 text-[#0F172A] border border-[#CBD5E1] rounded-lg transition cursor-pointer"
          >
            Close Sources
          </button>
        </div>

      </div>
    </div>
  );
};
