'use client';

/**
 * CareerDatasheet — the homepage "Career Timeline" reimagined as a dimensioned
 * mechanical-engineering drawing sheet. The medium (a CAD drawing) is the message:
 * a mechanical engineer whose foundation is hardware, broadened with product &
 * business strategy.
 *
 * Desktop (lg+): a horizontal drawing — frame + registration ticks, a time
 * DIMENSION line with arrowheads, education features above the axis / experience
 * below, single-line code callouts on leader lines, and a title-block strip along
 * the bottom. Each completed role rises from the axis at its start and returns to
 * the axis at its end; an ongoing role runs open-ended with an arrow. Linework is
 * SVG; all text + interaction is DOM overlaid on the same coordinate system (so it
 * stays selectable, crawlable and accessible).
 *
 * Below lg: a genuinely different layout — a vertical dimension spine with stacked
 * mono callout rows.
 *
 * The axis end-year extends with the present (currentYear + 1), so the sheet
 * expands and the past compresses over time. Computed after mount to stay
 * hydration-safe.
 *
 * Motion is gated behind prefers-reduced-motion; the static, fully-drafted sheet
 * is always the source of truth.
 */

import { useEffect, useId, useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, useReducedMotion } from 'motion/react';
import { FlaskConical, type LucideIcon } from 'lucide-react';

type Track = 'engineering' | 'strategy';
type Band = 'edu' | 'exp';

export type CareerFeature = {
  id: string;
  label: string;
  code: string;
  role: string;
  location?: string;
  start: string; // YYYY-MM
  end?: string; // YYYY-MM — omit for an ongoing role
  band: Band;
  track: Track;
  logo?: string;
  icon?: LucideIcon;
  chipBg?: string; // override the white chip background (e.g. brand color)
};

const START_YEAR = 2020;
const FALLBACK_END = 2027; // stable SSR baseline; replaced post-mount with currentYear + 1
const MICHELIN_BLUE = '#2a66b0';
const PEBBLE_DARK = '#575349'; // Pebble's brand dark — its beige mark sits on this
const FOURIER_BROWN = '#b49a75'; // Fourier's brand brown (favicon: yellow mark on brown)

const DEFAULT_FEATURES: CareerFeature[] = [
  { id: 'purdue', label: 'Purdue University', code: 'PURDUE', role: 'B.S. Mechanical Engineering', location: 'West Lafayette, IN', start: '2020-08', end: '2024-05', band: 'edu', track: 'engineering', logo: '/images/timeline/purdue-p.svg' },
  { id: 'cmu', label: 'Carnegie Mellon University', code: 'CMU', role: 'M.S. Innovation Management (ETIM)', location: 'Pittsburgh, PA', start: '2025-01', end: '2025-12', band: 'edu', track: 'strategy', logo: '/images/timeline/cmu.png' },
  { id: 'michelin-sc', label: 'Michelin — PRIME', code: 'MICHELIN', role: 'Process Quality Eng Intern', location: 'Greenville, SC', start: '2022-05', end: '2022-08', band: 'exp', track: 'engineering', logo: '/images/timeline/michelin.svg', chipBg: MICHELIN_BLUE },
  { id: 'bipl', label: 'Purdue — BIPL', code: 'BIPL', role: 'Undergraduate Research Assistant', location: 'West Lafayette, IN', start: '2023-05', end: '2023-12', band: 'exp', track: 'engineering', icon: FlaskConical },
  { id: 'michelin-in', label: 'Michelin — R&D', code: 'MICHELIN·IN', role: 'R&D Intern', location: 'Pune, India', start: '2024-09', end: '2024-12', band: 'exp', track: 'engineering', logo: '/images/timeline/michelin.svg', chipBg: MICHELIN_BLUE },
  { id: 'fourier', label: 'Fourier', code: 'FOURIER', role: 'Hardware Engineering Intern', location: 'Mountain View, CA', start: '2025-05', end: '2025-08', band: 'exp', track: 'engineering', logo: '/images/timeline/fourier.png', chipBg: FOURIER_BROWN },
  { id: 'roco', label: 'RoCo Global', code: 'ROCO', role: 'NPI Engineer Intern', location: 'Pittsburgh, PA', start: '2026-02', end: '2026-05', band: 'exp', track: 'strategy', logo: '/images/timeline/roco.svg' },
  { id: 'pebble', label: 'Pebble Mobility', code: 'PEBBLE', role: 'Plumbing & Fluid Systems Design Engineer', start: '2026-06', band: 'exp', track: 'engineering', logo: '/images/timeline/pebble.svg', chipBg: PEBBLE_DARK },
];

/* ── geometry (viewBox units) ─────────────────────────────────────────── */
const VBW = 1000;
const VBH = 540;
const OUT = 8; // outer frame inset
const INSET = 20; // inner sheet-margin frame inset
const PLOT_L = 74;
const PLOT_R = 926;
const MASTER_Y = 48;
const EDU_BAR_Y = 150;
const AXIS_Y = 238;
const EXP_BAR_Y = 322;
const TITLE_Y = 456;

function toFrac(ym: string): number {
  const [y, m] = ym.split('-').map(Number);
  return y + (Math.max(1, Math.min(12, m || 1)) - 1) / 12;
}
const pctL = (x: number) => `${(x / VBW) * 100}%`;
const pctT = (y: number) => `${(y / VBH) * 100}%`;
const tol = (ym: string) => ym.replace('-', '.'); // 2020-08 → 2020.08
const endTol = (f: CareerFeature) => (f.end ? tol(f.end) : 'NOW');
const trackVar = (t: Track) => (t === 'engineering' ? 'var(--hw)' : 'var(--pd)');

type Placed = CareerFeature & {
  a: number;
  b: number;
  mid: number;
  barY: number;
  ongoing: boolean;
};

function placeFeatures(features: CareerFeature[], span: number): Placed[] {
  const ratio = (ym: string) => Math.min(1, Math.max(0, (toFrac(ym) - START_YEAR) / span));
  const xOf = (ym: string) => PLOT_L + ratio(ym) * (PLOT_R - PLOT_L);
  return features.map((f) => {
    const a = xOf(f.start);
    const b = f.end ? xOf(f.end) : PLOT_R; // ongoing → axis end
    const barY = f.band === 'edu' ? EDU_BAR_Y : EXP_BAR_Y;
    return { ...f, a, b, mid: (a + b) / 2, barY, ongoing: !f.end };
  });
}

export default function CareerDatasheet({
  features = DEFAULT_FEATURES,
  fullStoryHref = '/about-me',
  blurb = 'From Purdue to Carnegie Mellon — manufacturing, R&D, and systems design, broadened with product and business strategy.',
}: {
  features?: CareerFeature[];
  fullStoryHref?: string;
  blurb?: string;
}) {
  const reduce = useReducedMotion();
  const uid = useId().replace(/:/g, '');
  const [active, setActive] = useState<string | null>(null);

  // Axis end-year extends with the present; resolved after mount to stay hydration-safe.
  const [endYear, setEndYear] = useState(FALLBACK_END);
  useEffect(() => {
    setEndYear(new Date().getFullYear() + 1);
  }, []);

  const span = endYear - START_YEAR;
  const xYear = (y: number) => PLOT_L + ((y - START_YEAR) / span) * (PLOT_R - PLOT_L);
  const years = Array.from({ length: span + 1 }, (_, i) => START_YEAR + i);
  const placed = useMemo(() => placeFeatures(features, span), [features, span]);

  const activeFeature = placed.find((f) => f.id === active) ?? null;
  const eduCount = features.filter((f) => f.band === 'edu').length;
  const expCount = features.filter((f) => f.band === 'exp').length;

  const draw = (delay = 0) =>
    reduce
      ? {}
      : {
          initial: { pathLength: 0, opacity: 0 },
          whileInView: { pathLength: 1, opacity: 1 },
          viewport: { once: true, margin: '-60px' },
          transition: { duration: 0.7, delay, ease: 'easeOut' as const },
        };

  return (
    <div className="career-sheet grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.9fr)] lg:gap-12 items-start">
      {/* ── LEFT: masthead + legend + live readout ─────────────────────── */}
      <div className="lg:sticky lg:top-24">
        <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-[var(--muted)] block mb-3">
          DWG. CV · {START_YEAR}/{endYear}
        </span>
        <h2 className="font-header text-5xl uppercase tracking-tight leading-[0.9] md:text-6xl">
          Career<br />Timeline
        </h2>
        <p className="font-body text-sm text-[var(--muted)] mt-4 max-w-[34ch] leading-relaxed">
          {blurb}
        </p>

        {/* Legend */}
        <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 font-mono text-[10px] uppercase tracking-widest">
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-3 bg-[var(--hw)]" /> Engineering
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-3 bg-[var(--pd)]" /> Product &amp; Strategy
          </span>
        </div>

        {/* Live readout — currently-selected feature, else the summary */}
        <div className="mt-6 border border-[var(--border)] bg-[var(--card-bg)] p-4 min-h-[112px]">
          {activeFeature ? (
            <div>
              <div className="flex items-center justify-between gap-2">
                <span
                  className="font-mono text-[9px] uppercase tracking-widest px-1.5 py-0.5"
                  style={{ color: trackVar(activeFeature.track), border: `1px solid ${trackVar(activeFeature.track)}` }}
                >
                  {activeFeature.band === 'edu' ? 'EDUCATION' : 'EXPERIENCE'}
                </span>
                <span className="font-mono text-[10px] text-[var(--muted)]">
                  [{tol(activeFeature.start)} / {endTol(activeFeature)}]
                </span>
              </div>
              <h3 className="font-header text-xl uppercase leading-none mt-3">{activeFeature.label}</h3>
              <p className="font-body text-xs text-[var(--muted)] mt-1.5">{activeFeature.role}</p>
              {activeFeature.location && (
                <p className="font-mono text-[10px] text-[var(--muted)] mt-2 uppercase tracking-wide">
                  {activeFeature.location}
                </p>
              )}
            </div>
          ) : (
            <div>
              <span className="font-mono text-[9px] uppercase tracking-widest text-[var(--muted)]">
                Specification
              </span>
              <p className="font-header text-xl uppercase leading-tight mt-2">
                Engineering <span className="text-[var(--accent)]">&times;</span> Strategy
              </p>
              <p className="font-mono text-[10px] text-[var(--muted)] mt-2 uppercase tracking-wide">
                {eduCount} schools · {expCount} roles · {START_YEAR}&ndash;present
              </p>
            </div>
          )}
        </div>

        <Link
          href={fullStoryHref}
          className="link-underline mt-5 inline-block font-mono text-xs uppercase tracking-widest text-[var(--accent)]"
        >
          View full assembly &rarr;
        </Link>
      </div>

      {/* ── RIGHT: the drawing ─────────────────────────────────────────── */}
      {/* Desktop (lg+): horizontal datasheet */}
      <div className="relative hidden lg:block">
        <svg
          viewBox={`0 0 ${VBW} ${VBH}`}
          className="block w-full h-auto"
          role="img"
          aria-label={`Career timeline drawing, ${START_YEAR} to present`}
        >
          <defs>
            <marker id={`${uid}-arr`} markerWidth="9" markerHeight="9" refX="7.5" refY="4" orient="auto" markerUnits="userSpaceOnUse">
              <path d="M0,0 L8,4 L0,8 Z" fill="var(--foreground)" />
            </marker>
            <marker id={`${uid}-arrR`} markerWidth="9" markerHeight="9" refX="0.5" refY="4" orient="auto" markerUnits="userSpaceOnUse">
              <path d="M8,0 L0,4 L8,8 Z" fill="var(--foreground)" />
            </marker>
          </defs>

          {/* Frame + inner sheet margin */}
          <rect x={OUT} y={OUT} width={VBW - OUT * 2} height={VBH - OUT * 2} fill="none" stroke="var(--foreground)" strokeWidth={1.5} />
          <rect x={INSET} y={INSET} width={VBW - INSET * 2} height={VBH - INSET * 2} fill="none" stroke="var(--grid)" strokeWidth={1} />

          {/* Registration crop marks at inner corners */}
          {[
            [INSET, INSET, 1, 1],
            [VBW - INSET, INSET, -1, 1],
            [INSET, VBH - INSET, 1, -1],
            [VBW - INSET, VBH - INSET, -1, -1],
          ].map(([cx, cy, sx, sy], i) => (
            <g key={`reg-${i}`} stroke="var(--foreground)" strokeWidth={1}>
              <line x1={cx} y1={cy} x2={cx + 12 * sx} y2={cy} />
              <line x1={cx} y1={cy} x2={cx} y2={cy + 12 * sy} />
            </g>
          ))}

          {/* Master dimension (full span) */}
          <line x1={PLOT_L} y1={INSET} x2={PLOT_L} y2={MASTER_Y + 12} stroke="var(--grid)" strokeWidth={1} />
          <line x1={PLOT_R} y1={INSET} x2={PLOT_R} y2={MASTER_Y + 12} stroke="var(--grid)" strokeWidth={1} />
          <motion.line
            x1={PLOT_L} y1={MASTER_Y} x2={PLOT_R} y2={MASTER_Y}
            stroke="var(--foreground)" strokeWidth={1}
            markerStart={`url(#${uid}-arrR)`} markerEnd={`url(#${uid}-arr)`}
            {...draw(0.1)}
          />

          {/* Time axis (centerline dimension) */}
          <motion.line
            x1={PLOT_L} y1={AXIS_Y} x2={PLOT_R} y2={AXIS_Y}
            stroke="var(--foreground)" strokeWidth={1.5}
            markerStart={`url(#${uid}-arrR)`} markerEnd={`url(#${uid}-arr)`}
            {...draw(0.25)}
          />
          {years.map((y) => (
            <line key={`yt-${y}`} x1={xYear(y)} y1={AXIS_Y - 5} x2={xYear(y)} y2={AXIS_Y + 5} stroke="var(--foreground)" strokeWidth={1} opacity={0.55} />
          ))}

          {/* Features: risers (start + end), bar, leader */}
          {placed.map((f, i) => {
            const col = trackVar(f.track);
            const dim = active && active !== f.id;
            const isActive = active === f.id;
            const stroke = isActive ? col : 'var(--foreground)';
            return (
              <g key={f.id} opacity={dim ? 0.3 : 1} style={{ transition: 'opacity 0.2s ease' }}>
                {/* start riser: axis → bar */}
                <line x1={f.a} y1={AXIS_Y} x2={f.a} y2={f.barY} stroke={isActive ? col : 'var(--grid)'} strokeWidth={1} />
                {/* end riser: bar → axis (only when the role has concluded) */}
                {!f.ongoing && (
                  <line x1={f.b} y1={f.barY} x2={f.b} y2={AXIS_Y} stroke={isActive ? col : 'var(--grid)'} strokeWidth={1} />
                )}
                {/* feature bar */}
                <motion.line
                  x1={f.a} y1={f.barY} x2={f.b} y2={f.barY}
                  stroke={stroke} strokeWidth={isActive ? 4 : 3}
                  style={{ transition: 'stroke 0.2s ease' }}
                  {...draw(0.4 + i * 0.05)}
                />
                {/* start cap */}
                <line x1={f.a} y1={f.barY - 5} x2={f.a} y2={f.barY + 5} stroke={stroke} strokeWidth={1.5} />
                {/* end cap (closed) or open arrow (ongoing) */}
                {f.ongoing ? (
                  <path d={`M${f.b - 7},${f.barY - 4} L${f.b},${f.barY} L${f.b - 7},${f.barY + 4}`} fill="none" stroke={stroke} strokeWidth={1.5} />
                ) : (
                  <line x1={f.b} y1={f.barY - 5} x2={f.b} y2={f.barY + 5} stroke={stroke} strokeWidth={1.5} />
                )}
              </g>
            );
          })}
        </svg>

        {/* DOM overlay — labels, callouts, title block */}
        <div className="absolute inset-0 pointer-events-none select-none">
          {/* Year labels */}
          {years.map((y) => (
            <span
              key={`yl-${y}`}
              className="absolute font-mono text-[9px] text-[var(--muted)]"
              style={{ left: pctL(xYear(y)), top: pctT(AXIS_Y + 18), transform: 'translateX(-50%)' }}
            >
              {y}
            </span>
          ))}

          {/* Master dimension value (breaks the line) */}
          <span
            className="absolute font-mono text-[9px] uppercase tracking-[0.2em] text-[var(--foreground)] bg-[var(--background)] px-2"
            style={{ left: pctL(VBW / 2), top: pctT(MASTER_Y), transform: 'translate(-50%,-50%)' }}
          >
            {span}.00 YR ±0
          </span>

          {/* Logo chips seated on the bars; code reveals on hover (readout shows full detail) */}
          {placed.map((f) => {
            const above = f.band === 'edu';
            const col = trackVar(f.track);
            const dim = active && active !== f.id;
            const isActive = active === f.id;
            const Icon = f.icon;
            return (
              <div key={f.id}>
                <button
                  type="button"
                  className="absolute pointer-events-auto flex items-center justify-center border p-[3px] transition-[transform,border-color,opacity] hover:scale-110 focus-visible:scale-110 active:scale-[0.96]"
                  style={{
                    left: pctL(f.mid),
                    top: pctT(f.barY),
                    width: 'clamp(20px, 3.2%, 28px)',
                    aspectRatio: '1 / 1',
                    transform: 'translate(-50%,-50%)',
                    background: f.chipBg ?? '#ffffff',
                    borderColor: isActive ? col : 'var(--border)',
                    opacity: dim ? 0.4 : 1,
                    zIndex: isActive ? 30 : 10,
                  }}
                  onMouseEnter={() => setActive(f.id)}
                  onMouseLeave={() => setActive(null)}
                  onFocus={() => setActive(f.id)}
                  onBlur={() => setActive(null)}
                  aria-label={`${f.label}, ${f.role}, ${f.start} to ${f.end ?? 'present'}`}
                >
                  {f.logo ? (
                    <Image src={f.logo} alt="" width={22} height={22} className="h-full w-full object-contain" />
                  ) : Icon ? (
                    <Icon className="h-full w-full" strokeWidth={1.75} style={{ color: '#1a1a1a' }} />
                  ) : null}
                </button>
                {isActive && (
                  <span
                    className="absolute font-header text-[11px] uppercase leading-none whitespace-nowrap pointer-events-none"
                    style={{
                      left: pctL(f.mid),
                      top: pctT(above ? f.barY - 22 : f.barY + 22),
                      transform: 'translate(-50%,-50%)',
                      color: col,
                      zIndex: 30,
                    }}
                  >
                    {f.code}
                  </span>
                )}
              </div>
            );
          })}

          {/* Title block — strip along the bottom edge */}
          <div
            className="absolute flex border border-[var(--foreground)] bg-[var(--background)]"
            style={{ left: pctL(INSET), top: pctT(TITLE_Y), width: pctL(VBW - INSET * 2) }}
          >
            {[
              ['DRAWN BY', 'A. MOHAN'],
              ['TITLE', 'CAREER TIMELINE'],
              ['DISCIPLINE', 'ENG × STRATEGY'],
              ['SCALE', '1:1'],
              ['REV / SHEET', `${endYear - 1} · 1/1`],
            ].map(([k, v], i) => (
              <div
                key={k}
                className="flex flex-col px-2 py-1.5 flex-1 min-w-0"
                style={{ borderLeftWidth: i > 0 ? 1 : 0, borderColor: 'var(--grid)' }}
              >
                <span className="font-mono text-[6.5px] uppercase tracking-wider text-[var(--muted)] leading-none">{k}</span>
                <span className="font-mono text-[8.5px] uppercase tracking-wide leading-none mt-1 truncate">{v}</span>
              </div>
            ))}
          </div>
        </div>

        {/* hover cue — sits under the drawing (desktop only) */}
        <p className="mt-3 text-center font-mono text-[9px] uppercase tracking-[0.2em] text-[var(--accent)]">
          &uarr; Hover any feature for detail
        </p>
      </div>

      {/* Below lg: vertical dimension spine + stacked rows */}
      <div className="lg:hidden">
        <div className="relative pl-14">
          {/* vertical dimension line */}
          <div className="absolute left-7 top-1 bottom-1 w-px bg-[var(--foreground)]" />
          <div className="absolute left-[26px] top-0 h-0 w-0 border-x-[4px] border-x-transparent border-b-[6px] border-b-[var(--foreground)]" />
          <div className="absolute left-[26px] bottom-0 h-0 w-0 border-x-[4px] border-x-transparent border-t-[6px] border-t-[var(--foreground)]" />

          <ul className="flex flex-col gap-3">
            {features
              .slice()
              .sort((a, b) => toFrac(a.start) - toFrac(b.start))
              .map((f) => {
                const col = trackVar(f.track);
                const Icon = f.icon;
                return (
                  <li key={f.id} className="relative">
                    {/* spine leader + node */}
                    <span className="absolute -left-[34px] top-4 h-px w-5" style={{ background: col }} />
                    <span className="absolute -left-[31px] top-[13px] h-2 w-2 border bg-[var(--background)]" style={{ borderColor: col }} />

                    <div className="border border-[var(--border)] bg-[var(--card-bg)] p-3" style={{ borderLeftWidth: 3, borderLeftColor: col }}>
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="flex h-6 w-6 items-center justify-center border border-[var(--border)] p-[2px] shrink-0" style={{ background: f.chipBg ?? '#ffffff' }}>
                            {f.logo ? (
                              <Image src={f.logo} alt="" width={18} height={18} className="h-full w-full object-contain" />
                            ) : Icon ? (
                              <Icon className="h-full w-full" strokeWidth={1.75} style={{ color: '#1a1a1a' }} />
                            ) : null}
                          </span>
                          <h3 className="font-header text-sm uppercase leading-none">{f.label}</h3>
                        </div>
                        <span className="font-mono text-[8px] uppercase tracking-wider px-1 py-0.5 shrink-0" style={{ color: col, border: `1px solid ${col}` }}>
                          {f.band === 'edu' ? 'EDU' : 'EXP'}
                        </span>
                      </div>
                      <p className="font-body text-[11px] text-[var(--muted)] mt-1.5">{f.role}</p>
                      <p className="font-mono text-[9px] text-[var(--muted)] mt-1">[{tol(f.start)} / {endTol(f)}]</p>
                    </div>
                  </li>
                );
              })}
          </ul>

          {/* mobile title block */}
          <div className="mt-4 grid grid-cols-3 border border-[var(--foreground)]">
            {[
              ['DRAWN BY', 'A. MOHAN'],
              ['REV', String(endYear - 1)],
              ['SHEET', '1 / 1'],
            ].map(([k, v], i) => (
              <div key={k} className="flex flex-col px-2 py-1.5" style={{ borderLeftWidth: i > 0 ? 1 : 0, borderColor: 'var(--grid)' }}>
                <span className="font-mono text-[7px] uppercase tracking-wider text-[var(--muted)] leading-none">{k}</span>
                <span className="font-mono text-[9px] uppercase leading-tight mt-0.5">{v}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* visually-hidden list for SEO / assistive tech */}
      <ul className="sr-only">
        {features.map((f) => (
          <li key={f.id}>
            {f.label} — {f.role} ({f.start} to {f.end ?? 'present'}), {f.band === 'edu' ? 'education' : 'experience'}
          </li>
        ))}
      </ul>
    </div>
  );
}
