'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, ArrowUpRight } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
// Restore the import for your actual data fetching function
import { getMEProjectsData, type MEProject } from '@/lib/projects/getMEProjectsData'; // Ensure this path is correct

/* ---------------- component ---------------- */

export default function ExpandedME() {
  // State for projects, loading, and indices remain
  const [projects, setProjects] = useState<MEProject[]>([]);
  const [loading, setLoading] = useState(true); // Start in loading state
  const [i, setI] = useState(0);
  const [slide, setSlide] = useState(0);

  // Restore the useEffect for data fetching
  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true); // Ensure loading state is true at the start
      try {
        const data = await getMEProjectsData();
        setProjects(data);
      } catch (error) {
        console.error('Failed to fetch projects:', error);
        setProjects([]); // Set to empty array on error
      } finally {
        setLoading(false); // Set loading to false after fetch completes or fails
      }
    };
    fetchProjects();
  }, []); // Empty dependency array means this runs once on mount

  // Reset slide index when project changes
  useEffect(() => {
    setSlide(0);
  }, [i]);

  const cur = projects[i]; // Get current project based on index `i`
  const numImages = cur?.images?.length || 0;

  const goSlide = (dir: -1 | 1) => () => {
    if (!cur || numImages <= 1) return;
    setSlide((s) => (s + dir + numImages) % numImages);
  };

  // --- RENDER LOGIC ---
  if (loading) {
    return (
      <div className="fixed inset-0 h-full w-full overflow-hidden flex items-center justify-center bg-[#F0F2E6] text-black">
        <p className="font-mono animate-pulse">Loading projects...</p>
      </div>
    );
  }

  if (!projects.length || !cur) {
    return (
      <div className="fixed inset-0 h-full w-full overflow-hidden flex items-center justify-center bg-[#F0F2E6] text-black">
        <p className="font-mono">No projects found.</p>
      </div>
    );
  }

  // --- Main Render ---
  return (
    <div className="fixed inset-0 h-full w-full overflow-hidden bg-[#F0F2E6] text-black">
      {/* UPDATED: Custom style block for scrollbars */}
      <style jsx global>{`
        /* --- Webkit Scrollbar Styles (Chrome, Safari, Edge) --- */

        /* Vertical Scrollbar */
        .vertical-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .vertical-scrollbar::-webkit-scrollbar-track {
          background: transparent; /* Track always transparent */
        }
        .vertical-scrollbar::-webkit-scrollbar-thumb {
          background: transparent; /* Thumb initially transparent */
          border-radius: 4px; /* Slightly rounded corners */
          border: 2px solid transparent; /* Creates padding effect */
          background-clip: padding-box; /* Clip background to padding box */
        }
        .vertical-scrollbar:hover::-webkit-scrollbar-thumb {
          background: black; /* Thumb black on hover */
        }

        /* Horizontal Scrollbar */
        .horizontal-scrollbar::-webkit-scrollbar {
          height: 8px;
        }
        .horizontal-scrollbar::-webkit-scrollbar-track {
          background: transparent; /* Track always transparent */
        }
        .horizontal-scrollbar::-webkit-scrollbar-thumb {
          background: transparent; /* Thumb initially transparent */
          border-radius: 4px; /* Slightly rounded corners */
          border: 2px solid transparent; /* Creates padding effect */
          background-clip: padding-box; /* Clip background to padding box */
        }
        .horizontal-scrollbar:hover::-webkit-scrollbar-thumb {
          background: black; /* Thumb black on hover */
        }

        /* --- Firefox Scrollbar Styles --- */
        .vertical-scrollbar,
        .horizontal-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: transparent transparent; /* Initially transparent thumb and track */
        }
        .vertical-scrollbar:hover,
        .horizontal-scrollbar:hover {
          scrollbar-color: black transparent; /* Black thumb, transparent track on hover */
        }
      `}</style>
      <section
        className="px-4"
        style={{ '--nav-h': '56px', '--gap': '12px', '--gutter': '22px' } as React.CSSProperties}
      >
        <div className="pt-[calc(var(--nav-h)+var(--gap))] pb-[var(--gap)] h-[calc(100dvh)] flex flex-col">
          {/* ===== Title Row (breadcrumb) ===== */}
          <div className="mb-3 flex-shrink-0">
            <h1 className="font-header text-3xl uppercase text-black">
              <span className="opacity-60">Projects ›</span> Mechanical Engineering
            </h1>
          </div>

          {/* ===== Main ME Card wrapper ===== */}
          <div className="relative flex-1 min-h-0">
            {/* ===== Main ME Card container ===== */}
            <div className="grid h-full min-w-0 grid-rows-12 gap-3 border border-black bg-[#F0F2E6] p-4">
              {/* -- Section 1: Title -- */}
              <div className="row-span-1 flex items-center justify-between">
                <h2 className="font-header text-2xl uppercase text-black">{cur.title}</h2>
                <Link
                  href={`/projects/mechanical-engineering/${cur.id}`} // Using actual project ID
                  aria-label="Open project details"
                  className="border border-black bg-transparent p-1.5 text-black transition-colors hover:bg-black hover:text-white"
                >
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </div>

              {/* -- Section 2: Split layout -- */}
              <div className="row-span-8 grid min-h-0 grid-cols-1 md:grid-cols-2 gap-3">
                {/* 2.1 Left: attributes + description */}
                <div className="flex min-h-0 flex-col border border-black p-3">
                  <div className="mb-3 flex flex-wrap gap-2">
                    <Pill label="Role" value={cur.role} />
                    <Pill label="Year" value={cur.year} />
                    <Pill label="Type" value={cur.type} />
                  </div>
                  {/* Applied custom scrollbar class */}
                  <div className="relative min-h-0 flex-1 overflow-y-auto overflow-x-hidden pr-1 vertical-scrollbar">
                    <p className="font-body leading-relaxed text-zinc-800 text-sm mr-1">{cur.blurb}</p>
                  </div>
                </div>

                {/* 2.2 Right: hero carousel */}
                <div className="relative min-h-0 border border-black bg-zinc-200">
                  <div className="relative h-full w-full overflow-hidden">
                    {cur.images && cur.images[slide] && (
                      <Image
                        key={`${i}-${slide}`}
                        src={cur.images[slide]}
                        alt={`${cur.title} image ${slide + 1}`}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 50vw"
                        priority={slide === 0}
                      />
                    )}
                    <div className="pointer-events-none absolute left-0 top-0 z-10 bg-black px-2 py-0.5">
                      <span className="font-mono text-[11px] font-medium text-white">{cur.title}</span>
                    </div>
                    {numImages > 1 && (
                      <>
                        <button
                          onClick={goSlide(-1)}
                          className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 p-2 text-white transition-colors hover:bg-[#FF4F00]"
                          aria-label="Previous image"
                        >
                          <ChevronLeft className="h-5 w-5" />
                        </button>
                        <button
                          onClick={goSlide(1)}
                          className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 p-2 text-white transition-colors hover:bg-[#FF4F00]"
                          aria-label="Next image"
                        >
                          <ChevronRight className="h-5 w-5" />
                        </button>
                      </>
                    )}
                    {numImages > 1 && (
                      <div className="absolute bottom-2 left-1/2 z-10 -translate-x-1/2">
                        <div className="flex items-center gap-1.5 rounded-full bg-black/60 px-2 py-1">
                          {cur.images.map((_, n) => (
                            <span
                              key={n}
                              className={'h-1.5 w-1.5 rounded-full ' + (n === slide ? 'bg-white' : 'bg-white/40')}
                            />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* -- Section 3: Thumbnail scroller -- */}
              <div className="row-span-3 min-w-0 overflow-hidden">
                {/* Applied custom scrollbar class */}
                <div
                  className="h-full w-full overflow-x-auto overflow-y-hidden scroll-smooth horizontal-scrollbar"
                  aria-label="More Mechanical Engineering projects"
                >
                  <div className="inline-flex h-full gap-3 pr-1">
                    {projects.map((p, idx) => (
                      <button
                        key={p.id}
                        onClick={() => {
                          setI(idx);
                        }}
                        className={
                          'group relative h-full w-[240px] shrink-0 overflow-hidden border bg-zinc-200 transition ' +
                          (idx === i
                            ? 'border-[#FF4F00] border-2' // Highlight selected
                            : 'border-[#FF4F00]/50 hover:border-black')
                        }
                        title={p.title}
                      >
                        <div className="relative h-full w-full">
                          {p.images && p.images[0] && (
                            <Image
                              src={p.images[0]}
                              alt={p.title}
                              fill
                              className="object-cover"
                              sizes="240px"
                            />
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
    </div>
  );
}

// --- Pill Component (Restyled) ---
function Pill({ label, value }: { label: string; value: string }) {
  // Return null if value is empty or undefined
  if (!value) return null;
  return (
    <span className="inline-flex items-center gap-1 border border-black/50 bg-transparent px-2 py-1 text-xs font-mono text-black">
      <span className="opacity-70">{label}:</span>
      <span className="font-bold">{value}</span>
    </span>
  );
}