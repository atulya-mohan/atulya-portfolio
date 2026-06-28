'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { blurDataURLs } from '@/lib/blur-utils';

type Project = {
  id: string;
  title: string;
  href: string;
  imageUrl: string | null;
  summary?: string;
  role?: string;
  year?: string;
};

export default function MEHeroCarousel({ projects }: { projects: Project[] }) {
  const [idx, setIdx] = useState(0);
  const [direction, setDirection] = useState(0);
  const n = projects.length;
  const cur = projects[idx];

  if (!cur) return null;

  const go = (dir: 1 | -1) => {
    setDirection(dir);
    setIdx((i) => (i + dir + n) % n);
  };

  return (
    <div className="relative w-full aspect-[21/9] overflow-hidden border border-[var(--border)]" role="region" aria-roledescription="carousel" aria-label="Mechanical Engineering projects">
      <span className="sr-only" aria-live="polite" aria-atomic="true">
        Showing project {idx + 1} of {n}: {cur.title}
      </span>
      <AnimatePresence initial={false} custom={direction}>
        <motion.div
          key={idx}
          custom={direction}
          initial={{ opacity: 0, x: direction > 0 ? 300 : -300 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: direction > 0 ? -300 : 300 }}
          transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
          className="absolute inset-0"
        >
          <Link href={cur.href} className="block h-full w-full relative group">
            {cur.imageUrl && (
              <Image
                src={cur.imageUrl}
                alt={cur.title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                sizes="100vw"
                placeholder="blur"
                blurDataURL={blurDataURLs.emCover}
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/30 to-transparent" />
            <div className="absolute bottom-0 left-0 p-6 md:p-10 max-w-lg">
              <span className="font-mono text-[10px] uppercase tracking-widest text-white/50 block mb-2">
                Featured &middot; {idx + 1} / {n}
              </span>
              <h3 className="font-header text-2xl uppercase text-white md:text-4xl leading-[0.95]">
                {cur.title}
              </h3>
              {cur.summary && (
                <p className="font-body text-sm text-white/70 mt-3 leading-relaxed line-clamp-2 md:line-clamp-3">
                  {cur.summary}
                </p>
              )}
              <div className="flex gap-2 mt-3">
                {cur.role && (
                  <span className="font-mono text-[10px] uppercase tracking-wider text-white/50 border border-white/20 px-2 py-0.5">
                    {cur.role}
                  </span>
                )}
                {cur.year && (
                  <span className="font-mono text-[10px] uppercase tracking-wider text-white/50 border border-white/20 px-2 py-0.5">
                    {cur.year}
                  </span>
                )}
              </div>
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-[var(--project-accent,var(--accent))] scale-x-0 origin-left transition-transform duration-300 group-hover:scale-x-100" />
          </Link>
        </motion.div>
      </AnimatePresence>

      {/* Navigation arrows */}
      {n > 1 && (
        <>
          <button
            onClick={() => go(-1)}
            className="absolute left-3 top-1/2 -translate-y-1/2 z-20 flex h-10 w-10 items-center justify-center bg-black/40 text-white transition-[background-color,transform] hover:bg-[var(--project-accent,var(--accent))] active:scale-[0.96]"
            aria-label="Previous project"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={() => go(1)}
            className="absolute right-3 top-1/2 -translate-y-1/2 z-20 flex h-10 w-10 items-center justify-center bg-black/40 text-white transition-[background-color,transform] hover:bg-[var(--project-accent,var(--accent))] active:scale-[0.96]"
            aria-label="Next project"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </>
      )}

      {/* Dot indicators */}
      <div className="absolute bottom-3 right-4 z-20 flex gap-1.5">
        {projects.map((_, i) => (
          <button
            key={i}
            onClick={() => { setDirection(i > idx ? 1 : -1); setIdx(i); }}
            className={`h-1.5 transition-[width,background-color] duration-300 ${i === idx ? 'w-6 bg-[var(--project-accent,var(--accent))]' : 'w-1.5 bg-white/40 hover:bg-white/60'}`}
            aria-label={`Go to project ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
