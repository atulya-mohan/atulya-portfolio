'use client';

import { useEffect } from 'react';

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Uncaught error:', error);
  }, [error]);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-[var(--background)] text-[var(--foreground)]">
      <div className="flex flex-col items-center gap-6 px-4 text-center">
        <h1 className="font-header text-8xl uppercase">500</h1>
        <p className="font-mono text-lg text-[var(--muted)]">Something went wrong</p>
        <button
          onClick={reset}
          className="btn-press border-2 border-[var(--border)] px-6 py-2 font-header text-sm uppercase tracking-wider transition-colors hover:border-[var(--accent)] hover:bg-[var(--accent)] hover:text-white"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}
