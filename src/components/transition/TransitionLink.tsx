'use client';

import Link from 'next/link';
import type { ComponentProps, MouseEvent } from 'react';
import { useTransition } from './TransitionProvider';

/**
 * A Link that routes through the curtain instead of navigating directly.
 *
 * Still renders a real <a href> so the link is crawlable, middle-clickable, and works
 * with keyboard and screen readers. The curtain is layered on top of that, not
 * substituted for it: modifier-clicks and non-primary buttons fall through to the
 * browser's own behaviour, because someone cmd-clicking wants a new tab, not a wipe.
 */
export function TransitionLink({
  href,
  onClick,
  children,
  ...rest
}: ComponentProps<typeof Link> & { href: string }) {
  const { navigate } = useTransition();

  const handle = (e: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(e);
    if (e.defaultPrevented) return;

    // Let the browser own anything that is not a plain left click.
    if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    // External and non-page links are not ours to animate.
    if (/^(https?:)?\/\//.test(href) || href.startsWith('mailto:') || href.startsWith('tel:')) return;
    if (rest.target === '_blank') return;

    e.preventDefault();
    navigate(href);
  };

  return (
    <Link href={href} onClick={handle} {...rest}>
      {children}
    </Link>
  );
}
