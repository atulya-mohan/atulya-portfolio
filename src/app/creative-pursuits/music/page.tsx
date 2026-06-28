'use client';

import React, { useMemo } from 'react';
import { Disc, SlidersHorizontal } from 'lucide-react';

// Placeholder for inspirations
const INSPIRATIONS = [
    { name: 'Artists', items: ['Disclosure', 'Kaytranada', 'Fred again..', 'Channel Tres'] },
    { name: 'Genres', items: ['Deep House', 'UK Garage', 'Tech House', 'Disco House'] },
];


export default function MusicPage() {
    const cssVars = useMemo(
        () =>
          ({
            '--gap': '12px',
            '--gutter': '22px',
          }) as React.CSSProperties,
        []
      );

    // --- RENDER LOGIC ---
    // Simplified as there's no data to load/select initially

  return (
    <div className="min-h-screen md:fixed md:inset-0 md:h-full md:w-full md:overflow-hidden bg-[var(--background)] text-[var(--foreground)]">
      {/* ===== DESKTOP LAYOUT ===== */}
      <section className="hidden md:block px-4 h-full" style={cssVars}>
        <div className="pt-[calc(var(--nav-h)+var(--gap))] pb-[var(--gap)] h-full flex flex-col">
          <div className="mb-3 flex-shrink-0">
            <h1 className="font-header text-3xl uppercase text-[var(--foreground)]">
              <span className="opacity-60">Creative ›</span> Music
            </h1>
          </div>

          <div className="grid flex-1 min-h-0 grid-cols-3 grid-rows-3 gap-[var(--gap)]">
            <div className="col-span-2 row-span-1 card-elevated bg-[var(--background)] p-4 flex flex-col justify-between">
              <div>
                <h2 className="font-header text-3xl uppercase text-[var(--foreground)] mb-2">Sound Exploration</h2>
                <p className="font-body text-base text-[var(--foreground)] max-w-xl">
                  Currently exploring the world of DJing and house music production. This space will document the journey, featuring mixes and tracks as they develop.
                </p>
              </div>
              <span className="font-mono text-xs text-[var(--muted)] mt-auto">STATUS: LEARNING / EXPLORING</span>
            </div>

            <div className="col-span-1 row-span-1 card bg-[var(--background)] p-4 flex flex-col min-h-0">
              <h3 className="font-header text-xl uppercase text-[var(--foreground)] mb-2 flex-shrink-0">Inspirations</h3>
              <div className="flex-1 space-y-3 overflow-y-auto content-scrollbar pr-1">
                {INSPIRATIONS.map(section => (
                  <div key={section.name}>
                    <h4 className="font-mono text-sm font-bold text-[var(--foreground)] mb-1">{section.name}</h4>
                    <div className="flex flex-wrap gap-1">
                      {section.items.map(item => (
                        <Badge key={item} label={item} variant="small" />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="col-span-1 row-span-2 card bg-[var(--background)] p-4 flex flex-col items-center justify-center text-center">
              <Disc className="h-12 w-12 text-[var(--muted)] mb-4" strokeWidth={1.5}/>
              <h3 className="font-header text-2xl uppercase text-[var(--foreground)] mb-1">DJ Sets</h3>
              <p className="font-body text-sm text-[var(--muted)]">Mixes coming soon...</p>
            </div>

            <div className="col-span-2 row-span-2 card bg-[var(--background)] p-4 flex flex-col items-center justify-center text-center">
              <SlidersHorizontal className="h-12 w-12 text-[var(--muted)] mb-4" strokeWidth={1.5}/>
              <h3 className="font-header text-2xl uppercase text-[var(--foreground)] mb-1">Original Productions</h3>
              <p className="font-body text-sm text-[var(--muted)]">Tracks in the works...</p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== MOBILE LAYOUT ===== */}
      <div className="md:hidden pt-20 pb-8 px-4 space-y-4">
        <h1 className="font-header text-2xl uppercase text-[var(--foreground)]">
          <span className="opacity-60">Creative ›</span> Music
        </h1>

        <div className="card p-4">
          <h2 className="font-header text-2xl uppercase text-[var(--foreground)] mb-2">Sound Exploration</h2>
          <p className="font-body text-sm text-[var(--foreground)]">
            Currently exploring the world of DJing and house music production. This space will document the journey, featuring mixes and tracks as they develop.
          </p>
          <span className="font-mono text-xs text-[var(--muted)] mt-3 block">STATUS: LEARNING / EXPLORING</span>
        </div>

        <div className="card p-4">
          <h3 className="font-header text-xl uppercase text-[var(--foreground)] mb-2">Inspirations</h3>
          <div className="space-y-3">
            {INSPIRATIONS.map(section => (
              <div key={section.name}>
                <h4 className="font-mono text-sm font-bold text-[var(--foreground)] mb-1">{section.name}</h4>
                <div className="flex flex-wrap gap-1">
                  {section.items.map(item => (
                    <Badge key={item} label={item} variant="small" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card p-4 text-center">
          <Disc className="h-10 w-10 text-[var(--muted)] mb-3 mx-auto" strokeWidth={1.5}/>
          <h3 className="font-header text-xl uppercase text-[var(--foreground)] mb-1">DJ Sets</h3>
          <p className="font-body text-sm text-[var(--muted)]">Mixes coming soon...</p>
        </div>

        <div className="card p-4 text-center">
          <SlidersHorizontal className="h-10 w-10 text-[var(--muted)] mb-3 mx-auto" strokeWidth={1.5}/>
          <h3 className="font-header text-xl uppercase text-[var(--foreground)] mb-1">Original Productions</h3>
          <p className="font-body text-sm text-[var(--muted)]">Tracks in the works...</p>
        </div>
      </div>
    </div>
  );
}


// --- Reusable Badge Component --- (Copied from Software page for consistency)
function Badge({ label, variant = 'normal' }: { label: string, variant?: 'normal' | 'small' }) {
  const sizeClass = variant === 'small' ? 'px-1.5 py-0.5 text-[10px]' : 'px-2 py-1 text-xs';
  return (
    <span className={`inline-flex items-center border border-[var(--border)]/50 bg-transparent font-mono font-bold text-[var(--foreground)] ${sizeClass}`}>
      {label}
    </span>
  );
}
