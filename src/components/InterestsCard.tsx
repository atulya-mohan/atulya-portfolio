'use client';

import { useState } from "react";
import type { LucideIcon } from "lucide-react";
import { Music, Camera, Bike, Mountain, BookOpen, CircleHelp } from "lucide-react";

// Map: string key -> icon component (all-lowercase keys)
const ICONS: Record<string, LucideIcon> = {
  music: Music,
  photography: Camera,
  cycling: Bike,
  climbing: Mountain,
  reading: BookOpen,
};

type Item = { label: string; icon: string }; // pass plain strings only

export default function InterestsCard({
  items,
  className = "",
  title = "Interests",
}: {
  items: Item[];
  className?: string;
  title?: string;
}) {
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <div className={`rounded-2xl border border-[var(--border)] bg-[var(--card-bg)] p-4 ${className}`}>
      <div className="grid h-full grid-rows-[auto,1fr]">
        <h3 className="h-6 text-lg font-semibold text-white">{hovered ?? title}</h3>

        <ul
          className="flex items-center justify-center gap-3 text-[var(--foreground)]"
          onMouseLeave={() => setHovered(null)}
        >
          {items.map(({ label, icon }, idx) => {
            const key = `${icon}-${idx}`;                            // ✅90 unique, stable key
            const IconCmp = ICONS[icon.toLowerCase()] ?? CircleHelp; // ✅ robust mapping + fallback
            return (
              <li key={key}>
                <button
                  type="button"
                  title={label}
                  aria-label={label}
                  onMouseEnter={() => setHovered(label)}
                  onFocus={() => setHovered(label)}
                  onBlur={() => setHovered(null)}
                  className="rounded-lg p-2 transition-transform hover:-translate-y-0.5 active:scale-[0.96] hover:bg-[var(--card-bg)] focus:outline-none focus:ring-2 focus:ring-white/20"
                >
                  <IconCmp className="h-6 w-6 md:h-7 md:w-7" strokeWidth={2} />
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
