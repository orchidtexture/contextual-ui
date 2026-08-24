import './globals.css';
import { siteApp } from '@/data/site.server';
import { ContextualSite } from '@contextual-ui/core';
import { CustomNavbar } from '@/components/Navbar';

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
      <body className="h-full">
        <ContextualSite
          data={data}
          graph={graph}
          className="min-h-full"
        >
          <CustomNavbar />
          {children}
        </ContextualSite>
      </body>
    </html>
  );
}


