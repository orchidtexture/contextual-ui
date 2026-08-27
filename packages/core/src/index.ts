export { ContextualSite, ContextualSiteContext, useContextualSiteContext, useIsContextualSite } from './components/site';
export type { ContextualSiteProps, ContextualSiteOptions, ContextualSiteContextValue } from './components/site';

export { Faq } from './components/faq';
export type { FaqItem, FaqData } from './components/faq/faq.schema';
export type * from './components/faq/faq.types';
export { FaqDataSchema, FaqItemSchema } from './components/faq/faq.schema';
export { generateFaqJsonLd, exportAgentData as exportFaqAgentData, faqRegistry } from './components/faq/faq.utils';

export { Breadcrumb } from './components/breadcrumb';
export type { BreadcrumbItem, BreadcrumbData } from './components/breadcrumb/breadcrumb.schema';
export type * from './components/breadcrumb/breadcrumb.types';
export { BreadcrumbDataSchema, BreadcrumbItemSchema } from './components/breadcrumb/breadcrumb.schema';
export { generateBreadcrumbJsonLd, exportAgentData as exportBreadcrumbAgentData, breadcrumbRegistry } from './components/breadcrumb/breadcrumb.utils';

export { createForm } from './components/form';
export type * from './components/form/form.types';

export { Navbar, useNavbar } from './components/navbar';
export type { NavItem, NavbarData } from './components/navbar/navbar.schema';
export type * from './components/navbar/navbar.types';
export { NavbarDataSchema, NavItemSchema } from './components/navbar/navbar.schema';
export { generateNavbarJsonLd, exportAgentData as exportNavbarAgentData, navbarRegistry } from './components/navbar/navbar.utils';

export { Footer, useFooter, useFooterColumn } from './components/footer';
export type {
  FooterData,
  FooterColumn,
  FooterLinkItem,
  FooterSocialLink,
  FooterBrand,
  FooterCopyright,
} from './components/footer/footer.schema';
export type * from './components/footer/footer.types';
export {
  FooterDataSchema,
  FooterColumnSchema,
  FooterLinkItemSchema,
  FooterSocialLinkSchema,
  FooterBrandSchema,
  FooterCopyrightSchema,
} from './components/footer/footer.schema';
export { generateFooterJsonLd, exportAgentData as exportFooterAgentData, footerRegistry } from './components/footer/footer.utils';

export type { WebsiteData } from './components/website/website.schema';
export { WebsiteDataSchema } from './components/website/website.schema';
export { generateWebsiteJsonLd, exportAgentData as exportWebsiteAgentData, websiteRegistry } from './components/website/website.utils';

export type { OrganizationData } from './components/organization/organization.schema';
export { OrganizationDataSchema } from './components/organization/organization.schema';
export { generateOrganizationJsonLd, exportAgentData as exportOrganizationAgentData, organizationRegistry } from './components/organization/organization.utils';

export { defineSchema, cx, getFieldMetadata } from './registry';
export type { SchemaSection, SchemaConfig, HydratedContext, UIMetadata, JsonLdContext } from './registry';

export { buildGraph, createId, refersTo } from 'jsonld-graph-builder';
export type {
  GraphBuilderOptions,
  DedupeStrategy,
  JsonLdObject,
  JsonLdValue,
  JsonLdGraphResult,
} from 'jsonld-graph-builder';

export type { Thing, WithContext, Graph } from 'schema-dts';


