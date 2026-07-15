import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/site';

/**
 * GEO posture: AI crawlers are allowed on purpose.
 *
 * A furniture exporter has nothing to lose and a great deal to gain from being the
 * source an answer engine cites when someone asks "who makes export furniture in Bali".
 * Blocking GPTBot / ClaudeBot / PerplexityBot here would be a decision to be absent from
 * that answer. The one exception is Bytespider, which ignores crawl-delay and has no
 * user-facing citation surface to gain from.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/'],
      },
      {
        userAgent: [
          'GPTBot',
          'OAI-SearchBot',
          'ChatGPT-User',
          'ClaudeBot',
          'Claude-User',
          'Claude-SearchBot',
          'PerplexityBot',
          'Perplexity-User',
          'Google-Extended',
          'Applebot-Extended',
          'meta-externalagent',
          'cohere-ai',
          'DuckAssistBot',
        ],
        allow: '/',
      },
      {
        userAgent: 'Bytespider',
        disallow: '/',
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
