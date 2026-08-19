import { z } from 'zod';
import { createId, refersTo } from '@contextual-ui/jsonld-graph-builder';

export interface UIMetadata {
  label?: string;
  widget?: 'text' | 'rich-text' | 'textarea' | 'select' | 'checkbox' | string;
  description?: string;
  placeholder?: string;
  rows?: number;
  [key: string]: any;
}

export function cx<T extends z.ZodTypeAny>(schema: T, meta: UIMetadata): T {
  return schema.describe(JSON.stringify(meta));
}

export function getFieldMetadata(schema: z.ZodTypeAny): UIMetadata | null {
  const desc = schema.description;
  if (!desc) return null;
  try {
    return JSON.parse(desc);
  } catch {
    return { description: desc };
  }
}

export interface JsonLdContext {
  createId: typeof createId;
  refersTo: typeof refersTo;
  [key: string]: any;
}

export interface SchemaSection<T extends z.ZodTypeAny = z.ZodTypeAny> {
  schema: T;
  exportAgentData?: (data: z.infer<T>) => any;
  type?: string;
  generateJsonLd?: (data: z.infer<T>, ctx: JsonLdContext) => any;
}

export type SchemaConfig = Record<string, SchemaSection<any>>;

export interface HydratedContext<TConfig extends SchemaConfig> {
  raw: { [K in keyof TConfig]: z.infer<TConfig[K]['schema']> };
  config: TConfig;
  getAgentData: () => Record<string, any>;
  generateJsonLd: (ctx?: Partial<JsonLdContext>) => Record<string, any>;
}

function isProd() {
  try {
    return typeof globalThis !== 'undefined' && (globalThis as any).process?.env?.NODE_ENV === 'production';
  } catch {
    return false;
  }
}

export function defineSchema<TConfig extends SchemaConfig>(config: TConfig) {
  const createDefaultContext = (ctx?: Partial<JsonLdContext>): JsonLdContext => ({
    createId: ctx?.createId ?? createId,
    refersTo: ctx?.refersTo ?? refersTo,
    ...ctx,
  });

  return {
    config,
    hydrate(rawData: Record<string, any>): HydratedContext<TConfig> {
      const validatedData: Record<string, any> = {};

      for (const [key, section] of Object.entries(config)) {
        const dataToValidate = rawData ? rawData[key] : undefined;
        const result = section.schema.safeParse(dataToValidate);
        if (!result.success) {
          if (!isProd()) {
            console.warn(`[Contextual UI] Hydration validation failed for section "${key}":`, result.error.flatten());
          }
          validatedData[key] = dataToValidate;
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
        generateJsonLd: (ctx?: Partial<JsonLdContext>) => {
          const context = createDefaultContext(ctx);
          const jsonLdData: Record<string, any> = {};
          for (const [key, section] of Object.entries(config)) {
            const data = validatedData[key];
            if (section.generateJsonLd) {
              jsonLdData[key] = section.generateJsonLd(data, context);
            }
          }
          return jsonLdData;
        },
      };
    },
    parse(rawData: Record<string, any>) {
      const validatedData: Record<string, any> = {};
      for (const [key, section] of Object.entries(config)) {
        validatedData[key] = section.schema.parse(rawData[key]);
      }
      return validatedData as { [K in keyof TConfig]: z.infer<TConfig[K]['schema']> };
    },
    getAgentData(validatedData: { [K in keyof TConfig]: z.infer<TConfig[K]['schema']> }) {
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
    generateJsonLd(
      validatedData: { [K in keyof TConfig]: z.infer<TConfig[K]['schema']> },
      ctx?: Partial<JsonLdContext>
    ) {
      const context = createDefaultContext(ctx);
      const jsonLdData: Record<string, any> = {};
      for (const [key, section] of Object.entries(config)) {
        const data = validatedData[key];
        if (section.generateJsonLd) {
          jsonLdData[key] = section.generateJsonLd(data, context);
        }
      }
      return jsonLdData;
    },
  };
}

