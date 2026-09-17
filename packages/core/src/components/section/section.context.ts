import { createContext, useContext } from 'react';
import type { SectionRecord } from '../../content/content.schema';

export interface SectionContextValue {
  data?: SectionRecord;
  id?: string;
  anchor?: string;
  headingId?: string;
  pageId?: string;
  title?: string;
  subtitle?: string;
  description?: string;
}

export const SectionContext = createContext<SectionContextValue | null>(null);

export function useSectionContext(): SectionContextValue | null {
  return useContext(SectionContext);
}
