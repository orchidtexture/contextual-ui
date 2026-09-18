import { siteApp } from '@/data/site.server';
import { WebPage } from 'contextual-ui/server';
import { Content } from 'contextual-ui';

// Zero duplication! Pulls title, description, and canonical from siteApp SSOT
export const generateMetadata = () => siteApp.getMetadata('privacy');

export default async function PrivacyPage({
  data: customData,
  app = siteApp,
}: {
  data?: any;
  app?: any;
} = {}) {
  const data = customData || (await app.fetchData());
  const privacySection = (data as any)?.sections?.find((s: any) => s.id === 'privacy-policy');

  return await WebPage({
    app,
    id: 'privacy',
    className: 'max-w-4xl mx-auto px-6 py-24',
    children: (
      <>
        <h1 className="text-4xl font-extrabold tracking-tight text-neutral-900 dark:text-neutral-100">
          {privacySection?.title || 'Privacy Policy'}
        </h1>
        <div className="mt-8 space-y-4 text-neutral-600 dark:text-neutral-400">
          <Content data={privacySection?.content} />
        </div>
      </>
    ),
  });
}
