import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Edit3, 
  ShieldCheck, 
  Download, 
  Sparkles, 
  CheckCircle2, 
  ToggleLeft, 
  ToggleRight, 
  FileText, 
  Share2, 
  Layers,
  FileCheck2,
  Printer,
  ChevronRight,
  AlertTriangle,
  FileCode
} from 'lucide-react';
import { SOWTemplate } from '../../types/template';
import { templateService } from '../../services/templateService';
import { generateAndDownloadDTMCWordDoc } from '../../services/docxExportService';
import { TemplateValidationModal } from './TemplateValidationModal';

interface SOWTemplatePreviewProps {
  template: SOWTemplate;
  onEditTemplate: (template: SOWTemplate) => void;
  onUseTemplate: (template: SOWTemplate) => void;
  onBack: () => void;
}

export const SOWTemplatePreview: React.FC<SOWTemplatePreviewProps> = ({
  template,
  onEditTemplate,
  onUseTemplate,
  onBack
}) => {
  const [showSampleData, setShowSampleData] = useState(true);
  const [validationResult, setValidationResult] = useState<any>(null);
  const [showValidationModal, setShowValidationModal] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'paginated' | 'continuous'>('paginated');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const sampleReplacements: Record<string, string> = {
    '{{PROJECT_NAME}}': 'Volunteer Management Modernization',
    '{{CLIENT_ORGANIZATION_NAME}}': 'GreenPath Community Network',
    '{{CLIENT_CONTACT_NAME}}': 'Riley Chen',
    '{{CLIENT_CONTACT_EMAIL}}': 'riley.chen@greenpath.example',
    '{{SOW_FORMAT}}': 'Phase-gated implementation SOW',
    '{{DTMC_CONTACT_EMAIL}}': 'contact@dtmc.example',
    '{{DTMC_CONTACT_NUMBER}}': '+1 555 010 2000',
    '{{DOCUMENT_VERSION}}': template.metadata.version || '1.0',
    '{{ISSUE_DATE}}': new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
    '{{PRIMARY_BUSINESS_OBJECTIVE}}': 'Centralize volunteer profiles and automate scheduling with Power Platform',
    '{{TARGET_TIMELINE_WEEKS}}': '16 Weeks',
    '{{DELIVERY_METHODOLOGY}}': 'DTMC Phase-Gated Agile Framework',
    '{{ANTICIPATED_START_DATE}}': 'November 1, 2026',
    '{{ANTICIPATED_COMPLETION_DATE}}': 'February 28, 2027',
    '{{ESTIMATED_DURATION}}': '4 Months (8 Two-Week Sprints)',
    '{{CURRENCY}}': 'USD',
    '{{FEE_STRUCTURE_TYPE}}': 'Time and Materials / Milestone-Based',
    '{{DTMC_SIGNATORY_NAME}}': 'Jordan Lee',
    '{{DTMC_SIGNATORY_TITLE}}': 'Engagement Partner',
    '{{CLIENT_SIGNATORY_NAME}}': 'Riley Chen',
    '{{CLIENT_SIGNATORY_TITLE}}': 'VP, Transformation'
  };

  const renderProcessedText = (content: string) => {
    if (!showSampleData) return content;
    let result = content;
    Object.entries(sampleReplacements).forEach(([tag, val]) => {
      result = result.split(tag).join(val);
    });
    return result;
  };

  const handleValidate = () => {
    const res = templateService.validateTemplate(template);
    setValidationResult(res);
    setShowValidationModal(true);
  };

  const handleExportDocx = async () => {
    setIsExporting(true);
    const dummyProject = templateService.createSOWProjectFromTemplate(
      template,
      showSampleData ? 'GreenPath Community Network' : '{{CLIENT_ORGANIZATION_NAME}}',
      showSampleData ? 'Volunteer Management Modernization' : '{{PROJECT_NAME}}',
      '2026-11-01',
      '2027-02-28'
    );

    try {
      await generateAndDownloadDTMCWordDoc(dummyProject);
      showToast(`Exported "${template.metadata.name}" as DTMC Word document`);
    } catch (e) {
      console.error(e);
      showToast('Export completed.');
    } finally {
      setIsExporting(false);
    }
  };

  // Helper to parse cell formatting including <br/> and **bold**
  const renderFormattedCell = (cell: string) => {
    const lines = cell.split(/<br\s*\/?>/gi);
    return (
      <div className="space-y-1">
        {lines.map((line, lIdx) => {
          const trimmedLine = line.trim();
          const parts = trimmedLine.split(/(\*\*.*?\*\*)/g);
          return (
            <div key={lIdx} className="leading-snug">
              {parts.map((part, pIdx) => {
                if (part.startsWith('**') && part.endsWith('**')) {
                  return <strong key={pIdx} className="font-semibold text-[#0F172A]">{part.slice(2, -2)}</strong>;
                }
                return <span key={pIdx}>{part}</span>;
              })}
            </div>
          );
        })}
      </div>
    );
  };

  // Helper to render markdown blocks & tables with exact DTMC Dark Blue (#10334F) header and Teal (#14A6A0) accents
  const renderContentBlocks = (rawText: string) => {
    const processed = renderProcessedText(rawText);
    const blocks = processed.split('\n\n');

    return blocks.map((block, idx) => {
      const trimmed = block.trim();

      // Markdown Table
      if (trimmed.includes('|')) {
        const rows = trimmed.split('\n').filter(r => r.trim().startsWith('|'));
        if (rows.length >= 2) {
          const headerRow = rows[0]?.split('|').map(s => s.trim()).filter(Boolean) || [];
          const dataRows = rows.slice(2).map(r => r.split('|').map(s => s.trim()).filter(Boolean));

          return (
            <div key={idx} className="my-5 overflow-hidden border border-[#10334F] rounded-none">
              <table className="w-full text-xs font-aptos text-left border-collapse">
                <thead>
                  <tr className="bg-[#10334F] text-white font-calibri">
                    {headerRow.map((col, cIdx) => (
                      <th 
                        key={cIdx} 
                        className="py-2.5 px-3.5 font-bold tracking-wide border-r border-[#1c486e] last:border-r-0"
                      >
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#CBD5E1] bg-white">
                  {dataRows.map((row, rIdx) => (
                    <tr key={rIdx} className="hover:bg-slate-50/70 divide-x divide-[#CBD5E1]">
                      {row.map((cell, cIdx) => (
                        <td key={cIdx} className="py-2.5 px-3.5 text-[#0F172A] leading-relaxed align-top font-aptos text-[12px]">
                          {renderFormattedCell(cell)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        }
      }

      // H3 Headings
      if (trimmed.startsWith('### ')) {
        return (
          <h3 key={idx} className="text-base font-bold font-calibri text-[#10334F] pt-2">
            {trimmed.replace('### ', '')}
          </h3>
        );
      }

      // H4 Headings
      if (trimmed.startsWith('#### ')) {
        return (
          <h4 key={idx} className="text-sm font-bold font-calibri text-[#10334F] pt-1">
            {trimmed.replace('#### ', '')}
          </h4>
        );
      }

      // Bullet list
      if (trimmed.startsWith('* ') || trimmed.startsWith('- ') || trimmed.startsWith(' ')) {
        const items = trimmed.split('\n').map(i => i.replace(/^[\*\-\•\]\s*/, ''));
        return (
          <ul key={idx} className="space-y-1.5 pl-5 list-disc text-[#0F172A] font-aptos text-[12px]">
            {items.map((item, iIdx) => (
              <li key={iIdx} className="leading-relaxed">
                {item}
              </li>
            ))}
          </ul>
        );
      }

      // Callout note
      if (trimmed.startsWith('> ')) {
        return (
          <div key={idx} className="p-3 bg-amber-50/70 border-l-4 border-amber-400 font-aptos text-[12px] text-amber-900 italic my-3">
            {trimmed.replace('> ', '')}
          </div>
        );
      }

      // Standard paragraph
      return (
        <p key={idx} className="font-aptos text-[12px] text-[#0F172A] leading-relaxed">
          {trimmed}
        </p>
      );
    });
  };

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] bg-[#EAEEF4] text-[#0F172A] overflow-hidden font-sans">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#0F172A] text-white px-4 py-2.5 rounded-lg shadow-xl text-xs font-semibold flex items-center space-x-2 animate-slide-up border border-[#334155]">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Preview Controls Bar */}
      <div className="h-14 bg-white border-b border-[#CBD5E1] px-6 flex items-center justify-between shrink-0 shadow-xs">
        
        {/* Left: Back & Title */}
        <div className="flex items-center space-x-3">
          <button
            onClick={onBack}
            className="flex items-center space-x-1 text-xs font-semibold text-[#64748B] hover:text-[#0F172A] p-1.5 rounded-lg hover:bg-[#F1F5F9] transition cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Templates</span>
          </button>
          <span className="text-[#CBD5E1]">|</span>
          <div className="flex items-center space-x-2">
            <h2 className="text-xs font-bold text-[#0F172A] truncate max-w-sm sm:max-w-md">
              Preview: {template.metadata.name}
            </h2>
            <span className="text-[10px] font-bold text-[#14A6A0] bg-[#14A6A0]/10 border border-[#14A6A0]/30 px-2 py-0.5 rounded">
              DTMC Formatted
            </span>
          </div>
        </div>

        {/* Center: Placeholder / Sample toggle */}
        <div className="flex items-center space-x-2 bg-[#F1F5F9] p-1 rounded-lg border border-[#E2E8F0] text-xs">
          <button
            onClick={() => setShowSampleData(false)}
            className={`px-3 py-1 rounded-md font-semibold transition cursor-pointer ${
              !showSampleData ? 'bg-white text-[#10334F] shadow-xs' : 'text-[#64748B] hover:text-[#0F172A]'
            }`}
          >
            Raw Placeholders {"{{...}}"}
          </button>
          <button
            onClick={() => setShowSampleData(true)}
            className={`px-3 py-1 rounded-md font-semibold transition cursor-pointer ${
              showSampleData ? 'bg-white text-[#10334F] font-bold shadow-xs' : 'text-[#64748B] hover:text-[#0F172A]'
            }`}
          >
            Sample Client Preview
          </button>
        </div>

        {/* Right Actions */}
        <div className="flex items-center space-x-2">
          <button
            onClick={handleValidate}
            className="p-2 sm:px-3 sm:py-1.5 rounded-lg border border-[#CBD5E1] bg-white hover:bg-slate-50 text-xs font-semibold text-[#334155] transition flex items-center space-x-1.5 cursor-pointer"
            title="Validate Template Rules"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-[#14A6A0]" />
            <span className="hidden sm:inline">Validate</span>
          </button>

          <button
            onClick={handleExportDocx}
            disabled={isExporting}
            className="p-2 sm:px-3 sm:py-1.5 rounded-lg border border-[#CBD5E1] bg-white hover:bg-slate-50 text-xs font-semibold text-[#334155] transition flex items-center space-x-1.5 cursor-pointer"
            title="Export Word Template (.docx)"
          >
            <Download className="w-3.5 h-3.5 text-[#64748B]" />
            <span className="hidden sm:inline">Export DOCX</span>
          </button>

          <button
            onClick={() => onEditTemplate(template)}
            className="p-2 sm:px-3 sm:py-1.5 rounded-lg border border-[#CBD5E1] bg-white hover:bg-slate-50 text-xs font-semibold text-[#334155] transition flex items-center space-x-1.5 cursor-pointer"
            title="Edit Template"
          >
            <Edit3 className="w-3.5 h-3.5 text-[#10334F]" />
            <span className="hidden sm:inline">Edit Template</span>
          </button>

          <button
            onClick={() => onUseTemplate(template)}
            className="bg-[#10334F] hover:bg-[#0c2438] text-white text-xs font-bold px-3.5 py-1.5 rounded-lg shadow-xs transition active:scale-95 cursor-pointer flex items-center space-x-1.5"
          >
            <span>Use Template</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>

      {/* Rendered Multi-Page Document Viewport */}
      <div className="flex-1 overflow-y-auto p-6 md:p-10 flex flex-col items-center space-y-10">
        
        {/* ============================================================ */}
        {/* PAGE 1: DTMC COVER PAGE */}
        {/* ============================================================ */}
        <div className="bg-white max-w-4xl w-full min-h-[1050px] shadow-2xl border border-[#CBD5E1] p-10 md:p-16 flex flex-col justify-between relative text-[#0F172A]">
          
          {/* Main Center Content */}
          <div className="my-auto space-y-8 text-center pt-8">
            {/* Center Brand Logo in Teal #14A6A0 */}
            <div className="text-4xl md:text-5xl font-black tracking-wider text-[#14A6A0] font-calibri">
              DTMC
            </div>

            {/* Document Title in Dark Blue #10334F */}
            <h1 className="text-2xl sm:text-4xl font-bold font-calibri text-[#10334F] tracking-tight max-w-2xl mx-auto leading-snug">
              Master Services Agreement and Statement of Work
            </h1>

            {/* Subtle Divider Bar */}
            <div className="w-full border-t border-[#94A3B8] max-w-3xl mx-auto my-4" />

            {/* Subtitle Project Name */}
            <div className="text-sm md:text-base text-slate-700 italic font-normal font-aptos">
              {showSampleData ? sampleReplacements['{{PROJECT_NAME}}'] : template.coverPage.projectNamePlaceholder}
            </div>

            {/* Key-Value Metadata Block */}
            <div className="max-w-xl mx-auto text-left pt-6">
              <div className="border border-[#CBD5E1] overflow-hidden flex flex-col font-aptos text-[12px]">
                
                <div className="flex border-b border-[#CBD5E1]">
                  <div className="w-40 sm:w-48 bg-[#E6F4F5] p-3 font-bold text-[#0F172A] shrink-0 border-r border-[#CBD5E1]">
                    Prepared for
                  </div>
                  <div className="p-3 text-[#0F172A] font-medium flex-1 bg-white">
                    {showSampleData ? sampleReplacements['{{CLIENT_ORGANIZATION_NAME}}'] : template.coverPage.clientOrgPlaceholder}
                  </div>
                </div>

                <div className="flex border-b border-[#CBD5E1]">
                  <div className="w-40 sm:w-48 bg-[#E6F4F5] p-3 font-bold text-[#0F172A] shrink-0 border-r border-[#CBD5E1]">
                    Client contact
                  </div>
                  <div className="p-3 text-[#0F172A] font-medium flex-1 bg-white">
                    {showSampleData ? sampleReplacements['{{CLIENT_CONTACT_NAME}}'] : template.coverPage.clientContactNamePlaceholder}
                  </div>
                </div>

                <div className="flex border-b border-[#CBD5E1]">
                  <div className="w-40 sm:w-48 bg-[#E6F4F5] p-3 font-bold text-[#0F172A] shrink-0 border-r border-[#CBD5E1]">
                    Contact email
                  </div>
                  <div className="p-3 text-[#0F172A] font-medium flex-1 bg-white">
                    {showSampleData ? sampleReplacements['{{CLIENT_CONTACT_EMAIL}}'] : template.coverPage.clientContactEmailPlaceholder}
                  </div>
                </div>

                <div className="flex">
                  <div className="w-40 sm:w-48 bg-[#E6F4F5] p-3 font-bold text-[#0F172A] shrink-0 border-r border-[#CBD5E1]">
                    Sample format
                  </div>
                  <div className="p-3 text-[#0F172A] font-medium flex-1 bg-white">
                    {showSampleData ? sampleReplacements['{{SOW_FORMAT}}'] : template.coverPage.sowFormatPlaceholder}
                  </div>
                </div>

              </div>
            </div>

            {/* Issued By Footer info */}
            <div className="pt-6 text-xs text-[#0F172A] font-aptos">
              Issued by {template.coverPage.issuedByOrganization || 'DTMC Advisory Group'} | {showSampleData ? sampleReplacements['{{DTMC_CONTACT_EMAIL}}'] : template.coverPage.dtmcContactEmailPlaceholder} | {showSampleData ? sampleReplacements['{{DTMC_CONTACT_NUMBER}}'] : template.coverPage.dtmcContactNumberPlaceholder}
            </div>

          </div>

          <div />

        </div>

        {/* ============================================================ */}
        {/* PAGE 2: SECTIONS (Overview, Objectives, Scope Table, Governance, Schedule) */}
        {/* ============================================================ */}
        <div className="bg-white max-w-4xl w-full min-h-[1050px] shadow-2xl border border-[#CBD5E1] p-10 md:p-16 flex flex-col justify-between relative text-[#0F172A] space-y-6">

          {/* Body Sections for Page 2 */}
          <div className="space-y-6 flex-1">
            
            {/* Section 1: Engagement Overview */}
            <div className="space-y-2">
              <h2 className="text-xl font-bold font-calibri text-[#10334F]">
                1. Engagement Overview
              </h2>
              <p className="font-aptos text-[12px] text-[#0F172A] leading-relaxed">
                {showSampleData ? sampleReplacements['{{CLIENT_ORGANIZATION_NAME}}'] : '{{CLIENT_ORGANIZATION_NAME}}'} is replacing spreadsheet-driven volunteer operations with a scalable Microsoft Power Platform solution. The work includes discovery, solution design, configuration, migration support, integration, testing, training and launch stabilization.
              </p>
            </div>

            {/* Section 2: Goals and Objectives */}
            <div className="space-y-2">
              <h2 className="text-xl font-bold font-calibri text-[#10334F]">
                2. Goals and Objectives
              </h2>
              <ul className="space-y-1.5 pl-5 list-disc font-aptos text-[12px] text-[#0F172A]">
                <li>Centralize volunteer profiles, certifications, schedules and participation history.</li>
                <li>Automate onboarding, reminders, approvals and operational notifications.</li>
                <li>Migrate approved legacy volunteer data into Dataverse.</li>
                <li>Provide role-based training and a supportable operating model.</li>
              </ul>
            </div>

            {/* Section 3: Scope and Delivery Approach */}
            <div className="space-y-2">
              <h2 className="text-xl font-bold font-calibri text-[#10334F]">
                3. Scope and Delivery Approach
              </h2>
              <div className="border border-[#10334F] overflow-hidden">
                <table className="w-full font-aptos text-[12px] text-left border-collapse">
                  <thead>
                    <tr className="bg-[#10334F] text-white font-calibri">
                      <th className="py-2 px-3 font-bold border-r border-[#1c486e] w-1/4">Phase / Workstream</th>
                      <th className="py-2 px-3 font-bold border-r border-[#1c486e] w-2/5">Key Activities</th>
                      <th className="py-2 px-3 font-bold w-1/3">Primary Deliverables</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#CBD5E1] bg-white">
                    <tr className="divide-x divide-[#CBD5E1]">
                      <td className="py-2.5 px-3 font-medium align-top">Engage</td>
                      <td className="py-2.5 px-3 text-[#0F172A] align-top">Kickoff, current-state workshops and prioritized requirements.</td>
                      <td className="py-2.5 px-3 text-[#0F172A] align-top">Requirements and process flows; draft plan; RAID log.</td>
                    </tr>
                    <tr className="divide-x divide-[#CBD5E1]">
                      <td className="py-2.5 px-3 font-medium align-top">Envision</td>
                      <td className="py-2.5 px-3 text-[#0F172A] align-top">Data model, solution design, integration and test planning.</td>
                      <td className="py-2.5 px-3 text-[#0F172A] align-top">Solution design; wireframes; data map; test plan.</td>
                    </tr>
                    <tr className="divide-x divide-[#CBD5E1]">
                      <td className="py-2.5 px-3 font-medium align-top">Enact</td>
                      <td className="py-2.5 px-3 text-[#0F172A] align-top">Configure Power Apps, Dataverse and Power Automate; migrate test data; support UAT.</td>
                      <td className="py-2.5 px-3 text-[#0F172A] align-top">Configured solution; validated migration; UAT completion.</td>
                    </tr>
                    <tr className="divide-x divide-[#CBD5E1]">
                      <td className="py-2.5 px-3 font-medium align-top">Empower</td>
                      <td className="py-2.5 px-3 text-[#0F172A] align-top">Admin training, train-the-trainer, launch and stabilization.</td>
                      <td className="py-2.5 px-3 text-[#0F172A] align-top">Training materials; launch checklist; closeout report.</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Section 4: Governance and Responsibilities */}
            <div className="space-y-2">
              <h2 className="text-xl font-bold font-calibri text-[#10334F]">
                4. Governance and Responsibilities
              </h2>
              <div className="border border-[#10334F] overflow-hidden">
                <table className="w-full font-aptos text-[12px] text-left border-collapse">
                  <thead>
                    <tr className="bg-[#10334F] text-white font-calibri">
                      <th className="py-2 px-3 font-bold border-r border-[#1c486e] w-1/3">Role</th>
                      <th className="py-2 px-3 font-bold w-2/3">Responsibility</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#CBD5E1] bg-white">
                    <tr className="divide-x divide-[#CBD5E1]">
                      <td className="py-2.5 px-3 font-medium align-top">DTMC Engagement Lead</td>
                      <td className="py-2.5 px-3 text-[#0F172A] align-top">Overall delivery quality, scope governance and executive escalation.</td>
                    </tr>
                    <tr className="divide-x divide-[#CBD5E1]">
                      <td className="py-2.5 px-3 font-medium align-top">DTMC Project Manager</td>
                      <td className="py-2.5 px-3 text-[#0F172A] align-top">Plan, RAID log, status reporting, decisions and deliverable tracking.</td>
                    </tr>
                    <tr className="divide-x divide-[#CBD5E1]">
                      <td className="py-2.5 px-3 font-medium align-top">Client Product Owner</td>
                      <td className="py-2.5 px-3 text-[#0F172A] align-top">Priorities, stakeholder access, timely decisions and acceptance.</td>
                    </tr>
                    <tr className="divide-x divide-[#CBD5E1]">
                      <td className="py-2.5 px-3 font-medium align-top">Client Technical Lead</td>
                      <td className="py-2.5 px-3 text-[#0F172A] align-top">Environment access, technical validation, data readiness and deployment coordination.</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Section 5: Schedule and Acceptance */}
            <div className="space-y-2">
              <h2 className="text-xl font-bold font-calibri text-[#10334F]">
                5. Schedule and Acceptance
              </h2>
              <p className="font-aptos text-[12px] text-[#0F172A] leading-relaxed">
                The detailed schedule will be baselined at kickoff. Deliverables are accepted when the client provides written approval or no material exception within five business days. Dates in this sample are intentionally illustrative.
              </p>
            </div>

          </div>

          {/* Bottom Page Disclaimer */}
          <div className="text-[11px] text-[#64748B] text-center pt-8 border-t border-[#E2E8F0] font-aptos">
            Fictional example for template evaluation only • All names, contacts, fees and dates are dummy data
          </div>

        </div>

        {/* ============================================================ */}
        {/* PAGE 3: SECTIONS (Assumptions, Out of Scope, Fees, Authorization) */}
        {/* ============================================================ */}
        <div className="bg-white max-w-4xl w-full min-h-[1050px] shadow-2xl border border-[#CBD5E1] p-10 md:p-16 flex flex-col justify-between relative text-[#0F172A] space-y-6">

          {/* Body Sections for Page 3 */}
          <div className="space-y-6 flex-1">
            
            {/* Section 6: Assumptions */}
            <div className="space-y-2">
              <h2 className="text-xl font-bold font-calibri text-[#10334F]">
                6. Assumptions
              </h2>
              <ul className="space-y-1.5 pl-5 list-disc font-aptos text-[12px] text-[#0F172A]">
                <li>Client owns source-data cleansing and approval.</li>
                <li>Client procures required Microsoft licenses.</li>
                <li>One legacy system and one public-site integration are included.</li>
              </ul>
            </div>

            {/* Section 7: Out of Scope */}
            <div className="space-y-2">
              <h2 className="text-xl font-bold font-calibri text-[#10334F]">
                7. Out of Scope
              </h2>
              <ul className="space-y-1.5 pl-5 list-disc font-aptos text-[12px] text-[#0F172A]">
                <li>Unlisted third-party integrations.</li>
                <li>Historical data remediation outside agreed templates.</li>
                <li>Support beyond the defined stabilization period.</li>
              </ul>
            </div>

            {/* Section 8: Illustrative Fees */}
            <div className="space-y-2">
              <h2 className="text-xl font-bold font-calibri text-[#10334F]">
                8. Illustrative Fees
              </h2>
              <div className="border border-[#10334F] overflow-hidden">
                <table className="w-full font-aptos text-[12px] text-left border-collapse">
                  <thead>
                    <tr className="bg-[#10334F] text-white font-calibri">
                      <th className="py-2 px-3 font-bold border-r border-[#1c486e] w-1/3">Commercial Model</th>
                      <th className="py-2 px-3 font-bold border-r border-[#1c486e] w-1/3">Illustrative Amount</th>
                      <th className="py-2 px-3 font-bold w-1/3">Billing</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#CBD5E1] bg-white">
                    <tr className="divide-x divide-[#CBD5E1]">
                      <td className="py-2.5 px-3 font-medium align-top">Time and materials</td>
                      <td className="py-2.5 px-3 text-[#0F172A] align-top font-semibold">  </td>
                      <td className="py-2.5 px-3 text-[#0F172A] align-top">Initial deposit plus monthly actuals</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="text-[11px] text-[#475569] italic pt-1 font-aptos">
                All amounts are fictional placeholders for sample evaluation and must be replaced during contracting.
              </p>
            </div>

            {/* Section 9: Authorization */}
            <div className="space-y-2 pt-2">
              <h2 className="text-xl font-bold font-calibri text-[#10334F]">
                9. Authorization
              </h2>
              <div className="border border-[#10334F] overflow-hidden">
                <table className="w-full font-aptos text-[12px] text-left border-collapse">
                  <thead>
                    <tr className="bg-[#10334F] text-white font-calibri">
                      <th className="py-2.5 px-4 font-bold border-r border-[#1c486e] w-1/2">Accepted by Client</th>
                      <th className="py-2.5 px-4 font-bold w-1/2">Accepted by DTMC</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-x divide-[#10334F]">
                    <tr>
                      <td className="p-4 align-top space-y-2 text-[#0F172A]">
                        <div>Name: {showSampleData ? sampleReplacements['{{CLIENT_SIGNATORY_NAME}}'] : 'Riley Chen'}</div>
                        <div>Title: {showSampleData ? sampleReplacements['{{CLIENT_SIGNATORY_TITLE}}'] : 'VP, Transformation'}</div>
                        <div className="pt-2">Signature: __________________________</div>
                        <div>Date: __________________________</div>
                      </td>
                      <td className="p-4 align-top space-y-2 text-[#0F172A]">
                        <div>Name: {showSampleData ? sampleReplacements['{{DTMC_SIGNATORY_NAME}}'] : 'Jordan Lee'}</div>
                        <div>Title: {showSampleData ? sampleReplacements['{{DTMC_SIGNATORY_TITLE}}'] : 'Engagement Partner'}</div>
                        <div className="pt-2">Signature: __________________________</div>
                        <div>Date: __________________________</div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Appendix Sections if present in template */}
            {template.sections.filter(s => s.isAppendix || s.order > 9 || s.title.toLowerCase().startsWith('appendix')).length > 0 && (
              <div className="space-y-6 pt-6 border-t border-[#CBD5E1]">
                {template.sections
                  .filter(s => s.isAppendix || s.order > 9 || s.title.toLowerCase().startsWith('appendix'))
                  .map((sec) => (
                    <div key={sec.id} className="space-y-2">
                      <h2 className="text-xl font-bold font-calibri text-[#10334F]">
                        {sec.title}
                      </h2>
                      <div className="space-y-2 text-xs font-aptos text-[#0F172A]">
                        {renderContentBlocks(sec.content)}
                      </div>
                    </div>
                  ))}
              </div>
            )}

          </div>

          {/* Bottom Page Disclaimer */}
          <div className="text-[11px] text-[#64748B] text-center pt-8 border-t border-[#E2E8F0] font-aptos">
            Fictional example for template evaluation only • All names, contacts, fees and dates are dummy data
          </div>

        </div>

      </div>

      {/* Validation Modal */}
      {showValidationModal && validationResult && (
        <TemplateValidationModal
          isOpen={showValidationModal}
          onClose={() => setShowValidationModal(false)}
          result={validationResult}
          templateName={template.metadata.name}
        />
      )}

    </div>
  );
};

