import type { Metadata } from 'next';
import { getEMProjectsData } from '@/lib/projects/getEMProjectsData';
import ExpandedEMClient from './ExpandedEMClient';

export const metadata: Metadata = {
  title: 'Engineering Management Projects',
  description:
    'Engineering management projects by Atulya Mohan — product strategy, roadmaps, and team leadership at Carnegie Mellon.',
};

export default function ExpandedEM() {
  const projects = getEMProjectsData();
  return <ExpandedEMClient projects={projects} />;
}
