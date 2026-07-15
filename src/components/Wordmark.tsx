import { company } from '@/lib/site';

/**
 * The monogram is the company's own mark, vector-traced from the 1080px logo master.
 * Masked rather than inlined so the 12KB of path data is fetched and cached once instead
 * of duplicated into every page's HTML, and so it still inherits `currentColor` (which
 * is what lets the header invert it against dark sections).
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
 * Mark plus name. Set at weight 400 with open tracking rather than the previous heavy
 * expanded cut: the brief asked for lighter type, and a wordmark is the one place where
 * a heavy weight is most tempting and least necessary.
 */
export function Wordmark({ className = '' }: { className?: string }) {
  return (
    <span className={`flex items-center gap-2.5 ${className}`}>
      <Monogram className="aspect-square h-full" />
      <span className="flex flex-col justify-center leading-none">
        <span className="text-[0.72em] font-medium leading-none tracking-[0.06em]">
          {company.short.toUpperCase()}
        </span>
        <span className="mt-[0.3em] text-[0.3em] font-medium uppercase leading-none tracking-[0.3em] opacity-60">
          Globalindo
        </span>
      </span>
      <span className="sr-only">{company.name}</span>
    </span>
  );
}
