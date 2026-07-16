import { company, locations, absoluteUrl, localePath, type Locale } from './site';
import { faq } from './content';
import {
  shotUrl,
  formatDim,
  rooms,
  productsInRoom,
  productBySlug,
  roomCover,
  type Product,
} from './catalog';

/**
 * Representative image for the business.
 *
 * Deliberately a real catalogue photograph, not `/opengraph-image`: Next hashes the
 * file-convention OG route (it ships as `/opengraph-image-35zcfm`), so a hardcoded
 * `/opengraph-image` in structured data is a 404. A stable, content-addressed photo of
 * actual work is both valid and a better answer to "show me this company".
 */
const businessImage = () => {
  const cover = roomCover('ruang-tamu') ?? roomCover('ruang-makan');
  return cover ? absoluteUrl(shotUrl(cover, 1500)) : absoluteUrl('/brand/icon-512.png');
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
  description: company.description.en,
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
  // One offer per room rather than per product: 227 Offer nodes on every page would
  // bloat the graph, and each room page carries its own ItemList of the real thing.
  makesOffer: rooms.map((r) => ({
    '@type': 'Offer',
    itemOffered: { '@type': 'Product', name: `${r.label.en} furniture`, category: 'Furniture' },
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
 * A product node, carrying what the owner's database actually holds.
 *
 * The old catalogue could only honestly be an ItemList of photographs: 240 scraped
 * images with no names, no sizes and no descriptions, so a Product node would have been
 * inventing the product. This data has all three, so the real shape is now available.
 *
 * Still no `offers`. Price is the one column the owner left blank on all 227 rows, and
 * an Offer without a price is worth less than no Offer at all: Google reads a
 * price-less Offer as a broken listing rather than as "ask us".
 */
export const productNode = (locale: Locale, p: Product) => {
  const path = localePath(locale, `catalog/${p.room}/${p.slug}`);
  const dim = formatDim(p.dim);
  return {
    '@type': 'Product',
    '@id': absoluteUrl(`${path}#product`),
    name: p.name,
    sku: p.id,
    url: absoluteUrl(path),
    image: p.shots.map((sh) => absoluteUrl(shotUrl(sh, 1500))),
    ...(p.desc ? { description: p.desc } : {}),
    ...(p.material ? { material: p.material } : {}),
    // Verbatim from the sheet's LxWxH column, so the graph and the spec table can
    // never disagree. Six rows have no dimensions and get no properties here.
    ...(p.dim
      ? {
          depth: { '@type': 'QuantitativeValue', value: p.dim.l, unitCode: 'CMT' },
          width: { '@type': 'QuantitativeValue', value: p.dim.w, unitCode: 'CMT' },
          height: { '@type': 'QuantitativeValue', value: p.dim.h, unitCode: 'CMT' },
        }
      : {}),
    ...(dim ? { additionalProperty: { '@type': 'PropertyValue', name: 'Dimensions', value: dim } } : {}),
    category: rooms.find((r) => r.slug === p.room)?.label[locale] ?? p.room,
    brand: { '@id': ORG_ID },
    manufacturer: { '@id': ORG_ID },
    isCustomizable: true,
  };
};

/** A room page: a CollectionPage wrapping an ItemList that points at real product URLs. */
export const roomListNode = (locale: Locale, slug: string, label: string) => {
  const list = productsInRoom(slug);
  return {
    '@type': 'CollectionPage',
    '@id': absoluteUrl(`${localePath(locale, `catalog/${slug}`)}#collection`),
    name: label,
    isPartOf: { '@id': SITE_ID },
    about: { '@id': ORG_ID },
    inLanguage: locale === 'id' ? 'id-ID' : 'en',
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: list.length,
      itemListElement: list.map((p, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: p.name,
        url: absoluteUrl(localePath(locale, `catalog/${p.room}/${p.slug}`)),
      })),
    },
  };
};

/**
 * Blog post node.
 *
 * `author` and `publisher` both point at the organisation rather than a person: these
 * are workshop notes written in the company's voice, and inventing a named byline for
 * them would be fabricating a person.
 */
export const articleNode = (
  locale: Locale,
  post: {
    slug: string;
    date: string;
    title: Record<Locale, string>;
    excerpt: Record<Locale, string>;
    cover: string;
  },
) => {
  const cover = productBySlug(post.cover)?.shots[0];
  const path = localePath(locale, `blog/${post.slug}`);
  return {
    '@type': 'BlogPosting',
    '@id': absoluteUrl(`${path}#article`),
    headline: post.title[locale],
    description: post.excerpt[locale],
    datePublished: post.date,
    dateModified: post.date,
    inLanguage: locale === 'id' ? 'id-ID' : 'en',
    author: { '@id': ORG_ID },
    publisher: { '@id': ORG_ID },
    isPartOf: { '@id': SITE_ID },
    mainEntityOfPage: absoluteUrl(path),
    image: cover ? absoluteUrl(shotUrl(cover, 1500)) : businessImage(),
  };
};

/** Serialises one connected graph. `<` is escaped so the payload can never break out
 *  of the surrounding <script> tag. Rendered by `@/components/JsonLd`. */
export const serializeGraph = (nodes: object[]) =>
  JSON.stringify({ '@context': 'https://schema.org', '@graph': nodes }).replace(/</g, '\\u003c');
