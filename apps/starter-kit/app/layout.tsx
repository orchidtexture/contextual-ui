import './globals.css';
import { siteApp } from '@/data/site.server';
import { CustomNavbar } from '@/components/Navbar';

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const data = await siteApp.fetchData();

  return (
    <html lang="en" className="h-full">
      <body className="h-ful">
        <CustomNavbar data={data} />
        {children}
      </body>
    </html>
  );
}


