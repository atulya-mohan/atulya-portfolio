'use client';

import Image from 'next/image';
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { Photo } from '@/lib/data/getPhotos';

export default function PhotographyClient({ photos }: { photos: Photo[] }) {
  const [i, setI] = useState(0);
  const numPhotos = photos.length;
  const cur = photos[i];

  const cssVars = useMemo(
    () => ({ '--gap': '12px', '--gutter': '22px' }) as React.CSSProperties,
    []
  );

  const goPhoto = useCallback((dir: -1 | 1) => () => {
    if (numPhotos <= 1) return;
    setI((prev) => (prev + dir + numPhotos) % numPhotos);
  }, [numPhotos]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') goPhoto(-1)();
      else if (e.key === 'ArrowRight') goPhoto(1)();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [goPhoto]);

  if (!photos.length || !cur) {
    return (
      <div className="fixed inset-0 h-full w-full flex items-center justify-center bg-[var(--background)] text-[var(--foreground)]">
        <p className="font-mono">No photos found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen md:fixed md:inset-0 md:h-full md:w-full md:overflow-hidden bg-[var(--background)] text-[var(--foreground)]">
      {/* ===== DESKTOP LAYOUT ===== */}
      <section className="hidden md:block px-4 h-full" style={cssVars}>
        <div className="pt-[calc(var(--nav-h)+var(--gap))] pb-[var(--gap)] h-full flex flex-col">
          <div className="mb-3 flex-shrink-0">
            <h1 className="font-header text-3xl uppercase text-[var(--foreground)]">
              <span className="opacity-60">Creative ›</span> Photography
            </h1>
          </div>

          <div className="relative flex-1 min-h-0 flex flex-col gap-3">
            <div className="grid flex-1 min-h-0 grid-cols-3 gap-3 border border-[var(--border)] bg-[var(--background)] p-4">
              <div className="col-span-2 relative border border-[var(--border)] bg-black">
                {cur.imageUrl && (
                  <Image key={cur.id} src={cur.imageUrl} alt={cur.title} fill className="object-contain" sizes="66vw" priority quality={75} />
                )}
                {numPhotos > 1 && (
                  <>
                    <button onClick={goPhoto(-1)} className="btn-press absolute left-3 top-1/2 -translate-y-1/2 bg-black/50 p-2 text-white transition-colors hover:bg-[var(--accent)] z-10" aria-label="Previous Photo"><ChevronLeft className="h-6 w-6" /></button>
                    <button onClick={goPhoto(1)} className="btn-press absolute right-3 top-1/2 -translate-y-1/2 bg-black/50 p-2 text-white transition-colors hover:bg-[var(--accent)] z-10" aria-label="Next Photo"><ChevronRight className="h-6 w-6" /></button>
                  </>
                )}
              </div>

              <div className="col-span-1 flex flex-col border border-[var(--border)] p-3 gap-3 overflow-y-auto vertical-scrollbar">
                <h2 className="font-header text-2xl uppercase text-[var(--foreground)] flex-shrink-0">{cur.title}</h2>
                {(cur.year || cur.location) && (
                  <div className="flex flex-wrap gap-x-3 gap-y-1 flex-shrink-0">
                    {cur.year && <Pill label="Year" value={cur.year} />}
                    {cur.location && <Pill label="Location" value={cur.location} />}
                  </div>
                )}
                <p className="font-body text-sm text-[var(--muted)] flex-1 min-h-0">{cur.description || 'No description available.'}</p>
              </div>
            </div>

            <div className="flex-shrink-0 h-28 flex flex-col">
              <h3 className="font-header text-xl uppercase text-[var(--foreground)] mb-2 flex-shrink-0">Gallery</h3>
              <div className="flex-1 min-h-0 flex items-center overflow-x-auto overflow-y-hidden scroll-smooth horizontal-scrollbar border border-[var(--border)] p-2 bg-[var(--background)]">
                <div className="inline-flex items-center gap-3 pr-1 h-full">
                  {photos.map((p, idx) => {
                    const active = idx === i;
                    return (
                      <button
                        key={p.id}
                        onClick={() => setI(idx)}
                        className={`btn-press relative h-full aspect-square shrink-0 overflow-hidden border bg-zinc-200 transition ${active ? 'border-4 border-[var(--accent)]' : 'border border-[var(--border-light)] hover:border-[var(--border)]'}`}
                        title={p.title}
                      >
                        {p.imageUrl && <Image src={p.imageUrl} alt={p.title} fill className="object-cover" sizes="80px" quality={60} />}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== MOBILE LAYOUT ===== */}
      <div className="md:hidden pt-20 pb-8 px-4 space-y-4">
        <h1 className="font-header text-2xl uppercase text-[var(--foreground)]">
          <span className="opacity-60">Creative ›</span> Photography
        </h1>

        {/* Current photo */}
        <div className="relative aspect-[4/3] w-full border border-[var(--border)] bg-black overflow-hidden">
          {cur.imageUrl && (
            <Image key={`m-${cur.id}`} src={cur.imageUrl} alt={cur.title} fill className="object-contain" sizes="100vw" priority quality={75} />
          )}
          {numPhotos > 1 && (
            <>
              <button onClick={goPhoto(-1)} className="btn-press absolute left-2 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center bg-black/50 text-white z-10" aria-label="Previous Photo"><ChevronLeft className="h-5 w-5" /></button>
              <button onClick={goPhoto(1)} className="btn-press absolute right-2 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center bg-black/50 text-white z-10" aria-label="Next Photo"><ChevronRight className="h-5 w-5" /></button>
            </>
          )}
        </div>

        {/* Info */}
        <div className="border border-[var(--border)] p-4">
          <h2 className="font-header text-xl uppercase text-[var(--foreground)] mb-2">{cur.title}</h2>
          {(cur.year || cur.location) && (
            <div className="flex flex-wrap gap-2 mb-2">
              {cur.year && <Pill label="Year" value={cur.year} />}
              {cur.location && <Pill label="Location" value={cur.location} />}
            </div>
          )}
          <p className="font-body text-sm text-[var(--muted)]">{cur.description || 'No description available.'}</p>
        </div>

        {/* Thumbnail gallery */}
        <div>
          <h3 className="font-header text-lg uppercase text-[var(--foreground)] mb-2">Gallery</h3>
          <div className="flex gap-2 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {photos.map((p, idx) => {
              const active = idx === i;
              return (
                <button
                  key={p.id}
                  onClick={() => setI(idx)}
                  className={`btn-press relative h-16 w-16 shrink-0 overflow-hidden border bg-zinc-200 transition ${active ? 'border-2 border-[var(--accent)]' : 'border border-[var(--border-light)]'}`}
                  title={p.title}
                >
                  {p.imageUrl && <Image src={p.imageUrl} alt={p.title} fill className="object-cover" sizes="64px" quality={50} />}
                </button>
              );
            })}
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
