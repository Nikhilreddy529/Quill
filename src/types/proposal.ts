export interface ProposalTemplateSlide {
  title: string;
  purpose: string;
  contentType: 'cover' | 'narrative' | 'architecture' | 'timeline' | 'team' | 'commercials' | 'next-steps';
}

export interface ProposalTemplate {
  id: string;
  fileName: string;
  assetPath: string;
  name: string;
  description: string;
  audience: string;
  style: string;
  slideCount: number;
  narrativeFlow: string;
  visualStyle: {
    headingFont: string;
    bodyFont: string;
    backgroundColor: string;
    headingColor: string;
    bodyColor: string;
    accentColors: string[];
  };
  slides: ProposalTemplateSlide[];
}

export interface GeneratedProposalSlide extends ProposalTemplateSlide {
  content: string;
}