import type { Locale } from '@/lib/site';
import { faq, faqTitle } from '@/lib/content';
import { Kicker } from './Shell';

/**
 * Native <details> disclosure: no client JS, works before hydration, and keyboard
 * accessible for free.
 *
 * GEO note: the answers stay in the DOM whether or not the disclosure is open, because
 * <details> only hides them visually. An answer engine reading the HTML gets all six
 * answers in full. This is why the FAQ is not a JS accordion that mounts content on
 * click, which would leave crawlers with six questions and no answers.
 */
export function Faq({ locale }: { locale: Locale }) {
  return (
    <div id="faq" className="grid gap-10 lg:grid-cols-[minmax(0,22rem)_1fr] lg:gap-20">
      <div>
        <Kicker>FAQ</Kicker>
        <h2 className="stencil mt-5 text-title text-ink">{faqTitle[locale]}</h2>
      </div>

      <div className="border-t border-bone-hair">
        {faq.map((f) => (
          <details key={f.q[locale]} className="group border-b border-bone-hair">
            <summary className="flex cursor-pointer list-none items-start justify-between gap-6 py-5 text-head font-semibold text-ink transition-colors duration-200 hover:text-copper-deep [&::-webkit-details-marker]:hidden">
              <h3 className="text-head font-semibold">{f.q[locale]}</h3>
              <span
                aria-hidden="true"
                className="mt-1 shrink-0 text-copper-deep transition-transform duration-300 ease-[cubic-bezier(0.165,0.84,0.44,1)] group-open:rotate-45"
              >
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.6">
                  <path d="M9 1v16M1 9h16" />
                </svg>
              </span>
            </summary>
            <p className="prose-body pb-6 pr-8 text-[0.98rem] leading-relaxed text-muted">{f.a[locale]}</p>
          </details>
        ))}
      </div>
    </div>
  );
}
