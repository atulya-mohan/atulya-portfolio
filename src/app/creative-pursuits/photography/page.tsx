import type { Metadata } from 'next';
import { getPhotos } from '@/lib/data/getPhotos';
import PhotographyClient from './PhotographyClient';

export const metadata: Metadata = {
  title: 'Photography',
  description:
    'Photography by Atulya Mohan — exploring moments through the lens.',
};

export default function PhotographyPage() {
  const photos = getPhotos();
  return <PhotographyClient photos={photos} />;
}
