'use client';

import { useState, useMemo, useCallback } from 'react';
import { Slot } from '@radix-ui/react-slot';
import { NavbarDataSchema } from './navbar.schema';
import { NavbarContext, useNavbar } from './navbar.context';
import { useContextualSiteContext, useIsContextualSite } from '../site/site.context';
import {
  NavbarRootProps,
  NavbarBrandProps,
  NavbarToggleProps,
  NavbarLinksProps,
  NavbarMenuProps,
  NavbarLinkProps,
  NavbarContextValue,
} from './navbar.types';
import { generateNavbarJsonLd } from './navbar.utils';

export function Root({
  data: explicitData,
  sectionKey = 'navbar',
  children,
  className,
  sticky = false,
  injectJsonLd,
}: NavbarRootProps) {
  const siteContext = useContextualSiteContext();
  const isInsideSite = useIsContextualSite();

  const rawData = explicitData ?? siteContext?.data?.[sectionKey];

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

  const shouldInject = injectJsonLd ?? (!isInsideSite || explicitData !== undefined);
  const jsonLd = useMemo(
    () => (shouldInject && data ? generateNavbarJsonLd(data) : null),
    [data, shouldInject]
  );

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
        {jsonLd && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
          />
        )}
        {children}
      </nav>
    </NavbarContext.Provider>
  );
}

export function Brand({ children, asChild, className, href, ...props }: NavbarBrandProps) {
  const { data } = useNavbar();
  const Comp = asChild ? Slot : 'a';
  const targetHref = href || data?.brand?.href || '/';
  
  if (typeof children === 'function') {
    return (
      <Comp
        href={asChild ? href : targetHref}
        data-contextual="navbar-brand"
        className={className}
        {...props}
      >
        {children(data?.brand)}
      </Comp>
    );
  }

  // If no children, try to use data.brand
  if (!children && data?.brand) {
    return (
      <a 
        href={targetHref} 
        className={className}
        data-contextual="navbar-brand"
        {...props}
      >
        {data.brand.logo && <img src={data.brand.logo} alt={data.brand.name} />}
        <span>{data.brand.name}</span>
      </a>
    );
  }

  return (
    <Comp 
      href={asChild ? href : targetHref}
      data-contextual="navbar-brand"
      className={className}
      {...props}
    >
      {children}
    </Comp>
  );
}

export function Links({
  links: explicitLinks,
  linkClassName,
  children,
  renderItem,
  asChild,
  className,
  ...props
}: NavbarLinksProps) {
  const navbarContext = useNavbar();
  const { data } = navbarContext;
  const resolvedLinks = explicitLinks || data?.links || [];
  const effectiveLinkClass = linkClassName ?? navbarContext.linkClassName;
  const Comp = asChild ? Slot : 'div';

  const linksContextValue = useMemo<NavbarContextValue>(() => ({
    ...navbarContext,
    linkClassName: effectiveLinkClass,
  }), [navbarContext, effectiveLinkClass]);

  if (typeof children === 'function') {
    return (
      <NavbarContext.Provider value={linksContextValue}>
        <Comp data-contextual="navbar-links" className={className} {...props}>
          {children(resolvedLinks)}
        </Comp>
      </NavbarContext.Provider>
    );
  }

  if (renderItem) {
    return (
      <NavbarContext.Provider value={linksContextValue}>
        <Comp data-contextual="navbar-links" className={className} {...props}>
          {resolvedLinks.map((item) => renderItem(item))}
          {children}
        </Comp>
      </NavbarContext.Provider>
    );
  }

  return (
    <NavbarContext.Provider value={linksContextValue}>
      <Comp data-contextual="navbar-links" className={className} {...props}>
        {resolvedLinks.map((link) => (
          <Link key={link.id} item={link} className={effectiveLinkClass} />
        ))}
        {children}
      </Comp>
    </NavbarContext.Provider>
  );
}

export function Toggle({ children, asChild, className, ...props }: NavbarToggleProps) {
  const { isOpen, toggle } = useNavbar();
  const Comp = asChild ? Slot : 'button';

  return (
    <Comp
      type={asChild ? undefined : 'button'}
      aria-expanded={isOpen}
      data-state={isOpen ? 'open' : 'closed'}
      data-contextual="navbar-toggle"
      onClick={toggle}
      className={className}
      {...props}
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

export function Menu({
  children,
  linkClassName,
  asChild,
  className,
  ...props
}: NavbarMenuProps) {
  const navbarContext = useNavbar();
  const { isOpen, data } = navbarContext;

  if (!isOpen) return null;

  const effectiveLinkClass = linkClassName ?? navbarContext.linkClassName;
  const Comp = asChild ? Slot : 'div';

  const menuContextValue = useMemo<NavbarContextValue>(() => ({
    ...navbarContext,
    linkClassName: effectiveLinkClass,
  }), [navbarContext, effectiveLinkClass]);

  if (typeof children === 'function') {
    return (
      <NavbarContext.Provider value={menuContextValue}>
        <Comp 
          data-contextual="navbar-menu"
          data-state={isOpen ? 'open' : 'closed'}
          className={className}
          {...props}
        >
          {children(data)}
        </Comp>
      </NavbarContext.Provider>
    );
  }

  return (
    <NavbarContext.Provider value={menuContextValue}>
      <Comp 
        data-contextual="navbar-menu"
        data-state={isOpen ? 'open' : 'closed'}
        className={className}
        {...props}
      >
        {data?.links && data.links.map((link) => (
          <Link key={link.id} item={link} className={effectiveLinkClass} />
        ))}
        {children}
      </Comp>
    </NavbarContext.Provider>
  );
}

export function Link({
  item,
  href,
  children,
  asChild,
  className,
  external,
  ...props
}: NavbarLinkProps) {
  const { linkClassName: contextLinkClass } = useNavbar();
  const resolvedClass = className ?? contextLinkClass;
  const targetHref = href || item?.href || '#';
  const isExternal = external ?? item?.external ?? targetHref.startsWith('http');
  const target = props.target || (isExternal ? '_blank' : undefined);
  const rel = props.rel || (isExternal ? 'noopener noreferrer' : undefined);

  const Comp = asChild ? Slot : 'a';

  if (!children && item?.label) {
    return (
      <a
        href={targetHref}
        target={target}
        rel={rel}
        data-contextual="navbar-link"
        className={resolvedClass}
        {...props}
      >
        {item.label}
      </a>
    );
  }

  return (
    <Comp
      href={asChild ? href : targetHref}
      target={asChild ? undefined : target}
      rel={asChild ? undefined : rel}
      data-contextual="navbar-link"
      className={resolvedClass}
      {...props}
    >
      {children}
    </Comp>
  );
}

