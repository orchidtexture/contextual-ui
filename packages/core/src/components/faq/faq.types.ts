import { ReactNode } from 'react';
import { FaqData, FaqItem } from './faq.schema';

export interface FaqRootProps {
  data: FaqData;
  children: ReactNode;
  /**
   * If true, allows multiple items to be open at once.
   * Defaults to false (accordion behavior).
   */
  allowMultiple?: boolean;
  className?: string;
}

export type FaqProps = FaqRootProps;

export interface FaqItemProps {
  id: string;
  children: ReactNode;
  className?: string;
}

export interface FaqTriggerProps {
  children: ReactNode;
  asChild?: boolean;
  className?: string;
}

export interface FaqContentProps {
  children: ReactNode;
  asChild?: boolean;
  className?: string;
}

export interface FaqContextValue {
  data: FaqData;
  openItemIds: string[];
  toggleItem: (id: string) => void;
  isItemOpen: (id: string) => boolean;
  getItemData: (id: string) => FaqItem | undefined;
}
