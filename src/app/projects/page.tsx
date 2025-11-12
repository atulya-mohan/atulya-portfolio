'use client';

import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';
import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

// --- Define Types ---
type Item = {
  id: string;
  title: string;
  blurb?: string | null;
  imageUrl?: string | null;
  href: string;
};

// --- RowScroller Component (Unchanged) ---
function RowScroller({
    children,
    visible,
    gap = 16,
  }: {
    children: React.ReactNode;
    visible: number;
    gap?: number;
  }) {
    const colw = `calc((100% - ${(visible - 1) * gap}px) / ${visible})`;
    return (
      <div className="mt-4 min-h-0 h-full">
        <div className="h-full overflow-x-auto overflow-y-hidden snap-x snap-mandatory page-scrollbar [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div
            className="grid h-full grid-flow-col auto-cols-[var(--colw)] gap-4"
            style={{ ['--colw' as any]: colw }}
          >
            {children}
          </div>
        </div>
      </div>
    );
  }

// --- Main Projects Page Component ---
export default function ProjectsPage() {
  // --- State for fetched data ---
  const [meItems, setMeItems] = useState<Item[]>([]);
  const [emItems, setEmItems] = useState<Item[]>([]);
  const [sdItems, setSdItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || '',
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
    );

    const fetchProjects = async () => {
      setLoading(true);
      
      // Fetch ME Projects
      const { data: meData } = await supabase
        .from('me_projects')
        .select('id, title, blurb, cover_image_url')
        .order('sort_index', { ascending: true });
      
      setMeItems((meData || []).map((p: any) => ({
        id: p.id,
        title: p.title,
        blurb: p.blurb,
        imageUrl: p.cover_image_url,
        href: `/projects/mechanical-engineering` // Links to section page
      })));

      // Fetch EM Projects
      const { data: emData } = await supabase
        .from('em_projects')
        .select('id, title, blurb, cover_image_url')
        .eq('confidential', false)
        .order('sort_index', { ascending: true });

      setEmItems((emData || []).map((p: any) => ({
        id: p.id,
        title: p.title,
        blurb: p.blurb,
        imageUrl: p.cover_image_url,
        href: `/projects/engineering-management` // Links to section page
      })));

      // Fetch SD Projects
      const { data: sdData } = await supabase
        .from('sd_projects')
        .select('id, title, blurb, cover_image_url')
        .order('sort_index', { ascending: true });

      setSdItems((sdData || []).map((p: any) => ({
        id: p.id,
        title: p.title,
        blurb: p.blurb,
        imageUrl: p.cover_image_url,
        href: `/projects/software-design` // Links to section page
      })));

      setLoading(false);
    };

    fetchProjects();
  }, []);

  // Show a loading state
  if (loading) {
    return (
      <div className="fixed inset-0 h-full w-full overflow-auto bg-[#F0F2E6] text-black flex items-center justify-center">
        <p className="font-mono animate-pulse">Loading projects...</p>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 h-full w-full overflow-auto bg-[#F0F2E6] text-black">
      <style jsx global>{`
        .page-scrollbar::-webkit-scrollbar { height: 8px; }
        .page-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .page-scrollbar::-webkit-scrollbar-thumb { background: transparent; border-radius: 4px; border: 2px solid transparent; background-clip: padding-box; }
        .page-scrollbar:hover::-webkit-scrollbar-thumb { background: black; }
        .page-scrollbar { scrollbar-width: thin; scrollbar-color: transparent transparent; }
        .page-scrollbar:hover { scrollbar-color: black transparent; }
      `}</style>

      <section
        className="px-4"
        style={{ '--nav-h': '56px', '--gap': '12px', '--cols': 6, '--rows': 6, '--pad': '16px', '--tile': 'min(calc((100vw - (2 * var(--pad)) - ((var(--cols) - 1) * var(--gap))) / var(--cols)), calc((100dvh - var(--nav-h) - (2 * var(--gap)) - ((calc(var(--rows) - 1)) * var(--gap))) / var(--rows)))' } as React.CSSProperties}
      >
        <div className="pt-[calc(var(--nav-h)+var(--gap))] pb-[var(--gap)]">
          {/* ===== DESKTOP (Grid Layout) ===== */}
          <div
            className="hidden md:grid h-[calc(100dvh-var(--nav-h)-2*var(--gap))] grid-cols-6 [grid-auto-rows:var(--tile)]"
            style={{ gap: 'var(--gap)' }}
          >
            {/* --- Mechanical Engineering --- */}
            <section className="col-span-6 row-span-3 bg-black p-px ">
              <div className="flex h-full min-h-0 flex-col bg-[#F0F2E6] p-4 ">
                <Header title="Mechanical Engineering" href="/projects/mechanical-engineering" />
                <RowScroller visible={4}>
                  {meItems.map((it, i) => (
                    <ProjectCard key={`me-${i}`} item={it} showBlurb aspect="wide" />
                  ))}
                </RowScroller>
              </div>
            </section>

            {/* --- Engineering Management --- */}
            <section className="col-span-3 row-span-3 bg-black p-px ">
              <div className="flex h-full min-h-0 flex-col bg-[#F0F2E6] p-4 ">
                <Header title="Engineering Management" href="/projects/engineering-management" />
                <RowScroller visible={2}>
                  {emItems.map((it, i) => (
                    <ProjectCard key={`em-${i}`} item={it} showBlurb aspect="wide" />
                  ))}
                </RowScroller>
              </div>
            </section>

            {/* --- Software Design --- */}
            <section className="col-span-3 row-span-3 bg-black p-px ">
              <div className="flex h-full min-h-0 flex-col bg-[#F0F2E6] p-4 ">
                <Header title="Software Design" href="/projects/software-design" />
                <RowScroller visible={2}>
                  {sdItems.map((it, i) => (
                    <ProjectCard key={`sd-${i}`} item={it} showBlurb aspect="wide" />
                  ))}
                </RowScroller>
              </div>
            </section>
          </div>

          {/* ===== MOBILE (Stacked Layout) ===== */}
          <div className="md:hidden space-y-5">
            <section className="bg-black p-px ">
              <div className="bg-[#F0F2E6] p-3 ">
                <Header title="Mechanical Engineering" href="/projects/mechanical-engineering" />
                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {meItems.map((it, i) => (
                    <ProjectCard key={`me-m-${i}`} item={it} showBlurb aspect="wide" />
                  ))}
                </div>
              </div>
            </section>

            <section className="bg-black p-px ">
              <div className="bg-[#F0F2E6] p-3 ">
                <Header title="Engineering Management" href="/projects/engineering-management" />
                <div className="mt-4 grid grid-cols-2 gap-4">
                  {emItems.slice(0, 2).map((it, i) => (
                    <ProjectCard key={`em-m-${i}`} item={it} showBlurb={false} aspect="tall" />
                  ))}
                </div>
              </div>
            </section>

            <section className="bg-black p-px ">
              <div className="bg-[#F0F2E6] p-3 ">
                <Header title="Software Design" href="/projects/software-design" />
                <div className="mt-4 grid grid-cols-2 gap-4">
                  {sdItems.slice(0, 2).map((it, i) => (
                    <ProjectCard key={`sd-m-${i}`} item={it} showBlurb={false} aspect="tall" />
                  ))}
                </div>
              </div>
            </section>
          </div>
        </div>
      </section>
    </div>
  );
}

// --- Header Component (Updated) ---
function Header({ title, href }: { title: string; href: string }) {
  return (
    <div className="flex items-center justify-between">
      <h2 className="font-header text-3xl uppercase text-black">{title}</h2>
      <Link
        href={href}
        aria-label={`Open all ${title}`}
        // 👇 UPDATED: Replaced hover:bg-black with orange hover styles
        className="border border-black bg-transparent p-1.5 text-black transition-colors hover:border-[#FF4F00] hover:bg-[#FF4F00] hover:text-white"
      >
        <ArrowUpRight className="h-4 w-4" />
      </Link>
    </div>
  );
}

// --- ProjectCard Component (Unchanged) ---
function ProjectCard({
    item,
    showBlurb = false,
    aspect = 'wide',
  }: {
    item: Item;
    showBlurb?: boolean;
    aspect?: 'wide' | 'tall';
  }) {
    const aspectClass = aspect === 'wide' ? 'aspect-[16/9]' : 'aspect-[4/3]';
    const wantsFillHeight = !showBlurb;
    const mediaWrapperClass = wantsFillHeight ? 'h-full' : aspectClass;
  
    return (
      <Link
        href={item.href || '#'}
        className="group flex min-h-0 h-full flex-col overflow-hidden border border-black bg-transparent transition-colors hover:border-[#FF4F00]"
      >
        {/* Media with overlay title */}
        <div className={`${mediaWrapperClass} w-full`}>
          <div className="relative h-full w-full overflow-hidden bg-zinc-200">
            <div className="pointer-events-none absolute left-0 top-0 z-10 bg-black px-2 py-0.5">
              <span className="font-mono text-[11px] font-medium text-white">
                {item.title}
              </span>
            </div>
  
            {(item.imageUrl && (item.imageUrl.startsWith('http') || item.imageUrl.startsWith('/'))) ? (
              <Image 
                src={item.imageUrl} 
                alt={item.title} 
                fill 
                className="object-cover"
                sizes="(max-width: 768px) 50vw, 33vw"
              />
            ) : null}
          </div>
        </div>
  
        {/* Blurb section */}
        {showBlurb && (
          <div className="p-3">
            <p className="mt-1 line-clamp-2 font-body text-xs text-zinc-700">
              {item.blurb || 'No summary available.'}
            </p>
          </div>
        )}
      </Link>
    );
  }