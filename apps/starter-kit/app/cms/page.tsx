import { siteSchema } from '@/data/site.schema';
import { siteConnector } from '@/data/site.server';
import { CMSClient } from './CMSClient';

export default async function CMSPage() {
  const rawData = await siteConnector.fetchData();
  const hydrated = siteSchema.hydrate(rawData);

  // Serialize the hydrated context (omitting non-serializable Zod schema functions across the RSC boundary)
  const serializedContext = {
    raw: hydrated.raw,
  };

  return <CMSClient context={serializedContext} />;
}
