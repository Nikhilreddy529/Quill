import React, { useState } from 'react';
import { Database, Table, ShieldCheck, Code, Search, Layers, CheckCircle2, Clock } from 'lucide-react';
import { SHAREPOINT_LIST_SCHEMAS, SAMPLE_AUDIT_LOGS } from '../data/sampleSharePointData';
import { SOWProject } from '../types/quill';

interface SharePointListsViewerProps {
  projects: SOWProject[];
}

export const SharePointListsViewer: React.FC<SharePointListsViewerProps> = ({ projects }) => {
  const [activeListIndex, setActiveListIndex] = useState(0);
  const activeSchema = SHAREPOINT_LIST_SCHEMAS[activeListIndex];

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-white border border-[#E2E8F0] rounded-xl p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-blue-50 text-[#1D68F2] border border-blue-200">
                SharePoint Online Hybrid State Store
              </span>
              <span className="text-xs font-medium text-[#64748B]">Section 10 Architecture</span>
            </div>
            <h2 className="text-xl font-bold text-[#0F172A]">SharePoint Lists Schema & Live Datastore</h2>
            <p className="text-xs text-[#64748B]">
              Quill stores lightweight relational state in native Microsoft 365 SharePoint Lists, eliminating database management overhead for MVP.
            </p>
          </div>
          
          <div className="flex items-center space-x-2 bg-slate-50 px-3 py-1.5 rounded-lg border border-[#CBD5E1] text-xs text-[#334155]">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Tenant: contoso.sharepoint.com/sites/quill</span>
          </div>
        </div>
      </div>

      {/* List Selector Tabs */}
      <div className="flex items-center space-x-2 overflow-x-auto bg-white p-1.5 rounded-xl border border-[#E2E8F0] shadow-2xs">
        {SHAREPOINT_LIST_SCHEMAS.map((schema, idx) => (
          <button
            key={schema.listName}
            onClick={() => setActiveListIndex(idx)}
            className={`flex items-center space-x-2 px-4 py-2.5 rounded-lg text-xs font-bold transition cursor-pointer whitespace-nowrap ${
              activeListIndex === idx
                ? 'bg-[#1D68F2] text-white shadow-sm shadow-blue-500/20'
                : 'text-[#64748B] hover:text-[#0F172A] hover:bg-slate-50'
            }`}
          >
            <Table className="w-3.5 h-3.5" />
            <span>{schema.listName}</span>
          </button>
        ))}
      </div>

      {/* Active List Overview & Schema Card */}
      <div className="bg-white border border-[#E2E8F0] rounded-xl overflow-hidden shadow-xs">
        <div className="p-5 border-b border-[#E2E8F0] bg-[#F8FAFC] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-[#0F172A] flex items-center space-x-2">
              <span className="text-[#1D68F2] font-mono">{activeSchema.listName}</span>
              <span className="text-xs text-[#64748B] font-normal">({activeSchema.fields.length} Fields Defined)</span>
            </h3>
            <p className="text-xs text-[#64748B] mt-0.5">{activeSchema.description}</p>
          </div>
          <span className="text-xs bg-white text-[#475569] px-3 py-1 rounded font-mono border border-[#CBD5E1]">
            Endpoint: /_api/web/lists/getbytitle('{activeSchema.listName}')/items
          </span>
        </div>

        {/* Fields Schema Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#F8FAFC] text-[#64748B] font-bold uppercase tracking-wider border-b border-[#E2E8F0]">
                <th className="py-3 px-4">Field Internal Name</th>
                <th className="py-3 px-4">SharePoint Data Type</th>
                <th className="py-3 px-4">Required</th>
                <th className="py-3 px-4">Description & Allowed Choices</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0] font-mono">
              {activeSchema.fields.map((field) => (
                <tr key={field.name} className="hover:bg-slate-50 transition">
                  <td className="py-3 px-4 font-bold text-[#1D68F2]">{field.name}</td>
                  <td className="py-3 px-4 text-[#475569]">{field.type}</td>
                  <td className="py-3 px-4">
                    {field.required ? (
                      <span className="text-emerald-700 font-bold">YES</span>
                    ) : (
                      <span className="text-[#94A3B8]">NO</span>
                    )}
                  </td>
                  <td className="py-3 px-4 font-sans text-[#334155]">
                    <div>{field.description}</div>
                    {field.allowedValues && (
                      <div className="flex flex-wrap gap-1 mt-1 font-mono text-[10px]">
                        {field.allowedValues.map((v) => (
                          <span key={v} className="bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200 text-[#475569]">
                            "{v}"
                          </span>
                        ))}
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Live Data Records Preview */}
      <div className="bg-white border border-[#E2E8F0] rounded-xl p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Code className="w-4 h-4 text-[#1D68F2]" />
            <h4 className="text-sm font-bold text-[#0F172A] uppercase tracking-wider">
              Live Mock Records in {activeSchema.listName}
            </h4>
          </div>
          <span className="text-xs text-[#64748B]">Synchronized with React State</span>
        </div>

        {activeSchema.listName === 'SOW_Projects' && (
          <div className="space-y-2">
            {projects.map((p) => (
              <div key={p.id} className="p-3.5 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0] text-xs space-y-1">
                <div className="flex items-center justify-between font-bold text-[#0F172A]">
                  <span>{p.title} ({p.id})</span>
                  <span className="text-[#1D68F2] font-mono text-xs">{p.status}</span>
                </div>
                <div className="text-[#64748B]">
                  Client: <span className="text-[#0F172A] font-medium">{p.clientName}</span> • Owner: <span className="text-[#0F172A] font-medium">{p.ownerEmail}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeSchema.listName === 'SOW_Sections' && (
          <div className="space-y-2">
            {projects[0]?.sections.map((s) => (
              <div key={s.id} className="p-3.5 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0] text-xs space-y-1">
                <div className="flex items-center justify-between font-bold text-[#0F172A]">
                  <span>Order {s.order}: {s.title} ({s.id})</span>
                  <span className="text-emerald-700 font-mono text-xs">{s.status}</span>
                </div>
                <div className="text-[#64748B]">
                  Category: {s.category} • Confidence: {s.confidenceScore}% • Grounded Sources: {s.groundedSources.length}
                </div>
              </div>
            ))}
          </div>
        )}

        {activeSchema.listName === 'SOW_AuditLogs' && (
          <div className="space-y-2">
            {SAMPLE_AUDIT_LOGS.map((log) => (
              <div key={log.id} className="p-3 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0] text-xs flex items-center justify-between">
                <div>
                  <span className="font-mono text-[#1D68F2] font-bold">{log.action}</span>
                  <span className="text-[#334155] ml-2">{log.details}</span>
                </div>
                <span className="text-[#64748B] font-mono">{log.timestamp}</span>
              </div>
            ))}
          </div>
        )}

        {activeSchema.listName === 'SOW_Approvals' && (
          <div className="p-4 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0] text-xs text-[#64748B]">
            Signed off records generated on human approval gates. Contains electronic audit stamp and user principal ID.
          </div>
        )}

      </div>

    </div>
  );
};
