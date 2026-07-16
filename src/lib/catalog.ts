import productsJson from '@/data/products.json';
import type { Locale } from './site';
import { ROOMS, rooms, roomBySlug, type RoomSlug } from './rooms';

export { ROOMS, rooms, roomBySlug };
export type { RoomSlug };

/**
 * The catalogue.
 *
 * Replaces the old model entirely. That one was 240 anonymous photos scraped off the
 * legacy WordPress install, grouped into seven type-based buckets, with no names, sizes
 * or descriptions: the honest shape for it was an ItemList of pictures. This one is the
 * owner's own product database, so every piece has a name, a room, a material, real
 * dimensions and a description, and can carry a proper Product record.
 *
 * The room taxonomy itself lives in `./rooms` and is re-exported here, so a server
 * component can reach for one import while a client component takes the small one. See
 * that file for why the split exists.
 *
 * Still no prices. The sheet's Harga column is blank on all 227 rows, so the site says
 * nothing about price. See PRODUCT.md > [UNVERIFIED].
 */

export type Shot = {
  slug: string;
  w: number;
  h: number;
  widths: number[];
  blur: string;
};

export type Product = {
  id: string;
  slug: string;
  name: string;
  room: RoomSlug;
  material: string | null;
  /** Centimetres. `null` where the owner left the cell blank (6 of 227). */
  dim: { l: number; w: number; h: number } | null;
  desc: string | null;
  shots: Shot[];
};

export const products = productsJson as Product[];

export const productsInRoom = (room: string) => products.filter((p) => p.room === room);

export const productBySlug = (slug: string) => products.find((p) => p.slug === slug);

export const roomCount = (room: string) => productsInRoom(room).length;

export const totalProducts = () => products.length;

/** Cover shot for a room tile: the first product's first angle. */
export const roomCover = (room: string): Shot | undefined => productsInRoom(room)[0]?.shots[0];

/**
 * Path to a real derivative on disk.
 *
 * Every file in /public/catalog carries a `-<width>` suffix. Building a path by hand
 * produces a 404 that stays invisible until a link preview renders blank, so always
 * route through this. `preferred` snaps to the closest width actually generated.
 */
export const shotUrl = (shot: Shot, preferred = 900, ext: 'webp' | 'avif' = 'webp') => {
  const widths = shot.widths?.length ? shot.widths : [shot.w];
  const best = widths.reduce((a, b) => (Math.abs(b - preferred) < Math.abs(a - preferred) ? b : a));
  return `/catalog/${shot.slug}-${best}.${ext}`;
};

/** "180x200x110" -> "180 x 200 x 110 cm". Null-safe: 6 products have no dimensions. */
export const formatDim = (dim: Product['dim']) =>
  dim ? `${dim.l} × ${dim.w} × ${dim.h} cm` : null;

/**
 * Canonical material names, keyed by what the owner actually typed (lowercased).
 *
 * The sheet's Bahan column is free text, and after 227 rows it has drifted the way free
 * text does: "Kayu Jatii" (a typo), "Kayu jati" in lower case, "Rope" where every other
 * row says "Tali", "Tali LUM" carrying a product code into the material name. Counting
 * the raw strings publishes all of it — the tally on the catalogue page would list the
 * owner's typo as a material we build with.
 *
 * Two calls worth naming:
 *
 * "Kayu Jati Solid" folds into "Kayu Jati". The tally answers "how many pieces use
 * teak", and solid teak is teak; keeping them apart splits one material across two rows
 * and makes both look smaller than they are.
 *
 * "Kayu" stays separate from "Kayu Jati". Three rows say only "Kayu dan Cushion", and
 * upgrading an unspecified wood to teak because most of the catalogue is teak would be
 * inventing a fact about those three pieces.
 *
 * This normalises the *tally* only. The product page prints `p.material` verbatim,
 * because that string is the owner's own record of what the piece is made of and is not
 * ours to rewrite.
 */
const MATERIAL_ALIASES: Record<string, string> = {
  'kayu jatii': 'kayu jati',
  'kayu jati solid': 'kayu jati',
  rope: 'tali',
  'tali lum': 'tali',
};

/** Bilingual labels. The sheet is Indonesian; an English buyer needs "Teak", not "Kayu
 *  Jati". Anything unmapped falls back to the owner's own wording in both languages. */
const MATERIAL_LABELS: Record<string, Record<Locale, string>> = {
  'kayu jati': { id: 'Kayu Jati', en: 'Teak' },
  cushion: { id: 'Cushion', en: 'Cushion' },
  rotan: { id: 'Rotan', en: 'Rattan' },
  besi: { id: 'Besi', en: 'Iron' },
  'kayu suar': { id: 'Kayu Suar', en: 'Suar Wood' },
  kaca: { id: 'Kaca', en: 'Glass' },
  tali: { id: 'Tali', en: 'Woven Cord' },
  kulit: { id: 'Kulit', en: 'Leather' },
  mendong: { id: 'Mendong', en: 'Mendong Grass' },
  kayu: { id: 'Kayu', en: 'Wood' },
  marmer: { id: 'Marmer', en: 'Marble' },
  resin: { id: 'Resin', en: 'Resin' },
  'kain payung': { id: 'Kain Payung', en: 'Parasol Canvas' },
};

/**
 * Materials, counted from the real data rather than asserted.
 *
 * Splits each row on the Indonesian conjunctions ("Kayu Jati, Cushion dan Rotan" is three
 * materials), normalises, then counts distinct products per material — so a row naming
 * teak twice still counts once.
 */
export const materialTally = (locale: Locale): { label: string; count: number }[] => {
  const tally = new Map<string, number>();

  for (const p of products) {
    if (!p.material) continue;
    const seen = new Set<string>();

    const add = (key: string) => {
      if (seen.has(key)) return;
      seen.add(key);
      tally.set(key, (tally.get(key) ?? 0) + 1);
    };

    for (const part of p.material.split(/,| dan /i)) {
      let cleaned = part.trim().replace(/\s+/g, ' ').toLowerCase();
      if (!cleaned) continue;

      // "Kayu Suar Kaki Besi" is a sentence, not a material: suar wood on iron legs.
      // Peel the legs off and count both, rather than inventing a material by that name.
      if (cleaned.endsWith(' kaki besi')) {
        cleaned = cleaned.slice(0, -' kaki besi'.length);
        add('besi');
      }

      add(MATERIAL_ALIASES[cleaned] ?? cleaned);
    }
  }

  return [...tally.entries()]
    .map(([key, count]) => ({
      label: MATERIAL_LABELS[key]?.[locale] ?? key.replace(/\b\w/g, (c) => c.toUpperCase()),
      count,
    }))
    .sort((a, b) => b.count - a.count);
};

/**
 * The five pieces on the home hero: one per substantial room, so the stage shows range
 * rather than five sofas.
 *
 * Named explicitly rather than taken by index. The backdrop key
 * (scripts/lib-cutout.mjs) cannot reach backdrop trapped in shadow inside a tight gap,
 * so a few plates keep small pale patches where a chair frame or a table apron encloses
 * one. Harmless on a catalogue tile against white; not harmless on the hero. These were
 * picked by scoring every candidate for leftover near-white — see
 * `scripts/score-plates.mjs`, which reprints the ranking if the images are rebuilt.
 */
export const HERO_PICKS = [
  'sofa-set-mix-cushion-1', // living room  — 0.00% leftover
  'meja-makan-jati-bulat-kaki-besi', // dining  — 0.02%
  'dipan-model-tahu', // bedroom — 0.01%
  'kursi-bar-t-1', // bar     — 0.00%
  'sunbed-set-rotan', // outdoor — 0.00%
];

export const heroShots = (): Shot[] =>
  HERO_PICKS.map((slug) => productBySlug(slug)?.shots[0]).filter((s): s is Shot => Boolean(s));
