'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type { Locale } from '@/lib/site';
import { catalog, ui } from '@/lib/content';
import type { Product } from '@/lib/catalog';
import { CatalogImage } from './CatalogImage';

/**
 * Product gallery: one large plate plus angle thumbnails.
 *
 * The old catalogue could not have had this. It was a flat list of unnamed photos, so
 * every shot was its own "product"; here the owner's data groups 767 images under 227
 * products, and most pieces carry 3 to 5 angles of the same thing. Showing them together
 * is the whole point of the new data.
 *
 * Single-angle products (18 of 227) render without a thumbnail strip rather than with a
 * strip of one, which would look like something failed to load.
 */
export function ProductGallery({ product, locale }: { product: Product; locale: Locale }) {
  const [active, setActive] = useState(0);
  const [zoomed, setZoomed] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);

  const shots = product.shots;
  const hasAngles = shots.length > 1;

  const step = useCallback(
    (delta: number) => setActive((i) => (i + delta + shots.length) % shots.length),
    [shots.length],
  );

  useEffect(() => {
    if (!zoomed) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') step(1);
      if (e.key === 'ArrowLeft') step(-1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [zoomed, step]);

  const t = {
    zoom: catalog.zoom[locale],
    close: ui.close[locale],
    prev: catalog.prev[locale],
    next: catalog.next[locale],
    angle: catalog.angle[locale],
  };

  const alt = (i: number) =>
    shots.length > 1
      ? catalog.photoAltView[locale](product.name, i + 1)
      : catalog.photoAlt[locale](product.name);

  return (
    <div>
      <button
        type="button"
        onClick={() => {
          setZoomed(true);
          dialogRef.current?.showModal();
        }}
        aria-label={t.zoom}
        className="relative block aspect-square w-full cursor-zoom-in overflow-hidden rounded-2xl border border-linen bg-white"
      >
        <CatalogImage
          key={shots[active].slug}
          shot={shots[active]}
          alt={alt(active)}
          sizes="(max-width: 1024px) 100vw, 55vw"
          priority
          className="object-contain p-6 sm:p-10"
        />
      </button>

      {hasAngles && (
        <ul aria-label={catalog.galleryAngles[locale]} className="mt-3 grid grid-cols-5 gap-2">
          {shots.map((s, i) => (
            <li key={s.slug}>
              <button
                type="button"
                onClick={() => setActive(i)}
                aria-label={`${t.angle} ${i + 1}`}
                aria-current={i === active}
                className={[
                  'relative block aspect-square w-full overflow-hidden rounded-md border bg-white transition-all duration-300',
                  i === active ? 'border-brand' : 'border-linen hover:border-clay/50',
                ].join(' ')}
              >
                <CatalogImage
                  shot={s}
                  alt=""
                  sizes="12vw"
                  className={`object-contain p-1.5 transition-opacity duration-300 ${
                    i === active ? 'opacity-100' : 'opacity-70 hover:opacity-100'
                  }`}
                />
              </button>
            </li>
          ))}
        </ul>
      )}

      <dialog
        ref={dialogRef}
        onClose={() => setZoomed(false)}
        onClick={(e) => {
          if (e.target === dialogRef.current) dialogRef.current?.close();
        }}
        className="m-0 h-full max-h-none w-full max-w-none bg-espresso/[0.97] p-0 backdrop:bg-espresso/85 backdrop:backdrop-blur-md"
      >
        {zoomed && (
          <div className="flex h-full w-full flex-col">
            <div className="flex shrink-0 items-center justify-between gap-4 px-4 py-3 sm:px-6">
              <span className="tag text-sand">
                {product.name} · {active + 1} / {shots.length}
              </span>
              <button
                type="button"
                onClick={() => dialogRef.current?.close()}
                aria-label={t.close}
                className="grid h-10 w-10 place-items-center rounded-full border border-sand/30 text-paper transition-colors hover:border-sand"
              >
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                  <path d="M1 1l10 10M11 1L1 11" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                </svg>
              </button>
            </div>

            {/* The plate sits on white even here, where the surround is near-black.
                Dropping a cutout straight onto espresso is the worst case for this: any
                backdrop the key could not reach is opaque white, so it would glow against
                the dark. A white sheet is also how you would actually inspect a piece. */}
            <div className="relative mx-4 min-h-0 flex-1 overflow-hidden rounded-xl bg-white sm:mx-6">
              <CatalogImage
                key={shots[active].slug}
                shot={shots[active]}
                alt={alt(active)}
                sizes="100vw"
                priority
                className="object-contain p-4 sm:p-8"
              />
            </div>

            {hasAngles && (
              <div className="flex shrink-0 items-center justify-center gap-3 py-4">
                <button
                  type="button"
                  onClick={() => step(-1)}
                  aria-label={t.prev}
                  className="tag rounded-full border border-sand/30 px-5 py-2.5 text-paper transition-colors hover:border-sand"
                >
                  ←
                </button>
                <button
                  type="button"
                  onClick={() => step(1)}
                  aria-label={t.next}
                  className="tag rounded-full border border-sand/30 px-5 py-2.5 text-paper transition-colors hover:border-sand"
                >
                  →
                </button>
              </div>
            )}
          </div>
        )}
      </dialog>
    </div>
  );
}
