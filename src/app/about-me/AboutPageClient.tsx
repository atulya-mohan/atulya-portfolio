// src/app/about-me/AboutPageClient.tsx
'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'motion/react';
import { Linkedin, Mail, Music, Camera, Gamepad2, Plane, Wrench, X } from 'lucide-react';
import TriBandTimeline from '@/components/TriBandTimeline';
import SkillsAccordion from '@/components/SkillsAccordion';
import type { TimelineSeg, TimelineEducation, TimelineExperience, Interest, ContactLink, SkillGroup } from '@/lib/types';

interface AboutData {
  profile: {
    name: string | null;
    bio: string | null;
    photoUrl: string | null;
  };
  timeline: {
    top: TimelineSeg[];
    bottom: TimelineSeg[];
  };
  skills: SkillGroup[];
  interests: Interest[];
  contacts: ContactLink[];
}

interface AboutPageClientProps {
  aboutData: AboutData;
  skillsGroups: Record<string, { skills: string[]; color: string }>;
  fallbackInterests: Interest[];
}

export default function AboutPageClient({ aboutData, skillsGroups, fallbackInterests }: AboutPageClientProps) {
  const [selectedSegment, setSelectedSegment] = useState<TimelineSeg | null>(null);

  // Safely destructure with defaults to prevent errors
  const profile = aboutData?.profile ?? { name: null, bio: null, photoUrl: null };
  const timeline = aboutData?.timeline ?? { top: [], bottom: [] };
  const interests = aboutData?.interests ?? [];
  const contacts = aboutData?.contacts ?? [];

  const profilePhoto = profile?.photoUrl ?? '/images/profile/profile.jpg';
  const fullBio = profile?.bio ?? 'Bio not available';

  const contactIcon = (name?: string | null) => {
    switch ((name ?? '').toLowerCase()) {
      case 'linkedin': return Linkedin;
      case 'mail':
      case 'email':    return Mail;
      default:         return Mail;
    }
  };

  const toIcon = (name?: string | null) => {
    switch ((name ?? '').toLowerCase()) {
      case 'camera':   return Camera;
      case 'gamepad2': return Gamepad2;
      case 'plane':    return Plane;
      case 'wrench':   return Wrench;
      case 'music':
      default:         return Music;
    }
  };

  const handleSegmentClick = (segment: TimelineSeg | { id?: string; start: string; end?: string | null; label?: string | null; logo_url?: string | null; type?: string | null; details?: TimelineEducation | TimelineExperience | null }) => {
    setSelectedSegment(segment as TimelineSeg);
  };

  // Compact detail popup that lives INSIDE the timeline box (absolute inset-0).
  const renderTimelinePopup = () => {
    if (!selectedSegment) return null;

    const details = selectedSegment.details;
    const isEducation = selectedSegment.type === 'education';
    const edu = isEducation ? (details as TimelineEducation | null) : null;
    const exp = !isEducation ? (details as TimelineExperience | null) : null;

    const subtitle = isEducation ? edu?.degree : exp?.position;
    const bullets = (isEducation ? edu?.achievements : exp?.responsibilities) ?? [];
    const technologies = exp?.technologies ?? [];
    const location = details?.location;
    const description = details?.description;
    const endLabel = selectedSegment.end ? selectedSegment.end : 'Present';

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.18, ease: 'easeOut' }}
        className="absolute inset-0 z-20 flex flex-col bg-[var(--background)] border-2 border-[var(--border)]"
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-2 border-b border-[var(--border)] px-3 py-2 shrink-0">
          <div className="flex items-center gap-2.5 min-w-0">
            {selectedSegment.logo_url && (
              <span
                className="flex h-9 w-9 shrink-0 items-center justify-center border border-[var(--border)] p-[3px]"
                style={{ background: selectedSegment.logo_bg ?? '#ffffff' }}
              >
                <Image src={selectedSegment.logo_url} alt="" width={24} height={24} className="h-full w-full object-contain" />
              </span>
            )}
            <div className="min-w-0">
              <h3 className="font-header text-base lg:text-lg uppercase leading-none truncate">{selectedSegment.label}</h3>
              {subtitle && <p className="font-mono text-[10px] text-[var(--muted)] mt-1 leading-tight line-clamp-2">{subtitle}</p>}
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span className="hidden md:block font-mono text-[10px] text-[var(--muted)] whitespace-nowrap">{selectedSegment.start} – {endLabel}</span>
            <button
              onClick={() => setSelectedSegment(null)}
              className="icon-pop flex h-10 w-10 items-center justify-center border border-[var(--border)] hover:bg-[var(--accent)] hover:border-[var(--accent)] hover:text-white transition-colors"
              aria-label="Close detail"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 min-h-0 overflow-auto px-3 py-2.5 vertical-scrollbar">
          {location && (
            <p className="font-mono text-[10px] uppercase tracking-wide text-[var(--muted)] mb-2">
              {location} · {selectedSegment.start}–{endLabel}
            </p>
          )}
          {description && (
            <p className="font-mono text-[11px] leading-relaxed text-[var(--foreground)]">{description}</p>
          )}
          {bullets.length > 0 && (
            <ul className="mt-2.5 space-y-1.5">
              {bullets.map((b, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="mt-[6px] h-1 w-1 shrink-0 bg-[var(--accent)]" />
                  <span className="font-mono text-[11px] leading-snug text-[var(--foreground)]">{b}</span>
                </li>
              ))}
            </ul>
          )}
          {technologies.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {technologies.map((t, idx) => (
                <span key={idx} className="border border-[var(--border)] px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-wide text-[var(--foreground)]">
                  {t}
                </span>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen md:fixed md:inset-0 md:h-full md:w-full md:overflow-hidden bg-[var(--background)] text-[var(--foreground)]">
      {/* ===== DESKTOP LAYOUT ===== */}
      <section
        className="hidden md:block px-4"
        style={{
          '--gap': '12px',
          '--cols': 6,
          '--rows': 6,
          '--pad': '16px',
          '--tile': 'min(calc((100vw - (2*var(--pad)) - ((var(--cols)-1)*var(--gap)))/var(--cols)),calc((100dvh - var(--nav-h) - (2*var(--gap)) - ((calc(var(--rows) - 1))*var(--gap)))/var(--rows)))',
        } as React.CSSProperties}
      >
        <div className="pt-[calc(var(--nav-h)+var(--gap))] pb-[var(--gap)]">
          <div
            className="grid h-[calc(100dvh-var(--nav-h)-2*var(--gap))] grid-cols-6 [grid-auto-rows:var(--tile)]"
            style={{ gap: 'var(--gap)' }}
          >
            {/* Profile Photo */}
            <div className="col-span-1 row-span-1 card p-1">
              <div className="img-outline relative h-full w-full overflow-hidden bg-zinc-200">
                <Image
                  src={profilePhoto}
                  alt={profile?.name ?? 'Profile photo'}
                  fill
                  className="object-cover"
                  sizes="16vw"
                />
              </div>
            </div>

            {/* Contact + Interests */}
            <div className="col-span-1 row-span-1 grid" style={{ gap: 'var(--gap)', gridTemplateRows: '1fr 1fr' }}>
              <div className="card p-3">
                <h3 className="mb-2 font-header text-lg lg:text-2xl uppercase">Contact Me</h3>
                <div className="flex items-center gap-2">
                  {((contacts && contacts.length > 0) ? contacts : [
                    { label: 'LinkedIn', url: 'https://www.linkedin.com/', icon_name: 'Linkedin' },
                    { label: 'Email', url: 'mailto:you@example.com', icon_name: 'Mail' },
                  ]).map((c: ContactLink) => {
                    const Icon = contactIcon(c.icon_name);
                    return (
                      <Link
                        key={c.label}
                        href={c.url}
                        className="icon-pop inline-flex h-10 w-10 items-center justify-center border border-[var(--border)] text-[var(--foreground)] transition-colors hover:bg-[var(--accent)] hover:border-[var(--accent)] hover:text-white"
                        aria-label={c.label}
                      >
                        <Icon className="h-5 w-5" />
                      </Link>
                    );
                  })}
                </div>
              </div>

              <div className="card p-3">
                <h3 className="mb-2 font-header text-lg lg:text-2xl uppercase">Interests</h3>
                <div className="grid grid-cols-5 gap-1.5">
                  {((interests && interests.length > 0) ? interests : fallbackInterests).map((it: Interest, i: number) => {
                    const Icon = toIcon(it.icon_name);
                    return (
                      <div
                        key={`${it.label}-${i}`}
                        className="flex h-9 w-9 items-center justify-center border border-[var(--border)]/50"
                        style={{ backgroundColor: it.color || '#FFB3BA' }}
                        title={it.label}
                      >
                        <Icon className="h-4 w-4 text-gray-900" />
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Timeline */}
            <div className="col-span-4 row-span-1 card-elevated p-3 flex flex-col relative">
              <h2 className="font-header text-2xl lg:text-4xl uppercase">Career Timeline</h2>
              <div className="flex flex-row h-full items-center">
                <div className="flex-1">
                  <TriBandTimeline
                    startYear={2020}
                    endYear={2027}
                    topSegments={timeline?.top ?? []}
                    bottomSegments={timeline?.bottom ?? []}
                    yearStyle="axis"
                    pad={25}
                    iconSize={25}
                    onSegmentClick={handleSegmentClick}
                  />
                </div>
              </div>
              {renderTimelinePopup()}
            </div>

            {/* Skills */}
            <div className="col-span-2 row-span-5 card-elevated p-4">
              <h2 className="mb-3 font-header text-2xl lg:text-4xl uppercase">Skills</h2>
              <SkillsAccordion groups={skillsGroups} />
            </div>

            {/* Bio */}
            <div className="col-span-4 row-span-5 card-elevated p-4 flex flex-col">
              <h2 className="mb-2 font-header text-2xl lg:text-4xl uppercase">Bio</h2>
              <div className="flex-1 min-h-0 overflow-auto pr-1 vertical-scrollbar">
                <p className="text-[var(--foreground)] leading-relaxed text-xs lg:text-sm font-mono whitespace-pre-line">
                  {fullBio}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== MOBILE LAYOUT ===== */}
      <div className="md:hidden pt-20 pb-8 px-4 space-y-4">
        {/* Profile + Name */}
        <div className="card p-4">
          <div className="flex items-center gap-4">
            <div className="relative h-20 w-20 shrink-0 overflow-hidden card">
              <Image
                src={profilePhoto}
                alt={profile?.name ?? 'Profile photo'}
                fill
                className="object-cover"
                sizes="80px"
              />
            </div>
            <div>
              <h1 className="font-header text-2xl uppercase leading-tight">{profile?.name ?? 'Atulya Mohan'}</h1>
              <div className="flex items-center gap-2 mt-2">
                {((contacts && contacts.length > 0) ? contacts : [
                  { label: 'LinkedIn', url: 'https://www.linkedin.com/', icon_name: 'Linkedin' },
                  { label: 'Email', url: 'mailto:you@example.com', icon_name: 'Mail' },
                ]).map((c: ContactLink) => {
                  const Icon = contactIcon(c.icon_name);
                  return (
                    <Link
                      key={`mobile-${c.label}`}
                      href={c.url}
                      className="icon-pop inline-flex h-8 w-8 items-center justify-center border border-[var(--border)] text-[var(--foreground)] transition-colors hover:bg-[var(--accent)] hover:border-[var(--accent)] hover:text-white"
                      aria-label={c.label}
                    >
                      <Icon className="h-4 w-4" />
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Bio */}
        <div className="card p-4">
          <h2 className="mb-2 font-header text-2xl uppercase">Bio</h2>
          <p className="text-[var(--foreground)] leading-relaxed text-sm font-mono whitespace-pre-line">
            {fullBio}
          </p>
        </div>

        {/* Timeline */}
        <div className="card p-4 relative">
          <h2 className="mb-2 font-header text-2xl uppercase">Career Timeline</h2>
          <div className="h-[160px]">
            <TriBandTimeline
              startYear={2020}
              endYear={2027}
              topSegments={timeline?.top ?? []}
              bottomSegments={timeline?.bottom ?? []}
              yearStyle="axis"
              pad={16}
              iconSize={20}
              rise={30}
              onSegmentClick={handleSegmentClick}
            />
          </div>
          {renderTimelinePopup()}
        </div>

        {/* Skills */}
        <div className="card p-4">
          <h2 className="mb-3 font-header text-2xl uppercase">Skills</h2>
          <SkillsAccordion groups={skillsGroups} />
        </div>

        {/* Interests */}
        <div className="card p-4">
          <h2 className="mb-2 font-header text-2xl uppercase">Interests</h2>
          <div className="flex flex-wrap gap-2">
            {((interests && interests.length > 0) ? interests : fallbackInterests).map((it: Interest, i: number) => {
              const Icon = toIcon(it.icon_name);
              return (
                <div
                  key={`mobile-interest-${it.label}-${i}`}
                  className="flex items-center gap-2 border border-[var(--border)]/50 px-3 py-1.5"
                  style={{ backgroundColor: it.color || '#FFB3BA' }}
                >
                  <Icon className="h-4 w-4 text-gray-900" />
                  <span className="font-mono text-xs text-gray-900">{it.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
