import type { Metadata } from 'next';
import { LegalPage } from '@/components/pages/LegalPage';
import { pageMeta } from '@/lib/meta';
import { JsonLd } from '@/components/JsonLd';
import { organizationNode, breadcrumbNode } from '@/lib/schema';

export const metadata: Metadata = pageMeta({
  locale: 'en',
  path: 'privacy',
  title: 'Privacy Policy | MM Furniture Globalindo',
  description: 'The MM Furniture Globalindo site does not track you unless you allow it. What is stored, by whom, and how to withdraw consent.',
});

export default function Page() {
  return (
    <>
      <JsonLd
        nodes={[
          organizationNode(),
          breadcrumbNode([
            { name: 'Home', path: '/' },
            { name: 'Privacy Policy', path: '/privacy' },
          ]),
        ]}
      />
      <LegalPage locale="en" doc="privacy" />
    </>
  );
}
