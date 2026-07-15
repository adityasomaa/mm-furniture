import type { Metadata } from 'next';
import { CatalogIndexPage } from '@/components/pages/CatalogIndexPage';
import { pageMeta } from '@/lib/meta';
import { catalog, ui } from '@/lib/content';
import { JsonLd } from '@/components/JsonLd';
import { organizationNode, websiteNode, breadcrumbNode } from '@/lib/schema';

export const metadata: Metadata = pageMeta({
  locale: 'id',
  path: 'catalog',
  title: catalog.metaTitle.id,
  description: catalog.metaDescription.id,
});

export default function Page() {
  return (
    <>
      <JsonLd
        nodes={[
          organizationNode(),
          websiteNode('id'),
          breadcrumbNode([
            { name: ui.home.id, path: '/' },
            { name: catalog.title.id, path: '/catalog' },
          ]),
        ]}
      />
      <CatalogIndexPage locale="id" />
    </>
  );
}
