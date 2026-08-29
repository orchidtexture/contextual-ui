import { siteApp } from '@/data/site.server';
import { WebPage } from 'contextual-ui/server';
import { DocsClient } from './DocsClient';

export default async function DocsPage() {
  const data = await siteApp.fetchData({
    webpage: {
      name: 'Documentation - Contextual UI Starter Kit',
      url: '/docs',
      description: 'Learn how to use Contextual UI.'
    }
  });
  return (
    <WebPage
      app={siteApp}
      name="Documentation - Contextual UI Starter Kit"
      url="/docs"
      description="Learn how to use Contextual UI."
    >
      <DocsClient data={data} />
    </WebPage>
  );
}
