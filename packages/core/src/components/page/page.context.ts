import { createContext, useContext } from 'react';
import { ContextualPageContextValue } from './page.types';

export const ContextualPageContext = createContext<ContextualPageContextValue | null>(null);

export function useContextualPageContext<T = Record<string, any>>(): ContextualPageContextValue<T> | null {
  return useContext(ContextualPageContext) as ContextualPageContextValue<T> | null;
}

export function useIsContextualPage(): boolean {
  const context = useContext(ContextualPageContext);
  return !!context?.isContextualPage;
}
