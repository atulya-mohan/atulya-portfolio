import type { Photo as PhotoRow } from '@/lib/types';
import photosData from '@/data/photos.json';

const rows = photosData as PhotoRow[];

export type Photo = {
  id: string;
  title: string;
  description: string | null;
  imageUrl: string;
  year: string | null;
  location: string | null;
};

export function getPhotos(): Photo[] {
  return rows.map(p => ({
    id: p.id,
    title: p.title,
    description: p.description ?? null,
    imageUrl: p.image_url,
    year: p.year ?? null,
    location: p.location ?? null,
  }));
}
