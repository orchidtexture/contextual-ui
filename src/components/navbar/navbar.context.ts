import { createContext, useContext } from 'react';
import { NavbarContextValue } from './navbar.types';

export const NavbarContext = createContext<NavbarContextValue | null>(null);

export function useNavbar() {
  const context = useContext(NavbarContext);
  if (!context) {
    throw new Error('Navbar components must be used within a Navbar.Root');
  }
  return context;
}
