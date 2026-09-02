import { SOWSection } from '../types/quill';
import { TemplateSection } from '../types/template';

export interface PricingViolation {
  sectionId?: string;
  sectionTitle: string;
  match: string;
  reason: string;
}

export interface PricingValidationResult {
  isValid: boolean;
  hasPlaceholder: boolean;
  isPMAuthorized?: boolean;
  violations: PricingViolation[];
  detectedMatches: string[];
  summary: string;
}

// Regex patterns for detecting explicit monetary figures and unvetted rates
export const PRICING_PATTERNS = {
  // $150,000, $500.00, €45,000, £1,200, ¥50000
  currencyWithAmount: /(?:\$|€|£|¥)\s*\d{1,3}(?:,\d{3})*(?:\.\d{2})?|\b(?:\$|€|£|¥)\s*\d+(?:\.\d{2})?\b/gi,
  
  // 150/hr, $150/hr, 200 / hour, 1200/day, 5000 per month, 8000/sprint
  rateWithFrequency: /(?:\$|€|£|¥)?\s*\b\d+(?:[,\.]\d+)?(?:\s*\/\s*|\s+per\s+)(?:hr|hour|day|month|sprint|wk|week|yr|year|sprints|hours|days|weeks|months)\b/gi,
  
  // 50000 USD, 1500 EUR, USD 50000, EUR 2500
  currencyCodeWithAmount: /\b(?:USD|EUR|GBP|AUD|CAD)\s*\d+(?:[,\.]\d+)?\b|\b\d+(?:[,\.]\d+)?\s*(?:USD|EUR|GBP|AUD|CAD|dollars|euros)\b/gi,
  
  // Valid allowed placeholders
  validPlaceholder: /\[\s*(?:TBD|To be determined|TBA|Insert|Commercial Finance|Commercial sign-off|Rate Card|Pending|—|_).*?\]|\{\{[A-Z0-9_]+\}\}|_{3,}|\[\s*—\s*\]/gi,
};

/**
 * Validates whether a text or section adheres to pricing governance.
 * AI generation is restricted from hallucinating prices (blank pricing guardrail).
 * When the Project Manager enters and approves pricing in the designated Pricing section,
 * explicit figures are validated and authorized for formal SOW export.
 */
export function validatePricingContent(
  content: string,
  sectionTitle: string = 'Section',
  sectionId?: string,
  options: { 
    isPricingSection?: boolean; 
    isStrictBlankPolicy?: boolean;
    isPMApproved?: boolean;
  } = {}
): PricingValidationResult {
  const isPricingSection = options.isPricingSection ?? false;
  const isPMApproved = options.isPMApproved ?? false;
  const isStrictBlankPolicy = options.isStrictBlankPolicy ?? true;
  const violations: PricingViolation[] = [];
  const detectedMatches: string[] = [];

  // Check for presence of valid placeholders
  const hasPlaceholder = PRICING_PATTERNS.validPlaceholder.test(content);

  // Scan for explicit currency symbols with numbers
  const currencyMatches = content.match(PRICING_PATTERNS.currencyWithAmount) || [];
  for (const match of currencyMatches) {
    detectedMatches.push(match);
    // If it's a non-pricing section OR strict blank policy is on AND NOT approved by PM
    if (!isPricingSection) {
      violations.push({
        sectionId,
        sectionTitle,
        match,
        reason: `Explicit monetary figure "${match}" detected in non-pricing section "${sectionTitle}". Fees belong in the Pricing section.`,
      });
    } else if (isStrictBlankPolicy && !isPMApproved) {
      violations.push({
        sectionId,
        sectionTitle,
        match,
        reason: `Explicit monetary figure "${match}" requires Project Manager review & approval before export.`,
      });
    }
  }

  // Scan for rate patterns like 150/hr, $150/hr, 200 per hour
  const rateMatches = content.match(PRICING_PATTERNS.rateWithFrequency) || [];
  for (const match of rateMatches) {
    if (!detectedMatches.includes(match)) {
      detectedMatches.push(match);
      if (!isPricingSection) {
        violations.push({
          sectionId,
          sectionTitle,
          match,
          reason: `Rate specification "${match}" detected outside the Pricing section.`,
        });
      } else if (isStrictBlankPolicy && !isPMApproved) {
        violations.push({
          sectionId,
          sectionTitle,
          match,
          reason: `Rate specification "${match}" requires Project Manager review & approval before export.`,
        });
      }
    }
  }

  // Scan for currency code amounts
  const codeMatches = content.match(PRICING_PATTERNS.currencyCodeWithAmount) || [];
  for (const match of codeMatches) {
    if (!detectedMatches.includes(match)) {
      detectedMatches.push(match);
      if (!isPricingSection) {
        violations.push({
          sectionId,
          sectionTitle,
          match,
          reason: `Monetary code figure "${match}" detected outside Pricing section.`,
        });
      } else if (isStrictBlankPolicy && !isPMApproved) {
        violations.push({
          sectionId,
          sectionTitle,
          match,
          reason: `Monetary code figure "${match}" requires Project Manager review & approval before export.`,
        });
      }
    }
  }

  const isValid = violations.length === 0;
  let summary = 'Compliant';
  if (isValid) {
    if (isPricingSection && isPMApproved && detectedMatches.length > 0) {
      summary = `Compliant: Project Manager authorized commercial figures (${detectedMatches.length} figures verified).`;
    } else if (hasPlaceholder) {
      summary = 'Compliant: Pricing fields are properly blanked placeholders for Commercial Finance.';
    } else {
      summary = 'Compliant: No unvetted monetary figures detected.';
    }
  } else {
    summary = `Non-compliant: Found ${violations.length} unapproved monetary/rate figure(s).`;
  }

  return {
    isValid,
    hasPlaceholder,
    isPMAuthorized: isPricingSection && isPMApproved,
    violations,
    detectedMatches,
    summary,
  };
}

/**
 * Validates all sections in a project or template for pricing compliance.
 */
export function validateProjectPricingPolicy(
  sections: (SOWSection | TemplateSection)[],
  options: { isProductionExport?: boolean } = {}
): { isValid: boolean; violations: PricingViolation[]; pricingSectionsChecked: number } {
  const allViolations: PricingViolation[] = [];
  let pricingSectionsChecked = 0;

  for (const section of sections) {
    const isPricing = (section as any).isPricingSection || 
      section.category === 'Pricing' || 
      section.title.toLowerCase().includes('pricing') || 
      section.title.toLowerCase().includes('fee') ||
      section.title.toLowerCase().includes('commercial');

    const isPMApproved = (section as SOWSection).status === 'Approved' && !(section as SOWSection).requiresReapproval;

    if (isPricing) {
      pricingSectionsChecked++;
    }

    // In production export or template validation, scan all sections
    const result = validatePricingContent(
      section.content, 
      section.title, 
      section.id, 
      { 
        isPricingSection: isPricing, 
        isStrictBlankPolicy: true,
        isPMApproved: isPMApproved
      }
    );

    if (!result.isValid) {
      allViolations.push(...result.violations);
    }
  }

  return {
    isValid: allViolations.length === 0,
    violations: allViolations,
    pricingSectionsChecked,
  };
}
