import { siteApp } from '@/data/site.server';
import { WebPage } from 'contextual-ui/server';

export const generateMetadata = () => siteApp.getMetadata('terms');

export default async function TermsPage() {
  return (
    <WebPage app={siteApp} id="terms" className="max-w-4xl mx-auto px-6 py-24">
      <h1 className="text-4xl font-extrabold tracking-tight text-neutral-900 dark:text-neutral-100">
        Terms of Service
      </h1>
      <p className="mt-4 text-lg text-neutral-600 dark:text-neutral-400">
        Contextual UI is open-source software distributed under the MIT license.
      </p>
    </WebPage>
  );
}
