import { SOWProject } from '../types/quill';
import { GeneratedProposalSlide, ProposalTemplate } from '../types/proposal';
import { validatePricingIsBlank } from './aiGeneratorService';

const evidenceFor = (project: SOWProject) => {
  const documentEvidence = project.uploadedDocuments
    .flatMap(document => document.keyRequirementsExtracted || [])
    .slice(0, 5)
    .join('; ');
  return [project.description, project.meetingNotes, project.additionalRequirements, documentEvidence]
    .filter(Boolean)
    .join(' ');
};

const contentFor = (slide: ProposalTemplate['slides'][number], slideIndex: number, project: SOWProject, evidence: string, template: ProposalTemplate) => {
  const client = project.clientName;
  const projectType = project.projectType || 'transformation';
  const industry = project.clientIndustry || 'enterprise';
  const audienceContext = `${template.audience}; ${template.style.toLowerCase()} delivery.`;

  switch (slideIndex) {
    case 0: return `${client} | ${projectType} proposal\nA focused path to measurable value in ${industry}.`;
    case 1: return `${client} is pursuing a ${projectType.toLowerCase()} initiative grounded in the project intake. The work focuses on agreed business and technical priorities, with clear outcomes for the ${industry.toLowerCase()} environment. This approach keeps the engagement practical, measurable, and aligned to stakeholder needs.`;
    case 2: return `The engagement will begin by aligning on priorities and stakeholder needs. The team will then shape the target experience, validate the recommended direction, and create an actionable delivery path for ${client}.`;
    case 3: return `The engagement will provide a focused set of findings, design principles, governance guidance, and an actionable launch backlog for ${client}. These outputs are designed to support executive decisions and give delivery teams clear next steps.`;
    case 4: return `${client}'s target approach connects capabilities, governance, and operational ownership for a scalable outcome. It establishes the foundations needed for consistent delivery, responsible decision-making, and long-term adoption. ${audienceContext}.`;
    case 5: return `The next step is to confirm objectives, stakeholder access, evidence, and the delivery path. The team can then move into focused planning, finalize responsibilities, and prepare ${client} for an informed project kickoff.`;
    default: return `${client} is pursuing a ${projectType.toLowerCase()} initiative across its ${industry.toLowerCase()} environment.`;
  }
};

export async function generateProposalContent(project: SOWProject, template: ProposalTemplate): Promise<GeneratedProposalSlide[]> {
  await new Promise(resolve => setTimeout(resolve, 650));
  const evidence = evidenceFor(project);
  const slides = template.slides.map((slide, slideIndex) => ({
    ...slide,
    content: contentFor(slide, slideIndex, project, evidence, template),
  }));
  const commercialContent = slides.find(slide => slide.contentType === 'commercials')?.content || '';
  if (!validatePricingIsBlank(commercialContent).isValid) throw new Error('Proposal generation produced an unapproved commercial value.');
  return slides;
}