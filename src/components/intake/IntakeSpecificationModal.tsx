import React, { useState } from 'react';
import { 
  X, 
  FileText, 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle, 
  FileCode, 
  FileSpreadsheet, 
  Layers, 
  Sparkles,
  Info,
  Sliders,
  Terminal
} from 'lucide-react';
import { STANDARD_INTAKE_SPECIFICATION } from '../../data/sprintTicketsData';
import { intakeNormalizationService, ParsedTranscriptSnippet } from '../../services/intakeNormalizationService';

interface IntakeSpecificationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const IntakeSpecificationModal: React.FC<IntakeSpecificationModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'types' | 'transcripts' | 'rules' | 'tester'>('types');
  const [testTranscript, setTestTranscript] = useState(
`Nikhil [00:04:15]: We need full microservices transformation with SIT/UAT testing.
Arjun Rao [00:05:30]: Note that hardware procurement and third-party licenses are strictly excluded from vendor scope.
Client VP [00:12:45]: Go-live target is scheduled for April 2027 with mandatory 30-day hypercare support.`
  );
  const [parsedSnippets, setParsedSnippets] = useState<ParsedTranscriptSnippet[]>(() => 
    intakeNormalizationService.parseTranscriptText(testTranscript, 'Teams')
  );

  if (!isOpen) return null;

  const spec = STANDARD_INTAKE_SPECIFICATION;

  const handleRunParser = () => {
    const result = intakeNormalizationService.parseTranscriptText(testTranscript, 'Teams');
    setParsedSnippets(result);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-3xl w-full border border-[#E2E8F0] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#E2E8F0] flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center text-[#1D68F2]">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-sm font-bold text-[#0F172A]">Input Intake & Normalization Specification</h2>
                <span className="text-[10px] font-mono bg-blue-50 text-[#1D68F2] border border-blue-200 px-1.5 py-0.2 rounded">
                  QTK-001 & QTK-002
                </span>
              </div>
              <p className="text-[11px] text-[#64748B]">Approved DTMC Enterprise Intake Limits, Formats, and Traceability Rules</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-[#E2E8F0] px-6 bg-white text-xs font-semibold">
          <button
            onClick={() => setActiveTab('types')}
            className={`py-3 px-3 border-b-2 transition cursor-pointer ${
              activeTab === 'types'
                ? 'border-[#1D68F2] text-[#1D68F2]'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            Supported File Types (7)
          </button>
          <button
            onClick={() => setActiveTab('transcripts')}
            className={`py-3 px-3 border-b-2 transition cursor-pointer ${
              activeTab === 'transcripts'
                ? 'border-[#1D68F2] text-[#1D68F2]'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            Transcript Formats & Parser
          </button>
          <button
            onClick={() => setActiveTab('rules')}
            className={`py-3 px-3 border-b-2 transition cursor-pointer ${
              activeTab === 'rules'
                ? 'border-[#1D68F2] text-[#1D68F2]'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            Validation & Security Limits
          </button>
          <button
            onClick={() => setActiveTab('tester')}
            className={`py-3 px-3 border-b-2 transition cursor-pointer ${
              activeTab === 'tester'
                ? 'border-[#1D68F2] text-[#1D68F2]'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            Live Parser Simulator
          </button>
        </div>

        {/* Tab Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 text-xs">
          
          {activeTab === 'types' && (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3 p-3 bg-blue-50/50 rounded-lg border border-blue-100">
                <div>
                  <div className="text-[10px] uppercase font-bold text-blue-700">Max Individual File</div>
                  <div className="text-base font-bold text-[#0F172A]">{spec.maxIndividualFileSizeMB} MB per file</div>
                </div>
                <div>
                  <div className="text-[10px] uppercase font-bold text-blue-700">Max Aggregate Intake Payload</div>
                  <div className="text-base font-bold text-[#0F172A]">{spec.maxTotalIntakeSizeMB} MB total</div>
                </div>
              </div>

              <div className="space-y-2">
                {spec.supportedFileTypes.map((type, idx) => (
                  <div key={idx} className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-start justify-between">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-mono font-bold text-xs bg-slate-200 px-2 py-0.5 rounded text-slate-800">
                          {type.extension}
                        </span>
                        <span className="font-semibold text-[#0F172A]">{type.name}</span>
                        <span className="text-[10px] text-slate-400 font-mono">({(type.maxSizeBytes / (1024 * 1024)).toFixed(0)} MB max)</span>
                      </div>
                      <p className="text-[11px] text-slate-600 mt-1">{type.description}</p>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                      Validated
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'transcripts' && (
            <div className="space-y-3">
              <p className="text-slate-600">
                The intake pipeline parses timestamped utterances from Teams, Zoom, Webex, and subtitle files, automatically tagging speakers, timecodes, and extracting contractual requirement cues.
              </p>

              <div className="space-y-2">
                {spec.supportedTranscriptFormats.map((tf, idx) => (
                  <div key={idx} className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                    <div className="flex items-center justify-between">
                      <div className="font-bold text-[#0F172A]">{tf.format}</div>
                      <span className="font-mono text-[10px] bg-slate-200 text-slate-700 px-1.5 py-0.5 rounded">
                        Pattern: {tf.samplePattern}
                      </span>
                    </div>
                    <p className="text-slate-600 text-[11px] mt-1">{tf.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'rules' && (
            <div className="space-y-4">
              <div>
                <h4 className="font-bold text-[#0F172A] text-xs uppercase tracking-wider mb-2">
                  Payload Validation & Anti-Tampering Rules
                </h4>
                <ul className="space-y-1.5">
                  {spec.validationRules.map((rule, idx) => (
                    <li key={idx} className="flex items-start space-x-2 text-slate-700">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{rule}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-3 border-t border-slate-200">
                <h4 className="font-bold text-[#0F172A] text-xs uppercase tracking-wider mb-2">
                  Source Provenance & Traceability Rules
                </h4>
                <ul className="space-y-1.5">
                  {spec.sourceTraceabilityRules.map((rule, idx) => (
                    <li key={idx} className="flex items-start space-x-2 text-slate-700">
                      <ShieldCheck className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                      <span>{rule}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {activeTab === 'tester' && (
            <div className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Input Raw Meeting Transcript:
                </label>
                <textarea
                  value={testTranscript}
                  onChange={(e) => setTestTranscript(e.target.value)}
                  rows={4}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 font-mono text-[11px] text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div className="flex justify-end">
                <button
                  onClick={handleRunParser}
                  className="bg-[#1D68F2] hover:bg-[#1554c0] text-white font-bold text-xs px-3 py-1.5 rounded-lg shadow-sm cursor-pointer"
                >
                  Parse & Extract Requirements
                </button>
              </div>

              <div className="space-y-2 mt-2">
                <div className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                  Extracted Speaker Utterances ({parsedSnippets.length})
                </div>
                {parsedSnippets.map((snip, idx) => (
                  <div key={idx} className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-bold text-[#0F172A]">{snip.speaker}</span>
                      <span className="font-mono text-slate-500 text-[10px]">{snip.timestamp}</span>
                    </div>
                    <p className="text-slate-700 text-xs">{snip.text}</p>
                    {snip.isKeyRequirement && (
                      <span className="inline-block text-[9px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-1.5 py-0.2 rounded">
                        Key Requirement Tagged
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-[#E2E8F0] bg-slate-50/50 flex justify-end">
          <button
            onClick={onClose}
            className="bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold text-xs px-4 py-2 rounded-lg transition cursor-pointer"
          >
            Close Specification
          </button>
        </div>

      </div>
    </div>
  );
};
