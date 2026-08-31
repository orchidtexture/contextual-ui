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

export interface EntryPointOptions {
  urlTemplate: string;
  httpMethod?: 'POST' | 'GET' | 'PUT' | 'PATCH' | string;
  contentType?: string;
  encodingType?: string;
  actionPlatform?: string | string[];
}

export interface PropertyValueSpecOptions {
  valueName: string;
  valueRequired?: boolean;
  valuePattern?: string;
  valueMinLength?: number;
  valueMaxLength?: number;
  minValue?: number;
  maxValue?: number;
  defaultValue?: any;
  description?: string;
  valueOption?: Array<string | { name: string; value: string }>;
  readonlyValue?: boolean;
  multipleValues?: boolean;
}

export interface PotentialActionOptions {
  id?: string;
  actionType?: string;
  name?: string;
  description?: string;
  target: string | EntryPointOptions;
  object?: PropertyValueSpecOptions[];
  result?: any;
  isPartOf?: { '@id': string } | string;
}

