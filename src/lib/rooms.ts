import type { Locale } from './site';

/**
 * The room taxonomy: names only, no product data.
 *
 * Split out of `@/lib/catalog` on purpose. The header, the footer and the enquiry sheet
 * all need the list of rooms, and all three are client components; importing them from
 * `catalog.ts` would pull the entire 227-product manifest into the browser bundle,
 * because a bundler takes the whole module, not the one export you named. This file has
 * no such dependency, so it costs a few hundred bytes wherever it lands.
 *
 * Rooms, not types. The owner chose spatial browsing (as Warisan does) over type-based
 * collections (as DIDU does), and the spreadsheet's own Kategori column is already
 * spatial, so the data and the navigation agree.
 */

export const ROOMS = ['ruang-tamu', 'ruang-makan', 'kamar-tidur', 'bar', 'outdoor', 'vanity'] as const;
export type RoomSlug = (typeof ROOMS)[number];

/**
 * Room labels.
 *
 * The Indonesian side is the owner's own wording from the spreadsheet. The English is a
 * translation of the room, not of the label: "Ruang Tamu" is a living room, and calling
 * it a "Guest Room" (its literal reading, and what Warisan uses for hotel bedrooms)
 * would send an English-speaking buyer to the wrong page.
 */
export const rooms: { slug: RoomSlug; label: Record<Locale, string>; blurb: Record<Locale, string> }[] = [
  {
    slug: 'ruang-tamu',
    label: { id: 'Ruang Tamu', en: 'Living Room' },
    blurb: {
      id: 'Sofa, kursi santai, meja tamu, dan partisi untuk ruang berkumpul.',
      en: 'Sofas, lounge chairs, coffee tables and dividers for the room people gather in.',
    },
  },
  {
    slug: 'ruang-makan',
    label: { id: 'Ruang Makan', en: 'Dining Room' },
    blurb: {
      id: 'Meja makan, kursi makan, dan buffet penyimpanan.',
      en: 'Dining tables, dining chairs, and buffet storage.',
    },
  },
  {
    slug: 'kamar-tidur',
    label: { id: 'Kamar Tidur', en: 'Bedroom' },
    blurb: {
      id: 'Dipan, nakas, lemari, meja rias, dan bench kamar.',
      en: 'Bed frames, bedside tables, wardrobes, dressing tables and benches.',
    },
  },
  {
    slug: 'bar',
    label: { id: 'Bar', en: 'Bar' },
    blurb: {
      id: 'Kursi bar dan meja bar untuk kafe, restoran, dan pantry rumah.',
      en: 'Bar stools and bar tables for cafes, restaurants and home pantries.',
    },
  },
  {
    slug: 'outdoor',
    label: { id: 'Outdoor', en: 'Outdoor' },
    blurb: {
      id: 'Sunbed, meja payung, dan furnitur teras.',
      en: 'Sunbeds, parasol tables and terrace furniture.',
    },
  },
  {
    slug: 'vanity',
    label: { id: 'Vanity', en: 'Vanity' },
    blurb: {
      id: 'Rak handuk dan perlengkapan kamar mandi.',
      en: 'Towel racks and bathroom fittings.',
    },
  },
];

export const roomBySlug = (slug: string) => rooms.find((r) => r.slug === slug);
