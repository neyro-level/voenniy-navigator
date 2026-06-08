import { defineConfig } from 'astro/config';
import icon from 'astro-icon';
import tailwindcss from '@tailwindcss/vite';
import partytown from '@astrojs/partytown';
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
    icon(),
    partytown({
      config: {
        forward: ['ym'],
      },
    }),
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
