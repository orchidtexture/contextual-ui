import { ReactNode } from 'react';
import { NavbarData } from './navbar.schema';

export interface NavbarRootProps {
  data?: NavbarData;
  children: ReactNode;
  className?: string;
  sticky?: boolean;
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

export interface NavbarContextValue {
  data?: NavbarData;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  toggle: () => void;
}
