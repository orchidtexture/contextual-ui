import { ReactNode } from 'react';
import {
  FooterData,
  FooterColumn,
  FooterLinkItem,
  FooterSocialLink,
  FooterBrand,
} from './footer.schema';

export interface FooterRootProps extends React.HTMLAttributes<HTMLElement> {
  data?: FooterData;
  sectionKey?: string;
  linkClassName?: string;
  socialClassName?: string;
  titleClassName?: string;
  children?: ReactNode;
  className?: string;
  injectJsonLd?: boolean;
}

export interface FooterBrandProps extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'children'> {
  children?: ReactNode | ((brand?: FooterBrand) => ReactNode);
  className?: string;
  asChild?: boolean;
  href?: string;
}

export interface FooterDescriptionProps extends Omit<React.HTMLAttributes<HTMLParagraphElement>, 'children'> {
  children?: ReactNode | ((brand?: FooterBrand) => ReactNode);
  className?: string;
  asChild?: boolean;
}

export interface FooterColumnsProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> {
  columns?: FooterColumn[];
  linkClassName?: string;
  titleClassName?: string;
  children?: ReactNode | ((columns: FooterColumn[]) => ReactNode);
  renderItem?: (column: FooterColumn) => ReactNode;
  className?: string;
  asChild?: boolean;
}

export interface FooterColumnProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> {
  id?: string;
  column?: FooterColumn;
  linkClassName?: string;
  titleClassName?: string;
  children?: ReactNode | ((column?: FooterColumn) => ReactNode);
  className?: string;
  asChild?: boolean;
}

export interface FooterColumnTitleProps extends Omit<React.HTMLAttributes<HTMLHeadingElement>, 'children'> {
  children?: ReactNode | ((title?: string) => ReactNode);
  className?: string;
  asChild?: boolean;
}

export interface FooterLinksProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> {
  columnId?: string;
  links?: FooterLinkItem[];
  linkClassName?: string;
  children?: ReactNode | ((links: FooterLinkItem[]) => ReactNode);
  renderItem?: (item: FooterLinkItem) => ReactNode;
  className?: string;
  asChild?: boolean;
}

export interface FooterLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  item?: FooterLinkItem;
  href?: string;
  children?: ReactNode;
  className?: string;
  asChild?: boolean;
  external?: boolean;
}

export interface FooterSocialsProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> {
  socials?: FooterSocialLink[];
  socialClassName?: string;
  children?: ReactNode | ((socials: FooterSocialLink[]) => ReactNode);
  renderItem?: (item: FooterSocialLink) => ReactNode;
  className?: string;
  asChild?: boolean;
}

export interface FooterSocialLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  item?: FooterSocialLink;
  href?: string;
  platform?: string;
  children?: ReactNode;
  className?: string;
  asChild?: boolean;
  external?: boolean;
}

export interface FooterCopyrightProps extends Omit<React.HTMLAttributes<HTMLParagraphElement>, 'children'> {
  children?: ReactNode | ((data?: FooterData) => ReactNode);
  className?: string;
  asChild?: boolean;
  holder?: string;
  year?: number | string;
}

export interface FooterBottomProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> {
  linkClassName?: string;
  children?: ReactNode | ((data?: FooterData) => ReactNode);
  className?: string;
  asChild?: boolean;
}

export interface FooterContextValue {
  data?: FooterData;
  getColumnData: (id: string) => FooterColumn | undefined;
  linkClassName?: string;
  socialClassName?: string;
  titleClassName?: string;
}

export interface FooterColumnContextValue {
  column?: FooterColumn;
  linkClassName?: string;
  titleClassName?: string;
}
