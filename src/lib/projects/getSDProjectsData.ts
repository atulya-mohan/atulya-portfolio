'use server';

import { supabaseServer } from '../supabase/server';

// Define the type for our project data
export type SDProject = {
  id: string;
  title: string;
  blurb: string; // Will hold the 'overview'
  status: string | null;
  techStack: string[];
  problem: string | null;
  solution: string | null;
  keyFeatures: string[];
  links: { figma?: string | null; github?: string | null; live?: string | null; } | null;
  images: { label: string | null; src: string; }[];
};

export async function getSDProjectsData(): Promise<SDProject | null> {
  const supabase = supabaseServer();

  // 1. Fetch the first (and only) SD project
  const { data: project, error: projectError } = await supabase
    .from('sd_projects')
    .select('*')
    .order('sort_index', { ascending: true })
    .limit(1)
    .maybeSingle(); // Gets one row or null

  if (projectError) {
    console.error('Error fetching SD project:', projectError.message);
    return null;
  }

  if (!project) {
    console.log('No SD project found');
    return null;
  }

  // 2. Fetch its images
  const { data: images, error: imagesError } = await supabase
    .from('sd_project_images')
    .select('image_url, label, sort_index')
    .eq('project_id', project.id)
    .order('sort_index', { ascending: true });

  if (imagesError) {
    console.error('Error fetching SD project images:', imagesError.message);
  }

  // 3. Combine the data and return
  const result: SDProject = {
    id: project.id,
    title: project.title,
    blurb: project.blurb,
    status: project.status,
    techStack: project.tech_stack ?? [],
    problem: project.problem,
    solution: project.solution,
    keyFeatures: project.key_features ?? [],
    links: project.links as SDProject['links'], // Cast from jsonb
    images: (images ?? []).map(img => ({
      label: img.label,
      src: img.image_url, // Assumes image_url is the full public URL
    })),
  };

  return result;
}