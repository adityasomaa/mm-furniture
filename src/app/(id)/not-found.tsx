import { TransitionLink } from '@/components/transition/TransitionLink';
import { localePath } from '@/lib/site';
import { Section, Kicker } from '@/components/Shell';

export default function NotFound() {
  return (
    <>
      <Section tone="dark" className="!py-32">
        <Kicker onDark>404</Kicker>
        <h1 className="mt-6 max-w-[16ch] text-display text-paper">Halaman ini tidak ada.</h1>
        <p className="prose-body mt-6 text-lede text-sand">
          Mungkin alamatnya salah ketik, atau halamannya sudah pindah waktu situs ini dibangun ulang.
          Katalognya ada di bawah.
        </p>
        <div className="mt-10 flex flex-wrap gap-3">
          <TransitionLink
            href={localePath('id', 'catalog')}
            className="tag bg-brand px-7 py-4 text-espresso transition-colors duration-200 hover:bg-paper"
          >
            Lihat katalog
          </TransitionLink>
          <TransitionLink
            href={localePath('id')}
            className="tag border border-linen px-7 py-4 text-paper transition-colors duration-200 hover:border-brand hover:text-brand"
          >
            Beranda
          </TransitionLink>
        </div>
      </Section>
    </>
  );
}
