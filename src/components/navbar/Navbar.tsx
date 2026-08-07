'use client';

import React, { useState, useMemo, useCallback } from 'react';
import { Slot } from '@radix-ui/react-slot';
import { NavbarDataSchema } from './navbar.schema';
import { NavbarContext } from './navbar.context';
import {
  NavbarRootProps,
  NavbarBrandProps,
  NavbarToggleProps,
  NavbarContentProps,
  NavbarMenuProps,
  NavbarContextValue
} from './navbar.types';

export function Root({
  data: rawData,
  children,
  className,
  sticky = false,
}: NavbarRootProps) {
  const data = useMemo(() => {
    if (!rawData) return undefined;
    const result = NavbarDataSchema.safeParse(rawData);
    if (!result.success) {
      // @ts-ignore
      if (typeof process !== 'undefined' && process.env.NODE_ENV !== 'production') {
        console.warn('[Contextual UI] Navbar Data validation failed:', result.error.flatten());
      }
      return undefined;
    }
    return result.data;
  }, [rawData]);

  const [isOpen, setIsOpen] = useState(false);

  const toggle = useCallback(() => setIsOpen((prev) => !prev), []);

  const contextValue = useMemo<NavbarContextValue>(() => ({
    data,
    isOpen,
    setIsOpen,
    toggle,
  }), [data, isOpen, toggle]);

  return (
    <NavbarContext.Provider value={contextValue}>
      <nav
        data-contextual="navbar-root"
        data-sticky={sticky}
        className={className}
        role="navigation"
      >
        {children}
      </nav>
    </NavbarContext.Provider>
  );
}

export function Brand({ children, asChild, className }: NavbarBrandProps) {
  const { data } = React.useContext(NavbarContext)!;
  const Comp = asChild ? Slot : 'a';
  
  // If no children, try to use data.brand
  if (!children && data?.brand) {
    return (
      <a 
        href={data.brand.href} 
        className={className}
        data-contextual="navbar-brand"
      >
        {data.brand.logo && <img src={data.brand.logo} alt={data.brand.name} />}
        <span>{data.brand.name}</span>
      </a>
    );
  }

  return (
    <Comp 
      data-contextual="navbar-brand"
      className={className}
    >
      {children}
    </Comp>
  );
}

export function Content({ children, className }: NavbarContentProps) {
  return (
    <div 
      data-contextual="navbar-content"
      className={className}
    >
      {children}
    </div>
  );
}

export function Toggle({ children, asChild, className }: NavbarToggleProps) {
  const { isOpen, toggle } = React.useContext(NavbarContext)!;
  const Comp = asChild ? Slot : 'button';

  return (
    <Comp
      type={asChild ? undefined : 'button'}
      aria-expanded={isOpen}
      data-state={isOpen ? 'open' : 'closed'}
      data-contextual="navbar-toggle"
      onClick={toggle}
      className={className}
    >
      {children || (
        <svg 
          viewBox="0 0 24 24" 
          width="24" 
          height="24" 
          stroke="currentColor" 
          strokeWidth="2" 
          fill="none" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        >
          {isOpen ? (
            <path d="M18 6L6 18M6 6l12 12" />
          ) : (
            <path d="M3 12h18M3 6h18M3 18h18" />
          )}
        </svg>
      )}
    </Comp>
  );
}

export function Menu({ children, className }: NavbarMenuProps) {
  const { isOpen } = React.useContext(NavbarContext)!;

  if (!isOpen) return null;

  return (
    <div 
      data-contextual="navbar-menu"
      data-state={isOpen ? 'open' : 'closed'}
      className={className}
    >
      {children}
    </div>
  );
}
