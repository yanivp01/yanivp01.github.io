// astro.config.mjs
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

import icon from 'astro-icon';

export default defineConfig({
  site: 'https://www.yapros.co.uk',
  output: 'static',
  trailingSlash: 'never',
  build: { format: 'file' },
  integrations: [mdx(), sitemap(), icon()],
  redirects: {
    '/bio': '/about',
    '/papers': '/research',
    '/blog': '/essays',
    '/network': '/model',
    '/videos': '/speaking#videos',
    '/sitemap': '/sitemap-index.xml',
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
