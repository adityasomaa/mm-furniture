'use client';

import { company } from '@/lib/site';
import { Monogram } from '../Wordmark';

type Phase = 'intro' | 'idle' | 'closing' | 'covered' | 'opening';

/**
 * The curtain itself.
 *
 * Motion is one continuous upward travel, never a reverse: it enters from the bottom to
 * cover, and leaves off the top to reveal. A panel that slid back down the way it came
 * would read as "cancelled" rather than "moved on".
 *
 * Driven by class-swapped transforms rather than the Web Animations API so the `intro`
 * state is already correct in the very first paint. A WAAPI keyframe cannot run until
 * after hydration, which is exactly when a flash of the unclothed page would show.
 *
 * The transition is deliberately OFF in `idle`. Idle parks the panel below the fold at
 * translateY(100%), and it arrives there from `opening`'s translateY(-100%): with a
 * transition attached, that reset would animate the curtain sweeping back down across
 * the page every single time it finished.
 */
export function Curtain({
  phase,
  variant,
  onSettled,
}: {
  phase: Phase;
  variant: 'v1' | 'v2';
  /** Fires when the panel's own travel actually finishes, not when a timer says so. */
  onSettled?: () => void;
}) {
  const covering = phase === 'intro' || phase === 'covered' || phase === 'closing';

  const translate =
    phase === 'opening' ? '-translate-y-full' : covering ? 'translate-y-0' : 'translate-y-full';

  const withTransition = phase === 'closing' || phase === 'opening';
  const duration = phase === 'closing' ? 'duration-[780ms]' : 'duration-[820ms]';

  return (
    <div
      aria-hidden="true"
      // Stable hook for tests and debugging. Selecting on the Tailwind classes instead
      // means an arbitrary styling change silently breaks the test.
      data-curtain={phase}
      onTransitionEnd={(e) => {
        // Tailwind v4 animates the `translate` property, not `transform`, and the
        // element also transitions other things; only the panel's own travel counts.
        if (e.target !== e.currentTarget) return;
        if (e.propertyName !== 'translate' && e.propertyName !== 'transform') return;
        onSettled?.();
      }}
      className={[
        // Swallows clicks while it covers. Without this a stray click during the wipe
        // lands on a link underneath and starts a second navigation.
        covering ? 'pointer-events-auto' : 'pointer-events-none',
        // No `will-change: transform`. The browser already promotes this to its own
        // layer for the duration of the transition, so a permanent hint on a
        // full-viewport element only pins a screen-sized layer in memory for the whole
        // session and buys nothing.
        'fixed inset-0 z-[200] flex items-center justify-center bg-espresso',
        translate,
        withTransition ? `transition-transform ease-[cubic-bezier(0.76,0,0.24,1)] ${duration}` : '',
      ].join(' ')}
    >
      <div
        className={[
          'flex flex-col items-center gap-5 transition-all ease-quart',
          covering ? 'opacity-100 duration-700 delay-150' : 'opacity-0 duration-200',
          covering ? 'translate-y-0 scale-100' : 'translate-y-2 scale-[0.96]',
        ].join(' ')}
      >
        <Monogram
          className={variant === 'v1' ? 'h-20 w-20 text-sand sm:h-24 sm:w-24' : 'h-12 w-12 text-sand'}
        />

        {/* v1 is the arrival moment and earns the full lockup. v2 is a connective wipe
            between pages and would nag if it announced the name every time. */}
        {variant === 'v1' && (
          <div className="flex flex-col items-center gap-2">
            <span className="text-lg font-normal tracking-[0.22em] text-paper sm:text-xl">
              {company.short.toUpperCase()}
            </span>
            <span className="tag text-sand/70">Globalindo</span>
            <span
              aria-hidden="true"
              className="mt-3 h-px w-16 rounded-full bg-sand/40"
              style={{ animation: covering ? 'curtain-rule 900ms var(--ease-quart) both 400ms' : undefined }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
