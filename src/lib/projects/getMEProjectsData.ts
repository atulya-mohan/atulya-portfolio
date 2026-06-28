import type { MEProjectData, MEProjectImage } from '@/lib/types';

import meProjectsData from '@/data/me-projects.json';
import meProjectImagesData from '@/data/me-project-images.json';

const projects = meProjectsData as MEProjectData[];
const images = meProjectImagesData as MEProjectImage[];

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

export function getMEProjectsData(): MEProject[] {
  if (!projects.length) return [];

  const imagesByProject: Record<string, string[]> = {};
  for (const img of images) {
    (imagesByProject[img.project_id] ??= []).push(img.image_url);
  }

  return projects.map(p => ({
    id: p.id,
    title: p.title,
    role: p.role,
    year: p.year,
    type: p.type,
    blurb: p.blurb,
    images: imagesByProject[p.id] ?? [],
    coverImageUrl: p.cover_image_url ?? null,
  }));
}
