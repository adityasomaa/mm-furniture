import type { Locale } from '@/lib/site';
import { rooms } from '@/lib/rooms';

/**
 * Category ticker under the hero.
 *
 * CSS-only: the track is duplicated once and translated by exactly -50%, so the seam
 * lands on an identical frame and the loop is invisible. No JS, no measuring, and it
 * cannot desynchronise.
 *
 * `Track` is declared at module scope rather than inside `Marquee`. Defining a component
 * inside another re-creates its type on every render, which throws away the subtree's
 * state and defeats memoisation (react-hooks/static-components).
 */
function Track({ items, hidden }: { items: string[]; hidden?: boolean }) {
  return (
    <ul aria-hidden={hidden} className="flex shrink-0 items-center gap-10 pr-10">
      {items.map((label) => (
        <li key={label} className="flex items-center gap-10">
          <span className="tag whitespace-nowrap text-clay">{label}</span>
          <span aria-hidden="true" className="h-1 w-1 rounded-full bg-clay/40" />
        </li>
      ))}
    </ul>
  );
}

export function Marquee({ locale }: { locale: Locale }) {
  const items = [...rooms.map((r) => r.label[locale]), locale === 'id' ? 'Custom' : 'Custom work'];

  return (
    <div className="relative overflow-hidden border-y border-linen bg-shell/60 py-4">
      <div className="flex w-max animate-[marquee_38s_linear_infinite] motion-reduce:animate-none">
        <Track items={items} />
        {/* The duplicate is what makes -50% land on an identical frame. A screen reader
            should hear the list once, so only this copy is hidden. */}
        <Track items={items} hidden />
      </div>

      {/* Fade the ends so the loop dissolves instead of clipping at the viewport edge. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-shell to-transparent"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-shell to-transparent"
      />
    </div>
  );
}
