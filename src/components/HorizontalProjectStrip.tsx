'use client';

import { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

type Item = {
  title: string;
  href: string;
  imageUrl?: string | null;
  category: string;
  detail?: string;
};

export default function HorizontalProjectStrip({ items }: { items: Item[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: 'left' | 'right') => {
    if (!scrollRef.current) return;
    const amount = 340;
    scrollRef.current.scrollBy({ left: dir === 'right' ? amount : -amount, behavior: 'smooth' });
  };

  return (
    <div className="relative group/strip">
      {/* Scroll arrows */}
      <button
        onClick={() => scroll('left')}
        className="absolute left-2 top-1/2 -translate-y-1/2 z-10 flex h-10 w-10 items-center justify-center bg-[var(--background)] border border-[var(--border)] opacity-0 group-hover/strip:opacity-100 transition-[opacity,background-color,border-color,color] hover:bg-[var(--accent)] hover:border-[var(--accent)] hover:text-white btn-press"
        aria-label="Scroll left"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button
        onClick={() => scroll('right')}
        className="absolute right-2 top-1/2 -translate-y-1/2 z-10 flex h-10 w-10 items-center justify-center bg-[var(--background)] border border-[var(--border)] opacity-0 group-hover/strip:opacity-100 transition-[opacity,background-color,border-color,color] hover:bg-[var(--accent)] hover:border-[var(--accent)] hover:text-white btn-press"
        aria-label="Scroll right"
      >
        <ChevronRight className="h-5 w-5" />
      </button>

      {/* Fade edges */}
      <div className="pointer-events-none absolute inset-y-0 left-0 z-[5] w-12 bg-gradient-to-r from-[var(--background)] to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-[5] w-12 bg-gradient-to-l from-[var(--background)] to-transparent" />

      {/* Scrollable strip */}
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto scroll-smooth [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden px-4"
      >
        {items.map((item, idx) => (
          <Link
            key={idx}
            href={item.href}
            className="group relative flex-shrink-0 w-[300px] md:w-[360px] aspect-[3/4] overflow-hidden border border-[var(--border)] active:scale-[0.96] transition-transform"
          >
            {item.imageUrl && (item.imageUrl.startsWith('/') || item.imageUrl.startsWith('http')) && (
              <Image
                src={item.imageUrl}
                alt={item.title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="360px"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

            <div className="absolute top-3 left-3">
              <span className="font-mono text-[9px] uppercase tracking-widest text-white/70 bg-black/50 px-2 py-1">
                {item.category}
              </span>
            </div>

            <div className="absolute bottom-0 left-0 right-0 p-4">
              <h3 className="font-header text-base uppercase text-white leading-tight">{item.title}</h3>
              {item.detail && (
                <p className="font-mono text-[10px] text-white/50 mt-1.5 line-clamp-2 leading-relaxed">{item.detail}</p>
              )}
            </div>

            <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-[var(--accent)] scale-x-0 origin-left transition-transform duration-300 group-hover:scale-x-100" />
          </Link>
        ))}
      </div>
    </div>
  );
}
