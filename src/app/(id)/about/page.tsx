import type { Metadata } from 'next';
import { AboutPage } from '@/components/pages/AboutPage';
import { pageMeta } from '@/lib/meta';
import { about, ui } from '@/lib/content';
import { JsonLd } from '@/components/JsonLd';
import { organizationNode, placeNodes, breadcrumbNode, faqNode } from '@/lib/schema';

export const metadata: Metadata = pageMeta({
  locale: 'id',
  path: 'about',
  title: about.metaTitle.id,
  description: about.metaDescription.id,
});

export default function Page() {
  return (
    <>
      <JsonLd
        nodes={[
          organizationNode(),
          ...placeNodes(),
          breadcrumbNode([
            { name: ui.home.id, path: '/' },
            { name: 'Tentang', path: '/about' },
          ]),
          faqNode('id'),
        ]}
      />
      <AboutPage locale="id" />
    </>
  );
}
