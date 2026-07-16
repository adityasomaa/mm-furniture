'use client';

import { company, waLink, type Locale } from '@/lib/site';
import { useScrolledPast } from '@/lib/browser-state';
import { WhatsAppGlyph } from './enquiry/EnquirySheet';

/**
 * Floating WhatsApp action, bottom right.
 *
 * Icon only. No label, no widening on hover: the mark is universally recognised and the
 * text was doing nothing but reflowing the button under the cursor.
 *
 * Centring is done with `grid place-items-center` on a fixed square rather than padding.
 * Padding-based centring is what drifts: the glyph's own bounding box is not perfectly
 * symmetrical, and any horizontal padding difference shows up immediately in a circle.
 * A fixed square with the glyph centred in it cannot drift.
 *
 * Appears after a short scroll rather than immediately: on first paint the hero already
 * carries a WhatsApp call to action, so showing this too would be the same offer twice
 * on one screen. It earns its place once that hero has scrolled away.
 *
 * Sits below the cookie banner in z-order and lifts while the banner is present, so the
 * two never overlap on a phone.
 */
export function FloatingWhatsApp({ locale, raised }: { locale: Locale; raised?: boolean }) {
  const show = useScrolledPast(520);
  const label = locale === 'id' ? 'Chat lewat WhatsApp' : 'Chat on WhatsApp';

  return (
    <a
      href={waLink(
        company.phones[0].wa,
        locale === 'id'
          ? 'Halo MM Furniture, saya ingin bertanya mengenai produk furnitur Anda.'
          : 'Hello MM Furniture, I have a question about your furniture.',
      )}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      title={label}
      className={[
        'fixed right-5 z-[120] grid h-14 w-14 place-items-center rounded-full bg-brand text-paper sm:right-7 sm:h-[3.75rem] sm:w-[3.75rem]',
        'shadow-[0_14px_40px_-12px_rgba(44,26,21,0.75)] transition-all duration-500 ease-quart',
        'hover:scale-[1.06] hover:bg-espresso',
        raised ? 'bottom-[8.5rem] sm:bottom-32' : 'bottom-5 sm:bottom-7',
        show
          ? 'translate-y-0 scale-100 opacity-100'
          : 'pointer-events-none translate-y-4 scale-90 opacity-0',
      ].join(' ')}
    >
      <WhatsAppGlyph className="h-7 w-7" />
    </a>
  );
}
