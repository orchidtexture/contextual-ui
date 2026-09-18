import React from 'react';
import type { CollectionRecord, CollectionItem, ContentInput } from '../../content/content.schema';
import type { ContentComponentOverrides } from '../content/content.types';

export interface CollectionRootProps extends Omit<React.HTMLAttributes<HTMLElement>, 'children'> {
  data?: CollectionRecord | CollectionItem[];
  items?: CollectionItem[];
  ordered?: boolean;
  as?: 'div' | 'ul' | 'ol';
  asChild?: boolean;
  children?: React.ReactNode | ((items: CollectionItem[]) => React.ReactNode);
}

export interface CollectionItemProps extends Omit<React.HTMLAttributes<HTMLElement>, 'children'> {
  item?: CollectionItem;
  id?: string;
  index?: number;
  as?: 'div' | 'li';
  asChild?: boolean;
  children?: React.ReactNode | ((item: CollectionItem, index: number) => React.ReactNode);
}

export interface CollectionTitleProps extends React.HTMLAttributes<HTMLElement> {
  as?: 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'span';
  asChild?: boolean;
}

export interface CollectionDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {
  asChild?: boolean;
}

export interface CollectionContentProps extends React.HTMLAttributes<HTMLDivElement> {
  data?: ContentInput;
  components?: ContentComponentOverrides;
  asChild?: boolean;
}
