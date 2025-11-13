'use client';

import Link from "next/link";
import Image from "next/image";
import { useMemo, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, ArrowUpRight } from "lucide-react";

type Item = {
  id: string;
  title: string;
  href: string;
  imageUrls?: string[];
  summary?: string;
  role?: string;
  year?: string;
  type?: string;
};

export default function MEProjectsCard({
  title = "Mechanical Engineering Projects",
  viewAllHref = "/projects/mechanical-engineering",
  items,
  className = "",
  thumbCount = 3,
  thumbH = 64,
  thumbHMd = 72,
}: {
  title?: string;
  viewAllHref?: string;
  items: Item[];
  className?: string;
  thumbCount?: number;
  thumbH?: number;
  thumbHMd?: number;
}) {
  const isPlaceholder = !items || items.length === 0;
  const safeItems: Item[] = isPlaceholder
    ? [
        {
          id: "placeholder",
          title: "Project Coming Soon",
          href: viewAllHref,
          summary:
            "Project gallery coming soon. Check back for fresh mechanical engineering updates.",
          imageUrls: [],
        },
      ]
    : items;

  const n = Math.max(safeItems.length, 1);
  const [i, setI] = useState(0);
  const [imgIdx, setImgIdx] = useState(0);
  const cur = safeItems[i % n];
  const numImages = cur?.imageUrls?.length || 0;

  const others = useMemo(() => {
    const out: number[] = [];
    for (let k = 1; k <= Math.min(thumbCount, n - 1); k++) out.push((i + k) % n);
    return out;
  }, [i, n, thumbCount]);

  const goProject = (dir: -1 | 1) => () => setI((x) => (x + dir + n) % n);
  
  const goImage = (dir: -1 | 1) => () => {
    if (numImages > 1) {
      setImgIdx(prev => (prev + dir + numImages) % numImages);
    }
  };

  useEffect(() => {
    setImgIdx(0);
  }, [i]);

  return (
    <div
      className={
        "relative flex h-full min-h-0 flex-col " +
        "gap-2 border border-black p-4  " +
        className
      }
      style={
        {
          ["--thumb-h"]: `${thumbH}px`,
          ["--thumb-h-md"]: `${thumbHMd}px`,
        } as React.CSSProperties
      }
    >
      {/* 1. Heading */}
      <div className="flex items-center justify-between">
        <h2 className="font-header text-3xl uppercase text-black">{title}</h2>
        <Link
          href={viewAllHref}
          aria-label={`Open all ${title}`}
          title="Open all"
          className="border border-black bg-transparent p-1.5 text-black transition-colors hover:border-[#FF4F00] hover:bg-[#FF4F00] hover:text-white"
        >
          <ArrowUpRight className="h-4 w-4" />
        </Link>
      </div>

      {/* 2. Chosen Project (Desc | Photo) */}
      <section className="grid flex-1 min-h-0 grid-cols-1 items-stretch gap-2 md:grid-cols-2">
        {/* LEFT: Description */}
        <div className="flex h-full min-w-0 flex-col border border-black p-4">
          
          {/* 👇 --- THIS IS THE FIX --- 👇 */}
          {/* This <p> tag now has a fixed height (h-[7rem]) and all the
            line-clamp classes, just like your "About Me" box.
            The 'flex-1' class was removed to allow truncation.
          */}
          <p className="font-body text-sm leading-relaxed text-zinc-800 h-[7rem] overflow-hidden [display:-webkit-box] [-webkit-line-clamp:5] [-webkit-box-orient:vertical]">
            {cur.summary ??
              "Brief overview of the selected project goes here. Replace with your real content."}
          </p>
          {/* 👆 --- END OF FIX --- 👆 */}
          
          <div className="mt-auto flex items-center gap-2 pt-3">
            <button
              onClick={goProject(-1)}
              className="border-2 border-black px-3 py-1.5 font-mono text-sm text-black transition-colors hover:border-[#FF4F00] hover:bg-[#FF4F00] hover:text-white"
              disabled={isPlaceholder}
            >
              PREV
            </button>
            <button
              onClick={goProject(1)}
              className="border-2 border-black px-3 py-1.5 font-mono text-sm text-black transition-colors hover:border-[#FF4F00] hover:bg-[#FF4F00] hover:text-white"
              disabled={isPlaceholder}
            >
              NEXT
            </button>
            <Link
              href={cur.href}
              className="ml-auto border-2 border-[#FF4F00] bg-[#FF4F00] px-3 py-1.5 font-mono text-sm text-white transition-colors hover:bg-opacity-80"
            >
              VIEW PROJECT
            </Link>
          </div>
        </div>

        {/* RIGHT: Photo */}
        <div className="relative h-full min-h-0 overflow-hidden border border-black bg-zinc-200">
          {cur.imageUrls && cur.imageUrls[imgIdx] ? (
            <Image src={cur.imageUrls[imgIdx]} alt={cur.title} fill className="object-cover" />
          ) : null}
          
          <div className="absolute left-0 top-0 z-10 bg-black px-2 py-1">
            <div className="font-mono text-sm font-medium text-white">
              {cur.title}
            </div>
          </div>
          
          {numImages > 1 && (
            <>
              <button
                aria-label="Previous image"
                onClick={goImage(-1)}
                className="group absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 p-2 text-white transition-colors hover:bg-[#FF4F00]"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                aria-label="Next image"
                onClick={goImage(1)}
                className="group absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 p-2 text-white transition-colors hover:bg-[#FF4F00]"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </>
          )}
        </div>
      </section>

      {/* 3. Other Projects Thumbnails */}
      <section className="p-0">
        <div
          className="grid grid-cols-3 gap-2 [grid-auto-rows:var(--thumb-h)] md:[grid-auto-rows:var(--thumb-h-md)]"
        >
          {others.map((idx) => {
            const it = safeItems[idx];
            return (
              <button
                key={`thumb-${idx}-${it.id}`}
                onClick={() => setI(idx)}
                aria-label={`Show ${it.title}`}
                title={it.title}
                className="block h-full w-full relative overflow-hidden border border-black bg-zinc-200 transition-all hover:border-2 hover:border-black focus-visible:outline-none focus-visible:border-2 focus-visible:border-black"
                disabled={isPlaceholder}
              >
                {it.imageUrls && it.imageUrls[0] ? (
                  <Image src={it.imageUrls[0]} alt={it.title} fill className="object-cover" />
                ) : null}
                <div className="pointer-events-none absolute left-0 top-0 bg-black/80 px-2 py-0.5">
                  <span className="text-[11px] font-mono font-medium text-white">
                    {it.title}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </section>
    </div>
  );
}