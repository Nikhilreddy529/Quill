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
    order?: number;
    category?: string;
    isMandatory?: boolean;
    isPricingSection?: boolean;
  }>;

  itemsForReview?: Array<{
    item: string;
    reason: string;
  }>;

  confidenceScore?: number;
  pricingVerifiedBlank?: boolean;
  validationNotes?: string[];
}

/**
 * Contributor assignment request.
 *
 * This is intentionally separate from N8nProjectRequest because
 * contributor actions do not contain documentType.
 */
export interface AssignContributorRequest {
  action: 'ASSIGN_CONTRIBUTOR';

  projectId: string;
  projectTitle: string;

  sectionId: string;
  sectionTitle: string;

  contributor: {
    id: string;
    name: string;
    email: string;
  };

  assignedBy: {
    name: string;
    email: string;
  };
}

/**
 * Contributor section approval request.
 */
export interface ContributorSectionUpdateRequest {
  action: 'CONTRIBUTOR_SECTION_APPROVED';

  projectId: string;
  sectionId: string;
  sectionTitle: string;

  contributor: {
    id: string;
    name: string;
    email: string;
  };

  content: string;
  version: number;
  approvedAt: string;
}

/**
 * Generic n8n action request.
 *
 * Used for contributor actions such as assignment and approval.
 */
export type N8nActionRequest =
  | AssignContributorRequest
  | ContributorSectionUpdateRequest;

const N8N_WEBHOOK_URL = (import.meta as any).env.VITE_N8N_WEBHOOK_URL;

/**
 * Common n8n webhook caller.
 */
async function callN8n<T>(
  request: unknown
): Promise<T> {
  if (!N8N_WEBHOOK_URL) {
    throw new Error(
      'VITE_N8N_WEBHOOK_URL is not configured.'
    );
  }

  console.log('Sending request to n8n:', request);

  const response = await fetch(N8N_WEBHOOK_URL, {
    method: 'POST',

    headers: {
      'Content-Type': 'application/json',
    },

    body: JSON.stringify(request),
  });

  if (!response.ok) {
    let errorDetails = '';

    try {
      errorDetails = await response.text();
    } catch {
      // Ignore response parsing errors.
    }

    throw new Error(
      `n8n request failed with status ${response.status}${
        errorDetails ? `: ${errorDetails}` : ''
      }`
    );
  }

  const text = await response.text();

  if (!text.trim()) {
    throw new Error(
      'n8n returned an empty response.'
    );
  }

  let parsedData: unknown;

  try {
    parsedData = JSON.parse(text);
  } catch {
    throw new Error(
      'n8n returned invalid JSON.'
    );
  }

  /**
   * n8n AI Agent / webhook responses can sometimes
   * wrap the actual JSON inside an "output" property.
   */
  if (
    parsedData &&
    typeof parsedData === 'object' &&
    'output' in parsedData
  ) {
    const output = (
      parsedData as {
        output?: unknown;
      }
    ).output;

    if (typeof output === 'string') {
      try {
        return JSON.parse(output) as T;
      } catch {
        throw new Error(
          'n8n returned invalid JSON inside output.'
        );
      }
    }

    return output as T;
  }

  /**
   * Handle a response where the entire response
   * is itself a JSON string.
   */
  if (typeof parsedData === 'string') {
    try {
      return JSON.parse(parsedData) as T;
    } catch {
      throw new Error(
        'n8n returned invalid JSON text.'
      );
    }
  }

  return parsedData as T;
}

/**
 * Generate an SOW or Proposal through n8n.
 */
export async function sendToN8n(
  request: N8nProjectRequest
): Promise<N8nProjectResponse> {
  return callN8n<N8nProjectResponse>(request);
}

/**
 * Assign a contributor to a specific SOW section.
 */
export async function assignContributor(
  request: AssignContributorRequest
): Promise<any> {
  return callN8n<any>(request);
}

/**
 * Submit contributor approval for a section.
 */
export async function submitContributorApproval(
  request: ContributorSectionUpdateRequest
): Promise<any> {
  return callN8n<any>(request);
}