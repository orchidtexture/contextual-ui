import { siteApp } from '@/data/site.server';
import { WebPage } from 'contextual-ui/server';
import { CMSClient } from './CMSClient';

export default async function CMSPage() {
  const data = await siteApp.fetchData({
    webpage: {
      name: 'CMS - Contextual UI Starter Kit',
      url: '/cms',
      description: 'Manage and preview context overrides.',
    }
  });

  // Serialize the data for client components
  const serializedContext = {
    raw: data,
  };

  return (
    <WebPage
      app={siteApp}
      name="CMS - Contextual UI Starter Kit"
      url="/cms"
      description="Manage and preview context overrides."
    >
      <div className="pt-16 min-h-screen">
        <CMSClient context={serializedContext} />
      </div>
    </WebPage>
  );
}
