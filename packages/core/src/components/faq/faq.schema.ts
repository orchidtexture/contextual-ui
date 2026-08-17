import { z } from 'zod';

export const FaqItemSchema = z.object({
  id: z.string(),
  question: z.string().min(1, "Question cannot be empty"),
  answer: z.string().min(1, "Answer cannot be empty"),
});

export const FaqDataSchema = z.array(FaqItemSchema);

export type FaqItem = z.infer<typeof FaqItemSchema>;
export type FaqData = z.infer<typeof FaqDataSchema>;
