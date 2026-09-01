import { ReactNode } from 'react';
import { NavbarData, NavItem } from './navbar.schema';

export interface NavbarRootProps {
  data?: NavbarData;
  sectionKey?: string;
  linkClassName?: string;
  children?: ReactNode;
  className?: string;
  sticky?: boolean;
  injectJsonLd?: boolean;
}

export interface NavbarBrandProps extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'children'> {
  children?: ReactNode | ((brand?: NavbarData['brand']) => ReactNode);
  className?: string;
  asChild?: boolean;
  href?: string;
}

export interface NavbarLinksProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> {
  links?: NavItem[];
  linkClassName?: string;
  children?: ReactNode | ((links: NavItem[]) => ReactNode);
  renderItem?: (item: NavItem) => ReactNode;
  className?: string;
  asChild?: boolean;
}

export interface NavbarToggleProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children?: ReactNode;
  className?: string;
  asChild?: boolean;
}

export interface NavbarMenuProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> {
  children?: ReactNode | ((data?: NavbarData) => ReactNode);
  linkClassName?: string;
  className?: string;
  asChild?: boolean;
}

export interface NavbarLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  item?: NavItem;
  href?: string;
  children?: ReactNode;
  asChild?: boolean;
  className?: string;
  external?: boolean;
}

export interface NavbarContextValue {
  data?: NavbarData;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  toggle: () => void;
  linkClassName?: string;
}

