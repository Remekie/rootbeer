import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Static-first: ships zero client JS by default, renders all copy and JSON-LD
// at build time so every crawler and answer engine sees the full text.
export default defineConfig({
  site: 'https://rootbeervodka.com',
  integrations: [sitemap()],
  build: { inlineStylesheets: 'auto' },
  image: { responsiveStyles: true },
});
