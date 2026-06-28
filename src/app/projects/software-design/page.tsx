import type { Metadata } from 'next';
import { getAllSDProjects } from '@/lib/projects/getSDProjectsData';
import SDPageClient from './SDPageClient';

export const metadata: Metadata = {
  title: 'Software Design Projects',
  description:
    'Software design projects by Atulya Mohan — full-stack development, UI/UX design, and web applications.',
};

export default function SoftwareDesignPage() {
  const projects = getAllSDProjects();
  return <SDPageClient projects={projects} />;
}
