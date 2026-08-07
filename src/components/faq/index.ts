import { Root, Item, Trigger, Content } from './Faq';
import { FaqItemSchema, FaqDataSchema } from './faq.schema';
import { generateFaqJsonLd, exportAgentData } from './faq.utils';

export const Faq = {
  Root,
  Item,
  Trigger,
  Content,
};

export {
  FaqItemSchema,
  FaqDataSchema,
  generateFaqJsonLd,
  exportAgentData,
};

export * from './faq.types';
