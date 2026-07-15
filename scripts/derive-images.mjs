// Builds the responsive image ladder from the cached originals in .cache/raw.
//
// Why not next/image's optimizer: every catalogue photo is known at build time and
// never changes, so paying a runtime transformation (and Vercel's per-plan
// transformation quota) for a deterministic result is waste. These derivatives ship as
// static, immutable files behind a one-year cache header, which is both faster and free.
import { readFile, writeFile, mkdir, readdir, access } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const exists = (p) =>
  access(p).then(
    () => true,
    () => false,
  );

const ROOT = process.cwd();
const RAW = path.join(ROOT, '.cache', 'raw');
const OUT = path.join(ROOT, 'public', 'catalog');

// 400 covers a 2-up phone grid, 800 covers a 4-up desktop tile at 2x, 1400 covers the
// hero and the lightbox. Anything above the source width is skipped: upscaling a 1080px
// original to 1400px adds bytes and no detail.
const WIDTHS = [400, 800, 1400];

await mkdir(OUT, { recursive: true });

// Case-insensitive index of the originals, used only as a fallback for manifests
// written before `file` was recorded per photo.
const rawFiles = await readdir(RAW);
const byLowerBase = new Map(rawFiles.map((f) => [f.replace(/\.[^.]+$/, '').toLowerCase(), f]));

const photos = JSON.parse(await readFile(path.join(ROOT, 'src', 'data', 'photos.json'), 'utf8'));
const out = {};
let done = 0;
let missing = 0;

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
    const meta = await sharp(src).rotate().metadata();
    const widths = WIDTHS.filter((w) => w <= meta.width);
    if (widths.length === 0 || widths[widths.length - 1] < meta.width) {
      widths.push(Math.min(meta.width, WIDTHS[WIDTHS.length - 1]));
    }
    const uniq = [...new Set(widths)].sort((a, b) => a - b);

    for (const w of uniq) {
      const avif = path.join(OUT, `${p.slug}-${w}.avif`);
      const webp = path.join(OUT, `${p.slug}-${w}.webp`);
      if (await exists(avif)) continue; // idempotent: safe to re-run
      const img = sharp(src).rotate().resize({ width: w, withoutEnlargement: true });
      await img.clone().avif({ quality: 58, effort: 4 }).toFile(avif);
      await img.clone().webp({ quality: 76 }).toFile(webp);
    }

    out[cat].push({ ...p, widths: uniq });
    done++;
    if (done % 40 === 0) console.log('...', done);
  }
  console.log(`${cat.padEnd(10)} ${out[cat].length}`);
}

await writeFile(path.join(ROOT, 'src', 'data', 'photos.json'), JSON.stringify(out, null, 1));
console.log('DERIVED', done);

// A silently-dropped photo is how a catalogue quietly loses stock, so fail loudly.
if (missing) {
  console.error(`\n${missing} photo(s) had no matching original in .cache/raw.`);
  process.exit(1);
}
