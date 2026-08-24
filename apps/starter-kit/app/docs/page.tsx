import { siteApp } from '@/data/site.server';
import { DocsClient } from './DocsClient';

export default async function DocsPage() {
  const data = await siteApp.fetchData();
  return <DocsClient data={data} />;
}
