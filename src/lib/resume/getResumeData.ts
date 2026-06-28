import resumeJson from '@/data/resume.json';

export interface ResumeContact {
  email: string;
  phone: string;
  linkedin: string;
  website: string;
  location: string;
}

export interface ResumeEducation {
  institution: string;
  degree: string;
  dates: string;
  location: string;
  details: string[];
}

export interface ResumeExperience {
  company: string;
  role: string;
  dates: string;
  location: string;
  points: string[];
}

export interface ResumePublication {
  title: string;
  authors: string;
  journal: string;
  date: string;
  doi: string;
  href: string;
}

export interface ResumeProject {
  title: string;
  dates: string;
  points: string[];
}

export interface ResumeData {
  name: string;
  title: string;
  contact: ResumeContact;
  summary: string;
  education: ResumeEducation[];
  experience: ResumeExperience[];
  skills: Record<string, string[]>;
  publications: ResumePublication[];
  projects: ResumeProject[];
}

export function getResumeData(): ResumeData {
  return resumeJson as ResumeData;
}
