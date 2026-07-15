import type { Metadata, Viewport } from 'next';
import '../globals.css';
import { RootHtml } from '@/components/RootHtml';
import { SITE_URL, company } from '@/lib/site';
import { home } from '@/lib/content';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: home.metaTitle.en,
    template: `%s | ${company.short}`,
  },
  description: home.metaDescription.en,
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
  themeColor: '#1f3236',
  colorScheme: 'light',
};

export default function EnRootLayout({ children }: { children: React.ReactNode }) {
  return <RootHtml locale="en">{children}</RootHtml>;
}
