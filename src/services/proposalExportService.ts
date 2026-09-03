import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { SOWProject } from '../types/quill';
import { GeneratedProposalSlide, ProposalTemplate } from '../types/proposal';

const escapeXml = (value: string) => value
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&apos;');

const setShapeText = (shapeXml: string, value: string) => {
  let isFirstTextNode = true;
  return shapeXml.replace(/<a:t>[\s\S]*?<\/a:t>/g, () => {
    if (!isFirstTextNode) return '';
    isFirstTextNode = false;
    return `<a:t>${escapeXml(value)}</a:t>`;
  });
};

const replaceShapeContaining = (slideXml: string, marker: string, value: string) => {
  let replaced = false;
  return slideXml.replace(/<p:sp>[\s\S]*?<\/p:sp>/g, shapeXml => {
    if (replaced || !shapeXml.includes(marker)) return shapeXml;
    replaced = true;
    return setShapeText(shapeXml, value);
  });
};

const replaceSlideCopy = (slideXml: string, slideNumber: number, slide: GeneratedProposalSlide, project: SOWProject) => {
  if (slideNumber === 1) {
    return replaceShapeContaining(
      replaceShapeContaining(slideXml, 'Intranet MVP Proposal', project.title || `${project.clientName} Proposal`),
      'A calm, clear and usable home for organizational knowledge',
      slide.content,
    ).replace(/Prepared for [^<]*/, `Prepared for ${escapeXml(project.clientName)}`);
  }

  const titleMarkers = ['Understanding the need', 'Proposed approach', 'What you will receive', 'Delivery plan and investment', 'Why DTMC'];
  const subtitleMarkers = [
    'The decision this engagement is designed to support',
    'Three stages from alignment to an actionable result',
    'Concrete outputs designed for reuse and executive action',
    'Illustrative sample terms, ready to tailor during contracting',
    'Practical strategy. Disciplined delivery. Transferable capability.',
  ];
  const markerIndex = slideNumber - 2;
  return replaceShapeContaining(
    replaceShapeContaining(slideXml, titleMarkers[markerIndex], slide.title),
    subtitleMarkers[markerIndex],
    slide.content,
  );
};

export async function exportProposalDeck(
  project: SOWProject,
  template: ProposalTemplate,
  generatedSlides: GeneratedProposalSlide[]
): Promise<void> {
  const response = await fetch(template.assetPath);
  if (!response.ok) throw new Error(`Unable to load proposal template: ${template.fileName}`);

  const zip = await JSZip.loadAsync(await response.arrayBuffer());
  const templateSlideCount = 6;
  for (let index = 0; index < templateSlideCount; index += 1) {
    const slidePath = `ppt/slides/slide${index + 1}.xml`;
    const slideFile = zip.file(slidePath);
    if (!slideFile || !generatedSlides[index]) continue;
    const slideXml = await slideFile.async('string');
    zip.file(slidePath, replaceSlideCopy(slideXml, index + 1, generatedSlides[index], project));
  }

  const blob = await zip.generateAsync({ type: 'blob', compression: 'DEFLATE' });
  const fileName = `${(project.clientName || 'proposal').replace(/[^a-z0-9]+/gi, '-').toLowerCase()}-${template.id}.pptx`;
  saveAs(blob, fileName);
}
