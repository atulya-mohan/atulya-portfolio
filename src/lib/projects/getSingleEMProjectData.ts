'use server';

import { supabaseServer } from '../supabase/server';
// Reuse the EMProject type from your other file
import type { EMProject } from './getEMProjectsData';

/**
 * Fetches all detailed data for a *single* EM project by its ID.
 */
export async function getSingleEMProjectData(id: string): Promise<EMProject | null> {
  const supabase = supabaseServer();
  console.log(`=== Fetching Single EM Project: ${id} ===`);

  const { data: project, error: projectError } = await supabase
    .from('em_projects')
    .select('*') // Get ALL columns
    .eq('id', id)
    .maybeSingle();

  if (projectError) {
    console.error(`Error fetching project ${id}:`, projectError.message);
    return null;
  }
  if (!project) {
    return null;
  }

  const { data: images, error: imagesError } = await supabase
    .from('em_project_images')
    .select('image_url')
    .eq('project_id', id)
    .order('sort_index', { ascending: true });
  
  const mediaUrls = (images ?? [])
    .map((img) => img.image_url)
    .filter(Boolean) as string[];

  // Return the full project object with all fields
  return {
    id: project.id,
    title: project.title,
    role: project.role,
    year: project.year,
    type: project.type,
    blurb: project.blurb,
    coverImageUrl: project.cover_image_url ?? null,
    modules: project.modules ?? [],
    outcomes: project.outcomes ?? [],
    theme: project.theme ?? 'seminar',
    media: mediaUrls,
    confidential: project.confidential,
    problem_users: project.problem_users,
    jtbd: project.jtbd ?? [],
    hypotheses: project.hypotheses ?? [],
    mvp_in: project.mvp_in ?? [],
    mvp_later: project.mvp_later ?? [],
    current_status: project.current_status,
    exec_snapshot: project.exec_snapshot ?? [],
    decision_criteria: project.decision_criteria ?? [],

    // 👇=============== THIS IS THE FIX ===============👇
    rd_timeline: project.rd_timeline ?? [],
    rd_enablers: project.rd_enablers ?? [],
    rd_frictions: project.rd_frictions ?? [],
    rd_takeaways: project.rd_takeaways,
    // ==================================================

    // 👇 ADD THESE
    ipod_thesis: project.ipod_thesis,
    ipod_levers: project.ipod_levers ?? [],
    ipod_kpis: project.ipod_kpis ?? [],
    ipod_insight: project.ipod_insight,

    // 👇 ADD THIS
    pm_persona: project.pm_persona ?? [],

  };
}