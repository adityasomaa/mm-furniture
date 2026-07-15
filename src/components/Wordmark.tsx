import { company } from '@/lib/site';

/**
 * The monogram is the company's own mark, vector-traced from the 1080px logo master
 * (see DESIGN.md > Identity preservation). It is masked rather than inlined so the
 * 12KB path data is fetched and cached exactly once instead of being duplicated into
 * the HTML of every page, and so it still inherits `currentColor`.
 */
export function Monogram({ className = '' }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={`inline-block bg-current ${className}`}
      style={{
        WebkitMaskImage: 'url(/brand/monogram.svg)',
        maskImage: 'url(/brand/monogram.svg)',
        WebkitMaskSize: 'contain',
        maskSize: 'contain',
        WebkitMaskRepeat: 'no-repeat',
        maskRepeat: 'no-repeat',
        WebkitMaskPosition: 'center',
        maskPosition: 'center',
      }}
    />
  );
}

/**
 * Mark plus name. The legacy wordmark was set in a thin outlined face that fell apart
 * below ~200px wide; this sets the name in the site's own display cut instead, which
 * keeps the mark intact and makes the lockup legible at header size.
 */
export function Wordmark({ className = '' }: { className?: string }) {
  return (
    <span className={`flex items-center gap-2.5 ${className}`}>
      <Monogram className="aspect-square h-full" />
      <span className="flex flex-col justify-center leading-none">
        <span
          className="stencil text-[0.95em] leading-none tracking-[0.02em]"
          style={{ fontVariationSettings: "'wdth' 125" }}
        >
          {company.short.toUpperCase()}
        </span>
        <span className="mt-[0.22em] text-[0.34em] font-semibold uppercase leading-none tracking-[0.24em] opacity-70">
          Globalindo
        </span>
      </span>
      <span className="sr-only">{company.name}</span>
    </span>
  );
}
