import React from 'react';
import { 
  X, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  ShieldCheck, 
  FileText, 
  Sparkles,
  ArrowRight,
  ExternalLink
} from 'lucide-react';
import { TemplateValidationResult, ValidationSeverity } from '../../types/template';

interface TemplateValidationModalProps {
  isOpen: boolean;
  onClose: () => void;
  result: TemplateValidationResult | null;
  templateName: string;
  onMarkReadyForUse?: () => void;
  onGoToSection?: (sectionId: string) => void;
}

export const TemplateValidationModal: React.FC<TemplateValidationModalProps> = ({
  isOpen,
  onClose,
  result,
  templateName,
  onMarkReadyForUse,
  onGoToSection
}) => {
  const [activeFilter, setActiveFilter] = React.useState<'ALL' | ValidationSeverity>('ALL');

  if (!isOpen || !result) return null;

  const filteredItems = activeFilter === 'ALL' 
    ? result.items 
    : result.items.filter(i => i.severity === activeFilter);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white border border-[#E2E8F0] rounded-xl w-full max-w-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-5 border-b border-[#E2E8F0] flex items-center justify-between bg-[#F8FAFC]">
          <div className="flex items-center space-x-3">
            <div className={`w-9 h-9 rounded-lg flex items-center justify-center font-bold ${
              result.isValid 
                ? 'bg-emerald-50 border border-emerald-200 text-emerald-600' 
                : 'bg-rose-50 border border-rose-200 text-rose-600'
            }`}>
              {result.isValid ? <ShieldCheck className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-base font-bold text-[#0F172A]">Template Validation Report</h2>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                  result.isValid 
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                    : 'bg-rose-50 text-rose-700 border-rose-200'
                }`}>
                  {result.isValid ? 'VALIDATED' : 'ACTION REQUIRED'}
                </span>
              </div>
              <p className="text-xs text-[#64748B] truncate max-w-lg">
                Validation check for: <span className="font-semibold text-[#334155]">{templateName}</span>
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

        {/* Metric Summary Banner */}
        <div className="grid grid-cols-3 border-b border-[#E2E8F0] bg-white divide-x divide-[#E2E8F0] text-center p-3">
          <button
            onClick={() => setActiveFilter(activeFilter === 'Passed' ? 'ALL' : 'Passed')}
            className={`py-1.5 px-3 rounded-lg transition cursor-pointer flex items-center justify-center space-x-2 ${
              activeFilter === 'Passed' ? 'bg-emerald-50 font-bold' : 'hover:bg-slate-50'
            }`}
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <span className="text-xs text-[#334155]">Passed:</span>
            <span className="text-xs font-bold text-emerald-700">{result.passedCount}</span>
          </button>

          <button
            onClick={() => setActiveFilter(activeFilter === 'Warning' ? 'ALL' : 'Warning')}
            className={`py-1.5 px-3 rounded-lg transition cursor-pointer flex items-center justify-center space-x-2 ${
              activeFilter === 'Warning' ? 'bg-amber-50 font-bold' : 'hover:bg-slate-50'
            }`}
          >
            <AlertTriangle className="w-4 h-4 text-amber-500" />
            <span className="text-xs text-[#334155]">Warnings:</span>
            <span className="text-xs font-bold text-amber-700">{result.warningCount}</span>
          </button>

          <button
            onClick={() => setActiveFilter(activeFilter === 'Failed' ? 'ALL' : 'Failed')}
            className={`py-1.5 px-3 rounded-lg transition cursor-pointer flex items-center justify-center space-x-2 ${
              activeFilter === 'Failed' ? 'bg-rose-50 font-bold' : 'hover:bg-slate-50'
            }`}
          >
            <XCircle className="w-4 h-4 text-rose-500" />
            <span className="text-xs text-[#334155]">Failed:</span>
            <span className="text-xs font-bold text-rose-700">{result.failedCount}</span>
          </button>
        </div>

        {/* Validation Items List */}
        <div className="p-6 overflow-y-auto space-y-3 flex-1 bg-[#F8FAFC]">
          {filteredItems.length === 0 ? (
            <div className="text-center py-10 text-xs text-[#64748B]">
              No validation items match the selected filter.
            </div>
          ) : (
            filteredItems.map(item => {
              const isPass = item.severity === 'Passed';
              const isWarn = item.severity === 'Warning';
              const isFail = item.severity === 'Failed';

              return (
                <div 
                  key={item.id}
                  className={`p-3.5 rounded-xl border bg-white shadow-xs transition flex items-start justify-between gap-3 ${
                    isPass ? 'border-emerald-200' : isWarn ? 'border-amber-200' : 'border-rose-200'
                  }`}
                >
                  <div className="flex items-start space-x-3 flex-1 min-w-0">
                    <div className="shrink-0 mt-0.5">
                      {isPass && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
                      {isWarn && <AlertTriangle className="w-4 h-4 text-amber-500" />}
                      {isFail && <XCircle className="w-4 h-4 text-rose-500" />}
                    </div>

                    <div className="min-w-0 space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-bold text-[#0F172A]">{item.ruleName}</span>
                        <span className={`text-[10px] font-semibold px-2 py-0.2 rounded-full border ${
                          isPass 
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                            : isWarn 
                            ? 'bg-amber-50 text-amber-700 border-amber-200' 
                            : 'bg-rose-50 text-rose-700 border-rose-200'
                        }`}>
                          {item.severity}
                        </span>
                        <span className="text-[10px] text-[#64748B] font-mono">[{item.category}]</span>
                      </div>

                      <p className="text-xs text-[#475569] leading-relaxed">
                        {item.message}
                      </p>
                    </div>
                  </div>

                  {item.sectionId && onGoToSection && (
                    <button
                      onClick={() => {
                        onGoToSection(item.sectionId!);
                        onClose();
                      }}
                      className="shrink-0 text-[11px] font-semibold text-[#1D68F2] hover:underline flex items-center space-x-1 cursor-pointer pt-1"
                    >
                      <span>Jump to section</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#E2E8F0] bg-white flex items-center justify-between">
          <div className="text-xs text-[#64748B]">
            {result.isValid ? (
              <span className="text-emerald-700 font-medium flex items-center space-x-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>All mandatory DTMC SOW criteria satisfied.</span>
              </span>
            ) : (
              <span className="text-rose-700 font-medium flex items-center space-x-1.5">
                <XCircle className="w-3.5 h-3.5" />
                <span>Fix {result.failedCount} failed requirement(s) before marking Ready for Use.</span>
              </span>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={onClose}
              className="text-xs text-[#475569] hover:text-[#0F172A] font-semibold px-4 py-2 rounded-lg bg-[#F8FAFC] hover:bg-[#F1F5F9] border border-[#CBD5E1] transition cursor-pointer"
            >
              Close Report
            </button>

            {result.canMarkReady && onMarkReadyForUse && (
              <button
                onClick={() => {
                  onMarkReadyForUse();
                  onClose();
                }}
                className="flex items-center space-x-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-2 rounded-lg transition shadow-sm cursor-pointer"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Mark Ready for Use</span>
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
