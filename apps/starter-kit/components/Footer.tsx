'use client';

import { usePathname } from 'next/navigation';
import { Footer as ContextualFooter, useContextualSiteContext } from 'contextual-ui';
import type { SiteData } from '@/data/site.server';

interface CustomFooterProps {
  data?: SiteData;
}

export function Footer({ data: explicitData }: CustomFooterProps = {}) {
  const pathname = usePathname();
  const pageContext = useContextualSiteContext<SiteData>();
  const data = explicitData ?? pageContext?.data;
  const footerData = data?.footer;

  if (pathname?.startsWith('/studio')) {
    return null;
  }

  return (
    <ContextualFooter.Root className="border-t border-base py-12 px-6 mt-auto bg-zinc-950/80 backdrop-blur-sm">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Top Grid: Brand & Column Links */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2 space-y-3">
            <ContextualFooter.Brand className="font-semibold font-mono text-base no-underline flex items-center gap-2.5 text-zinc-100">
              <img
                src={footerData?.brand?.logo || '/images/onigiri_logo.svg'}
                alt={footerData?.brand?.name || 'Contextual UI'}
                className="w-7 h-7 rounded-md object-contain shadow-sm"
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
            <a
              href="https://github.com/orchidtexture/contextual-ui"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-zinc-200 transition-colors inline-flex items-center gap-1.5"
            >
              <svg
                viewBox="0 0 24 24"
                width="14"
                height="14"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                />
              </svg>
              <span>GitHub</span>
            </a>
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
