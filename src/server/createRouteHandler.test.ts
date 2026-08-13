import { defineContext } from '../registry/defineContext';
import { createRouteHandler } from './createRouteHandler';
import { z } from 'zod';

const TestSchema = z.object({
  message: z.string(),
});

const context = defineContext({
  test: {
    schema: TestSchema,
    data: { message: 'Hello AI Agent' },
  },
});

const handler = createRouteHandler(context);

async function testRouteHandler() {
  const req = new Request('http://localhost/contextual/api');
  const res = await handler.GET(req);
  
  console.log('Response Status:', res.status);
  console.log('Response Headers:', Object.fromEntries(res.headers.entries()));
  const json = await res.json();
  console.log('Response JSON:', json);
}

testRouteHandler();
