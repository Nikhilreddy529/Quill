export interface N8nProjectRequest {
  clientName: string;
  engagementName: string;
  meetingTranscript?: string;
  uploadedDocuments?: Array<{
    name: string;
    content?: string;
  }>;
  selectedTemplate?: string;
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
    throw new Error(
      'VITE_N8N_WEBHOOK_URL is not configured.'
    );
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

  const data = await response.json();

return data.output || data;
}