import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ProductPage } from '@/components/pages/ProductPage';
import { pageMeta } from '@/lib/meta';
import { catalog, ui } from '@/lib/content';
import { JsonLd } from '@/components/JsonLd';
import { organizationNode, breadcrumbNode, productNode } from '@/lib/schema';
import { products, productBySlug, roomBySlug, shotUrl, formatDim } from '@/lib/catalog';
import { absoluteUrl } from '@/lib/site';

export const dynamicParams = false;

export function generateStaticParams() {
  return products.map((p) => ({ room: p.room, product: p.slug }));
}

type Props = { params: Promise<{ room: string; product: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { room, product } = await params;
  const p = productBySlug(product);
  if (!p || p.room !== room) return {};
  const label = roomBySlug(p.room)?.label.en ?? p.room;

  // The description is assembled from what the owner actually recorded rather than
  // padded to a target length: their own sentence, the material, the real size. Six
  // products have no dimensions and simply say less.
  const parts = [p.desc, p.material && `Material: ${p.material}.`, formatDim(p.dim) && `Size: ${formatDim(p.dim)}.`, 'Built to order in our Denpasar workshop, Bali.'];

  return pageMeta({
    locale: 'en',
    path: `catalog/${p.room}/${p.slug}`,
    title: `${p.name} — ${label} | MM Furniture Bali`,
    description: parts.filter(Boolean).join(' '),
    images: [absoluteUrl(shotUrl(p.shots[0], 1500))],
  });
}

export default async function Page({ params }: Props) {
  const { room, product } = await params;
  const p = productBySlug(product);
  if (!p || p.room !== room) notFound();
  const label = roomBySlug(p.room)?.label.en ?? p.room;

  return (
    <>
      <JsonLd
        nodes={[
          organizationNode(),
          productNode('en', p),
          breadcrumbNode([
            { name: ui.home.en, path: '/' },
            { name: catalog.title.en, path: '/catalog' },
            { name: label, path: `/catalog/${p.room}` },
            { name: p.name, path: `/catalog/${p.room}/${p.slug}` },
          ]),
        ]}
      />
      <ProductPage locale="en" slug={p.slug} />
    </>
  );
}
