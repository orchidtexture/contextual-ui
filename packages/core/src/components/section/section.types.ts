import React from 'react';
import type { SectionRecord, ContentInput } from '../../content/content.schema';
import type { ContentComponentOverrides } from '../content/content.types';

export interface SectionRootProps extends React.HTMLAttributes<HTMLElement> {
  data?: SectionRecord;
  id?: string;
  pageId?: string;
  title?: string;
  subtitle?: string;
  description?: string;
  anchor?: string;
  asChild?: boolean;
}

export interface SectionTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  asChild?: boolean;
}

export interface SectionSubtitleProps extends React.HTMLAttributes<HTMLParagraphElement> {
  asChild?: boolean;
}

export interface SectionDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {
  asChild?: boolean;
}

export interface SectionContentProps extends React.HTMLAttributes<HTMLDivElement> {
  data?: ContentInput;
  components?: ContentComponentOverrides;
  asChild?: boolean;
}
