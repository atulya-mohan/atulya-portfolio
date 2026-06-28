'use client';

import { motion } from 'motion/react';
import { useState } from 'react';

type SkillItem = { skill: string; color: string };

function MarqueeRow({
  items,
  direction = 'left',
  speed = 35,
  isPaused,
}: {
  items: SkillItem[];
  direction?: 'left' | 'right';
  speed?: number;
  isPaused: boolean;
}) {
  // Triple the items for seamless looping
  const tripled = [...items, ...items, ...items];

  return (
    <div className="relative overflow-hidden">
      <motion.div
        className="flex w-max"
        animate={{
          x: direction === 'left'
            ? [0, -(100 / 3) + '%']
            : [-(100 / 3) + '%', 0],
        }}
        transition={{
          x: {
            repeat: Infinity,
            repeatType: 'loop',
            duration: isPaused ? 0 : speed,
            ease: 'linear',
          },
        }}
      >
        {tripled.map(({ skill }, idx) => (
          <span
            key={`${skill}-${idx}`}
            className="inline-flex shrink-0 items-center whitespace-nowrap px-3 md:px-4"
          >
            <span className="font-header text-2xl md:text-3xl lg:text-4xl uppercase tracking-tight text-[var(--foreground)] opacity-15 transition-opacity duration-300 hover:opacity-100">
              {skill}
            </span>
            <span className="ml-6 md:ml-8 text-[var(--accent)] opacity-30 text-xl md:text-2xl">
              ·
            </span>
          </span>
        ))}
      </motion.div>
    </div>
  );
}

export default function SkillsMarquee({ skills }: { skills: SkillItem[] }) {
  const [isPaused, setIsPaused] = useState(false);

  // Split skills into two rows
  const mid = Math.ceil(skills.length / 2);
  const row1 = skills.slice(0, mid);
  const row2 = skills.slice(mid);

  return (
    <div
      className="relative overflow-hidden py-6 md:py-8"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      role="region"
      aria-label="Skills marquee — hover to pause"
    >
      {/* Edge fades */}
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-20 md:w-32 bg-gradient-to-r from-[var(--background)] to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-20 md:w-32 bg-gradient-to-l from-[var(--background)] to-transparent" />

      <div className="space-y-3 md:space-y-4">
        <MarqueeRow items={row1} direction="left" speed={35} isPaused={isPaused} />
        <MarqueeRow items={row2} direction="right" speed={40} isPaused={isPaused} />
      </div>
    </div>
  );
}
