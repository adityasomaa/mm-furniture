import type { Metadata } from 'next';
import { HomePage } from '@/components/pages/HomePage';
import { pageMeta } from '@/lib/meta';
import { home } from '@/lib/content';
import { JsonLd } from '@/components/JsonLd';
import { organizationNode, placeNodes, websiteNode, faqNode } from '@/lib/schema';

export const metadata: Metadata = pageMeta({
  locale: 'id',
  title: home.metaTitle.id,
  description: home.metaDescription.id,
});

export default function Page() {
  return (
    <>
      <JsonLd nodes={[organizationNode(), ...placeNodes(), websiteNode('id'), faqNode('id')]} />
      <HomePage locale="id" />
    </>
  );
}
