// Turns .cache/catalog-raw.json (from extract-catalog.py) + the owner's asset drop into
// public/catalog derivatives and src/data/products.json.
//
// Replaces the previous pipeline entirely. The old set was 240 anonymous photos scraped
// off the legacy WordPress install with no names, sizes or descriptions; this one is the
// owner's own catalogue with a real product record behind every image.
//
// The drop is named "Katalog Website No BG", but only 41 of 227 products actually carry
// an alpha channel: the rest are still white-background JPEG/PNG. So every plate goes
// through the same key/trim/centre pipeline as before (lib-cutout.mjs), which is a no-op
// for the ones already cut and does the work for the ones that are not.
import { readFile, writeFile, mkdir, access } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';
import { cutout } from './lib-cutout.mjs';

const ROOT = process.cwd();
const DROP = String.raw`C:\Users\User\Downloads\ASET WEBSITE BARU MM FURNITURE\Katalog Website No BG`;
const OUT = path.join(ROOT, 'public', 'catalog');

// These originals run to 1600px, unlike the legacy 1080px cap, so the ladder finally has
// somewhere to go. 400 is a grid thumb, 900 a detail view, 1500 the lightbox.
const WIDTHS = [400, 900, 1500];
const AVIF_Q = 72;
const WEBP_Q = 88;

const exists = (p) =>
  access(p).then(
    () => true,
    () => false,
  );

const all = JSON.parse(await readFile(path.join(ROOT, '.cache', 'catalog-raw.json'), 'utf8'));
await mkdir(OUT, { recursive: true });

/**
 * Sharding.
 *
 * The key/bleed passes are pure CPU in JS, and at ~1500px these originals cost a few
 * seconds each: 767 of them single-threaded is roughly two hours. Node is single-
 * threaded, so the machine's other 15 cores sit idle throughout.
 *
 * `--shard i/n` slices the product list so several processes can run at once, each
 * writing its own products file. `--merge` then stitches them back into one. Products
 * are independent and every output path is derived from a product slug, so the shards
 * cannot collide.
 */
const arg = (name) => {
  const hit = process.argv.find((a) => a.startsWith(`--${name}=`));
  return hit ? hit.split('=')[1] : null;
};

const SHARD_DIR = path.join(ROOT, '.cache', 'shards');

if (process.argv.includes('--merge')) {
  await mergeShards();
  process.exit(0);
}

const shardArg = arg('shard'); // e.g. "0/6"
const [shardIdx, shardCount] = shardArg ? shardArg.split('/').map(Number) : [0, 1];
const raw = all.filter((_, i) => i % shardCount === shardIdx);
if (shardArg) console.log(`shard ${shardIdx + 1}/${shardCount}: ${raw.length} products`);

const products = [];
let done = 0;
let images = 0;
const suspicious = [];

for (const p of raw) {
  const shots = [];

  for (const [i, file] of p.files.entries()) {
    const src = path.join(DROP, p.folder, file);
    if (!(await exists(src))) {
      console.log('NO FILE', src);
      continue;
    }

    const slug = `${p.slug}-${i + 1}`;
    let cut;
    try {
      cut = await cutout(src);
    } catch (e) {
      console.log('CUTOUT FAILED', file, e.message);
      continue;
    }

    if (cut.keptRatio < 0.04 || cut.keptRatio > 0.97) {
      suspicious.push(`${slug} kept=${(cut.keptRatio * 100).toFixed(1)}%`);
    }

    const widths = [...new Set(WIDTHS.filter((w) => w <= cut.width).concat(Math.min(cut.width, WIDTHS.at(-1))))].sort(
      (a, b) => a - b,
    );

    for (const w of widths) {
      const avif = path.join(OUT, `${slug}-${w}.avif`);
      const webp = path.join(OUT, `${slug}-${w}.webp`);
      // Both, not just the avif: a run killed between the two writes would otherwise
      // skip the pair forever and ship a broken srcset entry.
      if ((await exists(avif)) && (await exists(webp))) continue;
      const img = sharp(cut.png)
        .resize({ width: w, withoutEnlargement: true, kernel: 'lanczos3' })
        .sharpen({ sigma: 0.6 });
      await img.clone().avif({ quality: AVIF_Q, effort: 6, chromaSubsampling: '4:4:4' }).toFile(avif);
      await img.clone().webp({ quality: WEBP_Q, smartSubsample: true, alphaQuality: 90 }).toFile(webp);
    }

    const lqip = await sharp(cut.png)
      .resize({ width: 24 })
      .flatten({ background: '#ffffff' })
      .webp({ quality: 32 })
      .toBuffer();

    shots.push({
      slug,
      w: cut.width,
      h: cut.height,
      widths,
      blur: `data:image/webp;base64,${lqip.toString('base64')}`,
    });
    images++;
  }

  if (shots.length === 0) {
    console.log('SKIP (no usable images):', p.id, p.name);
    continue;
  }

  products.push({
    id: p.id,
    slug: p.slug,
    name: p.name,
    room: p.room,
    material: p.material,
    dim: p.dim,
    desc: p.desc,
    shots,
  });

  done++;
  if (done % 20 === 0) console.log('...', done, 'products,', images, 'images');
}

if (shardArg) {
  await mkdir(SHARD_DIR, { recursive: true });
  await writeFile(
    path.join(SHARD_DIR, `products-${shardIdx}.json`),
    JSON.stringify({ products, suspicious }, null, 1),
  );
  console.log(`\nshard ${shardIdx + 1}/${shardCount} done: ${done} products, ${images} images`);
} else {
  await writeCatalog(products, suspicious);
}

/** Rebuilds the source order from `catalog-raw.json` so shard boundaries leave no trace. */
async function mergeShards() {
  const { readdir } = await import('node:fs/promises');
  const files = (await readdir(SHARD_DIR)).filter((f) => f.startsWith('products-'));
  const merged = [];
  const flags = [];
  for (const f of files) {
    const s = JSON.parse(await readFile(path.join(SHARD_DIR, f), 'utf8'));
    merged.push(...s.products);
    flags.push(...s.suspicious);
  }
  const order = new Map(all.map((p, i) => [p.slug, i]));
  merged.sort((a, b) => (order.get(a.slug) ?? 0) - (order.get(b.slug) ?? 0));
  await writeCatalog(merged, flags);
  console.log(`merged ${files.length} shards`);
}

async function writeCatalog(list, flags) {
  await writeFile(path.join(ROOT, 'src', 'data', 'products.json'), JSON.stringify(list, null, 1));

  const counts = {};
  for (const p of list) counts[p.room] = (counts[p.room] ?? 0) + 1;
  counts.total = list.length;
  counts.images = list.reduce((n, p) => n + p.shots.length, 0);
  await writeFile(path.join(ROOT, 'src', 'data', 'counts.json'), JSON.stringify(counts, null, 1));

  console.log('\nBUILT', list.length, 'products,', counts.images, 'images');
  console.log('counts', JSON.stringify(counts));
  if (flags.length) {
    console.log(`\nCUTOUT WORTH A LOOK (${flags.length}):`);
    flags.slice(0, 20).forEach((s) => console.log('  ', s));
  }
}
