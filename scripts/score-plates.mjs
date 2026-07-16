import { readFile } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

/**
 * Ranks catalogue plates by how much studio backdrop the key failed to remove.
 *
 * The backdrop key (lib-cutout.mjs) floods inward from the border and cannot reach
 * backdrop that is fully enclosed by the subject: the triangle between a chair's back
 * and its seat, the gap under a table apron, the space inside a handle. Those survive as
 * opaque near-white islands. On a catalogue tile sitting on white they are invisible. On
 * the hero, where plates sit on a tinted panel and move, they read as torn paper.
 *
 * So this measures it instead of guessing. For each plate it counts pixels that are both
 * opaque and near-white, as a share of opaque pixels, and prints the ranking per room.
 * `HERO_PICKS` in src/lib/catalog.ts is chosen off this list. Re-run it after any change
 * to the cutout pipeline:
 *
 *   node scripts/score-plates.mjs
 *   node scripts/score-plates.mjs --room ruang-tamu --top 15
 *   node scripts/score-plates.mjs --match '^sofa' --top 5
 *
 * Note the score is a proxy, not a verdict: a white-upholstered sofa scores high while
 * being perfectly keyed, because its cushions genuinely are near-white. Read the top of
 * each room's list, then look at the plate.
 */

const ROOT = path.resolve(import.meta.dirname, '..');
const WHITE = 244; // below this, no one would mistake it for the backdrop
const arg = (name) => {
  const i = process.argv.indexOf(`--${name}`);
  return i === -1 ? null : process.argv[i + 1];
};

const score = async (file) => {
  const { data, info } = await sharp(file)
    .resize(320, 320, { fit: 'inside' })
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  let opaque = 0;
  let pale = 0;
  for (let i = 0; i < data.length; i += info.channels) {
    if (data[i + 3] < 250) continue; // transparent or feathered edge: not the subject
    opaque++;
    if (data[i] >= WHITE && data[i + 1] >= WHITE && data[i + 2] >= WHITE) pale++;
  }
  return opaque ? pale / opaque : 1;
};

const products = JSON.parse(await readFile(path.join(ROOT, 'src', 'data', 'products.json'), 'utf8'));
const only = arg('room');
const match = arg('match') ? new RegExp(arg('match')) : null;
const top = Number(arg('top') ?? 8);

const rows = [];
for (const p of products) {
  if (only && p.room !== only) continue;
  if (match && !match.test(p.slug)) continue;
  const shot = p.shots[0];
  if (!shot) continue;
  const widths = shot.widths ?? [];
  const w = widths.includes(900) ? 900 : widths[widths.length - 1];
  const file = path.join(ROOT, 'public', 'catalog', `${shot.slug}-${w}.webp`);
  rows.push({ room: p.room, slug: p.slug, name: p.name, pale: await score(file) });
}

const byRoom = new Map();
for (const r of rows) {
  if (!byRoom.has(r.room)) byRoom.set(r.room, []);
  byRoom.get(r.room).push(r);
}

for (const [room, list] of byRoom) {
  list.sort((a, b) => a.pale - b.pale);
  console.log(`\n${room} — cleanest ${Math.min(top, list.length)} of ${list.length}`);
  for (const r of list.slice(0, top)) {
    console.log(`  ${(r.pale * 100).toFixed(2).padStart(6)}%  ${r.slug.padEnd(42)} ${r.name}`);
  }
  const worst = list[list.length - 1];
  console.log(`  (worst: ${(worst.pale * 100).toFixed(2)}%  ${worst.slug})`);
}
