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
    <ContextualFooter.Root className="border-t border-base py-12 px-6 mt-auto bg-zinc-950/80 backdrop-blur-sm">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Top Grid: Brand & Column Links */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2 space-y-3">
            <ContextualFooter.Brand className="font-semibold font-mono text-base no-underline flex items-center gap-2.5 text-zinc-100">
              <img
                src={footerData?.brand?.logo || '/images/contextual-ui-logo.png'}
                alt={footerData?.brand?.name || 'Contextual UI'}
                className="w-7 h-7 rounded-md object-contain border border-base bg-zinc-950 shadow-sm"
              />
              <span>{footerData?.brand?.name || 'Contextual UI'}</span>
            </ContextualFooter.Brand>
            <ContextualFooter.Description className="text-xs text-zinc-400 max-w-sm leading-relaxed" />
            {footerData?.socials && footerData.socials.length > 0 && (
              <ContextualFooter.Socials className="flex gap-2 pt-2">
                {footerData.socials.map((social) => (
                  <ContextualFooter.SocialLink
                    key={social.id}
                    item={social}
                    className="text-xs font-mono px-2.5 py-1 rounded bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-accent hover:border-accent/40 transition-colors"
                  >
                    {social.label || social.platform}
                  </ContextualFooter.SocialLink>
                ))}
              </ContextualFooter.Socials>
            )}
          </div>

          <ContextualFooter.Columns className="md:col-span-2 grid grid-cols-2 gap-6">
            {footerData?.columns?.map((col) => (
              <ContextualFooter.Column key={col.id} column={col} className="space-y-3">
                <ContextualFooter.ColumnTitle className="text-xs font-mono font-semibold uppercase tracking-wider text-zinc-300">
                  {col.title}
                </ContextualFooter.ColumnTitle>
                <ContextualFooter.Links className="space-y-2 list-none p-0 m-0">
                  {col.links.map((link) => (
                    <li key={link.id}>
                      <ContextualFooter.Link
                        item={link}
                        className="text-xs text-zinc-400 hover:text-zinc-200 transition-colors"
                      />
                    </li>
                  ))}
                </ContextualFooter.Links>
              </ContextualFooter.Column>
            ))}
          </ContextualFooter.Columns>
        </div>

        {/* Bottom Bar: Copyright & Legal */}
        <ContextualFooter.Bottom className="pt-6 border-t border-base flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-zinc-400">
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
            {footerData?.legalLinks?.map((link) => (
              <ContextualFooter.Link
                key={link.id}
                item={link}
                className="hover:text-zinc-200 transition-colors"
              />
            ))}
          </div>
        </ContextualFooter.Bottom>
      </div>
    </ContextualFooter.Root>
  );
}

export default Footer;
