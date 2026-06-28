'use client';

import Image from 'next/image';
import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, FileText, ArrowUpRight } from 'lucide-react';
import type { EMProject } from '@/lib/projects/getEMProjectsData';

const isPDF = (src: string) => /\.pdf($|\?)/i.test(src);

function Pill({ label, value }: { label: string; value: string }) {
  if (!value) return null;
  return (
    <span className="inline-flex items-center gap-1 border border-[var(--border-light)] bg-transparent px-2 py-1 text-xs font-mono text-[var(--foreground)]">
      <span className="opacity-70">{label}:</span>
      <span className="font-bold">{value}</span>
    </span>
  );
}

function ModuleRenderer({ moduleType, project }: { moduleType: string; project: EMProject }) {
  const moduleTitleClass = "font-mono font-bold text-[var(--foreground)] mb-1 text-sm";
  const moduleBodyClass = "font-body text-[var(--muted)] text-sm";
  const moduleListClass = `space-y-0.5 ${moduleBodyClass}`;

  switch (moduleType) {
    case 'problem':
      return (<div><h4 className={moduleTitleClass}>Problem & Users</h4><p className={moduleBodyClass}>{project.problem_users || 'Problem statement not available.'}</p></div>);
    case 'jtbd':
      return (<div><h4 className={moduleTitleClass}>Jobs to be Done</h4>{project.jtbd && project.jtbd.length > 0 ? (<ul className={moduleListClass}>{project.jtbd.map((item, i) => (<li key={i}>• {item}</li>))}</ul>) : (<p className={moduleBodyClass}>No jobs defined yet.</p>)}</div>);
    case 'hypotheses':
      return (<div><h4 className={moduleTitleClass}>Hypotheses & Risks</h4>{project.hypotheses && project.hypotheses.length > 0 ? (<ul className={moduleListClass}>{project.hypotheses.map((item, i) => (<li key={i}>• {item}</li>))}</ul>) : (<p className={moduleBodyClass}>No hypotheses defined yet.</p>)}</div>);
    case 'mvp_scope':
      return (<div><h4 className={moduleTitleClass}>MVP Scope</h4><div className={`space-y-2 ${moduleBodyClass}`}>{project.mvp_in && project.mvp_in.length > 0 && (<div><p className="font-semibold text-[var(--foreground)] mb-0.5">In Scope:</p><ul className="space-y-0.5 pl-3">{project.mvp_in.map((item, i) => (<li key={i}>• {item}</li>))}</ul></div>)}{project.mvp_later && project.mvp_later.length > 0 && (<div><p className="font-semibold text-[var(--foreground)] mb-0.5">Later:</p><ul className="space-y-0.5 pl-3">{project.mvp_later.map((item, i) => (<li key={i}>• {item}</li>))}</ul></div>)}</div></div>);
    case 'current_status':
      return (<div><h4 className={moduleTitleClass}>Current Status</h4><p className={moduleBodyClass}>{project.current_status || 'Status not available.'}</p></div>);
    case 'executive_snapshot':
      return (<div><h4 className={moduleTitleClass}>Executive Snapshot</h4>{project.exec_snapshot && project.exec_snapshot.length > 0 ? (<ul className={`${moduleListClass} list-disc list-inside`}>{project.exec_snapshot.map((item, i) => (<li key={i}>{item}</li>))}</ul>) : (<p className={moduleBodyClass}>No snapshot available.</p>)}</div>);
    case 'decision_table':
      return (<div><h4 className={moduleTitleClass}>Decision Framework</h4>{project.decision_criteria && project.decision_criteria.length > 0 ? (<div className={`space-y-1 ${moduleBodyClass}`}>{project.decision_criteria.map((item, i) => (<div key={i} className="flex justify-between gap-2 border-b border-[var(--border-light)] pb-1"><span className="font-semibold text-[var(--foreground)]">{item.name}</span><span className="text-right text-[var(--muted)] text-[11px]">{item.weight}</span></div>))}</div>) : (<p className={moduleBodyClass}>No decision criteria defined.</p>)}</div>);
    case 'timeline':
      return (<div><h4 className={moduleTitleClass}>Innovation Timeline</h4>{project.rd_timeline && project.rd_timeline.length > 0 ? (<div className={`space-y-1 ${moduleBodyClass}`}>{project.rd_timeline.map((item, i) => (<div key={i} className="flex justify-between gap-2 border-b border-[var(--border-light)] pb-1"><span className="font-semibold text-[var(--foreground)]">{item.name}</span><span className="text-right text-[var(--muted)] text-[11px]">{item.weight}</span></div>))}</div>) : (<p className={moduleBodyClass}>No timeline data defined.</p>)}</div>);
    case 'org_enablers':
      return (<div><h4 className={moduleTitleClass}>Organizational Enablers</h4>{project.rd_enablers && project.rd_enablers.length > 0 ? (<ul className={`${moduleListClass} list-disc list-inside`}>{project.rd_enablers.map((item, i) => (<li key={i}>{item}</li>))}</ul>) : (<p className={moduleBodyClass}>No enablers defined.</p>)}</div>);
    case 'constraints_frictions':
      return (<div><h4 className={moduleTitleClass}>Constraints & Frictions</h4>{project.rd_frictions && project.rd_frictions.length > 0 ? (<ul className={`${moduleListClass} list-disc list-inside`}>{project.rd_frictions.map((item, i) => (<li key={i}>{item}</li>))}</ul>) : (<p className={moduleBodyClass}>No frictions defined.</p>)}</div>);
    case 'takeaways':
      return (<div><h4 className={moduleTitleClass}>Key Takeaways</h4><p className={moduleBodyClass}>{project.rd_takeaways || 'No takeaways defined.'}</p></div>);
    case 'case_thesis':
      return (<div><h4 className={moduleTitleClass}>Case Thesis</h4><p className={moduleBodyClass}>{project.ipod_thesis || 'No thesis defined.'}</p></div>);
    case 'strategic_levers':
      return (<div><h4 className={moduleTitleClass}>Strategic Levers</h4>{project.ipod_levers && project.ipod_levers.length > 0 ? (<ul className={`${moduleListClass} list-disc list-inside`}>{project.ipod_levers.map((item, i) => (<li key={i}>{item}</li>))}</ul>) : (<p className={moduleBodyClass}>No levers defined.</p>)}</div>);
    case 'before_after_kpis':
      return (<div><h4 className={moduleTitleClass}>Market Impact (KPIs)</h4>{project.ipod_kpis && project.ipod_kpis.length > 0 ? (<div className={`space-y-1 ${moduleBodyClass}`}>{project.ipod_kpis.map((item, i) => (<div key={i} className="flex justify-between gap-2 border-b border-[var(--border-light)] pb-1"><span className="font-semibold text-[var(--foreground)]">{item.name}</span><span className="text-right text-[var(--muted)] text-[11px]">{item.weight}</span></div>))}</div>) : (<p className={moduleBodyClass}>No KPI data defined.</p>)}</div>);
    case 'key_insight':
      return (<div><h4 className={moduleTitleClass}>Key Insight</h4><p className={moduleBodyClass}>{project.ipod_insight || 'No insight defined.'}</p></div>);
    case 'persona':
      return (<div><h4 className={moduleTitleClass}>Target Personas</h4>{project.pm_persona && project.pm_persona.length > 0 ? (<ul className={`${moduleListClass} list-disc list-inside`}>{project.pm_persona.map((item, i) => (<li key={i}>{item}</li>))}</ul>) : (<p className={moduleBodyClass}>No personas defined.</p>)}</div>);
    default:
      return (<p className={`${moduleBodyClass} italic`}>{(project.blurb || '').slice(0, 150)}…</p>);
  }
}

export default function ExpandedEMClient({ projects }: { projects: EMProject[] }) {
  const [i, setI] = useState(0);
  const [slide, setSlide] = useState(0);
  const [hashNotFound, setHashNotFound] = useState<string | null>(null);

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

  useEffect(() => { setSlide(0); }, [i]);

  const cur = projects[i];
  // Split media into displayable images vs. linked PDFs. The panel shows a real
  // image (media images if any, otherwise the project cover) and surfaces PDFs as
  // explicit "View PDF" buttons — never a raw embedded PDF reader.
  const imageMedia = (cur?.media || []).filter((m) => !isPDF(m));
  const pdfMedia = (cur?.media || []).filter((m) => isPDF(m));
  const heroImages = imageMedia.length ? imageMedia : (cur?.coverImageUrl ? [cur.coverImageUrl] : []);
  const numHero = heroImages.length;

  const goSlide = (dir: -1 | 1) => () => {
    if (!cur || numHero <= 1) return;
    setSlide((s) => (s + dir + numHero) % numHero);
  };

  if (!cur) {
    return (
      <div className="fixed inset-0 h-full w-full overflow-hidden flex items-center justify-center bg-[var(--background)] text-[var(--foreground)]">
        <p className="font-mono">No projects found.</p>
      </div>
    );
  }

  return (
    <div className="project-em min-h-screen md:fixed md:inset-0 md:h-full md:w-full md:overflow-hidden bg-[var(--background)] text-[var(--foreground)]">
      {hashNotFound && (
        <div className="fixed top-[calc(var(--nav-h)+8px)] left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 border border-[var(--accent)] bg-[var(--background)] px-4 py-2 shadow-lg">
          <p className="font-mono text-xs text-[var(--foreground)]">
            Project <span className="font-bold">&ldquo;{hashNotFound}&rdquo;</span> not found
          </p>
          <button onClick={() => { setHashNotFound(null); window.history.replaceState(null, '', window.location.pathname); }} className="font-mono text-xs text-[var(--accent)] hover:underline">&times; dismiss</button>
        </div>
      )}
      {/* ===== DESKTOP LAYOUT ===== */}
      <section className="hidden md:block px-4" style={{ '--gap': '12px', '--gutter': '22px' } as React.CSSProperties}>
        <div className="pt-[calc(var(--nav-h)+var(--gap))] pb-[var(--gap)] h-[calc(100dvh)] flex flex-col">
          <div className="mb-3 flex-shrink-0">
            <h1 className="font-header text-3xl uppercase text-[var(--foreground)]">
              <span className="opacity-60">Projects ›</span> Engineering Management
            </h1>
          </div>

          <div className="relative flex-1 min-h-0">
            <div className="project-type-card grid h-full min-w-0 grid-rows-12 gap-3 bg-[var(--background)] p-4">
              <header className="row-span-1 grid grid-cols-[1fr_auto] items-center gap-3">
                <h2 className="truncate font-header text-2xl uppercase text-[var(--foreground)]">{cur.title}</h2>
                <div className="flex flex-wrap items-center gap-2">
                  <Pill label="Role" value={cur.role} />
                  <Pill label="Year" value={cur.year} />
                  <Pill label="Type" value={cur.type} />
                </div>
              </header>

              <section className="row-span-10 grid min-h-0 gap-3 card-elevated p-3 [grid-template-rows:auto_minmax(0,1fr)_auto]">
                {cur.outcomes && cur.outcomes.length > 0 ? (
                  <div className="flex flex-wrap items-center gap-2">
                    {cur.outcomes.map((o, idx) => (
                      <span key={`outcome-${idx}`} className="border border-[var(--border-light)] bg-transparent px-2 py-1 text-[11px] font-mono font-bold text-[var(--foreground)]">
                        {o.replace('* ', '')}
                      </span>
                    ))}
                  </div>
                ) : <div className="h-0" />}

                <div className="grid min-h-0 grid-cols-2 gap-3">
                  <div className="flex min-h-0 flex-col card p-3">
                    <div className="relative min-h-0 flex-1 overflow-auto pr-1 vertical-scrollbar">
                      <div className="space-y-4 font-body text-sm text-[var(--foreground)]">
                        {cur.modules && cur.modules.length > 0 ? (
                          cur.modules.map((mod, idx) => (
                            <ModuleRenderer key={`${mod}-${idx}`} moduleType={mod} project={cur} />
                          ))
                        ) : (
                          <p>{cur.blurb}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="relative min-h-0 card">
                    <div className="relative h-full w-full overflow-hidden card bg-zinc-200 flex items-center justify-center">
                      {numHero > 0 ? (
                        <Image key={`${i}-${slide}`} src={heroImages[slide]} alt={`${cur.title} media ${slide + 1}`} fill className="object-cover" sizes="50vw" priority={slide === 0} />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center font-mono text-[var(--muted)]">No media available.</div>
                      )}
                      {pdfMedia.length > 0 && (
                        <div className="absolute right-2 top-2 z-20 flex flex-col items-end gap-1.5">
                          {pdfMedia.map((pdf, n) => (
                            <a key={pdf} href={pdf} target="_blank" rel="noopener noreferrer" className="icon-pop inline-flex items-center gap-1.5 border border-[var(--border)] bg-[var(--background)]/95 px-2.5 py-1.5 font-mono text-[11px] font-medium uppercase tracking-wide text-[var(--foreground)] backdrop-blur-sm transition-colors hover:border-[var(--project-accent)] hover:bg-[var(--project-accent)] hover:text-white">
                              <FileText className="h-3.5 w-3.5" />
                              {pdfMedia.length > 1 ? `PDF ${n + 1}` : 'View PDF'}
                              <ArrowUpRight className="h-3.5 w-3.5" />
                            </a>
                          ))}
                        </div>
                      )}
                      {numHero > 1 && (
                        <>
                          <button onClick={goSlide(-1)} className="icon-pop absolute left-2 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center bg-black/50 text-white transition-colors hover:bg-[var(--project-accent)]" aria-label="Previous"><ChevronLeft className="h-5 w-5" /></button>
                          <button onClick={goSlide(1)} className="icon-pop absolute right-2 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center bg-black/50 text-white transition-colors hover:bg-[var(--project-accent)]" aria-label="Next"><ChevronRight className="h-5 w-5" /></button>
                        </>
                      )}
                      {numHero > 1 && (
                        <div className="absolute bottom-2 left-1/2 z-10 -translate-x-1/2">
                          <div className="flex items-center gap-1.5 rounded-full bg-black/60 px-2 py-1">
                            {heroImages.map((_, n) => (
                              <span key={n} className={'h-1.5 w-1.5 rounded-full ' + (n === slide ? 'bg-white' : 'bg-white/40')} />
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="font-mono text-[11px] text-[var(--foreground)]">
                  Theme: <span className="font-semibold text-[var(--foreground)]">{cur.theme}</span>
                </div>
              </section>

              <div className="row-span-1 flex h-full items-center overflow-x-auto overflow-y-hidden scroll-smooth horizontal-scrollbar">
                <div className="inline-flex items-center gap-4 pr-1">
                  {projects.map((p, idx) => {
                    const active = idx === i;
                    return (
                      <React.Fragment key={p.id}>
                        <button
                          onClick={() => setI(idx)}
                          className={'whitespace-nowrap border-2 px-3 py-1.5 font-mono text-sm transition-[color,border-color,transform] active:scale-[0.96] ' + (active ? 'border-[var(--project-accent)] bg-transparent text-[var(--foreground)]' : 'border-transparent bg-transparent text-[var(--foreground)] hover:text-[var(--foreground)]')}
                          title={p.title}
                        >
                          {p.title}
                        </button>
                        {idx < projects.length - 1 && <span className="h-4 w-px bg-[var(--foreground)]/30" aria-hidden="true" />}
                      </React.Fragment>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== MOBILE LAYOUT ===== */}
      <div className="md:hidden pt-20 pb-8 px-4">
        <h1 className="font-header text-2xl uppercase text-[var(--foreground)] mb-4">
          <span className="opacity-60">Projects ›</span> Engineering Management
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
          {/* Media */}
          <div className="relative aspect-[4/3] w-full card bg-zinc-200 overflow-hidden">
            {numHero > 0 ? (
              <Image key={`mobile-${i}-${slide}`} src={heroImages[slide]} alt={`${cur.title} media ${slide + 1}`} fill className="object-cover" sizes="100vw" priority={slide === 0} />
            ) : (
              <div className="flex h-full w-full items-center justify-center font-mono text-[var(--muted)]">No media available.</div>
            )}
            {pdfMedia.length > 0 && (
              <div className="absolute right-2 top-2 z-20 flex flex-col items-end gap-1.5">
                {pdfMedia.map((pdf, n) => (
                  <a key={pdf} href={pdf} target="_blank" rel="noopener noreferrer" className="icon-pop inline-flex items-center gap-1.5 border border-[var(--border)] bg-[var(--background)]/95 px-2.5 py-1.5 font-mono text-[11px] font-medium uppercase tracking-wide text-[var(--foreground)] backdrop-blur-sm transition-colors active:scale-[0.96] hover:border-[var(--project-accent)] hover:bg-[var(--project-accent)] hover:text-white">
                    <FileText className="h-3.5 w-3.5" />
                    {pdfMedia.length > 1 ? `PDF ${n + 1}` : 'View PDF'}
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </a>
                ))}
              </div>
            )}
            {numHero > 1 && (
              <>
                <button onClick={goSlide(-1)} className="icon-pop absolute left-2 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center bg-black/50 text-white" aria-label="Previous"><ChevronLeft className="h-4 w-4" /></button>
                <button onClick={goSlide(1)} className="icon-pop absolute right-2 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center bg-black/50 text-white" aria-label="Next"><ChevronRight className="h-4 w-4" /></button>
              </>
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
            {cur.outcomes && cur.outcomes.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-3">
                {cur.outcomes.map((o, idx) => (
                  <span key={`m-outcome-${idx}`} className="border border-[var(--border-light)] bg-transparent px-2 py-0.5 text-[10px] font-mono font-bold text-[var(--foreground)]">
                    {o.replace('* ', '')}
                  </span>
                ))}
              </div>
            )}
            <div className="space-y-4 font-body text-sm text-[var(--foreground)]">
              {cur.modules && cur.modules.length > 0 ? (
                cur.modules.map((mod, idx) => (
                  <ModuleRenderer key={`m-${mod}-${idx}`} moduleType={mod} project={cur} />
                ))
              ) : (
                <p>{cur.blurb}</p>
              )}
            </div>
            <div className="mt-3 font-mono text-[11px] text-[var(--muted)]">
              Theme: <span className="font-semibold">{cur.theme}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
