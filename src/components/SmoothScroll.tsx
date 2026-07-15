'use client';

import { useEffect } from 'react';
import Lenis from 'lenis';
import { setLenis } from '@/lib/lenis-store';

/**
 * Lenis smooth scrolling, desktop only.
 *
 * Deliberately not mounted on tablet or phone. Hijacking momentum scroll on a touch
 * device fights the OS: it breaks the native rubber-band, adds latency to a gesture the
 * user feels directly, and on iOS it desynchronises from the collapsing address bar.
 * Touch platforms already have good inertial scrolling. This is a desktop-only nicety.
 *
 * The gate is `pointer: fine` plus a width floor, so it keys off the actual input
 * device rather than a user-agent guess. A tablet with a trackpad still fails the width
 * check; a small desktop window still passes on pointer but fails on width, which is the
 * conservative direction to be wrong in.
 */
export function SmoothScroll() {
  useEffect(() => {
    const desktop = window.matchMedia('(min-width: 1024px) and (pointer: fine)');
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');

    let lenis: Lenis | null = null;
    let raf = 0;

    const start = () => {
      if (lenis) return;
      lenis = new Lenis({
        duration: 1.05,
        // Matches --ease-quart in globals.css so the scroll feels like the rest of the
        // motion on the page rather than a separate system.
        easing: (t: number) => 1 - Math.pow(1 - t, 4),
        smoothWheel: true,
        syncTouch: false,
        touchMultiplier: 1,
        wheelMultiplier: 0.9,
      });
      setLenis(lenis);
      document.documentElement.classList.add('lenis');

      const loop = (time: number) => {
        lenis?.raf(time);
        raf = requestAnimationFrame(loop);
      };
      raf = requestAnimationFrame(loop);
    };

    const stop = () => {
      cancelAnimationFrame(raf);
      lenis?.destroy();
      lenis = null;
      setLenis(null);
      document.documentElement.classList.remove('lenis');
    };

    const sync = () => {
      if (desktop.matches && !reduced.matches) start();
      else stop();
    };

    sync();
    // Re-evaluate on resize and on a reduced-motion preference change, so dragging a
    // window narrow hands scrolling back to the browser instead of leaving Lenis
    // running at a size it was never meant for.
    desktop.addEventListener('change', sync);
    reduced.addEventListener('change', sync);

    return () => {
      desktop.removeEventListener('change', sync);
      reduced.removeEventListener('change', sync);
      stop();
    };
  }, []);

  return null;
}
