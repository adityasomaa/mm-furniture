import { company, locations, type Locale } from '@/lib/site';
import { about } from '@/lib/content';
import { coverFor, totalPhotos } from '@/lib/photos';
import { Shell, Section, Kicker } from '@/components/Shell';
import { Faq } from '@/components/Faq';
import { CatalogImage } from '@/components/CatalogImage';

export function AboutPage({ locale }: { locale: Locale }) {
  const shot = coverFor('meja') ?? coverFor('kursi');

  return (
    <Shell locale={locale}>
      <Section tone="ink" className="!pb-0">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_1fr] lg:gap-20">
          <div>
            <Kicker onInk>{company.tagline[locale]}</Kicker>
            <h1 className="stencil mt-6 max-w-[16ch] text-display text-bone">{about.title[locale]}</h1>
          </div>
          <p className="prose-body self-end text-lede text-muted-on-ink">{about.lede[locale]}</p>
        </div>

        <div className="relative mt-16 aspect-[16/7] w-full overflow-hidden">
          {shot && (
            <CatalogImage
              photo={shot}
              alt={
                locale === 'id'
                  ? 'Meja kayu hasil pengerjaan workshop MM Furniture di Denpasar, Bali'
                  : 'A timber table built in the MM Furniture workshop in Denpasar, Bali'
              }
              sizes="100vw"
              priority
              className="object-cover"
            />
          )}
        </div>
      </Section>

      <Section tone="bone">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,24rem)_1fr] lg:gap-20">
          <div>
            <Kicker>{about.bodyTitle[locale]}</Kicker>
          </div>

          <dl className="grid gap-x-12 gap-y-8 sm:grid-cols-2">
            {about.values[locale].map((v, i) => (
              <div key={v.k} className="reveal border-t border-bone-hair pt-5">
                <span className="tag text-copper-deep">{String(i + 1).padStart(2, '0')}</span>
                <dt className="stencil mt-2 text-head text-ink">{v.k}</dt>
                <dd className="mt-2 text-[0.97rem] leading-relaxed text-muted">{v.v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </Section>

      {/* Facts, stated only where they are verifiable. No invented years,
          headcounts, or project totals: see PRODUCT.md > [UNVERIFIED]. */}
      <Section tone="bone-shade">
        <dl className="grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              k: locale === 'id' ? 'Kategori furnitur' : 'Furniture categories',
              v: '7',
              d: locale === 'id' ? 'Sofa sampai almari' : 'Sofas through storage',
            },
            {
              k: locale === 'id' ? 'Foto katalog' : 'Catalogue photographs',
              v: String(totalPhotos()),
              d: locale === 'id' ? 'Barang asli, bukan render' : 'Real pieces, not renders',
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
            <div key={f.k} className="border-t border-copper-deep/30 pt-5">
              <dt className="tag text-muted">{f.k}</dt>
              <dd className="stencil mt-3 text-5xl text-ink">{f.v}</dd>
              <p className="mt-2 text-sm text-muted">{f.d}</p>
            </div>
          ))}
        </dl>
      </Section>

      <Section tone="bone">
        <Faq locale={locale} />
      </Section>

      <Section tone="ink">
        <div className="grid gap-3 sm:grid-cols-2">
          {locations.map((loc) => (
            <a
              key={loc.id}
              href={loc.maps}
              target="_blank"
              rel="noopener noreferrer"
              className="group border border-ink-hair p-8 transition-colors duration-300 hover:border-copper"
            >
              <span className="tag text-copper">{loc.role[locale]}</span>
              <address className="stencil mt-4 text-head not-italic text-bone">{loc.street}</address>
              <p className="mt-2 text-[0.97rem] text-muted-on-ink">
                {loc.locality}, {loc.region}
              </p>
            </a>
          ))}
        </div>
      </Section>
    </Shell>
  );
}
