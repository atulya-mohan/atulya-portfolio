import type { Metadata } from 'next';
import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';
import Link from 'next/link';
import React from 'react';

export const metadata: Metadata = {
  title: 'Projects',
  description:
    'Explore projects in mechanical engineering, engineering management, and software design by Atulya Mohan.',
};

import type { MEProjectData, EMProjectData, SDProjectData } from '@/lib/types';
import meProjectsJson from '@/data/me-projects.json';
import emProjectsJson from '@/data/em-projects.json';
import sdProjectsJson from '@/data/sd-projects.json';

type Item = {
  id: string;
  title: string;
  blurb?: string | null;
  imageUrl?: string | null;
  href: string;
};

const meItems: Item[] = (meProjectsJson as MEProjectData[]).map(p => ({
  id: p.id, title: p.title, blurb: p.blurb, imageUrl: p.cover_image_url,
  href: `/projects/mechanical-engineering#${p.id}`,
}));

const emItems: Item[] = (emProjectsJson as EMProjectData[])
  .filter(p => !p.confidential)
  .map(p => ({
    id: p.id, title: p.title, blurb: p.blurb, imageUrl: p.cover_image_url,
    href: `/projects/engineering-management#${p.id}`,
  }));

const sdItems: Item[] = (sdProjectsJson as SDProjectData[]).map(p => ({
  id: p.id, title: p.title, blurb: p.blurb, imageUrl: p.cover_image_url,
  href: `/projects/software-design#${p.id}`,
}));

function RowScroller({ children, visible, gap = 16, overflow = false }: { children: React.ReactNode; visible: number; gap?: number; overflow?: boolean }) {
  // When the row has more cards than fit, narrow the columns so the next card
  // peeks past the right edge — a hard, on-brand scroll affordance. The peek
  // must exceed the inter-card gap to leave a visible sliver of the next card.
  const peek = overflow ? gap + 28 : 0;
  const colw = `calc((100% - ${peek}px - ${(visible - 1) * gap}px) / ${visible})`;
  return (
    <div className="mt-4 min-h-0 h-full">
      <div className="h-full overflow-x-auto overflow-y-hidden snap-x snap-mandatory page-scrollbar [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div className="grid h-full grid-flow-col auto-cols-[var(--colw)] gap-4" style={{ ['--colw' as any]: colw }}>
          {children}
        </div>
      </div>
    </div>
  );
}

export default function ProjectsPage() {
  return (
    <div className="min-h-screen md:fixed md:inset-0 md:h-full md:w-full md:overflow-auto bg-[var(--background)] text-[var(--foreground)]">
      <section
        className="px-4"
        style={{ '--gap': '12px', '--cols': 6, '--rows': 6, '--pad': '16px', '--tile': 'min(calc((100vw - (2 * var(--pad)) - ((var(--cols) - 1) * var(--gap))) / var(--cols)), calc((100dvh - var(--nav-h) - (2 * var(--gap)) - ((calc(var(--rows) - 1)) * var(--gap))) / var(--rows)))' } as React.CSSProperties}
      >
        <div className="pt-[calc(var(--nav-h)+var(--gap))] pb-[var(--gap)]">
          <div className="hidden md:grid h-[calc(100dvh-var(--nav-h)-2*var(--gap))] grid-cols-6 [grid-auto-rows:var(--tile)]" style={{ gap: 'var(--gap)' }}>
            <section className="project-me col-span-6 row-span-3 project-type-card">
              <div className="flex h-full min-h-0 flex-col bg-[var(--background)] p-4">
                <Header title="Mechanical Engineering" href="/projects/mechanical-engineering" count={meItems.length} />
                <RowScroller visible={4} overflow={meItems.length > 4}>
                  {meItems.map((it, i) => <ProjectCard key={`me-${i}`} item={it} showBlurb aspect="wide" />)}
                </RowScroller>
              </div>
            </section>

            <section className="project-em col-span-4 row-span-3 project-type-card">
              <div className="flex h-full min-h-0 flex-col bg-[var(--background)] p-4">
                <Header title="Engineering Management" href="/projects/engineering-management" count={emItems.length} />
                <RowScroller visible={3} overflow={emItems.length > 3}>
                  {emItems.map((it, i) => <ProjectCard key={`em-${i}`} item={it} showBlurb aspect="wide" />)}
                </RowScroller>
              </div>
            </section>

            <section className="project-sd col-span-2 row-span-3 project-type-card">
              <div className="flex h-full min-h-0 flex-col bg-[var(--background)] p-4">
                <Header title="Software Design" href="/projects/software-design" count={sdItems.length} />
                <RowScroller visible={1} overflow={sdItems.length > 1}>
                  {sdItems.map((it, i) => <ProjectCard key={`sd-${i}`} item={it} showBlurb aspect="wide" />)}
                </RowScroller>
              </div>
            </section>
          </div>

          <div className="md:hidden pt-4 space-y-5">
            <section className="project-me project-type-card">
              <div className="bg-[var(--background)] p-3">
                <Header title="Mechanical Engineering" href="/projects/mechanical-engineering" count={meItems.length} />
                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {meItems.map((it, i) => <ProjectCard key={`me-m-${i}`} item={it} showBlurb aspect="wide" />)}
                </div>
              </div>
            </section>
            <section className="project-em project-type-card">
              <div className="bg-[var(--background)] p-3">
                <Header title="Engineering Management" href="/projects/engineering-management" count={emItems.length} />
                <div className="mt-4 grid grid-cols-2 gap-4">
                  {emItems.slice(0, 2).map((it, i) => <ProjectCard key={`em-m-${i}`} item={it} showBlurb={false} aspect="tall" />)}
                </div>
              </div>
            </section>
            <section className="project-sd project-type-card">
              <div className="bg-[var(--background)] p-3">
                <Header title="Software Design" href="/projects/software-design" count={sdItems.length} />
                <div className="mt-4 grid grid-cols-2 gap-4">
                  {sdItems.slice(0, 2).map((it, i) => <ProjectCard key={`sd-m-${i}`} item={it} showBlurb={false} aspect="tall" />)}
                </div>
              </div>
            </section>
          </div>
        </div>
      </section>
    </div>
  );
}

function Header({ title, href, count }: { title: string; href: string; count?: number }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <h2 className="font-header text-3xl uppercase leading-none text-[var(--foreground)]">{title}</h2>
      <div className="flex shrink-0 items-center gap-3">
        {typeof count === 'number' && count > 0 && (
          <span className="hidden whitespace-nowrap font-mono text-[11px] uppercase tracking-wide tabular-nums text-[var(--muted)] sm:inline">
            {count} {count === 1 ? 'Project' : 'Projects'}
          </span>
        )}
        <Link href={href} aria-label={`Open all ${title}`} className="icon-pop relative border border-[var(--border)] bg-transparent p-1.5 text-[var(--foreground)] transition-colors after:absolute after:left-1/2 after:top-1/2 after:h-10 after:w-10 after:-translate-x-1/2 after:-translate-y-1/2 after:content-[''] hover:border-[var(--project-accent,var(--accent))] hover:bg-[var(--project-accent,var(--accent))] hover:text-white">
          <ArrowUpRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}

function ProjectCard({ item, showBlurb = false, aspect = 'wide' }: { item: Item; showBlurb?: boolean; aspect?: 'wide' | 'tall' }) {
  const aspectClass = aspect === 'wide' ? 'aspect-[16/9]' : 'aspect-[4/3]';
  const wantsFillHeight = !showBlurb;
  const mediaWrapperClass = wantsFillHeight ? 'h-full' : aspectClass;

  return (
    <Link href={item.href || '#'} className="group card-interactive flex min-h-0 h-full flex-col overflow-hidden active:scale-[0.96] transition-transform">
      <div className={`${mediaWrapperClass} w-full`}>
        <div className="img-outline relative h-full w-full overflow-hidden bg-zinc-200">
          <div className="pointer-events-none absolute left-0 top-0 z-10 max-w-[calc(100%-2.5rem)] bg-[var(--foreground)] px-2 py-0.5">
            <span className="block truncate font-mono text-[11px] font-medium text-[var(--background)]">{item.title}</span>
          </div>
          {/* "Open" affordance — slides in on hover, tinted with the discipline accent */}
          <div className="pointer-events-none absolute bottom-0 right-0 z-10 flex h-8 w-8 translate-y-2 items-center justify-center bg-[var(--project-accent,var(--accent))] text-white opacity-0 transition-all duration-200 ease-out group-hover:translate-y-0 group-hover:opacity-100">
            <ArrowUpRight className="h-4 w-4" />
          </div>
          {(item.imageUrl && (item.imageUrl.startsWith('http') || item.imageUrl.startsWith('/'))) ? (
            <Image src={item.imageUrl} alt={item.title} fill className="object-cover transition-transform duration-500 ease-out group-hover:scale-105" sizes="(max-width: 768px) 50vw, 33vw" />
          ) : null}
        </div>
      </div>
      {showBlurb && (
        <div className="p-3">
          <p className="line-clamp-2 font-body text-xs leading-relaxed text-[var(--muted)]">{item.blurb || 'No summary available.'}</p>
        </div>
      )}
    </Link>
  );
}
