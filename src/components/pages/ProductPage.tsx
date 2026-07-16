import { notFound } from 'next/navigation';
import { localePath, type Locale } from '@/lib/site';
import { catalog } from '@/lib/content';
import { productBySlug, productsInRoom, roomBySlug, formatDim } from '@/lib/catalog';
import { Section, Kicker } from '@/components/Shell';
import { TransitionLink } from '@/components/transition/TransitionLink';
import { ProductGallery } from '@/components/ProductGallery';
import { EnquireButton } from '@/components/EnquireButton';
import { CatalogImage } from '@/components/CatalogImage';

export function ProductPage({ locale, slug }: { locale: Locale; slug: string }) {
  const product = productBySlug(slug);
  if (!product) notFound();

  const room = roomBySlug(product.room);
  const related = productsInRoom(product.room)
    .filter((p) => p.slug !== product.slug)
    .slice(0, 4);

  const specs: { k: string; v: string | null }[] = [
    { k: catalog.specMaterial[locale], v: product.material },
    { k: catalog.specDimensions[locale], v: formatDim(product.dim) ?? catalog.specNoDim[locale] },
    { k: catalog.specCode[locale], v: product.id },
  ];

  return (
    <>
      <Section tone="paper" className="!pb-8 !pt-[calc(76px+2.5rem)]">
        <nav aria-label="Breadcrumb">
          <ol className="tag flex flex-wrap items-center gap-2 text-clay">
            <li>
              <TransitionLink href={localePath(locale, 'catalog')} className="hover:text-brand">
                {catalog.title[locale]}
              </TransitionLink>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <TransitionLink href={localePath(locale, `catalog/${product.room}`)} className="hover:text-brand">
                {room?.label[locale]}
              </TransitionLink>
            </li>
            <li aria-hidden="true">/</li>
            <li className="text-brand" aria-current="page">
              {product.name}
            </li>
          </ol>
        </nav>

        <div className="mt-8 grid gap-10 lg:grid-cols-[1.15fr_1fr] lg:gap-16">
          <ProductGallery product={product} locale={locale} />

          <div className="lg:pt-4">
            <Kicker>{room?.label[locale]}</Kicker>
            <h1 className="mt-5 text-title text-brand">{product.name}</h1>

            {product.desc && (
              <p className="prose-body mt-5 text-lede text-clay">{product.desc}</p>
            )}

            <dl className="mt-9 divide-y divide-linen border-y border-linen">
              {specs.map((s) => (
                <div key={s.k} className="grid grid-cols-[8rem_1fr] gap-4 py-4">
                  <dt className="tag pt-1 text-clay">{s.k}</dt>
                  <dd className="text-[0.98rem] leading-relaxed text-bark">
                    {s.v}
                    {s.k === catalog.specDimensions[locale] && product.dim && (
                      <span className="mt-1 block text-xs text-clay">{catalog.specDimNote[locale]}</span>
                    )}
                  </dd>
                </div>
              ))}
            </dl>

            <div className="mt-8 rounded-lg border border-linen bg-shell p-6">
              <p className="tag text-brand">{catalog.customTitle[locale]}</p>
              <p className="mt-2.5 text-[0.93rem] leading-relaxed text-clay">{catalog.customBody[locale]}</p>
            </div>

            <div className="mt-6 flex flex-wrap gap-2.5">
              <EnquireButton
                locale={locale}
                productName={product.name}
                productCode={product.id}
                className="tag rounded-full bg-brand px-7 py-4 text-paper transition-all duration-300 hover:bg-espresso hover:shadow-[0_14px_34px_-10px_rgba(92,58,49,0.7)]"
              />
              <TransitionLink
                href={localePath(locale, `catalog/${product.room}`)}
                className="tag rounded-full border border-linen px-7 py-4 text-clay transition-all duration-300 hover:border-brand hover:text-brand"
              >
                {catalog.backToRoom[locale]}
              </TransitionLink>
            </div>

            {/* Said plainly rather than left as an awkward gap. The owner publishes no
                prices, so the page explains why instead of pretending the question was
                never asked. */}
            <p className="mt-6 text-xs leading-relaxed text-clay/80">{catalog.priceNote[locale]}</p>
          </div>
        </div>
      </Section>

      {related.length > 0 && (
        <Section tone="shell">
          <Kicker>{catalog.related[locale]}</Kicker>
          <ul className="mt-8 grid grid-cols-2 gap-3 lg:grid-cols-4">
            {related.map((p) => (
              <li key={p.slug}>
                <TransitionLink
                  href={localePath(locale, `catalog/${p.room}/${p.slug}`)}
                  className="group block overflow-hidden rounded-xl border border-linen bg-paper transition-all duration-500 hover:border-clay/40 hover:shadow-[0_20px_46px_-26px_rgba(92,58,49,0.45)]"
                >
                  <div className="relative aspect-square overflow-hidden bg-white">
                    <CatalogImage
                      shot={p.shots[0]}
                      alt={catalog.photoAlt[locale](p.name)}
                      sizes="(max-width: 640px) 50vw, 25vw"
                      className="object-contain p-4 transition-transform duration-700 ease-[cubic-bezier(0.165,0.84,0.44,1)] group-hover:scale-[1.05]"
                    />
                  </div>
                  <p className="truncate px-4 py-3.5 text-sm text-bark">{p.name}</p>
                </TransitionLink>
              </li>
            ))}
          </ul>
        </Section>
      )}
    </>
  );
}
