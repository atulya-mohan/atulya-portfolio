import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Music',
  description:
    'Music compositions, performances, and sound design by Atulya Mohan.',
};

export default function MusicLayout({ children }: { children: React.ReactNode }) {
  return children;
}
