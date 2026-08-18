import './globals.css';
import { siteConnector } from '@/data/site.server';
import { CustomNavbar } from '@/components/Navbar';

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const data = await siteConnector.fetchData();

  return (
    <html lang="en" className="h-full">
      <body className="h-full bg-slate-50 font-sans text-slate-900 selection:bg-blue-500 selection:text-white">
        <CustomNavbar data={data} />
        {children}
      </body>
    </html>
  );
}


