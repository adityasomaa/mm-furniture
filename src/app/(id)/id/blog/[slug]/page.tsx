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
    locale: 'id',
    path: `blog/${slug}`,
    title: post.title.id,
    description: post.excerpt.id,
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
            { name: 'Beranda', path: '/id' },
            { name: 'Blog', path: '/id/blog' },
            { name: post.title.id, path: `/id/blog/${slug}` },
          ]),
          articleNode('id', post),
        ]}
      />
      <BlogPostPage locale="id" slug={slug} />
    </>
  );
}
