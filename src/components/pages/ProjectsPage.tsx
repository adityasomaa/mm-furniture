import { notFound } from 'next/navigation';
import type { Locale } from '@/lib/site';
import { projects } from '@/lib/projects';
import { projectsCopy } from '@/lib/content';
import { Section, Kicker } from '@/components/Shell';
import { CatalogImage } from '@/components/CatalogImage';
import { EnquireButton } from '@/components/EnquireButton';

/**
 * Delivered projects.
 *
 * 404s when the list is empty rather than rendering an empty state. There is no such
 * thing as a projects page with no projects on it: it would be a page whose only content
 * is the admission that the page has no content, and it would land in the index as a
 * thin page competing with the catalogue. The route only exists once the work does.
 */
export function ProjectsPage({ locale }: { locale: Locale }) {
  if (projects.length === 0) notFound();

  return (
    <>
      <Section tone="dark" className="!pb-14 !pt-[calc(76px+3.5rem)]">
        <div className="grid gap-6 lg:grid-cols-[1fr_1fr] lg:items-end lg:gap-20">
          <div>
            <Kicker onDark>{projectsCopy.kicker[locale]}</Kicker>
            <h1 className="mt-6 text-display text-paper">{projectsCopy.title[locale]}</h1>
          </div>
          <p className="prose-body text-lede text-sand">{projectsCopy.lede[locale]}</p>
        </div>
      </Section>

      <Section tone="paper">
        <ul className="grid gap-10 lg:grid-cols-2 lg:gap-x-6">
          {projects.map((p, i) => (
            <li key={p.slug}>
              <article>
                <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-shell">
                  {p.shots[0] && (
                    <CatalogImage
                      shot={p.shots[0]}
                      alt={projectsCopy.photoAlt[locale](p.title[locale], p.location)}
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      priority={i < 2}
                      // Interiors, not keyed plates: these fill the frame.
                      className="object-cover"
                    />
                  )}
                </div>

                <div className="mt-5">
                  <h2 className="text-title text-brand">{p.title[locale]}</h2>
                  <p className="tag mt-2 text-clay">
                    {[p.location, p.year].filter(Boolean).join(' · ')}
                  </p>
                  <p className="prose-body mt-3 text-[0.95rem] leading-relaxed text-clay">
                    {p.scope[locale]}
                  </p>
                </div>
              </article>
            </li>
          ))}
        </ul>
      </Section>

      <Section tone="shell">
        <div className="flex flex-col items-start justify-between gap-6 rounded-2xl border border-linen bg-paper p-8 sm:flex-row sm:items-center sm:p-10">
          <div>
            <h2 className="text-head text-brand">{projectsCopy.ctaTitle[locale]}</h2>
            <p className="prose-body mt-2 text-[0.95rem] text-clay">{projectsCopy.ctaBody[locale]}</p>
          </div>
          <EnquireButton
            locale={locale}
            className="tag shrink-0 rounded-full bg-brand px-7 py-4 text-paper transition-colors duration-300 hover:bg-espresso"
          />
        </div>
      </Section>
    </>
  );
}
