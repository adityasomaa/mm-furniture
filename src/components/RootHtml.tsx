import type { ReactNode } from 'react';
import { urbanist } from '@/lib/fonts';
import type { Locale } from '@/lib/site';

/**
 * Shared <html> shell for both root layouts.
 *
 * The site uses two root layouts (one per locale route group) rather than a
 * `/[locale]` dynamic segment, because Indonesian has to stay at the domain root to
 * preserve the legacy WordPress URLs that are already indexed. Two root layouts is the
 * only way to emit a correct `lang` attribute for each without a redirect hop.
 */
export function RootHtml({ locale, children }: { locale: Locale; children: ReactNode }) {
  return (
    <html lang={locale === 'id' ? 'id-ID' : 'en'} className={urbanist.variable}>
      <body className="min-h-dvh bg-paper antialiased">{children}</body>
    </html>
  );
}
