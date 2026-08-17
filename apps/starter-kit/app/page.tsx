import { siteConnector } from '@/data/site.server';
import { HomeClient } from './HomeClient';

export default async function Home() {
  const data = await siteConnector.fetchData();
  return <HomeClient data={data} />;
}
