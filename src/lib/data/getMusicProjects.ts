import type { MusicProject } from '@/lib/types';
import musicData from '@/data/music-projects.json';

const rows = musicData as MusicProject[];

export function getMusicCoverUrl(): string | null {
  return rows[0]?.image_url ?? null;
}
