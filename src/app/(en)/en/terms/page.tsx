import type { Metadata } from 'next';
import { LegalPage } from '@/components/pages/LegalPage';
import { pageMeta } from '@/lib/meta';
import { JsonLd } from '@/components/JsonLd';
import { organizationNode, breadcrumbNode } from '@/lib/schema';

export const metadata: Metadata = pageMeta({
  locale: 'en',
  path: 'terms',
  title: 'Legal Terms | MM Furniture Globalindo',
  description: 'Terms for using the MM Furniture Globalindo site, the status of the catalogue, copyright, and how order terms are agreed.',
});

export default function Page() {
  return (
    <>
      <JsonLd
        nodes={[
          organizationNode(),
          breadcrumbNode([
            { name: 'Home', path: '/en' },
            { name: 'Legal Terms', path: '/en/terms' },
          ]),
        ]}
      />
      <LegalPage locale="en" doc="terms" />
    </>
  );
}
