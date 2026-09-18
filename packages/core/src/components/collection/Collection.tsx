'use client';

import { useMemo } from 'react';
import { Slot } from '@radix-ui/react-slot';
import {
  CollectionContext,
  CollectionItemContext,
  useCollectionContext,
  useCollectionItemContext,
} from './collection.context';
import { Content } from '../content/Content';
import type { CollectionRecord, CollectionItem } from '../../content/content.schema';
import type {
  CollectionRootProps,
  CollectionItemProps,
  CollectionTitleProps,
  CollectionDescriptionProps,
  CollectionContentProps,
} from './collection.types';

export function Root({
  data,
  items: explicitItems,
  ordered: explicitOrdered,
  as,
  asChild = false,
  className,
  children,
  ...props
}: CollectionRootProps) {
  const isRecord = Boolean(data && typeof data === 'object' && !Array.isArray(data) && 'items' in data);
  const collectionRecord = isRecord ? (data as CollectionRecord) : undefined;

  const items = useMemo<CollectionItem[]>(() => {
    if (explicitItems) return explicitItems;
    if (Array.isArray(data)) return data;
    if (collectionRecord?.items) return collectionRecord.items;
    return [];
  }, [data, explicitItems, collectionRecord]);

  const ordered = explicitOrdered ?? collectionRecord?.ordered ?? false;

  const contextValue = useMemo(
    () => ({
      data: collectionRecord,
      items,
      ordered,
    }),
    [collectionRecord, items, ordered]
  );

  const defaultTag = ordered ? 'ol' : 'div';
  const Comp = asChild ? Slot : (as || defaultTag);

  return (
    <CollectionContext.Provider value={contextValue}>
      <Comp
        data-contextual="collection-root"
        data-ordered={ordered ? 'true' : undefined}
        className={className}
        {...props}
      >
        {typeof children === 'function' ? children(items) : children}
      </Comp>
    </CollectionContext.Provider>
  );
}

export function Item({
  item: explicitItem,
  id: explicitId,
  index = 0,
  as,
  asChild = false,
  className,
  children,
  ...props
}: CollectionItemProps) {
  const collectionContext = useCollectionContext();

  const item = useMemo<CollectionItem>(() => {
    if (explicitItem) return explicitItem;
    if (explicitId && collectionContext?.items) {
      const found = collectionContext.items.find((it) => it.id === explicitId);
      if (found) return found;
    }
    return { id: explicitId || `item-${index}`, type: 'ListItem' };
  }, [explicitItem, explicitId, index, collectionContext?.items]);

  const contextValue = useMemo(
    () => ({
      item,
      index,
    }),
    [item, index]
  );

  const defaultTag = collectionContext?.ordered ? 'li' : 'div';
  const Comp = asChild ? Slot : (as || defaultTag);

  return (
    <CollectionItemContext.Provider value={contextValue}>
      <Comp
        data-contextual="collection-item"
        data-id={item.id}
        className={className}
        {...props}
      >
        {typeof children === 'function' ? children(item, index) : children}
      </Comp>
    </CollectionItemContext.Provider>
  );
}

export function Title({
  as: Tag = 'h3',
  asChild = false,
  className,
  children,
  ...props
}: CollectionTitleProps) {
  const context = useCollectionItemContext();
  const displayTitle = children ?? context?.item?.title ?? context?.item?.name;

  if (!displayTitle) {
    return null;
  }

  const Comp = asChild ? Slot : Tag;

  return (
    <Comp
      data-contextual="collection-title"
      className={className}
      {...props}
    >
      {displayTitle}
    </Comp>
  );
}

export function Description({
  asChild = false,
  className,
  children,
  ...props
}: CollectionDescriptionProps) {
  const context = useCollectionItemContext();
  const displayDescription = children ?? context?.item?.description;

  if (!displayDescription) {
    return null;
  }

  const Comp = asChild ? Slot : 'p';

  return (
    <Comp
      data-contextual="collection-description"
      className={className}
      {...props}
    >
      {displayDescription}
    </Comp>
  );
}

export function CollectionContent({
  data: explicitData,
  components,
  asChild = false,
  className,
  children,
  ...props
}: CollectionContentProps) {
  const context = useCollectionItemContext();
  const contentData = explicitData ?? context?.item?.content;

  if (!contentData && !children) {
    return null;
  }

  if (children) {
    const Comp = asChild ? Slot : 'div';
    return (
      <Comp data-contextual="collection-content" className={className} {...props}>
        {children}
      </Comp>
    );
  }

  return (
    <Content
      data={contentData}
      components={components}
      asChild={asChild}
      className={className}
      {...props}
    />
  );
}

export const Collection = {
  Root,
  Item,
  Title,
  Description,
  Content: CollectionContent,
};
