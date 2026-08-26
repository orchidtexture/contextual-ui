import {
  Root,
  Brand,
  Description,
  Content,
  Columns,
  Column,
  ColumnTitle,
  Links,
  Link,
  Socials,
  SocialLink,
  Copyright,
  Bottom,
} from './Footer';

export const Footer = {
  Root,
  Brand,
  Description,
  Content,
  Columns,
  Column,
  ColumnTitle,
  Links,
  Link,
  Socials,
  SocialLink,
  Copyright,
  Bottom,
};

export type {
  FooterData,
  FooterColumn,
  FooterLinkItem,
  FooterSocialLink,
  FooterBrand,
  FooterCopyright,
} from './footer.schema';

export * from './footer.types';
export { useFooter, useFooterColumn } from './footer.context';
