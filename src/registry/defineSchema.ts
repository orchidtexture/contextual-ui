import { z } from 'zod';

export interface SchemaSection<T extends z.ZodTypeAny = z.ZodTypeAny> {
  schema: T;
  exportAgentData?: (data: z.infer<T>) => any;
  type?: string;
  generateJsonLd?: (data: z.infer<T>) => any;
}

export type SchemaConfig = Record<string, SchemaSection<any>>;

export type Connector<TConfig extends SchemaConfig> = 
  | (() => Promise<{ [K in keyof TConfig]?: z.infer<TConfig[K]['schema']> }>)
  | (() => { [K in keyof TConfig]?: z.infer<TConfig[K]['schema']> });

export interface ServerContext<TConfig extends SchemaConfig> {
  fetchData: () => Promise<{ [K in keyof TConfig]: z.infer<TConfig[K]['schema']> }>;
  config: TConfig;
  getAgentData: () => Promise<Record<string, any>>;
}

export interface HydratedContext<TConfig extends SchemaConfig> {
  raw: { [K in keyof TConfig]: z.infer<TConfig[K]['schema']> };
  config: TConfig;
  getAgentData: () => Record<string, any>;
}

function isProd() {
  try {
    return typeof globalThis !== 'undefined' && (globalThis as any).process?.env?.NODE_ENV === 'production';
  } catch {
    return false;
  }
}

export function defineSchema<TConfig extends SchemaConfig>(config: TConfig) {
  return {
    config,
    withConnector(connector: Connector<TConfig>): ServerContext<TConfig> {
      return {
        config,
        async fetchData() {
          const rawPayload = await connector();
          const validatedData: Record<string, any> = {};

          for (const [key, section] of Object.entries(config)) {
            const dataToValidate = rawPayload[key];
            const result = section.schema.safeParse(dataToValidate);
            if (!result.success) {
              if (!isProd()) {
                console.warn(`[Contextual UI] Validation failed for section "${key}":`, result.error.flatten());
              }
              validatedData[key] = dataToValidate;
            } else {
              validatedData[key] = result.data;
            }
          }
          return validatedData as { [K in keyof TConfig]: z.infer<TConfig[K]['schema']> };
        },
        async getAgentData() {
          const data = await this.fetchData();
          const agentData: Record<string, any> = {};
          for (const [key, section] of Object.entries(config)) {
            const sectionData = data[key];
            if (section.exportAgentData) {
              agentData[key] = section.exportAgentData(sectionData);
            } else {
              agentData[key] = sectionData;
            }
          }
          return agentData;
        },
      };
    },
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
      };
    },
  };
}

export function staticConnector<TConfig extends SchemaConfig>(
  data: { [K in keyof TConfig]?: z.infer<TConfig[K]['schema']> }
): Connector<TConfig> {
  return () => data;
}
