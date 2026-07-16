import type { Metadata } from 'next';
import { SITE_URL, company, localePath, type Locale } from './site';

/**
 * Builds page metadata with correct canonical + hreflang for both locales.
 *
 * hreflang has to be reciprocal and must include x-default, or Google ignores the
 * cluster entirely and picks a language for the user itself. `path` is the route
 * *without* a locale prefix, e.g. 'catalog/sofa'.
 */
export function pageMeta({
  locale,
  path = '',
  title,
  description,
  images,
}: {
  locale: Locale;
  path?: string;
  title: string;
  description: string;
  images?: string[];
}): Metadata {
  const idPath = localePath('id', path);
  const enPath = localePath('en', path);
  const canonical = locale === 'id' ? idPath : enPath;

  return {
    // Restated per page: a `generateMetadata` return replaces the layout's metadata
    // object rather than merging into it, so relative OG image paths would otherwise
    // resolve against localhost at build time.
    metadataBase: new URL(SITE_URL),
    title,
    description,
    alternates: {
      canonical,
      languages: {
        en: enPath,
        'id-ID': idPath,
        // English is the default surface and sits at the root.
        'x-default': enPath,
      },
    },
    openGraph: {
      type: 'website',
      siteName: company.name,
      title,
      description,
      url: new URL(canonical, SITE_URL).toString(),
      locale: locale === 'id' ? 'id_ID' : 'en_US',
      alternateLocale: locale === 'id' ? 'en_US' : 'id_ID',
      // The key is spread in only when there is a value. Declaring `images: undefined`
      // still counts as declaring it, which suppresses the opengraph-image.tsx file
      // convention and leaves the page with no social image at all.
      ...(images ? { images } : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      ...(images ? { images } : {}),
    },
  };
}
