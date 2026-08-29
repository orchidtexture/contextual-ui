import type { Metadata } from 'next';
import './globals.css';
import { siteApp } from '@/data/site.server';
import { ContextualSite } from 'contextual-ui';
import { CustomNavbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Contextual UI Starter Kit',
  description: 'Headless UI components with built-in Agentic AI infrastructure and Schema.org SEO.',
  icons: {
    icon: '/images/onigiri_logo.svg',
    shortcut: '/images/onigiri_logo.svg',
    apple: '/images/onigiri_logo.svg',
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const data = await siteApp.fetchData();

  return (
    <html lang="en" className="h-full">
      <body className="h-full flex flex-col min-h-screen">
        <ContextualSite
          data={data}
          options={{ disableJsonLdScript: true }}
          className="min-h-full flex flex-col flex-1"
        >
          <CustomNavbar />
          <div className="flex-1">{children}</div>
          <Footer />
        </ContextualSite>
      </body>
    </html>
  );
}


