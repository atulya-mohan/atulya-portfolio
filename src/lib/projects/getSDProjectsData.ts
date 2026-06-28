import type { SDProjectData, SDProjectImage } from '@/lib/types';

import sdProjectsData from '@/data/sd-projects.json';
import sdProjectImagesData from '@/data/sd-project-images.json';

const projects = sdProjectsData as SDProjectData[];
const images = sdProjectImagesData as SDProjectImage[];

export type SDProject = {
  id: string;
  title: string;
  blurb: string;
  status: string | null;
  techStack: string[];
  problem: string | null;
  solution: string | null;
  keyFeatures: string[];
  links: { figma?: string | null; github?: string | null; live?: string | null } | null;
  images: { label: string | null; src: string }[];
};

/** Returns all SD projects with their images attached. */
export function getAllSDProjects(): SDProject[] {
  return projects.map(project => {
    const projectImages = images
      .filter(img => img.project_id === project.id)
      .map(img => ({ label: img.label, src: img.image_url }));

    return {
      id: project.id,
      title: project.title,
      blurb: project.blurb,
      status: project.status,
      techStack: project.tech_stack ?? [],
      problem: project.problem,
      solution: project.solution,
      keyFeatures: project.key_features ?? [],
      links: project.links,
      images: projectImages,
    };
  });
}
