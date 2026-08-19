import { siteApp } from '@/data/site.server';

export const { GET } = siteApp.createGraphHandler({
  graphOptions: {
    baseUrl: 'https://example.com',
    flatten: true,
    dedupeStrategy: 'merge',
  },
});
