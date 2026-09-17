export type {
  ContentBlockRole,
  ParagraphBlock,
  HeadingBlock,
  ContentListItem,
  ListBlock,
  LinkBlock,
  CalloutBlock,
  CodeBlock,
  ContentBlock,
  ContentInput,
  SectionRecord,
  SectionData,
  CollectionItem,
  CollectionRecord,
  CollectionData,
} from './content.schema';

export interface NormalizedSection {
  id: string;
  pageId?: string;
  title?: string;
  subtitle?: string;
  description?: string;
  anchor?: string;
  blocks: import('./content.schema').ContentBlock[];
  plainText: string;
  order?: number;
  about?: string[];
  mainEntity?: string[];
  inLanguage?: string;
  type: string;
}

export interface NormalizedCollectionItem {
  id: string;
  title?: string;
  name?: string;
  description?: string;
  blocks: import('./content.schema').ContentBlock[];
  plainText: string;
  url?: string;
  order?: number;
  item?: string | Record<string, any>;
  type: string;
}

export interface NormalizedCollection {
  id: string;
  pageId?: string;
  title?: string;
  name?: string;
  description?: string;
  ordered: boolean;
  items: NormalizedCollectionItem[];
  type: string;
}
