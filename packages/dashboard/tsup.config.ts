import { defineConfig } from 'tsup';

export default defineConfig({
  format: ['cjs', 'esm'] as const,
  entry: ['src/index.ts'],
  dts: false,
  splitting: true,
  sourcemap: true,
  clean: true,
  minify: true,
  loader: {
    '.css': 'text',
  },
  external: ['react', 'react-dom', 'next', '@contextual-ui/core'],
  esbuildOptions(options) {
    options.banner = {
      js: '"use client";',
    };
  },
});
