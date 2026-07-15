import type { Metadata } from 'next';
import { AboutPage } from '@/components/pages/AboutPage';
import { pageMeta } from '@/lib/meta';
import { about, ui } from '@/lib/content';
import { JsonLd } from '@/components/JsonLd';
import { organizationNode, placeNodes, breadcrumbNode, faqNode } from '@/lib/schema';

export const metadata: Metadata = pageMeta({
  locale: 'en',
  path: 'about',
  title: about.metaTitle.en,
  description: about.metaDescription.en,
});

export default function Page() {
  return (
    <>
      <JsonLd
        nodes={[
          organizationNode(),
          ...placeNodes(),
          breadcrumbNode([
            { name: ui.home.en, path: '/en' },
            { name: 'About', path: '/en/about' },
          ]),
          faqNode('en'),
        ]}
      />
      <AboutPage locale="en" />
    </>
  );
}
