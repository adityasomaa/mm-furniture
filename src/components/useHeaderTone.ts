'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

export type Tone = 'light' | 'dark';

/**
 * Reports whether the strip of page currently sitting under the header is light or dark,
 * so the logo and nav can invert against it.
 *
 * Works off a 2px-tall detection band pinned at the header's lower edge, built with
 * rootMargin. Sections tag themselves `data-tone="dark" | "light"` and the one crossing
 * that band wins.
 *
 * The obvious alternative, `elementFromPoint` on every scroll frame, does not work here:
 * the header is fixed, so it is the element at that point, and it would only ever report
 * itself. Forcing pointer-events off to see through it costs a layout read per frame.
 * An observer costs nothing between crossings.
 *
 * Re-observes on route change because the next page has entirely different sections.
 */
export function useHeaderTone(headerHeight = 76): Tone {
  const [tone, setTone] = useState<Tone>('light');
  const pathname = usePathname();

  // Reset to light the moment the route changes, adjusted during render rather than in
  // an effect. Without this the header would keep the previous page's tone until the
  // observer's first callback, which on a light page arriving from a dark one is a
  // visible flash of an invisible logo.
  const [prevPath, setPrevPath] = useState(pathname);
  if (prevPath !== pathname) {
    setPrevPath(pathname);
    setTone('light');
  }

  useEffect(() => {
    const sections = Array.from(document.querySelectorAll<HTMLElement>('[data-tone]'));
    if (sections.length === 0) return; // nothing to observe; stays light

    const read = () => {
      // Bottom edge of the header, in viewport coordinates.
      const line = headerHeight - 1;
      let current: Tone = 'light';
      for (const el of sections) {
        const r = el.getBoundingClientRect();
        if (r.top <= line && r.bottom >= line) {
          current = el.dataset.tone === 'dark' ? 'dark' : 'light';
        }
      }
      setTone(current);
    };

    const io = new IntersectionObserver(read, {
      rootMargin: `-${headerHeight - 2}px 0px -${Math.max(0, window.innerHeight - headerHeight)}px 0px`,
      threshold: [0, 1],
    });
    // observe() delivers an initial callback for every target, so this covers the first
    // paint without a synchronous read here. Calling read() directly in the effect body
    // would be a setState-in-effect cascade for a value the observer is about to report
    // anyway.
    sections.forEach((el) => io.observe(el));

    // The observer only fires on crossings; these cover what it cannot see, namely a
    // resize reflow and Lenis's sub-pixel settle at the end of a scroll.
    window.addEventListener('resize', read, { passive: true });
    window.addEventListener('scroll', read, { passive: true });

    return () => {
      io.disconnect();
      window.removeEventListener('resize', read);
      window.removeEventListener('scroll', read);
    };
  }, [pathname, headerHeight]);

  return tone;
}
