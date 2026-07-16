import type { Metadata } from 'next';
import { BlogIndexPage } from '@/components/pages/BlogPages';
import { pageMeta } from '@/lib/meta';
import { JsonLd } from '@/components/JsonLd';
import { organizationNode, websiteNode, breadcrumbNode } from '@/lib/schema';

export const metadata: Metadata = pageMeta({
  locale: 'en',
  path: 'blog',
  title: 'Notes from the Workshop — MM Furniture Globalindo Blog, Bali',
  description: 'Notes from the MM Furniture workshop in Denpasar: choosing timber for a Bali climate, how custom orders work, and how to look after timber and rattan.',
});

export default function Page() {
  return (
    <>
      <JsonLd
        nodes={[
          organizationNode(),
          websiteNode('en'),
          breadcrumbNode([
            { name: 'Home', path: '/' },
            { name: 'Blog', path: '/blog' },
          ]),
        ]}
      />
      <BlogIndexPage locale="en" />
    </>
  );
}
