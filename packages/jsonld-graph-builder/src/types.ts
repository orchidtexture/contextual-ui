export type DedupeStrategy = 'merge' | 'first-wins' | 'last-wins';

export interface GraphBuilderOptions {
  /** The root domain used to resolve relative @id URIs (e.g. 'https://example.com') */
  baseUrl?: string;
  /** Whether to flatten nested entities into top-level @graph nodes (default: true) */
  flatten?: boolean;
  /** Strategy for handling duplicate @id nodes (default: 'merge') */
  dedupeStrategy?: DedupeStrategy;
}

export type JsonLdValue =
  | string
  | number
  | boolean
  | null
  | JsonLdObject
  | JsonLdValue[];

export interface JsonLdObject {
  '@id'?: string;
  '@type'?: string | string[];
  '@context'?: string | Record<string, any>;
  [key: string]: JsonLdValue | undefined;
}

export interface JsonLdGraphResult {
  '@context': 'https://schema.org';
  '@graph': JsonLdObject[];
}
