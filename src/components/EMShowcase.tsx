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

  const byCourse = useMemo(() => {
    const map = new Map<number, { course: Course; projects: Project[] }>();
    for (const c of courses) map.set(c.id, { course: c, projects: [] });
    for (const p of projects) {
      if (p.course_id && map.has(p.course_id)) {
        map.get(p.course_id)!.projects.push(p);
      }
    }
    return courses.map((c) => map.get(c.id)!).filter(Boolean);
  }, [courses, projects]);

  const go = (dir: -1 | 1) => () =>
    setIdx((x) => (x + dir + n) % n);

  return (
    <div className="grid h-full min-w-0 grid-rows-12 gap-3 border border-[var(--border)] bg-[var(--card-bg)] p-4">
      {/* Row 1: Title */}
      <div className="row-span-1 flex items-center justify-between">
        <h2 className="font-header text-xl uppercase">Featured</h2>
        <button
          aria-label="Open project"
          className="icon-pop relative border border-[var(--border)] bg-transparent p-1.5 transition-colors after:absolute after:left-1/2 after:top-1/2 after:h-10 after:w-10 after:-translate-x-1/2 after:-translate-y-1/2 after:content-[''] hover:border-[var(--accent)] hover:bg-[var(--accent)] hover:text-white"
          onClick={(e) => e.preventDefault()}
        >
          <ArrowUpRight className="h-4 w-4" />
        </button>
      </div>

      {/* Rows 2..9: Split layout */}
      <div className="row-span-8 grid min-h-0 grid-cols-2 gap-3">
        {/* LEFT: Courses list */}
        <aside className="flex min-h-0 flex-col border border-[var(--border)] p-4">
          <div className="mb-2 flex items-baseline justify-between">
            <h3 className="font-header text-base uppercase">Program</h3>
            <span className="text-xs font-mono text-[var(--muted)]">CMU / ETIM</span>
          </div>

          <p className="mb-3 text-sm text-[var(--muted)]">
            Course-anchored overview of Engineering Management projects.
          </p>

          <div className="mt-1 flex-1 overflow-auto pr-2 content-scrollbar">
            {byCourse.length ? (
              <ul className="space-y-3">
                {byCourse.map(({ course, projects: courseProjects }) => (
                  <li key={course.id} className="border border-[var(--border)] p-3">
                    <div className="mb-1 flex items-center justify-between">
                      <p className="text-sm font-mono font-bold">{course.name}</p>
                      <span className="text-[10px] font-mono text-[var(--muted)]">
                        {course.term ?? ""} {course.year ?? ""}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {courseProjects.length ? (
                        courseProjects.map((p) => (
                          <button
                            key={p.id}
                            onClick={() =>
                              setIdx(Math.max(0, projectsIndexOf(projects, p.id)))
                            }
                            className={
                              "border px-2 py-1 text-xs font-mono transition-[color,background-color,border-color,transform] active:scale-[0.96] " +
                              (p.id === cur.id
                                ? "border-[var(--accent)] bg-[var(--accent)] text-white"
                                : "border-[var(--border)] hover:border-[var(--accent)] hover:bg-[var(--accent)] hover:text-white")
                            }
                            title={p.title}
                          >
                            {p.title}
                          </button>
                        ))
                      ) : (
                        <span className="text-xs text-[var(--muted)]">(no projects linked)</span>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="border border-[var(--border)] p-3 text-sm text-[var(--muted)]">
                No courses linked yet.
              </div>
            )}
          </div>
        </aside>

        {/* RIGHT: Featured project image */}
        <section className="relative min-h-0 border border-[var(--border)] p-3">
          <div className="relative h-full w-full overflow-hidden border border-[var(--border)] bg-zinc-200">
            {cur?.cover_image_url ? (
              <Image
                src={cur.cover_image_url}
                alt={cur.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 50vw, 33vw"
              />
            ) : (
              <div className="absolute inset-0 bg-zinc-200" />
            )}

            <div className="pointer-events-none absolute left-0 top-0 z-10 bg-[var(--foreground)] px-2 py-1">
              <span className="font-mono text-xs font-medium text-[var(--background)]">{cur?.title}</span>
            </div>

            <div className="absolute bottom-0 left-0 z-10 flex flex-wrap gap-1 p-2">
              {cur?.role && <Pill>{cur.role}</Pill>}
              {cur?.year != null && <Pill>{String(cur.year)}</Pill>}
              {cur?.type && <Pill>{cur.type}</Pill>}
            </div>

            {n > 1 && (
              <>
                <button
                  onClick={go(-1)}
                  className="icon-pop absolute left-2 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center bg-black/50 text-white transition-colors hover:bg-[var(--accent)]"
                  aria-label="Previous project"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  onClick={go(1)}
                  className="icon-pop absolute right-2 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center bg-black/50 text-white transition-colors hover:bg-[var(--accent)]"
                  aria-label="Next project"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </>
            )}
          </div>

          <div className="mt-2 border border-[var(--border)] px-3 py-2">
            <p className="line-clamp-3 text-sm font-body text-[var(--muted)]">
              {cur?.summary ?? "Short description for the selected project."}
            </p>
          </div>
        </section>
      </div>

      {/* Bottom scroller */}
      <div className="row-span-3 border border-[var(--border)] p-3 min-w-0 overflow-hidden">
        <div className="h-full w-full overflow-x-auto overflow-y-hidden scroll-smooth content-scrollbar">
          <div className="inline-flex h-full items-center gap-2 pr-2">
            {projects.map((p, i) => (
              <button
                key={p.id}
                onClick={() => setIdx(i)}
                className={
                  "shrink-0 border px-3 py-2 text-sm font-mono transition-[color,background-color,border-color,transform] active:scale-[0.96] " +
                  (i === idx
                    ? "border-[var(--accent)] bg-[var(--accent)] text-white"
                    : "border-[var(--border)] hover:border-[var(--accent)] hover:bg-[var(--accent)] hover:text-white")
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
    <span className="inline-flex items-center border border-[var(--border-light)] bg-black/60 px-2 py-0.5 text-[11px] font-mono text-white">
      {children}
    </span>
  );
}

function projectsIndexOf(list: Project[], id: number) {
  for (let i = 0; i < list.length; i++) if (list[i].id === id) return i;
  return 0;
}
