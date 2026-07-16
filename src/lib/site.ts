/**
 * Single source of truth for company facts.
 *
 * Every fact here is verified against the legacy site (scraped 2026-07-15). This module
 * feeds the visible copy, the JSON-LD structured data, and llms.txt from one place, so a
 * human reader, Google, and an AI answer engine can never be told three different things.
 *
 * Do not add unverified claims (years in business, project counts, certifications,
 * export destinations, lead times). See the [UNVERIFIED] list in PRODUCT.md.
 */

export const SITE_URL = 'https://mm-furniture.vercel.app';

export const LOCALES = ['en', 'id'] as const;
export type Locale = (typeof LOCALES)[number];

/**
 * English is the default and lives at the domain root; Indonesian lives under /id.
 *
 * This inverts the legacy WordPress layout, which had Indonesian at the root and English
 * at /en. The trade was made deliberately: MM's differentiator is export, and the buyer
 * who needs convincing reads English. The cost is that the already-indexed Indonesian
 * URLs (/catalog/sofa, /about) now serve English at the same path, so those pages will
 * be re-crawled and re-assessed. /en/* is 301'd to the root so nothing that linked to
 * the English pages breaks.
 */
export const DEFAULT_LOCALE: Locale = 'en';

export const company = {
  name: 'MM Furniture Globalindo',
  altName: 'MM Furniture Indonesia',
  short: 'MM Furniture',
  legalName: 'MM Furniture Globalindo',
  tagline: { id: 'Kualitas Ekspor, Harga Bersahabat', en: 'Export Quality, Affordable Price' },
  /**
   * The one-paragraph description of the business, used by the JSON-LD organisation
   * node, llms.txt and the FAQ. Stated once so a human reader, Google and an answer
   * engine cannot be told three different things.
   *
   * The product list is drawn from the owner's actual catalogue rather than from a
   * taxonomy: every family named here (dining tables, beds, wardrobes, bar stools,
   * sunbeds) has real pieces behind it in `products.json`.
   */
  description: {
    id: 'Produsen furnitur dan kontraktor interior yang berbasis di Bali, Indonesia. MM Furniture Globalindo mengerjakan sofa, meja makan, kursi makan, dipan, nakas, lemari, buffet, kursi bar, dan furnitur outdoor di workshop miliknya sendiri di Denpasar Barat, serta menangani desain interior, pengadaan barang dan jasa, dan fit-out ruang kantor maupun komersial.',
    en: 'Furniture manufacturer and interior fit-out contractor based in Bali, Indonesia. MM Furniture Globalindo builds sofas, dining tables, dining chairs, beds, bedside tables, wardrobes, buffets, bar stools and outdoor furniture in its own workshop in Denpasar Barat, and delivers interior design, goods and service procurement, and office and commercial fit-out.',
  },
  email: 'info@mmfurniture.com',
  emailAlt: 'mmfurniture71@gmail.com',
  phones: [
    { label: '+62 878-6165-4856', e164: '+6287861654856', wa: '6287861654856' },
    { label: '+62 878-6134-0445', e164: '+6287861340445', wa: '6287861340445' },
  ],
  instagram: 'https://www.instagram.com/mmfurniture71/',
  facebook: 'https://www.facebook.com/mmfurnitureindonesia',
  legacyDomain: 'https://mmfurnitureindonesia.com',
} as const;

export const locations = [
  {
    id: 'showroom',
    role: { id: 'Showroom & Kantor', en: 'Showroom & Office' },
    street: 'Jl. Sunset Road 71',
    locality: 'Kuta',
    region: 'Badung, Bali',
    country: 'ID',
    countryName: 'Indonesia',
    // Approximate coordinates for the Sunset Road corridor, Kuta. Used for map links
    // and geo hints only, never presented as a surveyed address point.
    lat: -8.6871,
    lon: 115.1746,
    maps: 'https://maps.google.com/?q=Jl.+Sunset+Road+71,+Kuta,+Badung,+Bali',
  },
  {
    id: 'workshop',
    role: { id: 'Workshop Produksi', en: 'Production Workshop' },
    street: 'Jl. Pulau Ayu Dalam 15',
    locality: 'Denpasar Barat',
    region: 'Denpasar, Bali',
    country: 'ID',
    countryName: 'Indonesia',
    lat: -8.6705,
    lon: 115.2013,
    maps: 'https://maps.google.com/?q=Jl.+Pulau+Ayu+Dalam+15,+Denpasar+Barat,+Bali',
  },
] as const;

/**
 * The catalogue taxonomy moved to `@/lib/catalog`.
 *
 * This module used to own seven type-based categories (sofa, kursi, meja, ...) invented
 * to describe 240 anonymous scraped photos. The owner then supplied a real product
 * database whose own Kategori column is spatial, so the site browses by room and the
 * taxonomy is derived from their data rather than declared here.
 */

export const waLink = (waNumber: string, message: string) =>
  `https://wa.me/${waNumber}?text=${encodeURIComponent(message)}`;

/** Canonical path for a route in a given locale. English is the default and sits at the
 *  root; Indonesian is prefixed with /id. */
export const localePath = (locale: Locale, path = '') => {
  const clean = path.replace(/^\/+/, '');
  const base = locale === 'id' ? '/id' : '';
  return clean ? `${base}/${clean}` : base || '/';
};

export const absoluteUrl = (path: string) => new URL(path, SITE_URL).toString();
