export * from './createRouteHandler';
export * from '../registry';
export { FaqDataSchema, FaqItemSchema } from '../components/faq/faq.schema';
export { generateFaqJsonLd, exportAgentData as exportFaqAgentData, faqRegistry } from '../components/faq/faq.utils';
export { NavbarDataSchema, NavItemSchema } from '../components/navbar/navbar.schema';
export { exportAgentData as exportNavbarAgentData, navbarRegistry } from '../components/navbar/navbar.utils';
