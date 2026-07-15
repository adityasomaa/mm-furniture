import type Lenis from 'lenis';

/**
 * Module-level handle on the Lenis instance.
 *
 * The curtain transition has to force the scroll position back to the top while the
 * screen is covered. If Lenis is running, calling window.scrollTo alone does not work:
 * Lenis keeps its own animated scroll value and will smoothly drag the page back to
 * where it thinks it should be, which is visible the moment the curtain lifts.
 *
 * A store rather than context because the transition provider and the Lenis provider
 * are siblings, and threading a ref between them through the tree buys nothing.
 */
let instance: Lenis | null = null;

export const setLenis = (l: Lenis | null) => {
  instance = l;
};

export const getLenis = () => instance;

/** Jump to the top with no animation. Safe whether or not Lenis is mounted. */
export const jumpToTop = () => {
  const lenis = getLenis();
  if (lenis) {
    lenis.scrollTo(0, { immediate: true, force: true });
  }
  window.scrollTo(0, 0);
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;
};
