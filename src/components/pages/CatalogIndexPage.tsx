import type { Locale } from '@/lib/site';
import { catalog, ui } from '@/lib/content';
import { totalPhotos } from '@/lib/photos';
import { Shell, Section, Kicker } from '@/components/Shell';
import { CategoryTiles } from '@/components/CategoryTiles';

export function CatalogIndexPage({ locale }: { locale: Locale }) {
  return (
    <Shell locale={locale}>
      <Section tone="ink">
        <div className="grid gap-8 lg:grid-cols-[1fr_1fr] lg:items-end lg:gap-20">
          <div>
            <Kicker onInk>
              {totalPhotos()} {ui.photoCount[locale]}
            </Kicker>
            <h1 className="stencil mt-6 text-display text-bone">{catalog.title[locale]}</h1>
          </div>
          <p className="prose-body text-lede text-muted-on-ink">{catalog.lede[locale]}</p>
        </div>
      </Section>

      <Section tone="bone">
        <CategoryTiles locale={locale} headingLevel="h2" />
      </Section>
    </Shell>
  );
}
