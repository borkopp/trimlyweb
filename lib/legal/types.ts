export type LegalSection = {
  heading: string;
  paragraphs?: string[];
  bullets?: string[];
};

export type LegalDocument = {
  title: string;
  eyebrow: string;
  summary: string;
  effectiveDate: string;
  introduction: string[];
  sections: LegalSection[];
  contact: {
    heading: string;
    text: string;
    email: string;
    authority?: {
      label: string;
      href: string;
    };
  };
};
