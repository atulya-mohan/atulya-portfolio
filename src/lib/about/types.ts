// src/lib/about/types.ts
export type TimelineEducation = {
    institution: string;
    degree?: string | null;
    field_of_study?: string | null;
    description?: string | null;
    achievements?: string[] | null;
    gpa?: string | null;
    location?: string | null;
  };
  
  export type TimelineExperience = {
    company: string;
    position: string;
    description?: string | null;
    responsibilities?: string[] | null;
    technologies?: string[] | null;
    location?: string | null;
  };
  
  export type TimelineSeg = {
    id?: string;
    start: string;
    end?: string | null;
    label?: string | null;
    logo_url?: string | null;
    type?: 'education' | 'experience' | null;
    details?: TimelineEducation | TimelineExperience | null;
  };
  