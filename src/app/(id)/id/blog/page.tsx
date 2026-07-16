import type { Metadata } from 'next';
import { BlogIndexPage } from '@/components/pages/BlogPages';
import { pageMeta } from '@/lib/meta';
import { JsonLd } from '@/components/JsonLd';
import { organizationNode, websiteNode, breadcrumbNode } from '@/lib/schema';

export const metadata: Metadata = pageMeta({
  locale: 'id',
  path: 'blog',
  title: 'Catatan dari Workshop — Blog MM Furniture Globalindo, Bali',
  description: 'Catatan dari workshop MM Furniture di Denpasar: memilih kayu untuk iklim Bali, proses pesanan custom, dan cara merawat furnitur kayu dan rotan.',
});

export default function Page() {
  return (
    <>
      <JsonLd
        nodes={[
          organizationNode(),
          websiteNode('id'),
          breadcrumbNode([
            { name: 'Beranda', path: '/id' },
            { name: 'Blog', path: '/id/blog' },
          ]),
        ]}
      />
      <BlogIndexPage locale="id" />
    </>
  );
}
