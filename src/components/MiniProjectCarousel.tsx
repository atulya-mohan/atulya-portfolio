'use client';

import Link from "next/link";
import { useState } from "react";
import Image from "next/image";

// Added 'null' to imageUrl to match Supabase schema
type Item = { title: string; href: string; imageUrl?: string | null };

export default function MiniProjectCarousel({
  items,
  className = "",
}: { items: Item[]; className?: string }) {
  const [i, setI] = useState(0);

  // 👇 --- THIS IS THE FIX --- 👇
  // If items is empty, render a placeholder and stop.
  if (!items || items.length === 0) {
    return (
      <div className={`relative h-full overflow-hidden border border-black bg-zinc-200 ${className}`}>
        <div className="flex h-full w-full items-center justify-center">
          <p className="font-mono text-xs text-zinc-500">No projects found.</p>
        </div>
        <div className="absolute bottom-0 left-0 right-0 z-20 bg-black p-4">
          <h3 className="font-header text-lg uppercase text-white">
            Coming Soon
          </h3>
        </div>
      </div>
    );
  }
  // 👆 --- END OF FIX --- 👆

  const n = items.length; // No need for '|| 1'
  const cur = items[i % n]; // This is now safe, as 'n' will be > 0

  const prev = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setI((x) => (x - 1 + n) % n);
  };
  const next = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setI((x) => (x + 1) % n);
  };

  return (
    // ADDED the class
    <div className={`relative h-full overflow-hidden border border-black  ${className}`}>
      {/* Click anywhere to go to current project */}
      <Link href={cur.href} className="absolute inset-0 z-10" />

      {/* Image (full-bleed) */}
      {/* Image (full-bleed) */}
      <div className="absolute inset-0 z-0">
        {/*
          This check is more robust. It ensures the URL is not null AND
          is a real, loadable path (starts with http or /).
        */}
        {(cur.imageUrl && (cur.imageUrl.startsWith('http') || cur.imageUrl.startsWith('/'))) ? (
          <Image
            src={cur.imageUrl}
            alt={cur.title}
            fill
            className="h-full w-full object-cover"
            sizes="(max-width: 768px) 50vw, 33vw"
          />
        ) : (
          // Fallback for null or invalid URLs like "path/to/image.png"
          <div className="h-full w-full bg-zinc-200" />
        )}
      </div>

      <div className="absolute bottom-0 left-0 right-0 z-20 bg-black p-4">
        <h3 className="font-header text-lg uppercase text-white">
          {cur.title}
        </h3>
      </div>

      {/* Arrows (Only show if there is more than one item) */}
      {n > 1 && (
        <>
          <button
            aria-label="Previous project"
            onClick={prev}
            className="absolute left-2 top-1/2 z-30 -translate-y-1/2 bg-black/50 p-2 text-white transition-colors hover:bg-[#FF4F00]"
          >
            <Chevron dir="left" />
          </button>
          <button
            aria-label="Next project"
            onClick={next}
            className="absolute right-2 top-1/2 z-30 -translate-y-1/2 bg-black/50 p-2 text-white transition-colors hover:bg-[#FF4F00]"
          >
            <Chevron dir="right" />
          </button>
        </>
      )}
    </div>
  );
}

function Chevron({ dir }: { dir: "left" | "right" }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" className="text-white">
      {dir === "left" ? (
        <path d="M15 6l-6 6 6 6" stroke="currentColor" strokeWidth="2.5" fill="none" />
      ) : (
        <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2.5" fill="none" />
      )}
    </svg>
  );
}