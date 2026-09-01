import React from 'react';
import { X, AlertTriangle, CheckCircle2, RefreshCw, Sparkles, Layers, ArrowRight } from 'lucide-react';
import { ImpactAnalysisResult } from '../../types/jira';

interface FrameworkImpactModalProps {
  isOpen: boolean;
  onClose: () => void;
  impactResult: ImpactAnalysisResult;
  onConfirmChanges: () => void;
}

export const FrameworkImpactModal: React.FC<FrameworkImpactModalProps> = ({
  isOpen,
  onClose,
  impactResult,
  onConfirmChanges,
}) => {
  if (!isOpen) return null;

  const requiresRegenCount = impactResult.sectionsRequiringRegeneration.length;
  const unaffectedCount = impactResult.unaffectedApprovedSections.length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-2xl w-full border border-[#E2E8F0] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#E2E8F0] flex items-center justify-between bg-amber-50/60">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center text-amber-700">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-sm font-bold text-[#0F172A]">Framework Impact Analysis</h2>
                <span className="text-[10px] font-mono bg-amber-100 text-amber-800 border border-amber-300 px-1.5 py-0.2 rounded">
                  QTK-020
                </span>
              </div>
              <p className="text-[11px] text-amber-900">Deterministic Section Regeneration & Reapproval Assessment</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4 text-xs overflow-y-auto">
          
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
            <div className="font-bold text-[#0F172A] text-xs">Framework Modifications Detected</div>
            <p className="text-slate-600 text-[11px] leading-relaxed">
              Modifying the approved SOW framework after initial generation triggers deterministic impact scoring. Sections with structural changes are flagged for regeneration or PM re-review, while unaffected approved sections remain intact.
            </p>
          </div>

          {/* Impact Breakdown */}
          {requiresRegenCount > 0 ? (
            <div className="space-y-2">
              <div className="font-bold text-amber-800 uppercase tracking-wider text-[10px] flex items-center justify-between">
                <span>Sections Requiring Regeneration or Re-Review ({requiresRegenCount})</span>
                <span className="text-amber-600">Action Required</span>
              </div>

              <div className="space-y-2">
                {impactResult.sectionsRequiringRegeneration.map((sec, idx) => (
                  <div key={idx} className="p-3 bg-amber-50/70 border border-amber-200 rounded-lg flex items-center justify-between">
                    <div>
                      <div className="font-bold text-[#0F172A]">{sec.sectionTitle}</div>
                      <div className="flex items-center space-x-2 mt-0.5">
                        <span className="text-[10px] font-mono text-amber-800 bg-amber-100 px-1.5 py-0.2 rounded">
                          Impact: {sec.impactType}
                        </span>
                        <span className="text-[10px] text-slate-500">Status: {sec.currentStatus}</span>
                      </div>
                    </div>

                    <span className="text-[10px] font-bold text-amber-900 bg-white border border-amber-300 px-2 py-1 rounded shadow-2xs">
                      {sec.recommendedAction}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 text-xs">
              No existing drafted sections were impacted by this modification.
            </div>
          )}

          {unaffectedCount > 0 && (
            <div className="space-y-2 pt-2 border-t border-slate-200">
              <div className="font-bold text-emerald-800 uppercase tracking-wider text-[10px] flex items-center justify-between">
                <span>Unaffected Approved Content ({unaffectedCount})</span>
                <span className="text-emerald-600">Preserved 100%</span>
              </div>

              <div className="space-y-1.5">
                {impactResult.unaffectedApprovedSections.map((sec, idx) => (
                  <div key={idx} className="p-2 bg-emerald-50/50 border border-emerald-100 rounded-lg flex items-center justify-between text-[11px]">
                    <span className="font-medium text-slate-800">{sec.sectionTitle}</span>
                    <span className="text-[10px] font-bold text-emerald-700 flex items-center space-x-1">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Approved (Untouched)</span>
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-[#E2E8F0] bg-slate-50/50 flex items-center justify-between">
          <button
            onClick={onClose}
            className="bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-semibold px-4 py-2 rounded-lg transition cursor-pointer"
          >
            Cancel Changes
          </button>

          <button
            onClick={() => {
              onConfirmChanges();
              onClose();
            }}
            className="bg-[#1D68F2] hover:bg-[#1554c0] text-white text-xs font-bold px-4 py-2 rounded-lg shadow-sm transition cursor-pointer"
          >
            Confirm Framework & Apply Impact Flags
          </button>
        </div>

      </div>
    </div>
  );
};
