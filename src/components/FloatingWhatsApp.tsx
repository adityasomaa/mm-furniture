'use client';

import { useState } from 'react';
import { company, waLink, type Locale } from '@/lib/site';
import { useScrolledPast } from '@/lib/browser-state';
import { WhatsAppGlyph } from './enquiry/EnquirySheet';

/**
 * Floating WhatsApp action, bottom right.
 *
 * Appears after a short scroll rather than immediately: on first paint the hero already
 * carries a WhatsApp call to action, so showing this too would be the same offer twice
 * on one screen. It earns its place once that hero has scrolled away.
 *
 * On arrival the label widens out and then settles back to a disc, so it reads as an
 * offer rather than a mystery circle. That is a CSS animation keyed off the `show`
 * class, not a setState-plus-setTimeout dance in an effect: the browser can run it on
 * the compositor, and it needs no render to undo itself.
 *
 * Sits below the cookie banner in z-order and lifts while the banner is present, so the
 * two never overlap on a phone.
 */
export function FloatingWhatsApp({ locale, raised }: { locale: Locale; raised?: boolean }) {
  const show = useScrolledPast(520);
  const [hovered, setHovered] = useState(false);

  const label = locale === 'id' ? 'Chat WhatsApp' : 'Chat on WhatsApp';

  return (
    <a
      href={waLink(
        company.phones[0].wa,
        locale === 'id'
          ? 'Halo MM Furniture, saya mau tanya soal furnitur.'
          : 'Hello MM Furniture, I have a question about your furniture.',
      )}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
      className={[
        'group fixed right-5 z-[120] flex items-center gap-3 overflow-hidden rounded-full bg-brand py-4 pl-4 text-paper sm:right-7',
        'shadow-[0_14px_40px_-12px_rgba(44,26,21,0.75)] transition-all duration-500 ease-quart hover:bg-espresso',
        raised ? 'bottom-[8.5rem] sm:bottom-32' : 'bottom-5 sm:bottom-7',
        show
          ? 'translate-y-0 scale-100 opacity-100'
          : 'pointer-events-none translate-y-4 scale-90 opacity-0',
      ].join(' ')}
    >
      <WhatsAppGlyph className="h-6 w-6 shrink-0" />
      <span
        className={[
          'tag whitespace-nowrap transition-all duration-500 ease-quart',
          hovered ? 'max-w-[10rem] pr-1 opacity-100' : 'max-w-0 pr-0 opacity-0',
          // Runs once when the button first slides in: widens, holds, collapses. The
          // hover state above takes over afterwards.
          show && !hovered ? 'motion-safe:animate-[wa-peek_3s_var(--ease-quart)_400ms_1]' : '',
        ].join(' ')}
      >
        {label}
      </span>
    </a>
  );
}
