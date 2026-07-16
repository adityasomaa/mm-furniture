import type { Metadata } from 'next';
import { LegalPage } from '@/components/pages/LegalPage';
import { pageMeta } from '@/lib/meta';
import { JsonLd } from '@/components/JsonLd';
import { organizationNode, breadcrumbNode } from '@/lib/schema';

export const metadata: Metadata = pageMeta({
  locale: 'id',
  path: 'privacy',
  title: 'Kebijakan Privasi | MM Furniture Globalindo',
  description: 'Situs MM Furniture Globalindo tidak melacak Anda kecuali Anda mengizinkan. Penjelasan data apa yang disimpan, oleh siapa, dan bagaimana mencabutnya.',
});

export default function Page() {
  return (
    <>
      <JsonLd
        nodes={[
          organizationNode(),
          breadcrumbNode([
            { name: 'Beranda', path: '/id' },
            { name: 'Kebijakan Privasi', path: '/id/privacy' },
          ]),
        ]}
      />
      <LegalPage locale="id" doc="privacy" />
    </>
  );
}
