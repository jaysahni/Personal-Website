export interface Experience {
  title: string;
  company: string;
  location: string;
  period?: string;
}

export interface Education {
  degree: string;
  field: string;
  institution: string;
  period?: string;
}

export interface SkillCategory {
  name: string;
  skills: string[];
}

export interface BlogPost {
  slug: string;
  title: string;
  date: string;
  category: string;
  excerpt?: string;
  content: string;
}

export interface ContactLink {
  platform: string;
  handle: string;
  url: string;
}

export interface SpecItem {
  component: string;
  value: string;
}

export interface LibraryItem {
  name: string;
  description: string;
  url?: string;
}

export interface LearningResource {
  name: string;
  description: string;
  url?: string;
}
