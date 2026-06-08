import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://voen-navigator.ru',
  trailingSlash: 'always',
  prefetch: {
    prefetchAll: true,
    defaultStrategy: 'hover',
  },
  integrations: [
    react(),
    sitemap({
      filter: (page) =>
        !page.includes('/thanks/') &&
        !page.includes('/404/') &&
        !page.includes('/podbor/') &&
        !page.includes('/bonus/') &&
        !page.includes('/prezentaciya/'),
    }),
  ],
  output: 'static',
  vite: {
    plugins: [tailwindcss()],
  },
});
