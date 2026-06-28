// src/lib/types.ts
// Canonical type definitions for all JSON data shapes.
// These match the structure of files in src/data/*.json.

// ── About ──────────────────────────────────────────
export interface AboutProfile {
  id: string;
  full_name: string;
  tagline: string;
  bio: string;
  photo_url: string;
  updated_at: string;
}

// ── Timeline ───────────────────────────────────────
export interface TimelineSegment {
  id: string;
  band: "top" | "bottom";
  start_ym: string;
  end_ym: string | null;
  label: string;
  sort_index: number;
  created_at: string;
  logo_url: string | null;
  type: "education" | "experience";
}

export interface TimelineSeg {
  id?: string;
  start: string;
  end?: string | null;
  label?: string | null;
  logo_url?: string | null;
  logo_bg?: string | null; // brand background behind the logo puck (e.g. Michelin blue)
  type?: "education" | "experience" | null;
  details?: TimelineEducation | TimelineExperience | null;
}

export interface TimelineEducation {
  institution: string;
  degree?: string | null;
  field_of_study?: string | null;
  description?: string | null;
  achievements?: string[] | null;
  gpa?: string | null;
  location?: string | null;
}

export interface TimelineExperience {
  company: string;
  position: string;
  description?: string | null;
  responsibilities?: string[] | null;
  technologies?: string[] | null;
  location?: string | null;
}

// ── Skills ─────────────────────────────────────────
export interface SkillGroupData {
  id: string;
  name: string;
  sort_index: number;
  created_at: string;
  color: string;
}

export interface SkillData {
  id: string;
  group_id: string;
  label: string;
  sort_index: number;
  created_at: string;
}

export interface SkillGroup {
  name: string;
  skills: string[];
  color: string | null;
}

// ── Interests ──────────────────────────────────────
export interface InterestData {
  id: string;
  label: string;
  icon_name: string;
  sort_index: number;
  created_at: string;
  color: string;
}

export interface Interest {
  label: string;
  icon_name?: string | null;
  color?: string | null;
}

// ── Contact Links ──────────────────────────────────
export interface ContactLinkData {
  id: string;
  label: string;
  url: string;
  icon_name: string;
  sort_index: number;
  created_at: string;
}

export interface ContactLink {
  label: string;
  url: string;
  icon_name?: string | null;
}

// ── Photos ─────────────────────────────────────────
export interface Photo {
  id: string;
  title: string;
  description: string | null;
  image_url: string;
  year: string | null;
  location: string | null;
  sort_index: number;
  created_at: string;
  updated_at: string;
}

// ── Music ──────────────────────────────────────────
export interface MusicProject {
  id: string;
  created_at: string;
  title: string;
  description: string | null;
  year: string | null;
  type: string | null;
  image_url: string | null;
  audio_url: string | null;
  sort_index: number;
  cover_image_url: string | null;
}

// ── ME Projects ────────────────────────────────────
export interface MEProjectData {
  id: string;
  title: string;
  role: string;
  year: string;
  type: string;
  blurb: string;
  sort_index: number;
  created_at: string;
  updated_at: string;
  cover_image_url: string | null;
}

export interface MEProjectImage {
  id?: string;
  project_id: string;
  image_url: string;
  sort_index?: number;
}

// ── EM Projects ────────────────────────────────────
export interface EMProjectData {
  id: string;
  title: string;
  role: string;
  year: string;
  type: string;
  blurb: string;
  sort_index: number;
  created_at: string;
  updated_at: string;
  course_id: string | null;
  cover_image_url: string | null;
  confidential: boolean;
  modules: string[];
  outcomes: string[] | null;
  theme: string;
  problem_users: string | null;
  jtbd: string[] | null;
  hypotheses: string[] | null;
  mvp_in: string[] | null;
  mvp_later: string[] | null;
  current_status: string | null;
  exec_snapshot: string[] | null;
  decision_criteria: { name: string; weight: string }[] | null;
  rd_timeline: { name: string; weight: string }[] | null;
  rd_enablers: string[] | null;
  rd_frictions: string[] | null;
  rd_takeaways: string | null;
  ipod_thesis: string | null;
  ipod_levers: string[] | null;
  ipod_kpis: { name: string; weight: string }[] | null;
  ipod_insight: string | null;
  pm_persona: string[] | null;
}

export interface EMProjectImage {
  id?: string;
  project_id: string;
  image_url: string;
  sort_index?: number;
}

// ── SD Projects ────────────────────────────────────
export interface SDProjectData {
  id: string;
  title: string;
  blurb: string;
  status: string | null;
  tech_stack: string[] | null;
  problem: string | null;
  solution: string | null;
  key_features: string[] | null;
  links: { figma?: string | null; github?: string | null; live?: string | null } | null;
  cover_image_url: string | null;
}

export interface SDProjectImage {
  id?: string;
  project_id: string;
  image_url: string;
  label: string | null;
  sort_index?: number;
}
