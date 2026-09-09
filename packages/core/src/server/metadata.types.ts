import type { InferData } from '../registry/defineSchema';

export type TemplateString =
  | { default: string; template: string }
  | { absolute: string; template?: string | null }
  | { absolute: string };

export interface AlternateLinkDescriptor {
  title?: string;
  url: string | URL;
}

export interface MetadataAlternates {
  canonical?: null | string | URL | AlternateLinkDescriptor;
  languages?: Record<string, string | URL | AlternateLinkDescriptor[] | null>;
  media?: Record<string, string | URL | AlternateLinkDescriptor[] | null>;
  types?: Record<string, string | URL | AlternateLinkDescriptor[] | null>;
  [key: string]: any;
}

export interface OGImageDescriptor {
  url: string | URL;
  secureUrl?: string | URL;
  alt?: string;
  type?: string;
  width?: string | number;
  height?: string | number;
}

export type OGImage = string | OGImageDescriptor | URL;

export interface MetadataOpenGraph {
  title?: string | TemplateString;
  description?: string;
  url?: null | string | URL;
  siteName?: string;
  images?: OGImage | Array<OGImage>;
  locale?: string;
  type?: string;
  [key: string]: any;
}

export interface TwitterImageDescriptor {
  url: string | URL;
  secureUrl?: string | URL;
  alt?: string;
  type?: string;
  width?: string | number;
  height?: string | number;
}

export type TwitterImage = string | TwitterImageDescriptor | URL;

export interface MetadataTwitter {
  card?: 'summary' | 'summary_large_image' | 'app' | 'player';
  title?: string | TemplateString;
  description?: null | string;
  site?: null | string;
  creator?: null | string;
  images?: TwitterImage | Array<TwitterImage>;
  [key: string]: any;
}

export interface Metadata {
  metadataBase?: URL | null;
  title?: null | string | TemplateString;
  description?: null | string;
  applicationName?: null | string;
  authors?: null | Array<{ name: string; url?: string | URL }> | { name: string; url?: string | URL };
  generator?: null | string;
  keywords?: null | string | Array<string>;
  referrer?: null | string;
  themeColor?: null | string | Array<{ media?: string; color: string }>;
  colorScheme?: null | string;
  viewport?: null | string;
  creator?: null | string;
  publisher?: null | string;
  robots?: any;
  alternates?: MetadataAlternates | null;
  icons?: any;
  manifest?: null | string | URL;
  openGraph?: MetadataOpenGraph | null;
  twitter?: MetadataTwitter | null;
  other?: Record<string, string | number | Array<string | number>>;
  [key: string]: any;
}

export type GetMetadataOptions<
  TSchema extends { hydrate: (d: any) => any; parse: (d: any) => any; config?: any } = any
> = {
  pageId?: string;
  pageUrl?: string;
  baseUrl?: string;
  dataOverrides?: Partial<InferData<TSchema>>;
  metadataOverrides?: Partial<Metadata>;
};
