import data from '@/data/photos.json';
import type { CategorySlug } from './site';

export type Photo = {
  /** Filename stem in /public/catalog, without the `-<width>.<ext>` suffix. */
  slug: string;
  /** Intrinsic size of the largest derivative, used for the aspect ratio. */
  w: number;
  h: number;
  /** Inline 24px WebP data URI used as the blur placeholder. */
  blur: string;
  /** Widths present on disk for this photo, ascending. Drives the srcset. */
  widths: number[];
};

const photos = data as Record<string, Photo[]>;

export const photosFor = (slug: CategorySlug | string): Photo[] => photos[slug] ?? [];

export const photoCount = (slug: CategorySlug | string): number => photosFor(slug).length;

export const totalPhotos = (): number =>
  Object.values(photos).reduce((sum, list) => sum + list.length, 0);

/** First photo of a category, used as its cover on the catalogue index. */
export const coverFor = (slug: CategorySlug | string): Photo | undefined => photosFor(slug)[0];

/**
 * Path to a real derivative on disk.
 *
 * Every file in /public/catalog carries a `-<width>` suffix. Building a path by hand as
 * `/catalog/${slug}.webp` produces a 404, which is exactly the kind of break that stays
 * invisible until a link preview renders blank, so always route through this.
 * `preferred` snaps to the closest width that was actually generated.
 */
export const photoUrl = (photo: Photo, preferred = 800, ext: 'webp' | 'avif' = 'webp') => {
  const widths = photo.widths?.length ? photo.widths : [photo.w];
  const best = widths.reduce((a, b) => (Math.abs(b - preferred) < Math.abs(a - preferred) ? b : a));
  return `/catalog/${photo.slug}-${best}.${ext}`;
};
