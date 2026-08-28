import { siteApp } from '@/data/site.server';

export const { GET } = siteApp.createGraphHandler({
  includeAll: true,
  graphOptions: {
    baseUrl: 'https://contextual.site',
    flatten: true,
    dedupeStrategy: 'merge',
  },
});
