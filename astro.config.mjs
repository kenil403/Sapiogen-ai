import { defineConfig } from 'astro/config';
import node from '@astrojs/node';

// https://astro.build/config
export default defineConfig({
  site: process.env.PUBLIC_SITE_URL || 'https://sapiogenai.com',
  output: 'server',
  adapter: node({ mode: 'standalone' }),
  server: {
    port: Number(process.env.PORT) || 4321,
    host: true
  },
  build: {
    inlineStylesheets: 'auto'
  },
  compressHTML: true,
  prefetch: {
    prefetchAll: true,
    defaultStrategy: 'viewport'
  },
  vite: {
    ssr: {
      noExternal: ['isomorphic-dompurify']
    }
  }
});
