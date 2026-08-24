import './globals.css';
import { siteApp } from '@/data/site.server';
import { ContextualSite } from '@contextual-ui/core';
import { CustomNavbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const data = await siteApp.fetchData();
  const graph = await siteApp.getGraph({
    graphOptions: { baseUrl: 'https://contextual.site' },
  });

  return (
    <html lang="en" className="h-full">
      <body className="h-full flex flex-col min-h-screen">
        <ContextualSite
          data={data}
          graph={graph}
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


