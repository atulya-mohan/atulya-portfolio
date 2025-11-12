'use client';

import Link from 'next/link';
import Image from 'next/image'; // Placeholder for potential visuals
import React, { useState, useEffect, useMemo } from 'react';
import { ArrowUpRight, Disc, SlidersHorizontal, Headphones } from 'lucide-react'; // Music/DJ related icons

// Placeholder - No actual music projects yet
type MusicProject = {
    id: string;
    title: string;
    description: string;
    year: string;
    type: 'DJ Set' | 'Production' | 'Other';
    imageUrl?: string;
    audioUrl?: string;
};

// Empty array as there are no projects yet
const CURRENT_PROJECTS: MusicProject[] = [];

// Placeholder for inspirations
const INSPIRATIONS = [
    { name: 'Artists', items: ['Disclosure', 'Kaytranada', 'Fred again..', 'Channel Tres'] },
    { name: 'Genres', items: ['Deep House', 'UK Garage', 'Tech House', 'Disco House'] },
];


export default function MusicPage() {
    const [projects, setProjects] = useState<MusicProject[]>(CURRENT_PROJECTS);
    const [loading, setLoading] = useState(false); // No fetching needed initially
    // const [i, setI] = useState(0); // No selected project initially

    // const cur = projects[i]; // No current project initially

    const cssVars = useMemo(
        () =>
          ({
            '--nav-h': '56px',
            '--gap': '12px',
            '--gutter': '22px',
          }) as React.CSSProperties,
        []
      );

    // --- RENDER LOGIC ---
    // Simplified as there's no data to load/select initially

  return (
    <div className="fixed inset-0 h-full w-full overflow-hidden bg-[#F0F2E6] text-black">
        {/* Scrollbar styles - applied to specific containers if needed */}
        <style jsx global>{`
          .content-scrollbar::-webkit-scrollbar { width: 8px; height: 8px;}
          .content-scrollbar::-webkit-scrollbar-track { background: transparent; }
          .content-scrollbar::-webkit-scrollbar-thumb { background: transparent; border-radius: 4px; border: 2px solid transparent; background-clip: padding-box; }
          .content-scrollbar:hover::-webkit-scrollbar-thumb { background: black; }
          .content-scrollbar { scrollbar-width: thin; scrollbar-color: transparent transparent; }
          .content-scrollbar:hover { scrollbar-color: black transparent; }
        `}</style>
      <section className="px-4 h-full" style={cssVars}>
        <div className="pt-[calc(var(--nav-h)+var(--gap))] pb-[var(--gap)] h-full flex flex-col">
          {/* ===== Breadcrumb ===== */}
          <div className="mb-3 flex-shrink-0">
            <h1 className="font-header text-3xl uppercase text-black">
              <span className="opacity-60">Creative ›</span> Music
            </h1>
          </div>

          {/* ===== Main Content Area ===== */}
          {/* Using grid layout to position elements */}
          <div className="grid flex-1 min-h-0 grid-cols-3 grid-rows-3 gap-[var(--gap)]">

             {/* --- Header/Intro Section (Top Left) --- */}
             <div className="col-span-2 row-span-1 border border-black bg-[#F0F2E6] p-4 flex flex-col justify-between">
                <div>
                    <h2 className="font-header text-3xl uppercase text-black mb-2">Sound Exploration</h2>
                    <p className="font-body text-base text-zinc-800 max-w-xl">
                        Currently exploring the world of DJing and house music production. This space will document the journey, featuring mixes and tracks as they develop.
                    </p>
                </div>
                 {/* Placeholder for future link or status */}
                 <span className="font-mono text-xs text-black/60 mt-auto">STATUS: LEARNING / EXPLORING</span>
             </div>

             {/* --- Inspirations Section (Top Right) --- */}
              <div className="col-span-1 row-span-1 border border-black bg-[#F0F2E6] p-4 flex flex-col min-h-0">
                 <h3 className="font-header text-xl uppercase text-black mb-2 flex-shrink-0">Inspirations</h3>
                 <div className="flex-1 space-y-3 overflow-y-auto content-scrollbar pr-1">
                     {INSPIRATIONS.map(section => (
                         <div key={section.name}>
                             <h4 className="font-mono text-sm font-bold text-black mb-1">{section.name}</h4>
                             <div className="flex flex-wrap gap-1">
                                 {section.items.map(item => (
                                     <Badge key={item} label={item} variant="small" />
                                 ))}
                             </div>
                         </div>
                     ))}
                 </div>
              </div>


              {/* --- DJ Sets Section (Placeholder - Bottom Left) --- */}
              <div className="col-span-1 row-span-2 border border-black bg-[#F0F2E6] p-4 flex flex-col items-center justify-center text-center">
                  <Disc className="h-12 w-12 text-black/30 mb-4" strokeWidth={1.5}/>
                  <h3 className="font-header text-2xl uppercase text-black mb-1">DJ Sets</h3>
                  <p className="font-body text-sm text-zinc-600">Mixes coming soon...</p>
              </div>

               {/* --- Productions Section (Placeholder - Bottom Right) --- */}
              <div className="col-span-2 row-span-2 border border-black bg-[#F0F2E6] p-4 flex flex-col items-center justify-center text-center">
                   <SlidersHorizontal className="h-12 w-12 text-black/30 mb-4" strokeWidth={1.5}/>
                  <h3 className="font-header text-2xl uppercase text-black mb-1">Original Productions</h3>
                  <p className="font-body text-sm text-zinc-600">Tracks in the works...</p>
              </div>


          </div> {/* End Main Content Area */}
        </div>
      </section>
    </div>
  );
}


// --- Reusable Badge Component --- (Copied from Software page for consistency)
function Badge({ label, variant = 'normal' }: { label: string, variant?: 'normal' | 'small' }) {
  const sizeClass = variant === 'small' ? 'px-1.5 py-0.5 text-[10px]' : 'px-2 py-1 text-xs';
  return (
    <span className={`inline-flex items-center border border-black/50 bg-transparent font-mono font-bold text-black ${sizeClass}`}>
      {label}
    </span>
  );
}
