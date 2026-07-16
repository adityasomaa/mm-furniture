import type { MetadataRoute } from 'next';
import { company } from '@/lib/site';

export const dynamic = 'force-static';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: company.name,
    short_name: company.short,
    description: company.tagline.en,
    start_url: '/',
    display: 'standalone',
    background_color: '#2c1a15',
    theme_color: '#2c1a15',
    lang: 'en',
    categories: ['shopping', 'business'],
    icons: [
      { src: '/brand/icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/brand/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
    ],
  };
}
