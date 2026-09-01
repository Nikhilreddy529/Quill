import React, { useState } from 'react';
import { Workflow, Play, CheckCircle2, Clock, Code, ArrowRight, ShieldCheck, Sparkles, Send } from 'lucide-react';
import { N8N_WORKFLOWS } from '../data/sampleWorkflows';
import { N8nWorkflowDefinition } from '../types/quill';

export const N8nWorkflowViewer: React.FC = () => {
  const [selectedWorkflowId, setSelectedWorkflowId] = useState(N8N_WORKFLOWS[0].id);
  const [isExecuting, setIsExecuting] = useState(false);
  const [executionLog, setExecutionLog] = useState<string | null>(null);

  const activeWf = N8N_WORKFLOWS.find(w => w.id === selectedWorkflowId) || N8N_WORKFLOWS[0];

  const handleSimulateRun = async () => {
    setIsExecuting(true);
    setExecutionLog("Executing webhook listener node...");
    await new Promise(r => setTimeout(r, 600));
    setExecutionLog("Querying Microsoft Graph Search API /v1.0/search/query...");
    await new Promise(r => setTimeout(r, 800));
    setExecutionLog("Feeding grounded chunks into Azure OpenAI GPT-4o with Blank Pricing System Prompt...");
    await new Promise(r => setTimeout(r, 900));
    setExecutionLog("Writing records into SharePoint List SOW_Sections & SOW_AuditLogs...");
    await new Promise(r => setTimeout(r, 500));
    setExecutionLog("Workflow execution completed successfully in 2,420ms!");
    setIsExecuting(false);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-white border border-[#E2E8F0] rounded-xl p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-blue-50 text-[#1D68F2] border border-blue-200">
                n8n Enterprise Orchestration Bus
              </span>
              <span className="text-xs font-medium text-[#64748B]">Section 12 Specification</span>
            </div>
            <h2 className="text-xl font-bold text-[#0F172A]">n8n Business Workflows & Execution Topologies</h2>
            <p className="text-xs text-[#64748B]">
              Visual orchestration bus connecting the React frontend, Microsoft Graph Search RAG, Azure OpenAI, SharePoint Lists, and Python docxtpl service.
            </p>
          </div>

          <button
            onClick={handleSimulateRun}
            disabled={isExecuting}
            className="flex items-center space-x-2 bg-[#1D68F2] hover:bg-[#1554c0] text-white text-xs font-bold px-5 py-2.5 rounded-lg shadow-sm shadow-blue-500/20 transition active:scale-95 disabled:opacity-50 cursor-pointer"
          >
            {isExecuting ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Tracing Execution...</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Test Workflow Trace</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Workflow Tabs */}
      <div className="flex items-center space-x-2 overflow-x-auto bg-white p-1.5 rounded-xl border border-[#E2E8F0] shadow-2xs">
        {N8N_WORKFLOWS.map((wf) => (
          <button
            key={wf.id}
            onClick={() => setSelectedWorkflowId(wf.id)}
            className={`flex items-center space-x-2 px-4 py-2.5 rounded-lg text-xs font-bold transition cursor-pointer whitespace-nowrap ${
              selectedWorkflowId === wf.id
                ? 'bg-[#1D68F2] text-white shadow-sm shadow-blue-500/20'
                : 'text-[#64748B] hover:text-[#0F172A] hover:bg-slate-50'
            }`}
          >
            <Workflow className="w-3.5 h-3.5" />
            <span>{wf.name.split(':')[0]}</span>
          </button>
        ))}
      </div>

      {/* Execution Trace Live Bar */}
      {executionLog && (
        <div className="p-4 bg-white border border-blue-200 rounded-xl flex items-center justify-between text-xs text-[#0F172A] shadow-xs animate-fade-in">
          <div className="flex items-center space-x-2 font-mono">
            <span className="w-2 h-2 rounded-full bg-[#1D68F2] animate-pulse" />
            <span className="text-[#1D68F2] font-semibold">{executionLog}</span>
          </div>
          <span className="text-[10px] bg-emerald-50 px-2 py-0.5 rounded-full text-emerald-700 font-mono border border-emerald-200">Node Trace OK</span>
        </div>
      )}

      {/* Active Workflow Details */}
      <div className="bg-white border border-[#E2E8F0] rounded-xl p-6 shadow-xs space-y-6">
        <div>
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-[#0F172A]">{activeWf.name}</h3>
            <span className="font-mono text-xs text-[#1D68F2] bg-blue-50 px-2.5 py-1 rounded border border-blue-200 font-semibold">
              {activeWf.endpoint}
            </span>
          </div>
          <p className="text-xs text-[#64748B] mt-1">{activeWf.description}</p>
          <div className="text-[11px] text-[#64748B] mt-1">
            Trigger Event: <strong className="text-[#0F172A]">{activeWf.triggerEvent}</strong>
          </div>
        </div>

        {/* Visual Node Graph Sequence */}
        <div className="space-y-3">
          <div className="text-xs font-bold text-[#64748B] uppercase tracking-wider">
            Sequential Node Pipeline ({activeWf.nodes.length} Nodes)
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {activeWf.nodes.map((node, nIdx) => (
              <div 
                key={node.id}
                className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-4 space-y-2 relative group hover:border-blue-300 transition"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-white text-[#64748B] font-mono border border-[#CBD5E1]">
                    Step {nIdx + 1}
                  </span>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    {node.executionTime}
                  </span>
                </div>

                <div className="font-bold text-xs text-[#0F172A] group-hover:text-[#1D68F2] transition">
                  {node.name}
                </div>

                <div className="text-[11px] font-mono text-[#1D68F2] truncate">
                  {node.type}
                </div>

                <div className="pt-2 border-t border-[#E2E8F0] flex items-center justify-between text-[10px] text-[#64748B]">
                  <span>Category: {node.category}</span>
                  <span className="text-emerald-700 font-semibold">Status: Success</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sample Payload & Response */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-[#E2E8F0]">
          <div className="space-y-2">
            <div className="text-xs font-bold text-[#334155] uppercase tracking-wider flex items-center space-x-1.5">
              <Code className="w-3.5 h-3.5 text-[#1D68F2]" />
              <span>Sample Webhook Input Payload</span>
            </div>
            <pre className="p-3.5 bg-slate-900 rounded-xl border border-slate-800 text-[11px] font-mono text-slate-200 overflow-x-auto">
              {JSON.stringify(activeWf.samplePayload, null, 2)}
            </pre>
          </div>

          <div className="space-y-2">
            <div className="text-xs font-bold text-[#334155] uppercase tracking-wider flex items-center space-x-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Sample REST Response Payload</span>
            </div>
            <pre className="p-3.5 bg-slate-900 rounded-xl border border-slate-800 text-[11px] font-mono text-emerald-400 overflow-x-auto">
              {JSON.stringify(activeWf.sampleResponse, null, 2)}
            </pre>
          </div>
        </div>

      </div>

    </div>
  );
};
