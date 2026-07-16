import { company, locations, waLink, localePath, type Locale } from '@/lib/site';
import { home, ui } from '@/lib/content';
import { photosFor, totalPhotos } from '@/lib/photos';
import { Section, Kicker } from '@/components/Shell';
import { Faq } from '@/components/Faq';
import { Monogram } from '@/components/Wordmark';
import { CategoryTiles } from '@/components/CategoryTiles';
import { HeroStage } from '@/components/HeroStage';
import { TransitionLink } from '@/components/transition/TransitionLink';
import { EnquireButton } from '@/components/EnquireButton';
import { Marquee } from '@/components/Marquee';

export function HomePage({ locale }: { locale: Locale }) {
  // One decisive piece per category, so the stage shows range rather than five sofas.
  //
  // These indices are not arbitrary. The backdrop key (scripts/lib-cutout.mjs) cannot
  // reach backdrop that sits in shadow inside a tight gap, so a few plates keep small
  // pale patches where a chair frame or a table apron encloses one. Harmless in a
  // catalogue tile; not harmless on the hero. These were picked by scoring every
  // candidate for leftover near-white and taking the cleanest: the previous table pick
  // measured 12% leftover, this one measures 0.3%.
  const stage = [
    photosFor('sofa')[1],
    photosFor('kursi')[13],
    photosFor('meja')[2],
    photosFor('almari')[3],
    photosFor('bed')[2],
  ].filter(Boolean);

  const wa = waLink(
    company.phones[0].wa,
    locale === 'id'
      ? 'Halo MM Furniture, saya ingin bertanya mengenai produk furnitur Anda.'
      : 'Hello MM Furniture, I would like to ask about your furniture.',
  );

  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section data-tone="light" className="relative bg-paper pt-[76px]">
        <div className="mx-auto grid max-w-[88rem] items-center gap-8 px-5 pb-10 pt-10 sm:px-8 lg:grid-cols-[1.02fr_1fr] lg:gap-12 lg:pb-16 lg:pt-8">
          <div className="order-2 lg:order-1">
            <Kicker>{home.heroKicker[locale]}</Kicker>

            <h1 className="mt-6 max-w-[16ch] text-display text-brand">{home.heroTitle[locale]}</h1>

            <p className="mt-6 max-w-[50ch] text-lede text-clay">{home.heroBody[locale]}</p>

            <div className="mt-9 flex flex-wrap items-center gap-2.5">
              <EnquireButton
                locale={locale}
                className="tag rounded-full bg-brand px-7 py-4 text-paper transition-all duration-300 hover:bg-espresso hover:shadow-[0_14px_34px_-10px_rgba(92,58,49,0.7)]"
              />
              <TransitionLink
                href={localePath(locale, 'catalog')}
                className="tag rounded-full border border-linen px-7 py-4 text-clay transition-all duration-300 hover:border-brand hover:text-brand"
              >
                {ui.viewCatalog[locale]} ({totalPhotos()})
              </TransitionLink>
            </div>
          </div>

          <div className="order-1 h-[22rem] overflow-hidden rounded-2xl sm:h-[28rem] lg:order-2 lg:h-[34rem]">
            <HeroStage photos={stage} locale={locale} />
          </div>
        </div>

        <Marquee locale={locale} />
      </section>

      {/* ── Proof ────────────────────────────────────────────────────────── */}
      <Section tone="shell">
        <Kicker>{home.proofLabel[locale]}</Kicker>
        <dl className="mt-9 grid gap-x-10 gap-y-9 sm:grid-cols-3">
          {home.proof[locale].map((item, i) => (
            <div key={item.k} className="reveal rounded-lg border border-linen/70 bg-paper/60 p-6">
              <span className="tag text-clay/70">{String(i + 1).padStart(2, '0')}</span>
              <dt className="mt-2 text-head text-brand">{item.k}</dt>
              <dd className="mt-2.5 text-[0.95rem] leading-relaxed text-clay">{item.v}</dd>
            </div>
          ))}
        </dl>
      </Section>

      {/* ── Catalogue ────────────────────────────────────────────────────── */}
      <Section tone="paper" id="catalog">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,26rem)_1fr] lg:items-end lg:gap-20">
          <div>
            <Kicker>{home.catalogKicker[locale]}</Kicker>
            <h2 className="mt-5 text-title text-brand">{home.catalogTitle[locale]}</h2>
          </div>
          <p className="prose-body text-lede text-clay">{home.catalogBody[locale]}</p>
        </div>

        <div className="mt-14">
          <CategoryTiles locale={locale} />
        </div>
      </Section>

      {/* ── Interior services ────────────────────────────────────────────── */}
      <Section tone="dark">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-24">
          <div>
            <Kicker onDark>{home.servicesKicker[locale]}</Kicker>
            <h2 className="mt-5 text-title text-paper">{home.servicesTitle[locale]}</h2>
            <p className="prose-body mt-6 text-lede text-sand">{home.servicesBody[locale]}</p>
          </div>

          <ol className="grid gap-0 self-center">
            {home.services[locale].map((s, i) => (
              <li
                key={s.k}
                className="reveal grid grid-cols-[3.5rem_1fr] gap-4 border-t border-sand/20 py-7 last:border-b"
              >
                <span className="text-2xl font-light text-sand/60">{String(i + 1).padStart(2, '0')}</span>
                <div>
                  <h3 className="text-head text-paper">{s.k}</h3>
                  <p className="mt-1.5 text-[0.95rem] leading-relaxed text-sand">{s.v}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </Section>

      {/* ── Two addresses ────────────────────────────────────────────────── */}
      <Section tone="paper">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,26rem)_1fr] lg:items-end lg:gap-20">
          <div>
            <Kicker>{home.workshopKicker[locale]}</Kicker>
            <h2 className="mt-5 text-title text-brand">{home.workshopTitle[locale]}</h2>
          </div>
          <p className="prose-body text-lede text-clay">{home.workshopBody[locale]}</p>
        </div>

        <div className="mt-14 grid gap-3 sm:grid-cols-2">
          {locations.map((loc) => (
            <a
              key={loc.id}
              href={loc.maps}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative overflow-hidden rounded-xl border border-linen bg-shell p-7 transition-all duration-500 hover:border-clay/40 hover:shadow-[0_20px_50px_-24px_rgba(92,58,49,0.4)] sm:p-9"
            >
              <Monogram className="absolute -right-8 -top-8 h-40 w-40 text-brand opacity-[0.05] transition-opacity duration-500 group-hover:opacity-[0.1]" />
              <span className="tag text-clay">{loc.role[locale]}</span>
              <address className="mt-4 text-head not-italic leading-tight text-brand">{loc.street}</address>
              <p className="mt-2 text-[0.95rem] text-clay">
                {loc.locality}, {loc.region}, {loc.countryName}
              </p>
              <span className="tag mt-7 inline-flex items-center gap-2 text-bark transition-colors duration-200 group-hover:text-brand">
                {ui.openInMaps[locale]}
                <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1">
                  →
                </span>
              </span>
            </a>
          ))}
        </div>
      </Section>

      {/* ── FAQ ──────────────────────────────────────────────────────────── */}
      <Section tone="shell">
        <Faq locale={locale} />
      </Section>

      {/* ── Closing CTA ──────────────────────────────────────────────────── */}
      <Section tone="dark">
        <div className="grid gap-10 lg:grid-cols-[1.3fr_1fr] lg:items-center lg:gap-20">
          <div>
            <h2 className="max-w-[18ch] text-title text-paper">{home.ctaTitle[locale]}</h2>
            <p className="prose-body mt-5 text-lede text-sand">{home.ctaBody[locale]}</p>
          </div>

          <div className="flex flex-col gap-2.5">
            {company.phones.map((p, i) => (
              <a
                key={p.e164}
                href={waLink(
                  p.wa,
                  locale === 'id'
                    ? 'Halo MM Furniture, saya ingin bertanya mengenai produk furnitur Anda.'
                    : 'Hello MM Furniture, I would like to ask about your furniture.',
                )}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center justify-between gap-4 rounded-full px-6 py-5 transition-all duration-300 ${
                  i === 0
                    ? 'bg-brand text-paper hover:bg-paper hover:text-brand'
                    : 'border border-sand/25 text-paper hover:border-sand'
                }`}
              >
                <span className="tag">WhatsApp</span>
                <span className="text-lg">{p.label}</span>
              </a>
            ))}
            <a
              href={`mailto:${company.email}`}
              className="flex items-center justify-between gap-4 rounded-full border border-sand/25 px-6 py-5 text-paper transition-colors duration-300 hover:border-sand"
            >
              <span className="tag">Email</span>
              <span className="text-base sm:text-lg">{company.email}</span>
            </a>
            <p className="mt-2 text-center text-xs text-sand/70">
              <a href={wa} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4">
                {ui.whatsapp[locale]}
              </a>
            </p>
          </div>
        </div>
      </Section>
    </>
  );
}
