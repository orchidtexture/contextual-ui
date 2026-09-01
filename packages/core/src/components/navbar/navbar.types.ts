import { ReactNode } from 'react';
import { NavbarData, NavItem } from './navbar.schema';

export interface NavbarRootProps {
  data?: NavbarData;
  sectionKey?: string;
  children: ReactNode;
  className?: string;
  sticky?: boolean;
  injectJsonLd?: boolean;
}

export interface NavbarBrandProps {
  children?: ReactNode;
  className?: string;
  asChild?: boolean;
  href?: string;
  [key: string]: any;
}

export interface NavbarContentProps {
  children: ReactNode;
  className?: string;
}

export interface NavbarToggleProps {
  children?: ReactNode;
  className?: string;
  asChild?: boolean;
}

export interface NavbarMenuProps {
  children: ReactNode;
  className?: string;
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
}
