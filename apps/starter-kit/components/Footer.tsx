'use client';

import { Footer as ContextualFooter, useContextualSiteContext } from '@contextual-ui/core';
import type { SiteData } from '@/data/site.server';

interface CustomFooterProps {
  data?: SiteData;
}

export function Footer({ data: explicitData }: CustomFooterProps = {}) {
  const pageContext = useContextualSiteContext<SiteData>();
  const data = explicitData ?? pageContext?.data;
  const footerData = data?.footer;

  return (
    <ContextualFooter.Root className="border-t border-base py-8 px-6 mt-auto bg-zinc-950/80 backdrop-blur-sm">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-zinc-400">
        <div className="flex items-center gap-2">
          <span>Maintained by</span>
          <a
            href="https://tasuku.io"
            target="_blank"
            rel="noopener noreferrer"
            className="text-zinc-200 hover:text-accent font-semibold transition-colors underline underline-offset-4 decoration-zinc-700 hover:decoration-accent"
          >
            {footerData?.copyright?.holder || 'Tasuku Studio'}
          </a>
        </div>
        <div className="flex items-center gap-6 text-zinc-400 text-xs">
          {footerData?.links?.map((link) => (
            <ContextualFooter.Link
              key={link.id}
              item={link}
              className="hover:text-zinc-200 transition-colors"
            />
          ))}
        </div>
      </div>
    </ContextualFooter.Root>
  );
}

export default Footer;
