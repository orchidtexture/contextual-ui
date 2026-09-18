import { createContext, useContext } from 'react';
import type { CollectionRecord, CollectionItem } from '../../content/content.schema';

export interface CollectionContextValue {
  data?: CollectionRecord;
  items: CollectionItem[];
  ordered: boolean;
}

export interface CollectionItemContextValue {
  item: CollectionItem;
  index: number;
}

export const CollectionContext = createContext<CollectionContextValue | null>(null);
export const CollectionItemContext = createContext<CollectionItemContextValue | null>(null);

export function useCollectionContext(): CollectionContextValue | null {
  return useContext(CollectionContext);
}

export function useCollectionItemContext(): CollectionItemContextValue | null {
  return useContext(CollectionItemContext);
}
