import Link from 'next/link';
import { company, locations, waLink, localePath, type Locale } from '@/lib/site';
import { home, ui } from '@/lib/content';
import { coverFor, totalPhotos } from '@/lib/photos';
import { Shell, Section, Kicker } from '@/components/Shell';
import { Faq } from '@/components/Faq';
import { Monogram } from '@/components/Wordmark';
import { CatalogImage } from '@/components/CatalogImage';
import { CategoryTiles } from '@/components/CategoryTiles';

export function HomePage({ locale }: { locale: Locale }) {
  const hero = coverFor('sofa') ?? coverFor('kursi');
  const wa = waLink(
    company.phones[0].wa,
    locale === 'id'
      ? 'Halo MM Furniture, saya mau tanya soal furnitur.'
      : 'Hello MM Furniture, I would like to ask about your furniture.',
  );

  return (
    <Shell locale={locale}>
      {/* ── Hero ─────────────────────────────────────────────────────────────
          Asymmetric split, not a centred stack. Petrol carries the type side;
          one decisive photograph carries the other. */}
      <section className="relative bg-ink">
        <div className="mx-auto grid max-w-[88rem] items-stretch gap-0 lg:grid-cols-[1.05fr_1fr]">
          <div className="flex flex-col justify-center px-5 py-16 sm:px-8 sm:py-20 lg:py-24">
            <Kicker onInk>{home.heroKicker[locale]}</Kicker>

            <h1 className="stencil mt-6 max-w-[17ch] text-display text-bone">
              {home.heroTitle[locale]}
            </h1>

            <p className="prose-body mt-6 max-w-[52ch] text-lede text-muted-on-ink">
              {home.heroBody[locale]}
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-3">
              <a
                href={wa}
                target="_blank"
                rel="noopener noreferrer"
                className="tag bg-copper px-7 py-4 text-ink-deep transition-colors duration-200 hover:bg-bone"
              >
                {ui.whatsapp[locale]}
              </a>
              <Link
                href={localePath(locale, 'catalog')}
                className="tag border border-ink-hair px-7 py-4 text-bone transition-colors duration-200 hover:border-copper hover:text-copper"
              >
                {ui.viewCatalog[locale]} ({totalPhotos()})
              </Link>
            </div>
          </div>

          <div className="relative min-h-[22rem] lg:min-h-[38rem]">
            {hero && (
              <CatalogImage
                photo={hero}
                alt={home.heroPhotoAlt[locale]}
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
                className="object-cover"
              />
            )}
            {/* Blend the seam only. A half-width fade reads as a blown highlight
                against these white studio backdrops, so it stops at 20%. */}
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-[linear-gradient(90deg,var(--color-ink)_0%,transparent_20%)]"
            />
          </div>
        </div>
      </section>

      {/* ── Proof strip ─────────────────────────────────────────────────────
          Three checkable facts. Not a hero-metric template: no invented
          numbers, no gradient accents, no icon tiles. */}
      <Section tone="bone-shade">
        <Kicker>{home.proofLabel[locale]}</Kicker>
        <dl className="mt-9 grid gap-x-10 gap-y-9 sm:grid-cols-3">
          {home.proof[locale].map((item, i) => (
            <div key={item.k} className="reveal border-t border-copper-deep/30 pt-5">
              <span className="tag text-muted">{String(i + 1).padStart(2, '0')}</span>
              <dt className="stencil mt-2 text-head text-ink">{item.k}</dt>
              <dd className="mt-2.5 text-[0.97rem] leading-relaxed text-muted">{item.v}</dd>
            </div>
          ))}
        </dl>
      </Section>

      {/* ── Catalogue ───────────────────────────────────────────────────── */}
      <Section tone="bone" id="catalog">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,26rem)_1fr] lg:items-end lg:gap-20">
          <div>
            <Kicker>{home.catalogKicker[locale]}</Kicker>
            <h2 className="stencil mt-5 text-title text-ink">{home.catalogTitle[locale]}</h2>
          </div>
          <p className="prose-body text-lede text-muted">{home.catalogBody[locale]}</p>
        </div>

        <div className="mt-14">
          <CategoryTiles locale={locale} />
        </div>
      </Section>

      {/* ── Interior services ───────────────────────────────────────────── */}
      <Section tone="ink">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-24">
          <div>
            <Kicker onInk>{home.servicesKicker[locale]}</Kicker>
            <h2 className="stencil mt-5 text-title text-bone">{home.servicesTitle[locale]}</h2>
            <p className="prose-body mt-6 text-lede text-muted-on-ink">{home.servicesBody[locale]}</p>
          </div>

          <ol className="grid gap-0 self-center">
            {home.services[locale].map((s, i) => (
              <li
                key={s.k}
                className="reveal grid grid-cols-[3.5rem_1fr] gap-4 border-t border-ink-hair/60 py-7 last:border-b"
              >
                <span className="stencil text-2xl text-copper/70">{String(i + 1).padStart(2, '0')}</span>
                <div>
                  <h3 className="text-head font-semibold text-bone">{s.k}</h3>
                  <p className="mt-1.5 text-[0.97rem] leading-relaxed text-muted-on-ink">{s.v}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </Section>

      {/* ── Two addresses ───────────────────────────────────────────────── */}
      <Section tone="bone">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,26rem)_1fr] lg:items-end lg:gap-20">
          <div>
            <Kicker>{home.workshopKicker[locale]}</Kicker>
            <h2 className="stencil mt-5 text-title text-ink">{home.workshopTitle[locale]}</h2>
          </div>
          <p className="prose-body text-lede text-muted">{home.workshopBody[locale]}</p>
        </div>

        <div className="mt-14 grid gap-3 sm:grid-cols-2">
          {locations.map((loc) => (
            <a
              key={loc.id}
              href={loc.maps}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative overflow-hidden border border-bone-hair bg-bone-shade p-7 transition-colors duration-300 hover:border-copper-deep/50 sm:p-9"
            >
              <Monogram className="absolute -right-8 -top-8 h-40 w-40 text-copper opacity-[0.06] transition-opacity duration-500 group-hover:opacity-[0.11]" />
              <span className="tag text-copper-deep">{loc.role[locale]}</span>
              <address className="stencil mt-4 text-head not-italic leading-tight text-ink">
                {loc.street}
              </address>
              <p className="mt-2 text-[0.97rem] text-muted">
                {loc.locality}, {loc.region}, {loc.countryName}
              </p>
              <span className="tag mt-7 inline-flex items-center gap-2 text-ink transition-colors duration-200 group-hover:text-copper-deep">
                {ui.openInMaps[locale]}
                <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1">
                  →
                </span>
              </span>
            </a>
          ))}
        </div>
      </Section>

      {/* ── FAQ ─────────────────────────────────────────────────────────── */}
      <Section tone="bone-shade">
        <Faq locale={locale} />
      </Section>

      {/* ── Closing CTA ─────────────────────────────────────────────────── */}
      <Section tone="ink">
        <div className="grid gap-10 lg:grid-cols-[1.3fr_1fr] lg:items-center lg:gap-20">
          <div>
            <h2 className="stencil max-w-[18ch] text-title text-bone">{home.ctaTitle[locale]}</h2>
            <p className="prose-body mt-5 text-lede text-muted-on-ink">{home.ctaBody[locale]}</p>
          </div>

          <div className="flex flex-col gap-2.5">
            {company.phones.map((p, i) => (
              <a
                key={p.e164}
                href={waLink(
                  p.wa,
                  locale === 'id'
                    ? 'Halo MM Furniture, saya mau tanya soal furnitur.'
                    : 'Hello MM Furniture, I would like to ask about your furniture.',
                )}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center justify-between gap-4 px-6 py-5 transition-colors duration-200 ${
                  i === 0
                    ? 'bg-copper text-ink-deep hover:bg-bone'
                    : 'border border-ink-hair text-bone hover:border-copper hover:text-copper'
                }`}
              >
                <span className="tag">WhatsApp</span>
                <span className="stencil text-lg">{p.label}</span>
              </a>
            ))}
            <a
              href={`mailto:${company.email}`}
              className="flex items-center justify-between gap-4 border border-ink-hair px-6 py-5 text-bone transition-colors duration-200 hover:border-copper hover:text-copper"
            >
              <span className="tag">Email</span>
              <span className="text-lg">{company.email}</span>
            </a>
          </div>
        </div>
      </Section>
    </Shell>
  );
}
