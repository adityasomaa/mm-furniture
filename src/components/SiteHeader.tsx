import Link from 'next/link';
import { company, waLink, type Locale } from '@/lib/site';
import { nav, ui } from '@/lib/content';
import { Wordmark } from './Wordmark';

/**
 * Header is a server component with no client JS. The mobile menu is a native
 * <details> disclosure, so it works before hydration and needs no state.
 */
export function SiteHeader({ locale }: { locale: Locale }) {
  const other: Locale = locale === 'id' ? 'en' : 'id';
  const otherHref = locale === 'id' ? '/en' : '/';
  const homeHref = locale === 'id' ? '/' : '/en';
  const wa = waLink(
    company.phones[0].wa,
    locale === 'id'
      ? 'Halo MM Furniture, saya mau tanya soal furnitur.'
      : 'Hello MM Furniture, I have a question about your furniture.',
  );

  return (
    <header className="sticky top-0 z-50 border-b border-ink-hair/40 bg-ink/95 backdrop-blur-[2px]">
      <div className="mx-auto flex max-w-[88rem] items-center gap-4 px-5 py-3.5 sm:px-8">
        <Link href={homeHref} className="shrink-0" aria-label={company.name}>
          <Wordmark className="h-6 w-auto text-bone sm:h-7" />
        </Link>

        <nav aria-label={ui.menu[locale]} className="ml-auto hidden items-center gap-7 md:flex">
          {nav.map((item) => (
            <Link
              key={item.href[locale]}
              href={item.href[locale]}
              className="tag text-muted-on-ink transition-colors duration-200 hover:text-bone"
            >
              {item.label[locale]}
            </Link>
          ))}

          <Link
            href={otherHref}
            hrefLang={other}
            lang={other}
            aria-label={`${ui.languageLabel[locale]}: ${other === 'en' ? 'English' : 'Bahasa Indonesia'}`}
            className="tag border border-ink-hair px-2 py-1 text-muted-on-ink transition-colors duration-200 hover:border-copper hover:text-copper"
          >
            {other.toUpperCase()}
          </Link>

          <a
            href={wa}
            target="_blank"
            rel="noopener noreferrer"
            className="tag bg-copper px-4 py-2.5 text-ink-deep transition-colors duration-200 hover:bg-bone"
          >
            WhatsApp
          </a>
        </nav>

        {/* Mobile: native disclosure, zero JS */}
        <details className="group relative ml-auto md:hidden">
          <summary
            className="tag flex cursor-pointer list-none items-center gap-2 px-1 py-2 text-bone [&::-webkit-details-marker]:hidden"
            aria-label={ui.menu[locale]}
          >
            <span className="grid gap-[5px]">
              <span className="block h-px w-5 bg-bone" />
              <span className="block h-px w-5 bg-bone" />
              <span className="block h-px w-5 bg-bone" />
            </span>
          </summary>

          <div className="absolute right-0 top-[calc(100%+0.9rem)] w-[min(17rem,calc(100vw-2.5rem))] border border-ink-hair bg-ink-deep p-2 shadow-2xl">
            {nav.map((item) => (
              <Link
                key={item.href[locale]}
                href={item.href[locale]}
                className="block px-4 py-3 text-base text-bone hover:bg-ink-raised"
              >
                {item.label[locale]}
              </Link>
            ))}
            <Link
              href={otherHref}
              hrefLang={other}
              lang={other}
              className="block border-t border-ink-hair/60 px-4 py-3 text-base text-muted-on-ink hover:bg-ink-raised"
            >
              {other === 'en' ? 'English' : 'Bahasa Indonesia'}
            </Link>
            <a
              href={wa}
              target="_blank"
              rel="noopener noreferrer"
              className="tag mt-1 block bg-copper px-4 py-3.5 text-center text-ink-deep"
            >
              WhatsApp
            </a>
          </div>
        </details>
      </div>
    </header>
  );
}
