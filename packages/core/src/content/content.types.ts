export type {
  ContentBlockRole,
  ParagraphBlock,
  HeadingBlock,
  ContentListItem,
  ListBlock,
  LinkBlock,
  CalloutBlock,
  ContentBlock,
  ContentInput,
  SectionRecord,
  SectionData,
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
