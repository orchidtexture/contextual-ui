import { defineConfig } from 'tsup';

export default defineConfig({
  format: ['cjs', 'esm'] as const,
  entry: ['src/index.ts'],
  dts: false,
  splitting: true,
  sourcemap: true,
  clean: true,
  minify: true,
  external: ['zod', '@contextual-ui/core'],
});
