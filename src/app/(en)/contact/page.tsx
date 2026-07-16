import type { Metadata } from 'next';
import { ContactPage } from '@/components/pages/ContactPage';
import { pageMeta } from '@/lib/meta';
import { contact, ui } from '@/lib/content';
import { JsonLd } from '@/components/JsonLd';
import { organizationNode, placeNodes, breadcrumbNode } from '@/lib/schema';

export const metadata: Metadata = pageMeta({
  locale: 'en',
  path: 'contact',
  title: contact.metaTitle.en,
  description: contact.metaDescription.en,
});

export default function Page() {
  return (
    <>
      <JsonLd
        nodes={[
          organizationNode(),
          ...placeNodes(),
          breadcrumbNode([
            { name: ui.home.en, path: '/' },
            { name: 'Contact', path: '/contact' },
          ]),
        ]}
      />
      <ContactPage locale="en" />
    </>
  );
}
