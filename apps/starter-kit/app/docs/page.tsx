import { siteApp } from '@/data/site.server';
import { WebPage } from 'contextual-ui/server';
import { DocsClient } from './DocsClient';

export default async function DocsPage() {
  const data = await siteApp.fetchData();
  return (
    <WebPage app={siteApp} id="docs">
      <DocsClient data={data} />
    </WebPage>
  );
}
