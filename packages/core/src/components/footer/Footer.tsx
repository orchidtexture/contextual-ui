'use client';

import { useMemo, useCallback } from 'react';
import { Slot } from '@radix-ui/react-slot';
import { FooterDataSchema } from './footer.schema';
import { FooterContext, FooterColumnContext, useFooter, useFooterColumn } from './footer.context';
import { useContextualSiteContext, useIsContextualSite } from '../site/site.context';
import {
  FooterRootProps,
  FooterBrandProps,
  FooterDescriptionProps,
  FooterContentProps,
  FooterColumnsProps,
  FooterColumnProps,
  FooterColumnTitleProps,
  FooterLinksProps,
  FooterLinkProps,
  FooterSocialsProps,
  FooterSocialLinkProps,
  FooterCopyrightProps,
  FooterBottomProps,
  FooterContextValue,
} from './footer.types';
import { generateFooterJsonLd } from './footer.utils';

export function Root({
  data: explicitData,
  sectionKey = 'footer',
  children,
  className,
  ...props
}: FooterRootProps) {
  const siteContext = useContextualSiteContext();
  const isInsideSite = useIsContextualSite();

  const rawData = explicitData ?? siteContext?.data?.[sectionKey];

  const data = useMemo(() => {
    if (!rawData) return undefined;
    const result = FooterDataSchema.safeParse(rawData);
    if (!result.success) {
      // @ts-ignore
      if (typeof process !== 'undefined' && process.env.NODE_ENV !== 'production') {
        console.warn('[Contextual UI] Footer Data validation failed:', result.error.flatten());
      }
      return undefined;
    }
    return result.data;
  }, [rawData]);

  const jsonLd = useMemo(
    () => (!isInsideSite && data ? generateFooterJsonLd(data) : null),
    [data, isInsideSite]
  );

  const getColumnData = useCallback(
    (id: string) => data?.columns?.find((col) => col.id === id),
    [data]
  );

  const contextValue = useMemo<FooterContextValue>(
    () => ({
      data,
      getColumnData,
    }),
    [data, getColumnData]
  );

  return (
    <FooterContext.Provider value={contextValue}>
      <footer
        data-contextual="footer-root"
        role="contentinfo"
        className={className}
        {...props}
      >
        {jsonLd && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
          />
        )}
        {children}
      </footer>
    </FooterContext.Provider>
  );
}

export function Brand({ children, asChild, className, href, ...props }: FooterBrandProps) {
  const { data } = useFooter();
  const Comp = asChild ? Slot : 'a';
  const targetHref = href || data?.brand?.href || '/';

  if (!children && data?.brand) {
    return (
      <a
        href={targetHref}
        className={className}
        data-contextual="footer-brand"
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
      data-contextual="footer-brand"
      className={className}
      {...props}
    >
      {children}
    </Comp>
  );
}

export function Description({ children, asChild, className, ...props }: FooterDescriptionProps) {
  const { data } = useFooter();
  const Comp = asChild ? Slot : 'p';

  if (!children && data?.brand?.description) {
    return (
      <p
        data-contextual="footer-description"
        className={className}
        {...props}
      >
        {data.brand.description}
      </p>
    );
  }

  return (
    <Comp
      data-contextual="footer-description"
      className={className}
      {...props}
    >
      {children}
    </Comp>
  );
}

export function Content({ children, asChild, className, ...props }: FooterContentProps) {
  const Comp = asChild ? Slot : 'div';
  return (
    <Comp
      data-contextual="footer-content"
      className={className}
      {...props}
    >
      {children}
    </Comp>
  );
}

export function Columns({ children, asChild, className, ...props }: FooterColumnsProps) {
  const { data } = useFooter();
  const Comp = asChild ? Slot : 'div';

  if (!children && data?.columns) {
    return (
      <Comp
        data-contextual="footer-columns"
        className={className}
        {...props}
      >
        {data.columns.map((column) => (
          <Column key={column.id} column={column}>
            <ColumnTitle />
            <Links />
          </Column>
        ))}
      </Comp>
    );
  }

  return (
    <Comp
      data-contextual="footer-columns"
      className={className}
      {...props}
    >
      {children}
    </Comp>
  );
}

export function Column({
  id,
  column: explicitColumn,
  children,
  asChild,
  className,
  ...props
}: FooterColumnProps) {
  const { getColumnData } = useFooter();
  const resolvedColumn = explicitColumn || (id ? getColumnData(id) : undefined);

  const Comp = asChild ? Slot : 'div';

  return (
    <FooterColumnContext.Provider value={{ column: resolvedColumn }}>
      <Comp
        data-contextual="footer-column"
        data-id={id || resolvedColumn?.id}
        className={className}
        {...props}
      >
        {children}
      </Comp>
    </FooterColumnContext.Provider>
  );
}

export function ColumnTitle({ children, asChild, className, ...props }: FooterColumnTitleProps) {
  const columnContext = useFooterColumn();
  const Comp = asChild ? Slot : 'h3';

  if (!children && columnContext?.column?.title) {
    return (
      <h3
        data-contextual="footer-column-title"
        className={className}
        {...props}
      >
        {columnContext.column.title}
      </h3>
    );
  }

  return (
    <Comp
      data-contextual="footer-column-title"
      className={className}
      {...props}
    >
      {children}
    </Comp>
  );
}

export function Links({
  columnId,
  links: explicitLinks,
  children,
  asChild,
  className,
  ...props
}: FooterLinksProps) {
  const { data, getColumnData } = useFooter();
  const columnContext = useFooterColumn();

  const resolvedLinks =
    explicitLinks ||
    (columnId ? getColumnData(columnId)?.links : columnContext?.column?.links) ||
    data?.links;

  const Comp = asChild ? Slot : 'ul';

  if (!children && resolvedLinks) {
    return (
      <Comp
        data-contextual="footer-links"
        className={className}
        {...props}
      >
        {resolvedLinks.map((link) => (
          <li key={link.id} data-contextual="footer-links-item">
            <Link item={link} />
          </li>
        ))}
      </Comp>
    );
  }

  return (
    <Comp
      data-contextual="footer-links"
      className={className}
      {...props}
    >
      {children}
    </Comp>
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
}: FooterLinkProps) {
  const targetHref = href || item?.href || '#';
  const isExternal = external ?? item?.external ?? targetHref.startsWith('http');
  const target = props.target || item?.target || (isExternal ? '_blank' : undefined);
  const rel = props.rel || item?.rel || (isExternal ? 'noopener noreferrer' : undefined);

  const Comp = asChild ? Slot : 'a';

  if (!children && item?.label) {
    return (
      <a
        href={targetHref}
        target={target}
        rel={rel}
        data-contextual="footer-link"
        className={className}
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
      data-contextual="footer-link"
      className={className}
      {...props}
    >
      {children}
    </Comp>
  );
}

export function Socials({ children, asChild, className, ...props }: FooterSocialsProps) {
  const { data } = useFooter();
  const Comp = asChild ? Slot : 'div';

  if (!children && data?.socials) {
    return (
      <Comp
        data-contextual="footer-socials"
        className={className}
        {...props}
      >
        {data.socials.map((social) => (
          <SocialLink key={social.id} item={social} />
        ))}
      </Comp>
    );
  }

  return (
    <Comp
      data-contextual="footer-socials"
      className={className}
      {...props}
    >
      {children}
    </Comp>
  );
}

export function SocialLink({
  item,
  href,
  platform,
  children,
  asChild,
  className,
  ...props
}: FooterSocialLinkProps) {
  const targetHref = href || item?.href || '#';
  const resolvedPlatform = platform || item?.platform;
  const Comp = asChild ? Slot : 'a';

  if (!children && (item?.label || resolvedPlatform)) {
    return (
      <a
        href={targetHref}
        target="_blank"
        rel="noopener noreferrer"
        data-contextual="footer-social-link"
        data-platform={resolvedPlatform}
        className={className}
        {...props}
      >
        {item?.label || resolvedPlatform}
      </a>
    );
  }

  return (
    <Comp
      href={asChild ? href : targetHref}
      target={asChild ? undefined : '_blank'}
      rel={asChild ? undefined : 'noopener noreferrer'}
      data-contextual="footer-social-link"
      data-platform={resolvedPlatform}
      className={className}
      {...props}
    >
      {children}
    </Comp>
  );
}

export function Copyright({
  children,
  asChild,
  className,
  holder,
  year,
  ...props
}: FooterCopyrightProps) {
  const { data } = useFooter();
  const currentYear = new Date().getFullYear();
  const resolvedYear = year ?? data?.copyright?.year ?? currentYear;
  const resolvedHolder = holder ?? data?.copyright?.holder ?? data?.brand?.name ?? '';

  const Comp = asChild ? Slot : 'p';

  if (!children) {
    const text =
      data?.copyright?.text ||
      (resolvedHolder
        ? `© ${resolvedYear} ${resolvedHolder}. All rights reserved.`
        : `© ${resolvedYear}`);

    return (
      <p
        data-contextual="footer-copyright"
        className={className}
        {...props}
      >
        {text}
      </p>
    );
  }

  return (
    <Comp
      data-contextual="footer-copyright"
      className={className}
      {...props}
    >
      {children}
    </Comp>
  );
}

export function Bottom({ children, asChild, className, ...props }: FooterBottomProps) {
  const { data } = useFooter();
  const Comp = asChild ? Slot : 'div';

  if (!children && (data?.copyright || data?.legalLinks)) {
    return (
      <Comp
        data-contextual="footer-bottom"
        className={className}
        {...props}
      >
        <Copyright />
        {data.legalLinks && data.legalLinks.length > 0 && (
          <Links links={data.legalLinks} />
        )}
      </Comp>
    );
  }

  return (
    <Comp
      data-contextual="footer-bottom"
      className={className}
      {...props}
    >
      {children}
    </Comp>
  );
}
