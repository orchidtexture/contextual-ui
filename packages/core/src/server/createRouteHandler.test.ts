import { describe, it, expect } from 'vitest';
import { defineSchema } from '../registry/defineSchema';
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

const mockConnector = {
  async fetchData() {
    return {
      test: { message: 'Hello AI Agent' }
    };
  }
};

describe('createRouteHandler', () => {
  it('handles GET requests and returns agent data as JSON', async () => {
    const rawData = await mockConnector.fetchData();
    const hydrated = siteSchema.hydrate(rawData);
    const handler = createRouteHandler(hydrated);

    const req = new Request('http://localhost/contextual/api');
    const res = await handler.GET(req);
    
    expect(res.status).toBe(200);
    expect(res.headers.get('content-type')).toBe('application/json');
    const json = await res.json();
    expect(json).toEqual({ test: { message: 'Hello AI Agent' } });
  });
});
