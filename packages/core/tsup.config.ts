import { defineConfig } from 'tsup';

const commonConfig = {
  format: ['cjs', 'esm'] as const,
  dts: false,
  splitting: true,
  sourcemap: true,
  clean: true,
  minify: true,
  loader: {
    '.css': 'text',
  },
  external: ['react', 'react-dom', 'next'],
};

export default defineConfig([
  {
    ...commonConfig,
    entry: ['src/index.ts'],
    esbuildOptions(options) {
      options.banner = {
        js: '"use client";',
      };
    },
  },
  {
    ...commonConfig,
    entry: ['src/server/index.ts'],
    clean: false,
    outDir: 'dist/server',
  }
]);
