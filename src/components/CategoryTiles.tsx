import { categories, localePath, type Locale } from '@/lib/site';
import { ui } from '@/lib/content';
import { coverFor, photoCount } from '@/lib/photos';
import { CatalogImage } from './CatalogImage';
import { TransitionLink } from './transition/TransitionLink';

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

export function CategoryTiles({
  locale,
  headingLevel = 'h3',
}: {
  locale: Locale;
  headingLevel?: 'h2' | 'h3';
}) {
  const Heading = headingLevel;

  return (
    <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-6">
      {categories.map((c, i) => {
        const cover = coverFor(c.slug);
        const half = SPANS[i] === 3;
        return (
          <li key={c.slug} className={half ? 'md:col-span-3' : 'md:col-span-2'}>
            <TransitionLink
              href={localePath(locale, `catalog/${c.slug}`)}
              className="group block h-full overflow-hidden rounded-xl border border-linen bg-shell transition-all duration-500 hover:border-clay/40 hover:shadow-[0_22px_50px_-26px_rgba(92,58,49,0.45)]"
            >
              {/* The plates now carry alpha, so the piece stands on the tile's own warm
                  tone rather than inside a white box. A soft radial gives it a ground. */}
              <div
                className={`relative overflow-hidden ${half ? 'aspect-[16/10]' : 'aspect-[4/3]'}`}
                style={{
                  backgroundImage:
                    'radial-gradient(125% 95% at 50% 112%, oklch(0.86 0.018 35) 0%, transparent 60%)',
                }}
              >
                {cover && (
                  <CatalogImage
                    photo={cover}
                    alt=""
                    sizes={half ? '(max-width: 768px) 100vw, 50vw' : '(max-width: 768px) 100vw, 33vw'}
                    priority={i < 2}
                    className="scale-[0.86] object-contain transition-transform duration-700 ease-[cubic-bezier(0.165,0.84,0.44,1)] group-hover:scale-[0.92]"
                  />
                )}
              </div>

              <div className="flex items-baseline justify-between gap-3 border-t border-linen/70 px-5 py-4">
                <Heading className={`text-brand ${half ? 'text-xl' : 'text-base sm:text-lg'}`}>
                  {c[locale]}
                </Heading>
                <span className="tag shrink-0 text-clay transition-colors duration-300 group-hover:text-brand">
                  {photoCount(c.slug)} {ui.photoCount[locale]}
                </span>
              </div>
            </TransitionLink>
          </li>
        );
      })}
    </ul>
  );
}
