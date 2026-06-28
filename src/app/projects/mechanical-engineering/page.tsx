import type { Metadata } from 'next';
import { getMEProjectsData } from '@/lib/projects/getMEProjectsData';
import ExpandedMEClient from './ExpandedMEClient';

export const metadata: Metadata = {
  title: 'Mechanical Engineering Projects',
  description:
    'Mechanical engineering projects by Atulya Mohan — design, prototyping, and hardware development.',
};

export default function ExpandedME() {
  const projects = getMEProjectsData();
  return <ExpandedMEClient projects={projects} />;
}
