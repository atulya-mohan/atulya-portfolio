'use client'; // 👈 Re-added 'use client'

import Link from 'next/link';
import Image from 'next/image';
import { ArrowUpRight, Music, Camera } from 'lucide-react';
import React, { useState, useEffect, useMemo } from 'react'; // Import hooks
import { createClient } from '@supabase/supabase-js'; // Import client

// Define type for our fetched data
type Category = {
  name: string;
  href: string;
  description: string;
  icon: typeof Music; // Use the icon component directly
  image: string | null; // Image URL can be null
};

// Initial data structure
const initialCategories: Category[] = [
  {
    name: 'Music',
    href: '/creative-pursuits/music',
    description: 'Compositions, performances, and sound design.',
    icon: Music,
    image: null,
  },
  {
    name: 'Photography',
    href: '/creative-pursuits/photography',
    description: 'Exploring moments through the lens.',
    icon: Camera,
    image: null,
  },
];

// Main Page Component is now a Client Component
export default function CreativePage() {
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [loading, setLoading] = useState(true);

  const cssVars = useMemo(
    () =>
      ({
        '--nav-h': '56px',
        '--gap': '12px',
        '--gutter': '22px',
      }) as React.CSSProperties,
    []
  );

  // --- Fetch data on the client ---
  useEffect(() => {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || '',
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
    );

    const fetchCovers = async () => {
      setLoading(true);

      // 1. Fetch Photography Cover
      const { data: photoData } = await supabase
        .from('photos')
        .select('image_url')
        .order('sort_index', { ascending: true })
        .limit(1)
        .maybeSingle();

      // 2. Fetch Music Cover
      const { data: musicData, error: musicError } = await supabase
        .from('music_projects')
        .select('image_url')
        .order('sort_index', { ascending: true })
        .limit(1)
        .maybeSingle();

      // 👇 ADD THESE LINES
      if (musicError) {
        console.error('MUSIC FETCH ERROR:', musicError.message);
      }
      console.log('Music Data:', musicData);
      // 👆 END

      // 3. Update the state
      setCategories([
        {
          ...initialCategories[0], // Music
          image: musicData?.image_url || null,
        },
        {
          ...initialCategories[1], // Photography
          image: photoData?.image_url || null,
        },
      ]);
      setLoading(false);
    };

    fetchCovers();
  }, []); // Runs once on mount

  return (
    <div className="fixed inset-0 h-full w-full overflow-hidden bg-[#F0F2E6] text-black">
       <style jsx global>{`
          /* Add scrollbar styles if needed, though this page might not scroll */
          .page-scrollbar::-webkit-scrollbar { width: 8px; }
          .page-scrollbar::-webkit-scrollbar-track { background: transparent; }
          .page-scrollbar::-webkit-scrollbar-thumb { background: transparent; border-radius: 4px; border: 2px solid transparent; background-clip: padding-box; }
          .page-scrollbar:hover::-webkit-scrollbar-thumb { background: black; }
          .page-scrollbar { scrollbar-width: thin; scrollbar-color: transparent transparent; }
          .page-scrollbar:hover { scrollbar-color: black transparent; }
        `}</style>
      <section className="px-4 h-full" style={cssVars}>
        <div className="pt-[calc(var(--nav-h)+var(--gap))] pb-[var(--gap)] h-full flex flex-col">
          {/* ===== Breadcrumb ===== */}
          <div className="mb-3 flex-shrink-0">
            <h1 className="font-header text-3xl uppercase text-black">
              Creative Pursuits
            </h1>
          </div>

          {/* ===== Main Content Grid ===== */}
          <div className="grid flex-1 min-h-0 grid-cols-1 md:grid-cols-2 gap-[var(--gap)]">
            {categories.map((category) => (
              <Link key={category.name} href={category.href} className="group block border border-black p-4 bg-[#F0F2E6] transition-colors hover:border-[#FF4F00]">
                 <div className="flex flex-col h-full">
                    <div className="flex justify-between items-start mb-3">
                         <h2 className="font-header text-3xl uppercase text-black">{category.name}</h2>
                         <ArrowUpRight className="h-5 w-5 text-black/50 group-hover:text-[#FF4F00] transition-colors" />
                    </div>
                     <p className="font-body text-sm text-zinc-700 mb-4 flex-1">{category.description}</p>
                     
                     {/* Updated Image section */}
                     <div className="aspect-video relative border border-black bg-zinc-200">
                         {loading ? (
                           <div className="w-full h-full flex items-center justify-center">
                             <p className="font-mono text-xs animate-pulse">Loading...</p>
                           </div>
                         ) : (category.image && (category.image.startsWith('http') || category.image.startsWith('/'))) ? (
                            <Image 
                              src={category.image} 
                              alt={category.name} 
                              fill 
                              className="object-cover"
                              sizes="(max-width: 768px) 100vw, 50vw"
                            />
                         ) : (
                           <div className="w-full h-full flex items-center justify-center">
                             {/* Show icon as a fallback */}
                             <category.icon className="w-12 h-12 text-zinc-400" strokeWidth={1} />
                           </div>
                         )}
                     </div>
                 </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}