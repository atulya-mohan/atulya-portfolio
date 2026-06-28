import { getContactIcon } from "@/lib/contact-icons";
import CareerDatasheet from "@/components/CareerDatasheet";
import AnimatedSection from "@/components/AnimatedSection";
import SkillsMarquee from "@/components/SkillsMarquee";
import MEHeroCarousel from "@/components/MEHeroCarousel";
import EMProjectCarousel from "@/components/EMProjectCarousel";
import TypewriterEffect from "@/components/TypewriterEffect";
import Link from "next/link";
import Image from "next/image";
import { getAboutData } from "@/lib/about/getAboutData";
import { getMEProjectsData } from "@/lib/projects/getMEProjectsData";
import { blurDataURLs } from "@/lib/blur-utils";

import type { EMProjectData, SDProjectData } from "@/lib/types";
import emProjectsJson from "@/data/em-projects.json";
import sdProjectsJson from "@/data/sd-projects.json";

const emProjects = emProjectsJson as EMProjectData[];
const sdProjects = sdProjectsJson as SDProjectData[];

export default function Home() {
  const aboutData = getAboutData();

  const meProjectsData = getMEProjectsData();
  const meProjects = meProjectsData.slice(0, 4).map((p) => ({
    id: p.id,
    title: p.title,
    href: `/projects/mechanical-engineering#${p.id}`,
    imageUrl: p.images?.[0] || null,
    summary: p.blurb,
    role: p.role,
    year: p.year,
    type: p.type,
  }));

  const emItems = emProjects.filter(p => !p.confidential).map(p => ({
    title: p.title,
    href: `/projects/engineering-management#${p.id}`,
    imageUrl: p.cover_image_url,
    summary: p.blurb,
  }));

  const sdItems = sdProjects.map(p => ({
    title: p.title,
    href: `/projects/software-design#${p.id}`,
    imageUrl: p.cover_image_url,
    summary: p.blurb,
  }));

  const allSkills = aboutData.skills.flatMap(group =>
    group.skills.map(skill => ({ skill, color: group.color || '#FFB3BA' }))
  );

  const shortBio = aboutData.profile.bio
    ? aboutData.profile.bio.split('. ').slice(0, 3).join('. ') + '.'
    : '';

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <TypewriterEffect />

      {/* ═══════════════════════════════════════════════════════════
          HERO — Full-bleed film photograph
          ═══════════════════════════════════════════════════════════ */}
      <section className="relative h-screen w-full overflow-hidden">
        <Image
          src="/images/photos/my-best-shot.jpg"
          alt="Mount Rainier valley at golden hour"
          fill
          className="object-cover object-center"
          priority
          sizes="100vw"
          quality={85}
          placeholder="blur"
          blurDataURL={blurDataURLs.heroPhoto}
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-transparent" />

        <div className="absolute inset-x-0 top-0 pt-24 md:pt-28 px-6 md:px-12 lg:px-20">
          <h1 className="font-header text-6xl uppercase tracking-tight text-white md:text-8xl lg:text-[7rem] leading-[0.85]">
            Atulya<br />Mohan
          </h1>
          <div className="w-12 h-[3px] bg-[var(--accent)] mt-4 mb-3" />
          <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-white/70">
            Mechanical Engineer &bull; Product Developer &bull; CMU ETIM
          </p>
        </div>

        <div className="absolute bottom-0 left-0 px-6 pb-8 md:px-12 md:pb-12 lg:px-20">
          <p className="font-body text-base text-white/90 max-w-md leading-relaxed mb-4">
            I design hardware, manage engineering teams, and build software on the side.
          </p>
          <div className="flex items-center gap-3">
            {aboutData.contacts.map((contact) => {
              const IC = getContactIcon(contact.icon_name);
              return (
                <a key={contact.label} href={contact.url} target="_blank" rel="noopener noreferrer"
                  className="icon-pop flex h-9 w-9 items-center justify-center border border-white/50 text-white transition-colors hover:border-white hover:bg-white hover:text-black"
                  aria-label={contact.label}>
                  <IC className="h-4 w-4" />
                </a>
              );
            })}
            <Link href="/resume"
              className="btn-press flex h-9 items-center bg-[var(--accent)] px-5 font-mono text-xs uppercase tracking-widest text-white transition-opacity hover:opacity-90">
              Resume
            </Link>
          </div>
        </div>

        <div className="absolute bottom-8 right-6 md:right-12 lg:right-20 flex flex-col items-center gap-2 [writing-mode:vertical-rl]">
          <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/50">scroll</span>
          <span className="block h-8 w-px bg-white/40 animate-pulse" />
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          ABOUT
          ═══════════════════════════════════════════════════════════ */}
      <AnimatedSection className="mx-auto max-w-7xl px-6 py-20 md:px-12 md:py-28">
        <div className="grid gap-8 md:grid-cols-[140px_1fr] md:gap-10 items-start">
          <div className="relative h-36 w-36 overflow-hidden border border-[var(--border)] md:h-[160px] md:w-full">
            {aboutData.profile.photoUrl && (
              <Image src={aboutData.profile.photoUrl} alt="Atulya Mohan" fill className="object-cover" sizes="160px" placeholder="blur" blurDataURL={blurDataURLs.profilePhoto} />
            )}
          </div>
          <div>
            <p className="font-body text-lg leading-[1.8] md:text-xl md:leading-[1.8] max-w-[60ch]">
              {shortBio}
            </p>
            <Link href="/about-me" className="link-underline mt-4 inline-block font-mono text-xs uppercase tracking-widest text-[var(--accent)]">
              Full bio &rarr;
            </Link>
          </div>
        </div>
      </AnimatedSection>

      {/* ═══════════════════════════════════════════════════════════
          SKILLS — Two-row marquee, opposite directions
          ═══════════════════════════════════════════════════════════ */}
      <SkillsMarquee skills={allSkills} />

      {/* ═══════════════════════════════════════════════════════════
          MECHANICAL ENGINEERING — Hero carousel + arrows
          Limited to 4 projects
          ═══════════════════════════════════════════════════════════ */}
      <AnimatedSection className="project-me px-6 pt-20 pb-10 md:px-12 md:pt-28 md:pb-16">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-end justify-between mb-8">
            <div>
              <span className="font-mono text-[10px] uppercase tracking-widest text-[var(--project-accent)] block mb-1">01</span>
              <h2 className="font-header text-4xl uppercase tracking-tight md:text-5xl">Mechanical Engineering</h2>
            </div>
            <Link href="/projects/mechanical-engineering" className="link-underline font-mono text-sm uppercase tracking-wider text-[var(--project-accent)]">
              View All &rarr;
            </Link>
          </div>

          <MEHeroCarousel projects={meProjects} />
        </div>
      </AnimatedSection>

      {/* ═══════════════════════════════════════════════════════════
          ENGINEERING MANAGEMENT — 3-item carousel
          ═══════════════════════════════════════════════════════════ */}
      <AnimatedSection className="project-em px-6 py-10 md:px-12 md:py-16">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-end justify-between mb-8">
            <div>
              <span className="font-mono text-[10px] uppercase tracking-widest text-[var(--project-accent)] block mb-1">02</span>
              <h2 className="font-header text-3xl uppercase tracking-tight md:text-4xl">Engineering Management</h2>
            </div>
            <Link href="/projects/engineering-management" className="link-underline font-mono text-sm uppercase tracking-wider text-[var(--project-accent)]">
              View All &rarr;
            </Link>
          </div>

          <EMProjectCarousel items={emItems} />
        </div>
      </AnimatedSection>

      {/* ═══════════════════════════════════════════════════════════
          SOFTWARE DESIGN — Featured spotlight
          ═══════════════════════════════════════════════════════════ */}
      <AnimatedSection className="project-sd px-6 py-10 md:px-12 md:py-16">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-end justify-between mb-8">
            <div>
              <span className="font-mono text-[10px] uppercase tracking-widest text-[var(--project-accent)] block mb-1">03</span>
              <h2 className="font-header text-3xl uppercase tracking-tight md:text-4xl">Software Design</h2>
            </div>
            <Link href="/projects/software-design" className="link-underline font-mono text-sm uppercase tracking-wider text-[var(--project-accent)]">
              View All &rarr;
            </Link>
          </div>

          {sdItems[0] && (
            <Link
              href={sdItems[0].href}
              className="group block border border-[var(--border)] overflow-hidden transition-[border-color,transform] hover:border-[var(--project-accent)] active:scale-[0.96]"
            >
              <div className="grid md:grid-cols-[3fr_2fr]">
                {/* Cover image */}
                <div className="relative aspect-[16/10] md:aspect-auto md:min-h-[320px] overflow-hidden">
                  {sdItems[0].imageUrl && (sdItems[0].imageUrl.startsWith('/') || sdItems[0].imageUrl.startsWith('http')) && (
                    <Image
                      src={sdItems[0].imageUrl}
                      alt={sdItems[0].title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                      sizes="(max-width: 768px) 100vw, 60vw"
                      placeholder="blur"
                      blurDataURL={blurDataURLs.sdCover}
                    />
                  )}
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/30 to-transparent md:bg-gradient-to-r md:from-transparent md:to-black/20" />
                </div>

                {/* Text panel */}
                <div className="p-6 md:p-8 lg:p-10 flex flex-col justify-center">
                  <span className="font-mono text-[10px] uppercase tracking-widest text-[var(--project-accent)] mb-3">
                    Featured Project
                  </span>
                  <h3 className="font-header text-2xl md:text-3xl uppercase text-[var(--foreground)] leading-[0.95]">
                    {sdItems[0].title}
                  </h3>
                  {sdItems[0].summary && (
                    <p className="font-body text-sm text-[var(--muted)] mt-3 leading-relaxed max-w-[45ch]">
                      {sdItems[0].summary}
                    </p>
                  )}
                  <span className="mt-5 inline-block font-mono text-xs uppercase tracking-widest text-[var(--project-accent)] group-hover:underline">
                    View Project &rarr;
                  </span>
                </div>
              </div>

              <div className="h-[2px] bg-[var(--project-accent)] scale-x-0 origin-left transition-transform duration-300 group-hover:scale-x-100" />
            </Link>
          )}

          {/* Additional SD projects (if more than one) */}
          {sdItems.length > 1 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
              {sdItems.slice(1).map((item, idx) => (
                <Link
                  key={idx}
                  href={item.href}
                  className="group relative overflow-hidden border border-[var(--border)] transition-[border-color,transform] hover:border-[var(--project-accent)] active:scale-[0.96]"
                >
                  <div className="relative aspect-[16/10] overflow-hidden">
                    {item.imageUrl && (item.imageUrl.startsWith('/') || item.imageUrl.startsWith('http')) && (
                      <Image
                        src={item.imageUrl}
                        alt={item.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        placeholder="blur"
                        blurDataURL={blurDataURLs.sdCover}
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <h3 className="font-header text-sm uppercase text-white leading-tight">{item.title}</h3>
                    </div>
                  </div>
                  {item.summary && (
                    <div className="p-3">
                      <p className="font-mono text-[10px] text-[var(--muted)] line-clamp-2 leading-relaxed">{item.summary}</p>
                    </div>
                  )}
                  <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[var(--project-accent)] scale-x-0 origin-left transition-transform duration-300 group-hover:scale-x-100" />
                </Link>
              ))}
            </div>
          )}
        </div>
      </AnimatedSection>

      {/* ═══════════════════════════════════════════════════════════
          TIMELINE — Career rendered as a dimensioned mechanical drawing
          ═══════════════════════════════════════════════════════════ */}
      <AnimatedSection className="border-t border-[var(--border-light)] px-6 pt-20 pb-12 md:px-12 md:pt-28 md:pb-16">
        <div className="mx-auto max-w-7xl">
          <CareerDatasheet fullStoryHref="/about-me" />
        </div>
      </AnimatedSection>

      {/* ═══════════════════════════════════════════════════════════
          FOOTER
          ═══════════════════════════════════════════════════════════ */}
      <footer className="border-t border-[var(--border)] px-6 py-8 md:px-12 md:py-10">
        <div className="mx-auto max-w-7xl flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          {/* Left — name + tagline */}
          <div className="flex items-baseline gap-3">
            <h2 className="font-header text-xl uppercase tracking-tight md:text-2xl leading-none">
              Atulya Mohan
            </h2>
            <span className="hidden md:inline font-mono text-[10px] uppercase tracking-widest text-[var(--muted)]">
              Engineer &bull; Builder &bull; CMU&nbsp;ETIM
            </span>
          </div>

          {/* Center — social icons */}
          <div className="flex items-center gap-2">
            {aboutData.contacts.map((contact) => {
              const IC = getContactIcon(contact.icon_name);
              return (
                <a key={contact.label} href={contact.url} target="_blank" rel="noopener noreferrer"
                  className="icon-pop flex h-9 w-9 items-center justify-center border border-[var(--border)] text-[var(--muted)] transition-colors hover:bg-[var(--accent)] hover:border-[var(--accent)] hover:text-white"
                  aria-label={contact.label}>
                  <IC className="h-4 w-4" />
                </a>
              );
            })}
            <a href="mailto:mohan.atulya26@gmail.com"
              className="link-underline ml-2 font-mono text-xs text-[var(--muted)] hover:text-[var(--accent)] transition-colors">
              mohan.atulya26@gmail.com
            </a>
          </div>

          {/* Right — copyright */}
          <p className="font-mono text-[10px] text-[var(--muted)] md:text-right">
            &copy; {new Date().getFullYear()}
          </p>
        </div>
      </footer>
    </div>
  );
}
