import { createContext, useContext } from 'react';
import { FaqContextValue } from './faq.types';

export const FaqContext = createContext<FaqContextValue | null>(null);

export function useFaqContext() {
  const context = useContext(FaqContext);
  if (!context) {
    throw new Error('Faq components must be wrapped in <Faq.Root />');
  }
  return context;
}

export const FaqItemContext = createContext<{ id: string } | null>(null);

export function useFaqItemContext() {
  const context = useContext(FaqItemContext);
  if (!context) {
    throw new Error('FaqItem components must be wrapped in <Faq.Item />');
  }
  return context;
}
