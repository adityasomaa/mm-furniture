import counts from '@/data/counts.json';

/**
 * Per-room product counts, for client components.
 *
 * This exists solely to keep `@/lib/catalog` out of the browser bundle. That module
 * imports the full 227-product manifest (names, descriptions, and 767 shots each with a
 * blur placeholder), which is fine on the server and absurd to ship to a phone just so
 * the header dropdown can print "96" next to Ruang Makan. This file is a handful of
 * integers written by `scripts/build-catalog.mjs --merge`.
 *
 * Server components should import from `@/lib/catalog` instead: it is the real source,
 * and it cannot drift from the products it counts.
 */
export const roomCounts = counts as Record<string, number> & { total: number; images: number };

export const countFor = (room: string) => roomCounts[room] ?? 0;

export const totalProductCount = () => roomCounts.total;

export const totalImageCount = () => roomCounts.images;
