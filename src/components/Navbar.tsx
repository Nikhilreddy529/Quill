import React from 'react';
import { 
  FileText, 
  BookOpen, 
  Layers, 
  Database, 
  Workflow, 
  ShieldCheck, 
  Sparkles, 
  PlusCircle,
  ExternalLink
} from 'lucide-react';
import { SOWProject } from '../types/quill';

interface NavbarProps {
  currentView: 'app' | 'blueprint' | 'workflows' | 'lists';
  setCurrentView: (view: 'app' | 'blueprint' | 'workflows' | 'lists') => void;
  projects: SOWProject[];
  activeProjectId: string;
  setActiveProjectId: (id: string) => void;
  onOpenCreateModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  setCurrentView,
  projects,
  activeProjectId,
  setActiveProjectId,
  onOpenCreateModal,
}) => {
  const activeProject = projects.find(p => p.id === activeProjectId) || projects[0];

  return (
    <header className="sticky top-0 z-50 bg-[#111111]/95 backdrop-blur-md border-b border-[#2A2A2A] text-[#E0E0E0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Brand */}
          <div className="flex items-center space-x-3">
            <img
              src="/Asset/Quill.png"
              alt="Quill logo"
              className="w-10 h-10 object-contain flex-shrink-0"
            />
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="font-serif text-xl tracking-tight text-white font-bold">
                  Quill
                </h1>
                <span className="text-[#666] font-sans text-xs hidden sm:inline">|</span>
                <span className="text-[#888] font-sans text-xs hidden sm:inline">
                  Enterprise SOW Architect
                </span>
                <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/30">
                  MVP
                </span>
              </div>
              <p className="text-[11px] text-[#777] font-medium hidden md:block">
                AI-Powered SOW Authoring • Microsoft Search & SharePoint RAG
              </p>
            </div>
          </div>

          {/* Navigation Mode Tabs */}
          <nav className="hidden md:flex items-center space-x-1 bg-[#0F0F0F] p-1 rounded-xl border border-[#2A2A2A]">
            <button
              onClick={() => setCurrentView('app')}
              className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                currentView === 'app'
                  ? 'bg-[#D4AF37] text-black shadow-md shadow-[#D4AF37]/20 font-bold'
                  : 'text-[#888] hover:text-[#CCC] hover:bg-[#1A1A1A]'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>SOW Authoring Console</span>
            </button>

            <button
              onClick={() => setCurrentView('blueprint')}
              className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                currentView === 'blueprint'
                  ? 'bg-[#D4AF37] text-black shadow-md shadow-[#D4AF37]/20 font-bold'
                  : 'text-[#888] hover:text-[#CCC] hover:bg-[#1A1A1A]'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>25-Section Architecture Spec</span>
            </button>

            <button
              onClick={() => setCurrentView('workflows')}
              className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                currentView === 'workflows'
                  ? 'bg-[#D4AF37] text-black shadow-md shadow-[#D4AF37]/20 font-bold'
                  : 'text-[#888] hover:text-[#CCC] hover:bg-[#1A1A1A]'
              }`}
            >
              <Workflow className="w-3.5 h-3.5" />
              <span>n8n Pipelines (5)</span>
            </button>

            <button
              onClick={() => setCurrentView('lists')}
              className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                currentView === 'lists'
                  ? 'bg-[#D4AF37] text-black shadow-md shadow-[#D4AF37]/20 font-bold'
                  : 'text-[#888] hover:text-[#CCC] hover:bg-[#1A1A1A]'
              }`}
            >
              <Database className="w-3.5 h-3.5" />
              <span>SharePoint Lists (4)</span>
            </button>
          </nav>

          {/* Right Action: Project Quick Switcher, n8n Active status & New SOW Button */}
          <div className="flex items-center space-x-3">
            {currentView === 'app' && (
              <div className="hidden lg:flex items-center space-x-2 bg-[#161616] border border-[#2A2A2A] rounded-lg px-2.5 py-1">
                <span className="text-[11px] text-[#777] font-medium">Active:</span>
                <select
                  value={activeProjectId}
                  onChange={(e) => setActiveProjectId(e.target.value)}
                  className="bg-transparent text-xs text-[#E0E0E0] font-semibold focus:outline-none cursor-pointer max-w-[170px] truncate"
                >
                  {projects.map(p => (
                    <option key={p.id} value={p.id} className="bg-[#161616] text-[#E0E0E0]">
                      {p.id}: {p.clientName}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-[#1A1A1A] border border-[#333] rounded-full" title="n8n Real-Time Execution Bus Active">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
              <span className="text-[10px] uppercase tracking-widest text-[#AAA]">n8n Active</span>
            </div>

            <button
              onClick={onOpenCreateModal}
              className="flex items-center space-x-1.5 bg-[#D4AF37] hover:bg-[#c59f2d] text-black text-xs font-bold px-3.5 py-2 rounded-lg transition shadow-md shadow-[#D4AF37]/20 active:scale-95 cursor-pointer"
            >
              <PlusCircle className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>New SOW</span>
            </button>
          </div>

        </div>
      </div>
    </header>
  );
};
