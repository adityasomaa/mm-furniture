import { Urbanist } from 'next/font/google';

/**
 * Urbanist. Low-contrast geometric sans with rounded terminals and open counters.
 *
 * Replaces Archivo Expanded 800. The old pick was a crate-stencil voice: wide, heavy,
 * industrial. The brief asked for lighter and more modern, and for rounded rather than
 * sharp, and a 800-weight expanded grotesk is the opposite of all three.
 *
 * The weight range stops at 600. Display type here is set at 400 and wins on size and
 * whitespace instead of on weight, which is what keeps it modern rather than shouty.
 * Rounded terminals also agree with the global corner radius, so the type and the
 * geometry come from the same idea.
 *
 * Self-hosted at build time by next/font: no third-party request, no layout shift.
 */
export const urbanist = Urbanist({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  display: 'swap',
  variable: '--font-urbanist',
  fallback: ['system-ui', 'Segoe UI', 'Roboto', 'sans-serif'],
  adjustFontFallback: true,
});
