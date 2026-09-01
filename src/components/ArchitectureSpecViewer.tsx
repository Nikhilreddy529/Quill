import React, { useState } from 'react';
import { 
  BookOpen, 
  Search, 
  Layers, 
  Code, 
  CheckCircle2, 
  Copy, 
  Check, 
  ChevronRight, 
  FileText,
  Sparkles,
  ShieldCheck,
  Zap,
  Printer
} from 'lucide-react';
import { ARCHITECTURE_BLUEPRINT, BlueprintSection } from '../data/architectureBlueprint';

export const ArchitectureSpecViewer: React.FC = () => {
  const [selectedSectionId, setSelectedSectionId] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const categories = [
    'All',
    'Executive & Strategy',
    'Architecture & Tech',
    'Workflows & Data',
    'UX & Screens',
    'Pipelines & Prompts',
    'Security & Ops',
    'Project & Governance'
  ];

  const filteredSections = ARCHITECTURE_BLUEPRINT.filter(section => {
    const matchesCategory = selectedCategory === 'All' || section.category === selectedCategory;
    const matchesSearch = searchQuery === '' || 
      section.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      section.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      section.keyHighlights.some(h => h.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const activeSection = ARCHITECTURE_BLUEPRINT.find(s => s.id === selectedSectionId) || ARCHITECTURE_BLUEPRINT[0];

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="bg-white border border-[#E2E8F0] rounded-xl p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-blue-50 text-[#1D68F2] border border-blue-200">
                Enterprise Solution Blueprint
              </span>
              <span className="text-xs font-medium text-[#64748B]">All 25 Required Sections</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#0F172A]">
              Quill: AI-Powered SOW Authoring Platform Specification
            </h2>
            <p className="text-xs text-[#64748B]">
              Complete architectural design, RAG pipeline, Graph Search integration, SharePoint lists, n8n workflows, prompt schemas, and 2-week sprint plan.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => window.print()}
              className="flex items-center space-x-1.5 bg-white hover:bg-slate-50 text-[#334155] text-xs font-semibold px-4 py-2.5 rounded-lg border border-[#CBD5E1] transition cursor-pointer"
            >
              <Printer className="w-4 h-4 text-[#1D68F2]" />
              <span>Print / Save PDF</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: Sidebar Navigator + Detailed Section Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Sidebar: Section Index & Search */}
        <div className="lg:col-span-4 bg-white border border-[#E2E8F0] rounded-xl p-4 shadow-xs space-y-4">
          
          {/* Search Input */}
          <div className="relative">
            <Search className="w-4 h-4 text-[#94A3B8] absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search 25 architectural sections..."
              className="w-full bg-white border border-[#CBD5E1] rounded-lg pl-9 pr-3.5 py-2 text-xs text-[#0F172A] focus:outline-none focus:border-[#1D68F2]"
            />
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap gap-1">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`text-[10px] font-bold px-2.5 py-1 rounded-md transition cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-[#1D68F2] text-white shadow-2xs'
                    : 'bg-slate-100 text-[#64748B] hover:text-[#0F172A] hover:bg-slate-200 border border-transparent'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Section Jump List */}
          <div className="space-y-1 max-h-[620px] overflow-y-auto pr-1">
            {filteredSections.map((sec) => (
              <button
                key={sec.id}
                onClick={() => setSelectedSectionId(sec.id)}
                className={`w-full text-left p-2.5 rounded-lg text-xs font-medium transition flex items-center justify-between cursor-pointer ${
                  selectedSectionId === sec.id
                    ? 'bg-blue-50 border border-blue-200 text-[#1D68F2] font-bold shadow-2xs'
                    : 'text-[#64748B] hover:text-[#0F172A] hover:bg-slate-50 border border-transparent'
                }`}
              >
                <span className="truncate pr-2">{sec.title}</span>
                <ChevronRight className={`w-3.5 h-3.5 shrink-0 ${
                  selectedSectionId === sec.id ? 'text-[#1D68F2]' : 'text-[#94A3B8]'
                }`} />
              </button>
            ))}

            {filteredSections.length === 0 && (
              <div className="p-4 text-center text-xs text-[#94A3B8]">
                No matching architectural sections found.
              </div>
            )}
          </div>
        </div>

        {/* Right Content Area: Detailed Blueprint Section */}
        <div className="lg:col-span-8 bg-white border border-[#E2E8F0] rounded-xl p-6 sm:p-8 shadow-xs space-y-6">
          
          {/* Section Header */}
          <div className="space-y-3 border-b border-[#E2E8F0] pb-5">
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-blue-50 text-[#1D68F2] border border-blue-200">
                {activeSection.category}
              </span>
              <span className="text-xs font-mono text-[#64748B]">
                Architecture Blueprint Part {activeSection.id} of 25
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-[#0F172A]">
              {activeSection.title}
            </h1>
          </div>

          {/* Key Strategic Highlights */}
          {activeSection.keyHighlights && activeSection.keyHighlights.length > 0 && (
            <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-4 space-y-2">
              <div className="text-xs font-bold text-[#1D68F2] uppercase tracking-wider flex items-center space-x-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#1D68F2]" />
                <span>Key Architectural Takeaways</span>
              </div>
              <ul className="space-y-1.5 text-xs text-[#334155]">
                {activeSection.keyHighlights.map((highlight, idx) => (
                  <li key={idx} className="flex items-start space-x-2">
                    <span className="text-[#1D68F2] font-bold">•</span>
                    <span>{highlight}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* ASCII Diagram if present */}
          {activeSection.asciiDiagram && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-[#64748B] uppercase tracking-wider">
                <span className="flex items-center space-x-1.5">
                  <Layers className="w-3.5 h-3.5 text-[#1D68F2]" />
                  <span>ASCII Architecture Topology</span>
                </span>
                <button
                  onClick={() => handleCopy(activeSection.asciiDiagram || '', 999)}
                  className="flex items-center space-x-1 text-[11px] text-[#1D68F2] hover:underline cursor-pointer"
                >
                  {copiedIndex === 999 ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedIndex === 999 ? 'Copied' : 'Copy ASCII'}</span>
                </button>
              </div>
              <pre className="p-4 bg-slate-900 rounded-xl border border-slate-800 text-[10px] sm:text-xs font-mono text-emerald-400 overflow-x-auto leading-tight shadow-inner">
                {activeSection.asciiDiagram}
              </pre>
            </div>
          )}

          {/* Code Snippets if present */}
          {activeSection.codeSnippets && activeSection.codeSnippets.map((snippet, sIdx) => (
            <div key={sIdx} className="space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-[#64748B] uppercase tracking-wider">
                <span className="flex items-center space-x-1.5">
                  <Code className="w-3.5 h-3.5 text-[#1D68F2]" />
                  <span>{snippet.title}</span>
                </span>
                <button
                  onClick={() => handleCopy(snippet.code, sIdx)}
                  className="flex items-center space-x-1 text-[11px] text-[#1D68F2] hover:underline cursor-pointer"
                >
                  {copiedIndex === sIdx ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedIndex === sIdx ? 'Copied' : 'Copy Code'}</span>
                </button>
              </div>
              <pre className="p-4 bg-slate-900 rounded-xl border border-slate-800 text-[11px] font-mono text-slate-200 overflow-x-auto leading-relaxed shadow-inner">
                {snippet.code}
              </pre>
            </div>
          ))}

          {/* Main Section Content */}
          <div className="prose prose-slate max-w-none text-xs sm:text-sm text-[#334155] leading-relaxed space-y-4">
            {activeSection.content.split('\n\n').map((para, pIdx) => {
              if (para.startsWith('### ')) {
                return (
                  <h3 key={pIdx} className="text-base sm:text-lg font-bold text-[#0F172A] mt-6 border-b border-[#E2E8F0] pb-1.5">
                    {para.replace('### ', '')}
                  </h3>
                );
              }
              if (para.startsWith('#### ')) {
                return (
                  <h4 key={pIdx} className="text-sm font-bold text-[#1D68F2] mt-4">
                    {para.replace('#### ', '')}
                  </h4>
                );
              }
              if (para.startsWith('|')) {
                const rows = para.trim().split('\n');
                const headerRow = rows[0]?.split('|').map(s => s.trim()).filter(Boolean) || [];
                const bodyRows = rows.slice(2).map(r => r.split('|').map(s => s.trim()).filter(Boolean));

                return (
                  <div key={pIdx} className="overflow-x-auto my-4 border border-[#E2E8F0] rounded-xl">
                    <table className="w-full text-xs text-left">
                      <thead className="bg-[#F8FAFC] text-[#64748B] font-semibold border-b border-[#E2E8F0]">
                        <tr>
                          {headerRow.map((h, i) => (
                            <th key={i} className="py-2.5 px-3.5">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#E2E8F0] font-sans">
                        {bodyRows.map((r, ri) => (
                          <tr key={ri} className="hover:bg-slate-50">
                            {r.map((cell, ci) => (
                              <td key={ci} className="py-2.5 px-3.5 text-[#334155]">
                                {cell.startsWith('**') ? <strong>{cell.replace(/\*\*/g, '')}</strong> : cell}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                );
              }

              if (para.startsWith('* ') || para.startsWith('- ')) {
                return (
                  <ul key={pIdx} className="space-y-1.5 pl-4 list-disc text-[#334155]">
                    {para.split('\n').map((item, iIdx) => (
                      <li key={iIdx}>
                        {item.replace(/^[\*\-]\s*/, '').replace(/\*\*(.*?)\*\*/g, '$1')}
                      </li>
                    ))}
                  </ul>
                );
              }

              return (
                <p key={pIdx} className="text-[#334155] leading-relaxed">
                  {para.replace(/\*\*(.*?)\*\*/g, '$1')}
                </p>
              );
            })}
          </div>

          {/* Bottom Pagination */}
          <div className="pt-6 border-t border-[#E2E8F0] flex items-center justify-between">
            <button
              onClick={() => setSelectedSectionId(Math.max(1, selectedSectionId - 1))}
              disabled={selectedSectionId === 1}
              className="text-xs font-semibold px-4 py-2 bg-white hover:bg-slate-50 text-[#334155] border border-[#CBD5E1] disabled:opacity-30 disabled:cursor-not-allowed rounded-lg transition cursor-pointer"
            >
              ← Previous Section
            </button>

            <span className="text-xs text-[#64748B] font-mono">
              Section {selectedSectionId} of 25
            </span>

            <button
              onClick={() => setSelectedSectionId(Math.min(25, selectedSectionId + 1))}
              disabled={selectedSectionId === 25}
              className="text-xs font-bold px-4 py-2 bg-[#1D68F2] hover:bg-[#1554c0] text-white disabled:opacity-30 disabled:cursor-not-allowed rounded-lg transition cursor-pointer shadow-2xs"
            >
              Next Section →
            </button>
          </div>

        </div>

      </div>

    </div>
  );
};
