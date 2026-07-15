import type { Locale } from '@/lib/site';
import { catalog, ui } from '@/lib/content';
import { totalPhotos } from '@/lib/photos';
import { Section, Kicker } from '@/components/Shell';
import { CategoryTiles } from '@/components/CategoryTiles';

export function CatalogIndexPage({ locale }: { locale: Locale }) {
  return (
    <>
      <Section tone="dark">
        <div className="grid gap-8 lg:grid-cols-[1fr_1fr] lg:items-end lg:gap-20">
          <div>
            <Kicker onDark>
              {totalPhotos()} {ui.photoCount[locale]}
            </Kicker>
            <h1 className="mt-6 text-display text-paper">{catalog.title[locale]}</h1>
          </div>
          <p className="prose-body text-lede text-sand">{catalog.lede[locale]}</p>
        </div>
      </Section>

      <Section tone="paper">
        <CategoryTiles locale={locale} headingLevel="h2" />
      </Section>
    </>
  );
}
