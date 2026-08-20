import { siteApp } from '@/data/site.server';
import { ComponentsClient } from './ComponentsClient';

export default async function ComponentsPage() {
  const data = await siteApp.fetchData();
  return <ComponentsClient data={data} />;
}
