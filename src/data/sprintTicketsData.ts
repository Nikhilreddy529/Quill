import { SprintTicket, IntakeSpecification } from '../types/jira';

export const SPRINT_TICKETS: SprintTicket[] = [
  // Sprint 1
  {
    id: 'QTK-001',
    epicId: 'QEP-01',
    epicName: 'Input Intake and Normalization',
    track: 'Product / UX',
    summary: 'Define supported file types, size limits, transcript formats and manual-text constraints.',
    acceptanceCriteria: 'An approved intake specification covers validation, limits, error messages and source traceability.',
    priority: 'Must Have',
    status: 'Done',
    assignee: 'Siddesh Moghavera',
    sprint: 'Sprint 1',
    dependencies: ['None'],
    interactiveDemoId: 'intake-spec',
    testCasesCount: 8,
    verificationDetails: 'Intake specification formalizes 7 extensions (.docx, .pdf, .txt, .vtt, .srt, .srs, .xlsx), 50MB per file / 200MB max payload, VTT/SRT transcript parser, and markdown limits.'
  },
  {
    id: 'QTK-002',
    epicId: 'QEP-01',
    epicName: 'Input Intake and Normalization',
    track: 'Frontend',
    summary: 'Build the React workspace intake screen for uploads, SharePoint selection and manual text.',
    acceptanceCriteria: 'A PM can add, remove and review multiple mixed inputs before processing.',
    priority: 'Must Have',
    status: 'Done',
    assignee: 'Frontend Team',
    sprint: 'Sprint 1',
    dependencies: ['QTK-001'],
    interactiveDemoId: 'workspace-intake',
    testCasesCount: 6,
    verificationDetails: 'Multi-source intake screen supporting local dropzone, SharePoint library picker, and manual structured notes with key requirements auto-extraction.'
  },
  {
    id: 'QTK-010',
    epicId: 'QEP-02',
    epicName: 'Approved Reference Knowledge Base',
    track: 'QA / Evaluation',
    summary: 'Create retrieval tests for no result, unauthorized result, stale content, conflicts and prompt injection.',
    acceptanceCriteria: 'A benchmark report records precision, coverage and safe handling against agreed thresholds.',
    priority: 'Must Have',
    status: 'Done',
    assignee: 'QA / AI Eval Lead',
    sprint: 'Sprint 1',
    dependencies: ['QTK-009', 'QTK-048'],
    interactiveDemoId: 'retrieval-benchmark',
    testCasesCount: 12,
    verificationDetails: 'Automated retrieval benchmark engine reporting 96.4% Precision, 94.8% Coverage, 100% Injection Sanitization Rate, and 0 security leakage.'
  },
  {
    id: 'QTK-016',
    epicId: 'QEP-04',
    epicName: 'Framework Generation and Approval',
    track: 'AI / Prompting',
    summary: 'Define the framework output schema, controlled prompt and allowed section catalogue.',
    acceptanceCriteria: 'The model returns valid structured sections with names, order, rationale and evidence links.',
    priority: 'Must Have',
    status: 'Done',
    assignee: 'AI Prompt Engineer',
    sprint: 'Sprint 1',
    dependencies: ['QTK-009', 'QTK-055'],
    interactiveDemoId: 'framework-catalogue',
    testCasesCount: 7,
    verificationDetails: 'Strict JSON schema enforcement with section categorization, mandatory clause tags, rationale mapping, and evidence correlation.'
  },
  {
    id: 'QTK-017',
    epicId: 'QEP-04',
    epicName: 'Framework Generation and Approval',
    track: 'Workflow',
    summary: 'Build the retrieval-to-framework n8n workflow with validation, retries and correlation IDs.',
    acceptanceCriteria: 'A valid framework is created once per request; failures are recoverable and traceable.',
    priority: 'Must Have',
    status: 'Done',
    assignee: 'Workflow Architect',
    sprint: 'Sprint 1',
    dependencies: ['QTK-016', 'QTK-054'],
    interactiveDemoId: 'n8n-framework-engine',
    testCasesCount: 5,
    verificationDetails: 'Workflow executor with req_fw_ correlation tracking, exponential retry logic, error handling nodes, and SharePoint list persistence.'
  },
  {
    id: 'QTK-018',
    epicId: 'QEP-04',
    epicName: 'Framework Generation and Approval',
    track: 'Frontend',
    summary: 'Build the framework editor to add, remove, rename, reorder and inspect section evidence.',
    acceptanceCriteria: 'All framework edits persist and are visible before approval.',
    priority: 'Must Have',
    status: 'Done',
    assignee: 'Frontend Team',
    sprint: 'Sprint 1',
    dependencies: ['QTK-017'],
    interactiveDemoId: 'framework-editor',
    testCasesCount: 8,
    verificationDetails: 'Full-featured framework workspace with drag/reorder controls, category selectors, inline title renaming, custom section adder, and evidence inspectors.'
  },
  {
    id: 'QTK-019',
    epicId: 'QEP-04',
    epicName: 'Framework Generation and Approval',
    track: 'State / Governance',
    summary: 'Implement framework approval state, actor, timestamp and generation gate.',
    acceptanceCriteria: 'Section generation is blocked until the current framework version is approved.',
    priority: 'Must Have',
    status: 'Done',
    assignee: 'Governance Lead',
    sprint: 'Sprint 1',
    dependencies: ['QTK-012', 'QTK-018'],
    interactiveDemoId: 'framework-gate',
    testCasesCount: 5,
    verificationDetails: 'Strict governance gate: section drafting and regeneration are hard-blocked with warning banners until PM sign-off with recorded timestamp.'
  },
  {
    id: 'QTK-020',
    epicId: 'QEP-04',
    epicName: 'Framework Generation and Approval',
    track: 'QA',
    summary: 'Test framework changes after generation and identify sections requiring regeneration or reapproval.',
    acceptanceCriteria: 'Affected sections are flagged deterministically and unaffected approved content remains unchanged.',
    priority: 'Must Have',
    status: 'Done',
    assignee: 'QA Engineer',
    sprint: 'Sprint 1',
    dependencies: ['QTK-019', 'QTK-041'],
    interactiveDemoId: 'framework-impact-analysis',
    testCasesCount: 6,
    verificationDetails: 'Deterministic impact analysis engine flags modified sections for regeneration while preserving intact approved sections.'
  },

  // Sprint 2
  {
    id: 'QTK-021',
    epicId: 'QEP-05',
    epicName: 'Section-by-Section Drafting',
    track: 'AI / Retrieval',
    summary: 'Build the per-section context package with approved evidence, document context and token budget.',
    acceptanceCriteria: 'Only relevant approved passages and required prior context are sent to the model.',
    priority: 'Must Have',
    status: 'Done',
    assignee: 'AI Architect',
    sprint: 'Sprint 2',
    dependencies: ['QTK-009', 'QTK-019', 'QTK-056'],
    interactiveDemoId: 'context-package-builder',
    testCasesCount: 7,
    verificationDetails: 'Per-section context packager with token budget breakdown (system prompt, intake passages, prior section summaries, output headroom).'
  },
  {
    id: 'QTK-022',
    epicId: 'QEP-05',
    epicName: 'Section-by-Section Drafting',
    track: 'Workflow',
    summary: 'Implement section generation and regeneration endpoints and n8n workflows.',
    acceptanceCriteria: 'A requested section is generated independently with request, model and prompt version recorded.',
    priority: 'Must Have',
    status: 'Done',
    assignee: 'Workflow Architect',
    sprint: 'Sprint 2',
    dependencies: ['QTK-021', 'QTK-055'],
    interactiveDemoId: 'section-workflow-generator',
    testCasesCount: 5,
    verificationDetails: 'Independent section endpoint with request ID, prompt template version (v2.4-dtmc-sow), Azure OpenAI model tags, and correlation timestamps.'
  },
  {
    id: 'QTK-023',
    epicId: 'QEP-05',
    epicName: 'Section-by-Section Drafting',
    track: 'AI / Validation',
    summary: 'Attach source citations and detect unsupported scope, dates, fees and claims.',
    acceptanceCriteria: 'Unsupported statements are flagged with evidence status and cannot be silently approved.',
    priority: 'Must Have',
    status: 'Done',
    assignee: 'AI Safety Engineer',
    sprint: 'Sprint 2',
    dependencies: ['QTK-022', 'QTK-034'],
    interactiveDemoId: 'unsupported-claims-detector',
    testCasesCount: 9,
    verificationDetails: 'Grounded citation engine detecting ungrounded dollar figures, conflicting timeline dates, out-of-scope hardware commitments, and missing references.'
  },
  {
    id: 'QTK-024',
    epicId: 'QEP-05',
    epicName: 'Section-by-Section Drafting',
    track: 'State / Data',
    summary: 'Preserve approved sections and document context when another section is generated.',
    acceptanceCriteria: 'Generation changes only the requested draft and never overwrites approved content.',
    priority: 'Must Have',
    status: 'Done',
    assignee: 'State / DB Engineer',
    sprint: 'Sprint 2',
    dependencies: ['QTK-012', 'QTK-022'],
    interactiveDemoId: 'selective-generation-preserver',
    testCasesCount: 5,
    verificationDetails: 'Selective state isolation: generating or regenerating any single section mutates only that section while locked and approved sections remain untouched.'
  },
  {
    id: 'QTK-025',
    epicId: 'QEP-05',
    epicName: 'Section-by-Section Drafting',
    track: 'Reliability / QA',
    summary: 'Test retries, timeout, rate limiting, idempotency, model failure and context-window limits.',
    acceptanceCriteria: 'Repeated or failed requests preserve work, avoid duplicates and show an actionable status.',
    priority: 'Must Have',
    status: 'Done',
    assignee: 'Reliability QA',
    sprint: 'Sprint 2',
    dependencies: ['QTK-022', 'QTK-054'],
    interactiveDemoId: 'reliability-qa-suite',
    testCasesCount: 8,
    verificationDetails: 'Chaos & reliability test harness verifying 429 rate limit backoff, 30s timeout retry, idempotency tokens, and token context recovery.'
  },
  {
    id: 'QTK-026',
    epicId: 'QEP-06',
    epicName: 'PM Review, Edit, Regenerate, and Approval',
    track: 'Frontend',
    summary: 'Build the section editor with evidence view, diff, edit, regenerate, reject and approve actions.',
    acceptanceCriteria: 'A PM can review content and evidence and see what changed between versions.',
    priority: 'Must Have',
    status: 'Done',
    assignee: 'Frontend Team',
    sprint: 'Sprint 2',
    dependencies: ['QTK-022', 'QTK-023'],
    interactiveDemoId: 'section-diff-editor',
    testCasesCount: 10,
    verificationDetails: 'Integrated section editor with visual side-by-side / inline diff viewer, evidence inspector, inline comments, rejection feedback, and approval triggers.'
  },
  {
    id: 'QTK-027',
    epicId: 'QEP-06',
    epicName: 'PM Review, Edit, Regenerate, and Approval',
    track: 'State / Architecture',
    summary: 'Implement the section state machine for draft, review, approved, rejected and superseded.',
    acceptanceCriteria: 'Only valid transitions are accepted and every transition records actor and version.',
    priority: 'Must Have',
    status: 'Done',
    assignee: 'State Architect',
    sprint: 'Sprint 2',
    dependencies: ['QTK-012', 'QTK-026'],
    interactiveDemoId: 'state-machine-engine',
    testCasesCount: 8,
    verificationDetails: 'Deterministic 5-state machine (Draft -> Review -> Approved / Rejected -> Superseded) with validation rules, transition logging, and versioning.'
  },
  {
    id: 'QTK-028',
    epicId: 'QEP-06',
    epicName: 'PM Review, Edit, Regenerate, and Approval',
    track: 'Audit',
    summary: 'Persist review comments, approval rationale, user edits and timestamps.',
    acceptanceCriteria: 'The complete review history can be retrieved for each section version.',
    priority: 'Must Have',
    status: 'Done',
    assignee: 'Audit / Security Lead',
    sprint: 'Sprint 2',
    dependencies: ['QTK-027', 'QTK-041'],
    interactiveDemoId: 'version-audit-history',
    testCasesCount: 6,
    verificationDetails: 'Immutable version snapshot registry with timestamp, actor email, approval rationale, diff summaries, and chronological audit log trail.'
  },
  {
    id: 'QTK-029',
    epicId: 'QEP-06',
    epicName: 'PM Review, Edit, Regenerate, and Approval',
    track: 'Governance',
    summary: 'Invalidate approval and create a new version when approved content is edited.',
    acceptanceCriteria: 'Edited approved content cannot be exported until the new version is reapproved.',
    priority: 'Must Have',
    status: 'Done',
    assignee: 'Governance Lead',
    sprint: 'Sprint 2',
    dependencies: ['QTK-027'],
    interactiveDemoId: 'approval-invalidation-gate',
    testCasesCount: 6,
    verificationDetails: 'Approval invalidation hook automatically resets section status to "Review", increments version number, marks previous as "Superseded", and blocks Word export.'
  },
  {
    id: 'QTK-030',
    epicId: 'QEP-06',
    epicName: 'PM Review, Edit, Regenerate, and Approval',
    track: 'Concurrency / QA',
    summary: 'Implement optimistic concurrency or locking and test simultaneous section edits.',
    acceptanceCriteria: 'A stale save is rejected with a conflict message and no user changes are silently lost.',
    priority: 'Must Have',
    status: 'Done',
    assignee: 'Backend / QA Lead',
    sprint: 'Sprint 2',
    dependencies: ['QTK-027'],
    interactiveDemoId: 'concurrency-lock-simulator',
    testCasesCount: 7,
    verificationDetails: 'Optimistic concurrency locking engine with etag check, lease timers, and 3-way conflict resolver (Keep Mine / Accept Server / Review Diff).'
  }
];

export const STANDARD_INTAKE_SPECIFICATION: IntakeSpecification = {
  supportedFileTypes: [
    {
      extension: '.docx',
      mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      name: 'Microsoft Word Document',
      maxSizeBytes: 52428800,
      description: 'Client briefs, RFP scope documents, meeting notes, requirements specifications.'
    },
    {
      extension: '.pdf',
      mimeType: 'application/pdf',
      name: 'Adobe Portable Document Format',
      maxSizeBytes: 52428800,
      description: 'Technical architectures, infrastructure assessments, security whitepapers, vendor RFPs.'
    },
    {
      extension: '.txt',
      mimeType: 'text/plain',
      name: 'Plain Text / Markdown',
      maxSizeBytes: 10485760,
      description: 'Raw notes, email threads, scope bullets, PM scratchpad requirements.'
    },
    {
      extension: '.vtt',
      mimeType: 'text/vtt',
      name: 'WebVTT Video / Audio Transcription',
      maxSizeBytes: 20971520,
      description: 'Microsoft Teams, Zoom, or Webex recorded meeting transcriptions with speaker IDs and timecodes.'
    },
    {
      extension: '.srt',
      mimeType: 'application/x-subrip',
      name: 'SubRip Subtitle Transcript',
      maxSizeBytes: 20971520,
      description: 'Standard subtitle format with sequential numbering, timestamps, and spoken dialogue.'
    },
    {
      extension: '.srs',
      mimeType: 'application/octet-stream',
      name: 'Software Requirements Specification File',
      maxSizeBytes: 31457280,
      description: 'Structured enterprise functional requirement catalogues and traceability matrices.'
    },
    {
      extension: '.xlsx',
      mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      name: 'Microsoft Excel Spreadsheet',
      maxSizeBytes: 31457280,
      description: 'Scope matrices, system inventory, RACI tables, non-financial milestone schedules.'
    }
  ],
  maxIndividualFileSizeMB: 50,
  maxTotalIntakeSizeMB: 200,
  maxManualTextChars: 50000,
  supportedTranscriptFormats: [
    {
      format: 'Teams / Zoom Transcript',
      description: 'Speaker identification with timestamp markers (e.g., "Nikhil 00:14:20: We require microservices...")',
      samplePattern: '^[A-Z][a-zA-Z\\s]+ \\d{2}:\\d{2}:\\d{2}'
    },
    {
      format: 'VTT',
      description: 'Standard WebVTT with WEBVTT header and HH:MM:SS.mmm --> HH:MM:SS.mmm cues',
      samplePattern: '\\d{2}:\\d{2}:\\d{2}\\.\\d{3} --> \\d{2}:\\d{2}:\\d{2}\\.\\d{3}'
    },
    {
      format: 'SRT',
      description: 'SubRip subtitle format with sequence indices and HH:MM:SS,mmm timestamps',
      samplePattern: '^\\d+\\n\\d{2}:\\d{2}:\\d{2},\\d{3} --> \\d{2}:\\d{2}:\\d{2},\\d{3}'
    }
  ],
  validationRules: [
    'Enforce maximum individual file payload limit of 50 MB.',
    'Enforce aggregate project intake payload limit of 200 MB across all active resources.',
    'Reject executable, macro-enabled, or binary payloads (.exe, .bat, .dll, .xlsm, .docm).',
    'Sanitize manual text inputs against script injection (<script>, javascript:, onerror=) while preserving clean markdown formatting.',
    'Extract and normalize speaker names, timecodes, and utterance blocks from VTT and SRT streams.',
    'Validate that rate cards and pricing matrices uploaded into intake do not inject hardcoded dollar amounts into draft scope prose.'
  ],
  sourceTraceabilityRules: [
    'Every synthesized paragraph in a generated SOW must maintain at least one grounded citation reference.',
    'Citations must link back to specific uploaded file IDs, section headers, or transcript timestamps.',
    'Grounded evidence passages must be stored in the SharePoint source library for governance auditability.',
    'Modifications made during PM authoring must preserve original intake source provenance while marking text as human-edited.'
  ]
};
