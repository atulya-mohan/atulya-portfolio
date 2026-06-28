'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Image from 'next/image';

type TooltipData = {
  label?: string | null;
  logo_url?: string | null;
  start: string;
  end?: string | null;
  type?: string | null;
  details?: any;
};

export default function TimelineTooltip({
  segment,
  children,
  position = 'top',
}: {
  segment: TooltipData;
  children: React.ReactNode;
  position?: 'top' | 'bottom';
}) {
  const [hovered, setHovered] = useState(false);

  const startYear = segment.start?.split('-')[0] || '';
  const endYear = segment.end?.split('-')[0] || 'Present';
  const dateRange = `${startYear} - ${endYear}`;

  // Extract useful details
  const details = segment.details || {};
  const institution = details.institution || details.company || '';
  const degree = details.degree || details.position || '';
  const location = details.location || '';

  const offsetClass = position === 'top' ? 'bottom-full mb-3' : 'top-full mt-3';

  return (
    <div
      className="relative"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {children}
      <AnimatePresence>
        {hovered && (
          <motion.div
            initial={{ opacity: 0, y: position === 'top' ? 8 : -8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: position === 'top' ? 8 : -8, scale: 0.95 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className={`absolute left-1/2 -translate-x-1/2 ${offsetClass} z-50 w-56 pointer-events-none`}
          >
            <div className="bg-[var(--foreground)] text-[var(--background)] p-3 shadow-lg">
              {segment.logo_url && (
                <div className="relative h-6 w-6 mb-2 overflow-hidden rounded-full bg-white">
                  <Image src={segment.logo_url} alt="" fill className="object-contain" sizes="24px" />
                </div>
              )}
              {segment.label && (
                <p className="font-header text-sm uppercase leading-tight">{segment.label}</p>
              )}
              <p className="font-mono text-[10px] mt-1 opacity-70">{dateRange}</p>
              {institution && (
                <p className="font-mono text-[11px] mt-2 leading-snug">{institution}</p>
              )}
              {degree && (
                <p className="font-body text-[11px] mt-0.5 opacity-80 leading-snug">{degree}</p>
              )}
              {location && (
                <p className="font-mono text-[10px] mt-1 opacity-60">{location}</p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
