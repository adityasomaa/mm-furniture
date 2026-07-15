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
}: {
  locale: Locale;
  className?: string;
  label?: string;
}) {
  const { open } = useEnquiry();
  return (
    <button type="button" onClick={open} className={className}>
      {label ?? ui.enquire[locale]}
    </button>
  );
}
