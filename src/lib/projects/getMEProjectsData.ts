// src/lib/projects/getMEProjectsData.ts
'use server';

import { supabaseServer } from '../supabase/server';

export const runtime = 'nodejs';

export type MEProject = {
  id: string;
  title: string;
  role: string;
  year: string;
  type: string;
  blurb: string;
  images: string[];
  coverImageUrl: string | null;
};

export async function getMEProjectsData(): Promise<MEProject[]> {
  const supabase = supabaseServer();

  if (!supabase) {
    console.warn('[getMEProjectsData] Supabase client unavailable. Returning empty dataset.');
    return [];
  }

  console.log('=== Fetching ME Projects ===');

  // Fetch all ME projects ordered by sort_index
  const { data: projects, error: projectsError } = await supabase
    .from('me_projects')
    .select('id, title, role, year, type, blurb, sort_index, cover_image_url')
    .order('sort_index', { ascending: true });

  if (projectsError) {
    console.error('Error fetching ME projects:', projectsError);
    return [];
  }

  console.log('Found projects:', projects?.length);

  if (!projects || projects.length === 0) {
    console.log('No projects found');
    return [];
  }

  // Fetch images for all projects
  const projectIds = projects.map(p => p.id);
  const { data: images, error: imagesError } = await supabase
    .from('me_project_images')
    .select('project_id, image_url, sort_index')
    .in('project_id', projectIds)
    .order('sort_index', { ascending: true });

  if (imagesError) {
    console.error('Error fetching ME project images:', imagesError);
  }

  console.log('Found images:', images?.length);

  // Group images by project_id
  const imagesByProject: Record<string, string[]> = {};
  for (const img of images ?? []) {
    if (!imagesByProject[img.project_id]) {
      imagesByProject[img.project_id] = [];
    }
    imagesByProject[img.project_id].push(img.image_url);
  }

  // Map projects with their images
  const result: MEProject[] = projects.map(p => ({
    id: p.id,
    title: p.title,
    role: p.role,
    year: p.year,
    type: p.type,
    blurb: p.blurb,
    images: imagesByProject[p.id] ?? [],
    coverImageUrl: p.cover_image_url ?? null,
  }));

  console.log('=== Final ME Projects ===', result);
  return result;
}