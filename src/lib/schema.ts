import { company, locations, categories, absoluteUrl, localePath, type Locale } from './site';
import { faq } from './content';
import { photoUrl, coverFor, type Photo } from './photos';

/**
 * Representative image for the business.
 *
 * Deliberately a real catalogue photograph, not `/opengraph-image`: Next hashes the
 * file-convention OG route (it ships as `/opengraph-image-35zcfm`), so a hardcoded
 * `/opengraph-image` in structured data is a 404. A stable, content-addressed photo of
 * actual work is both valid and a better answer to "show me this company".
 */
const businessImage = () => {
  const cover = coverFor('sofa') ?? coverFor('kursi');
  return cover ? absoluteUrl(photoUrl(cover, 1400)) : absoluteUrl('/brand/icon-512.png');
};

/**
 * JSON-LD graph builders.
 *
 * Everything here is derived from `site.ts`, so the structured data can never claim
 * something the visible page does not. That consistency is the whole point: Google
 * penalises schema that disagrees with the rendered content, and AI answer engines
 * lift whichever version they find first.
 *
 * One connected @graph per page beats several loose blobs, because @id references let
 * a parser resolve "this product is sold by that business at that address" instead of
 * guessing.
 */

const ORG_ID = absoluteUrl('/#organization');
const SITE_ID = absoluteUrl('/#website');
const SHOWROOM_ID = absoluteUrl('/#showroom');
const WORKSHOP_ID = absoluteUrl('/#workshop');

const postalAddress = (loc: (typeof locations)[number]) => ({
  '@type': 'PostalAddress',
  streetAddress: loc.street,
  addressLocality: loc.locality,
  addressRegion: loc.region,
  addressCountry: loc.country,
});

/** The organisation node, referenced by @id from every other node. */
export const organizationNode = () => ({
  '@type': ['Organization', 'FurnitureStore'],
  '@id': ORG_ID,
  name: company.name,
  alternateName: [company.altName, company.short],
  legalName: company.legalName,
  url: absoluteUrl('/'),
  logo: {
    '@type': 'ImageObject',
    '@id': absoluteUrl('/#logo'),
    url: absoluteUrl('/brand/monogram.svg'),
    caption: company.name,
  },
  image: businessImage(),
  slogan: company.tagline.en,
  description:
    'Furniture manufacturer and interior fit-out contractor based in Bali, Indonesia. Builds sofas, chairs, tables, table sets, desks, beds, shelving and storage in its own workshop in Denpasar Barat, and delivers interior design, procurement and commercial fit-out.',
  email: company.email,
  telephone: company.phones.map((p) => p.e164),
  address: postalAddress(locations[0]),
  location: [{ '@id': SHOWROOM_ID }, { '@id': WORKSHOP_ID }],
  sameAs: [company.instagram, company.facebook, company.legacyDomain],
  areaServed: [
    { '@type': 'AdministrativeArea', name: 'Bali' },
    { '@type': 'Country', name: 'Indonesia' },
  ],
  knowsLanguage: ['id-ID', 'en'],
  makesOffer: categories.map((c) => ({
    '@type': 'Offer',
    itemOffered: { '@type': 'Product', name: c.en, category: 'Furniture' },
  })),
});

/** Physical places. Two of them, which is itself the selling point. */
export const placeNodes = () => [
  {
    '@type': ['LocalBusiness', 'FurnitureStore'],
    '@id': SHOWROOM_ID,
    name: `${company.name} — Showroom & Office`,
    parentOrganization: { '@id': ORG_ID },
    url: absoluteUrl('/contact'),
    address: postalAddress(locations[0]),
    geo: { '@type': 'GeoCoordinates', latitude: locations[0].lat, longitude: locations[0].lon },
    telephone: company.phones[0].e164,
    email: company.email,
    hasMap: locations[0].maps,
    image: businessImage(),
    priceRange: '$$',
  },
  {
    '@type': 'Place',
    '@id': WORKSHOP_ID,
    name: `${company.name} — Production Workshop`,
    address: postalAddress(locations[1]),
    geo: { '@type': 'GeoCoordinates', latitude: locations[1].lat, longitude: locations[1].lon },
    hasMap: locations[1].maps,
  },
];

export const websiteNode = (locale: Locale) => ({
  '@type': 'WebSite',
  '@id': SITE_ID,
  url: absoluteUrl('/'),
  name: company.name,
  publisher: { '@id': ORG_ID },
  inLanguage: locale === 'id' ? 'id-ID' : 'en',
});

export const breadcrumbNode = (items: { name: string; path: string }[]) => ({
  '@type': 'BreadcrumbList',
  itemListElement: items.map((it, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    name: it.name,
    item: absoluteUrl(it.path),
  })),
});

export const faqNode = (locale: Locale) => ({
  '@type': 'FAQPage',
  '@id': absoluteUrl(`${localePath(locale)}#faq`),
  inLanguage: locale === 'id' ? 'id-ID' : 'en',
  mainEntity: faq.map((f) => ({
    '@type': 'Question',
    name: f.q[locale],
    acceptedAnswer: { '@type': 'Answer', text: f.a[locale] },
  })),
});

/**
 * A category is modelled as an ItemList of images rather than a list of Products.
 * There are no SKUs, no prices and no per-item names on the source catalogue, and
 * inventing them to satisfy Product schema would be fabricating offers. An ItemList of
 * real photographs is the honest shape.
 */
export const categoryListNode = (locale: Locale, slug: string, label: string, photos: Photo[]) => ({
  '@type': 'CollectionPage',
  '@id': absoluteUrl(`${localePath(locale, `catalog/${slug}`)}#collection`),
  name: label,
  isPartOf: { '@id': SITE_ID },
  about: { '@id': ORG_ID },
  inLanguage: locale === 'id' ? 'id-ID' : 'en',
  mainEntity: {
    '@type': 'ItemList',
    numberOfItems: photos.length,
    itemListElement: photos.slice(0, 40).map((p, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      item: {
        '@type': 'Product',
        name: `${label} — ${company.short} #${String(i + 1).padStart(3, '0')}`,
        category: label,
        image: absoluteUrl(photoUrl(p, 1400)),
        brand: { '@id': ORG_ID },
        manufacturer: { '@id': ORG_ID },
        isCustomizable: true,
      },
    })),
  },
});

/** Serialises one connected graph. `<` is escaped so the payload can never break out
 *  of the surrounding <script> tag. Rendered by `@/components/JsonLd`. */
export const serializeGraph = (nodes: object[]) =>
  JSON.stringify({ '@context': 'https://schema.org', '@graph': nodes }).replace(/</g, '\\u003c');
