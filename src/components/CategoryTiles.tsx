import Link from 'next/link';
import { categories, localePath, type Locale } from '@/lib/site';
import { ui } from '@/lib/content';
import { coverFor, photoCount } from '@/lib/photos';
import { CatalogImage } from './CatalogImage';

/**
 * Column spans over a 6-column grid, tuned to the fact that there are exactly seven
 * categories: 3+3 / 2+2+2 / 3+3 sums to 6/6/6 and tiles with no dead cells.
 *
 * The obvious alternatives both leave a hole. Seven equal tiles in a 4-column grid
 * leaves one; a 2x2 feature plus six singles leaves two, which is what shipped first
 * and read as a broken layout rather than an intentional one.
 *
 * If an eighth category is ever added, this array is the thing to revisit.
 */
const SPANS = [3, 3, 2, 2, 2, 3, 3] as const;

export function CategoryTiles({ locale, headingLevel = 'h3' }: { locale: Locale; headingLevel?: 'h2' | 'h3' }) {
  const Heading = headingLevel;

  return (
    <ul className="grid grid-cols-2 gap-2 sm:gap-3 md:grid-cols-6">
      {categories.map((c, i) => {
        const cover = coverFor(c.slug);
        const span = SPANS[i] ?? 2;
        const half = span === 3;
        return (
          <li key={c.slug} className={half ? 'md:col-span-3' : 'md:col-span-2'}>
            {/* Plate above, solid caption bar below. The label is not floated over the
                photograph on a dark scrim: these are white studio plates, and a scrim
                across one reads as a smudge rather than as a deliberate treatment. */}
            <Link href={localePath(locale, `catalog/${c.slug}`)} className="group block bg-ink">
              <div className={`relative overflow-hidden bg-bone ${half ? 'aspect-[16/10]' : 'aspect-[4/3]'}`}>
                {cover && (
                  <CatalogImage
                    photo={cover}
                    alt=""
                    sizes={half ? '(max-width: 768px) 50vw, 50vw' : '(max-width: 768px) 50vw, 33vw'}
                    priority={i < 2}
                    className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.165,0.84,0.44,1)] group-hover:scale-[1.04]"
                  />
                )}
              </div>

              <div className="flex items-baseline justify-between gap-3 px-4 py-3.5">
                <Heading className={`stencil text-bone ${half ? 'text-xl sm:text-2xl' : 'text-base sm:text-lg'}`}>
                  {c[locale]}
                </Heading>
                <span className="tag shrink-0 text-copper transition-colors duration-200 group-hover:text-bone">
                  {photoCount(c.slug)} {ui.photoCount[locale]}
                </span>
              </div>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
