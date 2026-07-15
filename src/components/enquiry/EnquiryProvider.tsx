'use client';

import { createContext, useCallback, useContext, useState, type ReactNode } from 'react';
import type { Locale } from '@/lib/site';
import { EnquirySheet } from './EnquirySheet';

type Ctx = { open: () => void; close: () => void; isOpen: boolean };

const EnquiryCtx = createContext<Ctx | null>(null);

export const useEnquiry = () => {
  const ctx = useContext(EnquiryCtx);
  if (!ctx) throw new Error('useEnquiry must be used inside <EnquiryProvider>');
  return ctx;
};

export function EnquiryProvider({ locale, children }: { locale: Locale; children: ReactNode }) {
  const [isOpen, setOpen] = useState(false);
  const open = useCallback(() => setOpen(true), []);
  const close = useCallback(() => setOpen(false), []);

  return (
    <EnquiryCtx.Provider value={{ open, close, isOpen }}>
      {children}
      <EnquirySheet locale={locale} isOpen={isOpen} onClose={close} />
    </EnquiryCtx.Provider>
  );
}
