import { localePath, type Locale } from '@/lib/site';
import { rooms, roomCount, roomCover } from '@/lib/catalog';
import { CatalogImage } from './CatalogImage';
import { TransitionLink } from './transition/TransitionLink';

/**
 * Room tiles. Replaces the old CategoryTiles, which described seven invented
 * type-buckets over anonymous photos.
 *
 * Column spans over a 6-column grid, tuned to the fact that there are exactly six rooms:
 * 3+3 / 2+2+2 leaves one row of halves and one of thirds, and both sum to 6 with no dead
 * cells. If a seventh room ever appears, this array is the thing to revisit.
 */
const SPANS = [3, 3, 2, 2, 2] as const;

export function RoomTiles({
  locale,
  headingLevel = 'h3',
}: {
  locale: Locale;
  headingLevel?: 'h2' | 'h3';
}) {
  const Heading = headingLevel;
  const t = locale === 'id' ? 'produk' : 'products';

  // Vanity holds 2 towel racks. It is the owner's own category and stays in the data,
  // but a 2-piece room next to a 96-piece one would unbalance the front grid, so the
  // tiles show the five substantial rooms and the catalogue index lists all six.
  const shown = rooms.filter((r) => roomCount(r.slug) >= 5);

  return (
    <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-6">
      {shown.map((r, i) => {
        const cover = roomCover(r.slug);
        const half = (SPANS[i] ?? 2) === 3;
        return (
          <li key={r.slug} className={half ? 'md:col-span-3' : 'md:col-span-2'}>
            <TransitionLink
              href={localePath(locale, `catalog/${r.slug}`)}
              className="group flex h-full flex-col overflow-hidden rounded-xl border border-linen bg-shell transition-all duration-500 hover:border-clay/40 hover:shadow-[0_22px_50px_-26px_rgba(92,58,49,0.45)]"
            >
              <div className={`relative overflow-hidden bg-white ${half ? 'aspect-[16/10]' : 'aspect-[4/3]'}`}>
                {cover && (
                  <CatalogImage
                    shot={cover}
                    alt=""
                    sizes={half ? '(max-width: 768px) 100vw, 50vw' : '(max-width: 768px) 100vw, 33vw'}
                    priority={i < 2}
                    className="object-contain p-5 transition-transform duration-700 ease-[cubic-bezier(0.165,0.84,0.44,1)] group-hover:scale-[1.05] sm:p-7"
                  />
                )}
              </div>

              <div className="flex items-baseline justify-between gap-3 border-t border-linen/70 px-5 py-4">
                <Heading className={`text-brand ${half ? 'text-xl' : 'text-base sm:text-lg'}`}>
                  {r.label[locale]}
                </Heading>
                <span className="tag shrink-0 text-clay transition-colors duration-300 group-hover:text-brand">
                  {roomCount(r.slug)} {t}
                </span>
              </div>
            </TransitionLink>
          </li>
        );
      })}
    </ul>
  );
}
