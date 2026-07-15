import type { ReactNode } from 'react';
import type { Locale } from '@/lib/site';
import { ui } from '@/lib/content';
import { SiteHeader } from './SiteHeader';
import { SiteFooter } from './SiteFooter';

export function Shell({ locale, children }: { locale: Locale; children: ReactNode }) {
  return (
    <>
      <a
        href="#main"
        className="tag sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:bg-copper focus:px-4 focus:py-3 focus:text-ink-deep"
      >
        {ui.skipToContent[locale]}
      </a>
      <SiteHeader locale={locale} />
      <main id="main">{children}</main>
      <SiteFooter locale={locale} />
    </>
  );
}

/** Section wrapper. Rhythm comes from the fluid `--spacing-section` token, not from a
 *  uniform padding value applied everywhere. */
export function Section({
  children,
  tone = 'bone',
  className = '',
  id,
}: {
  children: ReactNode;
  tone?: 'bone' | 'bone-shade' | 'ink';
  className?: string;
  id?: string;
}) {
  const tones = {
    bone: 'bg-bone text-graphite',
    'bone-shade': 'bg-bone-shade text-graphite',
    ink: 'bg-ink text-muted-on-ink',
  };
  return (
    <section id={id} className={`${tones[tone]} py-section ${className}`}>
      <div className="mx-auto max-w-[88rem] px-5 sm:px-8">{children}</div>
    </section>
  );
}

/** Small trade-document label above a section title. */
export function Kicker({ children, onInk = false }: { children: ReactNode; onInk?: boolean }) {
  return (
    <p className={`tag flex items-center gap-3 ${onInk ? 'text-copper' : 'text-copper-deep'}`}>
      <span className={`h-px w-8 ${onInk ? 'bg-copper/60' : 'bg-copper-deep/50'}`} />
      {children}
    </p>
  );
}
