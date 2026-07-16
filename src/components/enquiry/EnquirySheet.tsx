'use client';

import { useEffect, useRef, useState } from 'react';
import { categories, company, waLink, type Locale } from '@/lib/site';
import { Select } from '../ui/Select';
import { Monogram } from '../Wordmark';

/**
 * Enquiry sheet.
 *
 * Submitting composes a WhatsApp message and hands off to wa.me. There is no backend
 * and no "we'll get back to you" screen, because both would be a lie: this is a static
 * site with no mail service behind it, and a form that silently discarded the enquiry
 * would be worse than no form. WhatsApp is the company's actual channel (it is the
 * number on their own site), so the form's job is to build a well-structured message
 * and get out of the way.
 *
 * A sheet rather than a modal: it does not trap the page behind a dimmed rectangle, and
 * it can be dismissed by scrolling attention away.
 */
export function EnquirySheet({
  locale,
  isOpen,
  onClose,
}: {
  locale: Locale;
  isOpen: boolean;
  onClose: () => void;
}) {
  const [category, setCategory] = useState('');
  const [kind, setKind] = useState('');
  const [name, setName] = useState('');
  const [detail, setDetail] = useState('');
  const panelRef = useRef<HTMLDivElement>(null);
  const firstFieldRef = useRef<HTMLInputElement>(null);

  const t =
    locale === 'id'
      ? {
          title: 'Ceritakan kebutuhan Anda',
          lede: 'Isi seperlunya saja. Kami akan membalas melalui WhatsApp dengan perkiraan ukuran, bahan, dan harga.',
          name: 'Nama',
          namePh: 'Nama Anda',
          category: 'Kategori',
          categoryPh: 'Pilih kategori',
          kind: 'Jenis kebutuhan',
          kindPh: 'Pilih jenis',
          detail: 'Detail',
          detailPh: 'Ukuran, bahan, jumlah, atau lokasi proyek. Sebisanya saja.',
          submit: 'Kirim melalui WhatsApp',
          note: 'Tombol ini akan membuka WhatsApp dengan pesan yang sudah tersusun. Anda masih dapat menyuntingnya sebelum mengirim.',
          close: 'Tutup',
        }
      : {
          title: 'Tell us what you need',
          lede: 'Fill in what you can. We reply on WhatsApp with sizes, materials and a price.',
          name: 'Name',
          namePh: 'Your name',
          category: 'Category',
          categoryPh: 'Choose a category',
          kind: 'Type of work',
          kindPh: 'Choose a type',
          detail: 'Details',
          detailPh: 'Sizes, materials, quantity, or the project location. Whatever you have.',
          submit: 'Send on WhatsApp',
          note: 'This opens WhatsApp with the message already written. You can still edit it before sending.',
          close: 'Close',
        };

  const kinds =
    locale === 'id'
      ? [
          { value: 'stok', label: 'Produk yang sudah ada di katalog' },
          { value: 'custom', label: 'Custom sesuai ukuran saya' },
          { value: 'interior', label: 'Proyek interior / fit-out' },
          { value: 'ekspor', label: 'Pembelian dalam jumlah besar / ekspor' },
        ]
      : [
          { value: 'stock', label: 'Something already in the catalogue' },
          { value: 'custom', label: 'Custom, to my dimensions' },
          { value: 'interior', label: 'Interior / fit-out project' },
          { value: 'export', label: 'Bulk purchase / export' },
        ];

  const catOptions = categories.map((c) => ({ value: c.slug, label: c[locale] }));

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    if (isOpen) setTimeout(() => firstFieldRef.current?.focus(), 350);
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const compose = () => {
    const catLabel = catOptions.find((c) => c.value === category)?.label;
    const kindLabel = kinds.find((k) => k.value === kind)?.label;
    const lines =
      locale === 'id'
        ? [
            `Halo MM Furniture, saya ${name || '(nama belum diisi)'}.`,
            kindLabel && `Kebutuhan: ${kindLabel}`,
            catLabel && `Kategori: ${catLabel}`,
            detail && `Detail: ${detail}`,
            '',
            'Boleh saya minta informasi ukuran, bahan, dan harganya?',
          ]
        : [
            `Hello MM Furniture, this is ${name || '(name not given)'}.`,
            kindLabel && `Looking for: ${kindLabel}`,
            catLabel && `Category: ${catLabel}`,
            detail && `Details: ${detail}`,
            '',
            'Could you send sizes, materials and a price?',
          ];
    return lines.filter(Boolean).join('\n');
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    window.open(waLink(company.phones[0].wa, compose()), '_blank', 'noopener,noreferrer');
    onClose();
  };

  return (
    <>
      <div
        onClick={onClose}
        aria-hidden="true"
        className={[
          // A real blur, not a 2px hint. The scrim's job is to take the page behind out
          // of the reading plane; at 2px the headlines behind stayed legible and competed
          // with the form.
          'fixed inset-0 z-[150] bg-espresso/55 backdrop-blur-lg transition-opacity duration-500',
          isOpen ? 'opacity-100' : 'pointer-events-none opacity-0',
        ].join(' ')}
      />

      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={t.title}
        className={[
          'fixed inset-y-0 right-0 z-[160] w-full max-w-[30rem] overflow-y-auto',
          'glass rounded-l-2xl border-l shadow-[-30px_0_80px_-30px_rgba(44,26,21,0.5)]',
          'transition-transform duration-[600ms] ease-quart',
          isOpen ? 'translate-x-0' : 'translate-x-full',
        ].join(' ')}
      >
        <div className="flex items-start justify-between gap-4 px-6 pb-2 pt-7 sm:px-8">
          <Monogram className="h-9 w-9 text-brand" />
          <button
            type="button"
            onClick={onClose}
            aria-label={t.close}
            className="grid h-10 w-10 place-items-center rounded-full border border-linen text-clay transition-colors duration-200 hover:border-brand hover:text-brand"
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
              <path d="M1 1l10 10M11 1L1 11" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <form onSubmit={submit} className="px-6 pb-10 pt-3 sm:px-8">
          <h2 className="text-title text-brand">{t.title}</h2>
          <p className="mt-3 text-[0.95rem] leading-relaxed text-clay">{t.lede}</p>

          <div className="mt-8 space-y-5">
            <div>
              <label htmlFor="enq-name" className="tag mb-2 block text-clay">
                {t.name}
              </label>
              <input
                id="enq-name"
                ref={firstFieldRef}
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t.namePh}
                className="w-full rounded-md border border-linen bg-paper px-4 py-3.5 text-[0.95rem] text-bark placeholder:text-clay/60 transition-colors duration-200 hover:border-clay/50 focus:border-brand focus:outline-none"
              />
            </div>

            <Select
              label={t.kind}
              name="kind"
              options={kinds}
              value={kind}
              onChange={setKind}
              placeholder={t.kindPh}
            />

            <Select
              label={t.category}
              name="category"
              options={catOptions}
              value={category}
              onChange={setCategory}
              placeholder={t.categoryPh}
            />

            <div>
              <label htmlFor="enq-detail" className="tag mb-2 block text-clay">
                {t.detail}
              </label>
              <textarea
                id="enq-detail"
                value={detail}
                onChange={(e) => setDetail(e.target.value)}
                placeholder={t.detailPh}
                rows={4}
                className="w-full resize-none rounded-md border border-linen bg-paper px-4 py-3.5 text-[0.95rem] text-bark placeholder:text-clay/60 transition-colors duration-200 hover:border-clay/50 focus:border-brand focus:outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            className="tag mt-7 flex w-full items-center justify-center gap-2.5 rounded-full bg-brand px-6 py-4 text-paper transition-all duration-300 hover:bg-espresso hover:shadow-[0_12px_30px_-10px_rgba(92,58,49,0.7)]"
          >
            <WhatsAppGlyph className="h-4 w-4" />
            {t.submit}
          </button>

          <p className="mt-4 text-center text-xs leading-relaxed text-clay/80">{t.note}</p>
        </form>
      </div>
    </>
  );
}

export function WhatsAppGlyph({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.46 1.32 4.96L2 22l5.25-1.38a9.9 9.9 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2zm0 18.15c-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.22 8.22 0 0 1-1.26-4.38c0-4.54 3.7-8.23 8.25-8.23 2.2 0 4.27.86 5.83 2.42a8.19 8.19 0 0 1 2.41 5.82c0 4.54-3.7 8.23-8.24 8.23zm4.52-6.16c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.13-.16.24-.64.8-.78.97-.15.16-.29.18-.54.06-.25-.13-1.05-.39-1.99-1.23-.74-.66-1.24-1.47-1.38-1.72-.15-.25-.02-.38.11-.5.11-.11.25-.29.37-.44.13-.15.17-.25.25-.41.09-.17.04-.31-.02-.44-.06-.12-.56-1.35-.77-1.84-.2-.49-.4-.42-.56-.43-.14 0-.31-.01-.47-.01-.17 0-.44.06-.66.31-.23.25-.87.85-.87 2.07 0 1.22.89 2.4 1.01 2.56.13.17 1.75 2.67 4.23 3.74.59.26 1.05.41 1.41.52.59.19 1.13.16 1.56.1.47-.07 1.47-.6 1.67-1.18.21-.58.21-1.07.15-1.18-.06-.11-.23-.17-.48-.29z" />
    </svg>
  );
}
