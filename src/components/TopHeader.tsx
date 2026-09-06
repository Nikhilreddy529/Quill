import React from 'react';
import { 
  Search, 
  Bell, 
  HelpCircle, 
  ChevronRight, 
  FileText,
  FileCode,
  Copy,
  LayoutDashboard
} from 'lucide-react';
import { QuillUser, SOWProject } from '../types/quill';

interface TopHeaderProps {
  currentProject: SOWProject;
  currentView: string;
  setCurrentView: (view: any) => void;
  onOpenNotifications?: () => void;
  currentUser: QuillUser;
  onChangeCurrentUser: (user: QuillUser) => void;
}

export const TopHeader: React.FC<TopHeaderProps> = ({
  currentProject,
  currentView,
  setCurrentView,
  onOpenNotifications,
  currentUser,
  onChangeCurrentUser
}) => {
  return (
    <header className="h-16 bg-white border-b border-[#E2E8F0] px-6 flex items-center justify-between sticky top-0 z-30 select-none">
      
      {/* Left: Breadcrumbs */}
      <div className="flex items-center space-x-2 text-xs text-[#64748B]">
        <button 
          onClick={() => setCurrentView('dashboard')}
          className="hover:text-[#1D68F2] transition cursor-pointer font-medium"
        >
          Dashboard
        </button>
        <ChevronRight className="w-3.5 h-3.5 text-[#94A3B8]" />
        {currentView === 'templates' || currentView === 'template-editor' || currentView === 'template-preview' ? (
          <>
            <button 
              onClick={() => setCurrentView('templates')}
              className="hover:text-[#1D68F2] transition cursor-pointer font-medium text-[#334155]"
            >
              SOW Templates
            </button>
            <ChevronRight className="w-3.5 h-3.5 text-[#94A3B8]" />
            <span className="font-bold text-[#0F172A]">
              {currentView === 'template-editor' ? 'Editor' : currentView === 'template-preview' ? 'Preview' : 'DTMC Master Standards'}
            </span>
          </>
        ) : currentView === 'framework' ? (
          <>
            <button 
              onClick={() => setCurrentView('sections')}
              className="hover:text-[#1D68F2] transition cursor-pointer font-medium text-[#334155]"
            >
              {currentProject?.title || "Digital Transformation - Acme Corp"}
            </button>
            <ChevronRight className="w-3.5 h-3.5 text-[#94A3B8]" />
            <span className="font-bold text-[#0F172A]">Framework Outline</span>
          </>
        ) : currentView === 'proposal' ? (
          <>
            <button 
              onClick={() => setCurrentView('dashboard')}
              className="hover:text-[#1D68F2] transition cursor-pointer font-medium text-[#334155]"
            >
              {currentProject?.title || "Digital Transformation - Acme Corp"}
            </button>
            <ChevronRight className="w-3.5 h-3.5 text-[#94A3B8]" />
            <span className="font-bold text-[#0F172A]">Proposal Workspace</span>
          </>
        ) : (
          <>
            <button 
              onClick={() => setCurrentView('sections')}
              className="hover:text-[#1D68F2] transition cursor-pointer font-medium text-[#334155]"
            >
              {currentProject?.title || "Digital Transformation - Acme Corp"}
            </button>
            <ChevronRight className="w-3.5 h-3.5 text-[#94A3B8]" />
            <span className="font-bold text-[#0F172A]">SOW Document</span>
          </>
        )}
      </div>

      {/* Center / Right: Search, Quick Switcher, Notifications, Help & Profile */}
      <div className="flex items-center space-x-4">
        
        {/* Search Bar */}
        <div className="relative hidden md:block w-72">
          <Search className="w-3.5 h-3.5 text-[#94A3B8] absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search projects, documents..."
            className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg pl-8 pr-12 py-1.5 text-xs text-[#0F172A] placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#1D68F2]"
          />
          <div className="absolute right-2.5 top-2 px-1.5 py-0.5 bg-white border border-[#CBD5E1] rounded text-[10px] font-mono text-[#64748B]">
            ⌘K
          </div>
        </div>

        {/* View Switchers */}
        <div className="hidden lg:flex items-center space-x-1 bg-[#F1F5F9] p-1 rounded-lg border border-[#E2E8F0] text-xs">
          <button
            onClick={() => setCurrentView('dashboard')}
            className={`px-2.5 py-1 rounded-md font-semibold transition cursor-pointer flex items-center space-x-1.5 ${
              currentView === 'dashboard'
                ? 'bg-white text-[#1D68F2] shadow-sm'
                : 'text-[#64748B] hover:text-[#0F172A]'
            }`}
          >
            <LayoutDashboard className="w-3 h-3" />
            <span>Dashboard</span>
          </button>

          <button
            onClick={() => setCurrentView('templates')}
            className={`px-2.5 py-1 rounded-md font-semibold transition cursor-pointer flex items-center space-x-1.5 ${
              currentView === 'templates' || currentView === 'template-editor' || currentView === 'template-preview'
                ? 'bg-white text-[#1D68F2] shadow-sm'
                : 'text-[#64748B] hover:text-[#0F172A]'
            }`}
          >
            <Copy className="w-3 h-3 text-cyan-600" />
            <span>Templates</span>
          </button>

          <button
            onClick={() => setCurrentView('framework')}
            className={`px-2.5 py-1 rounded-md font-semibold transition cursor-pointer flex items-center space-x-1.5 ${
              currentView === 'framework'
                ? 'bg-white text-[#1D68F2] shadow-sm'
                : 'text-[#64748B] hover:text-[#0F172A]'
            }`}
          >
            <FileCode className="w-3 h-3 text-indigo-600" />
            <span>Framework</span>
          </button>

          <button
            onClick={() => setCurrentView('proposal')}
            className={`px-2.5 py-1 rounded-md font-semibold transition cursor-pointer flex items-center space-x-1.5 ${
              currentView === 'proposal'
                ? 'bg-white text-[#1D68F2] shadow-sm'
                : 'text-[#64748B] hover:text-[#0F172A]'
            }`}
          >
            <FileText className="w-3 h-3 text-violet-600" />
            <span>Proposal</span>
          </button>

          <button
            onClick={() => setCurrentView('sections')}
            className={`px-2.5 py-1 rounded-md font-semibold transition cursor-pointer flex items-center space-x-1.5 ${
              currentView === 'sections'
                ? 'bg-white text-[#1D68F2] shadow-sm'
                : 'text-[#64748B] hover:text-[#0F172A]'
            }`}
          >
            <FileText className="w-3 h-3 text-blue-600" />
            <span>SOW Editor</span>
          </button>
        </div>

        {/* Notification Bell */}
        <button 
          onClick={onOpenNotifications}
          className="relative p-2 text-[#64748B] hover:text-[#0F172A] hover:bg-[#F1F5F9] rounded-lg transition cursor-pointer"
          title="Notifications"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1 right-1 w-4 h-4 bg-[#EF4444] text-white text-[9px] font-bold rounded-full flex items-center justify-center border-2 border-white">
            3
          </span>
        </button>

        {/* Help Circle */}
        <button 
          className="p-2 text-[#64748B] hover:text-[#0F172A] hover:bg-[#F1F5F9] rounded-lg transition cursor-pointer"
          title="DTMC SOW Help & Guidelines"
        >
          <HelpCircle className="w-4 h-4" />
        </button>

        {/* User Profile Avatar */}
        {/* User Profile + Role Switch */}
{/* User Profile + Contributor Switch */}
<div className="flex items-center space-x-2.5 pl-2 border-l border-[#E2E8F0]">
  <div className="w-8 h-8 rounded-full bg-[#1D68F2] text-white text-xs font-bold flex items-center justify-center shadow-sm">
    {currentUser.name.charAt(0).toUpperCase()}
  </div>

  <div className="hidden sm:block text-left">
    <div className="text-xs font-bold text-[#0F172A] leading-tight">
      {currentUser.name}
    </div>
    <div className="text-[10px] text-[#64748B]">
      {currentUser.role}
    </div>
  </div>

  <select
    value={currentUser.id}
    onChange={(e) => {
      const selectedId = e.target.value;

      if (selectedId === 'manager-001') {
        onChangeCurrentUser({
          id: 'manager-001',
          name: 'Nikhil',
          email: 'nikhil@dtmc.com',
          role: 'Project Manager',
        });
        return;
      }

      const contributor = Object.values(
        currentProject.sectionContributors || {}
      ).find(c => c.id === selectedId);

      if (contributor) {
        onChangeCurrentUser({
          id: contributor.id,
          name: contributor.name,
          email: contributor.email,
          role: 'Contributor',
        });
      }
    }}
    className="text-[10px] border border-[#CBD5E1] rounded-md px-1.5 py-1 bg-white text-[#475569] cursor-pointer"
  >
    <option value="manager-001">
      Nikhil — Manager
    </option>

    {Object.values(currentProject.sectionContributors || {}).map(
      contributor => (
        <option key={contributor.id} value={contributor.id}>
          {contributor.name} — Contributor
        </option>
      )
    )}
  </select>
</div>
      </div>

    </header>
  );
};
