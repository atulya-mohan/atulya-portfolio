'use client';

import Image from 'next/image';
import Link from 'next/link'; // Keep for internal links
import React, { useState, useMemo, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ArrowUpRight } from 'lucide-react';
import { getSDProjectsData, type SDProject } from '@/lib/projects/getSDProjectsData';

export default function ClubscapePage() {
  const [phoneSlide, setPhoneSlide] = useState(0);

  const [project, setProject] = useState<SDProject | null>(null);
  const [loading, setLoading] = useState(true);

  const cssVars = useMemo(
    () =>
      ({
        '--nav-h': '56px',
        '--gap': '12px',
        '--inner-gap': '8px',
        '--gutter': '22px',
      }) as React.CSSProperties,
    []
  );

  useEffect(() => {
    const fetchProject = async () => {
      setLoading(true);
      try {
        const data = await getSDProjectsData();
        setProject(data);
      } catch (error) {
        console.error('Failed to fetch project:', error);
        setProject(null);
      } finally {
        setLoading(false);
      }
    };
    fetchProject();
  }, []);

  const numImages = project?.images?.length || 0;

  const goPhoneSlide = (dir: -1 | 1) => () => {
    if (numImages <= 1) return;
    setPhoneSlide((s) => (s + dir + numImages) % numImages);
  };

  if (loading) {
    return (
      <div className="fixed inset-0 h-full w-full overflow-hidden flex items-center justify-center bg-[#F0F2E6] text-black">
        <p className="font-mono animate-pulse">Loading project...</p>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="fixed inset-0 h-full w-full overflow-hidden flex items-center justify-center bg-[#F0F2E6] text-black">
        <p className="font-mono">No project found.</p>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 h-full w-full overflow-hidden bg-[#F0F2E6] text-black">
      {/* Scrollbar styles for InfoSection boxes */}
      <style jsx global>{`
        .page-scrollbar::-webkit-scrollbar { width: 8px; }
        .page-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .page-scrollbar::-webkit-scrollbar-thumb { background: transparent; border-radius: 4px; border: 2px solid transparent; background-clip: padding-box; }
        .page-scrollbar:hover::-webkit-scrollbar-thumb { background: black; }
        .page-scrollbar { scrollbar-width: thin; scrollbar-color: transparent transparent; }
        .page-scrollbar:hover { scrollbar-color: black transparent; }
      `}</style>
      
      <section className="px-4 h-full" style={cssVars}>
        <div className="pt-[calc(var(--nav-h)+var(--gap))] pb-[var(--gap)] h-full flex flex-col">
          {/* ===== Breadcrumb ===== */}
          <div className="mb-3 flex-shrink-0">
            <h1 className="font-header text-3xl uppercase text-black">
              <span className="opacity-60">Projects ›</span> Software Design
            </h1>
          </div>

          {/* 👇 ============= LAYOUT UPDATED ============= 👇 */}
          {/* Main Content Grid: 3 cols, 4 rows */}
          <div className="grid flex-1 min-h-0 grid-cols-3 grid-rows-4 gap-[var(--gap)]">

            {/* --- Hero: Title + Overview + Badges (Top Left) --- */}
            <div className="col-span-2 row-span-1 border border-black bg-[#F0F2E6] p-4 flex flex-col">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                 {project.techStack.map(tech => <Badge key={tech} label={tech} />)}
                 {project.status && <Badge label={project.status}/>}
              </div>
              <h2 className="font-header text-3xl uppercase text-black mb-2">{project.title}</h2>
              {/* Added scrollbar here in case blurb is long */}
              <p className="font-body text-sm text-zinc-800 flex-1 min-h-0 overflow-y-auto page-scrollbar pr-1">{project.blurb}</p>
              <div className="mt-auto flex-shrink-0 pt-2">
                 <h4 className="font-mono text-xs font-bold text-black mb-1 uppercase tracking-wide">Links</h4>
                 <div className="flex space-x-2">
                    {project.links?.figma && (
                      <a href={project.links.figma} target="_blank" rel="noopener noreferrer" className="text-orange-600 hover:text-orange-700 hover:underline text-sm">
                        Figma <ArrowUpRight className="inline h-3 w-3 -mt-1"/>
                      </a>
                    )}
                    {project.links?.github && (
                      <a href={project.links.github} target="_blank" rel="noopener noreferrer" className="text-orange-600 hover:text-orange-700 hover:underline text-sm">
                        GitHub <ArrowUpRight className="inline h-3 w-3 -mt-1"/>
                      </a>
                    )}
                    {project.links?.live && (
                      <a href={project.links.live} target="_blank" rel="noopener noreferrer" className="text-orange-600 hover:text-orange-700 hover:underline text-sm">
                        Landing Page <ArrowUpRight className="inline h-3 w-3 -mt-1"/>
                      </a>
                    )}
                    {!project.links?.github && <p className="text-zinc-500 text-xs">(GitHub private)</p>}
                 </div>
              </div>
            </div>

            {/* --- Phone Carousel (Full Right Column) --- */}
            <div className="col-span-1 row-span-4 border border-black bg-[#F0F2E6] p-3 flex flex-col">
              
              <div className="relative w-full flex-1 min-h-0 flex items-center justify-center">
                {/* Left Arrow */}
                {numImages > 1 && (
                  <button
                    onClick={goPhoneSlide(-1)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/50 p-2 text-white transition-colors hover:bg-[#FF4F00] z-20"
                    aria-label="Previous screen"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                )}

                {/* Phone Mock Frame (with h-112 height) */}
                <div className="w-52 h-112 bg-black rounded-xl border-2 border-zinc-800 p-2 flex flex-col shadow-lg mx-auto">
                  <div className="w-10 h-2 bg-zinc-800 rounded-full mx-auto mb-1 flex-shrink-0"></div>
                  <div className="relative w-full h-full bg-white rounded-md overflow-hidden">
                    {project.images[phoneSlide]?.src && (
                      <Image
                        key={`phone-${phoneSlide}`}
                        src={project.images[phoneSlide].src}
                        alt={project.images[phoneSlide].label || 'Project screenshot'}
                        fill
                        className="object-cover"
                        sizes="208px"
                        priority={phoneSlide === 0}
                      />
                    )}
                  </div>
                  <div className="h-6 flex-shrink-0 pt-1 text-center">
                    <span className="text-[10px] font-mono font-medium text-white">
                      {project.images[phoneSlide]?.label || 'Screen'}
                    </span>
                  </div>
                </div>

                {/* Right Arrow */}
                {numImages > 1 && (
                  <button
                    onClick={goPhoneSlide(1)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/50 p-2 text-white transition-colors hover:bg-[#FF4F00] z-20"
                    aria-label="Next screen"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                )}
              </div>
              
              {/* Dots container */}
              <div className="flex-shrink-0 flex items-center justify-center p-2 pt-3">
                <div className="flex items-center gap-1.5">
                  {numImages > 1 && project.images.map((_, idx) => (
                    <span 
                      key={idx} 
                      className={`h-1.5 w-1.5 rounded-full ${ idx === phoneSlide ? 'bg-black' : 'bg-black/40' }`}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* --- Problem Section (Left, Row 2) --- */}
            <InfoSection title="Problem" className="col-span-2 row-span-1 overflow-y-auto page-scrollbar">
               <p className="text-sm">{project.problem}</p>
            </InfoSection>

            {/* --- Solution Section (Left, Row 3) --- */}
            <InfoSection title="Solution" className="col-span-2 row-span-1 overflow-y-auto page-scrollbar">
               <p className="text-sm">{project.solution}</p>
            </InfoSection>

             {/* --- Key Features (Left, Row 4) --- */}
             <InfoSection title="Key Features" className="col-span-2 row-span-1 overflow-y-auto page-scrollbar">
                <ul className="list-disc list-inside space-y-1 text-sm">
                   {project.keyFeatures.map(feature => <li key={feature}>{feature}</li>)}
                 </ul>
              </InfoSection>

          </div>
          {/* 👆 ============= END UPDATED LAYOUT ============= 👆 */}
        </div>
      </section>
    </div>
  );
}

// --- Info Section Component (No Change) ---
function InfoSection({ title, children, className = "", noBorder = false, noPadding = false }: { title: string, children: React.ReactNode, className?: string, noBorder?: boolean, noPadding?: boolean }) {
  const borderClass = noBorder ? '' : 'border border-black';
  const paddingClass = noPadding ? '' : 'p-3';
  return (
    <div className={`${borderClass} bg-[#F0F2E6] ${paddingClass} ${className} flex flex-col min-h-0`}>
      <h4 className="font-mono text-sm font-bold text-black mb-2 uppercase tracking-wide flex-shrink-0">{title}</h4>
      <div className="font-body text-sm text-zinc-700 flex-1 min-h-0">
        {children}
      </div>
    </div>
  );
}


// --- Badge Component (No Change) ---
function Badge({ label, variant = 'normal' }: { label: string, variant?: 'normal' | 'small' }) {
  const sizeClass = variant === 'small' ? 'px-1.5 py-0.5 text-[10px]' : 'px-2 py-1 text-xs';
  return (
    <span className={`inline-flex items-center border border-black/50 bg-transparent font-mono font-bold text-black ${sizeClass}`}>
      {label}
    </span>
  );
}