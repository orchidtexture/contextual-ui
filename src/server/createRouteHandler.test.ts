import { defineSchema, staticConnector } from '../registry/defineSchema';
import { createRouteHandler } from './createRouteHandler';
import { z } from 'zod';

const TestSchema = z.object({
  message: z.string(),
});

const siteSchema = defineSchema({
  test: {
    schema: TestSchema,
  },
});

const serverContext = siteSchema.withConnector(staticConnector({
  test: { message: 'Hello AI Agent' },
}));

const handler = createRouteHandler(serverContext);

async function testRouteHandler() {
  const req = new Request('http://localhost/contextual/api');
  const res = await handler.GET(req);
  
  console.log('Response Status:', res.status);
  console.log('Response Headers:', Object.fromEntries(res.headers.entries()));
  const json = await res.json();
  console.log('Response JSON:', json);
}

testRouteHandler();
