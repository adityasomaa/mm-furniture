import type { MetadataRoute } from 'next';
import { SITE_URL, localePath } from '@/lib/site';
import { ROOMS, products } from '@/lib/catalog';
import { hasProjects } from '@/lib/projects';
import { posts } from '@/lib/posts';

/**
 * Every URL is emitted once, carrying the full hreflang cluster in `alternates`.
 * Listing the same page twice (once per language) is the usual mistake and it splits
 * the cluster, so both localisations are declared on a single entry.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const abs = (p: string) => new URL(p, SITE_URL).toString();

  const routes: { path: string; priority: number; freq: MetadataRoute.Sitemap[number]['changeFrequency'] }[] = [
    { path: '', priority: 1.0, freq: 'monthly' },
    { path: 'catalog', priority: 0.9, freq: 'monthly' },
    ...ROOMS.map((room) => ({
      path: `catalog/${room}`,
      priority: 0.8,
      freq: 'monthly' as const,
    })),
    // 227 product pages. They are the pages that can actually rank for a query like
    // "meja makan jati Bali", so they belong here even though the file gets long.
    ...products.map((p) => ({
      path: `catalog/${p.room}/${p.slug}`,
      priority: 0.7,
      freq: 'yearly' as const,
    })),
    // Only once the route exists; see @/lib/projects.
    ...(hasProjects() ? [{ path: 'projects', priority: 0.8, freq: 'monthly' as const }] : []),
    { path: 'blog', priority: 0.7, freq: 'monthly' },
    ...posts.map((p) => ({ path: `blog/${p.slug}`, priority: 0.6, freq: 'yearly' as const })),
    { path: 'about', priority: 0.6, freq: 'yearly' },
    { path: 'contact', priority: 0.7, freq: 'yearly' },
    { path: 'privacy', priority: 0.2, freq: 'yearly' },
    { path: 'terms', priority: 0.2, freq: 'yearly' },
  ];

  // The listed URL is the English one, because English is the default surface and sits
  // at the root. The Indonesian twin rides along in `alternates`.
  return routes.map((r) => ({
    url: abs(localePath('en', r.path)),
    lastModified: now,
    changeFrequency: r.freq,
    priority: r.priority,
    alternates: {
      languages: {
        en: abs(localePath('en', r.path)),
        'id-ID': abs(localePath('id', r.path)),
        'x-default': abs(localePath('en', r.path)),
      },
    },
  }));
}
