import { siteApp } from '@/data/site.server';
import { CMSClient } from './CMSClient';

export default async function CMSPage() {
  const data = await siteApp.fetchData();

  // Serialize the data for client components
  const serializedContext = {
    raw: data,
  };

  return <CMSClient context={serializedContext} />;
}
