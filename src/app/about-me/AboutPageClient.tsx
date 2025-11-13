// src/app/about-me/AboutPageClient.tsx
'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Linkedin, Mail, Music, Camera, Gamepad2, Plane, Wrench, X } from 'lucide-react';
import TriBandTimeline from '@/components/TriBandTimeline';
import SkillsAccordion from '@/components/SkillsAccorrdion';
import type { TimelineSeg, TimelineEducation, TimelineExperience } from '@/lib/about/types';

interface AboutPageClientProps {
  aboutData: any;
  skillsGroups: Record<string, { skills: string[]; color: string }>;
  fallbackInterests: any[];
}

export default function AboutPageClient({ aboutData, skillsGroups, fallbackInterests }: AboutPageClientProps) {
  const [selectedSegment, setSelectedSegment] = useState<TimelineSeg | null>(null);
  
  // Safely destructure with defaults to prevent errors
  const profile = aboutData?.profile ?? { name: null, bio: null, photoUrl: null };
  const timeline = aboutData?.timeline ?? { top: [], bottom: [] };
  const interests = aboutData?.interests ?? [];
  const contacts = aboutData?.contacts ?? [];

  const profilePhoto = profile?.photoUrl ?? '/portrait.jpg';
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

  const handleSegmentClick = (segment: TimelineSeg | { id?: string; start: string; end?: string | null; label?: string | null; logo_url?: string | null; type?: 'education' | 'experience' | string | null; details?: any }) => {
    // Cast to TimelineSeg since we know the data structure matches
    setSelectedSegment(segment as TimelineSeg);
  };

  const renderDetailPanel = () => {
    if (!selectedSegment || !selectedSegment.details) return null;

    const isEducation = selectedSegment.type === 'education';
    const details = selectedSegment.details as TimelineEducation | TimelineExperience;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
        <div className="relative max-w-3xl w-full max-h-[85vh] overflow-auto bg-[#F0F2E6] border-2 border-black">
          {/* Header with title and close button */}
          <div className="sticky top-0 bg-[#F0F2E6] border-b-2 border-black p-6 flex items-start justify-between">
            <div className="flex-1 pr-4">
              <h2 className="font-header text-4xl uppercase mb-2 leading-tight">{selectedSegment.label}</h2>
              <p className="font-mono text-sm text-zinc-700">
                {selectedSegment.start} - {selectedSegment.end || 'Present'}
              </p>
            </div>
            <button
              onClick={() => setSelectedSegment(null)}
              className="shrink-0 p-2 border-2 border-black hover:bg-[#FF4F00] hover:border-[#FF4F00] hover:text-white transition-colors"
              aria-label="Close"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            {isEducation ? (
              <div className="space-y-6">
                {/* Institution */}
                <div className="border-l-4 border-black pl-4">
                  <h3 className="font-header text-sm uppercase text-zinc-500 mb-1">Institution</h3>
                  <p className="font-mono text-base text-black">{(details as TimelineEducation).institution}</p>
                </div>

                {/* Degree and Field in a grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {(details as TimelineEducation).degree && (
                    <div className="border-l-4 border-black pl-4">
                      <h3 className="font-header text-sm uppercase text-zinc-500 mb-1">Degree</h3>
                      <p className="font-mono text-base text-black">{(details as TimelineEducation).degree}</p>
                    </div>
                  )}
                  {(details as TimelineEducation).field_of_study && (
                    <div className="border-l-4 border-black pl-4">
                      <h3 className="font-header text-sm uppercase text-zinc-500 mb-1">Field of Study</h3>
                      <p className="font-mono text-base text-black">{(details as TimelineEducation).field_of_study}</p>
                    </div>
                  )}
                </div>

                {/* GPA and Location in a grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {(details as TimelineEducation).gpa && (
                    <div className="border-l-4 border-black pl-4">
                      <h3 className="font-header text-sm uppercase text-zinc-500 mb-1">GPA</h3>
                      <p className="font-mono text-base text-black">{(details as TimelineEducation).gpa}</p>
                    </div>
                  )}
                  {(details as TimelineEducation).location && (
                    <div className="border-l-4 border-black pl-4">
                      <h3 className="font-header text-sm uppercase text-zinc-500 mb-1">Location</h3>
                      <p className="font-mono text-base text-black">{(details as TimelineEducation).location}</p>
                    </div>
                  )}
                </div>

                {/* Description */}
                {(details as TimelineEducation).description && (
                  <div className="border-l-4 border-black pl-4">
                    <h3 className="font-header text-sm uppercase text-zinc-500 mb-2">Description</h3>
                    <p className="font-mono text-sm leading-relaxed text-zinc-800">{(details as TimelineEducation).description}</p>
                  </div>
                )}

                {/* Achievements */}
                {(details as TimelineEducation).achievements && (details as TimelineEducation).achievements!.length > 0 && (
                  <div className="border-l-4 border-black pl-4">
                    <h3 className="font-header text-sm uppercase text-zinc-500 mb-3">Achievements</h3>
                    <ul className="space-y-2">
                      {(details as TimelineEducation).achievements!.map((achievement, idx) => (
                        <li key={idx} className="flex items-start gap-3">
                          <span className="mt-1.5 h-1.5 w-1.5 shrink-0 bg-black" />
                          <span className="font-mono text-sm text-zinc-800">{achievement}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-6">
                {/* Company and Position */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="border-l-4 border-black pl-4">
                    <h3 className="font-header text-sm uppercase text-zinc-500 mb-1">Company</h3>
                    <p className="font-mono text-base text-black">{(details as TimelineExperience).company}</p>
                  </div>
                  <div className="border-l-4 border-black pl-4">
                    <h3 className="font-header text-sm uppercase text-zinc-500 mb-1">Position</h3>
                    <p className="font-mono text-base text-black">{(details as TimelineExperience).position}</p>
                  </div>
                </div>

                {/* Location */}
                {(details as TimelineExperience).location && (
                  <div className="border-l-4 border-black pl-4">
                    <h3 className="font-header text-sm uppercase text-zinc-500 mb-1">Location</h3>
                    <p className="font-mono text-base text-black">{(details as TimelineExperience).location}</p>
                  </div>
                )}

                {/* Description */}
                {(details as TimelineExperience).description && (
                  <div className="border-l-4 border-black pl-4">
                    <h3 className="font-header text-sm uppercase text-zinc-500 mb-2">Description</h3>
                    <p className="font-mono text-sm leading-relaxed text-zinc-800">{(details as TimelineExperience).description}</p>
                  </div>
                )}

                {/* Responsibilities */}
                {(details as TimelineExperience).responsibilities && (details as TimelineExperience).responsibilities!.length > 0 && (
                  <div className="border-l-4 border-black pl-4">
                    <h3 className="font-header text-sm uppercase text-zinc-500 mb-3">Responsibilities</h3>
                    <ul className="space-y-2">
                      {(details as TimelineExperience).responsibilities!.map((resp, idx) => (
                        <li key={idx} className="flex items-start gap-3">
                          <span className="mt-1.5 h-1.5 w-1.5 shrink-0 bg-black" />
                          <span className="font-mono text-sm text-zinc-800">{resp}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Technologies */}
                {(details as TimelineExperience).technologies && (details as TimelineExperience).technologies!.length > 0 && (
                  <div className="border-l-4 border-black pl-4">
                    <h3 className="font-header text-sm uppercase text-zinc-500 mb-3">Technologies</h3>
                    <div className="flex flex-wrap gap-2">
                      {(details as TimelineExperience).technologies!.map((tech, idx) => (
                        <span key={idx} className="border border-black/50 px-3 py-1.5 text-xs font-mono bg-white text-black">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 h-full w-full overflow-hidden bg-[#F0F2E6] text-black">
      {/* ADD: Custom scrollbar styles (same as EM page) */}
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

      {renderDetailPanel()}
      <section
        className="px-4"
        style={{
          '--nav-h': '56px',
          '--gap': '12px',
          '--cols': 6,
          '--rows': 6,
          '--pad': '16px',
          '--tile': 'min(calc((100vw - (2*var(--pad)) - ((var(--cols)-1)*var(--gap)))/var(--cols)),calc((100dvh - var(--nav-h) - (2*var(--gap)) - ((calc(var(--rows) - 1))*var(--gap)))/var(--rows)))',
        } as React.CSSProperties}
      >
        <div className="pt-[calc(var(--nav-h)+var(--gap))] pb-[var(--gap)]">
          <div
            className="hidden md:grid h-[calc(100dvh-var(--nav-h)-2*var(--gap))] grid-cols-6 [grid-auto-rows:var(--tile)]"
            style={{ gap: 'var(--gap)' }}
          >
            {/* Profile Photo */}
            <div className="col-span-1 row-span-1 border border-black p-1">
              <div className="relative h-full w-full overflow-hidden bg-zinc-200">
                <Image
                  src={profilePhoto}
                  alt={profile?.name ?? 'Profile photo'}
                  fill
                  className="object-cover"
                  sizes="(min-width: 768px) 16vw, 50vw"
                />
              </div>
            </div>

            {/* Contact + Interests */}
            <div className="col-span-1 row-span-1 grid" style={{ gap: 'var(--gap)', gridTemplateRows: '1fr 1fr' }}>
              {/* Contact */}
              <div className="border border-black p-3">
                <h3 className="mb-2 font-header text-2xl uppercase">Contact Me</h3>
                <div className="flex items-center gap-2">
                  {((contacts && contacts.length > 0) ? contacts : [
                    { label: 'LinkedIn', url: 'https://www.linkedin.com/', icon_name: 'Linkedin' },
                    { label: 'Email', url: 'mailto:you@example.com', icon_name: 'Mail' },
                  ]).map((c: any) => {
                    const Icon = contactIcon(c.icon_name);
                    return (
                      <Link
                        key={c.label}
                        href={c.url}
                        className="inline-flex h-10 w-10 items-center justify-center border border-black text-black transition-colors hover:bg-[#FF4F00] hover:border-[#FF4F00] hover:text-white"
                        aria-label={c.label}
                      >
                        <Icon className="h-5 w-5" />
                      </Link>
                    );
                  })}
                </div>
              </div>

              {/* Interests */}
              <div className="border border-black p-3">
                <h3 className="mb-2 font-header text-2xl uppercase">Interests</h3>
                <div className="grid grid-cols-5 gap-1.5">
                  {((interests && interests.length > 0) ? interests : fallbackInterests).map((it: any, i: number) => {
                    const Icon = toIcon(it.icon_name);
                    return (
                      <div
                        key={`${it.label}-${i}`}
                        className="flex h-9 w-9 items-center justify-center border border-black/50"
                        style={{ backgroundColor: it.color || '#FFB3BA' }}
                        title={it.label}
                      >
                        <Icon className="h-4 w-4 text-black" />
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Timeline with Click Handler */}
            <div className="col-span-4 row-span-1 border border-black p-3 flex flex-col">
              <h2 className="font-header text-4xl uppercase">Career Timeline</h2>
              <div className="flex flex-row h-full items-center">
                <div className="flex-1">
                  <TriBandTimeline
                    startYear={2020}
                    endYear={2026}
                    topSegments={timeline?.top ?? []}
                    bottomSegments={timeline?.bottom ?? []}
                    yearStyle="axis"
                    pad={25}
                    iconSize={25}
                    onSegmentClick={handleSegmentClick}
                  />
                </div>
              </div>
            </div>

            {/* Skills */}
            <div className="col-span-2 row-span-5 border border-black p-4">
              <h2 className="mb-3 font-header text-4xl uppercase">Skills</h2>
              <SkillsAccordion groups={skillsGroups} />
            </div>

            {/* Bio - UPDATED WITH SCROLLBAR */}
            <div className="col-span-4 row-span-5 border border-black p-4 flex flex-col">
              <h2 className="mb-2 font-header text-4xl uppercase">Bio</h2>
              <div className="flex-1 min-h-0 overflow-auto pr-1 vertical-scrollbar">
                <p className="text-zinc-800 leading-relaxed text-sm font-mono whitespace-pre-line">
                  {fullBio}
                </p>
              </div>
            </div>
          </div>

          {/* Mobile view */}
          <div className="md:hidden space-y-4">
            <div className="border border-black p-4">About Me (Mobile)</div>
          </div>
        </div>
      </section>
    </div>
  );
}