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
 * `(id)` and `(en)`, so a single file at the app root attaches to neither, and every
 * page ships without an og:image. Each group gets a thin `opengraph-image.tsx` that
 * re-exports this instead.
 *
 * next/og runs Satori, which resolves neither CSS custom properties nor OKLCH, so the
 * tokens from globals.css are restated as literal sRGB. These are exact conversions of
 * the same values: ink oklch(0.26 0.028 212), copper oklch(0.70 0.115 45),
 * bone oklch(0.965 0.006 75), muted oklch(0.74 0.018 212).
 */
export async function renderOgCard(locale: 'id' | 'en') {
  const [mono, font] = await Promise.all([
    readFile(path.join(process.cwd(), 'public', 'brand', 'monogram.svg'), 'utf8'),
    readFile(path.join(process.cwd(), 'public', 'brand', 'archivo-800.ttf')),
  ]);

  const INK = '#13282c';
  const COPPER = '#d98660';
  const BONE = '#f6f3ef';
  const MUTED = '#9faeb1';

  const monoDataUri = `data:image/svg+xml;base64,${Buffer.from(
    mono.replace(/currentColor/g, COPPER),
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
          background: INK,
          padding: 72,
          fontFamily: 'Archivo',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 28 }}>
          <img src={monoDataUri} width={96} height={96} alt="" />
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ color: BONE, fontSize: 46, letterSpacing: '-0.01em' }}>MM FURNITURE</span>
            <span style={{ color: COPPER, fontSize: 19, letterSpacing: '0.24em', marginTop: 6 }}>
              GLOBALINDO
            </span>
          </div>
        </div>

        {/* Satori has no `ch` unit and does not shrink text to fit, so the width is
            pinned in px and the size is set to what actually fits the longer of the two
            headlines (the Indonesian one). */}
        <span
          style={{
            color: BONE,
            fontSize: 62,
            lineHeight: 1.05,
            letterSpacing: '-0.03em',
            maxWidth: 880,
            display: 'flex',
          }}
        >
          {headline}
        </span>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ color: COPPER, fontSize: 21, letterSpacing: '0.16em' }}>
            SOFA · KURSI · MEJA · BED · ALMARI
          </span>
          <span style={{ color: MUTED, fontSize: 21 }}>Denpasar · Kuta · Bali</span>
        </div>
      </div>
    ),
    {
      ...ogSize,
      fonts: [
        {
          name: 'Archivo',
          data: font.buffer.slice(font.byteOffset, font.byteOffset + font.byteLength) as ArrayBuffer,
          weight: 800,
          style: 'normal',
        },
      ],
    },
  );
}
