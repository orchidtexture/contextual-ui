import { siteApp } from '@/data/site.server';
import { HomeClient } from './HomeClient';

export default async function Home() {
  const data = await siteApp.fetchData();
  return <HomeClient data={data} />;
}
