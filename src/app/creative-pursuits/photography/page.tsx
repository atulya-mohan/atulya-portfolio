'use client';

import Image from 'next/image';
import React, { useState, useEffect, useMemo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

type Photo = {
    id: string;
    title: string;
    description?: string;
    imageUrl: string;
    year?: string;
    location?: string;
};

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;

async function fetchPhotos(): Promise<Photo[]> {
    if (!supabase) {
        return [];
    }

    try {
        const { data, error } = await supabase
            .from('photos')
            .select('id, title, description, image_url, year, location')
            .order('sort_index', { ascending: true });

        if (error) {
            console.error('Supabase fetch error:', error);
            return [];
        }

        return (data || []).map((photo: any) => ({
            id: photo.id,
            title: photo.title,
            description: photo.description,
            imageUrl: photo.image_url,
            year: photo.year,
            location: photo.location,
        }));
    } catch (err) {
        console.error('Error fetching photos:', err);
        return [];
    }
}

export default function PhotographyPage() {
    const [photos, setPhotos] = useState<Photo[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [i, setI] = useState(0);

    const numPhotos = photos.length;
    const cur = photos[i];

    const cssVars = useMemo(
        () =>
          ({
            '--nav-h': '56px',
            '--gap': '12px',
            '--gutter': '22px',
          }) as React.CSSProperties,
        []
      );

    const goPhoto = (dir: -1 | 1) => () => {
        if (numPhotos <= 1) return;
        setI((prev) => (prev + dir + numPhotos) % numPhotos);
    };

    useEffect(() => {
        const loadPhotos = async () => {
            setLoading(true);
            try {
                const data = await fetchPhotos();
                setPhotos(data);
                if (data.length === 0) {
                    setError('No photos found');
                }
            } catch (err) {
                setError('Failed to load photos');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        loadPhotos();
    }, []);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'ArrowLeft') {
                goPhoto(-1)();
            } else if (e.key === 'ArrowRight') {
                goPhoto(1)();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [numPhotos, goPhoto]);

    if (loading) {
        return (
            <div className="fixed inset-0 h-full w-full flex items-center justify-center bg-[#F0F2E6] text-black">
                <p className="font-mono animate-pulse">Loading photos...</p>
            </div>
        );
    }

    if (error || !photos.length || !cur) {
        return (
            <div className="fixed inset-0 h-full w-full flex items-center justify-center bg-[#F0F2E6] text-black">
                <p className="font-mono">{error || 'No photos found.'}</p>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 h-full w-full overflow-hidden bg-[#F0F2E6] text-black">
            <style jsx global>{`
              .horizontal-scrollbar::-webkit-scrollbar { height: 8px; }
              .horizontal-scrollbar::-webkit-scrollbar-track { background: transparent; }
              .horizontal-scrollbar::-webkit-scrollbar-thumb { background: transparent; border-radius: 4px; border: 2px solid transparent; background-clip: padding-box; }
              .horizontal-scrollbar:hover::-webkit-scrollbar-thumb { background: black; }
              .horizontal-scrollbar { scrollbar-width: thin; scrollbar-color: transparent transparent; }
              .horizontal-scrollbar:hover { scrollbar-color: black transparent; }
              .vertical-scrollbar::-webkit-scrollbar { width: 8px; }
              .vertical-scrollbar::-webkit-scrollbar-track { background: transparent; }
              .vertical-scrollbar::-webkit-scrollbar-thumb { background: transparent; border-radius: 4px; border: 2px solid transparent; background-clip: padding-box; }
              .vertical-scrollbar:hover::-webkit-scrollbar-thumb { background: black; }
              .vertical-scrollbar { scrollbar-width: thin; scrollbar-color: transparent transparent; }
              .vertical-scrollbar:hover { scrollbar-color: black transparent; }
            `}</style>
            <section className="px-4 h-full" style={cssVars}>
                <div className="pt-[calc(var(--nav-h)+var(--gap))] pb-[var(--gap)] h-full flex flex-col">
                    <div className="mb-3 flex-shrink-0">
                        <h1 className="font-header text-3xl uppercase text-black">
                            <span className="opacity-60">Creative ›</span> Photography
                        </h1>
                    </div>

                    <div className="relative flex-1 min-h-0 flex flex-col gap-3">
                        <div className="grid flex-1 min-h-0 grid-cols-1 md:grid-cols-3 gap-3 border border-black bg-[#F0F2E6] p-4">
                            <div className="md:col-span-2 relative border border-black bg-black">
                                {cur.imageUrl && (
                                    <Image
                                        key={cur.id}
                                        src={cur.imageUrl}
                                        alt={cur.title}
                                        fill
                                        className="object-contain"
                                        sizes="(max-width: 768px) 100vw, 66vw"
                                        priority
                                        quality={75}
                                    />
                                )}
                                {numPhotos > 1 && (
                                    <>
                                    <button onClick={goPhoto(-1)} className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/50 p-2 text-white transition-colors hover:bg-[#FF4F00] z-10" aria-label="Previous Photo"><ChevronLeft className="h-6 w-6" /></button>
                                    <button onClick={goPhoto(1)} className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/50 p-2 text-white transition-colors hover:bg-[#FF4F00] z-10" aria-label="Next Photo"><ChevronRight className="h-6 w-6" /></button>
                                    </>
                                )}
                            </div>

                            <div className="md:col-span-1 flex flex-col border border-black p-3 gap-3 overflow-y-auto vertical-scrollbar">
                                <h2 className="font-header text-2xl uppercase text-black flex-shrink-0">{cur.title}</h2>
                                {(cur.year || cur.location) && (
                                    <div className="flex flex-wrap gap-x-3 gap-y-1 flex-shrink-0">
                                        {cur.year && <Pill label="Year" value={cur.year} />}
                                        {cur.location && <Pill label="Location" value={cur.location} />}
                                    </div>
                                )}
                                <p className="font-body text-sm text-zinc-700 flex-1 min-h-0">{cur.description || 'No description available.'}</p>
                            </div>
                        </div>

                        <div className="flex-shrink-0 h-28 flex flex-col">
                            <h3 className="font-header text-xl uppercase text-black mb-2 flex-shrink-0">Gallery</h3>
                            <div className="flex-1 min-h-0 flex items-center overflow-x-auto overflow-y-hidden scroll-smooth horizontal-scrollbar border border-black p-2 bg-[#F0F2E6]">
                                <div className="inline-flex items-center gap-3 pr-1 h-full">
                                    {photos.map((p, idx) => {
                                        const active = idx === i;
                                        return (
                                            <button
                                                key={p.id}
                                                onClick={() => setI(idx)}
                                                className={`relative h-full aspect-square shrink-0 overflow-hidden border bg-zinc-200 transition ${active ? 'border-4 border-[#FF4F00]' : 'border border-black/50 hover:border-black'}`}
                                                title={p.title}
                                            >
                                                {p.imageUrl && (
                                                    <Image
                                                        src={p.imageUrl}
                                                        alt={p.title}
                                                        fill
                                                        className="object-cover"
                                                        sizes="80px"
                                                        quality={60}
                                                    />
                                                )}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

function Pill({ label, value }: { label: string; value: string }) {
    if (!value) return null;
    return (
        <span className="inline-flex items-center gap-1 border border-black/50 bg-transparent px-2 py-1 text-xs font-mono text-black">
            <span className="opacity-70">{label}:</span>
            <span className="font-bold">{value}</span>
        </span>
    );
}