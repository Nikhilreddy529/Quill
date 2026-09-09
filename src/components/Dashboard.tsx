import React from 'react';
import { 
  FileText, 
  CheckCircle2, 
  Clock, 
  ArrowRight, 
  Sparkles, 
  Download, 
  ShieldCheck, 
  Building
} from 'lucide-react';
import { SOWProject, AuditLogEntry } from '../types/quill';

interface DashboardProps {
  projects: SOWProject[];
  auditLogs: AuditLogEntry[];
  onSelectProject: (projectId: string) => void;
  onOpenCreateModal: () => void;
  onOpenProposalModal: () => void;
  onOpenExportModal: (project: SOWProject) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  projects,
  auditLogs,
  onSelectProject,
  onOpenCreateModal,
  onOpenProposalModal,
  onOpenExportModal,
}) => {
  const totalProjects = projects.length;
  const approvedProjects = projects.filter(p => p.status === 'Approved' || p.status === 'Exported').length;
  const underReviewProjects = projects.filter(p => p.status === 'Under Review').length;
  const draftProjects = projects.filter(p => p.status === 'Draft' || p.status === 'Generated').length;

  return (
    <div className="space-y-8">
      
      {/* Top Banner with Quick Actions */}
      <div className="relative overflow-hidden rounded-xl bg-white border border-[#E2E8F0] p-6 md:p-8 shadow-xs">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-[#1D68F2] text-xs font-semibold">
              <span className="tracking-wide">SOW/ Proposal Drafting & Grounding Active</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#0F172A]">
              Quill Workspace
            </h1>
            
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={onOpenCreateModal}
              className="flex items-center space-x-2 bg-[#1D68F2] hover:bg-[#1554c0] text-white font-bold px-5 py-2.5 rounded-lg shadow-sm shadow-blue-500/20 transition active:scale-95 cursor-pointer text-sm"
            >
              <span>Generate New SOW</span>
            </button>
            <button
              onClick={onOpenProposalModal}
              className="flex items-center space-x-2 bg-[#1D68F2] hover:bg-[#1554c0] text-white font-bold px-5 py-2.5 rounded-lg shadow-sm shadow-blue-500/20 transition active:scale-95 cursor-pointer text-sm"
            >
              <FileText className="w-4 h-4 text-white" />
              <span>Generate New Proposal</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-[#E2E8F0] rounded-xl p-4.5 flex items-center space-x-4 shadow-xs">
          <div className="w-12 h-12 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-[#1D68F2]">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-bold text-[#0F172A]">{totalProjects}</div>
            <div className="text-xs font-medium text-[#64748B]">Total SOW</div>
          </div>
        </div>

        <div className="bg-white border border-[#E2E8F0] rounded-xl p-4.5 flex items-center space-x-4 shadow-xs">
          <div className="w-12 h-12 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-[#1D68F2]">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-bold text-[#0F172A]">"2"</div>
            <div className="text-xs font-medium text-[#64748B]">Total Proposals</div>
          </div>
        </div>

        <div className="bg-white border border-[#E2E8F0] rounded-xl p-4.5 flex items-center space-x-4 shadow-xs">
          <div className="w-12 h-12 rounded-lg bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-bold text-[#0F172A]">{underReviewProjects}</div>
            <div className="text-xs font-medium text-[#64748B]">In Section Review (HITL)</div>
          </div>
        </div>

        <div className="bg-white border border-[#E2E8F0] rounded-xl p-4.5 flex items-center space-x-4 shadow-xs">
          <div className="w-12 h-12 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-bold text-[#0F172A]">{approvedProjects}</div>
            <div className="text-xs font-medium text-[#64748B]">Fully Approved / Exported</div>
          </div>
        </div>
      </div>

      {/* Projects Table */}
      <div className="bg-white border border-[#E2E8F0] rounded-xl overflow-hidden shadow-xs">
        <div className="p-5 border-b border-[#E2E8F0] bg-[#F8FAFC] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-bold text-[#0F172A] flex items-center space-x-2">
              <span>Active Projects</span>
              <span className="text-xs bg-blue-50 text-[#1D68F2] font-semibold px-2.5 py-0.5 rounded-full border border-blue-200">
                {projects.length}
              </span>
            </h2>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-[#F8FAFC] text-[#64748B] text-xs font-semibold uppercase tracking-wider border-b border-[#E2E8F0]">
                <th className="py-3 px-4">Project ID & Title</th>
                <th className="py-3 px-4">Client & Target Schedule</th>
                <th className="py-3 px-4">Status & State</th>
                <th className="py-3 px-4">Section Approval Progress</th>
                <th className="py-3 px-4">Owner</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0]">
              {projects.map((project) => {
                const totalSec = project.sections.length;
                const approvedSec = project.sections.filter(s => s.status === 'Approved').length;
                const progressPct = totalSec > 0 ? Math.round((approvedSec / totalSec) * 100) : 0;

                return (
                  <tr 
                    key={project.id}
                    className="hover:bg-[#F8FAFC] transition group"
                  >
                    <td className="py-4 px-4">
                      <div className="font-bold text-[#0F172A] group-hover:text-[#1D68F2] transition">
                        {project.title}
                      </div>
                      <div className="text-xs text-[#64748B] font-mono mt-0.5">
                        {project.id}
                      </div>
                    </td>

                    <td className="py-4 px-4">
                      <div className="text-[#334155] font-medium flex items-center space-x-1.5">
                        <Building className="w-3.5 h-3.5 text-[#94A3B8]" />
                        <span>{project.clientName}</span>
                      </div>
                      <div className="text-xs text-[#64748B] mt-0.5">
                        {project.targetStartDate} to {project.targetEndDate}
                      </div>
                    </td>

                    <td className="py-4 px-4">
                      <span className={`inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${
                        project.status === 'Exported' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                        project.status === 'Approved' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                        project.status === 'Under Review' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                        'bg-slate-100 text-slate-600 border-slate-200'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          project.status === 'Exported' ? 'bg-emerald-500' :
                          project.status === 'Approved' ? 'bg-blue-500' :
                          project.status === 'Under Review' ? 'bg-amber-500' :
                          'bg-slate-400'
                        }`} />
                        <span>{project.status}</span>
                      </span>
                    </td>

                    <td className="py-4 px-4">
                      <div className="w-full max-w-[160px] space-y-1.5">
                        <div className="flex justify-between text-xs font-medium">
                          <span className="text-[#64748B]">{approvedSec} of {totalSec} Approved</span>
                          <span className="text-[#1D68F2] font-semibold">{progressPct}%</span>
                        </div>
                        <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-[#1D68F2] rounded-full transition-all duration-500"
                            style={{ width: `${progressPct}%` }}
                          />
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-4">
                      <div className="text-xs text-[#0F172A] font-semibold">{project.ownerName}</div>
                      <div className="text-[11px] text-[#64748B] truncate max-w-[120px]">{project.ownerEmail}</div>
                    </td>

                    <td className="py-4 px-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => onSelectProject(project.id)}
                          className="flex items-center space-x-1 bg-[#1D68F2] hover:bg-[#1554c0] text-white text-xs font-bold px-3 py-1.5 rounded-lg transition active:scale-95 cursor-pointer shadow-xs"
                        >
                          <span>Review SOW</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>

                        <button
                          onClick={() => onOpenExportModal(project)}
                          className="p-1.5 bg-white hover:bg-slate-50 text-[#64748B] hover:text-[#0F172A] rounded-lg border border-[#CBD5E1] transition cursor-pointer"
                          title="Export DTMC Word Document"
                        >
                          <Download className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Real-time System Audit Stream */}
      <div className="bg-white border border-[#E2E8F0] rounded-xl p-5 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <h3 className="text-xs font-bold text-[#0F172A] uppercase tracking-widest">
              Activity Audit Trail
            </h3>
          </div>
          <span className="text-xs text-[#64748B] font-medium"> Enterprise Compliance Log</span>
        </div>

        <div className="space-y-2.5">
          {auditLogs.slice(0, 4).map((log) => (
            <div 
              key={log.id} 
              className="flex flex-col sm:flex-row sm:items-center justify-between bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg px-4 py-2.5 text-xs gap-2"
            >
              <div className="flex items-center space-x-3">
                <span className="font-mono text-[#1D68F2] font-semibold">{log.action}</span>
                <span className="text-[#334155]">{log.details}</span>
              </div>
              <div className="flex items-center space-x-3 text-[#64748B] shrink-0">
                <span className="font-medium text-[#0F172A]">{log.user}</span>
                <span>•</span>
                <span className="font-mono">{new Date(log.timestamp).toLocaleTimeString()}</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  {log.status} ({log.executionTimeMs}ms)
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
