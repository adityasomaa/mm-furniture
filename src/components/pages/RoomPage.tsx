import { notFound } from 'next/navigation';
import { localePath, type Locale } from '@/lib/site';
import { catalog, ui } from '@/lib/content';
import { roomBySlug, productsInRoom, rooms, formatDim } from '@/lib/catalog';
import { Section, Kicker } from '@/components/Shell';
import { TransitionLink } from '@/components/transition/TransitionLink';
import { CatalogImage } from '@/components/CatalogImage';
import { EnquireButton } from '@/components/EnquireButton';

export function RoomPage({ locale, slug }: { locale: Locale; slug: string }) {
  const room = roomBySlug(slug);
  if (!room) notFound();

  const items = productsInRoom(slug);
  const others = rooms.filter((r) => r.slug !== slug);

  return (
    <>
      <Section tone="dark" className="!pb-14 !pt-[calc(76px+3.5rem)]">
        <nav aria-label="Breadcrumb">
          <ol className="tag flex flex-wrap items-center gap-2 text-sand">
            <li>
              <TransitionLink href={localePath(locale, 'catalog')} className="hover:text-paper">
                {catalog.title[locale]}
              </TransitionLink>
            </li>
            <li aria-hidden="true">/</li>
            <li className="text-paper" aria-current="page">
              {room.label[locale]}
            </li>
          </ol>
        </nav>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_1fr] lg:items-end lg:gap-20">
          <div>
            <Kicker onDark>
              {items.length} {ui.productCount[locale]}
            </Kicker>
            <h1 className="mt-5 text-display text-paper">{room.label[locale]}</h1>
          </div>
          <p className="prose-body text-lede text-sand">{room.blurb[locale]}</p>
        </div>
      </Section>

      <Section tone="paper" className="!pt-12">
        <ul className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
          {items.map((p, i) => (
            <li key={p.slug}>
              <TransitionLink
                href={localePath(locale, `catalog/${p.room}/${p.slug}`)}
                className="group flex h-full flex-col overflow-hidden rounded-xl border border-linen bg-paper transition-all duration-500 hover:border-clay/40 hover:shadow-[0_22px_50px_-26px_rgba(92,58,49,0.45)]"
              >
                <div className="relative aspect-square overflow-hidden bg-white">
                  <CatalogImage
                    shot={p.shots[0]}
                    alt={catalog.photoAlt[locale](p.name)}
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    priority={i < 4}
                    className="object-contain p-4 transition-transform duration-700 ease-[cubic-bezier(0.165,0.84,0.44,1)] group-hover:scale-[1.06]"
                  />
                  {p.shots.length > 1 && (
                    <span className="tag absolute right-2 top-2 rounded-full bg-espresso/70 px-2 py-1 text-[0.55rem] text-paper opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                      {p.shots.length}
                    </span>
                  )}
                </div>

                <div className="flex flex-1 flex-col border-t border-linen/70 px-4 py-3.5">
                  <p className="text-sm leading-snug text-bark transition-colors duration-300 group-hover:text-brand">
                    {p.name}
                  </p>
                  <p className="mt-1 text-xs text-clay">
                    {[p.material, formatDim(p.dim)].filter(Boolean).join(' · ')}
                  </p>
                </div>
              </TransitionLink>
            </li>
          ))}
        </ul>
      </Section>

      <Section tone="shell">
        <div className="flex flex-col items-start justify-between gap-6 rounded-2xl border border-linen bg-paper p-8 sm:flex-row sm:items-center sm:p-10">
          <div>
            <h2 className="text-head text-brand">{catalog.roomCta[locale]}</h2>
            <p className="prose-body mt-2 text-[0.95rem] text-clay">{catalog.roomCtaBody[locale]}</p>
          </div>
          <EnquireButton
            locale={locale}
            className="tag shrink-0 rounded-full bg-brand px-7 py-4 text-paper transition-colors duration-300 hover:bg-espresso"
          />
        </div>

        <div className="mt-12">
          <Kicker>{catalog.otherRooms[locale]}</Kicker>
          <ul className="mt-5 flex flex-wrap gap-2">
            {others.map((r) => (
              <li key={r.slug}>
                <TransitionLink
                  href={localePath(locale, `catalog/${r.slug}`)}
                  className="tag inline-block rounded-full border border-linen bg-paper px-5 py-3 text-clay transition-colors duration-200 hover:border-brand hover:text-brand"
                >
                  {r.label[locale]}
                </TransitionLink>
              </li>
            ))}
          </ul>
        </div>
      </Section>
    </>
  );
}
