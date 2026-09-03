import React, { useState, useMemo } from 'react';
import { 
  X, 
  FileText, 
  Download, 
  CheckCircle2, 
  ShieldCheck, 
  AlertTriangle, 
  Lock, 
  Layers, 
  ExternalLink,
  Sparkles,
  FileCheck,
  AlertOctagon,
  Check
} from 'lucide-react';
import { SOWProject, ExportRecord } from '../types/quill';
import { generateAndDownloadDTMCWordDoc, validateSOWForExport, ExportPreflightResult } from '../services/docxExportService';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: SOWProject;
  onExportComplete: (updatedProject: SOWProject) => void;
  onNavigateToSectionReview?: () => void;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  project,
  onExportComplete,
  onNavigateToSectionReview,
}) => {
  const [isExporting, setIsExporting] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);
  const [lastExportName, setLastExportName] = useState('');
  const [exportError, setExportError] = useState<string | null>(null);

  const preflight: ExportPreflightResult = useMemo(() => {
    return validateSOWForExport(project);
  }, [project]);

  if (!isOpen) return null;

  const handleTriggerExport = async () => {
    setExportError(null);
    if (!preflight.canExport) {
      setExportError(`Export blocked by preflight checks: ${preflight.errors.join('; ')}`);
      return;
    }

    setIsExporting(true);
    try {
      // Generate actual downloadable DTMC .docx file
      const result = await generateAndDownloadDTMCWordDoc(project);
      
      const newExportRecord: ExportRecord = {
        id: `EXP-${Math.floor(Math.random() * 9000) + 1000}`,
        exportDate: new Date().toISOString(),
        exportedBy: project.ownerName || 'Project Manager',
        fileName: result.fileName,
        fileSizeBytes: result.sizeBytes,
        format: "DOCX (DTMC Formatted)",
        versionNumber: "1.0",
        sharePointUrl: `https://contoso.sharepoint.com/sites/quill/Generated_SOW_Exports/${result.fileName}`,
        pricingFieldsVerifiedBlank: preflight.pricingCompliant,
      };

      const updatedProject: SOWProject = {
        ...project,
        status: "Exported",
        exportHistory: [newExportRecord, ...project.exportHistory],
      };

      setLastExportName(result.fileName);
      setExportSuccess(true);
      onExportComplete(updatedProject);
    } catch (err: any) {
      console.error("Export error:", err);
      setExportError(err?.message || "An unexpected error occurred during DOCX compilation.");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white border border-[#E2E8F0] rounded-xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-5 border-b border-[#E2E8F0] flex items-center justify-between bg-[#F8FAFC]">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-[#1D68F2]">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#0F172A]">Export DTMC-Formatted Word SOW</h2>
              <p className="text-xs text-[#64748B]">Pre-flight Compliance & Automated .docx Assembly</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#64748B] hover:text-[#0F172A] hover:bg-slate-100 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 bg-white">
          
          {/* Pre-Flight Checklist */}
          <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="text-xs font-bold text-[#0F172A] uppercase tracking-wider">
                Automated Pre-Flight Compliance Checks
              </div>
              <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${
                preflight.canExport 
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                  : 'bg-rose-50 text-rose-700 border-rose-200'
              }`}>
                {preflight.canExport ? 'Preflight Passed (Ready)' : 'Preflight Failed (Blocked)'}
              </span>
            </div>

            <div className="space-y-2 text-xs">
              {/* Human Approval Check */}
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-white border border-[#E2E8F0]">
                <span className="flex items-center space-x-2 text-[#334155]">
                  {preflight.unapprovedSections.length === 0 ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                  )}
                  <span>100% Human Section Approval (Mandatory)</span>
                </span>
                <span className={`font-semibold ${preflight.unapprovedSections.length === 0 ? 'text-emerald-700' : 'text-amber-700'}`}>
                  {preflight.approvedCount} of {preflight.totalSections} Approved
                </span>
              </div>

              {/* Blank Pricing Policy Check */}
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-white border border-[#E2E8F0]">
                <span className="flex items-center space-x-2 text-[#334155]">
                  {preflight.pricingCompliant ? (
                    <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  ) : (
                    <AlertOctagon className="w-4 h-4 text-rose-600 shrink-0" />
                  )}
                  <span>Mandatory Blank Pricing Policy (Req 5)</span>
                </span>
                <span className={`font-semibold ${preflight.pricingCompliant ? 'text-emerald-700' : 'text-rose-700'}`}>
                  {preflight.pricingCompliant ? '100% Guardrail Verified' : `${preflight.pricingViolations.length} Unvetted Figure(s)`}
                </span>
              </div>

              {/* Framework Approval Check */}
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-white border border-[#E2E8F0]">
                <span className="flex items-center space-x-2 text-[#334155]">
                  {project.frameworkApproved ? (
                    <FileCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                  )}
                  <span>Target Template & Framework Approval</span>
                </span>
                <span className={`font-semibold ${project.frameworkApproved ? 'text-emerald-700' : 'text-amber-700'}`}>
                  {project.frameworkApproved ? 'Approved & Locked' : 'Pending PM Approval'}
                </span>
              </div>
            </div>
          </div>

          {/* Preflight Blocking Errors Banner */}
          {!preflight.canExport && (
            <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl space-y-2.5">
              <div className="flex items-center space-x-2 text-rose-800 font-bold text-xs">
                <AlertOctagon className="w-4 h-4 text-rose-600 shrink-0" />
                <span>Export Blocked by Preflight Policy</span>
              </div>
              <ul className="text-xs text-rose-700 space-y-1 pl-4 list-disc">
                {preflight.errors.map((err, idx) => (
                  <li key={idx}>{err}</li>
                ))}
              </ul>
              {onNavigateToSectionReview && preflight.unapprovedSections.length > 0 && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onNavigateToSectionReview();
                  }}
                  className="mt-2 text-xs font-bold text-[#1D68F2] hover:underline flex items-center space-x-1 cursor-pointer"
                >
                  <span>Go to Section Review to complete approvals &rarr;</span>
                </button>
              )}
            </div>
          )}

          {/* Runtime Error Banner */}
          {exportError && (
            <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 space-y-1">
              <div className="font-bold text-rose-800 flex items-center space-x-1">
                <AlertOctagon className="w-4 h-4 text-rose-600" />
                <span>Export Failed</span>
              </div>
              <p>{exportError}</p>
            </div>
          )}

          {/* Success Banner */}
          {exportSuccess && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl space-y-2 animate-fade-in">
              <div className="flex items-center space-x-2 text-emerald-800 font-bold text-sm">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <span>DTMC Word Document Generated & Downloaded!</span>
              </div>
              <p className="text-xs text-[#334155]">
                File <strong className="text-[#0F172A] font-mono">{lastExportName}</strong> has been generated with DTMC corporate typography (Calibri/Aptos) and saved to your device.
              </p>
            </div>
          )}

          {/* Document Summary Info */}
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div className="p-3 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0] space-y-1">
              <div className="text-[#64748B]">Client Organization:</div>
              <div className="font-bold text-[#0F172A] text-sm">{project.clientName}</div>
              {project.clientContact && (
                <div className="text-[11px] text-[#475569] pt-0.5">
                  Contact: <span className="font-semibold text-[#0F172A]">{project.clientContact}</span>
                  {project.clientContactEmail && <span className="text-[#64748B]"> ({project.clientContactEmail})</span>}
                </div>
              )}
            </div>
            <div className="p-3 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0] space-y-1">
              <div className="text-[#64748B]">Accepted SOW Version:</div>
              <div className="font-bold text-[#1D68F2] text-sm">Version 1.0 (Master Contract)</div>
            </div>
          </div>

          {/* Previous Exports History */}
          {project.exportHistory.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-[#64748B] uppercase tracking-wider">
                  Export History ({project.exportHistory.length})
                </span>
                <span className="text-[10px] text-[#64748B] bg-slate-100 px-2 py-0.5 rounded">
                  Local Session History
                </span>
              </div>
              <div className="space-y-1.5">
                {project.exportHistory.map((exp) => (
                  <div 
                    key={exp.id} 
                    className="p-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl flex items-center justify-between text-xs"
                  >
                    <div className="space-y-0.5">
                      <div className="font-mono text-[#1D68F2] font-semibold">{exp.fileName}</div>
                      <div className="text-[#64748B] text-[11px]">
                        Exported by {exp.exportedBy} on {new Date(exp.exportDate).toLocaleString()} • {(exp.fileSizeBytes / 1024).toFixed(1)} KB
                      </div>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                      Exported
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#E2E8F0] bg-[#F8FAFC] flex items-center justify-between">
          <button
            onClick={onClose}
            className="text-xs font-semibold px-4 py-2 text-[#64748B] hover:text-[#0F172A] transition"
          >
            Close
          </button>

          <div className="flex items-center space-x-3">
            {!preflight.canExport && (
              <span className="text-[11px] text-rose-600 font-semibold">
                Preflight requirements unfulfilled
              </span>
            )}
            <button
              onClick={handleTriggerExport}
              disabled={isExporting || !preflight.canExport}
              title={!preflight.canExport ? preflight.errors.join('\n') : undefined}
              className="flex items-center space-x-2 bg-[#1D68F2] hover:bg-[#1554c0] text-white font-bold text-xs px-6 py-2.5 rounded-lg shadow-sm shadow-blue-500/20 transition active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {isExporting ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Assembling DTMC Word (.docx)...</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>Download DTMC Word (.docx)</span>
                </>
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
