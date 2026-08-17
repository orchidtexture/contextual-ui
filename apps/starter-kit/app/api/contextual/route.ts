import { siteSchema } from '@/data/site.schema';
import { siteConnector } from '@/data/site.server';
import { createRouteHandler } from '@contextual-ui/core/server';

export async function GET(req: Request) {
  const rawData = await siteConnector.fetchData();
  const hydrated = siteSchema.hydrate(rawData);
  const handler = createRouteHandler(hydrated);
  return handler.GET(req);
}
