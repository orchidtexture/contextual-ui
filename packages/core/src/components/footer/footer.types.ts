import { ReactNode } from 'react';
import {
  FooterData,
  FooterColumn,
  FooterLinkItem,
  FooterSocialLink,
} from './footer.schema';

export interface FooterRootProps {
  data?: FooterData;
  sectionKey?: string;
  children: ReactNode;
  className?: string;
  injectJsonLd?: boolean;
  [key: string]: any;
}

export interface FooterBrandProps {
  children?: ReactNode;
  className?: string;
  asChild?: boolean;
  href?: string;
  [key: string]: any;
}

export interface FooterDescriptionProps {
  children?: ReactNode;
  className?: string;
  asChild?: boolean;
  [key: string]: any;
}

export interface FooterContentProps {
  children: ReactNode;
  className?: string;
  asChild?: boolean;
  [key: string]: any;
}

export interface FooterColumnsProps {
  children?: ReactNode;
  className?: string;
  asChild?: boolean;
  [key: string]: any;
}

export interface FooterColumnProps {
  id?: string;
  column?: FooterColumn;
  children?: ReactNode;
  className?: string;
  asChild?: boolean;
  [key: string]: any;
}

export interface FooterColumnTitleProps {
  children?: ReactNode;
  className?: string;
  asChild?: boolean;
  [key: string]: any;
}

export interface FooterLinksProps {
  columnId?: string;
  links?: FooterLinkItem[];
  children?: ReactNode;
  className?: string;
  asChild?: boolean;
  [key: string]: any;
}

export interface FooterLinkProps {
  item?: FooterLinkItem;
  href?: string;
  children?: ReactNode;
  className?: string;
  asChild?: boolean;
  external?: boolean;
  [key: string]: any;
}

export interface FooterSocialsProps {
  children?: ReactNode;
  className?: string;
  asChild?: boolean;
  [key: string]: any;
}

export interface FooterSocialLinkProps {
  item?: FooterSocialLink;
  href?: string;
  platform?: string;
  children?: ReactNode;
  className?: string;
  asChild?: boolean;
  [key: string]: any;
}

export interface FooterCopyrightProps {
  children?: ReactNode;
  className?: string;
  asChild?: boolean;
  holder?: string;
  year?: number | string;
  [key: string]: any;
}

export interface FooterBottomProps {
  children: ReactNode;
  className?: string;
  asChild?: boolean;
  [key: string]: any;
}

export interface FooterContextValue {
  data?: FooterData;
  getColumnData: (id: string) => FooterColumn | undefined;
}

export interface FooterColumnContextValue {
  column?: FooterColumn;
}
