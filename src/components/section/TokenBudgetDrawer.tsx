import React from 'react';
import { X, Cpu, PieChart, Info, ShieldCheck, Zap } from 'lucide-react';
import { TokenBudgetInfo, SOWSection } from '../../types/quill';

interface TokenBudgetDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  tokenBudget: TokenBudgetInfo;
  sectionTitle: string;
}

export const TokenBudgetDrawer: React.FC<TokenBudgetDrawerProps> = ({
  isOpen,
  onClose,
  tokenBudget,
  sectionTitle,
}) => {
  if (!isOpen) return null;

  const usagePercent = Math.min(100, Math.round((tokenBudget.totalTokens / tokenBudget.maxAllowedTokens) * 100));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-lg w-full border border-[#E2E8F0] shadow-2xl overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#E2E8F0] flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center text-purple-700">
              <Cpu className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-sm font-bold text-[#0F172A]">Per-Section Token & Context Package</h2>
                <span className="text-[10px] font-mono bg-purple-50 text-purple-700 border border-purple-200 px-1.5 py-0.2 rounded">
                  QTK-021
                </span>
              </div>
              <p className="text-[11px] text-[#64748B]">Context Window Optimization & Budget Allocation</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 text-xs">
          
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-700">Total Context Window Used:</span>
              <span className="font-mono font-bold text-[#0F172A]">
                {tokenBudget.totalTokens.toLocaleString()} / {tokenBudget.maxAllowedTokens.toLocaleString()} tokens ({usagePercent}%)
              </span>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden flex">
              <div 
                style={{ width: `${(tokenBudget.systemPromptTokens / tokenBudget.maxAllowedTokens) * 100}%` }} 
                className="bg-blue-500" 
                title="System Prompt"
              />
              <div 
                style={{ width: `${(tokenBudget.approvedEvidenceTokens / tokenBudget.maxAllowedTokens) * 100}%` }} 
                className="bg-emerald-500" 
                title="Approved Evidence"
              />
              <div 
                style={{ width: `${(tokenBudget.priorSectionsSummaryTokens / tokenBudget.maxAllowedTokens) * 100}%` }} 
                className="bg-amber-500" 
                title="Prior Sections Summary"
              />
              <div 
                style={{ width: `${(tokenBudget.projectIntakeTokens / tokenBudget.maxAllowedTokens) * 100}%` }} 
                className="bg-purple-500" 
                title="Project Intake"
              />
              <div 
                style={{ width: `${(tokenBudget.maxOutputTokens / tokenBudget.maxAllowedTokens) * 100}%` }} 
                className="bg-indigo-400" 
                title="Output Allocation"
              />
            </div>

            <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono pt-1">
              <span>Model: {tokenBudget.modelName}</span>
              <span>Headroom: {(tokenBudget.maxAllowedTokens - tokenBudget.totalTokens).toLocaleString()} tokens</span>
            </div>
          </div>

          {/* Breakdown Items */}
          <div className="space-y-2">
            <div className="flex items-center justify-between p-2.5 bg-blue-50/50 border border-blue-100 rounded-lg">
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 bg-blue-500 rounded-xs shrink-0"></span>
                <span className="font-semibold text-slate-800">DTMC Corporate System Prompt</span>
              </div>
              <span className="font-mono font-bold text-slate-900">{tokenBudget.systemPromptTokens.toLocaleString()} tokens</span>
            </div>

            <div className="flex items-center justify-between p-2.5 bg-emerald-50/50 border border-emerald-100 rounded-lg">
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 bg-emerald-500 rounded-xs shrink-0"></span>
                <span className="font-semibold text-slate-800">Approved Grounded Evidence Passages</span>
              </div>
              <span className="font-mono font-bold text-slate-900">{tokenBudget.approvedEvidenceTokens.toLocaleString()} tokens</span>
            </div>

            <div className="flex items-center justify-between p-2.5 bg-amber-50/50 border border-amber-100 rounded-lg">
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 bg-amber-500 rounded-xs shrink-0"></span>
                <span className="font-semibold text-slate-800">Prior Approved Sections Context Summary</span>
              </div>
              <span className="font-mono font-bold text-slate-900">{tokenBudget.priorSectionsSummaryTokens.toLocaleString()} tokens</span>
            </div>

            <div className="flex items-center justify-between p-2.5 bg-purple-50/50 border border-purple-100 rounded-lg">
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 bg-purple-500 rounded-xs shrink-0"></span>
                <span className="font-semibold text-slate-800">Project Intake Notes & Brief Context</span>
              </div>
              <span className="font-mono font-bold text-slate-900">{tokenBudget.projectIntakeTokens.toLocaleString()} tokens</span>
            </div>

            <div className="flex items-center justify-between p-2.5 bg-indigo-50/50 border border-indigo-100 rounded-lg">
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 bg-indigo-400 rounded-xs shrink-0"></span>
                <span className="font-semibold text-slate-800">Section Output Budget Allocation</span>
              </div>
              <span className="font-mono font-bold text-slate-900">{tokenBudget.maxOutputTokens.toLocaleString()} tokens</span>
            </div>
          </div>

          <p className="text-[11px] text-slate-500 leading-relaxed italic">
            *In accordance with QTK-021, only relevant approved passages and required prior context are injected into the section prompt to prevent context dilution and ensure predictable model generation.
          </p>

        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-[#E2E8F0] bg-slate-50/50 flex justify-end">
          <button
            onClick={onClose}
            className="bg-[#1D68F2] hover:bg-[#1554c0] text-white text-xs font-bold px-4 py-2 rounded-lg shadow-sm transition cursor-pointer"
          >
            Close Inspector
          </button>
        </div>

      </div>
    </div>
  );
};
