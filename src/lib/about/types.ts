// types.ts (safe for client)
export type TimelineSeg = {
    start: string; end?: string | null; label?: string | null; logo_url?: string | null;
    id?: string; type?: string | null; details?: TimelineEducation | TimelineExperience | null;
};
export type TimelineEducation = { 
    institution: string; degree?: string | null; field_of_study?: string | null; description?: string | null; achievements?: string[] | null; gpa?: string | null; location?: string | null; 
};
export type TimelineExperience = {
     company: string; position: string; description?: string | null; responsibilities?: string[] | null; technologies?: string[] | null; location?: string | null; 
};
  