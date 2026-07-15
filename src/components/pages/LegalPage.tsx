import type { Locale } from '@/lib/site';
import { privacy, terms, legalUpdated, type Block } from '@/lib/legal';
import { Section, Kicker } from '@/components/Shell';

export function LegalPage({ locale, doc }: { locale: Locale; doc: 'privacy' | 'terms' }) {
  const content = (doc === 'privacy' ? privacy : terms)[locale];

  return (
    <>
      <Section tone="dark" className="!pb-14">
        <Kicker onDark>{locale === 'id' ? 'Diperbarui' : 'Updated'} {legalUpdated}</Kicker>
        <h1 className="mt-6 max-w-[16ch] text-display text-paper">{content.title}</h1>
        <p className="prose-body mt-6 text-lede text-sand">{content.lede}</p>
      </Section>

      <Section tone="paper">
        <article className="prose-body">
          {content.body.map((block: Block, i) => {
            if (block.h) {
              return (
                <h2 key={i} className="mt-12 text-head text-brand first:mt-0">
                  {block.h}
                </h2>
              );
            }
            if (block.ul) {
              return (
                <ul key={i} className="mt-5 space-y-3">
                  {block.ul.map((li) => (
                    <li key={li} className="flex gap-3 text-[1rem] leading-relaxed text-bark">
                      <span aria-hidden="true" className="mt-2.5 h-1 w-1 shrink-0 rounded-full bg-clay" />
                      {li}
                    </li>
                  ))}
                </ul>
              );
            }
            return (
              <p key={i} className="mt-4 text-[1.02rem] leading-[1.75] text-bark">
                {block.p}
              </p>
            );
          })}
        </article>
      </Section>
    </>
  );
}
