'use client';

import { useMemo, useCallback, ReactNode } from 'react';
import { Slot } from '@radix-ui/react-slot';
import { FooterDataSchema } from './footer.schema';
import { FooterContext, FooterColumnContext, useFooter, useFooterColumn } from './footer.context';
import { useContextualSiteContext, useIsContextualSite } from '../site/site.context';
import {
  FooterRootProps,
  FooterBrandProps,
  FooterDescriptionProps,
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
  FooterColumnContextValue,
} from './footer.types';
import { generateFooterJsonLd } from './footer.utils';

export function Root({
  data: explicitData,
  sectionKey = 'footer',
  linkClassName,
  socialClassName,
  titleClassName,
  children,
  className,
  injectJsonLd,
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

  const shouldInject = injectJsonLd ?? (!isInsideSite || explicitData !== undefined);
  const jsonLd = useMemo(
    () => (shouldInject && data ? generateFooterJsonLd(data) : null),
    [data, shouldInject]
  );

  const getColumnData = useCallback(
    (id: string) => data?.columns?.find((col) => col.id === id),
    [data]
  );

  const contextValue = useMemo<FooterContextValue>(
    () => ({
      data,
      getColumnData,
      linkClassName,
      socialClassName,
      titleClassName,
    }),
    [data, getColumnData, linkClassName, socialClassName, titleClassName]
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

  if (typeof children === 'function') {
    return (
      <Comp
        href={asChild ? href : targetHref}
        data-contextual="footer-brand"
        className={className}
        {...props}
      >
        {children(data?.brand)}
      </Comp>
    );
  }

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

  if (typeof children === 'function') {
    return (
      <Comp
        data-contextual="footer-description"
        className={className}
        {...props}
      >
        {children(data?.brand)}
      </Comp>
    );
  }

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

export function Columns({
  columns: explicitColumns,
  linkClassName,
  titleClassName,
  children,
  renderItem,
  asChild,
  className,
  ...props
}: FooterColumnsProps) {
  const footerContext = useFooter();
  const resolvedColumns = explicitColumns || footerContext.data?.columns || [];
  const effectiveLinkClass = linkClassName ?? footerContext.linkClassName;
  const effectiveTitleClass = titleClassName ?? footerContext.titleClassName;

  const columnsContextValue = useMemo<FooterContextValue>(
    () => ({
      ...footerContext,
      linkClassName: effectiveLinkClass,
      titleClassName: effectiveTitleClass,
    }),
    [footerContext, effectiveLinkClass, effectiveTitleClass]
  );

  let content: ReactNode;
  if (typeof children === 'function') {
    content = children(resolvedColumns);
  } else if (renderItem) {
    content = (
      <>
        {resolvedColumns.map((col) => renderItem(col))}
        {children}
      </>
    );
  } else if (!children) {
    content = resolvedColumns.map((column) => (
      <Column key={column.id} column={column}>
        <ColumnTitle />
        <Links />
      </Column>
    ));
  } else {
    content = children;
  }

  const hasContainer = Boolean(className || asChild || Object.keys(props).length > 0);

  return (
    <FooterContext.Provider value={columnsContextValue}>
      {hasContainer ? (
        (() => {
          const Comp = asChild ? Slot : 'div';
          return (
            <Comp data-contextual="footer-columns" className={className} {...props}>
              {content}
            </Comp>
          );
        })()
      ) : (
        content
      )}
    </FooterContext.Provider>
  );
}

export function Column({
  id,
  column: explicitColumn,
  linkClassName,
  titleClassName,
  children,
  asChild,
  className,
  ...props
}: FooterColumnProps) {
  const footerContext = useFooter();
  const resolvedColumn = explicitColumn || (id ? footerContext.getColumnData(id) : undefined);
  const effectiveLinkClass = linkClassName ?? footerContext.linkClassName;
  const effectiveTitleClass = titleClassName ?? footerContext.titleClassName;

  const columnContextValue = useMemo<FooterColumnContextValue>(
    () => ({
      column: resolvedColumn,
      linkClassName: effectiveLinkClass,
      titleClassName: effectiveTitleClass,
    }),
    [resolvedColumn, effectiveLinkClass, effectiveTitleClass]
  );

  const columnFooterContextValue = useMemo<FooterContextValue>(
    () => ({
      ...footerContext,
      linkClassName: effectiveLinkClass,
      titleClassName: effectiveTitleClass,
    }),
    [footerContext, effectiveLinkClass, effectiveTitleClass]
  );

  let content: ReactNode;
  if (typeof children === 'function') {
    content = children(resolvedColumn);
  } else if (!children) {
    content = (
      <>
        <ColumnTitle />
        <Links />
      </>
    );
  } else {
    content = children;
  }

  const hasContainer = Boolean(className || asChild || id || Object.keys(props).length > 0);

  return (
    <FooterContext.Provider value={columnFooterContextValue}>
      <FooterColumnContext.Provider value={columnContextValue}>
        {hasContainer ? (
          (() => {
            const Comp = asChild ? Slot : 'div';
            return (
              <Comp
                data-contextual="footer-column"
                data-id={id || resolvedColumn?.id}
                className={className}
                {...props}
              >
                {content}
              </Comp>
            );
          })()
        ) : (
          <div data-contextual="footer-column" data-id={resolvedColumn?.id}>
            {content}
          </div>
        )}
      </FooterColumnContext.Provider>
    </FooterContext.Provider>
  );
}

export function ColumnTitle({ children, asChild, className, ...props }: FooterColumnTitleProps) {
  const columnContext = useFooterColumn();
  const footerContext = useFooter();
  const title = columnContext?.column?.title;
  const effectiveTitleClass = className ?? columnContext?.titleClassName ?? footerContext.titleClassName;
  const Comp = asChild ? Slot : 'h3';

  if (typeof children === 'function') {
    return (
      <Comp
        data-contextual="footer-column-title"
        className={effectiveTitleClass}
        {...props}
      >
        {children(title)}
      </Comp>
    );
  }

  if (!children && title) {
    return (
      <h3
        data-contextual="footer-column-title"
        className={effectiveTitleClass}
        {...props}
      >
        {title}
      </h3>
    );
  }

  return (
    <Comp
      data-contextual="footer-column-title"
      className={effectiveTitleClass}
      {...props}
    >
      {children}
    </Comp>
  );
}

export function Links({
  columnId,
  links: explicitLinks,
  linkClassName,
  children,
  renderItem,
  asChild,
  className,
  ...props
}: FooterLinksProps) {
  const footerContext = useFooter();
  const columnContext = useFooterColumn();

  const resolvedLinks =
    explicitLinks ||
    (columnId ? footerContext.getColumnData(columnId)?.links : columnContext?.column?.links) ||
    footerContext.data?.links ||
    [];

  const effectiveLinkClass = linkClassName ?? columnContext?.linkClassName ?? footerContext.linkClassName;

  const linksContextValue = useMemo<FooterContextValue>(
    () => ({
      ...footerContext,
      linkClassName: effectiveLinkClass,
    }),
    [footerContext, effectiveLinkClass]
  );

  let content: ReactNode;
  if (typeof children === 'function') {
    content = children(resolvedLinks);
  } else if (renderItem) {
    content = (
      <>
        {resolvedLinks.map((item) => renderItem(item))}
        {children}
      </>
    );
  } else if (!children) {
    content = resolvedLinks.map((link) => (
      <Link key={link.id} item={link} className={effectiveLinkClass} />
    ));
  } else {
    content = (
      <>
        {resolvedLinks.length > 0 &&
          resolvedLinks.map((link) => (
            <Link key={link.id} item={link} className={effectiveLinkClass} />
          ))}
        {children}
      </>
    );
  }

  const hasContainer = Boolean(className || asChild || Object.keys(props).length > 0);

  return (
    <FooterContext.Provider value={linksContextValue}>
      {hasContainer ? (
        (() => {
          const Comp = asChild ? Slot : 'div';
          return (
            <Comp data-contextual="footer-links" className={className} {...props}>
              {content}
            </Comp>
          );
        })()
      ) : (
        content
      )}
    </FooterContext.Provider>
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
  const footerContext = useFooter();
  const columnContext = useFooterColumn();

  const effectiveClass = className ?? columnContext?.linkClassName ?? footerContext.linkClassName;
  const targetHref = href || item?.href || '#';
  const isExternal = external ?? item?.external ?? (targetHref.startsWith('http://') || targetHref.startsWith('https://'));
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
        className={effectiveClass}
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
      className={effectiveClass}
      {...props}
    >
      {children}
    </Comp>
  );
}

export function Socials({
  socials: explicitSocials,
  socialClassName,
  children,
  renderItem,
  asChild,
  className,
  ...props
}: FooterSocialsProps) {
  const footerContext = useFooter();
  const resolvedSocials = explicitSocials || footerContext.data?.socials || [];
  const effectiveSocialClass = socialClassName ?? footerContext.socialClassName;

  const socialsContextValue = useMemo<FooterContextValue>(
    () => ({
      ...footerContext,
      socialClassName: effectiveSocialClass,
    }),
    [footerContext, effectiveSocialClass]
  );

  let content: ReactNode;
  if (typeof children === 'function') {
    content = children(resolvedSocials);
  } else if (renderItem) {
    content = (
      <>
        {resolvedSocials.map((item) => renderItem(item))}
        {children}
      </>
    );
  } else if (!children) {
    content = resolvedSocials.map((social) => (
      <SocialLink key={social.id} item={social} className={effectiveSocialClass} />
    ));
  } else {
    content = (
      <>
        {resolvedSocials.length > 0 &&
          resolvedSocials.map((social) => (
            <SocialLink key={social.id} item={social} className={effectiveSocialClass} />
          ))}
        {children}
      </>
    );
  }

  const hasContainer = Boolean(className || asChild || Object.keys(props).length > 0);

  return (
    <FooterContext.Provider value={socialsContextValue}>
      {hasContainer ? (
        (() => {
          const Comp = asChild ? Slot : 'div';
          return (
            <Comp data-contextual="footer-socials" className={className} {...props}>
              {content}
            </Comp>
          );
        })()
      ) : (
        content
      )}
    </FooterContext.Provider>
  );
}

export function SocialLink({
  item,
  href,
  platform,
  children,
  asChild,
  className,
  external,
  ...props
}: FooterSocialLinkProps) {
  const footerContext = useFooter();
  const effectiveSocialClass = className ?? footerContext.socialClassName;
  const targetHref = href || item?.href || '#';
  const resolvedPlatform = platform || item?.platform;
  const isExternal = external ?? (targetHref.startsWith('http://') || targetHref.startsWith('https://') || targetHref.startsWith('//') || true);
  const target = props.target || (isExternal ? '_blank' : undefined);
  const rel = props.rel || (isExternal ? 'noopener noreferrer' : undefined);

  const Comp = asChild ? Slot : 'a';

  if (!children && (item?.label || resolvedPlatform)) {
    return (
      <a
        href={targetHref}
        target={target}
        rel={rel}
        data-contextual="footer-social-link"
        data-platform={resolvedPlatform}
        className={effectiveSocialClass}
        {...props}
      >
        {item?.label || resolvedPlatform}
      </a>
    );
  }

  return (
    <Comp
      href={asChild ? href : targetHref}
      target={asChild ? undefined : target}
      rel={asChild ? undefined : rel}
      data-contextual="footer-social-link"
      data-platform={resolvedPlatform}
      className={effectiveSocialClass}
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

  if (typeof children === 'function') {
    return (
      <Comp
        data-contextual="footer-copyright"
        className={className}
        {...props}
      >
        {children(data)}
      </Comp>
    );
  }

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

export function Bottom({
  linkClassName,
  children,
  asChild,
  className,
  ...props
}: FooterBottomProps) {
  const footerContext = useFooter();
  const effectiveLinkClass = linkClassName ?? footerContext.linkClassName;

  const bottomContextValue = useMemo<FooterContextValue>(
    () => ({
      ...footerContext,
      linkClassName: effectiveLinkClass,
    }),
    [footerContext, effectiveLinkClass]
  );

  const Comp = asChild ? Slot : 'div';

  if (typeof children === 'function') {
    return (
      <FooterContext.Provider value={bottomContextValue}>
        <Comp
          data-contextual="footer-bottom"
          className={className}
          {...props}
        >
          {children(footerContext.data)}
        </Comp>
      </FooterContext.Provider>
    );
  }

  if (!children && (footerContext.data?.copyright || footerContext.data?.legalLinks)) {
    return (
      <FooterContext.Provider value={bottomContextValue}>
        <Comp
          data-contextual="footer-bottom"
          className={className}
          {...props}
        >
          <Copyright />
          {footerContext.data.legalLinks && footerContext.data.legalLinks.length > 0 && (
            <Links links={footerContext.data.legalLinks} />
          )}
        </Comp>
      </FooterContext.Provider>
    );
  }

  return (
    <FooterContext.Provider value={bottomContextValue}>
      <Comp
        data-contextual="footer-bottom"
        className={className}
        {...props}
      >
        {children}
      </Comp>
    </FooterContext.Provider>
  );
}
