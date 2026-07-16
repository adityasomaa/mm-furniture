import { localePath } from '@/lib/site';
import { Section, Kicker } from '@/components/Shell';
import { TransitionLink } from '@/components/transition/TransitionLink';

/**
 * Lives in the (en) group because English owns the domain root, which is where an
 * unmatched URL lands. A 404 under /id/* falls back to this too; that is the right
 * trade against duplicating the page for a screen nobody should reach.
 */
export default function NotFound() {
  return (
    <Section tone="dark" className="!py-32">
      <Kicker onDark>404</Kicker>
      <h1 className="mt-6 max-w-[16ch] text-display text-paper">This page does not exist.</h1>
      <p className="prose-body mt-6 text-lede text-sand">
        The address may be mistyped, or the page may have moved when the site was rebuilt. The
        catalogue is below.
      </p>
      <div className="mt-10 flex flex-wrap gap-2.5">
        <TransitionLink
          href={localePath('en', 'catalog')}
          className="tag rounded-full bg-brand px-7 py-4 text-paper transition-colors duration-300 hover:bg-paper hover:text-brand"
        >
          View the catalogue
        </TransitionLink>
        <TransitionLink
          href={localePath('en')}
          className="tag rounded-full border border-sand/30 px-7 py-4 text-paper transition-colors duration-300 hover:border-sand"
        >
          Home
        </TransitionLink>
      </div>
    </Section>
  );
}
