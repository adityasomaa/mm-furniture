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

/** All seven categories are known at build time, so every catalogue page ships as
 *  static HTML. `dynamicParams: false` turns an unknown slug into a 404 instead of an
 *  on-demand render of a page that cannot exist. */
export function generateStaticParams() {
  return categories.map((c) => ({ category: c.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params;
  const cat = categoryBySlug(category);
  if (!cat) return {};

  const photos = photosFor(category);
  const label = cat.id;

  return pageMeta({
    locale: 'id',
    path: `catalog/${category}`,
    title: `${label} — Katalog Furnitur Bali | MM Furniture Globalindo`,
    description: `${photos.length} foto ${label.toLowerCase()} buatan workshop MM Furniture Globalindo di Denpasar, Bali. Kualitas ekspor, harga bersahabat. Ukuran dan finishing bisa custom.`,
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
            { name: ui.home.id, path: '/id' },
            { name: catalog.title.id, path: '/id/catalog' },
            { name: cat.id, path: `/id/catalog/${category}` },
          ]),
          categoryListNode('id', category, cat.id, photosFor(category)),
        ]}
      />
      <CategoryPage locale="id" slug={category} />
    </>
  );
}
