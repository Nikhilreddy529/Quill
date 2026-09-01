import React, { useState } from 'react';
import { X, AlertTriangle, ShieldAlert, GitMerge, RotateCcw, Check } from 'lucide-react';
import { ConcurrencyConflict } from '../../services/concurrencyAndAuditService';

interface ConcurrencyConflictModalProps {
  isOpen: boolean;
  onClose: () => void;
  conflict: ConcurrencyConflict;
  onResolve: (action: 'overwrite' | 'accept_server' | 'merge', mergedContent?: string) => void;
}

export const ConcurrencyConflictModal: React.FC<ConcurrencyConflictModalProps> = ({
  isOpen,
  onClose,
  conflict,
  onResolve,
}) => {
  const [activeTab, setActiveTab] = useState<'side-by-side' | 'merge'>('side-by-side');
  const [mergedText, setMergedText] = useState(conflict.clientContent + '\n\n' + conflict.serverContent);

  if (!isOpen || !conflict.hasConflict) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-4xl w-full border border-[#E2E8F0] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#E2E8F0] flex items-center justify-between bg-rose-50/60">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-rose-100 flex items-center justify-center text-rose-700">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-sm font-bold text-[#0F172A]">Simultaneous Edit Conflict Detected</h2>
                <span className="text-[10px] font-mono bg-rose-100 text-rose-800 border border-rose-300 px-1.5 py-0.2 rounded">
                  QTK-030 Concurrency Guard
                </span>
              </div>
              <p className="text-[11px] text-rose-900">
                Another user (<strong>{conflict.serverEditedBy}</strong>) updated this section (v{conflict.serverVersion}) while you were editing (v{conflict.clientVersion}).
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Conflict Resolution Controls */}
        <div className="p-6 space-y-4 text-xs overflow-y-auto flex-1">
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-amber-900">
            To prevent silent loss of data, choose how you would like to resolve this revision conflict before saving to SharePoint Store.
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Server Version (Other PM) */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-[11px] font-bold text-slate-700 pb-1 border-b border-slate-200">
                <span>Server Version (v{conflict.serverVersion}) - {conflict.serverEditedBy}</span>
                <span className="text-[10px] text-slate-400">{new Date(conflict.serverEditedAt).toLocaleTimeString()}</span>
              </div>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg whitespace-pre-wrap text-[11px] text-slate-700 min-h-[220px]">
                {conflict.serverContent}
              </div>
            </div>

            {/* Your Local Draft */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-[11px] font-bold text-[#1D68F2] pb-1 border-b border-blue-200">
                <span>Your Unsaved Local Version (v{conflict.clientVersion})</span>
                <span className="text-[10px] text-blue-500">Active Editor</span>
              </div>
              <div className="p-3 bg-blue-50/30 border border-blue-200 rounded-lg whitespace-pre-wrap text-[11px] text-slate-800 min-h-[220px]">
                {conflict.clientContent}
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-3 border-t border-[#E2E8F0] bg-slate-50/50 flex flex-wrap items-center justify-between gap-2">
          <button
            onClick={() => onResolve('accept_server')}
            className="bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-semibold px-3.5 py-2 rounded-lg transition cursor-pointer"
          >
            Accept Server Version (Discard Mine)
          </button>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => onResolve('overwrite')}
              className="bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold px-3.5 py-2 rounded-lg shadow-xs transition cursor-pointer"
            >
              Overwrite Server (Force Save Mine)
            </button>

            <button
              onClick={() => onResolve('merge', conflict.clientContent + '\n\n' + conflict.serverContent)}
              className="bg-[#1D68F2] hover:bg-[#1554c0] text-white text-xs font-bold px-4 py-2 rounded-lg shadow-sm transition cursor-pointer"
            >
              Merge Both Versions
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
