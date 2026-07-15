// One-off asset migration: pulls catalog photography off the legacy WordPress
// install and writes optimised AVIF/WebP derivatives into public/catalog.
// Re-runnable: existing outputs are skipped.
import { readFile, writeFile, mkdir, access } from 'node:fs/promises';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import path from 'node:path';
import sharp from 'sharp';

const run = promisify(execFile);
const UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36';

const ROOT = process.cwd();
const RAW = path.join(ROOT, '.cache', 'raw');
const OUT = path.join(ROOT, 'public', 'catalog');
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const exists = (p) =>
  access(p).then(
    () => true,
    () => false,
  );

async function curl(url, dest, tries = 4) {
  for (let i = 0; i < tries; i++) {
    try {
      await run('curl', ['-sL', '--compressed', '--max-time', '90', '-A', UA, '-o', dest, url]);
      const { size } = await import('node:fs').then((fs) => fs.promises.stat(dest));
      if (size > 2000) return true;
    } catch {
      /* retry */
    }
    await sleep(2500 * (i + 1));
  }
  return false;
}

// Rough perceptual hash so we can drop duplicate shots reused across categories.
async function fingerprint(file) {
  const px = await sharp(file).greyscale().resize(16, 16, { fit: 'fill' }).raw().toBuffer();
  const avg = px.reduce((a, b) => a + b, 0) / px.length;
  let bits = '';
  for (const p of px) bits += p > avg ? '1' : '0';
  return bits;
}

/**
 * Brand assets that live in the same uploads folder as the product shots.
 * `MM-Furniture-01` is the logo card, and the legacy install dropped it into all seven
 * category galleries, so it survived as a "product" until it was spotted by eye. A
 * gallery of furniture should contain furniture.
 */
const NOT_A_PRODUCT = /mm-furniture-\d|mmfurniture|logo|banner|watermark/i;

const manifest = JSON.parse(await readFile(path.join(ROOT, 'catalog_imgs.json'), 'utf8'));
await mkdir(RAW, { recursive: true });
await mkdir(OUT, { recursive: true });

const seen = new Set();
const out = {};
let n = 0;

for (const [cat, urls] of Object.entries(manifest)) {
  out[cat] = [];
  for (const url of urls) {
    const file = path.basename(url);
    if (NOT_A_PRODUCT.test(file)) {
      console.log('SKIP brand asset:', file);
      continue;
    }
    const base = file.replace(/\.[^.]+$/, '');
    const raw = path.join(RAW, file);

    if (!(await exists(raw))) {
      const ok = await curl(url, raw);
      if (!ok) {
        console.log('MISS', url);
        continue;
      }
      await sleep(350); // stay under the legacy host's rate limiter
    }

    let meta;
    try {
      meta = await sharp(raw).metadata();
    } catch {
      console.log('BAD ', raw);
      continue;
    }
    if (!meta.width || meta.width < 400) continue; // icons / UI chrome

    const fp = await fingerprint(raw);
    if (seen.has(fp)) continue; // same photo reused on another category page
    seen.add(fp);

    const slug = `${cat}-${base}`.toLowerCase().replace(/[^a-z0-9-]/g, '-');
    const img = sharp(raw).rotate();
    const w = Math.min(meta.width, 1400);

    // 24px LQIP inlined as a data URI for instant blur-up.
    const lqip = await img.clone().resize({ width: 24 }).webp({ quality: 32 }).toBuffer();
    const resized = await img.clone().resize({ width: w, withoutEnlargement: true }).metadata();

    out[cat].push({
      slug,
      // `file` is recorded explicitly rather than reconstructed from `slug` downstream.
      // The slug is lowercased and punctuation-stripped, so deriving the original
      // filename back out of it is lossy: "MM-Furniture-01.jpg" becomes
      // "mm-furniture-01" and no longer matches on a case-sensitive filesystem.
      file,
      w: resized.width,
      h: resized.height,
      blur: `data:image/webp;base64,${lqip.toString('base64')}`,
    });
    n++;
    if (n % 20 === 0) console.log('...', n);
  }
  console.log(`${cat.padEnd(10)} ${out[cat].length}`);
}

await writeFile(path.join(ROOT, 'src', 'data', 'photos.json'), JSON.stringify(out, null, 1));
console.log('DONE', n, 'unique photos');
