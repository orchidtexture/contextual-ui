import { createContext, useContext } from 'react';
import { ContextualSiteContextValue } from './site.types';

export const ContextualSiteContext = createContext<ContextualSiteContextValue | null>(null);

export function useContextualSiteContext<T = Record<string, any>>(): ContextualSiteContextValue<T> | null {
  return useContext(ContextualSiteContext) as ContextualSiteContextValue<T> | null;
}

export function useIsContextualSite(): boolean {
  const context = useContext(ContextualSiteContext);
  return !!context?.isContextualSite;
}
