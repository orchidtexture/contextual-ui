export { Faq } from './components/faq';
export type { FaqItem, FaqData } from './components/faq/faq.schema';
export type * from './components/faq/faq.types';
export { FaqDataSchema, FaqItemSchema } from './components/faq/faq.schema';
export { generateFaqJsonLd, exportAgentData as exportFaqAgentData, createFaqRegistryItem } from './components/faq/faq.utils';

export { createForm } from './components/form';
export type * from './components/form/form.types';

export { Navbar, useNavbar } from './components/navbar';
export type { NavItem, NavbarData } from './components/navbar/navbar.schema';
export type * from './components/navbar/navbar.types';
export { NavbarDataSchema, NavItemSchema } from './components/navbar/navbar.schema';
export { generateNavbarJsonLd, exportAgentData as exportNavbarAgentData, createNavbarRegistryItem } from './components/navbar/navbar.utils';

export { defineContext } from './registry';
export type { ContextSection, ContextConfig, ContextRegistry } from './registry';
