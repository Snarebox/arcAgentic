import path from 'path';
import { fileURLToPath } from 'url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import mdx from '@mdx-js/rollup';
import remarkGfm from 'remark-gfm';
import remarkFrontmatter from 'remark-frontmatter';
import rehypeHighlight from 'rehype-highlight';
import rehypeSlug from 'rehype-slug';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig(() => ({
  // For GitHub Pages project sites, assets must be served from /<repo>/.
  // Set BASE_PATH in CI (or locally) to override.
  base:
    process.env['BASE_PATH'] ??
    (process.env['GITHUB_ACTIONS'] && process.env['GITHUB_REPOSITORY']
      ? `/${process.env['GITHUB_REPOSITORY'].split('/')[1] ?? ''}/`
      : '/'),
  plugins: [
    react(),
    mdx({
      remarkPlugins: [remarkGfm, remarkFrontmatter],
      // Note: we keep rehypeSlug so headings get stable IDs, but
      // we intentionally disable rehype-autolink-headings. With
      // hash-based routing (`#/docs/...`), auto-linked headings
      // change the hash to just `#id`, which navigates away from
      // the docs route and back to the app landing page.
      // If you want a heading to be a link, add it manually in MDX.
      rehypePlugins: [rehypeHighlight, rehypeSlug],
    }),
  ],
  resolve: {
    alias: {
      '@minimal-rpg/ui': path.resolve(__dirname, '../ui/src'),
      '@minimal-rpg/schemas': path.resolve(__dirname, '../schemas/src'),
      '@minimal-rpg/generator': path.resolve(__dirname, '../generator/src'),
      '@minimal-rpg/utils': path.resolve(__dirname, '../utils/src'),
    },
    // Prevent duplicate React copies when resolving workspace packages.
    dedupe: ['react', 'react-dom'],
  },
  server: {
    host: '0.0.0.0',
    port: 5173,
    proxy: {
      '/characters': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
      '/settings': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
      '/sessions': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
    },
  },
  build: {
    rollupOptions: {
      onwarn(warning, warn) {
        // @xyflow/react ships ESM with a "use client" directive (Next.js hint).
        // Rollup warns during bundling even though it's harmless for our build.
        if (
          warning?.code === 'MODULE_LEVEL_DIRECTIVE' &&
          typeof warning.message === 'string' &&
          warning.message.includes('"use client"')
        ) {
          return;
        }

        warn(warning);
      },
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) return;

          // NOTE: be very specific here.
          // A naive `id.includes('/react/')` matches packages like `@xyflow/react` and can
          // create circular chunk dependencies (which can yield undefined React exports).
          const isReactRuntime =
            id.includes('/node_modules/react/') ||
            id.includes('/node_modules/react-dom/') ||
            id.includes('/node_modules/scheduler/') ||
            id.includes('/node_modules/use-sync-external-store/');

          if (isReactRuntime) return 'vendor-react';
          if (id.includes('/@xyflow/')) return 'vendor-xyflow';
          if (id.includes('/@tanstack/')) return 'vendor-tanstack';
          if (id.includes('/zustand/')) return 'vendor-zustand';

          return 'vendor';
        },
      },
    },
  },
}));
