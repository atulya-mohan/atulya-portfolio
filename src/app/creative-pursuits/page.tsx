import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowUpRight, Music, Camera } from 'lucide-react';
import React from 'react';

export const metadata: Metadata = {
  title: 'Creative Pursuits',
  description:
    'Creative work by Atulya Mohan — music production, photography, and artistic explorations.',
};

import { getPhotos } from '@/lib/data/getPhotos';
import { getMusicCoverUrl } from '@/lib/data/getMusicProjects';

type Category = {
  name: string;
  href: string;
  description: string;
  icon: typeof Music;
  image: string | null;
};

export default function CreativePage() {
  const photos = getPhotos();
  const musicCover = getMusicCoverUrl();

  const categories: Category[] = [
    {
      name: 'Music',
      href: '/creative-pursuits/music',
      description: 'Compositions, performances, and sound design.',
      icon: Music,
      image: musicCover,
    },
    {
      name: 'Photography',
      href: '/creative-pursuits/photography',
      description: 'Exploring moments through the lens.',
      icon: Camera,
      image: photos[0]?.imageUrl ?? null,
    },
  ];

  return (
    <div className="min-h-screen md:fixed md:inset-0 md:h-full md:w-full md:overflow-hidden bg-[var(--background)] text-[var(--foreground)]">
      {/* ===== DESKTOP LAYOUT ===== */}
      <section className="hidden md:block px-4 h-full" style={{ '--gap': '12px', '--gutter': '22px' } as React.CSSProperties}>
        <div className="pt-[calc(var(--nav-h)+var(--gap))] pb-[var(--gap)] h-full flex flex-col">
          <div className="mb-3 flex-shrink-0">
            <h1 className="font-header text-3xl uppercase text-[var(--foreground)]">Creative Pursuits</h1>
          </div>

          <div className="grid flex-1 min-h-0 grid-cols-2 gap-[var(--gap)]">
            {categories.map((category) => (
              <Link key={category.name} href={category.href} className="group block border border-[var(--border)] p-4 bg-[var(--background)] transition-[transform,border-color] hover:border-[var(--accent)] active:scale-[0.96]">
                <div className="flex flex-col h-full">
                  <div className="flex justify-between items-start mb-3">
                    <h2 className="font-header text-3xl uppercase text-[var(--foreground)]">{category.name}</h2>
                    <ArrowUpRight className="h-5 w-5 text-[var(--muted)] group-hover:text-[var(--accent)] transition-colors" />
                  </div>
                  <p className="font-body text-sm text-[var(--muted)] mb-4 flex-1">{category.description}</p>
                  <div className="aspect-video relative border border-[var(--border)] bg-zinc-200">
                    {(category.image && (category.image.startsWith('http') || category.image.startsWith('/'))) ? (
                      <Image src={category.image} alt={category.name} fill className="object-cover" sizes="50vw" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <category.icon className="w-12 h-12 text-[var(--muted)]" strokeWidth={1} />
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ===== MOBILE LAYOUT ===== */}
      <div className="md:hidden pt-20 pb-8 px-4 space-y-4">
        <h1 className="font-header text-2xl uppercase text-[var(--foreground)]">Creative Pursuits</h1>
        {categories.map((category) => (
          <Link key={category.name} href={category.href} className="group block border border-[var(--border)] p-4 bg-[var(--background)] transition-[transform,border-color] hover:border-[var(--accent)] active:scale-[0.96]">
            <div className="flex justify-between items-start mb-2">
              <h2 className="font-header text-2xl uppercase text-[var(--foreground)]">{category.name}</h2>
              <ArrowUpRight className="h-5 w-5 text-[var(--muted)] group-hover:text-[var(--accent)] transition-colors" />
            </div>
            <p className="font-body text-sm text-[var(--muted)] mb-3">{category.description}</p>
            <div className="aspect-video relative border border-[var(--border)] bg-zinc-200">
              {(category.image && (category.image.startsWith('http') || category.image.startsWith('/'))) ? (
                <Image src={category.image} alt={category.name} fill className="object-cover" sizes="100vw" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <category.icon className="w-12 h-12 text-[var(--muted)]" strokeWidth={1} />
                </div>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
