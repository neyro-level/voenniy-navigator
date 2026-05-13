import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://voenniy-navigator.vercel.app', // TODO: заменить на реальный домен
  trailingSlash: 'always',
  integrations: [
    react(),
    sitemap({
      filter: (page) =>
        !page.includes('/thanks/') &&
        !page.includes('/404/') &&
        !page.includes('/video/') &&
        !page.includes('/bonus/') &&
        !page.includes('/prezentaciya/'),
    }),
  ],
  output: 'static',
  vite: {
    plugins: [tailwindcss()],
  },
});
