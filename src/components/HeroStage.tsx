'use client';

import { useEffect, useState } from 'react';
import type { Locale } from '@/lib/site';
import type { Shot } from '@/lib/catalog';
import { CatalogImage } from './CatalogImage';

/**
 * Hero stage.
 *
 * The brief originally asked for a slider of rooms. MM has no interior photography at
 * all: all 240 catalogue images are studio cutouts on white. Rather than dress the hero
 * in stock photos of somebody else's house and imply they were MM projects, the stage is
 * built as graphics with MM's own pieces standing on it.
 *
 * Each slide is a composed scene: a soft arc, a horizon line, a plinth shadow, and one
 * real piece of furniture. It reads as an art-directed set, which is honest, and it can
 * be swapped for real project photography the day it exists without touching the layout.
 */
export function HeroStage({ photos, locale }: { photos: Shot[]; locale: Locale }) {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused || photos.length < 2) return;
    const t = setInterval(() => setI((v) => (v + 1) % photos.length), 4200);
    return () => clearInterval(t);
  }, [paused, photos.length]);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => setPaused(mq.matches);
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);

  return (
    <div
      className="relative h-full w-full overflow-hidden"
      onPointerEnter={() => setPaused(true)}
      onPointerLeave={() => setPaused(false)}
    >
      {/* The set: a warm arc the pieces stand against. Pure CSS, no image weight. */}
      <div aria-hidden="true" className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-shell via-paper to-linen/60" />
        <div className="absolute left-1/2 top-[8%] h-[78%] w-[min(84%,34rem)] -translate-x-1/2 rounded-t-full bg-gradient-to-b from-linen/80 to-shell/40" />
        {/* Horizon: where the arc wall meets the floor. */}
        <div className="absolute inset-x-0 bottom-[18%] h-px bg-linen" />
        {/* Contact shadow under the piece, so it sits rather than floats. */}
        <div className="absolute bottom-[15%] left-1/2 h-8 w-[min(60%,22rem)] -translate-x-1/2 rounded-[100%] bg-clay/20 blur-2xl" />
      </div>

      {/* Slides */}
      {photos.map((p, idx) => (
        <div
          key={p.slug}
          className={[
            'absolute inset-0 flex items-center justify-center transition-all ease-quart',
            idx === i
              ? 'scale-100 opacity-100 duration-[1400ms]'
              : 'pointer-events-none scale-[1.04] opacity-0 duration-[900ms]',
          ].join(' ')}
        >
          <div className="relative h-[68%] w-[min(78%,32rem)] translate-y-[-4%]">
            <CatalogImage
              shot={p}
              alt=""
              sizes="(max-width: 1024px) 78vw, 32rem"
              priority={idx === 0}
              className="object-contain drop-shadow-[0_26px_34px_rgba(92,58,49,0.22)]"
            />
          </div>
        </div>
      ))}

      {/* Progress ticks */}
      <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 items-center gap-2">
        {photos.map((p, idx) => (
          <button
            key={p.slug}
            type="button"
            onClick={() => setI(idx)}
            aria-label={`${locale === 'id' ? 'Slide' : 'Slide'} ${idx + 1}`}
            aria-current={idx === i}
            className="group grid h-6 place-items-center px-0.5"
          >
            <span
              className={[
                'h-[3px] rounded-full transition-all duration-500 ease-quart',
                idx === i ? 'w-7 bg-brand' : 'w-2.5 bg-clay/30 group-hover:bg-clay/60',
              ].join(' ')}
            />
          </button>
        ))}
      </div>
    </div>
  );
}
