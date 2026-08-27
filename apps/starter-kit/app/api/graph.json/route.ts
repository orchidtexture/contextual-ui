import { siteApp } from '@/data/site.server';

export const { GET } = siteApp.createGraphHandler({
  graphOptions: {
    baseUrl: 'https://contextual.site',
    flatten: true,
    dedupeStrategy: 'merge',
  },
});
