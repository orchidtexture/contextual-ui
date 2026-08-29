import { Slot } from '@radix-ui/react-slot';
import type { WebPageProps } from './webpage.types';
import type { WebpageData } from './webpage.schema';

export async function WebPage({
  app,
  graph: explicitGraph,
  data,
  name,
  url,
  description,
  isPartOf,
  hasPart,
  children,
  asChild = false,
  className,
  disableJsonLdScript = false,
  ...props
}: WebPageProps) {
  let graph = explicitGraph;

  if (!graph && app && typeof app.getGraph === 'function') {
    const webpageData: WebpageData = {
      ...(data || {}),
      ...(name ? { name } : {}),
      ...(url ? { url } : {}),
      ...(description ? { description } : {}),
      ...(isPartOf ? { isPartOf } : {}),
      ...(hasPart ? { hasPart } : {}),
    };

    graph = await app.getGraph({
      dataOverrides: {
        webpage: webpageData,
      },
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
