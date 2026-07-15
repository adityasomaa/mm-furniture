'use client';

import { useSyncExternalStore } from 'react';

/**
 * Reading browser-only state without tripping over SSR or React's rules.
 *
 * The tempting shape is `useState(false)` plus `useEffect(() => setState(read()))`, and
 * it is what this file replaces. It is wrong twice over: it triggers a second render
 * pass on every mount (the React Compiler lint rejects it as a cascading render), and
 * the effect ordering makes hydration mismatches easy to introduce by accident.
 *
 * `useSyncExternalStore` exists for exactly this. It takes a subscribe function and two
 * snapshot readers, one for the client and one for the server, so the server value is
 * explicit rather than an accident of when an effect happens to run.
 */

const noopSubscribe = () => () => {};

/** Matches a media query. Server snapshot is always false. */
export function useMediaQuery(query: string): boolean {
  return useSyncExternalStore(
    (onChange) => {
      const mq = window.matchMedia(query);
      mq.addEventListener('change', onChange);
      return () => mq.removeEventListener('change', onChange);
    },
    () => window.matchMedia(query).matches,
    () => false,
  );
}

/** True once the window has scrolled past `threshold` px. */
export function useScrolledPast(threshold: number): boolean {
  return useSyncExternalStore(
    (onChange) => {
      window.addEventListener('scroll', onChange, { passive: true });
      return () => window.removeEventListener('scroll', onChange);
    },
    () => window.scrollY > threshold,
    () => false,
  );
}

/**
 * Reads a localStorage key. Only re-reads when `notifyStorage` is called or another tab
 * writes, which is all this site needs: the consent value changes exactly once, from a
 * click we control.
 */
const storageListeners = new Set<() => void>();
export const notifyStorage = () => storageListeners.forEach((l) => l());

export function useLocalStorage(key: string): string | null {
  return useSyncExternalStore(
    (onChange) => {
      storageListeners.add(onChange);
      window.addEventListener('storage', onChange);
      return () => {
        storageListeners.delete(onChange);
        window.removeEventListener('storage', onChange);
      };
    },
    () => window.localStorage.getItem(key),
    () => null,
  );
}

export { noopSubscribe };
