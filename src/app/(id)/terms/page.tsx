import type { Metadata } from 'next';
import { LegalPage } from '@/components/pages/LegalPage';
import { pageMeta } from '@/lib/meta';
import { JsonLd } from '@/components/JsonLd';
import { organizationNode, breadcrumbNode } from '@/lib/schema';

export const metadata: Metadata = pageMeta({
  locale: 'id',
  path: 'terms',
  title: 'Ketentuan Hukum | MM Furniture Globalindo',
  description: 'Ketentuan pemakaian situs MM Furniture Globalindo, status katalog, hak cipta, dan bagaimana ketentuan pesanan disepakati.',
});

export default function Page() {
  return (
    <>
      <JsonLd
        nodes={[
          organizationNode(),
          breadcrumbNode([
            { name: 'Beranda', path: '/' },
            { name: 'Ketentuan Hukum', path: '/terms' },
          ]),
        ]}
      />
      <LegalPage locale="id" doc="terms" />
    </>
  );
}
