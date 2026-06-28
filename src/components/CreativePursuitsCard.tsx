'use client';

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Play, SkipBack, SkipForward, ChevronLeft, ChevronRight, ArrowUpRight } from "lucide-react";

type Photo = {
    id: string;
    title: string;
    imageUrl: string;
};

type CreativePursuitsCardProps = {
    photos?: { src: string; alt: string }[];
};

export default function CreativePursuitsCard({ photos: initialPhotos }: CreativePursuitsCardProps) {
    const photos: Photo[] = (initialPhotos ?? []).map((photo, index) => ({
        id: `${index}`,
        title: photo.alt,
        imageUrl: photo.src,
    }));

    const [idx, setIdx] = useState(0);

    const n = Math.max(photos.length, 1);
    const cur = photos[idx % n];

    const next = () => setIdx((i) => (i + 1) % n);
    const prev = () => setIdx((i) => (i - 1 + n) % n);

    return (
        <div className="card-elevated relative flex h-full min-h-0 flex-col gap-2 p-3">
            {/* 1. Main Header */}
            <div className="flex items-center justify-between">
                <h2 className="font-header text-3xl uppercase">Creative Pursuits</h2>
                <Link
                    href="/creative-pursuits/photography"
                    aria-label="Open all Creative Pursuits"
                    title="Open all"
                    className="icon-pop flex h-10 w-10 items-center justify-center border border-[var(--border)] bg-transparent transition-colors hover:bg-[var(--accent)] hover:text-white"
                >
                    <ArrowUpRight className="h-4 w-4" />
                </Link>
            </div>

            {/* 2. TWO COLUMNS */}
            <div className="grid h-full min-h-0 flex-1 grid-cols-1 items-stretch gap-3 md:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">

                {/* LEFT column (music) */}
                <div className="flex h-full min-w-0 flex-col border border-[var(--border)] p-2">
                    <p className="font-mono text-base font-bold text-[var(--foreground)]">Music</p>
                    <div className="mt-auto pt-2">
                        <div className="grid grid-rows-[auto,1fr] gap-2">
                            <p className="font-mono text-xs leading-none text-[var(--muted)]">Set 1</p>
                            <div className="grid grid-cols-[auto_auto_auto_1fr] items-center gap-1.5">
                                <button
                                    aria-label="Previous"
                                    className="btn-press flex h-8 w-8 items-center justify-center border-2 border-[var(--border)] text-[var(--foreground)] transition-colors hover:border-[var(--accent)] hover:bg-[var(--accent)] hover:text-white"
                                >
                                    <SkipBack className="h-4 w-4" />
                                </button>
                                <button
                                    aria-label="Play"
                                    className="btn-press flex h-8 w-8 items-center justify-center border-2 border-[var(--border)] text-[var(--foreground)] transition-colors hover:border-[var(--accent)] hover:bg-[var(--accent)] hover:text-white"
                                >
                                    <Play className="h-4 w-4" />
                                </button>
                                <button
                                    aria-label="Next"
                                    className="btn-press flex h-8 w-8 items-center justify-center border-2 border-[var(--border)] text-[var(--foreground)] transition-colors hover:border-[var(--accent)] hover:bg-[var(--accent)] hover:text-white"
                                >
                                    <SkipForward className="h-4 w-4" />
                                </button>
                                <div className="h-8 border-2 border-[var(--border)]/50" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* RIGHT column (photo carousel) */}
                <div className="relative h-full min-h-0 overflow-hidden border border-[var(--border)] bg-zinc-200">
                    {cur?.imageUrl ? (
                        <Image
                            src={cur.imageUrl}
                            alt={cur?.title || "photo"}
                            fill
                            className="object-cover"
                            sizes="(min-width: 1024px) 25vw, 50vw"
                            quality={75}
                        />
                    ) : null}
                    <div className="pointer-events-none absolute left-0 top-0 bg-[var(--foreground)] px-2 py-0.5">
                        <span className="text-[11px] font-mono font-medium text-[var(--background)]">
                            {cur?.title || `Shot ${((idx % n) + 1) || 1}`}
                        </span>
                    </div>
                    <button
                        onClick={prev}
                        aria-label="Previous photo"
                        className="btn-press absolute left-2 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center bg-black/50 text-white transition-colors hover:bg-[var(--accent)]"
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </button>
                    <button
                        onClick={next}
                        aria-label="Next photo"
                        className="btn-press absolute right-2 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center bg-black/50 text-white transition-colors hover:bg-[var(--accent)]"
                    >
                        <ChevronRight className="h-4 w-4" />
                    </button>
                </div>
            </div>
        </div>
    );
}
