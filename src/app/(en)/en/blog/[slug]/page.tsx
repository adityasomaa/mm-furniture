import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { BlogPostPage } from '@/components/pages/BlogPages';
import { pageMeta } from '@/lib/meta';
import { posts, postBySlug } from '@/lib/posts';
import { absoluteUrl } from '@/lib/site';
import { photosFor, photoUrl } from '@/lib/photos';
import { JsonLd } from '@/components/JsonLd';
import { organizationNode, breadcrumbNode, articleNode } from '@/lib/schema';

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return posts.map((p) => ({ slug: p.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = postBySlug(slug);
  if (!post) return {};
  const cover = photosFor(post.cover.cat)[post.cover.index] ?? photosFor(post.cover.cat)[0];
  return pageMeta({
    locale: 'en',
    path: `blog/${slug}`,
    title: post.title.en,
    description: post.excerpt.en,
    images: cover ? [absoluteUrl(photoUrl(cover, 1400))] : undefined,
  });
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  const post = postBySlug(slug);
  if (!post) notFound();

  return (
    <>
      <JsonLd
        nodes={[
          organizationNode(),
          breadcrumbNode([
            { name: 'Home', path: '/en' },
            { name: 'Blog', path: '/en/blog' },
            { name: post.title.en, path: `/en/blog/${slug}` },
          ]),
          articleNode('en', post),
        ]}
      />
      <BlogPostPage locale="en" slug={slug} />
    </>
  );
}
