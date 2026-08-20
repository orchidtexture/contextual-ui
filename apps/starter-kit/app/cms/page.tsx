import { siteApp } from '@/data/site.server';
import { CMSClient } from './CMSClient';

export default async function CMSPage() {
  const data = await siteApp.fetchData();

  // Serialize the data for client components
  const serializedContext = {
    raw: data,
  };

  return (
    <div className="pt-16 min-h-screen">
      <CMSClient context={serializedContext} />
    </div>
  );
}
