import type { L } from './content';

/**
 * Delivered projects.
 *
 * Empty on purpose. The owner asked for a projects section and said they would send the
 * photographs later ("saya kirim foto proyek nanti", 2026-07-16), so this file is the
 * contract that turns those photographs into a section: drop the entries in, run the
 * image build, and the route, the nav link, the sitemap and the schema all switch on by
 * themselves. Nothing else needs editing.
 *
 * It stays empty until real photographs of real MM projects exist. A projects page is a
 * claim that the company delivered those rooms, so it cannot be filled with stock
 * photography, renders, or catalogue cutouts staged to look like an interior — that
 * would be inventing a delivery record, which is the one thing this site does not do
 * (see PRODUCT.md > [UNVERIFIED], where project counts and client names are listed).
 *
 * When the photographs arrive, each project needs:
 *
 *   slug      url-safe id, e.g. 'villa-canggu'
 *   title     what to call it. A client name needs the client's permission; without it,
 *             describe the job instead ("Villa in Canggu"), never invent a brand.
 *   location  as much as is true and permitted: 'Canggu, Bali'
 *   scope     what MM actually did. Not what the room contains.
 *   year      only if the owner states it. Omit rather than estimate.
 *   shots     photograph slugs, processed by scripts/build-catalog.mjs
 *
 * Project photographs are interiors, not white-backdrop plates, so they must skip the
 * cutout step in the image pipeline: keying a room would eat the walls. That branch does
 * not exist yet and is the one code change this needs beyond data.
 */
export type Project = {
  slug: string;
  title: L;
  location: string;
  scope: L;
  year?: string;
  shots: { slug: string; w: number; h: number; widths: number[]; blur: string }[];
};

export const projects: Project[] = [];

/** Whether the projects surface exists at all. Everything that would link to, list, or
 *  render a project checks this first, so an empty list ships no route, no nav entry and
 *  no sitemap URL rather than a thin page saying "coming soon". */
export const hasProjects = () => projects.length > 0;

export const projectBySlug = (slug: string) => projects.find((p) => p.slug === slug);
