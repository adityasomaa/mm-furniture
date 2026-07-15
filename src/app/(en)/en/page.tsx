import type { Metadata } from 'next';
import { HomePage } from '@/components/pages/HomePage';
import { pageMeta } from '@/lib/meta';
import { home } from '@/lib/content';
import { JsonLd } from '@/components/JsonLd';
import { organizationNode, placeNodes, websiteNode, faqNode } from '@/lib/schema';

export const metadata: Metadata = pageMeta({
  locale: 'en',
  title: home.metaTitle.en,
  description: home.metaDescription.en,
});

export default function Page() {
  return (
    <>
      <JsonLd nodes={[organizationNode(), ...placeNodes(), websiteNode('en'), faqNode('en')]} />
      <HomePage locale="en" />
    </>
  );
}
