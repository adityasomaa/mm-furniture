import Link from 'next/link';
import { localePath } from '@/lib/site';
import { Shell, Section, Kicker } from '@/components/Shell';

export default function NotFound() {
  return (
    <Shell locale="id">
      <Section tone="ink" className="!py-32">
        <Kicker onInk>404</Kicker>
        <h1 className="stencil mt-6 max-w-[16ch] text-display text-bone">Halaman ini tidak ada.</h1>
        <p className="prose-body mt-6 text-lede text-muted-on-ink">
          Mungkin alamatnya salah ketik, atau halamannya sudah pindah waktu situs ini dibangun ulang.
          Katalognya ada di bawah.
        </p>
        <div className="mt-10 flex flex-wrap gap-3">
          <Link
            href={localePath('id', 'catalog')}
            className="tag bg-copper px-7 py-4 text-ink-deep transition-colors duration-200 hover:bg-bone"
          >
            Lihat katalog
          </Link>
          <Link
            href={localePath('id')}
            className="tag border border-ink-hair px-7 py-4 text-bone transition-colors duration-200 hover:border-copper hover:text-copper"
          >
            Beranda
          </Link>
        </div>
      </Section>
    </Shell>
  );
}
