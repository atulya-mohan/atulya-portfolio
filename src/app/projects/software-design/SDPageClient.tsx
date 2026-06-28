'use client';

import Image from 'next/image';
import React, { useState, useEffect, useMemo } from 'react';
import { ChevronLeft, ChevronRight, ArrowUpRight } from 'lucide-react';
import type { SDProject } from '@/lib/projects/getSDProjectsData';

export default function SDPageClient({ projects }: { projects: SDProject[] }) {
  const [i, setI] = useState(0);
  const [phoneSlide, setPhoneSlide] = useState(0);
  const [hashNotFound, setHashNotFound] = useState<string | null>(null);

  const cssVars = useMemo(
    () => ({ '--gap': '12px', '--inner-gap': '8px', '--gutter': '22px' }) as React.CSSProperties,
    []
  );

  // Deep-link: select the project matching the URL hash
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

  // Reset phone slide when project changes
  useEffect(() => { setPhoneSlide(0); }, [i]);

  const project = projects[i];

  if (!projects.length || !project) {
    return (
      <div className="fixed inset-0 h-full w-full overflow-hidden flex items-center justify-center bg-[var(--background)] text-[var(--foreground)]">
        <p className="font-mono">No project found.</p>
      </div>
    );
  }

  const numImages = project.images?.length || 0;
  const goPhoneSlide = (dir: -1 | 1) => () => {
    if (numImages <= 1) return;
    setPhoneSlide((s) => (s + dir + numImages) % numImages);
  };

  return (
    <div className="project-sd min-h-screen md:fixed md:inset-0 md:h-full md:w-full md:overflow-hidden bg-[var(--background)] text-[var(--foreground)]">
      {hashNotFound && (
        <div className="fixed top-[calc(var(--nav-h)+8px)] left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 border border-[var(--accent)] bg-[var(--background)] px-4 py-2 shadow-lg">
          <p className="font-mono text-xs text-[var(--foreground)]">
            Project <span className="font-bold">&ldquo;{hashNotFound}&rdquo;</span> not found
          </p>
          <button onClick={() => { setHashNotFound(null); window.history.replaceState(null, '', window.location.pathname); }} className="font-mono text-xs text-[var(--accent)] hover:underline btn-press">&times; dismiss</button>
        </div>
      )}
      {/* ===== DESKTOP LAYOUT ===== */}
      <section className="hidden md:block px-4 h-full" style={cssVars}>
        <div className="pt-[calc(var(--nav-h)+var(--gap))] pb-[var(--gap)] h-full flex flex-col">
          <div className="mb-3 flex-shrink-0">
            <h1 className="font-header text-3xl uppercase text-[var(--foreground)]">
              <span className="opacity-60">Projects ›</span> Software Design
            </h1>
          </div>

          <div className="grid flex-1 min-h-0 grid-cols-3 gap-[var(--gap)]">
            {/* LEFT — identity (fixed) + scrollable detail */}
            <div className="col-span-2 flex min-h-0 flex-col gap-[var(--gap)]">
              <div className="project-type-card flex-shrink-0 bg-[var(--background)] p-4">
                <div className="mb-2 flex flex-wrap items-center gap-2">
                  {project.techStack.map(tech => <Badge key={tech} label={tech} />)}
                  {project.status && <Badge label={project.status} />}
                </div>
                <h2 className="mb-2 font-header text-3xl uppercase text-[var(--foreground)]">{project.title}</h2>
                <p className="font-body text-sm text-[var(--foreground)]">{project.blurb}</p>
                <div className="mt-3">
                  <h4 className="mb-1.5 font-mono text-xs font-bold uppercase tracking-wide text-[var(--foreground)]">Links</h4>
                  <ProjectLinks links={project.links} />
                </div>
              </div>

              <div className="card flex-1 min-h-0 space-y-4 overflow-y-auto page-scrollbar bg-[var(--background)] p-4">
                <DetailBlock title="Problem">{project.problem}</DetailBlock>
                <DetailBlock title="Solution">{project.solution}</DetailBlock>
                <div>
                  <h4 className="mb-1.5 font-mono text-sm font-bold uppercase tracking-wide text-[var(--foreground)]">Key Features</h4>
                  <ul className="list-inside list-disc space-y-1 font-body text-sm text-[var(--muted)]">
                    {project.keyFeatures.map(feature => <li key={feature}>{feature}</li>)}
                  </ul>
                </div>
              </div>
            </div>

            {/* RIGHT — device showcase (responsive height, scales to fit any viewport) */}
            <div className="card col-span-1 flex min-h-0 flex-col bg-[var(--background)] p-3">
              <div className="relative flex w-full flex-1 min-h-0 items-center justify-center">
                {numImages > 1 && (
                  <button onClick={goPhoneSlide(-1)} className="icon-pop absolute left-2 top-1/2 z-20 flex min-h-10 min-w-10 -translate-y-1/2 items-center justify-center bg-black/50 p-2 text-white transition-colors hover:bg-[var(--project-accent)]" aria-label="Previous screen">
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                )}
                <div className="mx-auto flex aspect-[208/448] h-full max-h-[34rem] flex-col rounded-xl border-2 border-zinc-800 bg-black p-2 shadow-lg">
                  <div className="mx-auto mb-1 h-2 w-10 flex-shrink-0 rounded-full bg-zinc-800" />
                  <div className="relative min-h-0 w-full flex-1 overflow-hidden rounded-md bg-[var(--card-bg)]">
                    {project.images[phoneSlide]?.src && (
                      <Image key={`phone-${phoneSlide}`} src={project.images[phoneSlide].src} alt={project.images[phoneSlide].label || 'Project screenshot'} fill className="object-cover" sizes="320px" priority={phoneSlide === 0} />
                    )}
                  </div>
                  <div className="h-6 flex-shrink-0 pt-1 text-center">
                    <span className="font-mono text-[10px] font-medium text-white">{project.images[phoneSlide]?.label || 'Screen'}</span>
                  </div>
                </div>
                {numImages > 1 && (
                  <button onClick={goPhoneSlide(1)} className="icon-pop absolute right-2 top-1/2 z-20 flex min-h-10 min-w-10 -translate-y-1/2 items-center justify-center bg-black/50 p-2 text-white transition-colors hover:bg-[var(--project-accent)]" aria-label="Next screen">
                    <ChevronRight className="h-5 w-5" />
                  </button>
                )}
              </div>
              {numImages > 1 && (
                <div className="flex flex-shrink-0 items-center justify-center gap-1.5 pt-3">
                  {project.images.map((_, idx) => (
                    <span key={idx} className={`h-1.5 w-1.5 rounded-full ${idx === phoneSlide ? 'bg-[var(--foreground)]' : 'bg-[var(--foreground)]/30'}`} />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Project selector (shown when multiple projects exist) */}
          {projects.length > 1 && (
            <div className="mt-3 flex-shrink-0">
              <div className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {projects.map((p, idx) => (
                  <button
                    key={p.id}
                    onClick={() => setI(idx)}
                    className={
                      'whitespace-nowrap shrink-0 px-3 py-1.5 font-mono text-xs border transition-[border-color,color,transform] active:scale-[0.96] ' +
                      (idx === i ? 'border-[var(--project-accent)] text-[var(--foreground)]' : 'border-[var(--border-light)] text-[var(--muted)] hover:border-[var(--border)]')
                    }
                  >
                    {p.title}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ===== MOBILE LAYOUT ===== */}
      <div className="md:hidden pt-20 pb-8 px-4 space-y-4">
        <h1 className="font-header text-2xl uppercase text-[var(--foreground)]">
          <span className="opacity-60">Projects ›</span> Software Design
        </h1>

        {/* Project selector (shown when multiple projects exist) */}
        {projects.length > 1 && (
          <div className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {projects.map((p, idx) => (
              <button
                key={p.id}
                onClick={() => setI(idx)}
                className={
                  'whitespace-nowrap shrink-0 px-3 py-1.5 font-mono text-xs border transition-[border-color,color,transform] active:scale-[0.96] ' +
                  (idx === i ? 'border-[var(--project-accent)] text-[var(--foreground)]' : 'border-[var(--border-light)] text-[var(--muted)]')
                }
              >
                {p.title}
              </button>
            ))}
          </div>
        )}

        {/* Phone mockup */}
        <div className="flex items-center justify-center py-4">
          <div className="relative">
            {numImages > 1 && (
              <button onClick={goPhoneSlide(-1)} className="absolute -left-10 top-1/2 -translate-y-1/2 flex min-h-10 min-w-10 items-center justify-center bg-black/50 p-1.5 text-white z-20 icon-pop" aria-label="Previous screen">
                <ChevronLeft className="h-4 w-4" />
              </button>
            )}
            <div className="w-44 h-[22rem] bg-black rounded-xl border-2 border-zinc-800 p-2 flex flex-col shadow-lg">
              <div className="w-8 h-1.5 bg-zinc-800 rounded-full mx-auto mb-1 flex-shrink-0"></div>
              <div className="relative w-full h-full bg-[var(--card-bg)] rounded-md overflow-hidden">
                {project.images[phoneSlide]?.src && (
                  <Image key={`m-phone-${phoneSlide}`} src={project.images[phoneSlide].src} alt={project.images[phoneSlide].label || 'Project screenshot'} fill className="object-cover" sizes="176px" />
                )}
              </div>
              <div className="h-5 flex-shrink-0 pt-0.5 text-center">
                <span className="text-[9px] font-mono font-medium text-white">{project.images[phoneSlide]?.label || 'Screen'}</span>
              </div>
            </div>
            {numImages > 1 && (
              <button onClick={goPhoneSlide(1)} className="absolute -right-10 top-1/2 -translate-y-1/2 flex min-h-10 min-w-10 items-center justify-center bg-black/50 p-1.5 text-white z-20 icon-pop" aria-label="Next screen">
                <ChevronRight className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
        {numImages > 1 && (
          <div className="flex items-center justify-center gap-1.5">
            {project.images.map((_, idx) => (
              <span key={idx} className={`h-1.5 w-1.5 rounded-full ${idx === phoneSlide ? 'bg-[var(--foreground)]' : 'bg-[var(--foreground)]/30'}`} />
            ))}
          </div>
        )}

        {/* Project info */}
        <div className="card p-4">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            {project.techStack.map(tech => <Badge key={tech} label={tech} />)}
            {project.status && <Badge label={project.status} />}
          </div>
          <h2 className="font-header text-2xl uppercase text-[var(--foreground)] mb-2">{project.title}</h2>
          <p className="font-body text-sm text-[var(--foreground)]">{project.blurb}</p>
          <div className="mt-3 pt-3 border-t border-[var(--border-light)]">
            <ProjectLinks links={project.links} />
          </div>
        </div>

        <InfoSection title="Problem"><p className="text-sm">{project.problem}</p></InfoSection>
        <InfoSection title="Solution"><p className="text-sm">{project.solution}</p></InfoSection>
        <InfoSection title="Key Features">
          <ul className="list-disc list-inside space-y-1 text-sm">{project.keyFeatures.map(feature => <li key={feature}>{feature}</li>)}</ul>
        </InfoSection>
      </div>
    </div>
  );
}

function InfoSection({ title, children, className = "" }: { title: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={`card bg-[var(--background)] p-3 ${className} flex flex-col min-h-0`}>
      <h4 className="font-mono text-sm font-bold text-[var(--foreground)] mb-2 uppercase tracking-wide flex-shrink-0">{title}</h4>
      <div className="font-body text-sm text-[var(--muted)] flex-1 min-h-0">{children}</div>
    </div>
  );
}

function Badge({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center border border-[var(--border-light)] bg-transparent px-2 py-1 text-xs font-mono font-bold text-[var(--foreground)]">{label}</span>
  );
}

function DetailBlock({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h4 className="mb-1.5 font-mono text-sm font-bold uppercase tracking-wide text-[var(--foreground)]">{title}</h4>
      <p className="font-body text-sm text-[var(--muted)]">{children}</p>
    </div>
  );
}

function ProjectLinks({ links }: { links: SDProject['links'] }) {
  const isUrl = (u?: string | null) => !!u && /^https?:\/\//.test(u);
  const items: { label: string; href: string }[] = [];
  if (isUrl(links?.figma)) items.push({ label: 'Figma', href: links!.figma! });
  if (isUrl(links?.live)) items.push({ label: 'Landing Page', href: links!.live! });
  if (isUrl(links?.github)) items.push({ label: 'GitHub', href: links!.github! });
  return (
    <div className="flex flex-wrap items-center gap-2">
      {items.map(it => (
        <a key={it.label} href={it.href} target="_blank" rel="noopener noreferrer" className="icon-pop inline-flex items-center gap-1.5 border border-[var(--border)] px-2.5 py-1.5 font-mono text-[11px] font-medium uppercase tracking-wide text-[var(--foreground)] transition-colors active:scale-[0.96] hover:border-[var(--project-accent)] hover:bg-[var(--project-accent)] hover:text-white">
          {it.label} <ArrowUpRight className="h-3.5 w-3.5" />
        </a>
      ))}
      {!isUrl(links?.github) && (
        <span className="inline-flex items-center border border-[var(--border-light)] px-2.5 py-1.5 font-mono text-[11px] uppercase tracking-wide text-[var(--muted)]">GitHub Private</span>
      )}
    </div>
  );
}
