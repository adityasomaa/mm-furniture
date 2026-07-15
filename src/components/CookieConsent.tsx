'use client';

import { useEffect, useState } from 'react';
import { Analytics } from '@vercel/analytics/react';
import { localePath, type Locale } from '@/lib/site';
import { useLocalStorage, notifyStorage } from '@/lib/browser-state';
import { TransitionLink } from './transition/TransitionLink';

const KEY = 'mm-consent-v1';
export type Consent = 'accepted' | 'declined' | null;

export const CONSENT_KEY = KEY;

export const readConsent = (): Consent => {
  if (typeof window === 'undefined') return null;
  const v = window.localStorage.getItem(KEY);
  return v === 'accepted' || v === 'declined' ? v : null;
};

/**
 * Cookie consent that actually gates something.
 *
 * This banner is not decoration. Vercel Web Analytics is mounted only after an explicit
 * accept, and never mounted on decline. A banner that appears, gets clicked, and changes
 * nothing is worse than no banner: it trains people that the choice is fake, and it
 * claims a compliance posture the site does not have.
 *
 * What the site actually stores, stated plainly in the copy:
 *   - always: this consent choice, in localStorage. Functional, no consent needed for it.
 *   - only on accept: Vercel Web Analytics. Anonymous and cookieless, but it does process
 *     an IP server-side to count a visit, which is enough to be worth asking about.
 * There is no advertising, no profiling, and nothing sold on. The copy says exactly that
 * because it is true, not because it sounds good.
 */
export function CookieConsent({ locale }: { locale: Locale }) {
  const stored = useLocalStorage(KEY);
  const consent: Consent = stored === 'accepted' || stored === 'declined' ? stored : null;
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (consent !== null) return;
    // Let the intro curtain finish before asking. Interrupting the first impression with
    // a legal panel is a poor greeting.
    const t = setTimeout(() => setVisible(true), 2600);
    return () => clearTimeout(t);
  }, [consent]);

  const decide = (choice: Exclude<Consent, null>) => {
    window.localStorage.setItem(KEY, choice);
    notifyStorage();
    setVisible(false);
  };

  const t =
    locale === 'id'
      ? {
          title: 'Soal data',
          body: 'Situs ini tidak melacak Anda secara default. Kalau diizinkan, kami menyalakan statistik kunjungan anonim untuk tahu halaman mana yang berguna. Tidak ada iklan, tidak ada profil, tidak dijual ke siapa pun.',
          accept: 'Izinkan',
          decline: 'Tidak usah',
          more: 'Kebijakan Privasi',
        }
      : {
          title: 'About data',
          body: 'This site does not track you by default. If you allow it, we switch on anonymous visit statistics so we can see which pages are useful. No ads, no profiling, nothing sold on.',
          accept: 'Allow',
          decline: 'No thanks',
          more: 'Privacy Policy',
        };

  return (
    <>
      {/* Mounted only on an explicit accept. */}
      {consent === 'accepted' && <Analytics />}

      <div
        role="dialog"
        aria-label={t.title}
        aria-live="polite"
        className={[
          'fixed inset-x-4 bottom-4 z-[140] mx-auto max-w-[36rem] sm:inset-x-auto sm:bottom-6 sm:left-6',
          'glass rounded-lg p-5 shadow-[0_24px_60px_-24px_rgba(44,26,21,0.6)] sm:p-6',
          'transition-all duration-[600ms] ease-quart',
          visible
            ? 'pointer-events-auto translate-y-0 opacity-100'
            : 'pointer-events-none translate-y-6 opacity-0',
        ].join(' ')}
      >
        <p className="tag text-brand">{t.title}</p>
        <p className="mt-3 text-[0.9rem] leading-relaxed text-bark">{t.body}</p>

        <div className="mt-5 flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={() => decide('accepted')}
            className="tag rounded-full bg-brand px-5 py-3 text-paper transition-colors duration-200 hover:bg-espresso"
          >
            {t.accept}
          </button>
          <button
            type="button"
            onClick={() => decide('declined')}
            className="tag rounded-full border border-linen px-5 py-3 text-clay transition-colors duration-200 hover:border-clay hover:text-bark"
          >
            {t.decline}
          </button>
          <TransitionLink
            href={localePath(locale, 'privacy')}
            className="tag ml-auto text-clay underline underline-offset-4 transition-colors duration-200 hover:text-brand"
          >
            {t.more}
          </TransitionLink>
        </div>
      </div>
    </>
  );
}
