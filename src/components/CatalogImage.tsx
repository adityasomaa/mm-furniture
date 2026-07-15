import type { Photo } from '@/lib/photos';

/**
 * Serves the build-time derivative ladder directly.
 *
 * Deliberately not next/image: every photo is static and known at build time, so a
 * runtime optimizer would spend a Vercel transformation to recompute a result we
 * already have on disk. This ships plain <picture> with AVIF first, WebP fallback, and
 * a real srcset, which the browser resolves against `sizes` without any JavaScript.
 *
 * `showBlur` is off by default. The plates carry alpha now (the studio backdrop is keyed
 * out at build time), so a blur placeholder painted behind one would stay visible
 * through every transparent region instead of being covered on decode: you would see a
 * smeared ghost around the furniture forever. The intrinsic width/height still reserve
 * the space, so nothing shifts. Only pass `showBlur` for an image known to be opaque.
 */
export function CatalogImage({
  photo,
  alt,
  sizes,
  priority = false,
  className = '',
  fill = true,
  showBlur = false,
}: {
  photo: Photo;
  alt: string;
  sizes: string;
  priority?: boolean;
  className?: string;
  fill?: boolean;
  showBlur?: boolean;
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
        style={
          showBlur
            ? {
                backgroundImage: `url(${photo.blur})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }
            : undefined
        }
      />
    </picture>
  );
}
