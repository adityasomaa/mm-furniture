import { company, locations, type Locale } from '@/lib/site';
import { about } from '@/lib/content';
import { roomCover, totalProducts, rooms } from '@/lib/catalog';
import { Section, Kicker } from '@/components/Shell';
import { Faq } from '@/components/Faq';
import { CatalogImage } from '@/components/CatalogImage';

export function AboutPage({ locale }: { locale: Locale }) {
  const shot = roomCover('ruang-makan') ?? roomCover('ruang-tamu');

  return (
    <>
      <Section tone="dark" className="!pb-0">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_1fr] lg:gap-20">
          <div>
            <Kicker onDark>{company.tagline[locale]}</Kicker>
            <h1 className="mt-6 max-w-[16ch] text-display text-paper">{about.title[locale]}</h1>
          </div>
          <p className="prose-body self-end text-lede text-sand">{about.lede[locale]}</p>
        </div>

        <div className="relative mt-16 aspect-[16/7] w-full overflow-hidden rounded-2xl bg-shell">
          {shot && (
            <CatalogImage
              shot={shot}
              alt={
                locale === 'id'
                  ? 'Meja makan kayu jati hasil pengerjaan workshop MM Furniture di Denpasar, Bali'
                  : 'A teak dining table built in the MM Furniture workshop in Denpasar, Bali'
              }
              sizes="100vw"
              priority
              className="scale-90 object-contain"
            />
          )}
        </div>
      </Section>

      <Section tone="paper">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,24rem)_1fr] lg:gap-20">
          <div>
            <Kicker>{about.bodyTitle[locale]}</Kicker>
          </div>

          <dl className="grid gap-x-12 gap-y-8 sm:grid-cols-2">
            {about.values[locale].map((v, i) => (
              <div key={v.k} className="reveal border-t border-linen pt-5">
                <span className="tag text-brand">{String(i + 1).padStart(2, '0')}</span>
                <dt className="mt-2 text-head text-espresso">{v.k}</dt>
                <dd className="mt-2 text-[0.97rem] leading-relaxed text-clay">{v.v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </Section>

      {/* Facts, stated only where they are verifiable. No invented years,
          headcounts, or project totals: see PRODUCT.md > [UNVERIFIED]. */}
      <Section tone="shell">
        <dl className="grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              k: locale === 'id' ? 'Produk di katalog' : 'Pieces in the catalogue',
              v: String(totalProducts()),
              d: locale === 'id' ? 'Lengkap dengan bahan dan ukurannya' : 'Each with its material and size',
            },
            {
              k: locale === 'id' ? 'Ruangan' : 'Rooms',
              v: String(rooms.length),
              d: locale === 'id' ? 'Ruang tamu sampai outdoor' : 'Living room through outdoor',
            },
            {
              k: locale === 'id' ? 'Lokasi' : 'Locations',
              v: '2',
              d: locale === 'id' ? 'Showroom Kuta, workshop Denpasar' : 'Kuta showroom, Denpasar workshop',
            },
            {
              k: locale === 'id' ? 'Bahasa' : 'Languages',
              v: '2',
              d: locale === 'id' ? 'Indonesia dan Inggris' : 'Indonesian and English',
            },
          ].map((f) => (
            <div key={f.k} className="border-t border-brand/30 pt-5">
              <dt className="tag text-clay">{f.k}</dt>
              <dd className="mt-3 text-5xl text-espresso">{f.v}</dd>
              <p className="mt-2 text-sm text-clay">{f.d}</p>
            </div>
          ))}
        </dl>
      </Section>

      <Section tone="paper">
        <Faq locale={locale} />
      </Section>

      <Section tone="dark">
        <div className="grid gap-3 sm:grid-cols-2">
          {locations.map((loc) => (
            <a
              key={loc.id}
              href={loc.maps}
              target="_blank"
              rel="noopener noreferrer"
              className="group rounded-xl border border-linen p-8 transition-colors duration-300 hover:border-brand"
            >
              <span className="tag text-brand">{loc.role[locale]}</span>
              <address className="mt-4 text-head not-italic text-paper">{loc.street}</address>
              <p className="mt-2 text-[0.97rem] text-sand">
                {loc.locality}, {loc.region}
              </p>
            </a>
          ))}
        </div>
      </Section>
    </>
  );
}
