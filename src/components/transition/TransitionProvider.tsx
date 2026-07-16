'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { jumpToTop } from '@/lib/lenis-store';
import { Curtain } from './Curtain';

/**
 * Curtain page transitions.
 *
 * The sequence, which is the whole point of the thing:
 *
 *   1. curtain rises from the bottom and covers the screen (logo on it)
 *   2. ONLY THEN does the route change
 *   3. still covered, the scroll position is forced back to the top
 *   4. a short hold lets the new page paint and its fonts settle
 *   5. curtain continues upward and off, revealing the new page already at the top
 *
 * Every visible change happens behind the curtain. The user never sees the old page
 * jump to the top, never sees the new page mid-load, and never sees a scroll reset.
 *
 * Two variants:
 *   v1 — first visit to the site, and any navigation to the home page. Longer, shows
 *        the full lockup. This is the "arrival" moment.
 *   v2 — every other route change. Just the monogram. Quick enough not to nag.
 */

type Phase = 'intro' | 'idle' | 'closing' | 'covered' | 'opening';
type Variant = 'v1' | 'v2';

type Ctx = {
  navigate: (href: string) => void;
  phase: Phase;
};

const TransitionCtx = createContext<Ctx | null>(null);

export const useTransition = () => {
  const ctx = useContext(TransitionCtx);
  if (!ctx) throw new Error('useTransition must be used inside <TransitionProvider>');
  return ctx;
};

// Slow on purpose. The brief asked for seamless over snappy, and a curtain that moves
// too fast reads as a flicker rather than as a deliberate wipe.
const CLOSE_MS = 780;
const OPEN_MS = 820;
const HOLD_MS = 340; // new route paints in here, behind the curtain
const INTRO_HOLD_MS = 1100;

// Safety net only. The close waits on the panel's real transitionend; this is the
// fallback for when that event cannot arrive at all (a backgrounded tab throttles
// transitions, and prefers-reduced-motion removes them entirely). Generous, because
// firing it early is the exact bug it is guarding against.
const CLOSE_FALLBACK_MS = CLOSE_MS + 600;

const norm = (p: string) => (p !== '/' && p.endsWith('/') ? p.slice(0, -1) : p);
const isHome = (p: string) => norm(p) === '' || norm(p) === '/' || norm(p) === '/id';
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export function TransitionProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  // Start covered: the intro curtain must already be over the page on first paint, or
  // the user sees a flash of the site before the loader claims it.
  const [phase, setPhase] = useState<Phase>('intro');
  const [variant, setVariant] = useState<Variant>('v1');

  const pending = useRef<string | null>(null);
  const lastPath = useRef(pathname);

  // Resolved by the curtain's own transitionend. See `navigate`.
  const settled = useRef<(() => void) | null>(null);
  const onCurtainSettled = useCallback(() => {
    settled.current?.();
    settled.current = null;
  }, []);

  // ── First load ────────────────────────────────────────────────────────────
  useEffect(() => {
    let cancelled = false;
    (async () => {
      // Wait for fonts so the wordmark on the curtain does not swap mid-reveal.
      await Promise.race([
        document.fonts?.ready ?? Promise.resolve(),
        sleep(2000), // never hang the site on a font that will not load
      ]);
      if (cancelled) return;
      await sleep(INTRO_HOLD_MS);
      if (cancelled) return;
      setPhase('opening');
      await sleep(OPEN_MS);
      if (cancelled) return;
      setPhase('idle');
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // ── Route change lands ────────────────────────────────────────────────────
  useEffect(() => {
    if (pathname === lastPath.current) return;
    lastPath.current = pathname;

    // A navigation we did not drive (back/forward button, or a plain <a>). There is no
    // curtain up, so do not try to open one; just make sure we are at the top.
    if (!pending.current) {
      jumpToTop();
      return;
    }
    pending.current = null;

    let cancelled = false;
    (async () => {
      // Step 3: still covered.
      jumpToTop();
      // Step 4: let the new route paint.
      await sleep(HOLD_MS);
      if (cancelled) return;
      // Step 5: reveal.
      setPhase('opening');
      await sleep(OPEN_MS);
      if (cancelled) return;
      setPhase('idle');
    })();

    return () => {
      cancelled = true;
    };
  }, [pathname]);

  const navigate = useCallback(
    async (href: string) => {
      if (norm(href) === norm(pathname)) return;
      if (phase === 'closing' || phase === 'covered') return; // already mid-wipe

      setVariant(isHome(href) ? 'v1' : 'v2');
      pending.current = norm(href);

      // Step 1: cover.
      //
      // Waits on the panel's real transitionend, not on sleep(CLOSE_MS). A fixed timer
      // starts counting at setState, while the CSS transition only starts a frame or two
      // later once the class lands, so the timer fires ~30-70ms BEFORE the panel has
      // finished covering. That gap is a window where the route swaps while the screen
      // is still partly transparent, which is the one thing this component exists to
      // prevent. Measured: timer said covered at +818ms, panel actually covered at
      // +851ms.
      setPhase('closing');
      await new Promise<void>((resolve) => {
        let done = false;
        const finish = () => {
          if (done) return;
          done = true;
          clearTimeout(timer);
          resolve();
        };
        settled.current = finish;
        const timer = setTimeout(finish, CLOSE_FALLBACK_MS);
      });

      setPhase('covered');
      // Step 2: only now swap the route.
      router.push(href);
    },
    [pathname, phase, router],
  );

  // Lock scrolling while the curtain is over the page. Without this a trackpad flick
  // during the wipe leaves the new page scrolled somewhere arbitrary.
  useEffect(() => {
    const locked = phase === 'closing' || phase === 'covered' || phase === 'intro';
    document.body.style.overflow = locked ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [phase]);

  return (
    <TransitionCtx.Provider value={{ navigate, phase }}>
      {children}
      <Curtain
        phase={phase}
        variant={phase === 'intro' ? 'v1' : variant}
        onSettled={onCurtainSettled}
      />
    </TransitionCtx.Provider>
  );
}
