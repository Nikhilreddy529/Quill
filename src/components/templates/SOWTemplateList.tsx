import React, { useState, useMemo } from 'react';
import { 
  Plus, 
  Search, 
  FileText, 
  Copy, 
  Eye, 
  Edit3, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Sparkles, 
  Download, 
  MoreVertical, 
  ShieldCheck, 
  Trash2, 
  ExternalLink,
  Layers,
  ArrowRight,
  FileCheck2,
  Lock,
  Tag,
  Share2
} from 'lucide-react';
import { SOWTemplate, TemplateStatus, TemplateType } from '../../types/template';
import { templateService } from '../../services/templateService';
import { TemplateValidationModal } from './TemplateValidationModal';

interface SOWTemplateListProps {
  onSelectTemplateToEdit: (template: SOWTemplate) => void;
  onSelectTemplateToPreview: (template: SOWTemplate) => void;
  onUseTemplateToCreateSOW: (template: SOWTemplate) => void;
  onCreateNewTemplate: () => void;
}

export const SOWTemplateList: React.FC<SOWTemplateListProps> = ({
  onSelectTemplateToEdit,
  onSelectTemplateToPreview,
  onUseTemplateToCreateSOW,
  onCreateNewTemplate
}) => {
  const [templates, setTemplates] = useState<SOWTemplate[]>(() => templateService.getTemplates());
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [selectedType, setSelectedType] = useState<string>('ALL');
  
  // Validation modal state
  const [validatingTemplate, setValidatingTemplate] = useState<SOWTemplate | null>(null);
  const [validationResult, setValidationResult] = useState<any>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleValidate = (template: SOWTemplate) => {
    const result = templateService.validateTemplate(template);
    setValidatingTemplate(template);
    setValidationResult(result);
  };

  const handleDuplicate = (templateId: string) => {
    const copy = templateService.duplicateTemplate(templateId);
    if (copy) {
      setTemplates(templateService.getTemplates());
      showToast(`Duplicated template "${copy.metadata.name}"`);
    }
  };

  const handleDelete = (templateId: string) => {
    const success = templateService.deleteTemplate(templateId);
    if (success) {
      setTemplates(templateService.getTemplates());
      setDeleteConfirmId(null);
      showToast('Template deleted successfully');
    }
  };

  const handleMarkReady = (template: SOWTemplate) => {
    const updated: SOWTemplate = {
      ...template,
      metadata: {
        ...template.metadata,
        status: 'Ready for Use',
        approvedForUse: true,
        modifiedDate: new Date().toISOString()
      }
    };
    templateService.saveTemplate(updated);
    setTemplates(templateService.getTemplates());
    showToast(`Template "${template.metadata.name}" marked as Ready for Use`);
  };

  const filteredTemplates = useMemo(() => {
    return templates.filter(t => {
      const matchesSearch = 
        t.metadata.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.metadata.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesStatus = selectedStatus === 'ALL' || t.metadata.status === selectedStatus;
      const matchesType = selectedType === 'ALL' || t.metadata.templateType === selectedType;

      return matchesSearch && matchesStatus && matchesType;
    });
  }, [templates, searchQuery, selectedStatus, selectedType]);

  const readyCount = templates.filter(t => t.metadata.status === 'Ready for Use').length;
  const draftCount = templates.filter(t => t.metadata.status === 'Draft').length;

  return (
    <div className="p-8 max-w-7xl mx-auto w-full space-y-6 animate-fade-in font-sans">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#0F172A] text-white px-4 py-2.5 rounded-lg shadow-xl text-xs font-semibold flex items-center space-x-2 animate-slide-up border border-[#334155]">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-[#E2E8F0] shadow-xs">
        <div>
          <div className="flex items-center space-x-2.5 mb-1">
            <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-200 text-[#1D68F2] flex items-center justify-center font-bold">
              <Layers className="w-4 h-4" />
            </div>
            <h1 className="text-xl font-bold text-[#0F172A]">SOW Templates</h1>
            <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-blue-50 text-[#1D68F2] border border-blue-200">
              Reusable Frameworks
            </span>
          </div>
          <p className="text-xs text-[#64748B] max-w-2xl leading-relaxed">
            Standard DTMC enterprise Statements of Work templates. Manage standardized document placeholders, optional workstream appendices, governance role matrices, and blank pricing structures.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={onCreateNewTemplate}
            className="flex items-center space-x-2 bg-[#1D68F2] hover:bg-[#1554c0] text-white text-xs font-bold px-4 py-2.5 rounded-lg shadow-md shadow-blue-500/20 transition active:scale-95 cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Create SOW Template</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-[#E2E8F0] shadow-xs flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider">Total Templates</div>
            <div className="text-2xl font-bold text-[#0F172A] mt-0.5">{templates.length}</div>
            <div className="text-[11px] text-[#64748B] mt-0.5">Reusable SOW structures</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-600">
            <FileText className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-[#E2E8F0] shadow-xs flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider">Ready for Use</div>
            <div className="text-2xl font-bold text-emerald-600 mt-0.5">{readyCount}</div>
            <div className="text-[11px] text-emerald-700 mt-0.5">Approved DTMC standards</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-[#E2E8F0] shadow-xs flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider">Draft / Review</div>
            <div className="text-2xl font-bold text-amber-600 mt-0.5">{draftCount}</div>
            <div className="text-[11px] text-amber-700 mt-0.5">In progress & customization</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600">
            <Clock className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-[#E2E8F0]">
        
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search className="w-3.5 h-3.5 text-[#94A3B8] absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search templates, tags, descriptions..."
            className="w-full bg-[#F8FAFC] border border-[#CBD5E1] rounded-lg pl-8 pr-3 py-1.5 text-xs text-[#0F172A] placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#1D68F2]"
          />
        </div>

        {/* Status Filters */}
        <div className="flex items-center space-x-1.5 overflow-x-auto w-full sm:w-auto">
          {['ALL', 'Ready for Use', 'Draft', 'Under Review'].map(status => (
            <button
              key={status}
              onClick={() => setSelectedStatus(status)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition cursor-pointer shrink-0 ${
                selectedStatus === status
                  ? 'bg-[#0F172A] text-white'
                  : 'bg-[#F1F5F9] text-[#64748B] hover:text-[#0F172A] hover:bg-[#E2E8F0]'
              }`}
            >
              {status === 'ALL' ? 'All Status' : status}
            </button>
          ))}
        </div>
      </div>

      {/* Templates Grid / Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {filteredTemplates.length === 0 ? (
          <div className="col-span-2 bg-white rounded-xl border border-[#E2E8F0] p-12 text-center space-y-3">
            <FileText className="w-8 h-8 text-[#94A3B8] mx-auto" />
            <div className="text-sm font-bold text-[#0F172A]">No Templates Found</div>
            <p className="text-xs text-[#64748B]">No SOW templates matched your current filter criteria.</p>
            <button
              onClick={() => { setSearchQuery(''); setSelectedStatus('ALL'); setSelectedType('ALL'); }}
              className="text-xs text-[#1D68F2] font-semibold hover:underline cursor-pointer"
            >
              Reset filters
            </button>
          </div>
        ) : (
          filteredTemplates.map(template => {
            const isReady = template.metadata.status === 'Ready for Use';
            const isDraft = template.metadata.status === 'Draft';
            const mandatoryCount = template.sections.filter(s => s.isMandatory).length;
            const optionalCount = template.sections.filter(s => s.isOptional || s.isAppendix).length;

            return (
              <div 
                key={template.id}
                className="bg-white rounded-xl border border-[#E2E8F0] hover:border-[#BFDBFE] transition-all shadow-xs hover:shadow-md flex flex-col justify-between overflow-hidden group"
              >
                {/* Card Top */}
                <div className="p-5 space-y-3.5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                          isReady 
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                            : isDraft 
                            ? 'bg-amber-50 text-amber-700 border-amber-200' 
                            : 'bg-blue-50 text-blue-700 border-blue-200'
                        }`}>
                          {template.metadata.status}
                        </span>

                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                          v{template.metadata.version}
                        </span>

                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-[#1D68F2] border border-blue-200">
                          {template.metadata.templateType}
                        </span>
                      </div>

                      <h3 className="text-sm font-bold text-[#0F172A] group-hover:text-[#1D68F2] transition">
                        {template.metadata.name}
                      </h3>
                    </div>

                    <div className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-500 shrink-0">
                      <FileCheck2 className="w-4 h-4" />
                    </div>
                  </div>

                  <p className="text-xs text-[#475569] line-clamp-2 leading-relaxed">
                    {template.metadata.description}
                  </p>

                  {/* Section Breakdown Pills */}
                  <div className="flex items-center space-x-3 text-[11px] text-[#64748B] pt-1">
                    <span className="font-semibold text-[#334155]">
                      {template.sections.length} Sections
                    </span>
                    <span>•</span>
                    <span>{mandatoryCount} Mandatory</span>
                    <span>•</span>
                    <span>{optionalCount} Optional / Appendices</span>
                  </div>

                  {/* Word Template File Attached */}
                  <div className="p-2.5 bg-[#F8FAFC] rounded-lg border border-[#E2E8F0] flex items-center justify-between text-xs">
                    <div className="flex items-center space-x-2 truncate">
                      <FileText className="w-3.5 h-3.5 text-[#1D68F2] shrink-0" />
                      <span className="font-mono text-[11px] text-[#334155] truncate">
                        {template.metadata.wordTemplateFile}
                      </span>
                    </div>
                    <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.2 rounded border border-amber-200 shrink-0">
                      Blank Pricing Enforced
                    </span>
                  </div>
                </div>

                {/* Card Actions Footer */}
                <div className="p-3.5 bg-[#F8FAFC] border-t border-[#E2E8F0] flex items-center justify-between gap-2">
                  <div className="flex items-center space-x-1.5">
                    {/* Preview Button */}
                    <button
                      onClick={() => onSelectTemplateToPreview(template)}
                      className="p-1.5 text-[#475569] hover:text-[#0F172A] hover:bg-white rounded-lg transition cursor-pointer text-xs font-semibold flex items-center space-x-1 border border-transparent hover:border-[#CBD5E1]"
                      title="Preview Template"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Preview</span>
                    </button>

                    {/* Edit Button */}
                    <button
                      onClick={() => onSelectTemplateToEdit(template)}
                      className="p-1.5 text-[#475569] hover:text-[#0F172A] hover:bg-white rounded-lg transition cursor-pointer text-xs font-semibold flex items-center space-x-1 border border-transparent hover:border-[#CBD5E1]"
                      title="Edit Template"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Edit</span>
                    </button>

                    {/* Validate Button */}
                    <button
                      onClick={() => handleValidate(template)}
                      className="p-1.5 text-[#475569] hover:text-[#1D68F2] hover:bg-white rounded-lg transition cursor-pointer text-xs font-semibold flex items-center space-x-1 border border-transparent hover:border-[#CBD5E1]"
                      title="Run Validation Rules"
                    >
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Validate</span>
                    </button>

                    {/* Duplicate Button */}
                    <button
                      onClick={() => handleDuplicate(template.id)}
                      className="p-1.5 text-[#475569] hover:text-[#0F172A] hover:bg-white rounded-lg transition cursor-pointer text-xs font-semibold flex items-center space-x-1 border border-transparent hover:border-[#CBD5E1]"
                      title="Duplicate Template"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>

                    {/* Delete button (if not standard master) */}
                    {template.id !== 'TMPL-DTMC-MASTER-2026' && (
                      <button
                        onClick={() => handleDelete(template.id)}
                        className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition cursor-pointer text-xs font-semibold"
                        title="Delete Template"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  {/* Primary Action: Use Template to Create SOW */}
                  <button
                    onClick={() => onUseTemplateToCreateSOW(template)}
                    className="flex items-center space-x-1.5 bg-[#1D68F2] hover:bg-[#1554c0] text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-xs transition active:scale-95 cursor-pointer"
                  >
                    <span>Use Template</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

              </div>
            );
          })
        )}
      </div>

      {/* Validation Modal */}
      {validatingTemplate && validationResult && (
        <TemplateValidationModal
          isOpen={!!validatingTemplate}
          onClose={() => { setValidatingTemplate(null); setValidationResult(null); }}
          result={validationResult}
          templateName={validatingTemplate.metadata.name}
          onMarkReadyForUse={() => handleMarkReady(validatingTemplate)}
        />
      )}

    </div>
  );
};
