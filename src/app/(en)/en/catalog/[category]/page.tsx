import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { CategoryPage } from '@/components/pages/CategoryPage';
import { pageMeta } from '@/lib/meta';
import { categories, categoryBySlug, absoluteUrl } from '@/lib/site';
import { catalog, ui } from '@/lib/content';
import { photosFor, photoUrl } from '@/lib/photos';
import { JsonLd } from '@/components/JsonLd';
import { organizationNode, breadcrumbNode, categoryListNode } from '@/lib/schema';

type Props = { params: Promise<{ category: string }> };

export function generateStaticParams() {
  return categories.map((c) => ({ category: c.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params;
  const cat = categoryBySlug(category);
  if (!cat) return {};

  const photos = photosFor(category);
  const label = cat.en;

  return pageMeta({
    locale: 'en',
    path: `catalog/${category}`,
    title: `${label} — Bali Furniture Catalogue | MM Furniture Globalindo`,
    description: `${photos.length} photographs of ${label.toLowerCase()} built in the MM Furniture Globalindo workshop in Denpasar, Bali. Export quality at an affordable price. Custom sizes and finishes.`,
    images: photos[0] ? [absoluteUrl(photoUrl(photos[0], 1400))] : undefined,
  });
}

export default async function Page({ params }: Props) {
  const { category } = await params;
  const cat = categoryBySlug(category);
  if (!cat) notFound();

  return (
    <>
      <JsonLd
        nodes={[
          organizationNode(),
          breadcrumbNode([
            { name: ui.home.en, path: '/en' },
            { name: catalog.title.en, path: '/en/catalog' },
            { name: cat.en, path: `/en/catalog/${category}` },
          ]),
          categoryListNode('en', category, cat.en, photosFor(category)),
        ]}
      />
      <CategoryPage locale="en" slug={category} />
    </>
  );
}
