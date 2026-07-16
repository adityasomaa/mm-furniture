'use client';

import { createContext, useCallback, useContext, useState, type ReactNode } from 'react';
import type { Locale } from '@/lib/site';
import { EnquirySheet } from './EnquirySheet';

/** The piece a visitor was looking at when they opened the sheet, if any. */
export type EnquirySubject = { name: string; code?: string };

type Ctx = {
  open: (subject?: EnquirySubject) => void;
  close: () => void;
  isOpen: boolean;
  subject?: EnquirySubject;
};

const EnquiryCtx = createContext<Ctx | null>(null);

export const useEnquiry = () => {
  const ctx = useContext(EnquiryCtx);
  if (!ctx) throw new Error('useEnquiry must be used inside <EnquiryProvider>');
  return ctx;
};

export function EnquiryProvider({ locale, children }: { locale: Locale; children: ReactNode }) {
  const [isOpen, setOpen] = useState(false);
  const [subject, setSubject] = useState<EnquirySubject | undefined>();

  const open = useCallback((s?: EnquirySubject) => {
    setSubject(s);
    setOpen(true);
  }, []);
  const close = useCallback(() => setOpen(false), []);

  return (
    <EnquiryCtx.Provider value={{ open, close, isOpen, subject }}>
      {children}
      <EnquirySheet locale={locale} isOpen={isOpen} onClose={close} subject={subject} />
    </EnquiryCtx.Provider>
  );
}
