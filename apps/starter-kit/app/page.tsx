import { siteApp } from '@/data/site.server';
import { WebPage } from 'contextual-ui/server';
import { HomeClient } from './HomeClient';

export default async function Home() {
  const data = await siteApp.fetchData();
  return (
    <WebPage app={siteApp} id="home">
      <HomeClient data={data} />
    </WebPage>
  );
}
