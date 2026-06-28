import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-[var(--background)] text-[var(--foreground)]">
      <div className="flex flex-col items-center gap-6 px-4 text-center">
        <h1 className="font-header text-8xl uppercase">404</h1>
        <p className="font-mono text-lg text-[var(--muted)]">Page not found</p>
        <Link
          href="/"
          className="btn-press border-2 border-[var(--border)] px-6 py-2 font-header text-sm uppercase tracking-wider transition-colors hover:border-[var(--accent)] hover:bg-[var(--accent)] hover:text-white"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}
