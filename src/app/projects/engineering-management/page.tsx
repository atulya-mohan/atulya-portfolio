'use client';

import Image from 'next/image';
import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  ArrowUpRight,
} from 'lucide-react';

// Import your two data fetchers
import { getEMProjectsData, type EMProject } from '@/lib/projects/getEMProjectsData';
import { getSingleEMProjectData } from '@/lib/projects/getSingleEMProjectData';

const isPDF = (src: string) => /\.pdf($|\?)/i.test(src);

/* ===========================================================================
   Pill Component
=========================================================================== */
function Pill({ label, value }: { label: string; value: string }) {
  if (!value) return null;
  return (
    <span className="inline-flex items-center gap-1 border border-black/50 bg-transparent px-2 py-1 text-xs font-mono text-black">
      <span className="opacity-70">{label}:</span>
      <span className="font-bold">{value}</span>
    </span>
  );
}

/* ===========================================================================
   Module Renderer Component
=========================================================================== */
function ModuleRenderer({ moduleType, project }: { moduleType: string; project: EMProject }) {
  const moduleTitleClass = "font-mono font-bold text-black mb-1 text-sm";
  const moduleBodyClass = "font-body text-zinc-700 text-xs";
  const moduleListClass = `space-y-0.5 ${moduleBodyClass}`;

  switch (moduleType) {
    // --- Problem & Users ---
    case 'problem':
      return (
        <div>
          <h4 className={moduleTitleClass}>Problem & Users</h4>
          <p className={moduleBodyClass}>
            {project.problem_users || 'Problem statement not available.'}
          </p>
        </div>
      );

    // --- Jobs to be Done ---
    case 'jtbd':
      return (
        <div>
          <h4 className={moduleTitleClass}>Jobs to be Done</h4>
          {project.jtbd && project.jtbd.length > 0 ? (
            <ul className={moduleListClass}>
              {project.jtbd.map((item, i) => (
                <li key={i}>• {item}</li>
              ))}
            </ul>
          ) : (
            <p className={moduleBodyClass}>No jobs defined yet.</p>
          )}
        </div>
      );

    // --- Hypotheses & Risks ---
    case 'hypotheses':
      return (
        <div>
          <h4 className={moduleTitleClass}>Hypotheses & Risks</h4>
          {project.hypotheses && project.hypotheses.length > 0 ? (
            <ul className={moduleListClass}>
              {project.hypotheses.map((item, i) => (
                <li key={i}>• {item}</li>
              ))}
            </ul>
          ) : (
            <p className={moduleBodyClass}>No hypotheses defined yet.</p>
          )}
        </div>
      );

    // --- MVP Scope ---
    case 'mvp_scope':
      return (
        <div>
          <h4 className={moduleTitleClass}>MVP Scope</h4>
          <div className={`space-y-2 ${moduleBodyClass}`}>
            {project.mvp_in && project.mvp_in.length > 0 && (
              <div>
                <p className="font-semibold text-black/80 mb-0.5">In Scope:</p>
                <ul className="space-y-0.5 pl-3">
                  {project.mvp_in.map((item, i) => (
                    <li key={i}>• {item}</li>
                  ))}
                </ul>
              </div>
            )}
            {project.mvp_later && project.mvp_later.length > 0 && (
              <div>
                <p className="font-semibold text-black/80 mb-0.5">Later:</p>
                <ul className="space-y-0.5 pl-3">
                  {project.mvp_later.map((item, i) => (
                    <li key={i}>• {item}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      );

    // --- Current Status ---
    case 'current_status':
      return (
        <div>
          <h4 className={moduleTitleClass}>Current Status</h4>
          <p className={moduleBodyClass}>
            {project.current_status || 'Status not available.'}
          </p>
        </div>
      );

    // --- Executive Snapshot ---
    case 'executive_snapshot':
      return (
        <div>
          <h4 className={moduleTitleClass}>Executive Snapshot</h4>
          {project.exec_snapshot && project.exec_snapshot.length > 0 ? (
            // Use <ul> and <li>, just like the jtbd module
            <ul className={`${moduleListClass} list-disc list-inside`}>
              {project.exec_snapshot.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          ) : (
            <p className={moduleBodyClass}>No snapshot available.</p>
          )}
        </div>
      );

    // --- Decision Framework/Table ---
    case 'decision_table':
      return (
        <div>
          <h4 className={moduleTitleClass}>Decision Framework</h4>
          {project.decision_criteria && project.decision_criteria.length > 0 ? (
            <div className={`space-y-1 ${moduleBodyClass}`}>
              {project.decision_criteria.map((item, i) => (
                <div key={i} className="flex justify-between gap-2 border-b border-black/10 pb-1">
                  <span className="font-semibold text-black">{item.name}</span>
                  <span className="text-right text-black/60 text-[11px]">{item.weight}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className={moduleBodyClass}>No decision criteria defined.</p>
          )}
        </div>
      );

      case 'timeline':
      return (
        <div>
          <h4 className={moduleTitleClass}>Innovation Timeline</h4>
          {project.rd_timeline && project.rd_timeline.length > 0 ? (
            <div className={`space-y-1 ${moduleBodyClass}`}>
              {project.rd_timeline.map((item, i) => (
                <div key={i} className="flex justify-between gap-2 border-b border-black/10 pb-1">
                  <span className="font-semibold text-black">{item.name}</span>
                  <span className="text-right text-black/60 text-[11px]">{item.weight}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className={moduleBodyClass}>No timeline data defined.</p>
          )}
        </div>
      );
    
    // --- R&D Enablers ---
    // This will re-use the "Executive Snapshot" bullet list logic
    case 'org_enablers':
      return (
        <div>
          <h4 className={moduleTitleClass}>Organizational Enablers</h4>
          {project.rd_enablers && project.rd_enablers.length > 0 ? (
            <ul className={`${moduleListClass} list-disc list-inside`}>
              {project.rd_enablers.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          ) : (
            <p className={moduleBodyClass}>No enablers defined.</p>
          )}
        </div>
      );

    // --- R&D Frictions ---
    // This will also re-use the bullet list logic
    case 'constraints_frictions':
      return (
        <div>
          <h4 className={moduleTitleClass}>Constraints & Frictions</h4>
          {project.rd_frictions && project.rd_frictions.length > 0 ? (
            <ul className={`${moduleListClass} list-disc list-inside`}>
              {project.rd_frictions.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          ) : (
            <p className={moduleBodyClass}>No frictions defined.</p>
          )}
        </div>
      );

    // --- R&D Takeaways ---
    // This will re-use the "Current Status" simple paragraph logic
    case 'takeaways':
      return (
        <div>
          <h4 className={moduleTitleClass}>Key Takeaways</h4>
          <p className={moduleBodyClass}>
            {project.rd_takeaways || 'No takeaways defined.'}
          </p>
        </div>
      );

    // --- iPod Case Thesis ---
    case 'case_thesis':
      return (
        <div>
          <h4 className={moduleTitleClass}>Case Thesis</h4>
          <p className={moduleBodyClass}>
            {project.ipod_thesis || 'No thesis defined.'}
          </p>
        </div>
      );

    // --- iPod Strategic Levers ---
    case 'strategic_levers':
      return (
        <div>
          <h4 className={moduleTitleClass}>Strategic Levers</h4>
          {project.ipod_levers && project.ipod_levers.length > 0 ? (
            <ul className={`${moduleListClass} list-disc list-inside`}>
              {project.ipod_levers.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          ) : (
            <p className={moduleBodyClass}>No levers defined.</p>
          )}
        </div>
      );

    // --- iPod Before/After KPIs ---
    case 'before_after_kpis':
      return (
        <div>
          <h4 className={moduleTitleClass}>Market Impact (KPIs)</h4>
          {project.ipod_kpis && project.ipod_kpis.length > 0 ? (
            <div className={`space-y-1 ${moduleBodyClass}`}>
              {project.ipod_kpis.map((item, i) => (
                <div key={i} className="flex justify-between gap-2 border-b border-black/10 pb-1">
                  <span className="font-semibold text-black">{item.name}</span>
                  <span className="text-right text-black/60 text-[11px]">{item.weight}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className={moduleBodyClass}>No KPI data defined.</p>
          )}
        </div>
      );

    // --- iPod Key Insight ---
    case 'key_insight':
      return (
        <div>
          <h4 className={moduleTitleClass}>Key Insight</h4>
          <p className={moduleBodyClass}>
            {project.ipod_insight || 'No insight defined.'}
          </p>
        </div>
      );

    case 'persona':
      return (
        <div>
          <h4 className={moduleTitleClass}>Target Personas</h4>
          {project.pm_persona && project.pm_persona.length > 0 ? (
            <ul className={`${moduleListClass} list-disc list-inside`}>
              {project.pm_persona.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          ) : (
            <p className={moduleBodyClass}>No personas defined.</p>
          )}
        </div>
      );

    // --- Fallback: Use blurb ---
    default:
      const blurbText = project.blurb || '';
      return (
        <p className={`${moduleBodyClass} italic`}>
          {blurbText.slice(0, 150)}…
        </p>
      );
  }
}


/* ===========================================================================
   Main ExpandedEM Component
=========================================================================== */
export default function ExpandedEM() {
  const [projects, setProjects] = useState<EMProject[]>([]);
  const [initialLoading, setInitialLoading] = useState(true);
  const [detailLoading, setDetailLoading] = useState(false);
  const [i, setI] = useState(0);
  const [slide, setSlide] = useState(0);

  // Fetch *summary* projects on mount
  useEffect(() => {
    const fetchProjects = async () => {
      setInitialLoading(true);
      try {
        const data = await getEMProjectsData();
        setProjects(data);
        if (data.length > 0) {
          // We'll trigger the detail load for the first item
          // in the *next* useEffect, which depends on [i, projects]
        }
      } catch (error) {
        console.error('Failed to fetch projects:', error);
        setProjects([]);
      } finally {
        setInitialLoading(false);
      }
    };
    fetchProjects();
  }, []); // Empty array, only runs once

  // Fetch details when 'i' changes or when initial projects load
  useEffect(() => {
    const currentProject = projects[i];
    
    // 1. Don't run if we have no projects
    if (!currentProject) {
      setDetailLoading(false);
      return;
    }

    // 2. Check if details (e.g., 'jtbd') are already loaded
    if (currentProject.jtbd !== undefined) {
      setDetailLoading(false); // Already loaded
      return;
    }

    // 3. Details are not loaded. Fetch them.
    const fetchDetails = async () => {
      setDetailLoading(true);
      try {
        const detailedData = await getSingleEMProjectData(currentProject.id);
        if (detailedData) {
          setProjects(prevProjects => {
            const newProjects = [...prevProjects];
            newProjects[i] = detailedData;
            return newProjects;
          });
        }
      } catch (error) {
        console.error('Failed to fetch project details:', error);
      } finally {
        setDetailLoading(false);
      }
    };

    fetchDetails();
  }, [i, projects]); // Runs when 'i' changes OR 'projects' array first loads

  // Reset slide index when project changes
  useEffect(() => {
    if (projects[i]) {
      setSlide(0);
    }
  }, [i, projects]);

  const cur = projects[i]; // This might be undefined on first render
  const numMedia = cur?.media?.length || 0;

  const goSlide = (dir: -1 | 1) => () => {
    if (!cur || numMedia <= 1) return;
    setSlide((s) => (s + dir + numMedia) % numMedia);
  };

  // --- RENDER LOGIC ---
  if (initialLoading) {
    return (
      <div className="fixed inset-0 h-full w-full overflow-hidden flex items-center justify-center bg-[#F0F2E6] text-black">
        <p className="font-mono animate-pulse">Loading projects...</p>
      </div>
    );
  }

  // This is the main guard that prevents the crash.
  // If `cur` is undefined (e.g., no projects found), we stop here.
  if (!cur) {
    return (
      <div className="fixed inset-0 h-full w-full overflow-hidden flex items-center justify-center bg-[#F0F2E6] text-black">
        <p className="font-mono">No projects found.</p>
      </div>
    );
  }

  // If we get here, `cur` is guaranteed to be an object.
  return (
    <div className="fixed inset-0 h-full w-full overflow-hidden bg-[#F0F2E6] text-black">
      {/* Custom style block for scrollbars */}
      <style jsx global>{`
        .vertical-scrollbar::-webkit-scrollbar { width: 8px; }
        .vertical-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .vertical-scrollbar::-webkit-scrollbar-thumb { background: transparent; border-radius: 4px; border: 2px solid transparent; background-clip: padding-box; }
        .vertical-scrollbar:hover::-webkit-scrollbar-thumb { background: black; }
        .horizontal-scrollbar::-webkit-scrollbar { height: 8px; }
        .horizontal-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .horizontal-scrollbar::-webkit-scrollbar-thumb { background: transparent; border-radius: 4px; border: 2px solid transparent; background-clip: padding-box; }
        .horizontal-scrollbar:hover::-webkit-scrollbar-thumb { background: black; }
        .vertical-scrollbar, .horizontal-scrollbar { scrollbar-width: thin; scrollbar-color: transparent transparent; }
        .vertical-scrollbar:hover, .horizontal-scrollbar:hover { scrollbar-color: black transparent; }
      `}</style>

      <section
        className="px-4"
        style={{ '--nav-h': '56px', '--gap': '12px', '--gutter': '22px' } as React.CSSProperties}
      >
        <div className="pt-[calc(var(--nav-h)+var(--gap))] pb-[var(--gap)] h-[calc(100dvh)] flex flex-col">
          {/* ===== Title Row (breadcrumb) ===== */}
          <div className="mb-3 flex-shrink-0">
            <h1 className="font-header text-3xl uppercase text-black">
              <span className="opacity-60">Projects ›</span> Engineering Management
            </h1>
          </div>

          {/* ===== Card wrapper ===== */}
          <div className="relative flex-1 min-h-0">
            {/* ===== Main EM Card ===== */}
            <div className="grid h-full min-w-0 grid-rows-12 gap-3 border border-black bg-[#F0F2E6] p-4">

              {/* ===== Row 1: Title + Chips (NOW SAFE) ===== */}
              <header className="row-span-1 grid grid-cols-[1fr_auto] items-center gap-3">
                <h2 className="truncate font-header text-2xl uppercase text-black">{cur.title}</h2>
                <div className="flex flex-wrap items-center gap-2">
                  <Pill label="Role" value={cur.role} />
                  <Pill label="Year" value={cur.year} />
                  <Pill label="Type" value={cur.type} />
                  {/* <Link
                    href={`/projects/engineering-management/${cur.id}`}
                    aria-label="Open project details"
                    className="ml-1 border border-black bg-transparent p-1.5 text-black transition-colors hover:bg-black hover:text-white"
                  >
                    <ArrowUpRight className="h-4 w-4" />
                  </Link> */}
                </div>
              </header>

              {/* ===== Rows 2-11: Outcomes + Dual Pane + Framework ===== */}
              <section className="row-span-10 grid min-h-0 gap-3 border border-black p-3 [grid-template-rows:auto_minmax(0,1fr)_auto]">
                {/* Outcomes strip */}
                {cur.outcomes && cur.outcomes.length > 0 ? (
                  <div className="flex flex-wrap items-center gap-2">
                    {cur.outcomes.map((o, idx) => (
                      <span
                        key={`outcome-${idx}`}
                        className="border border-black/50 bg-transparent px-2 py-1 text-[11px] font-mono font-bold text-black"
                      >
                        {o.replace('* ', '')}
                      </span>
                    ))}
                  </div>
                ) : <div className="h-0" />}

                {/* Dual-pane body */}
                <div className="grid min-h-0 grid-cols-1 md:grid-cols-2 gap-3">
                  {/* LEFT: Narrative modules */}
                  <div className="flex min-h-0 flex-col border border-black p-3">
                    <div className="relative min-h-0 flex-1 overflow-auto pr-1 vertical-scrollbar">
                      {/* Check for detail loading state */}
                      {detailLoading ? (
                        <p className="font-mono animate-pulse text-sm">Loading details...</p>
                      ) : (
                        <div className="space-y-4 font-body text-sm text-zinc-800">
                          {cur.modules && cur.modules.length > 0 ? (
                            cur.modules.map((mod, idx) => (
                              <ModuleRenderer key={`${mod}-${idx}`} moduleType={mod} project={cur} />
                            ))
                          ) : (
                            <p>{cur.blurb}</p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* RIGHT: Evidence carousel */}
                  <div className="relative min-h-0 border border-black">
                    <div className="relative h-full w-full overflow-hidden border border-black bg-zinc-200 flex items-center justify-center">
                      {numMedia > 0 && cur.media[slide] ? (
                        isPDF(cur.media[slide]) ? (
                          <object
                            data={cur.media[slide]}
                            type="application/pdf"
                            className="h-full w-full"
                          >
                            <div className="flex h-full w-full items-center justify-center font-mono text-zinc-600">
                              PDF preview unavailable.
                            </div>
                          </object>
                        ) : (
                          <Image
                            key={`${i}-${slide}`}
                            src={cur.media[slide]}
                            alt={`${cur.title} media ${slide + 1}`}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, 50vw"
                            priority={slide === 0}
                          />
                        )
                      ) : (
                        <div className="flex h-full w-full items-center justify-center font-mono text-zinc-600">
                          No media available.
                        </div>
                      )}

                      {/* --- Title chip REMOVED --- */}

                      {/* Carousel arrows */}
                      {numMedia > 1 && (
                        <>
                          <button
                            onClick={goSlide(-1)}
                            className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 p-2 text-white transition-colors hover:bg-[#FF4F00]"
                            aria-label="Previous"
                          >
                            <ChevronLeft className="h-5 w-5" />
                          </button>
                          <button
                            onClick={goSlide(1)}
                            className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 p-2 text-white transition-colors hover:bg-[#FF4F00]"
                            aria-label="Next"
                          >
                            <ChevronRight className="h-5 w-5" />
                          </button>
                        </>
                      )}

                      {/* Dots */}
                      {numMedia > 1 && (
                        <div className="absolute bottom-2 left-1/2 z-10 -translate-x-1/2">
                          <div className="flex items-center gap-1.5 rounded-full bg-black/60 px-2 py-1">
                            {cur.media.map((_, n) => (
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

                {/* Framework/context footer */}
                <div className="font-mono text-[11px] text-black/70">
                  Theme: <span className="font-semibold text-black">{cur.theme}</span>
                </div>
              </section>

              {/* ===== Rows 12: Project scroller ===== */}
              <div className="row-span-1 flex h-full items-center overflow-x-auto overflow-y-hidden scroll-smooth horizontal-scrollbar">
                <div className="inline-flex items-center gap-4 pr-1">
                  {projects.map((p, idx) => {
                    const active = idx === i;
                    return (
                      <React.Fragment key={p.id}>
                        <button
                          onClick={() => { setI(idx); }}
                          className={
                            'whitespace-nowrap border-2 px-3 py-1.5 font-mono text-sm transition ' +
                            (active
                              ? 'border-[#FF4F00] bg-transparent text-black'
                              : 'border-transparent bg-transparent text-black/70 hover:text-black')
                          }
                          title={p.title}
                        >
                          {p.title}
                        </button>
                        {idx < projects.length - 1 && (
                          <span className="h-4 w-px bg-black/30" aria-hidden="true" />
                        )}
                      </React.Fragment>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}