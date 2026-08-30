import { siteApp } from '@/data/site.server';
import { WebPage } from 'contextual-ui/server';
import { SchemaClient } from './SchemaClient';

export default async function SchemaPage() {
  const handler = siteApp.createGraphHandler({
    includeAll: true,
    graphOptions: {
      flatten: true,
      dedupeStrategy: 'merge',
    },
  });

  const response = await handler.GET(new Request('http://localhost/api/graph.json'));
  const graphJson = await response.json();

  const schemaSourceCode = `import {
  defineSchema,
  organizationRegistry,
  websiteRegistry,
  webpageRegistry,
  navbarRegistry,
  faqRegistry,
  footerRegistry,
} from 'contextual-ui/server';
import { z } from 'zod';

export const siteSchema = defineSchema({
  organization: organizationRegistry(),
  website: websiteRegistry(),
  webpage: webpageRegistry(),
  navbar: navbarRegistry(),
  faq: faqRegistry(),
  footer: footerRegistry(),
  announcement: {
    schema: z.object({
      enabled: z.boolean(),
      message: z.string().describe('Announcement Banner Text'),
    }),
  },
});`;

  return (
    <WebPage app={siteApp} id="schema">
      <SchemaClient schemaSource={schemaSourceCode} graphJson={graphJson} />
    </WebPage>
  );
}
