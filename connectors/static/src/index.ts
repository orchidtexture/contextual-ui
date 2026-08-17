import { z } from 'zod';
import { SchemaConfig } from '@contextual-ui/core';

export function staticConnector<TConfig extends SchemaConfig>(
  data: { [K in keyof TConfig]?: z.infer<TConfig[K]['schema']> }
) {
  return {
    async fetchData() {
      return data;
    },
  };
}
