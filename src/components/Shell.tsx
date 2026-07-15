import type { ReactNode } from 'react';

/**
 * Section wrapper.
 *
 * `tone` does double duty: it picks the surface colour and it tags the section for
 * useHeaderTone, which is how the logo knows to invert when a dark band scrolls under
 * the header. Any new dark section gets that behaviour for free.
 *
 * (The old `Shell` component that used to live here is gone. The header, footer and
 * providers now mount from the layout so they survive a route change; see AppChrome.)
 */
export function Section({
  children,
  tone = 'paper',
  className = '',
  id,
}: {
  children: ReactNode;
  tone?: 'paper' | 'shell' | 'dark';
  className?: string;
  id?: string;
}) {
  const tones = {
    paper: 'bg-paper text-bark',
    shell: 'bg-shell text-bark',
    dark: 'bg-espresso text-linen',
  };
  return (
    <section
      id={id}
      data-tone={tone === 'dark' ? 'dark' : 'light'}
      className={`${tones[tone]} py-section ${className}`}
    >
      <div className="mx-auto max-w-[88rem] px-5 sm:px-8">{children}</div>
    </section>
  );
}

/** Small label above a section title. */
export function Kicker({ children, onDark = false }: { children: ReactNode; onDark?: boolean }) {
  return (
    <p className={`tag flex items-center gap-3 ${onDark ? 'text-sand' : 'text-clay'}`}>
      <span className={`h-px w-8 rounded-full ${onDark ? 'bg-sand/50' : 'bg-clay/40'}`} />
      {children}
    </p>
  );
}
