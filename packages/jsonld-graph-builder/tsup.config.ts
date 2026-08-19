import { defineConfig } from 'tsup';

export default defineConfig({
  format: ['cjs', 'esm'],
  dts: false,
  splitting: false,
  sourcemap: true,
  clean: true,
  minify: true,
  entry: ['src/index.ts'],
});
