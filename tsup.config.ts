import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts', 'src/server/index.ts', 'src/dashboard/index.ts'],
  format: ['cjs', 'esm'],
  dts: false,
  splitting: true,
  sourcemap: true,
  clean: true,
  minify: true,
  loader: {
    '.css': 'text',
  },
  external: ['react', 'react-dom', 'next'],
});
