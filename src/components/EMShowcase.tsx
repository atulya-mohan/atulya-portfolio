// src/components/EMShowcase.tsx
"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react";

type Course = {
  id: number;
  name: string;
  code: string | null;
  term: string | null;
  year: number | null;
  sort_index: number | null;
};

type Project = {
  id: number;
  title: string;
  role: string | null;
  year: number | null;
  type: string | null;
  summary: string | null;
  cover_image_url: string | null;
  course_id: number | null;
  confidential: boolean | null;
  sort_index: number | null;
};

export default function EMShowcase({
  courses,
  projects,
}: {
  courses: Course[];
  projects: Project[];
}) {
  const [idx, setIdx] = useState(0);
  const n = Math.max(projects.length, 1);
  const cur = projects[idx % n];

  // Courses grouped with their projects (titles only)
  const byCourse = useMemo(() => {
    const map = new Map<number, { course: Course; projects: Project[] }>();
    for (const c of courses) map.set(c.id, { course: c, projects: [] });
    for (const p of projects) {
      if (p.course_id && map.has(p.course_id)) {
        map.get(p.course_id)!.projects.push(p);
      }
    }
    // keep original course order
    return courses.map((c) => map.get(c.id)!).filter(Boolean);
  }, [courses, projects]);

  const go = (dir: -1 | 1) => () =>
    setIdx((x) => (x + dir + n) % n);

  return (
    <div
      className="
        grid h-full min-w-0 grid-rows-12 gap-4
        rounded-2xl border border-white/10 bg-white/5 p-4
      "
    >
      {/* Row 1: Title inside card */}
      <div className="row-span-1 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-white">Featured</h2>
        <button
          aria-label="Open project"
          className="rounded-full border border-white/10 bg-white/10 p-1.5 text-slate-100 hover:bg-white/15"
          onClick={(e) => e.preventDefault()}
        >
          <ArrowUpRight className="h-4 w-4" />
        </button>
      </div>

      {/* Rows 2..9: Split layout */}
      <div className="row-span-8 grid min-h-0 grid-cols-2 gap-4">
        {/* LEFT: Program context + courses list (scrolls internally if long) */}
        <aside className="flex min-h-0 flex-col rounded-2xl border border-white/10 bg-white/5 p-4">
          <div className="mb-2 flex items-baseline justify-between">
            <h3 className="text-base font-semibold text-white">Program</h3>
            <span className="text-xs text-slate-300/80">CMU • ETIM</span>
          </div>

          <div className="mb-3 text-sm text-slate-300/90">
            Course-anchored overview of Engineering Management projects.
          </div>

          <div className="mt-1 flex-1 overflow-auto pr-2
              [scrollbar-width:thin] [scrollbar-color:rgba(255,255,255,.28)_transparent]
              [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent
              [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-white/20
              hover:[&::-webkit-scrollbar-thumb]:bg-white/30
          ">
            {byCourse.length ? (
              <ul className="space-y-3">
                {byCourse.map(({ course, projects }) => (
                  <li
                    key={course.id}
                    className="rounded-xl border border-white/10 bg-white/5 p-3"
                  >
                    <div className="mb-1 flex items-center justify-between">
                      <p className="text-sm font-medium text-white">
                        {course.name}
                      </p>
                      <span className="text-[10px] text-slate-300/80">
                        {course.term ?? ""} {course.year ?? ""}
                      </span>
                    </div>
                    {/* project links (titles only) */}
                    <div className="flex flex-wrap gap-2">
                      {projects.length ? (
                        projects.map((p) => (
                          <button
                            key={p.id}
                            onClick={() =>
                              setIdx(Math.max(0, projectsIndexOf(projects, p.id)))
                            }
                            className={
                              "rounded-lg border px-2 py-1 text-xs transition " +
                              (p.id === cur.id
                                ? "border-white/40 bg-white/15 text-white"
                                : "border-white/10 bg-white/5 text-slate-200 hover:bg-white/10")
                            }
                            title={p.title}
                          >
                            {p.title}
                          </button>
                        ))
                      ) : (
                        <span className="text-xs text-slate-400">
                          (no projects linked)
                        </span>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="rounded-xl border border-white/10 bg-white/5 p-3 text-sm text-slate-300/90">
                Add EM courses in Supabase to populate this panel.
              </div>
            )}
          </div>
        </aside>

        {/* RIGHT: Featured project (image + quick facts + summary) */}
        <section className="relative min-h-0 rounded-2xl border border-white/10 bg-white/5 p-3">
          <div className="relative h-full w-full overflow-hidden rounded-xl border border-white/10 bg-white/10">
            {/* Image (cover) */}
            {cur?.cover_image_url ? (
              <Image
                src={cur.cover_image_url}
                alt={cur.title}
                fill
                className="object-cover"
              />
            ) : (
              <div className="absolute inset-0 bg-white/10" />
            )}

            {/* Legibility gradient + overlay title chip */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/35 via-black/10 to-transparent" />
            <div className="pointer-events-none absolute left-3 top-3 z-10">
              <span className="rounded-md bg-black/60 px-2 py-1 text-xs font-semibold text-white shadow-[0_0_6px_rgba(0,0,0,0.35)]">
                {cur?.title}
              </span>
            </div>

            {/* Quick pills (role/year/type) pinned bottom-left */}
            <div className="absolute bottom-3 left-3 z-10 flex flex-wrap gap-1">
              {cur?.role && <Pill>{cur.role}</Pill>}
              {cur?.year != null && <Pill>{String(cur.year)}</Pill>}
              {cur?.type && <Pill>{cur.type}</Pill>}
            </div>

            {/* Prev/Next within EM list */}
            {n > 1 && (
              <>
                <button
                  onClick={go(-1)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full border border-white/25 bg-black/40 p-1 backdrop-blur-md opacity-90 hover:opacity-100"
                  aria-label="Previous project"
                >
                  <ChevronLeft className="h-5 w-5 text-white" />
                </button>
                <button
                  onClick={go(1)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full border border-white/25 bg-black/40 p-1 backdrop-blur-md opacity-90 hover:opacity-100"
                  aria-label="Next project"
                >
                  <ChevronRight className="h-5 w-5 text-white" />
                </button>
              </>
            )}
          </div>

          {/* Summary strip below the image, but still inside this right column */}
          <div className="mt-3 rounded-md border border-white/10 bg-white/5 px-3 py-2">
            <p className="line-clamp-3 text-sm text-slate-200/90">
              {cur?.summary ?? "Short description for the selected project."}
            </p>
          </div>
        </section>
      </div>

      {/* Rows 10..12: Bottom horizontal title-only scroller */}
      <div className="row-span-3 rounded-2xl border border-white/10 bg-white/5 p-3 min-w-0 overflow-hidden">
        <div className="group/strip h-full w-full overflow-x-auto overflow-y-hidden scroll-smooth
            [scrollbar-width:none] [&::-webkit-scrollbar]:h-2
            [&::-webkit-scrollbar-thumb]:bg-transparent
            [&::-webkit-scrollbar-thumb]:rounded-full
            group-hover/strip:[&::-webkit-scrollbar-thumb]:bg-white/30
          "
        >
          <div className="inline-flex h-full items-center gap-2 pr-2">
            {projects.map((p, i) => (
              <button
                key={p.id}
                onClick={() => setIdx(i)}
                className={
                  "shrink-0 rounded-xl border px-3 py-2 text-sm transition " +
                  (i === idx
                    ? "border-white/40 bg-white/15 text-white"
                    : "border-white/10 bg-white/5 text-slate-200 hover:bg-white/10")
                }
                title={p.title}
              >
                {p.title}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-lg border border-white/20 bg-black/40 px-2 py-0.5 text-[11px] text-white backdrop-blur-sm">
      {children}
    </span>
  );
}

function projectsIndexOf(list: Project[], id: number) {
  for (let i = 0; i < list.length; i++) if (list[i].id === id) return i;
  return 0;
}
