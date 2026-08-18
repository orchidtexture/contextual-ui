'use client';

import { useMemo, useCallback } from 'react';
import { Slot } from '@radix-ui/react-slot';
import { BreadcrumbDataSchema } from './breadcrumb.schema';
import { BreadcrumbContext, BreadcrumbItemContext } from './breadcrumb.context';
import {
  BreadcrumbRootProps,
  BreadcrumbListProps,
  BreadcrumbItemProps,
  BreadcrumbLinkProps,
  BreadcrumbPageProps,
  BreadcrumbSeparatorProps,
  BreadcrumbContextValue,
} from './breadcrumb.types';
import { generateBreadcrumbJsonLd } from './breadcrumb.utils';

export function Root({
  data: rawData,
  children,
  className,
  baseUrl = '',
}: BreadcrumbRootProps) {
  const data = useMemo(() => {
    const result = BreadcrumbDataSchema.safeParse(rawData);
    if (!result.success) {
      // @ts-ignore
      if (typeof process !== 'undefined' && process.env.NODE_ENV !== 'production') {
        console.warn('[Contextual UI] Breadcrumb Data validation failed:', result.error.flatten());
      }
      return [];
    }
    return result.data;
  }, [rawData]);

  const getItemData = useCallback(
    (id: string) => data.find((item) => item.id === id),
    [data]
  );

  const contextValue = useMemo<BreadcrumbContextValue>(
    () => ({
      data,
      getItemData,
    }),
    [data, getItemData]
  );

  const jsonLd = useMemo(() => generateBreadcrumbJsonLd(data, baseUrl), [data, baseUrl]);

  return (
    <BreadcrumbContext.Provider value={contextValue}>
      <nav
        aria-label="breadcrumb"
        data-contextual="breadcrumb-root"
        className={className}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
      </nav>
    </BreadcrumbContext.Provider>
  );
}

export function List({ children, asChild, className, ...props }: BreadcrumbListProps) {
  const Comp = asChild ? Slot : 'ol';
  return (
    <Comp
      data-contextual="breadcrumb-list"
      className={className}
      {...props}
    >
      {children}
    </Comp>
  );
}

export function Item({ id, children, asChild, className, ...props }: BreadcrumbItemProps) {
  const Comp = asChild ? Slot : 'li';
  return (
    <BreadcrumbItemContext.Provider value={{ id }}>
      <Comp
        data-contextual="breadcrumb-item"
        data-id={id}
        className={className}
        {...props}
      >
        {children}
      </Comp>
    </BreadcrumbItemContext.Provider>
  );
}

export function Link({ href, children, asChild, className, ...props }: BreadcrumbLinkProps) {
  const Comp = asChild ? Slot : 'a';
  return (
    <Comp
      href={href}
      data-contextual="breadcrumb-link"
      className={className}
      {...props}
    >
      {children}
    </Comp>
  );
}

export function Page({ children, asChild, className, ...props }: BreadcrumbPageProps) {
  const Comp = asChild ? Slot : 'span';
  return (
    <Comp
      aria-current="page"
      data-contextual="breadcrumb-page"
      className={className}
      {...props}
    >
      {children}
    </Comp>
  );
}

export function Separator({ children, asChild, className, ...props }: BreadcrumbSeparatorProps) {
  const Comp = asChild ? Slot : 'li';
  return (
    <Comp
      aria-hidden="true"
      data-contextual="breadcrumb-separator"
      className={className}
      {...props}
    >
      {children || '/'}
    </Comp>
  );
}
