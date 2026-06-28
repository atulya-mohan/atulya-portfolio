import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://atulya-portfolio.vercel.app';

  return [
    { url: base, lastModified: new Date(), changeFrequency: 'monthly', priority: 1 },
    { url: `${base}/about-me`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/projects`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.9 },
    { url: `${base}/projects/mechanical-engineering`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/projects/engineering-management`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/projects/software-design`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/creative-pursuits`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${base}/creative-pursuits/photography`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${base}/creative-pursuits/music`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${base}/resume`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
  ];
}
