'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, ArrowUpRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import type { MEProject } from '@/lib/projects/getMEProjectsData';

export default function ExpandedMEClient({ projects }: { projects: MEProject[] }) {
  const [i, setI] = useState(0);
  const [slide, setSlide] = useState(0);
  const [hashNotFound, setHashNotFound] = useState<string | null>(null);

  // Deep-link: select the project matching the URL hash (e.g. #project-id)
  useEffect(() => {
    const hash = window.location.hash.slice(1);
    if (hash) {
      const idx = projects.findIndex(p => p.id === hash);
      if (idx >= 0) { setI(idx); setHashNotFound(null); }
      else setHashNotFound(hash);
    }
  }, [projects]);

  // Update hash when selection changes
  useEffect(() => {
    if (projects[i]) {
      window.history.replaceState(null, '', `#${projects[i].id}`);
    }
  }, [i, projects]);

  useEffect(() => { setSlide(0); }, [i]);

  const cur = projects[i];
  const numImages = cur?.images?.length || 0;

  const goSlide = (dir: -1 | 1) => () => {
    if (!cur || numImages <= 1) return;
    setSlide((s) => (s + dir + numImages) % numImages);
  };

  if (!projects.length || !cur) {
    return (
      <div className="fixed inset-0 h-full w-full overflow-hidden flex items-center justify-center bg-[var(--background)] text-[var(--foreground)]">
        <p className="font-mono">No projects found.</p>
      </div>
    );
  }

  return (
    <div className="project-me min-h-screen md:fixed md:inset-0 md:h-full md:w-full md:overflow-hidden bg-[var(--background)] text-[var(--foreground)]">
      {hashNotFound && (
        <div className="fixed top-[calc(var(--nav-h)+8px)] left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 border border-[var(--accent)] bg-[var(--background)] px-4 py-2 shadow-lg">
          <p className="font-mono text-xs text-[var(--foreground)]">
            Project <span className="font-bold">&ldquo;{hashNotFound}&rdquo;</span> not found
          </p>
          <button onClick={() => { setHashNotFound(null); window.history.replaceState(null, '', window.location.pathname); }} className="font-mono text-xs text-[var(--accent)] hover:underline">&times; dismiss</button>
        </div>
      )}
      {/* ===== DESKTOP LAYOUT ===== */}
      <section
        className="hidden md:block px-4"
        style={{ '--gap': '12px', '--gutter': '22px' } as React.CSSProperties}
      >
        <div className="pt-[calc(var(--nav-h)+var(--gap))] pb-[var(--gap)] h-[calc(100dvh)] flex flex-col">
          <div className="mb-3 flex-shrink-0">
            <h1 className="font-header text-3xl uppercase text-[var(--foreground)]">
              <span className="opacity-60">Projects ›</span> Mechanical Engineering
            </h1>
          </div>

          <div className="relative flex-1 min-h-0">
            <div className="project-type-card grid h-full min-w-0 grid-rows-12 gap-3 bg-[var(--background)] p-4">
              <div className="row-span-1 flex items-center justify-between">
                <h2 className="font-header text-2xl uppercase text-[var(--foreground)]">{cur.title}</h2>
                <Link
                  href={`/projects/mechanical-engineering#${cur.id}`}
                  aria-label="Open project details"
                  className="icon-pop relative border border-[var(--border)] bg-transparent p-1.5 text-[var(--foreground)] transition-colors after:absolute after:left-1/2 after:top-1/2 after:h-10 after:w-10 after:-translate-x-1/2 after:-translate-y-1/2 after:content-[''] hover:bg-[var(--project-accent)] hover:text-white"
                >
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </div>

              <div className="row-span-8 grid min-h-0 grid-cols-2 gap-3">
                <div className="flex min-h-0 flex-col card p-4">
                  <div className="mb-3 flex flex-wrap gap-2">
                    <Pill label="Role" value={cur.role} />
                    <Pill label="Year" value={cur.year} />
                    <Pill label="Type" value={cur.type} />
                  </div>
                  <div className="relative min-h-0 flex-1 overflow-y-auto overflow-x-hidden pr-1 vertical-scrollbar">
                    <p className="font-body leading-relaxed text-[var(--foreground)] text-sm mr-1">{cur.blurb}</p>
                  </div>
                </div>

                <div className="relative min-h-0 card bg-zinc-200">
                  <div className="relative h-full w-full overflow-hidden">
                    {cur.images && cur.images[slide] && (
                      <Image
                        key={`${i}-${slide}`}
                        src={cur.images[slide]}
                        alt={`${cur.title} image ${slide + 1}`}
                        fill
                        className="object-contain"
                        sizes="50vw"
                        priority={slide === 0}
                      />
                    )}
                    <div className="pointer-events-none absolute left-0 top-0 z-10 bg-[var(--foreground)] px-2 py-0.5">
                      <span className="font-mono text-[11px] font-medium text-[var(--background)]">{cur.title}</span>
                    </div>
                    {numImages > 1 && (
                      <>
                        <button onClick={goSlide(-1)} className="icon-pop absolute left-2 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center bg-black/50 text-white transition-colors hover:bg-[var(--project-accent)]" aria-label="Previous image">
                          <ChevronLeft className="h-5 w-5" />
                        </button>
                        <button onClick={goSlide(1)} className="icon-pop absolute right-2 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center bg-black/50 text-white transition-colors hover:bg-[var(--project-accent)]" aria-label="Next image">
                          <ChevronRight className="h-5 w-5" />
                        </button>
                      </>
                    )}
                    {numImages > 1 && (
                      <div className="absolute bottom-2 left-1/2 z-10 -translate-x-1/2">
                        <div className="flex items-center gap-1.5 rounded-full bg-black/60 px-2 py-1">
                          {cur.images.map((_, n) => (
                            <span key={n} className={'h-1.5 w-1.5 rounded-full ' + (n === slide ? 'bg-white' : 'bg-white/40')} />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="row-span-3 min-w-0 overflow-hidden">
                <div className="h-full w-full overflow-x-auto overflow-y-hidden scroll-smooth horizontal-scrollbar" aria-label="More Mechanical Engineering projects">
                  <div className="inline-flex h-full gap-3 pr-1">
                    {projects.map((p, idx) => (
                      <button
                        key={p.id}
                        onClick={() => setI(idx)}
                        className={
                          'group relative h-full w-[240px] shrink-0 overflow-hidden border bg-zinc-200 transition-[border-color,transform] active:scale-[0.98] ' +
                          (idx === i ? 'border-[var(--project-accent)] border-2' : 'border-[var(--border-light)] hover:border-[var(--border)]')
                        }
                        title={p.title}
                      >
                        <div className="relative h-full w-full">
                          {p.images && p.images[0] && (
                            <Image src={p.images[0]} alt={p.title} fill className="object-cover transition-transform duration-500 ease-out group-hover:scale-105" sizes="240px" />
                          )}
                          <div className="pointer-events-none absolute left-0 top-0 bg-black/80 px-2 py-0.5">
                            <span className="font-mono text-[11px] font-medium text-white">{p.title}</span>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== MOBILE LAYOUT ===== */}
      <div className="md:hidden pt-20 pb-8 px-4">
        <h1 className="font-header text-2xl uppercase text-[var(--foreground)] mb-4">
          <span className="opacity-60">Projects ›</span> Mechanical Engineering
        </h1>

        {/* Project selector */}
        <div className="flex gap-2 overflow-x-auto pb-3 mb-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {projects.map((p, idx) => (
            <button
              key={p.id}
              onClick={() => setI(idx)}
              className={
                'whitespace-nowrap shrink-0 px-3 py-1.5 font-mono text-xs border transition-[color,border-color,transform] active:scale-[0.96] ' +
                (idx === i ? 'border-[var(--project-accent)] text-[var(--foreground)]' : 'border-[var(--border-light)] text-[var(--muted)]')
              }
            >
              {p.title}
            </button>
          ))}
        </div>

        {/* Current project */}
        <div className="space-y-4">
          {/* Image */}
          <div className="relative aspect-[4/3] w-full card bg-zinc-200 overflow-hidden">
            {cur.images && cur.images[slide] && (
              <Image
                key={`mobile-${i}-${slide}`}
                src={cur.images[slide]}
                alt={`${cur.title} image ${slide + 1}`}
                fill
                className="object-contain"
                sizes="100vw"
                priority={slide === 0}
              />
            )}
            {numImages > 1 && (
              <>
                <button onClick={goSlide(-1)} className="icon-pop absolute left-2 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center bg-black/50 text-white" aria-label="Previous image">
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button onClick={goSlide(1)} className="icon-pop absolute right-2 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center bg-black/50 text-white" aria-label="Next image">
                  <ChevronRight className="h-4 w-4" />
                </button>
              </>
            )}
            {numImages > 1 && (
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2">
                <div className="flex items-center gap-1.5 rounded-full bg-black/60 px-2 py-1">
                  {cur.images.map((_, n) => (
                    <span key={n} className={'h-1.5 w-1.5 rounded-full ' + (n === slide ? 'bg-white' : 'bg-white/40')} />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Details */}
          <div className="card p-4">
            <h2 className="font-header text-xl uppercase text-[var(--foreground)] mb-3">{cur.title}</h2>
            <div className="flex flex-wrap gap-2 mb-3">
              <Pill label="Role" value={cur.role} />
              <Pill label="Year" value={cur.year} />
              <Pill label="Type" value={cur.type} />
            </div>
            <p className="font-body leading-relaxed text-[var(--foreground)] text-sm">{cur.blurb}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Pill({ label, value }: { label: string; value: string }) {
  if (!value) return null;
  return (
    <span className="inline-flex items-center gap-1 border border-[var(--border-light)] bg-transparent px-2 py-1 text-xs font-mono text-[var(--foreground)]">
      <span className="opacity-70">{label}:</span>
      <span className="font-bold">{value}</span>
    </span>
  );
}
