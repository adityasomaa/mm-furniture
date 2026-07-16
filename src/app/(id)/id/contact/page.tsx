import type { Metadata } from 'next';
import { ContactPage } from '@/components/pages/ContactPage';
import { pageMeta } from '@/lib/meta';
import { contact, ui } from '@/lib/content';
import { JsonLd } from '@/components/JsonLd';
import { organizationNode, placeNodes, breadcrumbNode } from '@/lib/schema';

export const metadata: Metadata = pageMeta({
  locale: 'id',
  path: 'contact',
  title: contact.metaTitle.id,
  description: contact.metaDescription.id,
});

export default function Page() {
  return (
    <>
      <JsonLd
        nodes={[
          organizationNode(),
          ...placeNodes(),
          breadcrumbNode([
            { name: ui.home.id, path: '/id' },
            { name: 'Kontak', path: '/id/contact' },
          ]),
        ]}
      />
      <ContactPage locale="id" />
    </>
  );
}
