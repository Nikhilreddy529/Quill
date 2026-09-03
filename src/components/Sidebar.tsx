import React from 'react';
import { 
  Plus, 
  Home, 
  FileText, 
  Copy, 
  BookOpen, 
  FileCode, 
  Settings, 
  History, 
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { FeatherLogo } from './FeatherLogo';

interface SidebarProps {
  currentView: string;
  setCurrentView: (view: any) => void;
  onOpenCreateProject: () => void;
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  setCurrentView,
  onOpenCreateProject,
  isCollapsed,
  setIsCollapsed
}) => {
  return (
    <aside 
      className={`${
        isCollapsed ? 'w-16' : 'w-60'
      } transition-all duration-300 bg-[#071328] text-slate-300 flex flex-col shrink-0 border-r border-[#15233e] z-40 select-none min-h-screen`}
    >
      {/* Brand Header */}
      <div className="h-16 px-4 flex items-center justify-between border-b border-[#15233e]">
        <div 
          onClick={() => setCurrentView('sections')} 
          className="flex items-center space-x-2.5 cursor-pointer"
        >
          {/* Cyan/Blue Feather Icon */}
          <div className="w-8 h-8 rounded-lg bg-[#0F224A] border border-[#1E3A8A] flex items-center justify-center text-white shadow-md shadow-blue-500/20">
            <FeatherLogo className="w-5 h-5 text-blue-300" />
          </div>
          {!isCollapsed && (
            <div className="flex items-center space-x-1.5">
              <span className="text-lg font-bold text-white tracking-tight">Quill</span>
            </div>
          )}
        </div>
      </div>

      {/* Primary Action Button */}
      <div className="p-3.5">
        <button
          onClick={onOpenCreateProject}
          className={`w-full bg-[#1D68F2] hover:bg-[#1557d0] text-white rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 py-2.5 font-semibold text-xs shadow-md shadow-blue-600/30 cursor-pointer ${
            isCollapsed ? 'px-0' : 'px-3'
          }`}
          title="New SOW"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          {!isCollapsed && <span>New SOW </span>}
        </button>
      </div>

      {/* Navigation Sections */}
      <div className="flex-1 overflow-y-auto px-2.5 space-y-5 text-xs py-2">
        
        {/* Navigation / Main */}
        <div className="space-y-0.5">
          <button
            onClick={() => setCurrentView('dashboard')}
            className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg font-medium transition cursor-pointer ${
              currentView === 'dashboard'
                ? 'bg-[#15294a] text-white font-semibold shadow-inner'
                : 'text-slate-400 hover:text-slate-200 hover:bg-[#0c1e3d]'
            }`}
            title="Dashboard & Projects"
          >
            <Home className="w-4 h-4 shrink-0 text-blue-400" />
            {!isCollapsed && <span>Dashboard</span>}
          </button>
        </div>

        {/* Category: SOW AUTHORING */}
        <div className="space-y-1">
          {!isCollapsed && (
            <div className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              SOW Authoring
            </div>
          )}
          
          <button
            onClick={() => setCurrentView('sections')}
            className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg font-medium transition cursor-pointer ${
              currentView === 'sections'
                ? 'bg-[#162a4d] text-white font-semibold shadow-inner'
                : 'text-slate-300 hover:text-white hover:bg-[#0c1e3d]'
            }`}
            title="SOW Editor"
          >
            <FileText className="w-4 h-4 shrink-0 text-blue-400" />
            {!isCollapsed && <span>SOW Editor</span>}
          </button>

          <button
            onClick={() => setCurrentView('framework')}
            className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg font-medium transition cursor-pointer ${
              currentView === 'framework'
                ? 'bg-[#162a4d] text-white font-semibold shadow-inner'
                : 'text-slate-300 hover:text-white hover:bg-[#0c1e3d]'
            }`}
            title="Framework Outline"
          >
            <FileCode className="w-4 h-4 shrink-0 text-indigo-400" />
            {!isCollapsed && <span>Framework Outline</span>}
          </button>

          <button
            onClick={() => setCurrentView('proposal')}
            className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg font-medium transition cursor-pointer ${
              currentView === 'proposal'
                ? 'bg-[#162a4d] text-white font-semibold shadow-inner'
                : 'text-slate-300 hover:text-white hover:bg-[#0c1e3d]'
            }`}
            title="Proposal Workspace"
          >
            <FileText className="w-4 h-4 shrink-0 text-violet-400" />
            {!isCollapsed && <span>Proposal Workspace</span>}
          </button>

          <button
            onClick={() => setCurrentView('templates')}
            className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg font-medium transition cursor-pointer ${
              currentView === 'templates' || currentView === 'template-editor' || currentView === 'template-preview'
                ? 'bg-[#162a4d] text-white font-semibold shadow-inner'
                : 'text-slate-300 hover:text-white hover:bg-[#0c1e3d]'
            }`}
            title="SOW Templates"
          >
            <Copy className="w-4 h-4 shrink-0 text-cyan-400" />
            {!isCollapsed && (
              <div className="flex items-center justify-between flex-1">
                <span>SOW Templates</span>
                <span className="text-[9px] bg-cyan-500/20 text-cyan-300 border border-cyan-400/30 px-1 py-0.2 rounded font-mono">DTMC</span>
              </div>
            )}
          </button>
        </div>

        {/* Category: KNOWLEDGE */}
        <div className="space-y-1">
          {!isCollapsed && (
            <div className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Knowledge & Documents
            </div>
          )}

          <button
            onClick={() => setCurrentView('sections')}
            className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg font-medium text-slate-400 hover:text-slate-200 hover:bg-[#0c1e3d] transition cursor-pointer"
            title="Reference Library"
          >
            <BookOpen className="w-4 h-4 shrink-0 text-emerald-400" />
            {!isCollapsed && <span>Reference Documents</span>}
          </button>
        </div>

        {/* Category: SYSTEM & AUDIT */}
        <div className="space-y-1">
          {!isCollapsed && (
            <div className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              System & Compliance
            </div>
          )}

          <button
            onClick={() => setCurrentView('dashboard')}
            className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg font-medium text-slate-400 hover:text-slate-200 hover:bg-[#0c1e3d] transition cursor-pointer"
            title="Audit Trail"
          >
            <History className="w-4 h-4 shrink-0 text-slate-400" />
            {!isCollapsed && <span>Audit Trail</span>}
          </button>

          <button
            onClick={() => setCurrentView('dashboard')}
            className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg font-medium text-slate-400 hover:text-slate-200 hover:bg-[#0c1e3d] transition cursor-pointer"
            title="Settings"
          >
            <Settings className="w-4 h-4 shrink-0 text-slate-400" />
            {!isCollapsed && <span>Settings</span>}
          </button>
        </div>

      </div>

      {/* Bottom Collapse Toggle */}
      <div className="p-3 border-t border-[#15233e]">
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="w-full flex items-center space-x-2.5 px-3 py-2 rounded-lg text-slate-400 hover:text-white hover:bg-[#0c1e3d] transition cursor-pointer text-xs font-medium"
        >
          {isCollapsed ? (
            <ChevronRight className="w-4 h-4 mx-auto" />
          ) : (
            <>
              <ChevronLeft className="w-4 h-4" />
              <span>Collapse</span>
            </>
          )}
        </button>
      </div>

    </aside>
  );
};
