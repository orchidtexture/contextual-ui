import { ReactNode } from 'react';
import { BreadcrumbData, BreadcrumbItem } from './breadcrumb.schema';

export interface BreadcrumbRootProps {
  data?: BreadcrumbData;
  sectionKey?: string;
  children: ReactNode;
  className?: string;
  baseUrl?: string;
  injectJsonLd?: boolean;
}

export interface BreadcrumbListProps {
  children: ReactNode;
  asChild?: boolean;
  className?: string;
  [key: string]: any;
}

export interface BreadcrumbItemProps {
  id?: string;
  children: ReactNode;
  asChild?: boolean;
  className?: string;
  [key: string]: any;
}

export interface BreadcrumbLinkProps {
  href?: string;
  children: ReactNode;
  asChild?: boolean;
  className?: string;
  [key: string]: any;
}

export interface BreadcrumbPageProps {
  children: ReactNode;
  asChild?: boolean;
  className?: string;
  [key: string]: any;
}

export interface BreadcrumbSeparatorProps {
  children?: ReactNode;
  asChild?: boolean;
  className?: string;
  [key: string]: any;
}

export interface BreadcrumbContextValue {
  data: BreadcrumbData;
  getItemData: (id: string) => BreadcrumbItem | undefined;
}
