import { siteApp } from '@/data/site.server';
import { WebPage } from 'contextual-ui/server';
import { DocsClient } from './DocsClient';

export const generateMetadata = () => siteApp.getMetadata('docs');

export default async function DocsPage({
  data: customData,
  app = siteApp,
}: {
  data?: any;
  app?: any;
} = {}) {
  const data = customData || (await app.fetchData());
  return await WebPage({
    app,
    id: 'docs',
    children: <DocsClient data={data} />,
  });
}
