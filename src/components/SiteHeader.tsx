'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { company, localePath, type Locale } from '@/lib/site';
import { nav, ui } from '@/lib/content';
import { rooms } from '@/lib/rooms';
import { countFor } from '@/lib/room-counts';
import { useScrolledPast } from '@/lib/browser-state';
import { Wordmark } from './Wordmark';
import { TransitionLink } from './transition/TransitionLink';
import { useHeaderTone } from './useHeaderTone';
import { useEnquiry } from './enquiry/EnquiryProvider';

/**
 * Header.
 *
 * Layout follows the brief: the five nav links group together, then a gap, then the
 * translate and enquire actions sit apart from them. The separation is the point, so it
 * is a real gap plus a hairline divider, not just margin.
 *
 * The logo inverts against whatever is underneath it (see useHeaderTone). Before the
 * page has scrolled the header is transparent and rides the hero's own tone; once
 * scrolled it takes on glass and always reads as light.
 */
export function SiteHeader({ locale }: { locale: Locale }) {
  const pathname = usePathname();
  const scrolled = useScrolledPast(24);
  const [menuOpen, setMenuOpen] = useState(false);
  const [catOpen, setCatOpen] = useState(false);
  const catRef = useRef<HTMLLIElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const sectionTone = useHeaderTone();
  const { open: openEnquiry } = useEnquiry();

  // Once glass is behind it, the header is always a light surface regardless of what is
  // scrolling past underneath.
  const tone = scrolled ? 'light' : sectionTone;
  const onDark = tone === 'dark';

  const other: Locale = locale === 'id' ? 'en' : 'id';
  const otherHref = localePath(other);
  const homeHref = localePath(locale);

  // Close everything when the route changes, or the menu hangs open over the new page.
  //
  // Adjusted during render rather than in an effect. This is React's documented shape
  // for "reset state when a prop changes": it resolves before the browser paints, so the
  // menu is never briefly visible over the new route, and it avoids the cascading
  // re-render an effect would cause.
  const [prevPath, setPrevPath] = useState(pathname);
  if (prevPath !== pathname) {
    setPrevPath(pathname);
    setMenuOpen(false);
    setCatOpen(false);
  }

  // Escape closes, and body scroll locks while the sheet is open.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      setMenuOpen(false);
      setCatOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  // Click-away for the catalogue dropdown.
  useEffect(() => {
    if (!catOpen) return;
    const onDown = (e: PointerEvent) => {
      if (!catRef.current?.contains(e.target as Node)) setCatOpen(false);
    };
    window.addEventListener('pointerdown', onDown);
    return () => window.removeEventListener('pointerdown', onDown);
  }, [catOpen]);

  const link = onDark ? 'text-linen hover:text-paper' : 'text-clay hover:text-brand';
  const logoColor = onDark ? 'text-paper' : 'text-brand';

  const openCat = () => {
    clearTimeout(closeTimer.current);
    setCatOpen(true);
  };
  // A grace period on leave: without it, the diagonal mouse path from the trigger to
  // the panel crosses dead space and slams the menu shut mid-gesture.
  const closeCat = () => {
    closeTimer.current = setTimeout(() => setCatOpen(false), 140);
  };

  return (
    <header
      className={[
        'fixed inset-x-0 top-0 z-[100] transition-all duration-500 ease-quart',
        scrolled ? 'glass shadow-[0_1px_24px_-12px_rgba(70,43,36,0.4)]' : 'bg-transparent',
      ].join(' ')}
    >
      <div className="mx-auto flex h-[76px] max-w-[88rem] items-center gap-4 px-5 sm:px-8">
        <TransitionLink href={homeHref} className="shrink-0" aria-label={company.name}>
          <Wordmark className={`h-8 w-auto transition-colors duration-500 ${logoColor}`} />
        </TransitionLink>

        {/* ── Desktop nav ─────────────────────────────────────────────────── */}
        <nav aria-label="Primary" className="ml-auto hidden items-center lg:flex">
          <ul className="flex items-center gap-8">
            {nav.map((item) =>
              item.key === 'catalog' ? (
                <li
                  key={item.key}
                  ref={catRef}
                  className="relative"
                  onPointerEnter={openCat}
                  onPointerLeave={closeCat}
                >
                  <button
                    type="button"
                    onClick={() => setCatOpen((v) => !v)}
                    aria-expanded={catOpen}
                    aria-haspopup="true"
                    className={`tag flex items-center gap-1.5 transition-colors duration-300 ${link}`}
                  >
                    {item.label[locale]}
                    <svg
                      width="9"
                      height="6"
                      viewBox="0 0 9 6"
                      fill="none"
                      aria-hidden="true"
                      className={`transition-transform duration-300 ${catOpen ? 'rotate-180' : ''}`}
                    >
                      <path d="M1 1l3.5 3.5L8 1" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                    </svg>
                  </button>

                  <div
                    className={[
                      'absolute left-1/2 top-[calc(100%+1.1rem)] w-[26rem] -translate-x-1/2 origin-top',
                      'glass rounded-lg p-2.5 transition-all duration-300 ease-quart',
                      catOpen
                        ? 'pointer-events-auto translate-y-0 scale-100 opacity-100'
                        : 'pointer-events-none -translate-y-2 scale-[0.97] opacity-0',
                    ].join(' ')}
                  >
                    <ul className="grid grid-cols-2 gap-1">
                      {rooms.map((r) => (
                        <li key={r.slug}>
                          <TransitionLink
                            href={localePath(locale, `catalog/${r.slug}`)}
                            className="flex items-center justify-between rounded-sm px-3.5 py-3 text-sm text-bark transition-colors duration-200 hover:bg-linen/60 hover:text-brand"
                          >
                            {r.label[locale]}
                            <span className="text-[0.65rem] tabular-nums text-clay/70">{countFor(r.slug)}</span>
                          </TransitionLink>
                        </li>
                      ))}
                    </ul>
                    <TransitionLink
                      href={localePath(locale, 'catalog')}
                      className="tag mt-1.5 flex items-center justify-center gap-2 rounded-sm bg-brand px-3.5 py-3 text-paper transition-colors duration-200 hover:bg-espresso"
                    >
                      {ui.rooms[locale]}
                      <span aria-hidden="true">→</span>
                    </TransitionLink>
                  </div>
                </li>
              ) : (
                <li key={item.key}>
                  <TransitionLink
                    href={localePath(locale, item.path)}
                    className={`tag transition-colors duration-300 ${link}`}
                  >
                    {item.label[locale]}
                  </TransitionLink>
                </li>
              ),
            )}
          </ul>

          {/* The gap the brief asked for: actions live apart from the nav links. */}
          <span
            aria-hidden="true"
            className={`mx-7 h-5 w-px transition-colors duration-500 ${onDark ? 'bg-linen/25' : 'bg-linen'}`}
          />

          <div className="flex items-center gap-2.5">
            <TransitionLink
              href={otherHref}
              hrefLang={other}
              lang={other}
              aria-label={`${ui.languageLabel[locale]}: ${other === 'en' ? 'English' : 'Bahasa Indonesia'}`}
              className={[
                'tag flex items-center gap-1.5 rounded-full border px-3.5 py-2 transition-all duration-300',
                onDark
                  ? 'border-linen/30 text-linen hover:border-linen/60 hover:text-paper'
                  : 'border-linen text-clay hover:border-brand hover:text-brand',
              ].join(' ')}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <circle cx="12" cy="12" r="9.5" stroke="currentColor" strokeWidth="1.5" />
                <path
                  d="M2.5 12h19M12 2.5c2.5 2.6 3.8 6 3.8 9.5s-1.3 6.9-3.8 9.5c-2.5-2.6-3.8-6-3.8-9.5S9.5 5.1 12 2.5z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
              </svg>
              {other.toUpperCase()}
            </TransitionLink>

            <button
              type="button"
              onClick={() => openEnquiry()}
              className="tag rounded-full bg-brand px-5 py-2.5 text-paper transition-all duration-300 hover:bg-espresso hover:shadow-[0_8px_24px_-8px_rgba(92,58,49,0.6)]"
            >
              {ui.enquire[locale]}
            </button>
          </div>
        </nav>

        {/* ── Mobile / tablet trigger ─────────────────────────────────────── */}
        <button
          type="button"
          onClick={() => setMenuOpen((v) => !v)}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          aria-label={menuOpen ? ui.close[locale] : ui.menu[locale]}
          className={[
            'ml-auto grid h-11 w-11 place-items-center rounded-full border transition-colors duration-300 lg:hidden',
            menuOpen
              ? 'border-linen bg-paper text-brand'
              : onDark
                ? 'border-linen/30 text-paper'
                : 'border-linen text-brand',
          ].join(' ')}
        >
          <span className="relative block h-3 w-5">
            <span
              className={`absolute left-0 block h-px w-5 bg-current transition-all duration-300 ease-quart ${
                menuOpen ? 'top-1.5 rotate-45' : 'top-0'
              }`}
            />
            <span
              className={`absolute left-0 top-1.5 block h-px w-5 bg-current transition-all duration-200 ${
                menuOpen ? 'opacity-0' : 'opacity-100'
              }`}
            />
            <span
              className={`absolute left-0 block h-px w-5 bg-current transition-all duration-300 ease-quart ${
                menuOpen ? 'top-1.5 -rotate-45' : 'top-3'
              }`}
            />
          </span>
        </button>
      </div>

      {/* ── Mobile / tablet sheet ─────────────────────────────────────────── */}
      <div
        id="mobile-menu"
        className={[
          'glass overflow-hidden border-t border-linen/60 transition-[max-height,opacity] duration-500 ease-quart lg:hidden',
          menuOpen ? 'max-h-[85vh] opacity-100' : 'max-h-0 opacity-0',
        ].join(' ')}
      >
        <div className="max-h-[85vh] overflow-y-auto px-5 pb-8 pt-2 sm:px-8">
          <ul className="divide-y divide-linen/70">
            {nav.map((item) =>
              item.key === 'catalog' ? (
                <li key={item.key} className="py-1">
                  <details className="group">
                    <summary className="flex cursor-pointer list-none items-center justify-between py-4 text-lg text-bark [&::-webkit-details-marker]:hidden">
                      {item.label[locale]}
                      <span className="grid h-7 w-7 place-items-center rounded-full border border-linen text-clay transition-transform duration-300 group-open:rotate-45">
                        <svg width="11" height="11" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                          <path d="M6 1v10M1 6h10" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                        </svg>
                      </span>
                    </summary>
                    <ul className="grid grid-cols-2 gap-1.5 pb-4 pt-1">
                      {rooms.map((r) => (
                        <li key={r.slug}>
                          <TransitionLink
                            href={localePath(locale, `catalog/${r.slug}`)}
                            className="flex items-center justify-between rounded-sm bg-shell px-4 py-3 text-sm text-bark"
                          >
                            {r.label[locale]}
                            <span className="text-[0.65rem] tabular-nums text-clay/70">{countFor(r.slug)}</span>
                          </TransitionLink>
                        </li>
                      ))}
                    </ul>
                  </details>
                </li>
              ) : (
                <li key={item.key}>
                  <TransitionLink href={localePath(locale, item.path)} className="block py-4 text-lg text-bark">
                    {item.label[locale]}
                  </TransitionLink>
                </li>
              ),
            )}
          </ul>

          <div className="mt-6 flex flex-col gap-2.5">
            <button
              type="button"
              onClick={() => {
                setMenuOpen(false);
                openEnquiry();
              }}
              className="tag rounded-full bg-brand px-6 py-4 text-center text-paper"
            >
              {ui.enquire[locale]}
            </button>
            <TransitionLink
              href={otherHref}
              hrefLang={other}
              lang={other}
              className="tag rounded-full border border-linen px-6 py-4 text-center text-clay"
            >
              {other === 'en' ? 'English' : 'Bahasa Indonesia'}
            </TransitionLink>
          </div>
        </div>
      </div>
    </header>
  );
}
