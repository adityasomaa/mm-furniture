import type { MetadataRoute } from 'next';
import { SITE_URL, categories, localePath } from '@/lib/site';
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
    ...categories.map((c) => ({
      path: `catalog/${c.slug}`,
      priority: 0.8,
      freq: 'monthly' as const,
    })),
    { path: 'blog', priority: 0.7, freq: 'monthly' },
    ...posts.map((p) => ({ path: `blog/${p.slug}`, priority: 0.6, freq: 'yearly' as const })),
    { path: 'about', priority: 0.6, freq: 'yearly' },
    { path: 'contact', priority: 0.7, freq: 'yearly' },
    { path: 'privacy', priority: 0.2, freq: 'yearly' },
    { path: 'terms', priority: 0.2, freq: 'yearly' },
  ];

  return routes.map((r) => ({
    url: abs(localePath('id', r.path)),
    lastModified: now,
    changeFrequency: r.freq,
    priority: r.priority,
    alternates: {
      languages: {
        'id-ID': abs(localePath('id', r.path)),
        en: abs(localePath('en', r.path)),
        'x-default': abs(localePath('id', r.path)),
      },
    },
  }));
}
