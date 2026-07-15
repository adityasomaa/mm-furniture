'use client';

import type { ReactNode } from 'react';
import type { Locale } from '@/lib/site';
import { ui } from '@/lib/content';
import { useLocalStorage } from '@/lib/browser-state';
import { SmoothScroll } from './SmoothScroll';
import { TransitionProvider } from './transition/TransitionProvider';
import { EnquiryProvider } from './enquiry/EnquiryProvider';
import { CookieConsent, CONSENT_KEY } from './CookieConsent';
import { FloatingWhatsApp } from './FloatingWhatsApp';
import { SiteHeader } from './SiteHeader';

/**
 * Every client-side concern that must outlive a page change: smooth scroll, the curtain,
 * the enquiry sheet, the consent banner, the floating action.
 *
 * Mounted from the layout, never from a page. The curtain holds state across the exact
 * moment the route swaps, so if this lived inside the page tree it would unmount
 * mid-transition and take the curtain down with it, revealing the swap it exists to
 * hide.
 *
 * `footer` arrives as a prop rather than being imported here. It is a server component
 * that reads the 240-photo manifest for its category counts; importing it into this
 * client boundary would drag that whole manifest into the browser bundle. Passed as a
 * prop, it stays server-rendered.
 */
export function AppChrome({
  locale,
  footer,
  children,
}: {
  locale: Locale;
  footer: ReactNode;
  children: ReactNode;
}) {
  // Read through the same store the banner writes to, so the floating action lifts out
  // of its way the moment a choice is made, with no second source of truth.
  const bannerUp = useLocalStorage(CONSENT_KEY) === null;

  return (
    <TransitionProvider>
      <SmoothScroll />
      <EnquiryProvider locale={locale}>
        <a
          href="#main"
          className="tag sr-only rounded-full focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[210] focus:bg-brand focus:px-5 focus:py-3 focus:text-paper"
        >
          {ui.skipToContent[locale]}
        </a>
        <SiteHeader locale={locale} />
        <main id="main">{children}</main>
        {footer}
        <FloatingWhatsApp locale={locale} raised={bannerUp} />
        <CookieConsent locale={locale} />
      </EnquiryProvider>
    </TransitionProvider>
  );
}
