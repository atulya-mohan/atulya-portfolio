'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
// ADDED: Import React for Fragment
import React, { useEffect, useState } from 'react';
import { ChevronDown } from 'lucide-react'; // Import ChevronDown from lucide-react

// --- DATA ---
const projects = [
  { href: '/projects/mechanical-engineering', label: 'Mechanical Engineering' },
  { href: '/projects/engineering-management', label: 'Engineering Management' },
  { href: '/projects/software-design', label: 'Software Design' },
];

// UPDATED: Renamed variable and updated paths
const creativePursuits = [
  { href: '/creative-pursuits/music', label: 'Music' },
  { href: '/creative-pursuits/photography', label: 'Photography' },
];

export default function MainNav() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  // UPDATED: State for mobile submenus uses 'creative-pursuits'
  const [openSection, setOpenSection] = useState<"projects" | "creative-pursuits" | null>(null);


  useEffect(() => {
    setMobileOpen(false);
    setOpenSection(null); // Close submenus on navigation
  }, [pathname]);

  // UPDATED: is function to handle 'creative-pursuits'
  const is = (p: string) => pathname === p || pathname.startsWith(p + '/');
  const isExact = (p: string) => pathname === p;

  // --- STYLES ---
  const linkStyles =
    'font-header px-4 py-1.5 text-sm uppercase tracking-wider text-black rounded-sm hover:bg-[#FF4F00] hover:text-white transition-colors';
  const activeLinkStyles = 'bg-black text-white hover:bg-[#FF4F00] hover:text-white';
  const dropdownPanelStyles =
    'absolute left-0 top-full mt-3 w-60 border border-black bg-[#F0F2E6] p-1.5 shadow-lg z-50';

  return (
    <header className="fixed inset-x-0 top-0 z-50 flex justify-center p-2">
      <div className="hidden md:flex items-center gap-2 border border-black bg-[#F0F2E6] p-1.5 shadow-sm">
        <Link
          href="/"
          className="font-header select-none rounded-sm px-4 py-1.5 text-base tracking-wide text-black hover:bg-[#FF4F00] hover:text-white transition-colors"
        >
          Atulya Mohan
        </Link>
        <div className="h-5 w-px bg-black/50 mx-1"></div>
        <ul className="flex items-center gap-2"> {/* Adjusted gap */}
          <li>
            <Link href="/about-me" className={`${linkStyles} ${isExact('/about-me') ? activeLinkStyles : ''}`}>About</Link>
          </li>
          <li className="relative group">
            <Link href="/projects" className={`${linkStyles} ${is('/projects') ? activeLinkStyles : ''}`}>
              Projects
            </Link>
            <div className="absolute left-0 top-full h-4 w-full" /> {/* Hover bridge */}
            <div className={`${dropdownPanelStyles} hidden group-hover:block`}>
              {projects.map((p) => (
                <Link key={p.href} href={p.href} className="block w-full rounded-sm px-3 py-2 text-sm font-header text-black hover:bg-[#FF4F00] hover:text-white transition-colors">
                  {p.label}
                </Link>
              ))}
            </div>
          </li>
          {/* UPDATED: Links and checks use 'creative-pursuits' */}
          <li className="relative group">
             {/* Main link points to /creative-pursuits */}
            <Link href="/creative-pursuits" className={`${linkStyles} ${is('/creative-pursuits') ? activeLinkStyles : ''}`}>
              Creative Pursuits
            </Link>
             <div className="absolute left-0 top-full h-4 w-full" /> {/* Hover bridge */}
            <div className={`${dropdownPanelStyles} hidden group-hover:block`}>
              {/* Use updated creativePursuits data */}
              {creativePursuits.map((c) => (
                <Link key={c.href} href={c.href} className="block w-full rounded-sm px-3 py-2 text-sm font-header text-black hover:bg-[#FF4F00] hover:text-white transition-colors">
                  {c.label}
                </Link>
              ))}
            </div>
          </li>
          <li>
            <Link href="/Resume" className={`${linkStyles} ${isExact('/Resume') ? activeLinkStyles : ''}`}>Resume</Link>
          </li>
        </ul>
      </div>

      {/* ===== MOBILE NAV ===== */}
      <div className="w-full md:hidden">
        <div className="flex h-14 w-full items-center justify-between border border-black bg-[#F0F2E6] px-4 shadow-sm">
          <Link
            href="/"
            className="font-header select-none rounded-sm px-3 py-1.5 text-base tracking-wide text-black"
          >
            Atulya Mohan
          </Link>
          <button
            className="rounded-sm p-2 text-black hover:bg-[#FF4F00] hover:text-white transition-colors"
            aria-label="Toggle menu"
            onClick={() => setMobileOpen((v) => !v)}
          >
            <Hamburger />
          </button>
        </div>
        {mobileOpen && (
          <div className="mt-2 w-full border border-black bg-[#F0F2E6] p-2 shadow-lg">
            <ul className="flex flex-col gap-1">
               <li><Link href="/about-me" className="block w-full p-3 font-header hover:bg-[#FF4F00] hover:text-white transition-colors">About</Link></li>
              {/* Projects Submenu */}
               <li>
                 <div className="flex items-center justify-between">
                   <Link href="/projects" className="block p-3 font-header hover:bg-[#FF4F00] hover:text-white transition-colors">Projects</Link>
                   <button
                     className="p-2 hover:bg-[#FF4F00]/20 rounded-sm"
                     onClick={() => setOpenSection(s => s === 'projects' ? null : 'projects')}
                     aria-expanded={openSection === 'projects'}
                   >
                     <ChevronDown className={`h-4 w-4 transition-transform ${openSection === 'projects' ? 'rotate-180' : ''}`} />
                   </button>
                 </div>
                 {openSection === 'projects' && (
                   <div className="pl-4 border-l border-black/20 ml-3">
                     {projects.map(p => (
                       <Link key={p.href} href={p.href} className="block w-full p-2 font-header text-sm hover:bg-[#FF4F00] hover:text-white transition-colors">
                         {p.label}
                       </Link>
                     ))}
                   </div>
                 )}
               </li>
               {/* UPDATED: Creative Submenu for mobile uses 'creative-pursuits' */}
               <li>
                 <div className="flex items-center justify-between">
                   <Link href="/creative-pursuits" className="block p-3 font-header hover:bg-[#FF4F00] hover:text-white transition-colors">Creative Pursuits</Link>
                    <button
                     className="p-2 hover:bg-[#FF4F00]/20 rounded-sm"
                     onClick={() => setOpenSection(s => s === 'creative-pursuits' ? null : 'creative-pursuits')}
                     aria-expanded={openSection === 'creative-pursuits'}
                   >
                     <ChevronDown className={`h-4 w-4 transition-transform ${openSection === 'creative-pursuits' ? 'rotate-180' : ''}`} />
                   </button>
                 </div>
                 {openSection === 'creative-pursuits' && (
                    <div className="pl-4 border-l border-black/20 ml-3">
                     {/* Use updated creativePursuits data */}
                     {creativePursuits.map(c => (
                       <Link key={c.href} href={c.href} className="block w-full p-2 font-header text-sm hover:bg-[#FF4F00] hover:text-white transition-colors">
                         {c.label}
                       </Link>
                     ))}
                   </div>
                 )}
               </li>
               <li><Link href="/Resume" className="block w-full p-3 font-header hover:bg-[#FF4F00] hover:text-white transition-colors">Resume</Link></li>
            </ul>
          </div>
        )}
      </div>
    </header>
  );
}

// --- ICONS ---
function Hamburger() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" fill="none">
      <path d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  );
}

