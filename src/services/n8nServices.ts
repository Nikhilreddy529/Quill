export interface N8nProjectRequest {
  clientName: string;
  engagementName: string;
  documentType: 'SOW' | 'Proposal';

  meetingTranscript?: string;

  uploadedDocuments?: Array<{
    name: string;
    content?: string;
  }>;

  /**
   * ID of the selected template.
   */
  selectedTemplate?: string;

  /**
   * Actual template filename used by the n8n Google Drive flow.
   */
  templateFileName?: string;

  /**
   * Structural blueprint sent to the AI.
   *
   * IMPORTANT:
   * The template content is only a blueprint/example.
   * The AI must rewrite the content using the current project details
   * and client documents.
   */
  templateSections?: Array<{
    title: string;
    category?: string;
    content: string;
    order?: number;
    isMandatory?: boolean;
    isPricingSection?: boolean;
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
 * Remove Markdown code fences from an AI response.
 *
 * Gemini/n8n may return:
 * ```json
 * {...}
 * ```
 *
 * or simply:
 * ```
 * {...}
 * ```
 */
function stripMarkdownCodeFence(value: string): string {
  let cleaned = value.trim();

  cleaned = cleaned.replace(/^```(?:json)?\s*/i, '');
  cleaned = cleaned.replace(/\s*```$/i, '');

  return cleaned.trim();
}

/**
 * Extract the first complete JSON object or array from a string.
 *
 * This handles cases where the AI returns a small amount of text before
 * or after the JSON, for example:
 *
 * Here is the generated SOW:
 * {"sections":[...]}
 */
function extractJsonFromText(value: string): unknown {
  const cleaned = stripMarkdownCodeFence(value);

  // First try the complete string directly.
  try {
    return JSON.parse(cleaned);
  } catch {
    // Continue with extraction below.
  }

  const objectStart = cleaned.indexOf('{');
  const arrayStart = cleaned.indexOf('[');

  let start = -1;

  if (objectStart === -1) {
    start = arrayStart;
  } else if (arrayStart === -1) {
    start = objectStart;
  } else {
    start = Math.min(objectStart, arrayStart);
  }

  if (start === -1) {
    throw new Error('No JSON object or array found in n8n output.');
  }

  const opening = cleaned[start];
  const closing = opening === '{' ? '}' : ']';

  let depth = 0;
  let inString = false;
  let escaped = false;

  for (let index = start; index < cleaned.length; index += 1) {
    const character = cleaned[index];

    if (inString) {
      if (escaped) {
        escaped = false;
      } else if (character === '\\') {
        escaped = true;
      } else if (character === '"') {
        inString = false;
      }

      continue;
    }

    if (character === '"') {
      inString = true;
      continue;
    }

    if (character === opening) {
      depth += 1;
    } else if (character === closing) {
      depth -= 1;

      if (depth === 0) {
        const candidate = cleaned.slice(start, index + 1);

        try {
          return JSON.parse(candidate);
        } catch {
          // Keep looking for a usable JSON payload.
        }
      }
    }
  }

  throw new Error('Could not extract valid JSON from n8n output.');
}

/**
 * Convert the many response shapes that n8n can return into the
 * application's expected N8nProjectResponse shape.
 *
 * Supported examples:
 *
 * 1. { sections: [...] }
 * 2. { output: '{"sections":[...]}' }
 * 3. { output: { sections: [...] } }
 * 4. { output: "```json\\n{...}\\n```" }
 * 5. { data: { output: "..." } }
 * 6. [{ output: "..." }]
 * 7. A JSON string containing the response.
 */
function normalizeN8nResponse(raw: unknown): N8nProjectResponse {
  let value: unknown = raw;

  // n8n webhook responses can sometimes be returned as a one-item array.
  if (Array.isArray(value) && value.length === 1) {
    value = value[0];
  }

  // Unwrap common n8n response containers.
  if (value && typeof value === 'object') {
    const objectValue = value as Record<string, unknown>;

    if ('data' in objectValue && objectValue.data !== undefined) {
      value = objectValue.data;
    }
  }

  if (value && typeof value === 'object') {
    const objectValue = value as Record<string, unknown>;

    if ('output' in objectValue && objectValue.output !== undefined) {
      value = objectValue.output;
    }
  }

  // The AI output can itself be a JSON string or Markdown-wrapped JSON.
  if (typeof value === 'string') {
    value = extractJsonFromText(value);
  }

  // Occasionally output/data can be nested more than once.
  if (value && typeof value === 'object') {
    const objectValue = value as Record<string, unknown>;

    if ('output' in objectValue && objectValue.output !== undefined) {
      value = objectValue.output;

      if (typeof value === 'string') {
        value = extractJsonFromText(value);
      }
    }
  }

  // Another possible shape is a JSON string after an additional wrapper.
  if (typeof value === 'string') {
    value = extractJsonFromText(value);
  }

  if (!value || typeof value !== 'object') {
    throw new Error(
      'n8n returned a response, but no JSON object could be found.'
    );
  }

  const result = value as Record<string, unknown>;

  // Some workflows return { result: {...} } or { response: {...} }.
  if (
    result.result &&
    typeof result.result === 'object' &&
    !Array.isArray(result.result)
  ) {
    return normalizeN8nResponse(result.result);
  }

  if (
    result.response &&
    typeof result.response === 'object' &&
    !Array.isArray(result.response)
  ) {
    return normalizeN8nResponse(result.response);
  }

  // Normalize the section array while preserving all useful fields.
  const sections = Array.isArray(result.sections)
    ? result.sections
        .filter(
          (section): section is Record<string, unknown> =>
            Boolean(section) &&
            typeof section === 'object' &&
            !Array.isArray(section)
        )
        .map((section, index) => ({
          sectionName:
            typeof section.sectionName === 'string'
              ? section.sectionName
              : typeof section.title === 'string'
                ? section.title
                : `Section ${index + 1}`,

          content:
            typeof section.content === 'string'
              ? section.content
              : typeof section.text === 'string'
                ? section.text
                : '',

          order:
            typeof section.order === 'number'
              ? section.order
              : index + 1,

          category:
            typeof section.category === 'string'
              ? section.category
              : undefined,

          isMandatory:
            typeof section.isMandatory === 'boolean'
              ? section.isMandatory
              : undefined,

          isPricingSection:
            typeof section.isPricingSection === 'boolean'
              ? section.isPricingSection
              : undefined,
        }))
    : undefined;

  return {
    success:
      typeof result.success === 'boolean'
        ? result.success
        : undefined,

    project:
      result.project && typeof result.project === 'object'
        ? {
            projectId:
              typeof (result.project as Record<string, unknown>).projectId ===
              'string'
                ? (result.project as Record<string, unknown>).projectId as string
                : undefined,

            clientName:
              typeof (result.project as Record<string, unknown>).clientName ===
              'string'
                ? (result.project as Record<string, unknown>).clientName as string
                : undefined,

            engagementName:
              typeof (result.project as Record<string, unknown>)
                .engagementName === 'string'
                ? (result.project as Record<string, unknown>)
                    .engagementName as string
                : undefined,

            status:
              typeof (result.project as Record<string, unknown>).status ===
              'string'
                ? (result.project as Record<string, unknown>).status as string
                : undefined,
          }
        : undefined,

    sections,

    itemsForReview: Array.isArray(result.itemsForReview)
      ? result.itemsForReview
          .filter(
            (item): item is Record<string, unknown> =>
              Boolean(item) &&
              typeof item === 'object' &&
              !Array.isArray(item)
          )
          .map(item => ({
            item:
              typeof item.item === 'string'
                ? item.item
                : 'Review required',

            reason:
              typeof item.reason === 'string'
                ? item.reason
                : 'Additional review is required.',
          }))
      : undefined,

    confidenceScore:
      typeof result.confidenceScore === 'number'
        ? result.confidenceScore
        : undefined,

    pricingVerifiedBlank:
      typeof result.pricingVerifiedBlank === 'boolean'
        ? result.pricingVerifiedBlank
        : undefined,

    validationNotes: Array.isArray(result.validationNotes)
      ? result.validationNotes.filter(
          (note): note is string => typeof note === 'string'
        )
      : undefined,
  };
}

/**
 * Common n8n webhook caller.
 */
async function callN8n<T>(request: unknown): Promise<T> {
  if (!N8N_WEBHOOK_URL) {
    throw new Error(
      'VITE_N8N_WEBHOOK_URL is not configured.'
    );
  }

  console.log('========== SENDING TO N8N ==========');
  console.log(request);
  console.log('====================================');

  const response = await fetch(N8N_WEBHOOK_URL, {
    method: 'POST',

    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json, text/plain, */*',
    },

    body: JSON.stringify(request),
  });

  const text = await response.text();

  console.log('========== RAW N8N RESPONSE ==========');
  console.log(text);
  console.log('=======================================');

  if (!response.ok) {
    throw new Error(
      `n8n request failed with status ${response.status}${
        text ? `: ${text}` : ''
      }`
    );
  }

  if (!text.trim()) {
    throw new Error(
      'n8n returned an empty response.'
    );
  }

  let parsedData: unknown;

  try {
    parsedData = JSON.parse(text);
  } catch {
    // The webhook may return raw AI text instead of a JSON HTTP body.
    try {
      parsedData = extractJsonFromText(text);
    } catch (error) {
      console.error('Could not parse raw n8n response:', error);

      throw new Error(
        'n8n returned invalid JSON. Check the browser console for RAW N8N RESPONSE.'
      );
    }
  }

  try {
    const normalized = normalizeN8nResponse(parsedData);

    console.log('========== NORMALIZED N8N RESPONSE ==========');
    console.log(normalized);
    console.log('==============================================');

    return normalized as T;
  } catch (error) {
    console.error('Failed to normalize n8n response:', error);
    console.error('Parsed n8n response:', parsedData);

    throw new Error(
      'n8n returned a response, but Quill could not find the generated JSON sections. Check the browser console for the raw response.'
    );
  }
}

/**
 * Generate an SOW or Proposal through n8n.
 *
 * The frontend supplies the selected template as a structural blueprint.
 * n8n/Gemini must use the current project details and client documents
 * as the factual/content source.
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
