import { siteApp } from '@/data/site.server';
import { WebPage } from 'contextual-ui/server';
import { HomeClient } from './HomeClient';

export const generateMetadata = () => siteApp.getMetadata('home');

export default async function Home({
  data: customData,
  app = siteApp,
}: {
  data?: any;
  app?: any;
} = {}) {
  const data = customData || (await app.fetchData());
  return await WebPage({
    app,
    id: 'home',
    children: <HomeClient data={data} />,
  });
}
