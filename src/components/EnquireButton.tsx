'use client';

import type { Locale } from '@/lib/site';
import { ui } from '@/lib/content';
import { useEnquiry } from './enquiry/EnquiryProvider';

/**
 * Thin client wrapper so server-rendered pages can place an enquiry trigger without
 * becoming client components themselves.
 */
export function EnquireButton({
  locale,
  className,
  label,
  productName,
  productCode,
}: {
  locale: Locale;
  className?: string;
  label?: string;
  /** When set, the sheet opens already knowing which piece the visitor is looking at. */
  productName?: string;
  productCode?: string;
}) {
  const { open } = useEnquiry();
  return (
    <button
      type="button"
      onClick={() => open(productName ? { name: productName, code: productCode } : undefined)}
      className={className}
    >
      {label ?? ui.enquire[locale]}
    </button>
  );
}
