'use client';

import { motion } from 'motion/react';
import { type ReactNode, useRef } from 'react';

export default function AnimatedSection({
  children,
  className = '',
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  // On the very first SSR → hydration pass, skip the hidden initial state
  // so content is visible before JS kicks in (prevents flash of invisible content).
  const hasHydrated = useRef(false);
  const isFirstRender = !hasHydrated.current;
  if (!hasHydrated.current) {
    hasHydrated.current = true;
  }

  return (
    <motion.section
      initial={isFirstRender ? { opacity: 1, y: 0 } : { opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.6, delay, ease: [0.25, 0.1, 0.25, 1] }}
      className={className}
    >
      {children}
    </motion.section>
  );
}
