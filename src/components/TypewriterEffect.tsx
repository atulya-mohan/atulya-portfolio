// src/components/TypewriterEffect.tsx

'use client';

import { useState, useEffect, useCallback } from 'react';

export default function TypewriterEffect() {
  const fullName = "Atulya Mohan";
  const subtitle = "Welcome to my portfolio!";
  const [displayedName, setDisplayedName] = useState("");
  const [displayedSubtitle, setDisplayedSubtitle] = useState("");
  const [isComplete, setIsComplete] = useState(false);
  const [shouldSkip, setShouldSkip] = useState(false);

  // Check sessionStorage on mount — skip if already seen this session
  useEffect(() => {
    try {
      if (sessionStorage.getItem('typewriter-seen')) {
        setShouldSkip(true);
        setIsComplete(true);
      }
    } catch {
      // sessionStorage unavailable (SSR or privacy mode)
    }
  }, []);

  // Mark as seen once the animation completes
  useEffect(() => {
    if (isComplete) {
      try {
        sessionStorage.setItem('typewriter-seen', '1');
      } catch {
        // ignore
      }
    }
  }, [isComplete]);

  // Skip on click/tap
  const handleSkip = useCallback(() => {
    setDisplayedName(fullName);
    setDisplayedSubtitle(subtitle);
    setIsComplete(true);
  }, [fullName, subtitle]);

  useEffect(() => {
    if (shouldSkip || isComplete) return;

    if (displayedName.length < fullName.length) {
      const timer = setTimeout(() => {
        setDisplayedName(fullName.slice(0, displayedName.length + 1));
      }, 120);
      return () => clearTimeout(timer);
    } else if (displayedName.length === fullName.length && displayedSubtitle.length < subtitle.length) {
      const timer = setTimeout(() => {
        setDisplayedSubtitle(subtitle.slice(0, displayedSubtitle.length + 1));
      }, 80);
      return () => clearTimeout(timer);
    } else if (displayedName.length === fullName.length && displayedSubtitle.length === subtitle.length && !isComplete) {
      const timer = setTimeout(() => setIsComplete(true), 1250);
      return () => clearTimeout(timer);
    }
  }, [displayedName, displayedSubtitle, isComplete, shouldSkip, fullName, subtitle]);

  // If already seen this session, render nothing
  if (shouldSkip) return null;

  return (
    <div
      className={`fixed inset-0 h-full w-full flex items-center justify-center bg-[var(--background)] text-[var(--foreground)] z-50 transition-opacity duration-700 cursor-pointer ${isComplete ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
      onClick={handleSkip}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleSkip(); }}
      aria-label="Skip intro animation"
    >
      <div className="flex flex-col items-center gap-6">
        <h1 className="font-header text-4xl sm:text-6xl uppercase tracking-wider">
          {displayedName}
          {displayedName.length < fullName.length && <span className="animate-pulse">|</span>}
        </h1>
        {displayedName.length === fullName.length && (
          <p className="font-body text-lg text-[var(--muted)]">
            {displayedSubtitle}
            {displayedSubtitle.length < subtitle.length && <span className="animate-pulse">|</span>}
          </p>
        )}
        {!isComplete && (
          <p className="mt-8 text-xs text-[var(--muted)] font-mono animate-pulse">click anywhere to skip</p>
        )}
      </div>
    </div>
  );
}
