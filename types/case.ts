export interface Case {
  code: string;
  title: string;
  slug: string;
  topic: string;
  context: string;
  simpleEmenda: string;
  createdAt: string;
  level: number;
  priority: 'altissima' | 'alta' | 'media' | 'baixa';
  isPublished: boolean;
  narrativeMd: string;
  conflict: string;
  explanationMd: string;
  applicationMd: string;
  keyIdea: string;
  proofTip: string;
  mnemonics: string[];
  references: string[];
  tags: string[];
}

export interface Discipline {
  name: string;
  slug: string;
}

export interface Module {
  name: string;
  slug: string;
  order: number;
}

export interface CaseData {
  discipline: Discipline;
  module: Module;
  cases: Case[];
}