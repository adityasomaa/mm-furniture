import { localePath, type Locale } from '@/lib/site';
import { catalog, ui } from '@/lib/content';
import { rooms, roomCount, roomCover, totalProducts, materialTally } from '@/lib/catalog';
import { Section, Kicker } from '@/components/Shell';
import { TransitionLink } from '@/components/transition/TransitionLink';
import { CatalogImage } from '@/components/CatalogImage';

/**
 * Catalogue index: browse by room.
 *
 * Spatial rather than by furniture type, which is the owner's own Kategori column and
 * the shape Warisan uses. A buyer furnishing a villa thinks "the dining room", not
 * "chairs"; the type taxonomy still exists inside each room via the product names.
 *
 * Six rooms, so the 3+3 grid tiles cleanly with no dead cells.
 */
export function CatalogIndexPage({ locale }: { locale: Locale }) {
  const materials = materialTally(locale).slice(0, 6);

  return (
    <>
      <Section tone="dark" className="!pb-14 !pt-[calc(76px+3.5rem)]">
        <div className="grid gap-8 lg:grid-cols-[1fr_1fr] lg:items-end lg:gap-20">
          <div>
            <Kicker onDark>
              {totalProducts()} {ui.productCount[locale]}
            </Kicker>
            <h1 className="mt-6 text-display text-paper">{catalog.title[locale]}</h1>
          </div>
          <p className="prose-body text-lede text-sand">{catalog.lede[locale]}</p>
        </div>
      </Section>

      <Section tone="paper">
        <Kicker>{catalog.roomsKicker[locale]}</Kicker>
        <h2 className="mt-5 max-w-[20ch] text-title text-brand">{catalog.roomsTitle[locale]}</h2>

        <ul className="mt-10 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {rooms.map((r, i) => {
            const cover = roomCover(r.slug);
            return (
              <li key={r.slug}>
                <TransitionLink
                  href={localePath(locale, `catalog/${r.slug}`)}
                  className="group flex h-full flex-col overflow-hidden rounded-xl border border-linen bg-shell transition-all duration-500 hover:border-clay/40 hover:shadow-[0_22px_50px_-26px_rgba(92,58,49,0.45)]"
                >
                  <div className="relative aspect-[4/3] overflow-hidden bg-white">
                    {cover && (
                      <CatalogImage
                        shot={cover}
                        alt=""
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        priority={i < 3}
                        className="object-contain p-6 transition-transform duration-700 ease-[cubic-bezier(0.165,0.84,0.44,1)] group-hover:scale-[1.05]"
                      />
                    )}
                  </div>

                  <div className="flex flex-1 flex-col border-t border-linen/70 px-5 py-4">
                    <div className="flex items-baseline justify-between gap-3">
                      <h3 className="text-xl text-brand">{r.label[locale]}</h3>
                      <span className="tag shrink-0 text-clay transition-colors duration-300 group-hover:text-brand">
                        {roomCount(r.slug)} {ui.productCount[locale]}
                      </span>
                    </div>
                    <p className="mt-1.5 text-sm leading-relaxed text-clay">{r.blurb[locale]}</p>
                  </div>
                </TransitionLink>
              </li>
            );
          })}
        </ul>
      </Section>

      {/* Materials, counted rather than claimed. Both competitors lead on a materials
          story; this one is arithmetic over the owner's own spreadsheet, so it cannot
          drift into marketing. */}
      <Section tone="shell">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,24rem)_1fr] lg:gap-20">
          <div>
            <Kicker>{catalog.materialsKicker[locale]}</Kicker>
            <h2 className="mt-5 text-head text-brand">{catalog.materialsTitle[locale]}</h2>
            <p className="prose-body mt-3 text-[0.95rem] leading-relaxed text-clay">
              {catalog.materialsBody[locale]}
            </p>
          </div>

          <dl className="grid gap-x-10 gap-y-6 sm:grid-cols-2">
            {materials.map((m) => (
              <div key={m.label} className="border-t border-linen pt-4">
                <dt className="text-head text-brand">{m.label}</dt>
                <dd className="mt-1 text-sm text-clay">
                  {m.count} {catalog.materialUnit[locale]}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </Section>
    </>
  );
}
