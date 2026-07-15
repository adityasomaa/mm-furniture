import { serializeGraph } from '@/lib/schema';

/**
 * Emits one connected schema.org @graph per page.
 *
 * The payload is built entirely from our own constants in `site.ts`, never from user
 * input, and `serializeGraph` escapes `<` so it cannot terminate this script tag.
 */
export function JsonLd({ nodes }: { nodes: object[] }) {
  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeGraph(nodes) }} />
  );
}
