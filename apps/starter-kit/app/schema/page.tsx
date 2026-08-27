import { siteApp } from '@/data/site.server';
import { SchemaClient } from './SchemaClient';

export default async function SchemaPage() {
  const handler = siteApp.createGraphHandler({
    graphOptions: {
      baseUrl: 'https://example.com',
      flatten: true,
      dedupeStrategy: 'merge',
    },
  });

  const response = await handler.GET(new Request('http://localhost/api/graph.json'));
  const graphJson = await response.json();

  const schemaSourceCode = `import { defineSchema, faqRegistry, navbarRegistry, websiteRegistry } from 'contextual-ui/server';
import { z } from 'zod';

export const siteSchema = defineSchema({
  website: websiteRegistry(),
  faq: faqRegistry(),
  navbar: navbarRegistry(),
  announcement: {
    schema: z.object({
      enabled: z.boolean(),
      message: z.string().describe('Announcement Banner Text'),
    }),
  },
});`;

  return <SchemaClient schemaSource={schemaSourceCode} graphJson={graphJson} />;
}
