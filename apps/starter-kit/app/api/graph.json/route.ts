import { siteApp } from '@/data/site.server';

export const { GET } = siteApp.createGraphHandler({
  includeAll: true,
  graphOptions: {
    flatten: true,
    dedupeStrategy: 'merge',
  },
});
