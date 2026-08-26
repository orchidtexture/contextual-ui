import { createContext, useContext } from 'react';
import { FooterContextValue, FooterColumnContextValue } from './footer.types';

export const FooterContext = createContext<FooterContextValue | null>(null);
export const FooterColumnContext = createContext<FooterColumnContextValue | null>(null);

export function useFooter() {
  const context = useContext(FooterContext);
  if (!context) {
    throw new Error('Footer components must be used within a Footer.Root');
  }
  return context;
}

export function useFooterColumn() {
  return useContext(FooterColumnContext);
}
