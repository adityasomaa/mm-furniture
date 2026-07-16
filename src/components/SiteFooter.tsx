import { company, locations, categories, waLink, localePath, type Locale } from '@/lib/site';
import { nav, legalNav, ui, contact as contactCopy } from '@/lib/content';
import { photoCount } from '@/lib/photos';
import { Monogram } from './Wordmark';
import { TransitionLink } from './transition/TransitionLink';

export function SiteFooter({ locale }: { locale: Locale }) {
  const wa = waLink(
    company.phones[0].wa,
    locale === 'id' ? 'Halo MM Furniture, saya ingin bertanya.' : 'Hello MM Furniture, I have a question.',
  );

  return (
    <footer data-tone="dark" className="bg-espresso text-sand">
      <div className="mx-auto max-w-[88rem] px-5 py-16 sm:px-8 sm:py-20">
        <div className="grid gap-12 lg:grid-cols-[1.3fr_0.8fr_0.8fr_1fr] lg:gap-8">
          <div>
            <Monogram className="h-11 w-11 text-sand" />
            <p className="mt-5 text-xl font-normal tracking-[0.02em] text-paper">
              {company.name}
            </p>
            <p className="mt-2 max-w-[32ch] text-sm leading-relaxed text-sand">
              {company.tagline[locale]}
            </p>

            <a
              href={wa}
              target="_blank"
              rel="noopener noreferrer"
              className="tag mt-7 inline-block rounded-full bg-brand px-5 py-3 text-paper transition-colors duration-300 hover:bg-paper hover:text-brand"
            >
              {ui.whatsapp[locale]}
            </a>
          </div>

          <nav aria-label={locale === 'id' ? 'Navigasi footer' : 'Footer navigation'}>
            <p className="tag text-paper/50">{locale === 'id' ? 'Navigasi' : 'Navigate'}</p>
            <ul className="mt-4 space-y-2.5">
              {nav.map((item) => (
                <li key={item.key}>
                  <TransitionLink
                    href={localePath(locale, item.path)}
                    className="text-sm text-sand transition-colors duration-200 hover:text-paper"
                  >
                    {item.label[locale]}
                  </TransitionLink>
                </li>
              ))}
              {legalNav.map((item) => (
                <li key={item.key}>
                  <TransitionLink
                    href={localePath(locale, item.path)}
                    className="text-sm text-sand/80 transition-colors duration-200 hover:text-paper"
                  >
                    {item.label[locale]}
                  </TransitionLink>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label={ui.allCategories[locale]}>
            <p className="tag text-paper/50">{ui.allCategories[locale]}</p>
            <ul className="mt-4 space-y-2.5">
              {categories.map((c) => (
                <li key={c.slug}>
                  <TransitionLink
                    href={localePath(locale, `catalog/${c.slug}`)}
                    className="group flex items-center gap-2 text-sm text-sand transition-colors duration-200 hover:text-paper"
                  >
                    {c[locale]}
                    <span className="text-[0.65rem] tabular-nums text-sand/50">{photoCount(c.slug)}</span>
                  </TransitionLink>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <p className="tag text-paper/50">{contactCopy.visitLabel[locale]}</p>
            <ul className="mt-4 space-y-5">
              {locations.map((loc) => (
                <li key={loc.id}>
                  <p className="text-xs uppercase tracking-[0.12em] text-paper/70">{loc.role[locale]}</p>
                  <address className="mt-1 text-sm not-italic leading-relaxed text-sand">
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
                  <a href={`tel:${p.e164}`} className="text-sand transition-colors duration-200 hover:text-paper">
                    {p.label}
                  </a>
                </li>
              ))}
              <li>
                <a
                  href={`mailto:${company.email}`}
                  className="text-sand transition-colors duration-200 hover:text-paper"
                >
                  {company.email}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-5 border-t border-sand/15 pt-7 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-sand/70">
            © {new Date().getFullYear()} {company.legalName}. Bali, Indonesia.
          </p>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
            <a
              href={company.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="tag text-sand transition-colors duration-200 hover:text-paper"
            >
              Instagram
            </a>
            <a
              href={company.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="tag text-sand transition-colors duration-200 hover:text-paper"
            >
              Facebook
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
