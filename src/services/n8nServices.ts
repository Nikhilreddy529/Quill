export interface N8nProjectRequest {
  clientName: string;
  engagementName: string;
  documentType: 'SOW' | 'Proposal';

  meetingTranscript?: string;

  uploadedDocuments?: Array<{
    name: string;
    content?: string;
  }>;

  selectedTemplate?: string;
  templateFileName?: string;

  templateSections?: Array<{
    title: string;
    category?: string;
    content: string;
    order?: number;
    isMandatory?: boolean;
  }>;

  sectionTitle?: string;
  category?: string;
  customInstructions?: string;
}

export interface N8nProjectResponse {
  success?: boolean;

  project?: {
    projectId?: string;
    clientName?: string;
    engagementName?: string;
    status?: string;
  };

  sections?: Array<{
    sectionName: string;
    content: string;
  }>;

  itemsForReview?: Array<{
    item: string;
    reason: string;
  }>;

  confidenceScore?: number;
  pricingVerifiedBlank?: boolean;
  validationNotes?: string[];
}

const N8N_WEBHOOK_URL = (import.meta as any).env.VITE_N8N_WEBHOOK_URL;

export async function sendToN8n(
  request: N8nProjectRequest
): Promise<N8nProjectResponse> {
  if (!N8N_WEBHOOK_URL) {
    throw new Error('VITE_N8N_WEBHOOK_URL is not configured.');
  }

  const response = await fetch(N8N_WEBHOOK_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    throw new Error(
      `n8n request failed with status ${response.status}`
    );
  }

  const text = await response.text();

  if (!text.trim()) {
    throw new Error('n8n returned an empty response.');
  }

  let parsedData: unknown;

  try {
    parsedData = JSON.parse(text);
  } catch {
    throw new Error('n8n returned invalid JSON.');
  }

  if (
    parsedData &&
    typeof parsedData === 'object' &&
    'output' in parsedData
  ) {
    const output = (parsedData as { output?: unknown }).output;

    if (typeof output === 'string') {
      try {
        return JSON.parse(output) as N8nProjectResponse;
      } catch {
        throw new Error('n8n returned invalid JSON inside output.');
      }
    }

    return output as N8nProjectResponse;
  }

  if (typeof parsedData === 'string') {
    try {
      return JSON.parse(parsedData) as N8nProjectResponse;
    } catch {
      throw new Error('n8n returned invalid JSON text.');
    }
  }

  return parsedData as N8nProjectResponse;
}