import { siteApp } from '@/data/site.server';
import { WebPage } from 'contextual-ui/server';
import { Content } from 'contextual-ui';

export const generateMetadata = () => siteApp.getMetadata('terms');

export default async function TermsPage() {
  const data = await siteApp.fetchData();
  const termsSection = (data as any)?.sections?.find((s: any) => s.id === 'terms-of-service');

  return (
    <WebPage app={siteApp} id="terms" className="max-w-4xl mx-auto px-6 py-24">
      <h1 className="text-4xl font-extrabold tracking-tight text-neutral-900 dark:text-neutral-100">
        {termsSection?.title || 'Terms of Service'}
      </h1>
      <div className="mt-4 text-lg text-neutral-600 dark:text-neutral-400">
        <Content data={termsSection?.content} />
      </div>
    </WebPage>
  );
}
