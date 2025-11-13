import MiniProjectCarousel from "@/components/MiniProjectCarousel";
import { Music, Camera, Gamepad2, Plane, Wrench, Mail, Linkedin } from "lucide-react";
import MEProjectsCard from "@/components/MEProjectsCard";
import CreativePursuitsCard from "@/components/CreativePursuitsCard";
import TriBandTimeline from "@/components/TriBandTimeline";
import Link from "next/link";
import Image from "next/image";
import TypewriterEffect from "@/components/TypewriterEffect";
import { getAboutData } from "@/lib/about/getAboutData";
import { getMEProjectsData } from "@/lib/projects/getMEProjectsData";
import { supabaseServer } from "@/lib/supabase/server";

export const runtime = "nodejs";
export const revalidate = 60; // small cache; set to 0 or force-dynamic if you prefer

export default async function Home() {
  // ----- Server-side Supabase (service role) -----
  const supabase = supabaseServer();
  if (!supabase) {
    console.warn("[Home] Supabase server client unavailable. Falling back to safe placeholders.");
  }

  // ----- Fetch core data in parallel -----
  const [aboutData, meProjectsData, photosRows, emProjectsRows, sdProjectsRows] = await Promise.all([
    getAboutData(),
    getMEProjectsData(), // keep this util exactly as-is
    supabase
      ? supabase
          .from("photos")
          .select("id, title, image_url")
          .order("sort_index", { ascending: true })
          .then(({ data }) => data ?? [])
      : Promise.resolve([]),
    supabase
      ? supabase
          .from("em_projects")
          .select("id, title, cover_image_url")
          .eq("confidential", false)
          .order("sort_index", { ascending: true })
          .then(({ data }) => data ?? [])
      : Promise.resolve([]),
    supabase
      ? supabase
          .from("sd_projects")
          .select("id, title, cover_image_url")
          .order("sort_index", { ascending: true })
          .then(({ data }) => data ?? [])
      : Promise.resolve([]),
  ]);

  // ----- Photos (Creative Pursuits) -----
  const creativePhotos: { src: string; alt: string }[] =
    (photosRows || []).map((p: any) => ({
      src: p.image_url,
      alt: p.title ?? "Creative pursuit",
    }));

  const creativeCardPhotos =
    creativePhotos.length > 0
      ? creativePhotos
      : [{ src: "/placeholder.png", alt: "Placeholder photo" }];

  // ----- ME Projects preview (reuse working util’s shape) -----
  const meProjects = meProjectsData.map((p) => ({
    id: p.id,
    title: p.title,
    href: `/projects/mechanical-engineering/${p.id}`,
    imageUrls: p.images, // MEProjectsCard expects imageUrls
    summary: p.blurb,
    role: p.role,
    year: p.year,
    type: p.type,
  }));

  // ----- EM / SD mini carousels -----
  const EM_ITEMS: { title: string; href: string; imageUrl: string | null }[] = (emProjectsRows || []).map(
    (p: any) => ({
      title: p.title,
      href: "/projects/engineering-management",
      imageUrl: p.cover_image_url ?? null,
    })
  );

  const SD_ITEMS: { title: string; href: string; imageUrl: string | null }[] = (sdProjectsRows || []).map(
    (p: any) => ({
      title: p.title,
      href: "/projects/software-design",
      imageUrl: p.cover_image_url ?? null,
    })
  );

  // ----- Skill color mapping for tags -----
  const skillColorMap: Record<string, string> = {};
  aboutData.skills.forEach((group: any) => {
    const color = group.color || "#FFB3BA";
    group.skills.forEach((skill: string) => {
      skillColorMap[skill] = color;
    });
  });

  // Shuffle helper
  const shuffleArray = <T,>(array: T[]): T[] => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  // Flatten all skills with their colors and shuffle
  const allSkillsWithColors = shuffleArray(
    aboutData.skills.flatMap((group: any) =>
      group.skills.map((skill: string) => ({ skill, color: group.color || "#FFB3BA" }))
    )
  );

  // Default tags (names should match your skills if you want color mapping)
  const defaultTags = ["Mechanical Design", "Prototyping", "Strategy", "Manufacturing"];

  // Icon helper + fallbacks
  const toIcon = (name?: string | null) => {
    switch ((name ?? "").toLowerCase()) {
      case "camera":
        return Camera;
      case "gamepad2":
        return Gamepad2;
      case "plane":
        return Plane;
      case "wrench":
        return Wrench;
      case "music":
      default:
        return Music;
    }
  };

  const fallbackInterests = [
    { label: "Music", icon_name: "Music", color: "#FFB3BA" },
    { label: "Camera", icon_name: "Camera", color: "#BAFFC9" },
    { label: "Gaming", icon_name: "Gamepad2", color: "#BAE1FF" },
    { label: "Travel", icon_name: "Plane", color: "#FFFFBA" },
    { label: "Tools", icon_name: "Wrench", color: "#E0BBE4" },
  ];

  return (
    <>
      <TypewriterEffect />
      <div className={`fixed inset-0 h-full w-full overflow-auto bg-[#F0F2E6] text-black`}>
        <section
          className="px-4"
          style={
            {
              "--nav-h": "56px",
              "--gap": "12px",
              "--cols": 6,
              "--rows": 6,
              "--pad": "16px",
              "--tile":
                "min(" +
                "calc((100vw - (2*var(--pad)) - ((var(--cols) - 1) * var(--gap))) / var(--cols))," +
                "calc((100dvh - var(--nav-h) - (2*var(--gap)) - ((calc(var(--rows) - 1)) * var(--gap))) / var(--rows))" +
                ")",
            } as React.CSSProperties
          }
        >
          <div className="pt-[calc(var(--nav-h)+var(--gap))] pb-[var(--gap)]">
            <div
              className="hidden md:grid h-[calc(100dvh-var(--nav-h)-2*var(--gap))] grid-cols-6 [grid-auto-rows:var(--tile)]"
              style={{ gap: "var(--gap)" }}
            >
              {/* ---------- Section 1.1 (LEFT column) ---------- */}
              <section
                className="col-span-3 row-span-5 grid"
                style={{ gap: "var(--gap)", gridTemplateRows: "3fr 2fr 4fr" }}
              >
                {/* 1.1.1 About Me */}
                <div className="relative flex h-full flex-col border border-black p-4 ">
                  <div className="mb-4 flex items-start justify-between">
                    <h3 className="font-header text-3xl uppercase">About Me</h3>
                    <Link
                      href="/about-me"
                      className="border border-black bg-transparent p-1.5 text-black transition-colors hover:border-[#FF4F00] hover:bg-[#FF4F00] hover:text-white"
                      aria-label="Expand About Me"
                    >
                      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M7 17L17 7M17 7H7M17 7V17" />
                      </svg>
                    </Link>
                  </div>
                  <div className="grid items-start gap-4" style={{ gridTemplateColumns: "max-content 1fr" }}>
                    <div className="shrink-0">
                      <div className="relative h-[var(--about-h,7rem)] w-[var(--about-h,7rem)] overflow-hidden border border-black bg-zinc-200">
                        {aboutData.profile.photoUrl ? (
                          <Image src={aboutData.profile.photoUrl} alt="Profile photo" fill className="object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-zinc-400">No photo</div>
                        )}
                      </div>
                    </div>
                    <div className="min-w-0">
                      <p className="font-body text-sm leading-relaxed text-zinc-800 h-[var(--about-h,7rem)] overflow-hidden [display:-webkit-box] [-webkit-line-clamp:5] [-webkit-box-orient:vertical]">
                        {aboutData.profile.bio || "Bio not available"}
                      </p>
                    </div>
                  </div>
                  <div className="mt-auto flex flex-wrap gap-2 pt-4">
                    {defaultTags.map((t) => (
                      <span
                        key={t}
                        className="border border-black/50 bg-transparent px-3 py-1 text-xs font-mono text-black"
                        style={{ backgroundColor: skillColorMap[t] || "#F0F2E6" }}
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                {/* 1.1.2 Skills */}
                <div className="relative flex h-full flex-col border border-black p-4 ">
                  <div className="flex items-start justify-between">
                    <h2 className="font-header text-3xl uppercase">Skills</h2>
                    <Link
                      href="/about-me"
                      className="border border-black bg-transparent p-1.5 text-black transition-colors hover:border-[#FF4F00] hover:bg-[#FF4F00] hover:text-white"
                      aria-label="Expand Skills"
                    >
                      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M7 17L17 7M17 7H7M17 7V17" />
                      </svg>
                    </Link>
                  </div>
                  <div className="mt-2 grid flex-1 grid-cols-[auto,1fr] items-center gap-2">
                    <div className="relative min-w-0">
                      <div className="pointer-events-none absolute inset-y-0 left-0 w-8" />
                      <div className="pointer-events-none absolute inset-y-0 right-0 w-8" />
                      <div
                        aria-label="skills scroller"
                        className="h-8 flex items-center gap-2 pr-10 overflow-x-auto overflow-y-hidden scroll-smooth whitespace-nowrap touch-pan-x [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                      >
                        {allSkillsWithColors.length > 0 ? (
                          allSkillsWithColors.map(({ skill, color }, idx) => (
                            <span
                              key={`${skill}-${idx}`}
                              className="inline-flex h-7 shrink-0 items-center border border-black/50 bg-transparent px-3 text-xs font-mono text-black"
                              style={{ backgroundColor: color }}
                            >
                              {skill}
                            </span>
                          ))
                        ) : (
                          <span className="text-xs text-zinc-400">No skills added yet</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* 1.1.3 bottom row → horizontal split */}
                <div className="grid grid-cols-2" style={{ gap: "var(--gap)" }}>
                  <MiniProjectCarousel items={EM_ITEMS} />
                  <MiniProjectCarousel items={SD_ITEMS} />
                </div>
              </section>

              {/* ---------- Section 1.2 (RIGHT column) ---------- */}
              <section
                className="col-span-3 row-span-5 grid"
                style={{ gap: "var(--gap)", gridTemplateRows: "5fr 2fr" }}
              >
                <MEProjectsCard items={meProjects} />
                <CreativePursuitsCard photos={creativeCardPhotos} />
              </section>

              {/* ---------- Section 2 (BOTTOM band) ---------- */}
              <div className="col-span-1 row-start-6 border border-black p-3 ">
                <div className="grid h-full grid-rows-[auto,1fr]">
                  <h3 className="font-header text-2xl uppercase">Interests</h3>
                  <div className="flex items-center justify-center">
                    <div className="grid grid-cols-5 gap-1.5">
                      {(aboutData.interests.length ? aboutData.interests : fallbackInterests).map((it: any, i: number) => {
                        const Icon = toIcon(it.icon_name);
                        return (
                          <div
                            key={`${it.label}-${i}`}
                            className="flex h-9 w-9 items-center justify-center border border-black/50"
                            style={{ backgroundColor: it.color || "#FFB3BA" }}
                            title={it.label}
                          >
                            <Icon className="h-4 w-4 text-black" />
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-span-4 row-start-6 border border-black p-3 flex flex-col ">
                <h3 className="font-header text-2xl uppercase mb-2">Timeline</h3>
                <div className="flex flex-row h-full items-center">
                  <div className="flex-1">
                    <TriBandTimeline
                      startYear={2020}
                      endYear={2026}
                      topSegments={aboutData.timeline.top}
                      bottomSegments={aboutData.timeline.bottom}
                      yearStyle="axis"
                      pad={15}
                      iconSize={15}
                    />
                  </div>
                </div>
              </div>
              <div className="col-span-1 row-start-6 border border-black p-3 ">
                <div className="grid h-full grid-rows-[auto,1fr]">
                  <h3 className="font-header text-2xl uppercase">Contact</h3>
                  <div className="pt-2 flex items-start justify-start gap-2">
                    {aboutData.contacts.length > 0 ? (
                      aboutData.contacts.map((contact: any) => {
                        const normalizedIcon = contact.icon_name?.toLowerCase().trim() || "";
                        const iconMap: Record<string, typeof Linkedin> = {
                          linkedin: Linkedin,
                          email: Mail,
                          mail: Mail,
                          envelope: Mail,
                        };
                        const IconComponent = iconMap[normalizedIcon] || Linkedin;
                        return (
                          <a
                            key={contact.label}
                            href={contact.url}
                            className="flex h-10 w-10 items-center justify-center border-2 border-black p-2 text-black transition-colors hover:border-[#FF4F00] hover:bg-[#FF4F00] hover:text-white"
                            aria-label={contact.label}
                            title={contact.label}
                          >
                            <IconComponent className="h-5 w-5" />
                          </a>
                        );
                      })
                    ) : (
                      <span className="text-xs text-zinc-400">No contacts</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
            {/* Mobile view with cut corners */}
            <div className="md:hidden space-y-4">
              <div className="border border-black p-4 ">About Me</div>
              <div className="border border-black p-4 ">Skills</div>
              <div className="border border-black p-4 ">Projects</div>
              <div className="border border-black p-4 ">Timeline</div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
