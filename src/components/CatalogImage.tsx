import type { Photo } from '@/lib/photos';

/**
 * Serves the build-time derivative ladder directly.
 *
 * Deliberately not next/image: every photo is static and known at build time, so a
 * runtime optimizer would spend a Vercel transformation to recompute a result we
 * already have on disk. This ships plain <picture> with AVIF first, WebP fallback, and
 * a real srcset, which the browser resolves against `sizes` without any JavaScript.
 *
 * The blur placeholder is a CSS background rather than a swapped <img>: the LQIP paints
 * immediately, the real photo is opaque and covers it on decode, and nothing needs to
 * hydrate for that to happen.
 */
export function CatalogImage({
  photo,
  alt,
  sizes,
  priority = false,
  className = '',
  fill = true,
}: {
  photo: Photo;
  alt: string;
  sizes: string;
  priority?: boolean;
  className?: string;
  fill?: boolean;
}) {
  const widths = photo.widths?.length ? photo.widths : [photo.w];
  const srcset = (ext: 'avif' | 'webp') =>
    widths.map((w) => `/catalog/${photo.slug}-${w}.${ext} ${w}w`).join(', ');

  // Mid rung as the <img> src: the fallback for anything that ignores srcset.
  const fallbackWidth = widths[Math.min(1, widths.length - 1)];

  return (
    <picture>
      <source type="image/avif" srcSet={srcset('avif')} sizes={sizes} />
      <source type="image/webp" srcSet={srcset('webp')} sizes={sizes} />
      <img
        src={`/catalog/${photo.slug}-${fallbackWidth}.webp`}
        alt={alt}
        width={photo.w}
        height={photo.h}
        loading={priority ? 'eager' : 'lazy'}
        decoding={priority ? 'sync' : 'async'}
        fetchPriority={priority ? 'high' : 'auto'}
        className={`${fill ? 'absolute inset-0 h-full w-full' : ''} ${className}`}
        style={{
          backgroundImage: `url(${photo.blur})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
    </picture>
  );
}
