'use client';

import { useId, useMemo, isValidElement, cloneElement } from 'react';
import { Slot } from '@radix-ui/react-slot';
import { SectionContext, useSectionContext } from './section.context';
import { Content } from '../content/Content';
import type {
  SectionRootProps,
  SectionTitleProps,
  SectionSubtitleProps,
  SectionDescriptionProps,
  SectionContentProps,
} from './section.types';

export function Root({
  data,
  id: explicitId,
  pageId: explicitPageId,
  title: explicitTitle,
  subtitle: explicitSubtitle,
  description: explicitDescription,
  anchor: explicitAnchor,
  asChild = false,
  className,
  children,
  'aria-labelledby': explicitLabelledBy,
  ...props
}: SectionRootProps) {
  const generatedId = useId();

  const id = explicitId || data?.id;
  const pageId = explicitPageId || data?.pageId;
  const title = explicitTitle || data?.title;
  const subtitle = explicitSubtitle || data?.subtitle;
  const description = explicitDescription || data?.description;
  const anchor = explicitAnchor || data?.anchor || id;

  const headingId = explicitLabelledBy || (id ? `${id}-heading` : `section-heading-${generatedId}`);

  const contextValue = useMemo(
    () => ({
      data,
      id,
      anchor,
      headingId,
      pageId,
      title,
      subtitle,
      description,
    }),
    [data, id, anchor, headingId, pageId, title, subtitle, description]
  );

  const Comp = asChild ? Slot : 'section';

  return (
    <SectionContext.Provider value={contextValue}>
      <Comp
        id={anchor}
        aria-labelledby={headingId}
        data-contextual="section-root"
        className={className}
        {...props}
      >
        {children}
      </Comp>
    </SectionContext.Provider>
  );
}

export function Title({
  as: Tag = 'h2',
  asChild = false,
  className,
  id: explicitId,
  children,
  ...props
}: SectionTitleProps) {
  const context = useSectionContext();
  const headingId = explicitId || context?.headingId;
  const contextTitle = context?.title ?? context?.data?.title;

  if (asChild && isValidElement(children)) {
    const childContent = (children.props as any)?.children ?? contextTitle;
    return (
      <Slot
        id={headingId}
        data-contextual="section-title"
        className={className}
        {...props}
      >
        {cloneElement(children, {}, childContent)}
      </Slot>
    );
  }

  const displayTitle = children ?? contextTitle;

  if (!displayTitle) {
    return null;
  }

  const Comp = Tag;

  return (
    <Comp
      id={headingId}
      data-contextual="section-title"
      className={className}
      {...props}
    >
      {displayTitle}
    </Comp>
  );
}

export function Subtitle({
  asChild = false,
  className,
  children,
  ...props
}: SectionSubtitleProps) {
  const context = useSectionContext();
  const displaySubtitle = children ?? context?.subtitle ?? context?.data?.subtitle;

  if (!displaySubtitle) {
    return null;
  }

  const Comp = asChild ? Slot : 'p';

  return (
    <Comp
      data-contextual="section-subtitle"
      className={className}
      {...props}
    >
      {displaySubtitle}
    </Comp>
  );
}

export function Description({
  asChild = false,
  className,
  children,
  ...props
}: SectionDescriptionProps) {
  const context = useSectionContext();
  const displayDescription = children ?? context?.description ?? context?.data?.description;

  if (!displayDescription) {
    return null;
  }

  const Comp = asChild ? Slot : 'p';

  return (
    <Comp
      data-contextual="section-description"
      className={className}
      {...props}
    >
      {displayDescription}
    </Comp>
  );
}

export function SectionContent({
  data: explicitData,
  components,
  asChild = false,
  className,
  children,
  ...props
}: SectionContentProps) {
  const context = useSectionContext();
  const contentData = explicitData ?? context?.data?.content;

  if (!contentData && !children) {
    return null;
  }

  if (children) {
    const Comp = asChild ? Slot : 'div';
    return (
      <Comp data-contextual="section-content" className={className} {...props}>
        {children}
      </Comp>
    );
  }

  return (
    <Content
      data={contentData}
      components={components}
      asChild={asChild}
      data-contextual="section-content"
      className={className}
      {...props}
    />
  );
}

export const Section = {
  Root,
  Title,
  Subtitle,
  Description,
  Content: SectionContent,
};
