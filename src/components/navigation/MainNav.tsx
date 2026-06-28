'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { motion } from 'motion/react';
import ThemeToggle from '@/components/ThemeToggle';

// --- DATA ---
const projects = [
  { href: '/projects/mechanical-engineering', label: 'Mechanical Engineering' },
  { href: '/projects/engineering-management', label: 'Engineering Management' },
  { href: '/projects/software-design', label: 'Software Design' },
];

const creativePursuits = [
  { href: '/creative-pursuits/music', label: 'Music' },
  { href: '/creative-pursuits/photography', label: 'Photography' },
];

export default function MainNav() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openSection, setOpenSection] = useState<'projects' | 'creative-pursuits' | null>(null);

  // Desktop dropdown state (keyboard-accessible, replaces CSS-only :hover)
  const [desktopDropdown, setDesktopDropdown] = useState<'projects' | 'creative-pursuits' | null>(null);
  const projectsRef = useRef<HTMLLIElement>(null);
  const creativeRef = useRef<HTMLLIElement>(null);

  // Close everything on navigation
  useEffect(() => {
    setMobileOpen(false);
    setOpenSection(null);
    setDesktopDropdown(null);
  }, [pathname]);

  // Close desktop dropdown on Escape or click-outside
  useEffect(() => {
    if (!desktopDropdown) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setDesktopDropdown(null);
      }
    };

    const onClick = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        projectsRef.current && !projectsRef.current.contains(target) &&
        creativeRef.current && !creativeRef.current.contains(target)
      ) {
        setDesktopDropdown(null);
      }
    };

    document.addEventListener('keydown', onKey);
    document.addEventListener('mousedown', onClick);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('mousedown', onClick);
    };
  }, [desktopDropdown]);

  // Close mobile menu on Escape
  useEffect(() => {
    if (!mobileOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileOpen(false);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [mobileOpen]);

  const is = (p: string) => pathname === p || pathname.startsWith(p + '/');
  const isExact = (p: string) => pathname === p;

  // --- STYLES ---
  const linkBase =
    'font-header px-4 py-1.5 text-sm uppercase tracking-wider text-[var(--foreground)] rounded-sm hover:bg-[var(--accent)] hover:text-white transition-colors';
  const activeStyle = 'bg-[var(--accent)] text-white hover:bg-[var(--accent)]/90';

  return (
    <>
      {/* Skip-to-content link */}
      <a
        href="#main-content"
        className="fixed left-2 top-2 z-[100] -translate-y-16 rounded bg-[var(--accent)] px-4 py-2 font-mono text-sm text-white transition-transform focus:translate-y-0"
      >
        Skip to content
      </a>

      <header className="fixed inset-x-0 top-0 z-50 flex justify-center p-2">
        {/* ===== DESKTOP NAV ===== */}
        <nav
          aria-label="Main navigation"
          className="hidden md:flex items-center gap-2 border border-[var(--border)] bg-[var(--background)] p-1.5 shadow-sm"
        >
          <Link
            href="/"
            aria-current={isExact('/') ? 'page' : undefined}
            className="font-header select-none rounded-sm px-4 py-1.5 text-base tracking-wide text-[var(--foreground)] hover:bg-[var(--accent)] hover:text-white transition-colors"
          >
            Atulya Mohan
          </Link>

          <div className="h-5 w-px bg-[var(--border-light)] mx-1" aria-hidden="true" />

          <ul className="flex items-center gap-2" role="menubar">
            {/* About */}
            <li role="none">
              <Link
                href="/about-me"
                role="menuitem"
                aria-current={isExact('/about-me') ? 'page' : undefined}
                className={`${linkBase} ${isExact('/about-me') ? activeStyle : ''}`}
              >
                About
              </Link>
            </li>

            {/* Projects dropdown */}
            <li
              ref={projectsRef}
              role="none"
              className="relative"
              onMouseEnter={() => setDesktopDropdown('projects')}
              onMouseLeave={() => setDesktopDropdown(prev => prev === 'projects' ? null : prev)}
            >
              <Link
                href="/projects"
                role="menuitem"
                aria-haspopup="true"
                aria-expanded={desktopDropdown === 'projects'}
                aria-current={is('/projects') ? 'page' : undefined}
                onFocus={() => setDesktopDropdown('projects')}
                className={`${linkBase} btn-press inline-flex items-center gap-1 ${is('/projects') ? activeStyle : ''}`}
              >
                Projects
                <ChevronDown className={`h-3 w-3 transition-transform ${desktopDropdown === 'projects' ? 'rotate-180' : ''}`} />
              </Link>
              {desktopDropdown === 'projects' && (
                <div
                  role="menu"
                  aria-label="Project categories"
                  className="absolute left-0 top-full mt-3 w-60 border border-[var(--border)] bg-[var(--background)] p-1.5 shadow-lg z-50"
                >
                  {/* Hover bridge */}
                  <div className="absolute left-0 -top-3 h-3 w-full" />
                  {projects.map((p, i) => (
                    <motion.div
                      key={p.href}
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.07, duration: 0.18, ease: 'easeOut' }}
                    >
                      <Link
                        href={p.href}
                        role="menuitem"
                        aria-current={isExact(p.href) ? 'page' : undefined}
                        className="block w-full rounded-sm px-3 py-2 text-sm font-header text-[var(--foreground)] hover:bg-[var(--accent)] hover:text-white transition-colors"
                      >
                        {p.label}
                      </Link>
                    </motion.div>
                  ))}
                </div>
              )}
            </li>

            {/* Creative Pursuits dropdown */}
            <li
              ref={creativeRef}
              role="none"
              className="relative"
              onMouseEnter={() => setDesktopDropdown('creative-pursuits')}
              onMouseLeave={() => setDesktopDropdown(prev => prev === 'creative-pursuits' ? null : prev)}
            >
              <Link
                href="/creative-pursuits"
                role="menuitem"
                aria-haspopup="true"
                aria-expanded={desktopDropdown === 'creative-pursuits'}
                aria-current={is('/creative-pursuits') ? 'page' : undefined}
                onFocus={() => setDesktopDropdown('creative-pursuits')}
                className={`${linkBase} btn-press inline-flex items-center gap-1 ${is('/creative-pursuits') ? activeStyle : ''}`}
              >
                Creative Pursuits
                <ChevronDown className={`h-3 w-3 transition-transform ${desktopDropdown === 'creative-pursuits' ? 'rotate-180' : ''}`} />
              </Link>
              {desktopDropdown === 'creative-pursuits' && (
                <div
                  role="menu"
                  aria-label="Creative pursuits"
                  className="absolute left-0 top-full mt-3 w-60 border border-[var(--border)] bg-[var(--background)] p-1.5 shadow-lg z-50"
                >
                  <div className="absolute left-0 -top-3 h-3 w-full" />
                  {creativePursuits.map((c, i) => (
                    <motion.div
                      key={c.href}
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.07, duration: 0.18, ease: 'easeOut' }}
                    >
                      <Link
                        href={c.href}
                        role="menuitem"
                        aria-current={isExact(c.href) ? 'page' : undefined}
                        className="block w-full rounded-sm px-3 py-2 text-sm font-header text-[var(--foreground)] hover:bg-[var(--accent)] hover:text-white transition-colors"
                      >
                        {c.label}
                      </Link>
                    </motion.div>
                  ))}
                </div>
              )}
            </li>

            {/* Resume */}
            <li role="none">
              <Link
                href="/resume"
                role="menuitem"
                aria-current={isExact('/resume') ? 'page' : undefined}
                className={`${linkBase} ${isExact('/resume') ? activeStyle : ''}`}
              >
                Resume
              </Link>
            </li>
          </ul>

          <div className="h-5 w-px bg-[var(--border-light)] mx-1" aria-hidden="true" />
          <ThemeToggle />
        </nav>

        {/* ===== MOBILE NAV ===== */}
        <div className="w-full md:hidden">
          <nav aria-label="Main navigation" className="flex h-14 w-full items-center justify-between border border-[var(--border)] bg-[var(--background)] px-4 shadow-sm">
            <Link
              href="/"
              aria-current={isExact('/') ? 'page' : undefined}
              className="font-header select-none rounded-sm px-3 py-1.5 text-base tracking-wide text-[var(--foreground)]"
            >
              Atulya Mohan
            </Link>
            <div className="flex items-center gap-1">
              <ThemeToggle />
              <button
                className="inline-flex min-h-10 min-w-10 items-center justify-center rounded-sm p-2 text-[var(--foreground)] hover:bg-[var(--accent)] hover:text-white transition-colors icon-pop"
                aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
                aria-expanded={mobileOpen}
                aria-controls="mobile-menu"
                onClick={() => setMobileOpen((v) => !v)}
              >
                {mobileOpen ? <CloseIcon /> : <Hamburger />}
              </button>
            </div>
          </nav>

          {mobileOpen && (
            <div
              id="mobile-menu"
              role="menu"
              aria-label="Navigation menu"
              className="mt-2 w-full border border-[var(--border)] bg-[var(--background)] p-2 shadow-lg"
            >
              <ul className="flex flex-col gap-1">
                <li role="none">
                  <Link
                    href="/about-me"
                    role="menuitem"
                    aria-current={isExact('/about-me') ? 'page' : undefined}
                    className="block w-full p-3 font-header hover:bg-[var(--accent)] hover:text-white transition-colors"
                  >
                    About
                  </Link>
                </li>

                {/* Projects Submenu */}
                <li role="none">
                  <div className="flex items-center justify-between">
                    <Link
                      href="/projects"
                      role="menuitem"
                      aria-current={isExact('/projects') ? 'page' : undefined}
                      className="block p-3 font-header hover:bg-[var(--accent)] hover:text-white transition-colors"
                    >
                      Projects
                    </Link>
                    <button
                      className="inline-flex min-h-10 min-w-10 items-center justify-center p-2 hover:bg-[var(--accent)]/20 rounded-sm icon-pop"
                      onClick={() => setOpenSection(s => s === 'projects' ? null : 'projects')}
                      aria-expanded={openSection === 'projects'}
                      aria-label={openSection === 'projects' ? 'Collapse project categories' : 'Expand project categories'}
                    >
                      <ChevronDown className={`h-4 w-4 transition-transform ${openSection === 'projects' ? 'rotate-180' : ''}`} />
                    </button>
                  </div>
                  {openSection === 'projects' && (
                    <div role="menu" aria-label="Project categories" className="pl-4 border-l border-[var(--border-light)] ml-3">
                      {projects.map(p => (
                        <Link
                          key={p.href}
                          href={p.href}
                          role="menuitem"
                          aria-current={isExact(p.href) ? 'page' : undefined}
                          className="block w-full p-2 font-header text-sm hover:bg-[var(--accent)] hover:text-white transition-colors"
                        >
                          {p.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </li>

                {/* Creative Pursuits Submenu */}
                <li role="none">
                  <div className="flex items-center justify-between">
                    <Link
                      href="/creative-pursuits"
                      role="menuitem"
                      aria-current={isExact('/creative-pursuits') ? 'page' : undefined}
                      className="block p-3 font-header hover:bg-[var(--accent)] hover:text-white transition-colors"
                    >
                      Creative Pursuits
                    </Link>
                    <button
                      className="inline-flex min-h-10 min-w-10 items-center justify-center p-2 hover:bg-[var(--accent)]/20 rounded-sm icon-pop"
                      onClick={() => setOpenSection(s => s === 'creative-pursuits' ? null : 'creative-pursuits')}
                      aria-expanded={openSection === 'creative-pursuits'}
                      aria-label={openSection === 'creative-pursuits' ? 'Collapse creative pursuits' : 'Expand creative pursuits'}
                    >
                      <ChevronDown className={`h-4 w-4 transition-transform ${openSection === 'creative-pursuits' ? 'rotate-180' : ''}`} />
                    </button>
                  </div>
                  {openSection === 'creative-pursuits' && (
                    <div role="menu" aria-label="Creative pursuits" className="pl-4 border-l border-[var(--border-light)] ml-3">
                      {creativePursuits.map(c => (
                        <Link
                          key={c.href}
                          href={c.href}
                          role="menuitem"
                          aria-current={isExact(c.href) ? 'page' : undefined}
                          className="block w-full p-2 font-header text-sm hover:bg-[var(--accent)] hover:text-white transition-colors"
                        >
                          {c.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </li>

                <li role="none">
                  <Link
                    href="/resume"
                    role="menuitem"
                    aria-current={isExact('/resume') ? 'page' : undefined}
                    className="block w-full p-3 font-header hover:bg-[var(--accent)] hover:text-white transition-colors"
                  >
                    Resume
                  </Link>
                </li>
              </ul>
            </div>
          )}
        </div>
      </header>
    </>
  );
}

// --- ICONS ---
function Hamburger() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" fill="none" aria-hidden="true">
      <path d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" fill="none" aria-hidden="true">
      <path d="M18 6L6 18M6 6l12 12" />
    </svg>
  );
}
