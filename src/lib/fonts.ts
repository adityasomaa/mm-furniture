import { Archivo } from 'next/font/google';

/**
 * One family, used as a superfamily. The `wdth` axis (62–125) carries the display
 * hierarchy that a second typeface would otherwise carry: `.stencil` pushes to 125 for
 * the crate-stamp voice, body sits at 100. See DESIGN.md for the selection procedure.
 *
 * next/font self-hosts this at build time, so there is no third-party font request,
 * no render-blocking stylesheet, and no layout shift.
 */
export const archivo = Archivo({
  subsets: ['latin'],
  axes: ['wdth'],
  display: 'swap',
  variable: '--font-archivo',
  fallback: ['system-ui', 'Segoe UI', 'Roboto', 'sans-serif'],
  adjustFontFallback: true,
});
