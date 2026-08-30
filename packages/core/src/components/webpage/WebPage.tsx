import { Slot } from '@radix-ui/react-slot';
import type { WebPageProps } from './webpage.types';
import type { WebpageItem } from './webpage.schema';

export async function WebPage({
  app,
  graph: explicitGraph,
  id,
  data,
  name,
  url,
  description,
  isPartOf,
  hasPart,
  inLanguage,
  children,
  asChild = false,
  className,
  disableJsonLdScript = false,
  ...props
}: WebPageProps) {
  let graph = explicitGraph;

  if (!graph && app && typeof app.getGraph === 'function') {
    const overrideData: Partial<WebpageItem> = {
      ...(data || {}),
      ...(id ? { id } : {}),
      ...(name ? { name } : {}),
      ...(url ? { url } : {}),
      ...(description ? { description } : {}),
      ...(isPartOf ? { isPartOf } : {}),
      ...(hasPart ? { hasPart } : {}),
      ...(inLanguage ? { inLanguage } : {}),
    };

    const hasOverrides = Object.keys(overrideData).length > 0;

    graph = await app.getGraph({
      pageId: id,
      pageUrl: url,
      dataOverrides: hasOverrides
        ? {
            webpage: overrideData,
            webpages: overrideData,
          }
        : undefined,
    });
  }

  const Comp = asChild ? Slot : 'div';

  return (
    <Comp data-contextual="webpage-root" className={className} {...props}>
      {!disableJsonLdScript && graph && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }}
        />
      )}
      {children}
    </Comp>
  );
}

