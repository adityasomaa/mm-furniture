import type { Metadata, Viewport } from 'next';
import '../globals.css';
import { RootHtml } from '@/components/RootHtml';
import { AppChrome } from '@/components/AppChrome';
import { SiteFooter } from '@/components/SiteFooter';
import { SITE_URL, company } from '@/lib/site';
import { home } from '@/lib/content';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: home.metaTitle.id,
    template: `%s | ${company.short}`,
  },
  description: home.metaDescription.id,
  applicationName: company.name,
  authors: [{ name: company.name }],
  creator: company.name,
  publisher: company.name,
  category: 'Furniture',
  formatDetection: { telephone: true, address: true, email: true },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 },
  },
};

export const viewport: Viewport = {
  themeColor: '#fcf9f9',
  colorScheme: 'light',
};

export default function IdRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <RootHtml locale="id">
      <AppChrome locale="id" footer={<SiteFooter locale="id" />}>
        {children}
      </AppChrome>
    </RootHtml>
  );
}
