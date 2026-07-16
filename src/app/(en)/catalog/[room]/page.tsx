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
  const label = room.label.en;

  return pageMeta({
    locale: 'en',
    path: `catalog/${slug}`,
    title: `${label} Furniture — ${items.length} Pieces | MM Furniture Bali`,
    description: `${room.blurb.en} ${`${items.length} pieces, each listed with its material and real dimensions. Built in our own workshop in Denpasar, Bali. Custom sizes welcome.`}`,
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
          roomListNode('en', slug, room.label.en),
          breadcrumbNode([
            { name: ui.home.en, path: '/' },
            { name: catalog.title.en, path: '/catalog' },
            { name: room.label.en, path: `/catalog/${slug}` },
          ]),
        ]}
      />
      <RoomPage locale="en" slug={slug} />
    </>
  );
}
