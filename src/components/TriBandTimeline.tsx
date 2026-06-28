'use client';

import {
  School,
  Building2,
  FlaskConical,
  Wrench,
  Factory,
  Camera,
  Cpu,
} from 'lucide-react';
import Image from "next/image";
import { motion } from 'motion/react';
import TimelineTooltip from '@/components/TimelineTooltip';
import type { TimelineSeg } from '@/lib/types';

type Seg = {
  id?: string;
  start: string;
  end?: string | null;
  label?: string | null;
  logo_url?: string | null;
  logo_bg?: string | null;
  type?: 'education' | 'experience' | string | null;
  details?: any;
};

function parseYM(s: string): { y: number; m: number } {
  const [yy, mm] = s.split('-').map(Number);
  return { y: yy, m: mm || 1 };
}
function toFracYear(s: string): number {
  const { y, m } = parseYM(s);
  return y + (Math.max(1, Math.min(12, m)) - 1) / 12;
}

export default function TriBandTimeline({
  title,
  startYear,
  endYear,
  topSegments,
  bottomSegments,
  className = '',
  yearStyle = 'row',
  yearStep = 1,
  pad = 12,
  rise = 26,
  lineThick = 2,
  iconSize = 18,
  onSegmentClick, // NEW: Callback for when a segment is clicked
}: {
  title?: string;
  startYear: number;
  endYear: number;
  topSegments: Seg[];
  bottomSegments: Seg[];
  className?: string;
  yearStyle?: 'row' | 'axis';
  yearStep?: number;
  pad?: number;
  rise?: number;
  lineThick?: number;
  iconSize?: number;
  onSegmentClick?: (segment: Seg | TimelineSeg) => void; // NEW: Optional click handler
}) {
  const min = startYear;
  const max = endYear;
  const span = Math.max(1, max - min);

  const ratio = (s: string) => {
    const v = (toFracYear(s) - min) / span;
    return Math.min(1, Math.max(0, v));
  };

  const leftAt = (r: number) => `calc(${pad}px + ${r} * (100% - ${pad * 2}px))`;
  const widthBetween = (a: number, b: number) =>
    `calc(${Math.max(0, b - a)} * (100% - ${pad * 2}px))`;

  const ticks: number[] = [];
  for (let y = min; y <= max; y += 1) ticks.push(y);

  const ICONS = [School, Building2, FlaskConical, Wrench, Factory, Camera, Cpu];

  const rowsClass =
    yearStyle === 'row' ? 'grid-rows-[auto,1fr,auto]' : 'grid-rows-[auto,1fr]';

  const iconBoxSize = iconSize + 8;

  return (
    <div className={['grid h-full gap-2', rowsClass, className].join(' ')}>
      {title ? (
        <h3 className="font-header text-2xl uppercase text-[var(--foreground)]">{title}</h3>
      ) : (
        <div className="h-0" aria-hidden />
      )}

      {/* TRACK AREA */}
      <div className="relative min-h-0">
        {/* axis */}
        <motion.div
          className="absolute top-1/2 -translate-y-1/2"
          style={{ left: pad, right: pad }}
          initial={{ scaleX: 0, originX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          <div
            className="rounded-full bg-[var(--foreground)]/80"
            style={{ height: lineThick }}
          />
        </motion.div>

        {/* ticks */}
        {ticks.map((y) => (
          <div
            key={`tick-${y}`}
            className="absolute top-1/2 -translate-y-1/2"
            style={{ left: `calc(${leftAt((y - min) / span)} - 1px)` }}
          >
            <div className="h-3 w-[2px] rounded bg-[var(--foreground)]/50" />
          </div>
        ))}

        {/* TOP BAND */}
        {topSegments.map((seg, i) => {
          const a = ratio(seg.start);
          const hasEnd = seg.end && seg.end.trim() !== '';
          const endDateString = hasEnd ? seg.end : `${endYear}-12`;
          const b = ratio(endDateString as string);
          const { logo_url, label, logo_bg } = seg;
          const mid = (a + b) / 2;
          const Icon = ICONS[i % ICONS.length];

          return (
            <div key={`top-${i}`} className="absolute inset-0">
              {/* Bar */}
              <div
                className="absolute rounded-full bg-[var(--foreground)]/80"
                style={{
                  left: leftAt(a),
                  width: widthBetween(a, b),
                  top: `calc(50% - ${rise}px)`,
                  height: lineThick,
                }}
              />
              {/* Start Riser */}
              <div
                className="absolute bg-[var(--foreground)]/60"
                style={{
                  left: `calc(${leftAt(a)} - 1px)`,
                  top: `calc(50% - ${rise}px)`,
                  width: 2,
                  height: rise,
                }}
              />
              {/* Conditionally render End Riser */}
              {hasEnd && (
                <div
                  className="absolute bg-[var(--foreground)]/60"
                  style={{
                    left: `calc(${leftAt(b)} - 1px)`,
                    top: `calc(50% - ${rise}px)`,
                    width: 2,
                    height: rise,
                  }}
                />
              )}

              {/* Icon/Logo Container with hover tooltip */}
              <div
                className="absolute -translate-x-1/2 -translate-y-1/2"
                style={{
                  left: leftAt(mid),
                  top: `calc(50% - ${rise}px)`,
                  width: iconBoxSize,
                  height: iconBoxSize,
                }}
              >
                <TimelineTooltip segment={seg} position="top">
                  <motion.button
                    onClick={() => onSegmentClick?.(seg)}
                    className="border border-[var(--border)] bg-white p-[3px] flex items-center justify-center transition-[transform,border-color] hover:scale-110 hover:border-[var(--accent)] cursor-pointer"
                    style={{ width: iconBoxSize, height: iconBoxSize, ...(logo_bg ? { backgroundColor: logo_bg } : {}) }}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.4 + i * 0.15, duration: 0.3, type: 'spring', stiffness: 300, damping: 20 }}
                  >
                    {logo_url ? (
                      <Image
                        src={logo_url}
                        alt={label || 'Timeline event logo'}
                        className="object-contain"
                        width={iconSize}
                        height={iconSize}
                        style={{ backgroundColor: logo_bg ?? 'white' }}
                      />
                    ) : (
                      <Icon
                        className="text-[var(--foreground)]"
                        width={iconSize}
                        height={iconSize}
                      />
                    )}
                  </motion.button>
                </TimelineTooltip>
              </div>
            </div>
          );
        })}

        {/* BOTTOM BAND */}
        {bottomSegments.map((seg, i) => {
          const a = ratio(seg.start);
          const hasEnd = seg.end && seg.end.trim() !== '';
          const endDateString = hasEnd ? seg.end : `${endYear}-12`;
          const b = ratio(endDateString as string);
          const { logo_url, label, logo_bg } = seg;
          const mid = (a + b) / 2;
          const Icon = ICONS[(i + 3) % ICONS.length];

          return (
            <div key={`bot-${i}`} className="absolute inset-0">
              {/* Bar */}
              <div
                className="absolute rounded-full bg-[var(--foreground)]/80"
                style={{
                  left: leftAt(a),
                  width: widthBetween(a, b),
                  top: `calc(50% + ${rise}px)`,
                  height: lineThick,
                }}
              />
              {/* Start Riser */}
              <div
                className="absolute bg-[var(--foreground)]/60"
                style={{
                  left: `calc(${leftAt(a)} - 1px)`,
                  top: '50%',
                  width: 2,
                  height: rise,
                }}
              />
              {/* Conditionally render End Riser */}
              {hasEnd && (
                <div
                  className="absolute bg-[var(--foreground)]/60"
                  style={{
                    left: `calc(${leftAt(b)} - 1px)`,
                    top: '50%',
                    width: 2,
                    height: rise,
                  }}
                />
              )}

              {/* Icon/Logo Container with hover tooltip */}
              <div
                className="absolute -translate-x-1/2 -translate-y-1/2"
                style={{
                  left: leftAt(mid),
                  top: `calc(50% + ${rise}px)`,
                  width: iconBoxSize,
                  height: iconBoxSize,
                }}
              >
                <TimelineTooltip segment={seg} position="bottom">
                  <motion.button
                    onClick={() => onSegmentClick?.(seg)}
                    className="border border-[var(--border)] bg-white p-[3px] flex items-center justify-center transition-[transform,border-color] hover:scale-110 hover:border-[var(--accent)] cursor-pointer"
                    style={{ width: iconBoxSize, height: iconBoxSize, ...(logo_bg ? { backgroundColor: logo_bg } : {}) }}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.5 + i * 0.15, duration: 0.3, type: 'spring', stiffness: 300, damping: 20 }}
                  >
                    {logo_url ? (
                      <Image
                        src={logo_url}
                        alt={label || 'Timeline event logo'}
                        className="object-contain"
                        width={iconSize}
                        height={iconSize}
                        style={{ backgroundColor: logo_bg ?? 'white' }}
                      />
                    ) : (
                      <Icon
                        className="text-[var(--foreground)]"
                        width={iconSize}
                        height={iconSize}
                      />
                    )}
                  </motion.button>
                </TimelineTooltip>
              </div>
            </div>
          );
        })}

        {/* YEAR LABELS on the axis */}
        {yearStyle === 'axis' &&
          ticks
            .filter((y) => (y - startYear) % yearStep === 0 || y === endYear)
            .map((y) => (
              <div
                key={`yl-${y}`}
                className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2"
                style={{
                  left: leftAt((y - startYear) / (endYear - startYear)),
                  top: '50%',
                }}
              >
                <span className="rounded-md bg-[var(--foreground)] px-1.5 py-0.5 text-[10px] leading-none text-[var(--background)]">
                  {y}
                </span>
              </div>
            ))}
      </div>

      {/* YEAR LABELS as a row (if requested) */}
      {yearStyle === 'row' && (
        <div className="flex items-center justify-between text-xs text-[var(--muted)]">
          {ticks
            .filter((y) => (y - startYear) % yearStep === 0 || y === endYear)
            .map((y) => (
              <span key={`y-${y}`}>{y}</span>
            ))}
        </div>
      )}
    </div>
  );
}