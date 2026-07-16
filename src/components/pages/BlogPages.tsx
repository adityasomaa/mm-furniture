import { notFound } from 'next/navigation';
import { localePath, type Locale } from '@/lib/site';
import { posts, postBySlug, formatDate } from '@/lib/posts';
import { productBySlug } from '@/lib/catalog';
import { Section, Kicker } from '@/components/Shell';
import { CatalogImage } from '@/components/CatalogImage';
import { TransitionLink } from '@/components/transition/TransitionLink';
import { EnquireButton } from '@/components/EnquireButton';

/** Covers are the first plate of a real catalogue product, named by slug in posts.ts. */
/**
 * Covers are the first plate of a real catalogue product, named by slug in posts.ts.
 *
 * They render contained on white, not cropped to fill. The plates are keyed cutouts with
 * a transparent surround, so `object-cover` would crop into the furniture itself and
 * leave the piece running off the edge of the card.
 */
const coverPhoto = (slug: string) => productBySlug(slug)?.shots[0];

const COVER_IMG =
  'object-contain p-6 transition-transform duration-700 ease-[cubic-bezier(0.165,0.84,0.44,1)] group-hover:scale-[1.04]';

export function BlogIndexPage({ locale }: { locale: Locale }) {
  const t =
    locale === 'id'
      ? { title: 'Catatan dari workshop', lede: 'Hal-hal yang sering ditanyakan, dijawab lebih panjang daripada muat di WhatsApp.', read: 'menit baca' }
      : { title: 'Notes from the workshop', lede: 'The things we get asked most, answered at more length than fits in a WhatsApp reply.', read: 'min read' };

  const [lead, ...rest] = posts;
  const leadCover = coverPhoto(lead.cover);

  return (
    <>
      <Section tone="dark" className="!pb-14">
        <Kicker onDark>Blog</Kicker>
        <h1 className="mt-6 max-w-[18ch] text-display text-paper">{t.title}</h1>
        <p className="prose-body mt-6 text-lede text-sand">{t.lede}</p>
      </Section>

      <Section tone="paper">
        {/* Lead post gets the wide treatment; the rest sit as a pair. */}
        <TransitionLink
          href={localePath(locale, `blog/${lead.slug}`)}
          className="group grid gap-6 overflow-hidden rounded-2xl border border-linen bg-shell transition-all duration-500 hover:border-clay/40 hover:shadow-[0_24px_60px_-30px_rgba(92,58,49,0.45)] md:grid-cols-2"
        >
          <div className="relative aspect-[4/3] overflow-hidden bg-white md:aspect-auto md:h-full">
            {leadCover && (
              <CatalogImage
                shot={leadCover}
                alt=""
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
                className={COVER_IMG}
              />
            )}
          </div>
          <div className="flex flex-col justify-center p-7 sm:p-10">
            <p className="tag text-clay">
              {formatDate(lead.date, locale)} · {lead.readMinutes} {t.read}
            </p>
            <h2 className="mt-4 text-title text-brand">{lead.title[locale]}</h2>
            <p className="mt-4 text-[0.98rem] leading-relaxed text-clay">{lead.excerpt[locale]}</p>
            <span className="tag mt-7 inline-flex items-center gap-2 text-bark transition-colors group-hover:text-brand">
              {locale === 'id' ? 'Baca' : 'Read'}
              <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1">
                →
              </span>
            </span>
          </div>
        </TransitionLink>

        <div className="mt-3 grid gap-3 md:grid-cols-2">
          {rest.map((p) => (
            <TransitionLink
              key={p.slug}
              href={localePath(locale, `blog/${p.slug}`)}
              className="group overflow-hidden rounded-2xl border border-linen bg-shell transition-all duration-500 hover:border-clay/40 hover:shadow-[0_24px_60px_-30px_rgba(92,58,49,0.45)]"
            >
              <div className="relative aspect-[16/10] overflow-hidden bg-white">
                {coverPhoto(p.cover) && (
                  <CatalogImage
                    shot={coverPhoto(p.cover)!}
                    alt=""
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className={COVER_IMG}
                  />
                )}
              </div>
              <div className="p-7">
                <p className="tag text-clay">
                  {formatDate(p.date, locale)} · {p.readMinutes} {t.read}
                </p>
                <h2 className="mt-3 text-head text-brand">{p.title[locale]}</h2>
                <p className="mt-3 text-[0.95rem] leading-relaxed text-clay">{p.excerpt[locale]}</p>
              </div>
            </TransitionLink>
          ))}
        </div>
      </Section>
    </>
  );
}

export function BlogPostPage({ locale, slug }: { locale: Locale; slug: string }) {
  const post = postBySlug(slug);
  if (!post) notFound();
  const cover = coverPhoto(post.cover);

  const t =
    locale === 'id'
      ? { read: 'menit baca', back: 'Semua catatan', cta: 'Ada yang mau ditanyakan?', ctaBody: 'Kirim ukuran atau foto referensi, kami balas dengan perkiraan harga.' }
      : { read: 'min read', back: 'All notes', cta: 'Got a question?', ctaBody: 'Send sizes or a reference photo and we will come back with a price.' };

  const others = posts.filter((p) => p.slug !== slug).slice(0, 2);

  return (
    <>
      <Section tone="dark" className="!pb-12">
        <nav aria-label="Breadcrumb">
          <ol className="tag flex flex-wrap items-center gap-2 text-sand">
            <li>
              <TransitionLink href={localePath(locale)} className="hover:text-paper">
                {locale === 'id' ? 'Beranda' : 'Home'}
              </TransitionLink>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <TransitionLink href={localePath(locale, 'blog')} className="hover:text-paper">
                Blog
              </TransitionLink>
            </li>
          </ol>
        </nav>

        <h1 className="mt-8 max-w-[22ch] text-display text-paper">{post.title[locale]}</h1>
        <p className="tag mt-6 text-sand">
          {formatDate(post.date, locale)} · {post.readMinutes} {t.read}
        </p>
      </Section>

      <Section tone="paper" className="!pt-10">
        <div className="relative aspect-[16/8] w-full overflow-hidden rounded-2xl bg-white">
          {cover && (
            <CatalogImage shot={cover} alt="" sizes="100vw" priority className="object-contain p-8" />
          )}
        </div>

        <article className="prose-body mx-auto mt-14">
          {post.body[locale].map((block, i) => {
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
                    <li key={li} className="flex gap-3 text-[1.02rem] leading-relaxed text-bark">
                      <span aria-hidden="true" className="mt-2.5 h-1 w-1 shrink-0 rounded-full bg-clay" />
                      {li}
                    </li>
                  ))}
                </ul>
              );
            }
            return (
              <p key={i} className="mt-5 text-[1.05rem] leading-[1.75] text-bark">
                {block.p}
              </p>
            );
          })}
        </article>
      </Section>

      <Section tone="shell">
        <div className="flex flex-col items-start justify-between gap-6 rounded-2xl border border-linen bg-paper p-8 sm:flex-row sm:items-center sm:p-10">
          <div>
            <h2 className="text-head text-brand">{t.cta}</h2>
            <p className="mt-2 text-[0.95rem] text-clay">{t.ctaBody}</p>
          </div>
          <EnquireButton
            locale={locale}
            className="tag shrink-0 rounded-full bg-brand px-7 py-4 text-paper transition-colors duration-300 hover:bg-espresso"
          />
        </div>

        <div className="mt-12 grid gap-3 md:grid-cols-2">
          {others.map((p) => (
            <TransitionLink
              key={p.slug}
              href={localePath(locale, `blog/${p.slug}`)}
              className="group rounded-xl border border-linen bg-paper p-7 transition-all duration-500 hover:border-clay/40"
            >
              <p className="tag text-clay">{formatDate(p.date, locale)}</p>
              <h3 className="mt-3 text-head text-brand">{p.title[locale]}</h3>
              <span className="tag mt-5 inline-flex items-center gap-2 text-bark transition-colors group-hover:text-brand">
                {locale === 'id' ? 'Baca' : 'Read'}
                <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1">
                  →
                </span>
              </span>
            </TransitionLink>
          ))}
        </div>
      </Section>
    </>
  );
}
