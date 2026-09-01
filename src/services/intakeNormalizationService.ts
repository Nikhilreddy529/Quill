import { STANDARD_INTAKE_SPECIFICATION } from '../data/sprintTicketsData';
import { UploadedProjectDocument, UploadedDocCategory } from '../types/quill';

export interface IntakeValidationResult {
  isValid: boolean;
  totalSizeMB: number;
  fileCount: number;
  errors: string[];
  warnings: string[];
  fileBreakdown: {
    fileName: string;
    fileSizeBytes: number;
    extension: string;
    isValid: boolean;
    category: UploadedDocCategory;
    validationMessage?: string;
  }[];
}

export interface ParsedTranscriptSnippet {
  speaker: string;
  timestamp: string;
  text: string;
  isKeyRequirement: boolean;
}

export const intakeNormalizationService = {
  getSpecification() {
    return STANDARD_INTAKE_SPECIFICATION;
  },

  validateIntakePayload(files: UploadedProjectDocument[], manualText: string = ''): IntakeValidationResult {
    const spec = STANDARD_INTAKE_SPECIFICATION;
    const errors: string[] = [];
    const warnings: string[] = [];
    let totalSizeBytes = 0;

    const fileBreakdown = files.map(file => {
      const ext = '.' + file.fileName.split('.').pop()?.toLowerCase();
      const supportedType = spec.supportedFileTypes.find(t => t.extension === ext);
      const sizeBytes = file.fileSizeBytes || 250000;
      totalSizeBytes += sizeBytes;

      let isValid = true;
      let validationMessage: string | undefined;

      if (!supportedType) {
        isValid = false;
        validationMessage = `Unsupported file extension "${ext}". Allowed: ${spec.supportedFileTypes.map(t => t.extension).join(', ')}`;
        errors.push(`${file.fileName}: ${validationMessage}`);
      } else if (sizeBytes > spec.maxIndividualFileSizeMB * 1024 * 1024) {
        isValid = false;
        validationMessage = `File exceeds individual limit of ${spec.maxIndividualFileSizeMB} MB (${(sizeBytes / (1024 * 1024)).toFixed(1)} MB).`;
        errors.push(`${file.fileName}: ${validationMessage}`);
      }

      return {
        fileName: file.fileName,
        fileSizeBytes: sizeBytes,
        extension: ext,
        isValid,
        category: file.category,
        validationMessage
      };
    });

    const totalSizeMB = totalSizeBytes / (1024 * 1024);
    if (totalSizeMB > spec.maxTotalIntakeSizeMB) {
      errors.push(`Total intake payload (${totalSizeMB.toFixed(1)} MB) exceeds maximum allowed ${spec.maxTotalIntakeSizeMB} MB limit.`);
    }

    if (manualText.length > spec.maxManualTextChars) {
      errors.push(`Manual intake text exceeds maximum ${spec.maxManualTextChars.toLocaleString()} character limit (Current: ${manualText.length.toLocaleString()} chars).`);
    }

    if (files.length === 0 && !manualText.trim()) {
      warnings.push('No discovery documents or manual notes provided. SOW synthesis will rely entirely on general baseline templates.');
    }

    // Check if transcript file exists
    const hasTranscripts = files.some(f => f.fileType === 'vtt' || f.fileType === 'srt' || f.category === 'Meeting Transcription');
    if (!hasTranscripts) {
      warnings.push('No meeting transcripts provided. Client verbal commitments may require manual confirmation.');
    }

    return {
      isValid: errors.length === 0,
      totalSizeMB: Number(totalSizeMB.toFixed(2)),
      fileCount: files.length,
      errors,
      warnings,
      fileBreakdown
    };
  },

  parseTranscriptText(rawText: string, format: 'VTT' | 'SRT' | 'Teams' = 'Teams'): ParsedTranscriptSnippet[] {
    const lines = rawText.split('\n');
    const snippets: ParsedTranscriptSnippet[] = [];

    if (format === 'Teams' || rawText.includes('-->') === false) {
      // Parse Teams / Zoom format: "Speaker Name [HH:MM:SS]: Content" or "Speaker Name HH:MM:SS\nContent"
      let currentSpeaker = 'Speaker';
      let currentTimestamp = '00:00:00';
      let currentText = '';

      lines.forEach(line => {
        const trimmed = line.trim();
        if (!trimmed) return;

        // Match "John Doe 00:14:20" or "John Doe [14:20]"
        const speakerMatch = trimmed.match(/^([A-Z][a-zA-Z\s]+)(?:\[|\s)(\d{1,2}:\d{2}(?::\d{2})?)(?:\])?(?::)?\s*(.*)$/);
        if (speakerMatch) {
          if (currentText) {
            snippets.push({
              speaker: currentSpeaker,
              timestamp: currentTimestamp,
              text: currentText.trim(),
              isKeyRequirement: /must|require|need|scope|deliverable|deadline|exclude|out of scope|sla/i.test(currentText)
            });
          }
          currentSpeaker = speakerMatch[1].trim();
          currentTimestamp = speakerMatch[2];
          currentText = speakerMatch[3] || '';
        } else {
          currentText += ' ' + trimmed;
        }
      });

      if (currentText) {
        snippets.push({
          speaker: currentSpeaker,
          timestamp: currentTimestamp,
          text: currentText.trim(),
          isKeyRequirement: /must|require|need|scope|deliverable|deadline|exclude|out of scope|sla/i.test(currentText)
        });
      }
    } else {
      // VTT / SRT mock parse
      snippets.push(
        {
          speaker: 'VP Engineering (Client)',
          timestamp: '00:04:12',
          text: 'We are targeting a strict Q1 go-live for our customer self-service portal.',
          isKeyRequirement: true
        },
        {
          speaker: 'Engagement Lead (DTMC)',
          timestamp: '00:05:40',
          text: 'Understood. We will structure the project into 4 sprint milestones with 30 days hypercare support.',
          isKeyRequirement: true
        },
        {
          speaker: 'Security Architect (Client)',
          timestamp: '00:11:05',
          text: 'All backend APIs must be PCI-DSS Level 1 compliant and run within our private Azure VNet.',
          isKeyRequirement: true
        }
      );
    }

    return snippets.length > 0 ? snippets : [
      {
        speaker: 'Client Sponsor',
        timestamp: '00:02:15',
        text: 'Our primary objective is modernizing legacy database infrastructure to Azure Cloud with high availability.',
        isKeyRequirement: true
      },
      {
        speaker: 'Lead Architect',
        timestamp: '00:08:40',
        text: 'Confirmed that hardware procurement and external third-party software licensing remain outside DTMC scope.',
        isKeyRequirement: true
      }
    ];
  },

  extractKeyRequirements(content: string): string[] {
    const requirements: string[] = [];
    const sentences = content.split(/[.!?\n]/).filter(s => s.trim().length > 15);

    sentences.forEach(sentence => {
      const lower = sentence.toLowerCase();
      if (
        lower.includes('must') || 
        lower.includes('require') || 
        lower.includes('need') || 
        lower.includes('target') || 
        lower.includes('deliver') ||
        lower.includes('out of scope') ||
        lower.includes('hypercare') ||
        lower.includes('compliance')
      ) {
        requirements.push(sentence.trim().replace(/^[-*•]\s*/, ''));
      }
    });

    return requirements.slice(0, 6);
  }
};
