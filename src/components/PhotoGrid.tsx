'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type { Photo } from '@/lib/photos';
import { waLink, type Locale } from '@/lib/site';
import { CatalogImage } from './CatalogImage';

/**
 * Feature-tile rhythm.
 *
 * 240 of the 241 catalogue photographs are exactly 1:1 (they are studio plates), so the
 * grid is square and nothing is ever cropped. An earlier version mixed 16/10 and 4/5
 * spans into this and tore holes in the layout: the tiles disagreed with the source
 * material, and the source material won.
 *
 * Rhythm instead comes from promoting every 9th plate to 2x2. A 2x2 block of squares is
 * itself square, so the ratio still holds and `grid-auto-flow: dense` backfills the gap
 * left behind. Period 9 against 2/3/4 columns never settles into a visible repeat.
 * Deterministic, so server and client markup agree.
 */
const isFeature = (i: number) => i % 9 === 0;

/**
 * `waNumber` is passed as a string rather than a ready-made href builder: functions are
 * not serialisable across the server/client boundary, so the link is composed here.
 */
export function PhotoGrid({
  photos,
  label,
  locale,
  waNumber,
}: {
  photos: Photo[];
  label: string;
  locale: Locale;
  waNumber: string;
}) {
  const waHref = (index: number) =>
    waLink(
      waNumber,
      locale === 'id'
        ? `Halo MM Furniture, saya tertarik dengan ${label} nomor ${String(index + 1).padStart(3, '0')} di katalog. Boleh minta info ukuran dan harganya?`
        : `Hello MM Furniture, I am interested in ${label} number ${String(index + 1).padStart(3, '0')} in your catalogue. Could you send sizes and a price?`,
    );

  const [open, setOpen] = useState<number | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);

  const show = useCallback((i: number) => {
    setOpen(i);
    dialogRef.current?.showModal();
  }, []);

  const hide = useCallback(() => {
    dialogRef.current?.close();
  }, []);

  const step = useCallback(
    (delta: number) => {
      setOpen((cur) => (cur === null ? null : (cur + delta + photos.length) % photos.length));
    },
    [photos.length],
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (open === null) return;
      if (e.key === 'ArrowRight') step(1);
      if (e.key === 'ArrowLeft') step(-1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, step]);

  const active = open === null ? null : photos[open];

  return (
    <>
      <ul className="grid grid-flow-dense grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3 lg:grid-cols-4">
        {photos.map((p, i) => {
          const feature = isFeature(i);
          return (
            <li
              key={p.slug}
              className={`group relative aspect-square overflow-hidden border border-bone-hair/70 bg-bone-shade ${
                feature ? 'col-span-2 row-span-2' : ''
              }`}
            >
              <button
                type="button"
                onClick={() => show(i)}
                className="absolute inset-0 h-full w-full cursor-zoom-in"
                aria-label={`${label} ${i + 1}`}
              >
                <CatalogImage
                  photo={p}
                  alt={`${label} ${locale === 'id' ? 'buatan' : 'built by'} MM Furniture Globalindo, Bali (${i + 1})`}
                  sizes={
                    feature
                      ? '(max-width: 640px) 100vw, (max-width: 1024px) 66vw, 50vw'
                      : '(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw'
                  }
                  priority={i < 4}
                  className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.165,0.84,0.44,1)] group-hover:scale-[1.04]"
                />
              </button>

              <span className="pointer-events-none absolute bottom-0 left-0 bg-ink-deep/85 px-2 py-1 text-[0.6rem] font-semibold tracking-[0.12em] text-bone opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                {String(i + 1).padStart(3, '0')}
              </span>
            </li>
          );
        })}
      </ul>

      <dialog
        ref={dialogRef}
        onClose={() => setOpen(null)}
        onClick={(e) => {
          if (e.target === dialogRef.current) hide();
        }}
        className="m-0 h-full max-h-none w-full max-w-none bg-ink-deep/96 p-0 backdrop:bg-ink-deep/80"
      >
        {active && (
          <div className="flex h-full w-full flex-col">
            <div className="flex shrink-0 items-center justify-between gap-4 px-4 py-3 sm:px-6">
              <span className="tag text-copper">
                {label} · {String((open ?? 0) + 1).padStart(3, '0')} / {photos.length}
              </span>
              <div className="flex items-center gap-2">
                <a
                  href={waHref(open ?? 0)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="tag bg-copper px-3 py-2 text-ink-deep hover:bg-bone"
                >
                  WhatsApp
                </a>
                <button
                  type="button"
                  onClick={hide}
                  className="tag border border-ink-hair px-3 py-2 text-bone hover:border-copper hover:text-copper"
                  aria-label={locale === 'id' ? 'Tutup' : 'Close'}
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="relative min-h-0 flex-1">
              <CatalogImage
                key={active.slug}
                photo={active}
                alt={`${label}, MM Furniture Globalindo, Bali`}
                sizes="100vw"
                priority
                className="object-contain !bg-none"
              />
            </div>

            <div className="flex shrink-0 items-center justify-center gap-3 py-4">
              <button
                type="button"
                onClick={() => step(-1)}
                className="tag border border-ink-hair px-5 py-2.5 text-bone hover:border-copper hover:text-copper"
                aria-label={locale === 'id' ? 'Sebelumnya' : 'Previous'}
              >
                ←
              </button>
              <button
                type="button"
                onClick={() => step(1)}
                className="tag border border-ink-hair px-5 py-2.5 text-bone hover:border-copper hover:text-copper"
                aria-label={locale === 'id' ? 'Berikutnya' : 'Next'}
              >
                →
              </button>
            </div>
          </div>
        )}
      </dialog>
    </>
  );
}
