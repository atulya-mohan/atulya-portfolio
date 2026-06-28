import type { EMProjectData, EMProjectImage } from '@/lib/types';

import emProjectsData from '@/data/em-projects.json';
import emProjectImagesData from '@/data/em-project-images.json';

const allProjects = emProjectsData as EMProjectData[];
const allImages = emProjectImagesData as EMProjectImage[];

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
  confidential?: boolean;
  problem_users?: string | null;
  jtbd?: string[] | null;
  hypotheses?: string[] | null;
  mvp_in?: string[] | null;
  mvp_later?: string[] | null;
  current_status?: string | null;
  exec_snapshot?: string[] | null;
  decision_criteria?: { name: string; weight: string }[] | null;
  rd_timeline?: { name: string; weight: string }[] | null;
  rd_enablers?: string[] | null;
  rd_frictions?: string[] | null;
  rd_takeaways?: string | null;
  ipod_thesis?: string | null;
  ipod_levers?: string[] | null;
  ipod_kpis?: { name: string; weight: string }[] | null;
  ipod_insight?: string | null;
  pm_persona?: string[] | null;
};

export function getEMProjectsData(): EMProject[] {
  const projects = allProjects.filter(p => !p.confidential);
  if (!projects.length) return [];

  const imagesByProject: Record<string, string[]> = {};
  for (const img of allImages) {
    (imagesByProject[img.project_id] ??= []).push(img.image_url);
  }

  return projects.map(p => ({
    id: p.id,
    title: p.title,
    role: p.role,
    year: p.year,
    type: p.type,
    blurb: p.blurb,
    coverImageUrl: p.cover_image_url ?? null,
    modules: p.modules ?? [],
    outcomes: p.outcomes ?? [],
    theme: p.theme ?? 'seminar',
    media: imagesByProject[p.id] ?? [],
    problem_users: p.problem_users,
    jtbd: p.jtbd ?? [],
    hypotheses: p.hypotheses ?? [],
    mvp_in: p.mvp_in ?? [],
    mvp_later: p.mvp_later ?? [],
    current_status: p.current_status,
    exec_snapshot: p.exec_snapshot ?? [],
    decision_criteria: p.decision_criteria ?? [],
    rd_timeline: p.rd_timeline ?? [],
    rd_enablers: p.rd_enablers ?? [],
    rd_frictions: p.rd_frictions ?? [],
    rd_takeaways: p.rd_takeaways,
    ipod_thesis: p.ipod_thesis,
    ipod_levers: p.ipod_levers ?? [],
    ipod_kpis: p.ipod_kpis ?? [],
    ipod_insight: p.ipod_insight,
    pm_persona: p.pm_persona ?? [],
  }));
}
