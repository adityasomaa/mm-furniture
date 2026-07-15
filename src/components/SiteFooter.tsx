import Link from 'next/link';
import { company, locations, categories, waLink, localePath, type Locale } from '@/lib/site';
import { nav, ui, contact as contactCopy } from '@/lib/content';
import { Monogram } from './Wordmark';

export function SiteFooter({ locale }: { locale: Locale }) {
  const wa = waLink(
    company.phones[0].wa,
    locale === 'id' ? 'Halo MM Furniture, saya mau tanya.' : 'Hello MM Furniture, I have a question.',
  );

  return (
    <footer className="bg-ink-deep text-muted-on-ink">
      <div className="mx-auto max-w-[88rem] px-5 py-16 sm:px-8 sm:py-20">
        <div className="grid gap-12 md:grid-cols-[1.4fr_1fr_1fr] md:gap-8">
          <div>
            <Monogram className="h-11 w-11 text-copper" />
            <p className="stencil mt-5 text-2xl text-bone">{company.name.toUpperCase()}</p>
            <p className="mt-2 max-w-[34ch] text-sm leading-relaxed">{company.tagline[locale]}</p>

            <a
              href={wa}
              target="_blank"
              rel="noopener noreferrer"
              className="tag mt-7 inline-block bg-copper px-5 py-3 text-ink-deep transition-colors duration-200 hover:bg-bone"
            >
              {ui.whatsapp[locale]}
            </a>
          </div>

          <nav aria-label={ui.allCategories[locale]}>
            <p className="tag text-copper">{ui.allCategories[locale]}</p>
            <ul className="mt-4 space-y-2.5">
              {categories.map((c) => (
                <li key={c.slug}>
                  <Link
                    href={localePath(locale, `catalog/${c.slug}`)}
                    className="text-sm transition-colors duration-200 hover:text-bone"
                  >
                    {c[locale]}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <p className="tag text-copper">{contactCopy.visitLabel[locale]}</p>
            <ul className="mt-4 space-y-5">
              {locations.map((loc) => (
                <li key={loc.id}>
                  <p className="text-xs font-semibold uppercase tracking-[0.1em] text-bone/80">
                    {loc.role[locale]}
                  </p>
                  <address className="mt-1 text-sm not-italic leading-relaxed">
                    {loc.street}
                    <br />
                    {loc.locality}, {loc.region}
                  </address>
                </li>
              ))}
            </ul>

            <ul className="mt-6 space-y-2 text-sm">
              {company.phones.map((p) => (
                <li key={p.e164}>
                  <a href={`tel:${p.e164}`} className="transition-colors duration-200 hover:text-bone">
                    {p.label}
                  </a>
                </li>
              ))}
              <li>
                <a href={`mailto:${company.email}`} className="transition-colors duration-200 hover:text-bone">
                  {company.email}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-5 border-t border-ink-hair/50 pt-7 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs">
            © {new Date().getFullYear()} {company.legalName}. Bali, Indonesia.
          </p>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
            {nav.map((item) => (
              <Link key={item.href[locale]} href={item.href[locale]} className="tag hover:text-bone">
                {item.label[locale]}
              </Link>
            ))}
            <a
              href={company.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="tag hover:text-bone"
            >
              Instagram
            </a>
            <a
              href={company.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="tag hover:text-bone"
            >
              Facebook
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
