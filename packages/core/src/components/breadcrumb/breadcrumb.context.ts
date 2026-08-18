import { createContext } from 'react';
import { BreadcrumbContextValue } from './breadcrumb.types';

export const BreadcrumbContext = createContext<BreadcrumbContextValue | null>(null);

export interface BreadcrumbItemContextValue {
  id?: string;
}

export const BreadcrumbItemContext = createContext<BreadcrumbItemContextValue | null>(null);
