'use client';

import React, { useState, useMemo, useCallback } from 'react';
import { Slot } from '@radix-ui/react-slot';
import { FaqDataSchema } from './faq.schema';
import { FaqContext, FaqItemContext } from './faq.context';
import { useContextualSiteContext, useIsContextualSite } from '../site/site.context';
import { 
  FaqRootProps, 
  FaqItemProps, 
  FaqTriggerProps, 
  FaqContentProps,
  FaqContextValue 
} from './faq.types';
import { generateFaqJsonLd } from './faq.utils';

export function Root({ 
  data: explicitData,
  sectionKey = 'faq',
  children, 
  allowMultiple = false,
  className 
}: FaqRootProps) {
  const pageContext = useContextualSiteContext();
  const isInsideSite = useIsContextualSite();

  const rawData = explicitData ?? pageContext?.data?.[sectionKey] ?? [];

  // Validate data with Zod
  const data = useMemo(() => {
    const result = FaqDataSchema.safeParse(rawData);
    if (!result.success) {
      // @ts-ignore
      if (typeof process !== 'undefined' && process.env.NODE_ENV !== 'production') {
        console.warn('[Contextual UI] FAQ Data validation failed:', result.error.flatten());
      }
      return [];
    }
    return result.data;
  }, [rawData]);

  const [openItemIds, setOpenItemIds] = useState<string[]>([]);

  const toggleItem = useCallback((id: string) => {
    setOpenItemIds((prev) => {
      const isOpen = prev.includes(id);
      if (isOpen) {
        return prev.filter((itemId) => itemId !== id);
      }
      return allowMultiple ? [...prev, id] : [id];
    });
  }, [allowMultiple]);

  const isItemOpen = useCallback((id: string) => openItemIds.includes(id), [openItemIds]);
  
  const getItemData = useCallback((id: string) => 
    data.find(item => item.id === id), 
  [data]);

  const contextValue = useMemo<FaqContextValue>(() => ({
    data,
    openItemIds,
    toggleItem,
    isItemOpen,
    getItemData,
  }), [data, openItemIds, toggleItem, isItemOpen, getItemData]);

  const jsonLd = useMemo(() => (!isInsideSite ? generateFaqJsonLd(data) : null), [data, isInsideSite]);

  return (
    <FaqContext.Provider value={contextValue}>
      <div data-contextual="faq-root" className={className}>
        {jsonLd && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
          />
        )}
        {children}
      </div>
    </FaqContext.Provider>
  );
}

export function Item({ id, children, className }: FaqItemProps) {
  return (
    <FaqItemContext.Provider value={{ id }}>
      <div 
        data-contextual="faq-item" 
        data-id={id}
        className={className}
      >
        {children}
      </div>
    </FaqItemContext.Provider>
  );
}

export function Trigger({ children, asChild, className, ...props }: FaqTriggerProps) {
  const { id } = React.useContext(FaqItemContext) ?? { id: '' };
  const { toggleItem, isItemOpen } = React.useContext(FaqContext)!;
  
  if (!id) {
    throw new Error('Faq.Trigger must be used within Faq.Item');
  }

  const isOpen = isItemOpen(id);
  const Comp = asChild ? Slot : 'button';

  return (
    <Comp
      type={asChild ? undefined : 'button'}
      aria-expanded={isOpen}
      data-state={isOpen ? 'open' : 'closed'}
      data-contextual="faq-trigger"
      onClick={() => toggleItem(id)}
      className={className}
      {...props}
    >
      {children}
    </Comp>
  );
}

export function Content({ children, asChild, className, ...props }: FaqContentProps) {
  const { id } = React.useContext(FaqItemContext) ?? { id: '' };
  const { isItemOpen } = React.useContext(FaqContext)!;

  if (!id) {
    throw new Error('Faq.Content must be used within Faq.Item');
  }

  const isOpen = isItemOpen(id);
  
  if (!isOpen) return null;

  const Comp = asChild ? Slot : 'div';

  return (
    <Comp
      data-state={isOpen ? 'open' : 'closed'}
      data-contextual="faq-content"
      className={className}
      {...props}
    >
      {children}
    </Comp>
  );
}
