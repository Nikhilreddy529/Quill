import React, { useState } from 'react';
import { 
  X, 
  GitBranch, 
  Clock, 
  ArrowLeftRight, 
  Check, 
  RotateCcw, 
  FileText, 
  Sparkles,
  ChevronDown
} from 'lucide-react';
import { SOWSection } from '../../types/quill';
import { concurrencyAndAuditService, DiffLine } from '../../services/concurrencyAndAuditService';

interface DiffViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  section: SOWSection;
  onRestoreSnapshot?: (content: string) => void;
}

export const DiffViewerModal: React.FC<DiffViewerModalProps> = ({
  isOpen,
  onClose,
  section,
  onRestoreSnapshot,
}) => {
  const [diffMode, setDiffMode] = useState<'inline' | 'side-by-side'>('inline');
  const [selectedSnapshotIndex, setSelectedSnapshotIndex] = useState<number>(0);

  if (!isOpen) return null;

  const versionHistory = section.versionHistory || [];
  const activeSnapshot = versionHistory[selectedSnapshotIndex] || {
    version: section.version - 0.1 > 0 ? Number((section.version - 0.1).toFixed(1)) : 1.0,
    timestamp: section.lastEditedAt,
    editedBy: 'Previous Author / AI Draft',
    status: 'Superseded',
    content: section.previousContentSnapshot || section.content.replace(/\n\n.*$/, '\n\n*Original raw draft baseline.*')
  };

  const oldText = activeSnapshot.content || '';
  const newText = section.content || '';
  const diffLines = concurrencyAndAuditService.computeDiff(oldText, newText);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-4xl w-full border border-[#E2E8F0] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#E2E8F0] flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center text-[#1D68F2]">
              <GitBranch className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-sm font-bold text-[#0F172A]">Version Diff & Review History</h2>
                <span className="text-[10px] font-mono bg-blue-50 text-[#1D68F2] border border-blue-200 px-1.5 py-0.2 rounded">
                  QTK-026 & QTK-028
                </span>
              </div>
              <p className="text-[11px] text-[#64748B]">
                Reviewing changes for Section {section.order}: <strong>{section.title}</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {/* View Mode Toggle */}
            <div className="flex bg-slate-100 p-0.5 rounded-lg text-xs font-semibold">
              <button
                onClick={() => setDiffMode('inline')}
                className={`px-2.5 py-1 rounded-md transition cursor-pointer ${
                  diffMode === 'inline' ? 'bg-white text-[#0F172A] shadow-xs' : 'text-slate-500'
                }`}
              >
                Inline Diff
              </button>
              <button
                onClick={() => setDiffMode('side-by-side')}
                className={`px-2.5 py-1 rounded-md transition cursor-pointer ${
                  diffMode === 'side-by-side' ? 'bg-white text-[#0F172A] shadow-xs' : 'text-slate-500'
                }`}
              >
                Side-by-Side
              </button>
            </div>

            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Snapshot Selector Bar */}
        <div className="px-6 py-2.5 bg-slate-100/70 border-b border-[#E2E8F0] flex flex-wrap items-center justify-between text-xs gap-2">
          <div className="flex items-center space-x-2">
            <span className="font-semibold text-slate-600">Compare with version:</span>
            {versionHistory.length > 0 ? (
              <select
                value={selectedSnapshotIndex}
                onChange={(e) => setSelectedSnapshotIndex(Number(e.target.value))}
                className="bg-white border border-slate-300 rounded px-2 py-1 text-xs font-medium cursor-pointer"
              >
                {versionHistory.map((snap, idx) => (
                  <option key={idx} value={idx}>
                    v{snap.version} ({snap.status}) - {snap.editedBy} ({new Date(snap.timestamp).toLocaleTimeString()})
                  </option>
                ))}
              </select>
            ) : (
              <span className="text-slate-500 italic">Baseline Draft v1.0 (Initial AI Synthesis)</span>
            )}
          </div>

          <div className="flex items-center space-x-3 text-[11px]">
            <span className="flex items-center space-x-1">
              <span className="w-2.5 h-2.5 bg-rose-200 border border-rose-400 rounded-xs"></span>
              <span className="text-slate-600">Removed</span>
            </span>
            <span className="flex items-center space-x-1">
              <span className="w-2.5 h-2.5 bg-emerald-200 border border-emerald-400 rounded-xs"></span>
              <span className="text-slate-600">Added in v{section.version}</span>
            </span>
          </div>
        </div>

        {/* Diff Canvas */}
        <div className="flex-1 overflow-y-auto p-6 text-xs font-mono">
          {diffMode === 'inline' ? (
            <div className="bg-slate-50 border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-100">
              {diffLines.map((line, idx) => (
                <div
                  key={idx}
                  className={`flex items-start px-3 py-1 text-[11px] leading-relaxed ${
                    line.type === 'added'
                      ? 'bg-emerald-50/80 text-emerald-900 font-medium'
                      : line.type === 'removed'
                      ? 'bg-rose-50/80 text-rose-900 line-through opacity-75'
                      : 'text-slate-700'
                  }`}
                >
                  <span className="w-8 select-none text-slate-400 text-[10px] shrink-0 font-sans">
                    {line.lineNumber}
                  </span>
                  <span className="w-4 select-none font-bold shrink-0">
                    {line.type === 'added' ? '+' : line.type === 'removed' ? '-' : ' '}
                  </span>
                  <span className="flex-1 whitespace-pre-wrap">{line.content || ' '}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              {/* Left: Previous Version */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-[11px] font-bold text-slate-600 font-sans pb-1 border-b border-slate-200">
                  <span>Previous Snapshot (v{activeSnapshot.version})</span>
                  <span>{activeSnapshot.editedBy}</span>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg whitespace-pre-wrap text-[11px] text-slate-700 min-h-[300px]">
                  {oldText}
                </div>
              </div>

              {/* Right: Current Active Version */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-[11px] font-bold text-[#1D68F2] font-sans pb-1 border-b border-blue-200">
                  <span>Current Version (v{section.version})</span>
                  <span>{section.lastEditedBy}</span>
                </div>
                <div className="p-3 bg-blue-50/30 border border-blue-200 rounded-lg whitespace-pre-wrap text-[11px] text-slate-800 min-h-[300px]">
                  {newText}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-[#E2E8F0] bg-slate-50/50 flex items-center justify-between">
          <div className="text-[11px] text-slate-500">
            Current Section Status: <strong className="text-[#0F172A]">{section.status}</strong>
          </div>

          <div className="flex items-center space-x-2">
            {onRestoreSnapshot && (
              <button
                onClick={() => {
                  onRestoreSnapshot(activeSnapshot.content);
                  onClose();
                }}
                className="flex items-center space-x-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-semibold px-3 py-1.5 rounded-lg transition cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Restore Snapshot Content</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="bg-[#1D68F2] hover:bg-[#1554c0] text-white text-xs font-bold px-4 py-1.5 rounded-lg shadow-sm transition cursor-pointer"
            >
              Done Reviewing
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
