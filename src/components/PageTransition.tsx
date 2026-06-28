'use client';

import { usePathname } from 'next/navigation';
import { useRef, useEffect, useState } from 'react';

export default function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const prevPathname = useRef(pathname);
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    // Skip animation on initial mount — SSR content is already visible
    if (prevPathname.current === pathname) return;
    prevPathname.current = pathname;

    setAnimating(true);
    // Let the browser paint one frame at opacity 0, then transition in
    const raf = requestAnimationFrame(() => {
      // Small delay so the transition actually fires
      requestAnimationFrame(() => setAnimating(false));
    });
    return () => cancelAnimationFrame(raf);
  }, [pathname]);

  return (
    <div
      style={{
        opacity: animating ? 0 : 1,
        // NOTE: use 'none' (not translateY(0)) at rest — any transform here creates a
        // containing block that breaks position:fixed descendants (e.g. the homepage
        // typewriter overlay, which would otherwise span the full page and center its
        // text off-screen). 'none' avoids the containing block while the slide-in still
        // animates from translateY(6px) → none.
        transform: animating ? 'translateY(6px)' : 'none',
        transition: animating ? 'none' : 'opacity 0.25s ease-out, transform 0.25s ease-out',
      }}
    >
      {children}
    </div>
  );
}
