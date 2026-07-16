// Builds the responsive image ladder from the cached originals in .cache/raw.
//
// Why not next/image's optimizer: every catalogue photo is known at build time and
// never changes, so paying a runtime transformation (and Vercel's per-plan
// transformation quota) for a deterministic result is waste. These derivatives ship as
// static, immutable files behind a one-year cache header, which is both faster and free.
//
// Each plate also gets its studio backdrop keyed out (see lib-cutout.mjs) so the
// furniture sits on the page's warm ground instead of inside a white box.
import { readFile, writeFile, mkdir, readdir, access } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';
import { cutout } from './lib-cutout.mjs';

const exists = (p) =>
  access(p).then(
    () => true,
    () => false,
  );

const ROOT = process.cwd();
const RAW = path.join(ROOT, '.cache', 'raw');
const OUT = path.join(ROOT, 'public', 'catalog');

// The legacy originals are 1024 or 1080px square. That is the hard ceiling on detail:
// rendering a 1600px derivative would add bytes and invent nothing, so the ladder stops
// at the source width. "HD" here is won on encode quality, not on fake pixels.
const WIDTHS = [512, 800, 1400];

// Raised from AVIF q58 / WebP q76. These are product photographs sold on their detail
// (rattan weave, timber grain, stitching), and the earlier setting was visibly smearing
// the cane work at 1x.
const AVIF_Q = 72;
const WEBP_Q = 88;

await mkdir(OUT, { recursive: true });

const rawFiles = await readdir(RAW);
const byLowerBase = new Map(rawFiles.map((f) => [f.replace(/\.[^.]+$/, '').toLowerCase(), f]));

const photos = JSON.parse(await readFile(path.join(ROOT, 'src', 'data', 'photos.json'), 'utf8'));
const out = {};
let done = 0;
let missing = 0;
const suspicious = [];

for (const [cat, list] of Object.entries(photos)) {
  out[cat] = [];
  for (const p of list) {
    const file = p.file ?? byLowerBase.get(p.slug.replace(new RegExp(`^${cat}-`), '').toLowerCase());
    if (!file) {
      console.log('NO RAW', p.slug);
      missing++;
      continue;
    }

    const src = path.join(RAW, file);
    const { png, keptRatio, width } = await cutout(src);

    // A plate where almost nothing survived means the key ate the subject; one where
    // almost everything survived means it found no backdrop. Either way a human should
    // look, so they are reported rather than silently shipped.
    if (keptRatio < 0.04 || keptRatio > 0.97) {
      suspicious.push(`${p.slug} kept=${(keptRatio * 100).toFixed(1)}%`);
    }

    const widths = [...new Set(WIDTHS.filter((w) => w <= width).concat(Math.min(width, WIDTHS.at(-1))))].sort(
      (a, b) => a - b,
    );

    for (const w of widths) {
      const avif = path.join(OUT, `${p.slug}-${w}.avif`);
      const webp = path.join(OUT, `${p.slug}-${w}.webp`);
      // Both, not just the avif. The two are written sequentially, so a run killed
      // between them leaves the avif on disk and the webp missing; checking only the
      // avif would then skip the pair forever and ship a permanently broken srcset
      // entry. (This happened: kursi-11-6-512.webp went missing exactly this way.)
      if ((await exists(avif)) && (await exists(webp))) continue;
      const img = sharp(png)
        .resize({ width: w, withoutEnlargement: true, kernel: 'lanczos3' })
        .sharpen({ sigma: 0.6 });
      await img.clone().avif({ quality: AVIF_Q, effort: 6, chromaSubsampling: '4:4:4' }).toFile(avif);
      await img.clone().webp({ quality: WEBP_Q, smartSubsample: true, alphaQuality: 90 }).toFile(webp);
    }

    // LQIP is flattened onto white to match the plate the tiles present it on, rather
    // than left transparent: it is used as a CSS background behind the real image, and a
    // transparent blur would show the page through the subject while loading.
    const lqip = await sharp(png)
      .resize({ width: 24 })
      .flatten({ background: '#ffffff' })
      .webp({ quality: 32 })
      .toBuffer();

    const meta = await sharp(png).resize({ width: widths.at(-1), withoutEnlargement: true }).metadata();

    out[cat].push({
      slug: p.slug,
      file,
      w: meta.width,
      h: meta.height,
      blur: `data:image/webp;base64,${lqip.toString('base64')}`,
      widths,
    });
    done++;
    if (done % 40 === 0) console.log('...', done);
  }
  console.log(`${cat.padEnd(10)} ${out[cat].length}`);
}

await writeFile(path.join(ROOT, 'src', 'data', 'photos.json'), JSON.stringify(out, null, 1));

// A separate tiny file of just the per-category counts. The header and the catalogue
// dropdown are client components and only need the numbers; importing photos.json for
// them would ship ~60KB of blur data URIs to the browser to render seven integers.
const counts = Object.fromEntries(Object.entries(out).map(([cat, list]) => [cat, list.length]));
counts.total = Object.values(counts).reduce((a, b) => a + b, 0);
await writeFile(path.join(ROOT, 'src', 'data', 'counts.json'), JSON.stringify(counts, null, 1));

console.log('DERIVED', done, '| counts', JSON.stringify(counts));
if (suspicious.length) {
  console.log(`\nCUTOUT WORTH A LOOK (${suspicious.length}):`);
  suspicious.forEach((s) => console.log('  ', s));
}
if (missing) {
  console.error(`\n${missing} photo(s) had no matching original in .cache/raw.`);
  process.exit(1);
}
