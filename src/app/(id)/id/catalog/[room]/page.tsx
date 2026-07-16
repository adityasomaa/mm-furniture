import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { RoomPage } from '@/components/pages/RoomPage';
import { pageMeta } from '@/lib/meta';
import { catalog, ui } from '@/lib/content';
import { JsonLd } from '@/components/JsonLd';
import { organizationNode, breadcrumbNode, roomListNode } from '@/lib/schema';
import { ROOMS, roomBySlug, productsInRoom } from '@/lib/catalog';

/** Six rooms, all known at build time. Nothing else is a valid room. */
export const dynamicParams = false;

export function generateStaticParams() {
  return ROOMS.map((room) => ({ room }));
}

type Props = { params: Promise<{ room: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { room: slug } = await params;
  const room = roomBySlug(slug);
  if (!room) return {};
  const items = productsInRoom(slug);
  const label = room.label.id;

  return pageMeta({
    locale: 'id',
    path: `catalog/${slug}`,
    title: `Furnitur ${label} — ${items.length} Produk | MM Furniture Bali`,
    description: `${room.blurb.id} ${`${items.length} produk, lengkap dengan bahan dan ukuran aslinya. Dikerjakan di workshop kami sendiri di Denpasar, Bali. Melayani ukuran custom.`}`,
  });
}

export default async function Page({ params }: Props) {
  const { room: slug } = await params;
  const room = roomBySlug(slug);
  if (!room) notFound();

  return (
    <>
      <JsonLd
        nodes={[
          organizationNode(),
          roomListNode('id', slug, room.label.id),
          breadcrumbNode([
            { name: ui.home.id, path: '/id' },
            { name: catalog.title.id, path: '/id/catalog' },
            { name: room.label.id, path: `/id/catalog/${slug}` },
          ]),
        ]}
      />
      <RoomPage locale="id" slug={slug} />
    </>
  );
}
