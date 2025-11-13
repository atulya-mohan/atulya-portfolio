'use client';

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Play, SkipBack, SkipForward, ChevronLeft, ChevronRight, ArrowUpRight } from "lucide-react";
import { createClient } from '@supabase/supabase-js';

type Photo = {
    id: string;
    title: string;
    imageUrl: string;
};

type CreativePursuitsCardProps = {
    photos?: { src: string; alt: string }[];
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
            .select('id, title, image_url')
            .order('sort_index', { ascending: true });

        if (error) {
            console.error('Supabase fetch error:', error);
            return [];
        }

        return (data || []).map((photo: any) => ({
            id: photo.id,
            title: photo.title,
            imageUrl: photo.image_url,
        }));
    } catch (err) {
        console.error('Error fetching photos:', err);
        return [];
    }
}

export default function CreativePursuitsCard({ photos: initialPhotos }: CreativePursuitsCardProps) {
    const [photos, setPhotos] = useState<Photo[]>(
        () =>
            initialPhotos?.map((photo, index) => ({
                id: `${index}`,
                title: photo.alt,
                imageUrl: photo.src,
            })) ?? []
    );
    const [idx, setIdx] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (initialPhotos?.length) {
            setLoading(false);
            return;
        }

        const loadPhotos = async () => {
            setLoading(true);
            try {
                const data = await fetchPhotos();
                setPhotos(data);
            } catch (err) {
                console.error('Failed to load photos:', err);
            } finally {
                setLoading(false);
            }
        };

        loadPhotos();
    }, [initialPhotos]);

    const n = Math.max(photos.length, 1);
    const cur = photos[idx % n];

    const next = () => setIdx((i) => (i + 1) % n);
    const prev = () => setIdx((i) => (i - 1 + n) % n);

    return (
        <div className="relative flex h-full min-h-0 flex-col gap-2 border border-black p-3">
            {/* 1. Main Header */}
            <div className="flex items-center justify-between">
                <h2 className="font-header text-3xl uppercase text-black">Creative Pursuits</h2>
                <Link
                    href="/creative-pursuits/photography"
                    aria-label="Open all Creative Pursuits"
                    title="Open all"
                    className="border border-black bg-transparent p-1.5 text-black transition-colors hover:bg-[#FF4F00] hover:text-white"
                >
                    <ArrowUpRight className="h-4 w-4" />
                </Link>
            </div>

            {/* 2. TWO COLUMNS */}
            <div className="grid h-full min-h-0 flex-1 grid-cols-1 items-stretch gap-3 md:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
                
                {/* LEFT column (music) */}
                <div className="flex h-full min-w-0 flex-col border border-black p-2">
                    <p className="font-mono text-base font-bold text-black">Music</p>
                    <div className="mt-auto pt-2">
                        <div className="grid grid-rows-[auto,1fr] gap-2">
                            <p className="font-mono text-xs leading-none text-zinc-700">Set 1</p>
                            <div className="grid grid-cols-[auto_auto_auto_1fr] items-center gap-1.5">
                                <button
                                    aria-label="Previous"
                                    className="flex h-8 w-8 items-center justify-center border-2 border-black text-black transition-colors hover:border-[#FF4F00] hover:bg-[#FF4F00] hover:text-white"
                                >
                                    <SkipBack className="h-4 w-4" />
                                </button>
                                <button
                                    aria-label="Play"
                                    className="flex h-8 w-8 items-center justify-center border-2 border-black text-black transition-colors hover:border-[#FF4F00] hover:bg-[#FF4F00] hover:text-white"
                                >
                                    <Play className="h-4 w-4" />
                                </button>
                                <button
                                    aria-label="Next"
                                    className="flex h-8 w-8 items-center justify-center border-2 border-black text-black transition-colors hover:border-[#FF4F00] hover:bg-[#FF4F00] hover:text-white"
                                >
                                    <SkipForward className="h-4 w-4" />
                                </button>
                                <div className="h-8 border-2 border-black/50" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* RIGHT column (photo carousel) */}
                <div className="relative h-full min-h-0 overflow-hidden border border-black bg-zinc-200">
                    {!loading && cur?.imageUrl ? (
                        <Image
                            src={cur.imageUrl}
                            alt={cur?.title || "photo"}
                            fill
                            className="object-cover"
                            sizes="(min-width: 1024px) 25vw, 50vw"
                            quality={75}
                        />
                    ) : null}
                    <div className="pointer-events-none absolute left-0 top-0 bg-black px-2 py-0.5">
                        <span className="text-[11px] font-mono font-medium text-white">
                            {cur?.title || `Shot ${((idx % n) + 1) || 1}`}
                        </span>
                    </div>
                    <button
                        onClick={prev}
                        aria-label="Previous photo"
                        className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 p-2 text-white transition-colors hover:bg-[#FF4F00]"
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </button>
                    <button
                        onClick={next}
                        aria-label="Next photo"
                        className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 p-2 text-white transition-colors hover:bg-[#FF4F00]"
                    >
                        <ChevronRight className="h-4 w-4" />
                    </button>
                </div>
            </div>
        </div>
    );
}