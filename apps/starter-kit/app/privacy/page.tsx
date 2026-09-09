import { siteApp } from '@/data/site.server';
import { WebPage } from 'contextual-ui/server';

// Zero duplication! Pulls title, description, and canonical from siteApp SSOT
export const generateMetadata = () => siteApp.getMetadata('privacy');

export default async function PrivacyPage() {
  return (
    <WebPage app={siteApp} id="privacy" className="max-w-4xl mx-auto px-6 py-24">
      <h1 className="text-4xl font-extrabold tracking-tight text-neutral-900 dark:text-neutral-100">
        Privacy Policy
      </h1>
      <p className="mt-4 text-lg text-neutral-600 dark:text-neutral-400">
        Contextual UI is an open-source framework and does not track personal browsing activity or collect
        unsolicited personal data. All schema graphs and user configurations remain strictly under your control.
      </p>
      <div className="mt-8 space-y-4 text-neutral-600 dark:text-neutral-400">
        <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">Data Storage</h2>
        <p>
          Data processed through Contextual UI connectors is executed directly on your own infrastructure or hosting provider.
        </p>
      </div>
    </WebPage>
  );
}
