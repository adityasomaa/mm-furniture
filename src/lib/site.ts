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

export const LOCALES = ['id', 'en'] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = 'id';

export const company = {
  name: 'MM Furniture Globalindo',
  altName: 'MM Furniture Indonesia',
  short: 'MM Furniture',
  legalName: 'MM Furniture Globalindo',
  tagline: { id: 'Kualitas Ekspor, Harga Bersahabat', en: 'Export Quality, Affordable Price' },
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

/** Ordered as the legacy navigation ordered them. Slugs match legacy URLs exactly. */
export const categories = [
  { slug: 'sofa', id: 'Sofa', en: 'Sofas' },
  { slug: 'kursi', id: 'Kursi', en: 'Chairs' },
  { slug: 'meja', id: 'Meja', en: 'Tables' },
  { slug: 'set-meja', id: 'Set Meja', en: 'Table Sets' },
  { slug: 'desk', id: 'Desk', en: 'Desks' },
  { slug: 'bed', id: 'Bed', en: 'Beds' },
  { slug: 'almari', id: 'Rak & Almari', en: 'Shelving & Storage' },
] as const;

export type CategorySlug = (typeof categories)[number]['slug'];

export const categoryBySlug = (slug: string) => categories.find((c) => c.slug === slug);

export const waLink = (waNumber: string, message: string) =>
  `https://wa.me/${waNumber}?text=${encodeURIComponent(message)}`;

/** Canonical path for a route in a given locale. Indonesian lives at the root, matching
 *  the legacy install, so existing indexed URLs keep working without a redirect hop. */
export const localePath = (locale: Locale, path = '') => {
  const clean = path.replace(/^\/+/, '');
  const base = locale === 'en' ? '/en' : '';
  return clean ? `${base}/${clean}` : base || '/';
};

export const absoluteUrl = (path: string) => new URL(path, SITE_URL).toString();
