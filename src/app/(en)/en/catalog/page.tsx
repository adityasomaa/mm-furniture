import type { Metadata } from 'next';
import { CatalogIndexPage } from '@/components/pages/CatalogIndexPage';
import { pageMeta } from '@/lib/meta';
import { catalog, ui } from '@/lib/content';
import { JsonLd } from '@/components/JsonLd';
import { organizationNode, websiteNode, breadcrumbNode } from '@/lib/schema';

export const metadata: Metadata = pageMeta({
  locale: 'en',
  path: 'catalog',
  title: catalog.metaTitle.en,
  description: catalog.metaDescription.en,
});

export default function Page() {
  return (
    <>
      <JsonLd
        nodes={[
          organizationNode(),
          websiteNode('en'),
          breadcrumbNode([
            { name: ui.home.en, path: '/en' },
            { name: catalog.title.en, path: '/en/catalog' },
          ]),
        ]}
      />
      <CatalogIndexPage locale="en" />
    </>
  );
}
