import { ImageResponse } from 'next/og';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { company } from './site';

export const ogSize = { width: 1200, height: 630 };
export const ogContentType = 'image/png';
export const ogAlt = `${company.name} — ${company.tagline.en}`;

/**
 * The social card, shared by both locales.
 *
 * This lives in lib rather than app because `opengraph-image.tsx` only attaches to the
 * route segment it sits in. With two root layouts there is no shared segment above
 * `(id)` and `(en)`, so a single file at the app root attaches to neither and every page
 * ships without an og:image. Each group gets a thin `opengraph-image.tsx` re-exporting
 * this instead.
 *
 * next/og runs Satori, which resolves neither CSS custom properties nor OKLCH, so the
 * tokens from globals.css are restated as literal sRGB. Exact conversions of the same
 * values: espresso oklch(0.24 0.03 35), brand oklch(0.386 0.051 35),
 * sand oklch(0.66 0.038 35), paper oklch(0.985 0.003 35).
 *
 * Satori also has no `ch` unit and will not shrink text to fit, so the headline width is
 * pinned in px and sized against the longer of the two languages.
 */
export async function renderOgCard(locale: 'id' | 'en') {
  const [mono, font] = await Promise.all([
    readFile(path.join(process.cwd(), 'public', 'brand', 'monogram.svg'), 'utf8'),
    readFile(path.join(process.cwd(), 'public', 'brand', 'urbanist-500.ttf')),
  ]);

  const ESPRESSO = '#2c1a15';
  const BRAND = '#5c3a31';
  const SAND = '#a88a83';
  const PAPER = '#fcf9f9';

  const monoDataUri = `data:image/svg+xml;base64,${Buffer.from(
    mono.replace(/currentColor/g, SAND),
  ).toString('base64')}`;

  const headline =
    locale === 'id'
      ? 'Furnitur kelas ekspor, dikerjakan di Bali.'
      : 'Export-grade furniture, built in Bali.';

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: ESPRESSO,
          padding: 72,
          fontFamily: 'Urbanist',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 28 }}>
          <img src={monoDataUri} width={92} height={92} alt="" />
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ color: PAPER, fontSize: 42, letterSpacing: '0.04em' }}>MM FURNITURE</span>
            <span style={{ color: SAND, fontSize: 17, letterSpacing: '0.3em', marginTop: 8 }}>
              GLOBALINDO
            </span>
          </div>
        </div>

        <span
          style={{
            color: PAPER,
            fontSize: 62,
            lineHeight: 1.08,
            letterSpacing: '-0.03em',
            maxWidth: 880,
            display: 'flex',
          }}
        >
          {headline}
        </span>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ color: SAND, fontSize: 20, letterSpacing: '0.18em' }}>
            SOFA · KURSI · MEJA · BED · ALMARI
          </span>
          <span
            style={{
              display: 'flex',
              color: PAPER,
              fontSize: 18,
              background: BRAND,
              padding: '10px 22px',
              borderRadius: 999,
            }}
          >
            Denpasar · Kuta · Bali
          </span>
        </div>
      </div>
    ),
    {
      ...ogSize,
      fonts: [
        {
          name: 'Urbanist',
          data: font.buffer.slice(font.byteOffset, font.byteOffset + font.byteLength) as ArrayBuffer,
          weight: 500,
          style: 'normal',
        },
      ],
    },
  );
}
