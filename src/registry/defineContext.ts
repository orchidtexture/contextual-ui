import { z } from 'zod';

export interface ContextSection<T extends z.ZodTypeAny = z.ZodTypeAny> {
  schema: T;
  data: z.infer<T>;
  exportAgentData?: (data: z.infer<T>) => any;
}

export type ContextConfig = Record<string, ContextSection<any>>;

export interface ContextRegistry<TConfig extends ContextConfig> {
  raw: {
    [K in keyof TConfig]: z.infer<TConfig[K]['schema']>;
  };
  config: TConfig;
  getAgentData: () => Record<string, any>;
}

export function defineContext<TConfig extends ContextConfig>(config: TConfig): ContextRegistry<TConfig> {
  const validatedData: Record<string, any> = {};

  for (const [key, section] of Object.entries(config)) {
    const result = section.schema.safeParse(section.data);
    if (!result.success) {
      // @ts-ignore
      if (typeof process !== 'undefined' && process.env.NODE_ENV !== 'production') {
        console.warn(`[Contextual UI] Context validation failed for section "${key}":`, result.error.flatten());
      }
      validatedData[key] = section.data;
    } else {
      validatedData[key] = result.data;
    }
  }

  return {
    raw: validatedData as { [K in keyof TConfig]: z.infer<TConfig[K]['schema']> },
    config,
    getAgentData: () => {
      const agentData: Record<string, any> = {};
      for (const [key, section] of Object.entries(config)) {
        const data = validatedData[key];
        if (section.exportAgentData) {
          agentData[key] = section.exportAgentData(data);
        } else {
          agentData[key] = data;
        }
      }
      return agentData;
    },
  };
}
