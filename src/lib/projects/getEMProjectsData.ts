'use server';

import { supabaseServer } from '../supabase/server';

// ... (Your EMProject type - no change)
export type EMProject = {
  id: string;
  title: string;
  role: string;
  year: string;
  type: string;
  blurb: string;
  coverImageUrl: string | null;
  modules: string[];
  outcomes: string[];
  theme: string;
  media: string[];
  
  // Optional fields
  confidential?: boolean;
  problem_users?: string | null;
  jtbd?: string[] | null;
  hypotheses?: string[] | null;
  mvp_in?: string[] | null;
  mvp_later?: string[] | null;
  current_status?: string | null;
  exec_snapshot?: string[] | null;
  decision_criteria?: any[] | null; 

  rd_timeline?: any[] | null;
  rd_enablers?: string[] | null;
  rd_frictions?: string[] | null;
  rd_takeaways?: string | null;

  // 👇 ADD THESE NEW FIELDS
  ipod_thesis?: string | null;
  ipod_levers?: string[] | null;
  ipod_kpis?: any[] | null;
  ipod_insight?: string | null;

  // 👇 ADD THIS NEW FIELD
  pm_persona?: string[] | null;
};

export async function getEMProjectsData(): Promise<EMProject[]> {
  const supabase = supabaseServer();

  console.log('=== Fetching EM Projects (Summary) ===');

  const { data: projects, error: projectsError } = await supabase
    .from('em_projects')
    .select(
      `
      id, title, role, year, type, blurb, cover_image_url, 
      modules, outcomes, theme, sort_index, problem_users, rd_timeline, 
      rd_enablers, rd_frictions, rd_takeaways, ipod_thesis, ipod_levers, ipod_kpis, ipod_insight,
      pm_persona
    `
    )
    .eq('confidential', false)
    .order('sort_index', { ascending: true });

  if (projectsError) {
    console.error('Error fetching EM projects:', projectsError.message);
    return [];
  }

  if (!projects || projects.length === 0) {
    return [];
  }

  const projectIds = projects.map((p) => p.id);
  const { data: images, error: imagesError } = await supabase
    .from('em_project_images')
    .select('id, project_id, image_url, sort_index')
    .in('project_id', projectIds)
    .order('sort_index', { ascending: true });

  if (imagesError) {
    console.error('Error fetching EM project images:', imagesError);
  }

  const imagesByProject: Record<string, string[]> = {};
  for (const img of images ?? []) {
    if (!imagesByProject[img.project_id]) {
      imagesByProject[img.project_id] = [];
    }
    // === FIX ===
    // Just use the URL directly from the database, like in your ME file
    imagesByProject[img.project_id].push(img.image_url);
  }

  const result: EMProject[] = projects.map((p) => ({
    id: p.id,
    title: p.title,
    role: p.role,
    year: p.year,
    type: p.type,
    blurb: p.blurb,
    // === FIX ===
    // Just use the URL directly, or null if it doesn't exist
    coverImageUrl: p.cover_image_url ?? null,
    modules: p.modules ?? [],
    outcomes: p.outcomes ?? [],
    theme: p.theme ?? 'seminar',
    media: imagesByProject[p.id] ?? [],
    problem_users: p.problem_users,

    rd_timeline: p.rd_timeline,
    rd_enablers: p.rd_enablers,
    rd_frictions: p.rd_frictions,
    rd_takeaways: p.rd_takeaways,

    // 👇 ADD THESE
    ipod_thesis: p.ipod_thesis,
    ipod_levers: p.ipod_levers,
    ipod_kpis: p.ipod_kpis,
    ipod_insight: p.ipod_insight,

    // 👇 ADD THIS
    pm_persona: p.pm_persona,
  }));

  return result;
}