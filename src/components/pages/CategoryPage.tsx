import Link from 'next/link';
import { notFound } from 'next/navigation';
import { categories, categoryBySlug, company, waLink, localePath, type Locale } from '@/lib/site';
import { catalog, ui } from '@/lib/content';
import { photosFor } from '@/lib/photos';
import { Shell, Section, Kicker } from '@/components/Shell';
import { PhotoGrid } from '@/components/PhotoGrid';

export function CategoryPage({ locale, slug }: { locale: Locale; slug: string }) {
  const cat = categoryBySlug(slug);
  if (!cat) notFound();

  const photos = photosFor(slug);
  const label = cat[locale];

  // Each photo carries its index into the WhatsApp message, so a buyer can say
  // "Kursi 014" and the workshop knows exactly which piece they mean.
  const waFor = (index: number) =>
    waLink(
      company.phones[0].wa,
      locale === 'id'
        ? `Halo MM Furniture, saya tertarik dengan ${label} nomor ${String(index + 1).padStart(3, '0')} di katalog. Boleh minta info ukuran dan harganya?`
        : `Hello MM Furniture, I am interested in ${label} number ${String(index + 1).padStart(3, '0')} in your catalogue. Could you send sizes and a price?`,
    );

  return (
    <Shell locale={locale}>
      <Section tone="ink" className="!py-14 sm:!py-20">
        <nav aria-label="Breadcrumb">
          <ol className="tag flex flex-wrap items-center gap-2 text-muted-on-ink">
            <li>
              <Link href={localePath(locale)} className="hover:text-copper">
                {ui.home[locale]}
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <Link href={localePath(locale, 'catalog')} className="hover:text-copper">
                {catalog.title[locale]}
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li className="text-copper" aria-current="page">
              {label}
            </li>
          </ol>
        </nav>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_1fr] lg:items-end lg:gap-20">
          <div>
            <Kicker onInk>
              {photos.length} {ui.photoCount[locale]}
            </Kicker>
            <h1 className="stencil mt-5 text-display text-bone">{label}</h1>
          </div>
          <p className="prose-body text-lede text-muted-on-ink">{catalog.categoryLede[locale]}</p>
        </div>
      </Section>

      <Section tone="bone" className="!pt-10">
        {photos.length > 0 ? (
          <PhotoGrid photos={photos} label={label} locale={locale} waNumber={company.phones[0].wa} />
        ) : (
          <p className="prose-body text-lede text-muted">{catalog.emptyCategory[locale]}</p>
        )}
      </Section>

      {/* Sibling categories: keeps crawl depth flat and gives a dead end an exit. */}
      <Section tone="bone-shade">
        <Kicker>{ui.allCategories[locale]}</Kicker>
        <ul className="mt-6 flex flex-wrap gap-2">
          {categories
            .filter((c) => c.slug !== slug)
            .map((c) => (
              <li key={c.slug}>
                <Link
                  href={localePath(locale, `catalog/${c.slug}`)}
                  className="tag inline-block border border-bone-hair bg-bone px-5 py-3 text-ink transition-colors duration-200 hover:border-copper-deep hover:text-copper-deep"
                >
                  {c[locale]}
                </Link>
              </li>
            ))}
        </ul>
      </Section>

      <Section tone="ink">
        <div className="grid gap-8 lg:grid-cols-[1.3fr_1fr] lg:items-center lg:gap-16">
          <h2 className="stencil max-w-[20ch] text-title text-bone">
            {locale === 'id'
              ? `Ada ${label.toLowerCase()} yang cocok? Kirim nomornya.`
              : `Found a ${label.toLowerCase().replace(/s$/, '')} that fits? Send us the number.`}
          </h2>
          <a
            href={waFor(0)}
            target="_blank"
            rel="noopener noreferrer"
            className="tag inline-flex items-center justify-center bg-copper px-8 py-5 text-ink-deep transition-colors duration-200 hover:bg-bone"
          >
            {ui.whatsapp[locale]}
          </a>
        </div>
      </Section>
    </Shell>
  );
}
