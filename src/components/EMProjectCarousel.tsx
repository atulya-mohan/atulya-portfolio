'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { blurDataURLs } from '@/lib/blur-utils';

type Item = {
  title: string;
  href: string;
  imageUrl?: string | null;
  summary?: string;
};

export default function EMProjectCarousel({ items }: { items: Item[] }) {
  const [idx, setIdx] = useState(0);
  const itemsPerView = 3;
  const totalSlides = Math.ceil(items.length / itemsPerView);

  const goToSlide = (direction: -1 | 1) => {
    setIdx((prev) => (prev + direction + totalSlides) % totalSlides);
  };

  const visibleItems = items.slice(idx * itemsPerView, (idx + 1) * itemsPerView);
  const canPrev = totalSlides > 1;
  const canNext = totalSlides > 1;

  return (
    <div className="relative w-full" role="region" aria-roledescription="carousel" aria-label="Engineering Management projects">
      <span className="sr-only" aria-live="polite" aria-atomic="true">
        Showing slide {idx + 1} of {totalSlides}: {visibleItems.map(i => i.title).join(', ')}
      </span>

      {/* Navigation arrows */}
      {canPrev && (
        <button
          onClick={() => goToSlide(-1)}
          className="absolute -left-6 top-1/2 -translate-y-1/2 z-10 flex h-10 w-10 items-center justify-center bg-[var(--background)] border border-[var(--border)] opacity-80 hover:opacity-100 transition-[opacity,background-color,border-color,color,transform] hover:bg-[var(--project-accent,var(--accent))] hover:border-[var(--project-accent,var(--accent))] hover:text-white active:scale-[0.96]"
          aria-label="Previous projects"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
      )}
      {canNext && (
        <button
          onClick={() => goToSlide(1)}
          className="absolute -right-6 top-1/2 -translate-y-1/2 z-10 flex h-10 w-10 items-center justify-center bg-[var(--background)] border border-[var(--border)] opacity-80 hover:opacity-100 transition-[opacity,background-color,border-color,color,transform] hover:bg-[var(--project-accent,var(--accent))] hover:border-[var(--project-accent,var(--accent))] hover:text-white active:scale-[0.96]"
          aria-label="Next projects"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      )}

      {/* Horizontal layout with 3 equal-width items */}
      <div className="flex gap-4">
        {visibleItems.map((item, idx) => (
          <Link
            key={idx}
            href={item.href}
            className="group relative overflow-hidden border border-[var(--border)] transition-[border-color,transform] hover:border-[var(--project-accent,var(--accent))] active:scale-[0.96] flex-1"
          >
            <div className="relative aspect-[16/10] overflow-hidden">
              {item.imageUrl && (item.imageUrl.startsWith('/') || item.imageUrl.startsWith('http')) && (
                <Image
                  src={item.imageUrl}
                  alt={item.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 33vw, 33vw"
                  placeholder="blur"
                  blurDataURL={blurDataURLs.emCover}
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
            <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[var(--project-accent,var(--accent))] scale-x-0 origin-left transition-transform duration-300 group-hover:scale-x-100" />
          </Link>
        ))}
      </div>

      {/* Slide indicators */}
      {totalSlides > 1 && (
        <div className="mt-4 flex items-center justify-center gap-2">
          {Array.from({ length: totalSlides }).map((_, i) => (
            <button
              key={i}
              onClick={() => setIdx(i)}
              className={`h-1.5 transition-[width,background-color] duration-300 ${
                i === idx ? 'w-6 bg-[var(--project-accent,var(--accent))]' : 'w-1.5 bg-[var(--border-light)] hover:bg-[var(--muted)]'
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
