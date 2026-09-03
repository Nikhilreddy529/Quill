import { describe, it, expect } from 'vitest';
import { validatePricingContent, validateProjectPricingPolicy } from '../pricingValidationService';
import { validateSOWForExport } from '../docxExportService';
import { templateService } from '../templateService';
import { concurrencyAndAuditService } from '../concurrencyAndAuditService';
import { SOWProject, SOWSection } from '../../types/quill';

describe('Pricing Policy Validation (Blank Pricing Rule)', () => {
  it('detects unvetted hourly rates such as $150/hr or 200 per hour', () => {
    const text1 = 'Senior Architects will be billed at $150/hr for architecture spikes.';
    const result1 = validatePricingContent(text1, 'Pricing Section', 'sec-1', { isPricingSection: true });
    expect(result1.isValid).toBe(false);
    expect(result1.violations.length).toBeGreaterThan(0);

    const text2 = 'Technical consultants: 200 / hour.';
    const result2 = validatePricingContent(text2, 'Pricing Section', 'sec-2', { isPricingSection: true });
    expect(result2.isValid).toBe(false);
  });

  it('detects currency amounts such as $50,000, €45,000, 10000 USD', () => {
    const text = 'Total estimated milestone budget is $50,000 payable upon completion.';
    const result = validatePricingContent(text, 'Fees', 'sec-3', { isPricingSection: true });
    expect(result.isValid).toBe(false);
    expect(result.detectedMatches).toContain('$50,000');

    const textEur = 'License fee: €45,000.00 upfront.';
    const resultEur = validatePricingContent(textEur, 'Fees', 'sec-3b', { isPricingSection: true });
    expect(resultEur.isValid).toBe(false);

    const textCode = 'Milestone total: 10000 USD.';
    const resultCode = validatePricingContent(textCode, 'Fees', 'sec-3c', { isPricingSection: true });
    expect(resultCode.isValid).toBe(false);
  });

  it('detects sprint and daily rates', () => {
    const textSprint = 'Scrum team cost: $8000/sprint.';
    const resultSprint = validatePricingContent(textSprint, 'Pricing', 'sec-sprint', { isPricingSection: true });
    expect(resultSprint.isValid).toBe(false);

    const textDay = 'Daily advisory rate: 1200 per day.';
    const resultDay = validatePricingContent(textDay, 'Pricing', 'sec-day', { isPricingSection: true });
    expect(resultDay.isValid).toBe(false);
  });

  it('passes compliant blank placeholders adhering to commercial finance policy', () => {
    const compliantText = `
### 7. Fees and Invoicing Schedule
| Role | Planned Allocation | Commercial Billing Rate |
|---|---|---|
| DTMC Solution Lead | 100% | [To be determined upon Commercial Finance Sign-Off] |
| Lead Cloud Architect | 50% | [TBD - Fixed Fee Milestone Schedule] |
| Technical Consultant | 100% | [ — ] |
    `;
    const result = validatePricingContent(compliantText, 'Fees', 'sec-4', { isPricingSection: true });
    expect(result.isValid).toBe(true);
    expect(result.hasPlaceholder).toBe(true);
    expect(result.violations.length).toBe(0);
  });
});

describe('Export Preflight Validation', () => {
  const createMockProject = (overrides?: Partial<SOWProject>): SOWProject => {
    const mockSections: SOWSection[] = [
      {
        id: 'sec-1',
        projectId: 'mock-p1',
        order: 1,
        title: '1. Engagement Overview',
        category: 'Scope',
        content: 'This engagement covers the discovery phase for GreenPath Logistics.',
        status: 'Approved',
        isMandatory: true,
        isPricingSection: false,
        groundedSources: [],
        version: 1,
        lastEditedBy: 'Nikhil',
        lastEditedAt: new Date().toISOString(),
        confidenceScore: 95,
      },
      {
        id: 'sec-2',
        projectId: 'mock-p1',
        order: 2,
        title: '2. Pricing and Commercials',
        category: 'Pricing',
        content: 'Pricing: [To be determined upon finalized staffing schedule]',
        status: 'Approved',
        isMandatory: true,
        isPricingSection: true,
        groundedSources: [],
        version: 1,
        lastEditedBy: 'Nikhil',
        lastEditedAt: new Date().toISOString(),
        confidenceScore: 95,
      }
    ];

    return {
      id: 'PRJ-TEST-01',
      title: 'GreenPath Cloud Migration SOW',
      clientName: 'GreenPath Logistics',
      clientContact: 'Riley Chen',
      clientContactEmail: 'riley.chen@greenpath.example',
      clientIndustry: 'Logistics',
      projectType: 'Time and Materials (T&M)',
      targetStartDate: '2026-10-01',
      targetEndDate: '2027-03-31',
      currency: 'USD',
      estimatedBudgetPlaceholder: '[To be determined]',
      status: 'Generated',
      currentStep: 3,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ownerName: 'Nikhil',
      ownerEmail: 'nikhil@acme.example',
      description: 'Test SOW',
      meetingNotes: 'Discovery notes',
      discoveryDocNames: ['SRS.docx'],
      uploadedDocuments: [],
      additionalRequirements: '',
      selectedTemplateId: 'TMPL-DTMC-2025-01',
      frameworkApproved: true,
      sections: mockSections,
      exportHistory: [],
      ...overrides,
    };
  };

  it('passes preflight when all sections are approved, framework approved, and pricing blank', () => {
    const project = createMockProject();
    const result = validateSOWForExport(project);
    expect(result.canExport).toBe(true);
    expect(result.errors.length).toBe(0);
  });

  it('blocks export when any section is pending or in review', () => {
    const project = createMockProject();
    project.sections[0].status = 'Review';
    const result = validateSOWForExport(project);
    expect(result.canExport).toBe(false);
    expect(result.errors.some(e => e.includes('not approved'))).toBe(true);
  });

  it('blocks export when framework is not approved', () => {
    const project = createMockProject({ frameworkApproved: false });
    const result = validateSOWForExport(project);
    expect(result.canExport).toBe(false);
    expect(result.errors.some(e => e.includes('framework'))).toBe(true);
  });

  it('blocks export when pricing policy is violated with explicit figures', () => {
    const project = createMockProject();
    project.sections[1].content = 'Commercial Rate: $175/hr for 500 hours.';
    const result = validateSOWForExport(project);
    expect(result.canExport).toBe(false);
    expect(result.pricingCompliant).toBe(false);
    expect(result.errors.some(e => e.includes('Blank Pricing Policy violation'))).toBe(true);
  });

  it('does not mutate the project sections array during sorting', () => {
    const project = createMockProject();
    project.sections[0].order = 2;
    project.sections[1].order = 1;
    
    const originalFirstId = project.sections[0].id;
    // Call validation
    validateSOWForExport(project);
    // Original array order in project should remain unchanged
    expect(project.sections[0].id).toBe(originalFirstId);
  });
});

describe('Template to Project Linkage & Type Soundness', () => {
  it('initializes SOWProject with actual template ID and metadata without as any casting', () => {
    const templates = templateService.getTemplates();
    expect(templates.length).toBeGreaterThan(0);

    const template = templates[0];
    const project = templateService.createSOWProjectFromTemplate(
      template,
      'Acme Industrial Corp',
      'Acme ERP Modernization',
      '2026-11-01',
      '2027-04-30',
      'Jordan Taylor',
      'jordan.taylor@acme.example'
    );

    expect(project.selectedTemplateId).toBe(template.id);
    expect(project.clientName).toBe('Acme Industrial Corp');
    expect(project.clientContact).toBe('Jordan Taylor');
    expect(project.clientContactEmail).toBe('jordan.taylor@acme.example');
    expect(project.wordTemplateFile).toBe(template.metadata.wordTemplateFile);
    expect(project.sections.length).toBe(template.sections.length);
  });
});

describe('Concurrency & Section Edit Snapshotting', () => {
  it('creates an audit snapshot and increments version upon editing', () => {
    const section: SOWSection = {
      id: 'SEC-101',
      projectId: 'PRJ-101',
      order: 1,
      title: 'Engagement Overview',
      category: 'Scope',
      content: 'Original scope text.',
      status: 'Approved',
      isMandatory: true,
      isPricingSection: false,
      groundedSources: [],
      version: 1.0,
      lastEditedBy: 'Nikhil',
      lastEditedAt: new Date().toISOString(),
      confidenceScore: 90,
    };

    const editResult = concurrencyAndAuditService.handleSectionEdit(
      section,
      'Updated scope text with expanded milestone deliverables.',
      'Nikhil (PM)'
    );

    expect(editResult.updatedSection.content).toBe('Updated scope text with expanded milestone deliverables.');
    expect(editResult.updatedSection.version).toBeGreaterThan(1.0);
    expect(editResult.updatedSection.requiresReapproval).toBe(true);
    expect(editResult.updatedSection.versionHistory?.length).toBeGreaterThan(0);
    expect(editResult.updatedSection.previousContentSnapshot).toBe('Original scope text.');
  });
});
