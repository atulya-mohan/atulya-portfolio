// src/components/TypewriterEffect.tsx

'use client';

import { useState, useEffect } from 'react';

export default function TypewriterEffect() {
  const fullName = "Atulya Mohan";
  const subtitle = "Welcome to my portfolio!";
  const [displayedName, setDisplayedName] = useState("");
  const [displayedSubtitle, setDisplayedSubtitle] = useState("");
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
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
  }, [displayedName, displayedSubtitle, isComplete, fullName, subtitle]);

  return (
    <div className={`fixed inset-0 h-full w-full flex items-center justify-center bg-[#F0F2E6] text-black z-50 transition-opacity duration-2000 ${isComplete ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
      <div className="flex flex-col items-center gap-6">
        <h1 className="font-header text-6xl uppercase tracking-wider">
          {displayedName}
          {displayedName.length < fullName.length && <span className="animate-pulse">|</span>}
        </h1>
        {displayedName.length === fullName.length && (
          <p className="font-body text-lg text-zinc-700">
            {displayedSubtitle}
            {displayedSubtitle.length < subtitle.length && <span className="animate-pulse">|</span>}
          </p>
        )}
      </div>
    </div>
  );
}