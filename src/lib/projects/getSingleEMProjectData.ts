import { getEMProjectsData } from './getEMProjectsData';
import type { EMProject } from './getEMProjectsData';

export function getSingleEMProjectData(id: string): EMProject | null {
  const all = getEMProjectsData();
  return all.find(p => p.id === id) ?? null;
}
